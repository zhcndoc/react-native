import {getCoreBranchNameForCurrentVersion} from '@site/src/getCoreBranchNameForCurrentVersion';
import {getCurrentVersion} from '@site/src/getCurrentVersion';
import CodeBlock from '@theme/CodeBlock';

# 跨平台原生模块（C++）

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

用 C++ 编写模块是共享 Android 和 iOS 间平台无关代码的最佳方式。通过纯 C++ 模块，您只需编写一次逻辑，即可在所有平台上重用，而无需编写平台特定代码。

在本指南中，我们将逐步创建一个纯 C++ Turbo 原生模块：

1. 创建 JS 规范文件  
2. 配置 Codegen 生成脚手架  
3. 实现原生逻辑  
4. 在 Android 和 iOS 应用中注册模块  
5. 在 JS 中测试你的修改  

本指南后续假设你已经通过执行以下命令创建了你的应用：

<CodeBlock language="bash" title="shell">
{`npx @react-native-community/cli@latest init SampleApp --version ${getCurrentVersion()}`}
</CodeBlock>

## 1. 创建 JS 规范文件

纯 C++ Turbo 原生模块即 Turbo 原生模块。它们需要一个规范文件（也称为 spec 文件），以便 Codegen 为我们生成脚手架代码。规范文件也是我们在 JS 中访问 Turbo 原生模块的接口定义。

规范文件需使用有类型的 JS 方言编写。React Native 当前支持 Flow 或 TypeScript。

1. 在你应用根目录下，创建一个名为 `specs` 的新文件夹。  
2. 创建一个文件 `NativeSampleModule.ts` 并写入以下代码：

:::warning
所有 Native Turbo Module 规范文件必须以 `Native` 为前缀，否则 Codegen 会忽略它们。
:::

<Tabs groupId="tnm-specs" queryString defaultValue={constants.defaultJavaScriptSpecLanguages} values={constants.javaScriptSpecLanguages}>
<TabItem value="flow">

```ts title="specs/NativeSampleModule.ts"
// @flow
import type {TurboModule} from 'react-native'
import { TurboModuleRegistry } from "react-native";

export interface Spec extends TurboModule {
  +reverseString: (input: string) => string;
}

export default (TurboModuleRegistry.getEnforcing<Spec>(
  "NativeSampleModule"
): Spec);
```

</TabItem>
<TabItem value="typescript">

```ts title="specs/NativeSampleModule.ts"
import {TurboModule, TurboModuleRegistry} from 'react-native';

export interface Spec extends TurboModule {
  readonly reverseString: (input: string) => string;
}

export default TurboModuleRegistry.getEnforcing<Spec>(
  'NativeSampleModule',
);
```

</TabItem>
</Tabs>

## 2. 配置 Codegen

下一步是在你的 `package.json` 中配置 [Codegen](what-is-codegen.mdx)。将文件更新为包含：

```json title="package.json"
     "start": "react-native start",
     "test": "jest"
   },
   // highlight-add-start
   "codegenConfig": {
     "name": "AppSpecs",
     "type": "modules",
     "jsSrcsDir": "specs",
     "android": {
       "javaPackageName": "com.sampleapp.specs"
     }
   },
   // highlight-add-end
   "dependencies": {
```

该配置告知 Codegen 在 `specs` 文件夹中查找规范文件，仅为 `modules` 类型生成代码，并将生成代码命名空间设为 `AppSpecs`。

## 3. 编写原生代码

通过编写 C++ Turbo 原生模块，实现 Android 和 iOS 代码共享。因此我们只需编写一次代码，接着配置各平台以集成该 C++ 代码。

1. 在 `android` 和 `ios` 文件夹同级创建一个 `shared` 文件夹。  
2. 在 `shared` 目录下新建 `NativeSampleModule.h`，内容如下：

   ```cpp title="shared/NativeSampleModule.h"
   #pragma once

   #include <AppSpecsJSI.h>

   #include <memory>
   #include <string>

   namespace facebook::react {

   class NativeSampleModule : public NativeSampleModuleCxxSpec<NativeSampleModule> {
   public:
     NativeSampleModule(std::shared_ptr<CallInvoker> jsInvoker);

     std::string reverseString(jsi::Runtime& rt, std::string input);
   };

   } // namespace facebook::react

   ```

