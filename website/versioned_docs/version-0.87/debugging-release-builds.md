---
id: debugging-release-builds
title: 调试发布版本
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

## 符号化堆栈跟踪

如果 React Native 应用在发布版本中抛出未处理的异常，输出内容可能会经过混淆，难以阅读。

```shell
07-15 10:58:25.820 18979 18998 E AndroidRuntime: FATAL EXCEPTION: mqt_native_modules
07-15 10:58:25.820 18979 18998 E AndroidRuntime: Process: com.awesomeproject, PID: 18979 07-15 10:58:25.820 18979 18998 E AndroidRuntime: com.facebook.react.common.JavascriptException: Failed, js engine: hermes, stack:
07-15 10:58:25.820 18979 18998 E AndroidRuntime: p@1:132161
07-15 10:58:25.820 18979 18998 E AndroidRuntime: p@1:132084
07-15 10:58:25.820 18979 18998 E AndroidRuntime: f@1:131854
07-15 10:58:25.820 18979 18998 E AndroidRuntime: anonymous@1:131119
```

在上面的堆栈跟踪中，像 `p@1:132161` 这样的条目是经过压缩的函数名称和字节码偏移量。为了调试这些调用，我们希望将其转换为文件、行号和函数名称，例如 `AwesomeProject/App.js:54:initializeMap`。这称为 **symbolication**。

你可以通过将堆栈跟踪和生成的 source map 传递给 [`metro-symbolicate`](https://www.npmjs.com/package/metro-symbolicate)，来对上述经过压缩的函数名称和字节码进行 symbolicate。

### 启用 source maps

要对堆栈跟踪进行 symbolicate，需要使用 source maps。请确保在目标平台的构建配置中启用了 source maps。

<Tabs groupId="platform" queryString defaultValue={constants.defaultPlatform} values={constants.platforms} className="pill-tabs">
<TabItem value="android">

:::info
在 Android 上，source maps 默认**已启用**。
:::

要启用 source map 生成，请确保 `android/app/build.gradle` 中存在以下 `hermesFlags`。

```groovy
react {
    hermesFlags = ["-O", "-output-source-map"]
}
```

如果配置正确，你应该会在 Metro 构建输出中看到 source map 的输出位置。

```text
Writing bundle output to:, android/app/build/generated/assets/react/release/index.android.bundle
Writing sourcemap output to:, android/app/build/intermediates/sourcemaps/react/release/index.android.bundle.packager.map
```

</TabItem>
<TabItem value="ios">

:::info
在 iOS 上，source maps 默认**已禁用**。请按照以下说明启用它们。
:::

要启用 source map 生成：

- 打开 Xcode 并编辑构建阶段“Bundle React Native code and images”。
- 在其他导出项上方添加一个 `SOURCEMAP_FILE` 条目，并指定所需的输出路径。

```diff
+ export SOURCEMAP_FILE="$(pwd)/../main.jsbundle.map"
  WITH_ENVIRONMENT="../node_modules/react-native/scripts/xcode/with-environment.sh"
```

如果配置正确，你应该会在 Metro 构建输出中看到 source map 的输出位置。

```text
Writing bundle output to:, Build/Intermediates.noindex/ArchiveIntermediates/application/BuildProductsPath/Release-iphoneos/main.jsbundle
Writing sourcemap output to:, Build/Intermediates.noindex/ArchiveIntermediates/application/BuildProductsPath/Release-iphoneos/main.jsbundle.map
```

</TabItem>
</Tabs>

### 使用 `metro-symbolicate`

生成 source maps 后，我们现在可以转换堆栈跟踪。

```shell
# Print usage instructions
npx metro-symbolicate

# From a file containing the stack trace
npx metro-symbolicate android/app/build/generated/sourcemaps/react/release/index.android.bundle.map < stacktrace.txt

# From adb logcat (Android)
adb logcat -d | npx metro-symbolicate android/app/build/generated/sourcemaps/react/release/index.android.bundle.map
```

### 关于 source maps 的说明

- 构建过程可能会生成多个 source maps。请确保使用示例中所示位置的 source map。
- 请确保你使用的 source map 对应发生崩溃的应用的确切提交。源代码中的细微更改可能会导致偏移量产生较大差异。
- 如果 `metro-symbolicate` 立即成功退出，请确保输入来自管道或重定向，而不是终端。
