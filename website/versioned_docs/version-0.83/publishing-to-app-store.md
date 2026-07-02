---
id: publishing-to-app-store
title: 发布到 Apple App Store
---

import ThemedImage from '@theme/ThemedImage';

The publishing process is the same as any other native iOS app, with some additional considerations to take into account.

:::info
如果你使用的是 Expo，请查阅 Expo 的[发布到应用商店指南](https://docs.expo.dev/distribution/app-stores/)，以构建并提交你的应用到 Apple App Store。本指南适用于任何 React Native 应用，可实现自动化部署流程。
:::

### 1. 配置发布方案

构建用于 App Store 分发的应用需要在 Xcode 中使用 `Release` 方案。使用 `Release` 构建的应用会自动禁用应用内的开发菜单，从而防止用户在生产环境中误触该菜单。同时，它会将 JavaScript 本地打包，这样你即可将应用安装到设备上，在未连接电脑的情况下进行测试。

To configure your app to be built using the `Release` scheme, go to **Product** → **Scheme** → **Edit Scheme**. Select the **Run** tab in the sidebar, then set the **Build Configuration** dropdown to `Release`.

<ThemedImage
alt="Docusaurus themed image"
sources={{
    light: '/docs/assets/ConfigureReleaseScheme.png',
    dark: '/docs/assets/ConfigureReleaseSchemeDark.png',
  }}
/>

#### 专业提示

静态包每次针对物理设备构建时都会生成，即使是在 Debug 模式下。如果想节省时间，可以通过在 Xcode 构建阶段 `Bundle React Native code and images` 的 shell 脚本中添加如下内容，关闭 Debug 模式下的打包生成：

```shell
 if [ "${CONFIGURATION}" == "Debug" ]; then
  export SKIP_BUNDLING=true
 fi
```

### 2. 构建发布版本应用

现在你可以通过按 <kbd>Cmd ⌘</kbd> + <kbd>B</kbd> 或从菜单栏选择 **Product** → **Build** 构建发布版本的应用。构建完成后，你可以将应用分发给测试人员或者提交到 App Store。

:::info
你也可以使用 `React Native CLI` 通过 `--mode` 选项指定值为 `Release` 来执行这一步（例如，在项目根目录运行：`npm run ios -- --mode="Release"` 或 `yarn ios --mode Release`）。
:::

测试完成并准备发布到 App Store 后，请按照以下步骤操作：

- 打开终端，进入你的应用的 iOS 文件夹，输入 `open .`。
- 双击 YOUR_APP_NAME.xcworkspace，启动 Xcode。
- 点击 `Product` → `Archive`。确保将设备设置为 "Any iOS Device (arm64)"。

:::note
检查你的 Bundle Identifier，确保它与 Apple 开发者后台的标识符完全一致。
:::

- 存档完成后，在存档窗口点击 `Distribute App`。
- 选择 `App Store Connect`（如果你想发布到 App Store）。
- 点击 `Upload` → 确认所有复选框已选中，点击 `Next`。
- 根据需要选择 `Automatically manage signing` 或 `Manually manage signing`。
- 点击 `Upload`。
- 现在你可以在 App Store Connect 的 TestFlight 中找到它。

接着填写必要的信息，在 Build 部分选择应用构建版本，点击 `Save` → `Submit For Review`。

### 3. 截图

苹果商店要求你为最新设备提供截图。支持设备的参考信息见[此处](https://developer.apple.com/help/app-store-connect/reference/screenshot-specifications/)。注意，如果某些屏幕尺寸已提供截图，部分尺寸的截图则不必重复提交。