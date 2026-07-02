---
id: publishing-to-app-store
title: 发布到 Apple App Store
---

import ThemedImage from '@theme/ThemedImage';

The publishing process is the same as any other native iOS app, with some additional considerations to take into account.

:::info
如果你正在使用 Expo，请阅读 Expo 关于 [部署到应用商店](https://docs.expo.dev/distribution/app-stores/) 的指南，以构建并提交你的应用到 Apple App Store。该指南适用于任何 React Native 应用，可自动化部署流程。
:::

### 1. 配置发布方案

为 App Store 构建用于分发的应用时，需要在 Xcode 中使用 `Release` 方案。使用 `Release` 构建的应用会自动禁用应用内 Dev Menu，从而防止用户在生产环境中无意访问该菜单。它还会在本地打包 JavaScript，因此你可以将应用安装到设备上进行测试，而无需连接电脑。

To configure your app to be built using the `Release` scheme, go to **Product** → **Scheme** → **Edit Scheme**. Select the **Run** tab in the sidebar, then set the **Build Configuration** dropdown to `Release`.

<ThemedImage
alt="Docusaurus themed image"
sources={{
    light: '/docs/assets/ConfigureReleaseScheme.png',
    dark: '/docs/assets/ConfigureReleaseSchemeDark.png',
  }}
/>

#### 专业提示

每次你将目标设置为物理设备时，都会生成静态 bundle，即使在 Debug 模式下也是如此。如果你想节省时间，可以通过在 Xcode Build Phase 的 `Bundle React Native code and images` 中添加以下内容来关闭 Debug 下的 bundle 生成：

```shell
 if [ "${CONFIGURATION}" == "Debug" ]; then
  export SKIP_BUNDLING=true
 fi
```

### 2. 构建发布版应用

现在你可以通过点击 <kbd>Cmd ⌘</kbd> + <kbd>B</kbd>，或从菜单栏中选择 **Product** → **Build** 来构建发布版应用。构建为 release 后，你就可以将应用分发给测试人员，并提交到 App Store。

:::info
你也可以使用 `React Native CLI` 执行此操作，使用 `--mode` 选项并将值设为 `Release`（例如，在项目根目录下：`npm run ios -- --mode="Release"` 或 `yarn ios --mode Release`）。
:::

在完成测试并准备发布到 App Store 后，请按照本指南继续操作。

- 打开终端，进入应用的 iOS 文件夹并输入 `open .`。
- 双击 YOUR_APP_NAME.xcworkspace。它应该会启动 Xcode。
- 点击 `Product` → `Archive`。确保将设备设置为 "Any iOS Device (arm64)"。

:::note
检查你的 Bundle Identifier，并确保它与 Apple Developer Dashboard 中的 Identifiers 里创建的完全相同。
:::

- 归档完成后，在归档窗口中点击 `Distribute App`。
- 现在点击 `App Store Connect`（如果你想发布到 App Store）。
- 点击 `Upload` → 确保所有复选框都已选中，然后点击 `Next`。
- 根据你的需求，在 `Automatically manage signing` 和 `Manually manage signing` 之间进行选择。
- 点击 `Upload`。
- 现在你可以在 App Store Connect 的 TestFlight 中找到它。

现在填写必要信息，在 Build Section 中选择应用的构建版本，然后点击 `Save` → `Submit For Review`。

### 3. 截图

Apple Store 要求你提供最新设备的截图。这些设备的参考信息可以在[这里](https://developer.apple.com/help/app-store-connect/reference/screenshot-specifications/)找到。请注意，如果某些显示尺寸的截图已为其他尺寸提供，则这些尺寸的截图可能不需要。
