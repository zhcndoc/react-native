import {getCoreBranchNameForCurrentVersion} from '@site/src/getCoreBranchNameForCurrentVersion';
import {getCurrentVersion} from '@site/src/getCurrentVersion';
import CodeBlock from '@theme/CodeBlock';
import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

# 跨平台原生模块 (C++)

用 C++ 编写模块是在 Android 和 iOS 之间共享平台无关代码的最佳方式。使用纯 C++ 模块，你只需编写一次逻辑，即可在所有平台上直接重用，无需编写特定于平台的代码。

在本指南中，我们将逐步创建一个纯 C++ Turbo 原生模块：

1. 创建 JS 规范
2. 配置 Codegen 以生成脚手架
3. 实现原生逻辑
4. 在 Android 和 iOS 应用中注册模块
5. 在 JS 中测试你的更改

本指南的其余部分假设你已经运行以下命令创建了应用：

<CodeBlock language="bash" title="shell">
{`npx @react-native-community/cli@latest init SampleApp --version ${getCurrentVersion()}`}
</CodeBlock>

## 1. 创建 JS 规范

纯 C++ Turbo 原生模块是 Turbo 原生模块。它们需要一个规范文件（也称为 spec 文件），以便 Codegen 为我们创建脚手架代码。规范文件也是我们在 JS 中访问 Turbo 原生模块所使用的文件。

规范文件需要用类型化的 JS 方言编写。React Native 目前支持 Flow 或 TypeScript。

1. 在应用的根文件夹内，创建一个名为 `specs` 的新文件夹。
2. 创建一个名为 `NativeSampleModule.ts` 的新文件，包含以下代码：

:::warning
所有 Native Turbo 模块规范文件必须具有前缀 `Native`，否则 Codegen 将忽略它们。
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

下一步是在你的 `package.json` 中配置 [Codegen](what-is-codegen.mdx)。更新文件以包含：

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

此配置告诉 Codegen 在 `specs` 文件夹中查找规范文件。它还指示 Codegen 仅为 `modules` 生成代码，并将生成的代码命名为 `AppSpecs`。

## 3. 编写原生代码

编写 C++ Turbo 原生模块允许你在 Android 和 iOS 之间共享代码。因此我们将编写一次代码，然后我们将查看需要对平台应用哪些更改，以便能够使用 C++ 代码。

1. 在与 `android` 和 `ios` 文件夹相同的级别创建一个名为 `shared` 的文件夹。
2. 在 `shared` 文件夹内，创建一个名为 `NativeSampleModule.h` 的新文件。

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

3. 在 `shared` 文件夹内，创建一个名为 `NativeSampleModule.cpp` 的新文件。

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

让我们看看我们创建的两个文件：

- `NativeSampleModule.h` 文件是纯 C++ TurboModule 的头文件。`include` 语句确保我们包含将由 Codegen 创建的规范，其中包含我们需要实现的接口和基类。
- 模块位于 `facebook::react` 命名空间中，以便访问该命名空间中的所有类型。
- 类 `NativeSampleModule` 是实际的 Turbo 原生模块类，它扩展了 `NativeSampleModuleCxxSpec` 类，该类包含一些胶水代码和样板代码，使此类表现为 Turbo 原生模块。
- 最后，我们有构造函数，它接受一个指向 `CallInvoker` 的指针，以便在需要时与 JS 通信，以及我们必须实现的函数原型。

`NativeSampleModule.cpp` 文件是我们 Turbo 原生模块的实际实现，并实现了我们在规范中声明的构造函数和方法。

## 4. 在平台中注册模块

接下来的步骤将让我们在平台中注册模块。这是将原生代码暴露给 JS 的步骤，以便 React Native 应用最终可以从 JS 层调用原生方法。

这是唯一一次我们需要编写一些特定于平台的代码。

### Android

为了确保 Android 应用能够有效地构建 C++ Turbo 原生模块，我们需要：

1. 创建一个 `CMakeLists.txt` 以访问我们的 C++ 代码。
2. 修改 `build.gradle` 以指向新创建的 `CMakeLists.txt` 文件。
3. 在我们的 Android 应用中创建一个 `OnLoad.cpp` 文件以注册新的 Turbo 原生模块。

#### 1. 创建 `CMakeLists.txt` 文件

Android 使用 CMake 进行构建。CMake 需要访问我们在共享文件夹中定义的文件才能构建它们。

1. 创建一个新文件夹 `SampleApp/android/app/src/main/jni`。`jni` 文件夹是 Android C++ 部分所在的位置。
2. 创建一个 `CMakeLists.txt` 文件并添加以下内容：

