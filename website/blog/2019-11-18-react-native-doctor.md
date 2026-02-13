---
title: 认识 Doctor —— 一个新的 React Native 命令
author: Lucas Bento
authorTitle: React Native 社区
authorURL: 'https://twitter.com/lbentosilva'
authorImageURL: 'https://avatars3.githubusercontent.com/u/6207220?s=460&v=4'
authorTwitter: lbentosilva
tags: [公告]
---

在 React Native 社区 6 位贡献者提交了 20 多个拉取请求后，我们很高兴推出 `react-native doctor`，这是一个新命令，旨在帮助你开始使用、排查问题并自动修复开发环境中的错误。`doctor` 命令的设计灵感主要来源于 [Expo](https://expo.io/) 和 [Homebrew](https://brew.sh/) 自带的 doctor 命令，同时 UI 上借鉴了 [Jest](https://jestjs.io/) 的风格。

<!--truncate-->

下面是它的演示：

<p style={{textAlign: 'center'}}>
  <video width={700} controls="controls" autoPlay style={{borderRadius: 5}}>
    <source type="video/mp4" src="/img/homepage/DoctorCommand.mp4" />
  </video>
</p>

## 它是如何工作的

`doctor` 命令目前支持大部分 React Native 依赖的软件和库，比如 CocoaPods、Xcode 和 Android SDK。使用 `doctor`，我们可以检测你的开发环境中的问题，并提供自动修复的选项。如果 `doctor` 无法修复某个问题，它会展示一条信息和一个有用的链接，指导你如何手动修复，示例如下：

<p style={{textAlign: 'center'}}>
  <img width={700} src="/img/DoctorManualInstallationMessage.png" alt="Doctor 命令，带有指向 Android SDK 安装帮助的链接" title="Doctor 命令，带有指向 Android SDK 安装帮助的链接" />
</p>

## 现在就试试吧

`doctor` 命令作为 React Native 0.62 的一部分已经提供。不过，你也可以在不升级的情况下试用它：

```sh
npx @react-native-community/cli doctor
```

## 当前支持哪些检查

`doctor` 目前支持以下检查：

- Node.js（>= 8.3）
- yarn（>= 1.10）
- npm（>= 4）
- Watchman（>= 4），用于开发模式下监视文件系统的变动。

针对 Android 环境：

- Android SDK（>= 26），Android 的软件运行环境。
- Android NDK（>= 19），Android 的原生开发工具包。
- `ANDROID_HOME`，Android SDK 配置所需的环境变量。

针对 iOS 环境：

- Xcode（>= 10），用于开发、构建和发布 iOS 应用的 IDE。
- CocoaPods，iOS 应用的库依赖管理工具。
- ios-deploy（可选），CLI 内部使用的库，用于安装应用到真机 iOS 设备。

## 致谢

非常感谢 React Native 社区对此项目的贡献，尤其感谢 [@thymikee](https://github.com/thymikee)、[@thib92](https://github.com/thib92)、[@jmeistrich](https://github.com/jmeistrich)、[@tido64](https://github.com/tido64) 和 [@rickhanlonii](https://github.com/rickhanlonii)。