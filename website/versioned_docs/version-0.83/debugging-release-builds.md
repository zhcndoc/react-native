---
id: debugging-release-builds
title: 调试发布版本
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

## 符号化堆栈追踪

如果 React Native 应用在发布版本中抛出了未处理的异常，输出可能会被混淆且难以阅读。

```shell
07-15 10:58:25.820 18979 18998 E AndroidRuntime: FATAL EXCEPTION: mqt_native_modules
07-15 10:58:25.820 18979 18998 E AndroidRuntime: Process: com.awesomeproject, PID: 18979 07-15 10:58:25.820 18979 18998 E AndroidRuntime: com.facebook.react.common.JavascriptException: Failed, js engine: hermes, stack:
07-15 10:58:25.820 18979 18998 E AndroidRuntime: p@1:132161
07-15 10:58:25.820 18979 18998 E AndroidRuntime: p@1:132084
07-15 10:58:25.820 18979 18998 E AndroidRuntime: f@1:131854
07-15 10:58:25.820 18979 18998 E AndroidRuntime: anonymous@1:131119
```

在上述堆栈追踪中，类似 `p@1:132161` 的条目是被压缩的函数名称和字节码偏移量。为了调试这些调用，我们希望能将其转换为文件、行号和函数名，例如 `AwesomeProject/App.js:54:initializeMap`。这称为**符号化（symbolication）**。

你可以通过传递堆栈追踪和生成的源码映射文件给 [`metro-symbolicate`](https://www.npmjs.com/package/metro-symbolicate) 来符号化上述压缩的函数名和字节码。

### 启用源码映射

符号化堆栈追踪需要源码映射。请确保在目标平台的构建配置中启用了源码映射。

<Tabs groupId="platform" queryString defaultValue={constants.defaultPlatform} values={constants.platforms} className="pill-tabs">
<TabItem value="android">

:::info
在 Android 上，源码映射默认**启用**。
:::

要启用源码映射生成，请确保在 `android/app/build.gradle` 中包含如下的 `hermesFlags` 配置。

```groovy
react {
    hermesFlags = ["-O", "-output-source-map"]
}
```

如果配置正确，你应该能在 Metro 构建输出中看到源码映射的输出位置。

```text
Writing bundle output to:, android/app/build/generated/assets/react/release/index.android.bundle
Writing sourcemap output to:, android/app/build/intermediates/sourcemaps/react/release/index.android.bundle.packager.map
```

</TabItem>
<TabItem value="ios">

:::info
在 iOS 上，源码映射默认**禁用**。请按照以下说明将其启用。
:::

启用源码映射生成的方法：

- 打开 Xcode 并编辑构建阶段“Bundle React Native code and images”。
- 在其他 export 语句之前，添加一个 `SOURCEMAP_FILE` 条目，指定期望的输出路径。

```diff
+ export SOURCEMAP_FILE="$(pwd)/../main.jsbundle.map"
  WITH_ENVIRONMENT="../node_modules/react-native/scripts/xcode/with-environment.sh"
```

如果配置正确，你应该能在 Metro 构建输出中看到源码映射的输出位置。

```text
Writing bundle output to:, Build/Intermediates.noindex/ArchiveIntermediates/application/BuildProductsPath/Release-iphoneos/main.jsbundle
Writing sourcemap output to:, Build/Intermediates.noindex/ArchiveIntermediates/application/BuildProductsPath/Release-iphoneos/main.jsbundle.map
```

</TabItem>
</Tabs>

### 使用 `metro-symbolicate`

启用源码映射生成后，我们就可以翻译堆栈追踪了。

```shell
# 显示使用说明
npx metro-symbolicate

# 从包含堆栈追踪的文件中读取
npx metro-symbolicate android/app/build/generated/sourcemaps/react/release/index.android.bundle.map < stacktrace.txt

# 从 adb logcat （Android）读取
adb logcat -d | npx metro-symbolicate android/app/build/generated/sourcemaps/react/release/index.android.bundle.map
```

### 关于源码映射的注意事项

- 构建过程中可能会生成多个源码映射。请确保使用示例中所示路径的那个源码映射。
- 确保使用的源码映射对应崩溃应用的精确提交版本。源码的微小变动可能导致偏移量产生巨大差异。
- 如果 `metro-symbolicate` 立即成功退出，确保输入来自管道或重定向，而非终端交互。