import {getCoreBranchNameForCurrentVersion} from '@site/src/getCoreBranchNameForCurrentVersion';
import {getCurrentVersion} from '@site/src/getCurrentVersion';
import CodeBlock from '@theme/CodeBlock';

# 跨平台原生模块（C++）

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

使用 C++ 编写模块是在 Android 和 iOS 之间共享与平台无关代码的最佳方式。借助纯 C++ 模块，你只需编写一次逻辑，就可以立即在所有平台上复用，而无需编写特定于平台的代码。

在本指南中，我们将介绍纯 C++ Turbo Native Module 的创建过程：

1. 创建 JS 规范
2. 配置 Codegen 以生成脚手架代码
3. 实现 Native 逻辑
4. 在 Android 和 iOS 应用中注册模块
5. 在 JS 中测试更改

本指南的其余部分假设你已经运行以下命令创建了应用：

<CodeBlock language="bash" title="shell">
{`npx @react-native-community/cli@latest init SampleApp --version ${getCurrentVersion()}`}
</CodeBlock>

## 1. 创建 JS 规范

纯 C++ Turbo Native Modules 属于 Turbo Native Modules。它们需要一个规范文件（也称为 spec 文件），以便 Codegen 为我们创建脚手架代码。规范文件也是我们在 JS 中访问 Turbo Native Module 时使用的文件。

规范文件需要使用一种带类型的 JS 方言编写。React Native 目前支持 Flow 或 TypeScript。

1. 在应用的根目录中，创建一个名为 `specs` 的新文件夹。
2. 创建一个名为 `NativeSampleModule.ts` 的新文件，并添加以下代码：

:::warning
所有 Native Turbo Module 规范文件都必须以 `Native` 作为前缀，否则 Codegen 会忽略它们。
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

下一步是在 `package.json` 中配置 [Codegen](what-is-codegen.mdx)。更新该文件，包含以下内容：

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

此配置会告诉 Codegen 在 `specs` 文件夹中查找规范文件。它还会指示 Codegen 仅为 `modules` 生成代码，并将生成的代码命名空间设置为 `AppSpecs`。

## 3. 编写 Native 代码

编写 C++ Turbo Native Module 可以让你在 Android 和 iOS 之间共享代码。因此，我们只需编写一次代码，然后了解需要对平台进行哪些更改，以便平台能够使用 C++ 代码。

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

下面来看看我们创建的两个文件：

- `NativeSampleModule.h` 文件是纯 C++ TurboModule 的头文件。`include` 语句确保我们引入由 Codegen 创建的规范，其中包含需要实现的接口和基类。
- 模块位于 `facebook::react` 命名空间中，以便访问该命名空间中的所有类型。
- `NativeSampleModule` 类是真正的 Turbo Native Module 类，它继承了 `NativeSampleModuleCxxSpec` 类。该类包含一些胶水代码和样板代码，使此类能够作为 Turbo Native Module 使用。
- 最后是构造函数，它接受一个指向 `CallInvoker` 的指针，以便在需要时与 JS 通信，以及我们必须实现的函数原型。

`NativeSampleModule.cpp` 文件是 Turbo Native Module 的实际实现，其中实现了我们在规范中声明的构造函数和方法。

## 4. 在平台中注册模块

接下来的步骤将帮助我们在平台中注册模块。这一步会将 Native 代码暴露给 JS，这样 React Native 应用最终就可以从 JS 层调用 Native 方法。

这是我们唯一需要编写一些特定于平台的代码的地方。

### Android

为了确保 Android 应用能够有效构建 C++ Turbo Native Module，我们需要：

1. 创建一个 `CMakeLists.txt` 以访问我们的 C++ 代码。
2. 修改 `build.gradle`，使其指向新创建的 `CMakeLists.txt` 文件。
3. 在 Android 应用中创建一个 `OnLoad.cpp` 文件，以注册新的 Turbo Native Module。

#### 1. 创建 `CMakeLists.txt` 文件

Android 使用 CMake 进行构建。CMake 需要访问我们在 shared 文件夹中定义的文件，以便能够构建它们。

1. 创建新文件夹 `SampleApp/android/app/src/main/jni`。`jni` 文件夹是 Android C++ 部分所在的位置。
2. 创建一个 `CMakeLists.txt` 文件，并添加以下内容：

```shell title="CMakeLists.txt"
cmake_minimum_required(VERSION 3.13)

# Define the library name here.
project(appmodules)

# This file includes all the necessary to let you build your React Native application
include(${REACT_ANDROID_DIR}/cmake-utils/ReactNative-application.cmake)

# Define where the additional source code lives. We need to crawl back the jni, main, src, app, android folders
target_sources(${CMAKE_PROJECT_NAME} PRIVATE ../../../../../shared/NativeSampleModule.cpp)

# Define where CMake can find the additional header files. We need to crawl back the jni, main, src, app, android folders
target_include_directories(${CMAKE_PROJECT_NAME} PUBLIC ../../../../../shared)
```

