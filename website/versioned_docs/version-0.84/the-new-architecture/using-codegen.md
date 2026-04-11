import CodeBlock from '@theme/CodeBlock';
import {getCurrentVersion} from '@site/src/getCurrentVersion';

# 使用 Codegen

本指南介绍如何：

- 配置 **Codegen**。
- 手动调用它以支持各个平台。

还会介绍生成的代码。

## 前提条件

即使手动调用 **Codegen**，你也始终需要一个 React Native 应用来正确生成代码。

**Codegen** 过程与应用构建紧密耦合，相关脚本位于 `react-native` NPM 包中。

本指南中，为方便起见，使用 React Native CLI 创建项目，命令如下：

<CodeBlock language="bash" title="shell">
{`npx @react-native-community/cli@latest init SampleApp --version ${getCurrentVersion()}`}
</CodeBlock>

**Codegen** 用于为你的自定义模块或组件生成粘合代码。详见 Turbo Native Modules 和 Fabric Native Components 指南，了解如何创建它们。

<!-- TODO: add links -->

## 配置 **Codegen**

可以通过修改应用的 `package.json` 文件来配置 **Codegen**。**Codegen** 由一个名为 `codegenConfig` 的自定义字段控制。

```json title="package.json"
  "codegenConfig": {
    "name": "<SpecName>",
    "type": "<types>",
    "jsSrcsDir": "<source_dir>",
    "android": {
      "javaPackageName": "<java.package.name>"
    },
    "ios": {
      "modules": {
        "TestModule": {
          "className": "<iOS-class-implementing-the-RCTModuleProvider-protocol>",
          "unstableRequiresMainQueueSetup": false,
          "conformsToProtocols": ["RCTImageURLLoader", "RCTURLRequestHandler", "RCTImageDataDecoder"],
        }
      },
      "components": {
        "TestComponent": {
          "className": "<iOS-class-implementing-the-component>"
        }
      }
    }
  },
```

你可以将这段配置添加到你的应用中，并自定义以下字段：

- `name:` codegen 配置名称。它会影响 codegen 输出：文件名和代码内容。
- `type:`  
  - `modules:` 只生成模块的代码。  
  - `components:` 只生成组件的代码。  
  - `all`: 生成所有代码。  
- `jsSrcsDir`: 所有规范文件所在的根目录。
- `android`: Android 端的 Codegen 配置（均为可选）：
  - `.javaPackageName`: 配置 Android Java 代码生成结果的包名。
- `ios`: iOS 端的 Codegen 配置（均为可选）：
  - `.modules[moduleName]:`
    - `.className`: 此模块对应的 ObjC 类，或（若是 [C++ 纯模块](/docs/next/the-new-architecture/pure-cxx-modules)）其 `RCTModuleProvider` 类。
    - `.unstableRequiresMainQueueSetup`: 是否需要在 UI 线程上初始化此模块，且在运行任何 JavaScript 之前执行。
    - `.conformsToProtocols`: 指明此模块符合以下任一协议：[`RCTImageURLLoader`](https://github.com/facebook/react-native/blob/00d5caee9921b6c10be8f7d5b3903c6afe8dbefa/packages/react-native/Libraries/Image/RCTImageURLLoader.h#L26-L81)、[`RCTURLRequestHandler`](https://github.com/facebook/react-native/blob/00d5caee9921b6c10be8f7d5b3903c6afe8dbefa/packages/react-native/React/Base/RCTURLRequestHandler.h#L11-L52)、[`RCTImageDataDecoder`](https://github.com/facebook/react-native/blob/00d5caee9921b6c10be8f7d5b3903c6afe8dbefa/packages/react-native/Libraries/Image/RCTImageDataDecoder.h#L15-L53)。
  - `.components[componentName]`:
    - `.className`: 此组件对应的 ObjC 类（例如：`TextInput` -> `RCTTextInput`)。

**Codegen** 运行时，会在应用所有依赖中搜寻符合特定命名规范的 JS 文件，并生成所需代码：

- Turbo Native Modules 规范文件需以 `Native` 作为前缀。例如，`NativeLocalStorage.ts` 是合法的规范文件名。
- Native Fabric Components 规范文件需以 `NativeComponent` 作为后缀。例如，`WebViewNativeComponent.ts` 是合法的规范文件名。

## 运行 **Codegen**

本指南后续内容假定你的项目中已搭建了原生 Turbo Module、原生 Fabric 组件，或两者都有。假定你的 `package.json` 中 `jsSrcsDir` 指定的文件夹内已有合法规范文件。

### Android

Android 的 **Codegen** 集成在 React Native Gradle 插件（RNGP）中。RNGP 提供了一个任务，可读取 `package.json` 中的配置并执行 **Codegen**。要运行此 gradle 任务，先进入项目的 `android` 文件夹，然后执行：

```bash
./gradlew generateCodegenArtifactsFromSchema
```

该任务会在应用和其所有关联的 node_modules 中调用 `generateCodegenArtifactsFromSchema` 命令，生成代码到对应的 `node_modules/<dependency>` 目录。例如，若你有一个名为 `my-fabric-component` 的 Fabric Native Component 模块，生成的代码会位于 `SampleApp/node_modules/my-fabric-component/android/build/generated/source/codegen`。应用自身的代码则生成在 `android/app/build/generated/source/codegen` 文件夹。

#### 生成代码结构

执行上述 gradle 命令后，你将在 `SampleApp/android/app/build` 文件夹中找到生成的 codegen 代码。目录结构大致如下：

