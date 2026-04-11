---
id: publishing-to-app-store
title: 发布到 Apple App Store
---

发布流程与任何其他原生 iOS 应用相同，但需要考虑到一些额外的事项。

:::info
如果你使用的是 Expo，请阅读 Expo 指南 [部署到应用商店](https://docs.expo.dev/distribution/app-stores/) 以构建并提交你的应用到 Apple App Store。此指南适用于任何 React Native 应用以自动化部署流程。
:::

### 1. 配置发布方案

为在 App Store 分发构建应用需要在 Xcode 中使用 `Release` 方案。为 `Release` 构建的应用将自动禁用应用内开发菜单，这将防止你的用户在生产环境中意外访问该菜单。它还会在本地打包 JavaScript，因此你可以将应用放在设备上测试，而无需连接到计算机。

要配置你的应用使用 `Release` 方案构建，请前往 **Product** → **Scheme** → **Edit Scheme**。在侧边栏中选择 **Run** 选项卡，然后将 Build Configuration 下拉菜单设置为 `Release`。

![](/docs/assets/ConfigureReleaseScheme.png)

#### 专业提示

每次针对物理设备进行构建时都会生成静态包，即使在 Debug 模式下。如果你想节省时间，可以通过在 Xcode Build Phase `Bundle React Native code and images` 的 shell 脚本中添加以下内容来关闭 Debug 模式下的包生成：

```shell
 if [ "${CONFIGURATION}" == "Debug" ]; then
  export SKIP_BUNDLING=true
 fi
```

### 2. 构建发布版本的应用

现在你可以通过按 <kbd>Cmd ⌘</kbd> + <kbd>B</kbd> 或从菜单栏选择 **Product** → **Build** 来构建发布版本的应用。一旦构建完成，你将能够把应用分发给 beta 测试者并提交应用到 App Store。

:::info
你也可以使用 `React Native CLI` 执行此操作，使用选项 `--mode` 并将值设置为 `Release`（例如，从项目根目录：`npm run ios -- --mode="Release"` 或 `yarn ios --mode Release`）。
:::

一旦你完成测试并准备发布到 App Store，请遵循本指南。

- 启动你的终端，导航到你的应用的 iOS 文件夹并输入 `open .`。
- 双击 YOUR_APP_NAME.xcworkspace。它应该会启动 Xcode。
- 点击 `Product` → `Archive`。确保将设备设置为 "Any iOS Device (arm64)"。

:::note
检查你的 Bundle Identifier，确保它与你在 Apple Developer Dashboard 的 Identifiers 中创建的完全一致。
:::

- 归档完成后，在归档窗口中，点击 `Distribute App`。
- 现在点击 `App Store Connect`（如果你想要发布到 App Store）。
- 点击 `Upload` → 确保所有复选框都被选中，点击 `Next`。
- 根据你的需求在 `Automatically manage signing` 和 `Manually manage signing` 之间选择。
- 点击 `Upload`。
- 现在你可以在 App Store Connect 的 TestFlight 下找到它。

现在填写必要的信息，在 Build 部分，选择应用的构建版本然后点击 `Save` → `Submit For Review`。

### 3. 截图

Apple Store 要求你提供最新设备的截图。此类设备的参考信息可以在 [这里](https://developer.apple.com/help/app-store-connect/reference/screenshot-specifications/) 找到。请注意，如果提供了其他尺寸的截图，则不需要某些显示尺寸的截图。