3. 在 `shared` 目录下新建 `NativeSampleModule.cpp`，内容如下：

   ```cpp title="shared/NativeSampleModule.cpp"
   #include "NativeSampleModule.h"

   namespace facebook::react {

   NativeSampleModule::NativeSampleModule(std::shared_ptr<CallInvoker> jsInvoker)
       : NativeSampleModuleCxxSpec(std::move(jsInvoker)) {}

   std::string NativeSampleModule::reverseString(jsi::Runtime& rt, std::string input) {
     return std::string(input.rbegin(), input.rend());
   }

   } // namespace facebook::react
   ```

解读这两个文件：

- `NativeSampleModule.h` 是纯 C++ TurboModule 的头文件。它通过 `#include` 引入由 Codegen 生成的包含接口和基类的规范头文件。  
- 模块处于 `facebook::react` 命名空间，方便访问该命名空间中的所有类型。  
- `NativeSampleModule` 类继承自 `NativeSampleModuleCxxSpec`，它负责生成连接代码和基础实现，使该类表现为一个 Turbo 原生模块。  
- 构造函数接受一个指向 `CallInvoker` 的共享指针，用于必要时与 JS 通信；同时需实现接口中声明的函数。  
- `NativeSampleModule.cpp` 文件实现了构造函数及在规范中声明的方法。

## 4. 在平台注册模块

以下步骤将帮助你在两端平台注册该模块，唯一实现从 JS 调用原生代码的关键环节。

这也是我们唯一需要编写平台特定代码的地方。

### Android

为保证 Android 应用能构建 C++ Turbo 原生模块，我们需要：

1. 创建一个 `CMakeLists.txt` 以访问 C++ 代码。  
2. 修改 `build.gradle` 以指向该 `CMakeLists.txt` 文件。  
3. 在 Android 应用中新增 `OnLoad.cpp` 文件以注册 Turbo 原生模块。

#### 1. 创建 `CMakeLists.txt` 文件

Android 使用 CMake 构建，需要能访问 `shared` 目录下定义的文件。

1. 创建目录 `SampleApp/android/app/src/main/jni`，`jni` 是 Android C++ 代码目录。  
2. 新建 `CMakeLists.txt`，内容如下：

```shell title="CMakeLists.txt"
cmake_minimum_required(VERSION 3.13)

# 定义库名称
project(appmodules)

# 包含 React Native 构建所需内容
include(${REACT_ANDROID_DIR}/cmake-utils/ReactNative-application.cmake)

# 指定额外源码位置。需往上回溯多层目录以访问 shared 文件夹
target_sources(${CMAKE_PROJECT_NAME} PRIVATE ../../../../../shared/NativeSampleModule.cpp)

# 指定头文件目录，同样回溯目录结构
target_include_directories(${CMAKE_PROJECT_NAME} PUBLIC ../../../../../shared)
```

CMake 文件功能解析：

- 定义名为 `appmodules` 的库，用于包含所有 C++ 代码。  
- 加载 React Native 基础 CMake 文件。  
- 通过 `target_sources` 添加我们的模块源代码，该库默认包含 React Native 的默认源。路径需从 `jni` 回溯到 `shared`。  
- 指定头文件所在目录，也同样回溯。

#### 2. 修改 `build.gradle` 引入自定义 C++ 代码

Gradle 管理 Android 构建进程，需要配置 CMake 文件路径。

1. 打开 `SampleApp/android/app/build.gradle`。  
2. 在 `android` 配置块中加入以下代码：

```diff title="android/app/build.gradle"
    buildTypes {
        debug {
            signingConfig signingConfigs.debug
        }
        release {
            // 注意！生产环境需要你自行生成签名证书。
            // 详见 https://reactnative.dev/docs/signed-apk-android.
            signingConfig signingConfigs.debug
            minifyEnabled enableProguardInReleaseBuilds
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
        }
    }

+   externalNativeBuild {
+       cmake {
+           path "src/main/jni/CMakeLists.txt"
+       }
+   }
}
```