CMake 文件执行以下操作：

- 定义 `appmodules` 库，所有应用 C++ 代码都将包含在其中。
- 加载 React Native 的基础 CMake 文件。
- 使用 `target_sources` 指令添加我们需要构建的模块 C++ 源代码。默认情况下，React Native 已经会使用默认源代码填充 `appmodules` 库，这里我们加入自定义源代码。你可以看到，我们需要从 `jni` 文件夹逐级返回到 `shared` 文件夹，C++ Turbo Module 就位于该文件夹中。
- 指定 CMake 查找模块头文件的位置。在这里，我们同样需要从 `jni` 文件夹逐级返回。

#### 2. 修改 `build.gradle` 以包含自定义 C++ 代码

Gradle 是负责协调 Android 构建的工具。我们需要告诉它在哪里可以找到用于构建 Turbo Native Module 的 `CMake` 文件。

1. 打开 `SampleApp/android/app/build.gradle` 文件。
2. 将以下代码块添加到 Gradle 文件现有的 `android` 块中：

```diff title="android/app/build.gradle"
    buildTypes {
        debug {
            signingConfig signingConfigs.debug
        }
        release {
            // Caution! In production, you need to generate your own keystore file.
            // see https://reactnative.dev/docs/signed-apk-android.
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

此代码块会告诉 Gradle 文件到哪里查找 CMake 文件。该路径是相对于 `build.gradle` 文件所在文件夹的，因此我们需要添加 `jni` 文件夹中 `CMakeLists.txt` 文件的路径。

#### 3. 注册新的 Turbo Native Module

最后一步是在运行时注册新的 C++ Turbo Native Module，这样当 JS 请求 C++ Turbo Native Module 时，应用就知道在哪里查找它并将其返回。

1. 在文件夹 `SampleApp/android/app/src/main/jni` 中运行以下命令：

<CodeBlock language="sh" title="shell">
{`curl -O https://raw.githubusercontent.com/facebook/react-native/${getCoreBranchNameForCurrentVersion()}/packages/react-native/ReactAndroid/cmake-utils/default-app-setup/OnLoad.cpp`}
</CodeBlock>

2. 然后，按如下方式修改该文件：

```diff title="android/app/src/main/jni/OnLoad.cpp"
#include <DefaultComponentsRegistry.h>
#include <DefaultTurboModuleManagerDelegate.h>
#include <autolinking.h>
#include <fbjni/fbjni.h>
#include <react/renderer/componentregistry/ComponentDescriptorProviderRegistry.h>
#include <rncore.h>

+ // Include the NativeSampleModule header
+ #include <NativeSampleModule.h>

//...

std::shared_ptr<TurboModule> cxxModuleProvider(
    const std::string& name,
    const std::shared_ptr<CallInvoker>& jsInvoker) {
  // Here you can provide your CXX Turbo Modules coming from
  // either your application or from external libraries. The approach to follow
  // is similar to the following (for a module called `NativeCxxModuleExample`):
  //
  // if (name == NativeCxxModuleExample::kModuleName) {
  //   return std::make_shared<NativeCxxModuleExample>(jsInvoker);
  // }

+  // This code registers the module so that when the JS side asks for it, the app can return it
+  if (name == NativeSampleModule::kModuleName) {
+    return std::make_shared<NativeSampleModule>(jsInvoker);
+  }

  // And we fallback to the CXX module providers autolinked
  return autolinking_cxxModuleProvider(name, jsInvoker);
}

// leave the rest of the file
```

这些步骤会从 React Native 下载原始的 `OnLoad.cpp` 文件，这样我们就可以安全地覆盖它，以便在应用中加载 C++ Turbo Native Module。

下载文件后，我们可以通过以下方式修改它：

- 引入指向我们模块的头文件
- 注册 Turbo Native Module，这样当 JS 请求它时，应用就可以将其返回。

现在，你可以从项目根目录运行 `yarn android`，查看应用是否能够成功构建。

### iOS

为了确保 iOS 应用能够有效构建 C++ Turbo Native Module，我们需要：

1. 安装 pods 并运行 Codegen。
2. 将 `shared` 文件夹添加到 iOS 项目中。
3. 在应用中注册 C++ Turbo Native Module。

#### 1. 安装 Pods 并运行 Codegen

