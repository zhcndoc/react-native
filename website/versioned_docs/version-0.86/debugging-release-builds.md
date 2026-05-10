---
id: debugging-release-builds
title: 调试发布构建
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

## 符号化堆栈跟踪

如果 React Native 应用在发布构建中抛出未处理的异常，输出可能会被混淆并且难以阅读。

```shell
07-15 10:58:25.820 18979 18998 E AndroidRuntime: FATAL EXCEPTION: mqt_native_modules
07-15 10:58:25.820 18979 18998 E AndroidRuntime: Process: com.awesomeproject, PID: 18979 07-15 10:58:25.820 18979 18998 E AndroidRuntime: com.facebook.react.common.JavascriptException: Failed, js engine: hermes, stack:
07-15 10:58:25.820 18979 18998 E AndroidRuntime: p@1:132161
07-15 10:58:25.820 18979 18998 E AndroidRuntime: p@1:132084
07-15 10:58:25.820 18979 18998 E AndroidRuntime: f@1:131854
07-15 10:58:25.820 18979 18998 E AndroidRuntime: anonymous@1:131119
```

在上面的堆栈跟踪中，像 `p@1:132161` 这样的条目是压缩后的函数名和字节码偏移。为了调试这些调用，我们希望将它们转换为文件、行号和函数名，例如 `AwesomeProject/App.js:54:initializeMap`。这称为**符号化**。

你可以通过将堆栈跟踪和生成的 source map 传递给 [`metro-symbolicate`](https://www.npmjs.com/package/metro-symbolicate)，来对类似上面的压缩函数名和字节码进行符号化。

### 启用 source map

符号化堆栈跟踪需要 source map。请确保在目标平台的构建配置中已启用 source map。

<Tabs groupId="platform" queryString defaultValue={constants.defaultPlatform} values={constants.platforms} className="pill-tabs">
<TabItem value="android">

:::info
在 Android 上，source map 默认是**启用**的。
:::

要启用 source map 生成，请确保 `android/app/build.gradle` 中包含以下 `hermesFlags`。

```groovy
react {
    hermesFlags = ["-O", "-output-source-map"]
}
```

如果设置正确，你应该会在 Metro 构建输出中看到 source map 的输出位置。

```text
Writing bundle output to:, android/app/build/generated/assets/react/release/index.android.bundle
Writing sourcemap output to:, android/app/build/intermediates/sourcemaps/react/release/index.android.bundle.packager.map
```

</TabItem>
<TabItem value="ios">

:::info
在 iOS 上，source map 默认是**禁用**的。请使用以下说明来启用它们。
:::

要启用 source map 生成：

- 打开 Xcode 并编辑构建阶段 "Bundle React Native code and images"。
- 在其他导出项上方，添加一个 `SOURCEMAP_FILE` 条目，并设置为所需的输出路径。

```diff
+ export SOURCEMAP_FILE="$(pwd)/../main.jsbundle.map"
  WITH_ENVIRONMENT="../node_modules/react-native/scripts/xcode/with-environment.sh"
```

如果设置正确，你应该会在 Metro 构建输出中看到 source map 的输出位置。

```text
Writing bundle output to:, Build/Intermediates.noindex/ArchiveIntermediates/application/BuildProductsPath/Release-iphoneos/main.jsbundle
Writing sourcemap output to:, Build/Intermediates.noindex/ArchiveIntermediates/application/BuildProductsPath/Release-iphoneos/main.jsbundle.map
```

</TabItem>
</Tabs>

### 使用 `metro-symbolicate`

在生成 source map 后，我们现在可以转换堆栈跟踪了。

```shell
# 打印使用说明
npx metro-symbolicate

# 从包含堆栈跟踪的文件读取
npx metro-symbolicate android/app/build/generated/sourcemaps/react/release/index.android.bundle.map < stacktrace.txt

# 从 adb logcat 读取（Android）
adb logcat -d | npx metro-symbolicate android/app/build/generated/sourcemaps/react/release/index.android.bundle.map
```

### 关于 source map 的注意事项

- 构建过程可能会生成多个 source map。请确保使用示例中显示位置的那个。
- 确保你使用的 source map 对应的是崩溃应用的精确提交版本。源代码中的微小改动可能会导致偏移量出现很大差异。
- 如果 `metro-symbolicate` 立即以成功状态退出，请确保输入来自管道或重定向，而不是来自终端。
