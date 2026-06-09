import {getCoreBranchNameForCurrentVersion} from '@site/src/getCoreBranchNameForCurrentVersion';
import {getCurrentVersion} from '@site/src/getCurrentVersion';
import CodeBlock from '@theme/CodeBlock';

# 跨平台原生模块（C++）

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

使用 C++ 编写模块是在 Android 和 iOS 之间共享与平台无关代码的最佳方式。借助纯 C++ 模块，你只需编写一次逻辑，就可以立即在所有平台上复用，而无需编写平台特定代码。

在本指南中，我们将逐步创建一个纯 C++ Turbo Native Module：

1. 创建 JS 规范
2. 配置 Codegen 生成脚手架代码
3. 实现原生逻辑
4. 在 Android 和 iOS 应用中注册模块
5. 在 JS 中测试你的更改

本指南其余部分假设你已经通过运行以下命令创建了应用：

<CodeBlock language="bash" title="shell">
{`npx @react-native-community/cli@latest init SampleApp --version ${getCurrentVersion()}`}
</CodeBlock>

## 1. 创建 JS 规范

纯 C++ Turbo Native Module 也是 Turbo Native Module。它们需要一个规范文件（也称 spec 文件），这样 Codegen 才能为我们创建脚手架代码。规范文件也是我们在 JS 中访问 Turbo Native Module 的方式。

Spec 文件需要使用带类型的 JS 方言编写。React Native 当前支持 Flow 或 TypeScript。

1. 在应用根目录下，创建一个名为 `specs` 的新文件夹。
2. 创建一个名为 `NativeSampleModule.ts` 的新文件，并写入以下代码：

:::warning
所有 Native Turbo Module spec 文件都必须以 `Native` 为前缀，否则 Codegen 会忽略它们。
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

下一步是在你的 `package.json` 中配置 [Codegen](what-is-codegen.mdx)。将文件更新为包含以下内容：

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

这个配置告诉 Codegen 去 `specs` 文件夹中查找 spec 文件。它还指示 Codegen 只为 `modules` 生成代码，并将生成的代码命名空间设置为 `AppSpecs`。

## 3. 编写原生代码

用 C++ 编写 Turbo Native Module 可以让你在 Android 和 iOS 之间共享代码。因此我们只需要编写一次代码，然后再看看为了让 C++ 代码被识别，需要对各个平台做哪些改动。

1. 在与 `android` 和 `ios` 文件夹同级的位置创建一个名为 `shared` 的文件夹。
2. 在 `shared` 文件夹中，创建一个名为 `NativeSampleModule.h` 的新文件。

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

3. 在 `shared` 文件夹中，创建一个名为 `NativeSampleModule.cpp` 的新文件。

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

让我们看看刚刚创建的两个文件：

- `NativeSampleModule.h` 文件是纯 C++ TurboModule 的头文件。`include` 语句确保我们包含由 Codegen 生成的规范，这些规范包含我们需要实现的接口和基类。
- 该模块位于 `facebook::react` 命名空间中，以便访问该命名空间中的所有类型。
- `NativeSampleModule` 类是实际的 Turbo Native Module 类，它继承自 `NativeSampleModuleCxxSpec` 类。后者包含一些胶水代码和样板代码，让这个类表现得像一个 Turbo Native Module。
- 最后，我们有构造函数，它接收一个指向 `CallInvoker` 的指针，以便在需要时与 JS 通信；以及我们必须实现的函数原型。

`NativeSampleModule.cpp` 文件是我们 Turbo Native Module 的实际实现，它实现了构造函数以及我们在规范中声明的方法。

## 4. 在平台中注册模块

接下来的步骤将让我们在平台中注册该模块。这一步会将原生代码暴露给 JS，从而让 React Native 应用最终可以从 JS 层调用原生方法。

这是唯一一次我们需要编写一些平台特定代码。

### Android

为了确保 Android 应用能够成功构建这个 C++ Turbo Native Module，我们需要：

1. 创建一个 `CMakeLists.txt` 来访问我们的 C++ 代码。
2. 修改 `build.gradle` 以指向新创建的 `CMakeLists.txt` 文件。
3. 在我们的 Android 应用中创建一个 `OnLoad.cpp` 文件来注册新的 Turbo Native Module。

#### 1. 创建 `CMakeLists.txt` 文件

Android 使用 CMake 进行构建。CMake 需要访问我们在共享文件夹中定义的文件，才能构建它们。

1. 创建一个新文件夹 `SampleApp/android/app/src/main/jni`。`jni` 文件夹是 Android C++ 部分所在的位置。
2. 创建一个 `CMakeLists.txt` 文件，并添加以下内容：

