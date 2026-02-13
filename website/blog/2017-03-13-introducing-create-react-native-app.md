---
title: 介绍 Create React Native App
author: Adam Perry
authorTitle: Expo 软件工程师
authorURL: 'https://github.com/dikaiosune'
authorImageURL: 'https://avatars2.githubusercontent.com/u/6812281'
authorTwitter: dika10sune
tags: [engineering]
youtubeVideoId: 9baaVjGdBqs
---

今天我们发布了 [Create React Native App](https://github.com/react-community/create-react-native-app)：一款让启动 React Native 项目变得更加简单的新工具！它深受 [Create React App](https://github.com/facebookincubator/create-react-app) 设计的启发，是 [Facebook](https://code.facebook.com) 和 [Expo](https://expo.io)（原名 Exponent）合作的成果。

许多开发者在安装和配置 React Native 当前的原生构建依赖时遇到困难，尤其是在 Android 平台。使用 Create React Native App，无需使用 Xcode 或 Android Studio，就能在 Linux 或 Windows 系统上为 iOS 设备开发。这是通过 Expo 应用实现的，该应用加载并运行用纯 JavaScript 编写的 CRNA 项目，无需编译任何原生代码。

尝试创建一个新项目（如果已安装 yarn，请用相应命令替换）：

```sh
$ npm i -g create-react-native-app
$ create-react-native-app my-project
$ cd my-project
$ npm start
```

这将启动 React Native 打包器并打印二维码。用 [Expo 应用](https://expo.io) 打开二维码即可加载你的 JavaScript。`console.log` 的调用会转发到你的终端。你可以使用任何标准的 React Native API 以及 [Expo SDK](https://docs.expo.dev/versions/latest/)。

## 那原生代码怎么办？

许多 React Native 项目有需要编译的 Java 或 Objective-C/Swift 依赖。Expo 应用包含相机、视频、联系人等 API，并捆绑了流行库，比如 [Airbnb 的 react-native-maps](https://docs.expo.dev/versions/latest/sdk/map-view/) 或 [Facebook 认证](https://docs.expo.dev/versions/latest/sdk/facebook/)。不过如果你需要 Expo 未捆绑的原生代码依赖，可能需要自行配置构建。和 Create React App 一样，CRNA 支持“弹出”（eject）。

你可以运行 `npm run eject` 来获得一个非常类似于 `react-native init` 生成的项目。此时你需要使用 Xcode 和/或 Android Studio，使用 `react-native link` 添加库，且能完全控制原生代码的编译过程。

## 有疑问？反馈？

Create React Native App 现在已足够稳定可供通用，欢迎大家分享使用体验！你可以在 [Twitter](https://twitter.com/dika10sune) 上找到我，或者在 [GitHub 仓库](https://github.com/react-community/create-react-native-app) 提交问题。欢迎贡献代码！