该配置告诉 Gradle CMake 文件路径，从而在构建阶段找到并编译 C++ 代码。

#### 3. 注册新的 Turbo Native Module

最后一步是注册 C++ Turbo 原生模块，使得 JS 请求该模块时，应用能正确加载并返回。

1. 在 `SampleApp/android/app/src/main/jni` 路径下执行命令：

<CodeBlock language="sh" title="shell">
{`curl -O https://raw.githubusercontent.com/facebook/react-native/${getCoreBranchNameForCurrentVersion()}/packages/react-native/ReactAndroid/cmake-utils/default-app-setup/OnLoad.cpp`}
</CodeBlock>

2. 修改下载的 `OnLoad.cpp` 内容如下：

```diff title="android/app/src/main/jni/OnLoad.cpp"
#include <DefaultComponentsRegistry.h>
#include <DefaultTurboModuleManagerDelegate.h>
#include <autolinking.h>
#include <fbjni/fbjni.h>
#include <react/renderer/componentregistry/ComponentDescriptorProviderRegistry.h>
#include <rncore.h>

+ // 引入 NativeSampleModule 头文件
+ #include <NativeSampleModule.h>

//...

std::shared_ptr<TurboModule> cxxModuleProvider(
    const std::string& name,
    const std::shared_ptr<CallInvoker>& jsInvoker) {
  // 在此提供你的 CXX Turbo Modules，无论是应用自有的还是外部库。
  // 以下是示范写法（对应模块名为 `NativeCxxModuleExample`）：
  //
  // if (name == NativeCxxModuleExample::kModuleName) {
  //   return std::make_shared<NativeCxxModuleExample>(jsInvoker);
  // }

+  // 以下代码注册模块，确保 JS 端请求时可正确返回实例
+  if (name == NativeSampleModule::kModuleName) {
+    return std::make_shared<NativeSampleModule>(jsInvoker);
+  }

  // 退回至自动链接的 CXX 模块提供程序
  return autolinking_cxxModuleProvider(name, jsInvoker);
}

// 文件剩余部分保持不变
```

说明：

此步骤从 React Native 仓库下载了官方 `OnLoad.cpp`，我们对它做了改写：

- 引入自定义模块头文件  
- 注册在 JS 端请求该模块时返回对应对象

最后，在项目根目录运行 `yarn android`，确保应用能成功构建。

### iOS

为保证 iOS 应用能构建 C++ Turbo 原生模块，将进行以下步骤：

1. 安装 Pods 并执行 Codegen。  
2. 将 `shared` 文件夹添加到 iOS 工程。  
3. 在应用中注册 C++ Turbo 原生模块。

#### 1. 安装 Pods 并执行 Codegen

执行常规 iOS 准备步骤，CocoaPods 会安装依赖并运行 Codegen。

```bash
cd ios
bundle install
bundle exec pod install
```

#### 2. 将 shared 文件夹添加到 iOS 工程

1. 打开 CocoaPods 生成的 Xcode Workspace：

```bash
cd ios
open SampleApp.xcworkspace
```

2. 左侧选择 `SampleApp` 项目，点击菜单中的 `Add files to "Sample App"...`。

![向 "Sample App" 添加文件...](/docs/assets/AddFilesToXcode1.png)

3. 选择 `shared` 文件夹后点击 `Add`。

![向 "Sample App" 添加文件...](/docs/assets/AddFilesToXcode2.png)

若操作成功，左侧项目结构应如图所示：

![Xcode 项目](/docs/assets/CxxTMGuideXcodeProject.png)

#### 3. 在应用中注册 Cxx Turbo 原生模块

你需要：

1. 为 Native 模块创建一个 `ModuleProvider`  
2. 在 `package.json` 中配置 JS 模块名与该 ModuleProvider 类的关联  

ModuleProvider 是一个 Objective-C++ 类，桥接纯 C++ 模块与 iOS 应用。

##### 3.1 创建 ModuleProvider