```shell title="CMakeLists.txt"
cmake_minimum_required(VERSION 3.13)

# 在此处定义库名称。
project(appmodules)

# 此文件包含所有必要的内容，让你能够构建你的 React Native 应用
include(${REACT_ANDROID_DIR}/cmake-utils/ReactNative-application.cmake)

# 定义额外源代码的位置。我们需要回溯 jni, main, src, app, android 文件夹
target_sources(${CMAKE_PROJECT_NAME} PRIVATE ../../../../../shared/NativeSampleModule.cpp)

# 定义 CMake 可以找到额外头文件的位置。我们需要回溯 jni, main, src, app, android 文件夹
target_include_directories(${CMAKE_PROJECT_NAME} PUBLIC ../../../../../shared)
```

CMake 文件执行以下操作：

- 定义 `appmodules` 库，所有应用的 C++ 代码都将包含在其中。
- 加载基础 React Native 的 CMake 文件。
- 添加我们需要构建的模块 C++ 源代码，使用 `target_sources` 指令。默认情况下，React Native 已经会用默认源填充 `appmodules` 库，这里我们包含我们的自定义源。你可以看到我们需要从 `jni` 文件夹回溯到我们的 C++ Turbo 模块所在的 `shared` 文件夹。
- 指定 CMake 在哪里可以找到模块头文件。同样在这种情况下，我们需要从 `jni` 文件夹回溯。

#### 2. 修改 `build.gradle` 以包含自定义 C++ 代码

Gradle 是协调 Android 构建的工具。我们需要告诉它在哪里可以找到 `CMake` 文件来构建 Turbo 原生模块。

1. 打开 `SampleApp/android/app/build.gradle` 文件。
2. 将以下代码块添加到 Gradle 文件中，位于现有的 `android` 块内：

```diff title="android/app/build.gradle"
    buildTypes {
        debug {
            signingConfig signingConfigs.debug
        }
        release {
            // 注意！在生产环境中，你需要生成自己的密钥库文件。
            // 参见 https://reactnative.dev/docs/signed-apk-android.
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

此代码块告诉 Gradle 文件在哪里查找 CMake 文件。路径是相对于 `build.gradle` 文件所在的文件夹，因此我们需要添加 `jni` 文件夹中 `CMakeLists.txt` 文件的路径。

#### 3. 注册新的 Turbo 原生模块

最后一步是在运行时注册新的 C++ Turbo 原生模块，以便当 JS 需要 C++ Turbo 原生模块时，应用知道在哪里找到它并可以返回它。

1. 从文件夹 `SampleApp/android/app/src/main/jni` 中，运行以下命令：

<CodeBlock language="sh" title="shell">
{`curl -O https://raw.githubusercontent.com/facebook/react-native/${getCoreBranchNameForCurrentVersion()}/packages/react-native/ReactAndroid/cmake-utils/default-app-setup/OnLoad.cpp`}
</CodeBlock>

2. 然后，按如下方式修改此文件：

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
  // 在这里你可以提供来自你的应用或外部库的 CXX Turbo 模块。遵循的方法
  // 类似于以下内容（对于名为 `NativeCxxModuleExample` 的模块）：
  //
  // if (name == NativeCxxModuleExample::kModuleName) {
  //   return std::make_shared<NativeCxxModuleExample>(jsInvoker);
  // }

+  // 此代码注册模块，以便当 JS 端请求它时，应用可以返回它
+  if (name == NativeSampleModule::kModuleName) {
+    return std::make_shared<NativeSampleModule>(jsInvoker);
+  }

  // 并且我们回退到自动链接的 CXX 模块提供者
  return autolinking_cxxModuleProvider(name, jsInvoker);
}