```
build
└── generated
    └── source
        └── codegen
            ├── java
            │   └── com
            │       ├── facebook
            │       │   └── react
            │       │       └── viewmanagers
            │       │           ├── <nativeComponent>ManagerDelegate.java
            │       │           └── <nativeComponent>ManagerInterface.java
            │       └── sampleapp
            │           └── NativeLocalStorageSpec.java
            ├── jni
            │   ├── <codegenConfig.name>-generated.cpp
            │   ├── <codegenConfig.name>.h
            │   ├── CMakeLists.txt
            │   └── react
            │       └── renderer
            │           └── components
            │               └── <codegenConfig.name>
            │                   ├── <codegenConfig.name>JSI-generated.cpp
            │                   ├── <codegenConfig.name>.h
            │                   ├── ComponentDescriptors.cpp
            │                   ├── ComponentDescriptors.h
            │                   ├── EventEmitters.cpp
            │                   ├── EventEmitters.h
            │                   ├── Props.cpp
            │                   ├── Props.h
            │                   ├── ShadowNodes.cpp
            │                   ├── ShadowNodes.h
            │                   ├── States.cpp
            │                   └── States.h
            └── schema.json
```

生成的代码分为两个文件夹：

- `java` 包含平台特定代码
- `jni` 包含让 JS 与 Java 正确交互所需的 C++ 代码

在 `java` 文件夹下，Fabric Native 组件的生成代码在 `com/facebook/viewmanagers` 子目录：

- `<nativeComponent>ManagerDelegate.java` 包含 `ViewManager` 可调用自定义原生组件的方法
- `<nativeComponent>ManagerInterface.java` 包含 `ViewManager` 的接口定义

在 `codegenConfig.android.javaPackageName` 对应的包名文件夹中，你会找到 Turbo Native Module 需要实现的抽象类。

`jni` 文件夹包含用于连接 JS 和 Android 的所有模板代码：

- `<codegenConfig.name>.h` 是你自定义 C++ Turbo Native Modules 的接口声明
- `<codegenConfig.name>-generated.cpp` 是自定义 C++ Turbo Native Modules 的粘合代码
- `react/renderer/components/<codegenConfig.name>` 下包含你自定义组件所需的所有粘合代码

若你设置 `codegenConfig.type` 为 `all`，则会得到上述完整结构；若设为 `modules`，则不会生成 `react/renderer/components/` 文件夹；若设为 `components`，则不会生成其他文件。

### iOS

iOS 端 **Codegen** 依赖构建过程中的一些 Node 脚本，这些脚本位于 `SampleApp/node_modules/react-native/scripts/` 文件夹。

主要脚本为 `generate-codegen-artifacts.js`。可在应用根目录运行以下命令调用此脚本：

```bash
node node_modules/react-native/scripts/generate-codegen-artifacts.js

Usage: generate-codegen-artifacts.js -p [path to app] -t [target platform] -o [output path]

Options:
      --help            Show help                                      [boolean]
      --version         Show version number                            [boolean]
  -p, --path            Path to the React Native project root.        [required]
  -t, --targetPlatform  Target platform. Supported values: "android", "ios",
                        "all".                                        [required]
  -o, --outputPath      Path where generated artifacts will be output to.
```

参数说明：

- `--path`：应用根目录路径
- `--outputPath`：**Codegen** 生成文件的输出目录
- `--targetPlatform`：期望生成代码的平台

#### 生成代码结构

执行以下命令：

```shell
node node_modules/react-native/scripts/generate-codegen-artifacts.js \
    --path . \
    --outputPath ios/ \
    --targetPlatform ios
```

会在 `ios/build` 文件夹下生成：

```
build
└── generated
    └── ios
        ├── <codegenConfig.name>
        │   ├── <codegenConfig.name>-generated.mm
        │   └── <codegenConfig.name>.h
        ├── <codegenConfig.name>JSI-generated.cpp
        ├── <codegenConfig.name>JSI.h
        ├── FBReactNativeSpec
        │   ├── FBReactNativeSpec-generated.mm
        │   └── FBReactNativeSpec.h
        ├── FBReactNativeSpecJSI-generated.cpp
        ├── FBReactNativeSpecJSI.h
        ├── RCTModulesConformingToProtocolsProvider.h
        ├── RCTModulesConformingToProtocolsProvider.mm
        └── react
            └── renderer
                └── components
                    └── <codegenConfig.name>
                        ├── ComponentDescriptors.cpp
                        ├── ComponentDescriptors.h
                        ├── EventEmitters.cpp
                        ├── EventEmitters.h
                        ├── Props.cpp
                        ├── Props.h
                        ├── RCTComponentViewHelpers.h
                        ├── ShadowNodes.cpp
                        ├── ShadowNodes.h
                        ├── States.cpp
                        └── States.h
```

部分生成的文件被 React Native 内核使用。除此之外，还有一组与 `package.json` 中 `codegenConfig.name` 字段同名的文件：

- `<codegenConfig.name>/<codegenConfig.name>.h`：自定义 iOS Turbo Native Modules 的接口声明
- `<codegenConfig.name>/<codegenConfig.name>-generated.mm`：自定义 iOS Turbo Native Modules 的粘合代码
- `<codegenConfig.name>JSI.h`：你自定义的 C++ Turbo Native Modules 接口声明
- `<codegenConfig.name>JSI-generated.h`：你自定义的 C++ Turbo Native Modules 粘合代码
- `react/renderer/components/<codegenConfig.name>`：包含你自定义组件所需的所有粘合代码

如果 `codegenConfig.type` 的值为 `all`，则生成上述结构；若设为 `modules`，则不会生成 `react/renderer/components/` 文件夹；若设为 `components`，则不会生成其他文件。