1. 在 Xcode 中选择 `SampleApp` 项目，按下 <kbd>⌘</kbd> + <kbd>N</kbd> 新建文件。  
2. 选择 `Cocoa Touch Class` 模板。  
3. 命名为 `NativeSampleModuleProvider`（保持"Subclass of"为 `NSObject`，"Language"为 `Objective-C`）。  
4. 点击 Next 生成文件。  
5. 将 `NativeSampleModuleProvider.m` 重命名为 `NativeSampleModuleProvider.mm`（标明为 Objective-C++ 文件）。  
6. 用以下代码替换 `NativeSampleModuleProvider.h` 文件内容：

```objc title="NativeSampleModuleProvider.h"

#import <Foundation/Foundation.h>
#import <ReactCommon/RCTTurboModule.h>

NS_ASSUME_NONNULL_BEGIN

@interface NativeSampleModuleProvider : NSObject <RCTModuleProvider>

@end

NS_ASSUME_NONNULL_END
```

声明了一个遵循 `RCTModuleProvider` 协议的对象。

7. 用以下代码替换 `NativeSampleModuleProvider.mm` 文件内容：

```objc title="NativeSampleModuleProvider.mm"

#import "NativeSampleModuleProvider.h"
#import <ReactCommon/CallInvoker.h>
#import <ReactCommon/TurboModule.h>
#import "NativeSampleModule.h"

@implementation NativeSampleModuleProvider

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeSampleModule>(params.jsInvoker);
}

@end
```

实现了 `RCTModuleProvider` 协议，在调用 `getTurboModule:` 时返回纯 C++ 的 `NativeSampleModule`。

##### 3.2 更新 package.json

最后，修改 `package.json`，将 JS 端规范模块名与原生实现的 ModuleProvider 关联：

```json title="package.json"
     "start": "react-native start",
     "test": "jest"
   },
   "codegenConfig": {
     "name": "AppSpecs",
     "type": "modules",
     "jsSrcsDir": "specs",
     "android": {
       "javaPackageName": "com.sampleapp.specs"
     // highlight-add-start
     },
     "ios": {
        "modulesProvider": {
          "NativeSampleModule":  "NativeSampleModuleProvider"
        }
     }
     // highlight-add-end
   },

   "dependencies": {
```

现需重新安装 Pods 以确保 Codegen 重新生成相关文件：

```bash
# 在 ios 目录下执行
bundle exec pod install
open SampleApp.xcworkspace
```

通过 Xcode 构建应用，应能成功编译。

## 5. 测试你的代码

现在可以从 JS 访问 C++ Turbo 原生模块了。修改 `App.tsx`，导入 Turbo 原生模块并调用。

1. 打开 `App.tsx`。  
2. 用以下代码替换模板内容：

```tsx title="App.tsx"
import React from 'react';
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import SampleTurboModule from './specs/NativeSampleModule';

function App(): React.JSX.Element {
  const [value, setValue] = React.useState('');
  const [reversedValue, setReversedValue] = React.useState('');

  const onPress = () => {
    const revString = SampleTurboModule.reverseString(value);
    setReversedValue(revString);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>
          欢迎使用 C++ Turbo 原生模块示例
        </Text>
        <Text>在这里输入你想要反转的文本</Text>
        <TextInput
          style={styles.textInput}
          placeholder="在这里输入你的文本"
          onChangeText={setValue}
          value={value}
        />
        <Button title="反转" onPress={onPress} />
        <Text>反转后的文本：{reversedValue}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize:18,
    marginBottom: 20,
  },
  textInput: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
});

export default App;
```

核心代码：

- `import SampleTurboModule from './specs/NativeSampleModule';` 导入 Turbo 原生模块。  
- `const revString = SampleTurboModule.reverseString(value);` 在 `onPress` 回调内调用该模块接口。

:::warning
为简化示例并缩短篇幅，我们直接在应用中导入了 spec 文件。  
最佳实践应是创建独立文件封装 spec，提供预处理输入与更好控制，之后再在应用中使用该封装。  
:::

恭喜，你已成功编写第一个 C++ Turbo 原生模块！

| <center>Android</center>                                                                             | <center>iOS</center>                                                                          |
| ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| <center><img src="/docs/assets/CxxGuideAndroidVideo.gif" alt="Android 视频" height="600"/></center> | <center><img src="/docs/assets/CxxGuideIOSVideo.gif" alt="iOS 视频" height="600" /></center> |