```shell title="CMakeLists.txt"
cmake_minimum_required(VERSION 3.13)

# 在这里定义库名称。
project(appmodules)

# 该文件包含构建 React Native 应用所需的一切
include(${REACT_ANDROID_DIR}/cmake-utils/ReactNative-application.cmake)

# 定义额外源代码所在的位置。我们需要从 jni、main、src、app、android 文件夹一路返回。
target_sources(${CMAKE_PROJECT_NAME} PRIVATE ../../../../../shared/NativeSampleModule.cpp)

# 定义 CMake 可以找到额外头文件的位置。同样，在这种情况下我们也需要从 jni 文件夹一路返回。
target_include_directories(${CMAKE_PROJECT_NAME} PUBLIC ../../../../../shared)
```

这个 CMake 文件做了以下几件事：

- 定义 `appmodules` 库，所有应用的 C++ 代码都会包含在其中。
- 加载 React Native 的基础 CMake 文件。
- 通过 `target_sources` 指令添加我们需要构建的模块 C++ 源代码。默认情况下，React Native 已经会为 `appmodules` 库填充默认源文件，这里我们加入自定义源文件。你可以看到，我们需要从 `jni` 文件夹一路返回到 `shared` 文件夹，而我们的 C++ Turbo Module 就位于那里。
- 指定 CMake 可以在哪里找到模块头文件。在这种情况下，我们同样需要从 `jni` 文件夹一路返回。

#### 2. 修改 `build.gradle` 以包含自定义 C++ 代码

Gradle 是负责协调 Android 构建的工具。我们需要告诉它在哪里可以找到 `CMake` 文件来构建 Turbo Native Module。

1. 打开 `SampleApp/android/app/build.gradle` 文件。
2. 在现有的 `android` 块中添加以下内容：

```diff title="android/app/build.gradle"
    buildTypes {
        debug {
            signingConfig signingConfigs.debug
        }
        release {
            // 注意！在生产环境中，你需要生成自己的 keystore 文件。
            // 请参见 https://reactnative.dev/docs/signed-apk-android。
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

这个块告诉 Gradle 文件去哪里查找 CMake 文件。该路径相对于 `build.gradle` 文件所在的文件夹，因此我们需要添加指向 `jni` 文件夹中 `CMakeLists.txt` 文件的路径。

#### 3. 注册新的 Turbo Native Module

最后一步是在运行时注册新的 C++ Turbo Native Module，这样当 JS 请求这个 C++ Turbo Native Module 时，应用就知道去哪里找到它并返回它。

1. 在 `SampleApp/android/app/src/main/jni` 文件夹中，运行以下命令：

<CodeBlock language="sh" title="shell">
{`curl -O https://raw.githubusercontent.com/facebook/react-native/${getCoreBranchNameForCurrentVersion()}/packages/react-native/ReactAndroid/cmake-utils/default-app-setup/OnLoad.cpp`}
</CodeBlock>

2. 然后按如下方式修改这个文件：

```diff title="android/app/src/main/jni/OnLoad.cpp"
#include <DefaultComponentsRegistry.h>
#include <DefaultTurboModuleManagerDelegate.h>
#include <autolinking.h>
#include <fbjni/fbjni.h>
#include <react/renderer/componentregistry/ComponentDescriptorProviderRegistry.h>
#include <rncore.h>

+ // 包含 NativeSampleModule 头文件
+ #include <NativeSampleModule.h>

//...

std::shared_ptr<TurboModule> cxxModuleProvider(
    const std::string& name,
    const std::shared_ptr<CallInvoker>& jsInvoker) {
  // 这里你可以提供来自
  // 你的应用或外部库的 CXX Turbo Modules。应遵循的方法
  // 类似于下面这样（对于一个名为 `NativeCxxModuleExample` 的模块）：
  //
  // if (name == NativeCxxModuleExample::kModuleName) {
  //   return std::make_shared<NativeCxxModuleExample>(jsInvoker);
  // }

+  // 这段代码会注册该模块，以便当 JS 端请求它时，应用能够返回它
+  if (name == NativeSampleModule::kModuleName) {
+    return std::make_shared<NativeSampleModule>(jsInvoker);
+  }

  // 然后我们回退到自动链接的 CXX 模块提供器
  return autolinking_cxxModuleProvider(name, jsInvoker);
}

// 保留文件其余部分不变
```

这些步骤会从 React Native 下载原始的 `OnLoad.cpp` 文件，这样我们就可以安全地覆盖它，以便在应用中加载 C++ Turbo Native Module。

下载完成后，我们可以按如下方式修改它：

- 包含指向我们模块的头文件
- 注册 Turbo Native Module，这样当 JS 请求它时，应用就可以返回它

现在，你可以从项目根目录运行 `yarn android` 来查看应用成功构建。

### iOS

为了确保 iOS 应用能够成功构建这个 C++ Turbo Native Module，我们需要：

1. 安装 pods 并运行 Codegen。
2. 将 `shared` 文件夹添加到 iOS 项目中。
3. 在应用中注册这个 C++ Turbo Native Module。

#### 1. 安装 Pods 并运行 Codegen

我们需要运行的第一步是每次准备 iOS 应用时都会执行的常规步骤。CocoaPods 是我们用来设置并安装 React Native 依赖的工具，并且在这个过程中它也会为我们运行 Codegen。

```bash
cd ios
bundle install
bundle exec pod install
```