首先需要执行的是每次准备 iOS 应用时通常都会执行的步骤。CocoaPods 是我们用于设置和安装 React Native 依赖的工具，在此过程中，它也会为我们运行 Codegen。

```bash
cd ios
bundle install
bundle exec pod install
```

#### 2. 将 shared 文件夹添加到 iOS 项目

此步骤会将 `shared` 文件夹添加到项目中，使其能够在 Xcode 中显示。

1. 打开由 CocoaPods 生成的 Xcode Workspace。

```bash
cd ios
open SampleApp.xcworkspace
```

2. 点击左侧的 `SampleApp` 项目，然后选择 `Add files to "Sample App"...`。

![Add Files to Sample App...](/docs/assets/AddFilesToXcode1.png)

3. 选择 `shared` 文件夹，然后点击 `Add`。

![Add Files to Sample App...](/docs/assets/AddFilesToXcode2.png)

如果一切操作正确，左侧的项目应该如下所示：

![Xcode Project](/docs/assets/CxxTMGuideXcodeProject.png)

#### 3. 在应用中注册 Cxx Turbo Native Module

要在应用中注册纯 Cxx Turbo Native Module，你需要：

1. 为 Native Module 创建一个 `ModuleProvider`
2. 配置 `package.json`，将 JS 模块名称与 ModuleProvider 类关联起来。

ModuleProvider 是一个 Objective-C++，用于将纯 C++ 模块与 iOS 应用的其余部分连接起来。

##### 3.1 创建 ModuleProvider

1. 在 Xcode 中，选择 `SampleApp` 项目，然后按 <kbd>⌘</kbd> + <kbd>N</kbd> 创建新文件。
2. 选择 `Cocoa Touch Class` 模板
3. 添加名称 `NativeSampleModuleProvider`（保留其他字段为 `Subclass of: NSObject` 和 `Language: Objective-C`）
4. 点击 Next 生成文件。
5. 将 `NativeSampleModuleProvider.m` 重命名为 `NativeSampleModuleProvider.mm`。`mm` 扩展名表示 Objective-C++ 文件。
6. 使用以下内容实现 `NativeSampleModuleProvider.h`：

```objc title="NativeSampleModuleProvider.h"

#import <Foundation/Foundation.h>
#import <ReactCommon/RCTTurboModule.h>

NS_ASSUME_NONNULL_BEGIN

@interface NativeSampleModuleProvider : NSObject <RCTModuleProvider>

@end

NS_ASSUME_NONNULL_END
```

这段代码声明了一个符合 `RCTModuleProvider` 协议的 `NativeSampleModuleProvider` 对象。

7. 使用以下内容实现 `NativeSampleModuleProvider.mm`：

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

##### 3.2 更新 package.json

最后一步是更新 `package.json`，告诉 React Native Native Module 的 JS 规范与 Native 代码中这些规范的具体实现之间的关联。

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

此时，你需要重新安装 pods，以确保 Codegen 再次运行并生成新文件：

```bash
# from the ios folder
bundle exec pod install
open SampleApp.xcworkspace
```

现在，如果你从 Xcode 构建应用，应该可以成功完成构建。

## 5. 测试代码

现在是时候从 JS 访问 C++ Turbo Native Module 了。为此，我们需要修改 `App.tsx` 文件，在其中导入 Turbo Native Module 并调用它。

1. 打开 `App.tsx` 文件。
2. 使用以下代码替换模板内容：

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
          Welcome to C++ Turbo Native Module Example
        </Text>
        <Text>Write down here the text you want to reverse</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Write your text here"
          onChangeText={setValue}
          value={value}
        />
        <Button title="Reverse" onPress={onPress} />
        <Text>Reversed text: {reversedValue}</Text>
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

这个应用中值得关注的代码行是：

- `import SampleTurboModule from './specs/NativeSampleModule';`：此行会在应用中导入 Turbo Native Module
- `onPress` 回调中的 `const revString = SampleTurboModule.reverseString(value);`：这就是在应用中使用 Turbo Native Module 的方式。

:::warning
为了让示例尽可能简短，我们直接在应用中导入了规范文件。
在这种情况下，最佳实践是创建一个单独的文件来封装规范，并在应用中使用该文件。
这样可以让你为规范准备输入，并在 JS 中对其进行更好的控制。
:::

恭喜你编写出了第一个 C++ Turbo Native Module！

| <center>Android</center>                                                                             | <center>iOS</center>                                                                          |
| ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| <center><img src="/docs/assets/CxxGuideAndroidVideo.gif" alt="Android Video" height="600"/></center> | <center><img src="/docs/assets/CxxGuideIOSVideo.gif" alt="iOS video" height="600" /></center> |