// 保留文件的其余部分
```

这些步骤从 React Native 下载原始的 `OnLoad.cpp` 文件，以便我们可以安全地覆盖它以在应用中加载 C++ Turbo 原生模块。

一旦我们下载了文件，我们可以通过以下方式修改它：

- 包含指向我们模块的头文件
- 注册 Turbo 原生模块，以便当 JS 需要它时，应用可以返回它。

现在，你可以从项目根目录运行 `yarn android` 来查看你的应用成功构建。

### iOS

为了确保 iOS 应用能够有效地构建 C++ Turbo 原生模块，我们需要：

1. 安装 pods 并运行 Codegen。
2. 将 `shared` 文件夹添加到我们的 iOS 项目。
3. 在应用中注册 C++ Turbo 原生模块。

#### 1. 安装 Pods 并运行 Codegen。

我们需要运行的第一步是每次准备 iOS 应用时都要运行的常规步骤。CocoaPods 是我们用来设置和安装 React Native 依赖项的工具，作为过程的一部分，它也会为我们运行 Codegen。

```bash
cd ios
bundle install
bundle exec pod install
```

#### 2. 将 shared 文件夹添加到 iOS 项目

此步骤将 `shared` 文件夹添加到项目，使其对 Xcode 可见。

1. 打开 CocoaPods 生成的 Xcode Workspace。

```bash
cd ios
open SampleApp.xcworkspace
```

2. 点击左侧的 `SampleApp` 项目，然后选择 `Add files to "Sample App"...`。

![将文件添加到 Sample App...](/docs/assets/AddFilesToXcode1.png)

3. 选择 `shared` 文件夹，然后点击 `Add`。

![将文件添加到 Sample App...](/docs/assets/AddFilesToXcode2.png)

如果你所做的一切都是正确的，你左侧的项目应该看起来像这样：

![Xcode 项目](/docs/assets/CxxTMGuideXcodeProject.png)

#### 3. 在应用中注册 Cxx Turbo 原生模块

要在应用中注册纯 Cxx Turbo 原生模块，你需要：

1. 为原生模块创建一个 `ModuleProvider`
2. 配置 `package.json` 以将 JS 模块名称与 ModuleProvider 类关联起来。

ModuleProvider 是一个 Objective-C++，它将纯 C++ 模块与 iOS 应用的其余部分连接在一起。

##### 3.1 创建 ModuleProvider

1. 在 Xcode 中，选择 `SampleApp` 项目，然后按 <kbd>⌘</kbd> + <kbd>N</kbd> 创建一个新文件。
2. 选择 `Cocoa Touch Class` 模板
3. 添加名称 `NativeSampleModuleProvider`（保持其他字段为 `Subclass of: NSObject` 和 `Language: Objective-C`）
4. 点击 Next 生成文件。
5. 将 `NativeSampleModuleProvider.m` 重命名为 `NativeSampleModuleProvider.mm`。`mm` 扩展名表示这是一个 Objective-C++ 文件。
6. 使用以下内容实现 `NativeSampleModuleProvider.h` 的内容：

```objc title="NativeSampleModuleProvider.h"

#import <Foundation/Foundation.h>
#import <ReactCommon/RCTTurboModule.h>

NS_ASSUME_NONNULL_BEGIN

@interface NativeSampleModuleProvider : NSObject <RCTModuleProvider>

@end

NS_ASSUME_NONNULL_END
```

这声明了一个符合 `RCTModuleProvider` 协议的 `NativeSampleModuleProvider` 对象。

7. 使用以下内容实现 `NativeSampleModuleProvider.mm` 的内容：

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

此代码通过当调用 `getTurboModule:` 方法时创建纯 C++ `NativeSampleModule` 来实现 `RCTModuleProvider` 协议。

##### 3.2 更新 package.json

最后一步是更新 `package.json` 以告知 React Native 原生模块的 JS 规范与原生代码中这些规范的具体实现之间的链接。

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

此时，你需要重新安装 pods 以确保 codegen 再次运行以生成新文件：

```bash
# 从 ios 文件夹
bundle exec pod install
open SampleApp.xcworkspace
```

如果你现在从 Xcode 构建应用，你应该能够成功构建。

## 5. 测试你的代码

现在是时候从 JS 访问我们的 C++ Turbo Native Module 了。为此，我们必须修改 `App.tsx` 文件以导入 Turbo Native Module 并在代码中调用它。

1. 打开 `App.tsx` 文件。
2. 将模板的内容替换为以下代码：

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
          欢迎来到 C++ Turbo Native Module 示例
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

此应用中有趣的行是：

- `import SampleTurboModule from './specs/NativeSampleModule';`：这一行将 Turbo Native Module 导入到应用中，
- `onPress` 回调中的 `const revString = SampleTurboModule.reverseString(value);`：这就是你在应用中使用 Turbo Native Module 的方式。

:::warning
为了本示例的缘故并尽可能保持简短，我们直接在应用中导入了 spec 文件。
这种情况下的最佳实践是创建一个单独的文件来包装 specs，并在你的应用程序中使用该文件。
这允许你为 specs 准备输入，并让你在 JS 中对它们有更多的控制权。
:::

恭喜你，你写出了第一个 C++ Turbo Native Module！

| <center>Android</center>                                                                             | <center>iOS</center>                                                                          |
| ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| <center><img src="/docs/assets/CxxGuideAndroidVideo.gif" alt="Android 视频" height="600"/></center> | <center><img src="/docs/assets/CxxGuideIOSVideo.gif" alt="iOS 视频" height="600" /></center> |