#### 2. 将 shared 文件夹添加到 iOS 项目

这一步会将 `shared` 文件夹添加到项目中，以便 Xcode 可见。

1. 打开 CocoaPods 生成的 Xcode Workspace。

```bash
cd ios
open SampleApp.xcworkspace
```

2. 点击左侧的 `SampleApp` 项目，然后选择 `Add files to "Sample App"...`。

![Add Files to Sample App...](/docs/assets/AddFilesToXcode1.png)

3. 选择 `shared` 文件夹并点击 `Add`。

![Add Files to Sample App...](/docs/assets/AddFilesToXcode2.png)

如果一切正确，你左侧的项目应该看起来像这样：

![Xcode Project](/docs/assets/CxxTMGuideXcodeProject.png)

#### 3. 在你的应用中注册 Cxx Turbo Native Module

要在你的应用中注册一个纯 Cxx Turbo Native Module，你需要：

1. 为原生模块创建一个 `ModuleProvider`
2. 配置 `package.json`，将 JS 模块名称与 `ModuleProvider` 类关联起来。

`ModuleProvider` 是一个 Objective-C++，它将纯 C++ 模块与 iOS 应用的其余部分连接起来。

##### 3.1 创建 `ModuleProvider`

1. 在 Xcode 中，选择 `SampleApp` 项目并按 <kbd>⌘</kbd> + <kbd>N</kbd> 创建一个新文件。
2. 选择 `Cocoa Touch Class` 模板
3. 添加名称 `NativeSampleModuleProvider`（保持另一个字段为 `Subclass of: NSObject` 和 `Language: Objective-C`）
4. 点击 Next 生成文件。
5. 将 `NativeSampleModuleProvider.m` 重命名为 `NativeSampleModuleProvider.mm`。`mm` 扩展名表示这是一个 Objective-C++ 文件。
6. 按如下内容实现 `NativeSampleModuleProvider.h`：

```objc title="NativeSampleModuleProvider.h"

#import <Foundation/Foundation.h>
#import <ReactCommon/RCTTurboModule.h>

NS_ASSUME_NONNULL_BEGIN

@interface NativeSampleModuleProvider : NSObject <RCTModuleProvider>

@end

NS_ASSUME_NONNULL_END
```

这声明了一个符合 `RCTModuleProvider` 协议的 `NativeSampleModuleProvider` 对象。

7. 按如下内容实现 `NativeSampleModuleProvider.mm`：

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

这段代码通过在调用 `getTurboModule:` 方法时创建纯 C++ `NativeSampleModule`，实现了 `RCTModuleProvider` 协议。

##### 3.2 更新 `package.json`

最后一步是更新 `package.json`，告诉 React Native 你的原生模块 JS 规范和其原生代码中的具体实现之间的关联。

按如下方式修改 `package.json`：

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

此时，你需要重新安装 pods，以确保 Codegen 再次运行并生成新的文件：

```bash
# 从 ios 文件夹执行
bundle exec pod install
open SampleApp.xcworkspace
```

如果现在从 Xcode 构建你的应用，你应该能够成功构建。

## 5. 测试你的代码

现在是时候从 JS 中访问我们的 C++ Turbo Native Module 了。为此，我们需要修改 `App.tsx` 文件，导入 Turbo Native Module，并在代码中调用它。

1. 打开 `App.tsx` 文件。
2. 用以下代码替换模板内容：

```tsx title="App.tsx"
import {type JSX, useState} from 'react';
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import SampleTurboModule from './specs/NativeSampleModule';

function App(): JSX.Element {
  const [value, setValue] = useState('');
  const [reversedValue, setReversedValue] = useState('');

  const onPress = () => {
    const revString = SampleTurboModule.reverseString(value);
    setReversedValue(revString);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>
          欢迎使用 C++ Turbo Native Module 示例
        </Text>
        <Text>在这里输入你想要反转的文本</Text>
        <TextInput
          style={styles.textInput}
          placeholder="在此输入你的文本"
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
    fontSize: 18,
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

这个应用中有几行比较关键：

- `import SampleTurboModule from './specs/NativeSampleModule';`：这一行将 Turbo Native Module 导入到应用中，
- `const revString = SampleTurboModule.reverseString(value);` 位于 `onPress` 回调中：这就是你在应用中使用 Turbo Native Module 的方式。

:::warning
为了这个示例并尽可能保持简短，我们直接在应用中导入了 spec 文件。
在这种情况下，最佳实践是创建一个单独的文件来封装这些 specs，并在你的应用程序中使用该文件。
这样可以让你为 specs 准备输入，并在 JS 中对它们拥有更多控制。
:::

恭喜你，你已经编写了第一个 C++ Turbo Native Module！

| <center>Android</center>                                                                             | <center>iOS</center>                                                                          |
| ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| <center><img src="/docs/assets/CxxGuideAndroidVideo.gif" alt="Android Video" height="600"/></center> | <center><img src="/docs/assets/CxxGuideIOSVideo.gif" alt="iOS video" height="600" /></center> |
