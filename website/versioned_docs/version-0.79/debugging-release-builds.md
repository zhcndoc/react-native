---
id: debugging-release-builds
title: 调试发布版本
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

## 符号化堆栈跟踪

如果 React Native 应用在发布版本中抛出未处理的异常，输出可能会被混淆且难以阅读。

```shell
07-15 10:58:25.820 18979 18998 E AndroidRuntime: FATAL EXCEPTION: mqt_native_modules
07-15 10:58:25.820 18979 18998 E AndroidRuntime: Process: com.awesomeproject, PID: 18979 07-15 10:58:25.820 18979 18998 E AndroidRuntime: com.facebook.react.common.JavascriptException: Failed, js engine: hermes, stack:
07-15 10:58:25.820 18979 18998 E AndroidRuntime: p@1:132161
07-15 10:58:25.820 18979 18998 E AndroidRuntime: p@1:132084
07-15 10:58:25.820 18979 18998 E AndroidRuntime: f@1:131854
07-15 10:58:25.820 18979 18998 E AndroidRuntime: anonymous@1:131119
```

在上述堆栈跟踪中，像 `p@1:132161` 这样的条目是被混淆的函数名和字节码偏移量。为了调试这些调用，我们需要将这些转换为文件、行号和函数名，例如 `AwesomeProject/App.js:54:initializeMap`。这被称为 **符号化（symbolication）。**

你可以通过将堆栈跟踪和生成的源映射传递给 [`metro-symbolicate`](http://npmjs.com/package/metro-symbolicate) 来符号化上述混淆的函数名和字节码。

### 启用源映射

符号化堆栈跟踪需要源映射。确保为目标平台的构建配置中启用了源映射。

<Tabs groupId="platform" queryString defaultValue={constants.defaultPlatform} values={constants.platforms} className="pill-tabs">
<TabItem value="android">

:::info
在 Android 上，源映射默认是 **启用** 的。
:::

要启用源映射生成，请确保 `android/app/build.gradle` 中存在以下 `hermesFlags`。

```groovy
react {
    hermesFlags = ["-O", "-output-source-map"]
}
```

如果操作正确，你应该会在 Metro 构建输出中看到源映射的输出位置。

```text
Writing bundle output to:, android/app/build/generated/assets/react/release/index.android.bundle
Writing sourcemap output to:, android/app/build/intermediates/sourcemaps/react/release/index.android.bundle.packager.map
```

</TabItem>
<TabItem value="ios">

:::info
在 iOS 上，源映射默认是 **禁用** 的。使用以下说明来启用它们。
:::

要启用源映射生成：

- 打开 Xcode 并编辑构建阶段 "Bundle React Native code and images"。
- 在其他 exports 上方，添加一个带有所需输出路径的 `SOURCEMAP_FILE` 条目。

```diff
+ export SOURCEMAP_FILE="$(pwd)/../main.jsbundle.map"
  WITH_ENVIRONMENT="../node_modules/react-native/scripts/xcode/with-environment.sh"
```

如果操作正确，你应该会在 Metro 构建输出中看到源映射的输出位置。

```text
Writing bundle output to:, Build/Intermediates.noindex/ArchiveIntermediates/application/BuildProductsPath/Release-iphoneos/main.jsbundle
Writing sourcemap output to:, Build/Intermediates.noindex/ArchiveIntermediates/application/BuildProductsPath/Release-iphoneos/main.jsbundle.map
```

</TabItem>
</Tabs>

### 使用 `metro-symbolicate`

生成了源映射后，我们现在可以转换堆栈跟踪了。

```shell
# 打印使用说明
npx metro-symbolicate

# 从包含堆栈跟踪的文件
npx metro-symbolicate android/app/build/generated/sourcemaps/react/release/index.android.bundle.map < stacktrace.txt

# 从 adb logcat (Android)
adb logcat -d | npx metro-symbolicate android/app/build/generated/sourcemaps/react/release/index.android.bundle.map
```

### 关于源映射的注意事项

- 构建过程可能会生成多个源映射。确保使用示例中显示位置的那个。
- 确保你使用的源映射与崩溃应用的确切提交对应。源代码的微小更改可能导致偏移量的巨大差异。
- 如果 `metro-symbolicate` 立即成功退出，请确保输入来自管道或重定向，而不是来自终端。
