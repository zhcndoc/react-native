---
id: navigation
title: 屏幕之间的导航
---

移动应用很少由单个屏幕构成。管理多个屏幕的展示以及它们之间的切换，通常由所谓的导航器来处理。

本指南介绍了 React Native 中可用的各种导航组件。如果你刚开始接触导航，可能会想使用 [React Navigation](navigation.md#react-navigation)。React Navigation 提供了一种直接的导航解决方案，能够在 Android 和 iOS 上呈现常见的栈式导航和选项卡式导航模式。

如果你是在将 React Native 集成到一个已经原生管理导航的应用中，或者正在寻找 React Navigation 的替代方案，以下库可在两个平台上提供原生导航：[react-native-navigation](https://github.com/wix/react-native-navigation)。

## React Navigation

社区提供的导航方案是一个独立库，允许开发者用寥寥几行代码为应用设置各个屏幕。

### 起始模板

如果你正在开始一个新项目，可以使用 React Navigation 模板，通过 [Expo](https://expo.dev/) 快速搭建一个新项目：

```shell
npx create-expo-app@latest --template react-navigation/template
```

有关如何开始的更多信息，请参阅项目的 `README.md`。

### 安装和设置

首先，你需要在项目中安装它们：

```shell
npm install @react-navigation/native @react-navigation/native-stack
```

接下来，安装所需的同级依赖。你需要根据项目是 Expo 托管项目还是裸 React Native 项目，运行不同的命令。

- 如果你有一个 Expo 托管项目，请使用 `expo` 安装依赖：

  ```shell
  npx expo install react-native-screens react-native-safe-area-context
  ```

- 如果你有一个裸 React Native 项目，请使用 `npm` 安装依赖：

  ```shell
  npm install react-native-screens react-native-safe-area-context
  ```

  对于裸 React Native 项目的 iOS，请确保你已安装 [CocoaPods](https://cocoapods.org/)。然后安装 pods 以完成安装：

  ```shell
  cd ios
  pod install
  cd ..
  ```

一旦你安装并配置好这些依赖，就可以继续设置项目以使用 React Navigation。

使用 React Navigation 时，你需要在应用中配置 [导航器](https://reactnavigation.org/docs/glossary-of-terms#navigator)。导航器负责处理应用中屏幕之间的切换，并提供诸如 header、tab bar 等 UI。

现在你已经准备好在设备/模拟器上构建并运行你的应用了。

### 用法

现在你可以创建一个包含主页和个人资料页面的应用：

```tsx
import * as React from 'react';
import {createStaticNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const RootStack = createNativeStackNavigator({
  screens: {
    Home: {
      screen: HomeScreen,
      options: {title: '欢迎'},
    },
    Profile: {
      screen: ProfileScreen,
    },
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
```

在这个示例中，`RootStack` 是一个包含 2 个屏幕（`Home` 和 `Profile`）的导航器，它们在 `createNativeStackNavigator` 的 `screens` 属性中定义。同样地，你可以定义任意多的屏幕。

你可以在每个屏幕的 `options` 属性中指定诸如屏幕标题之类的选项。每个屏幕定义还需要一个 `screen` 属性，它是一个 React 组件或另一个导航器。

在每个屏幕组件内部，你可以使用 `useNavigation` Hook 获取 `navigation` 对象，它包含了链接到其他屏幕的各种方法。例如，你可以使用 `navigation.navigate` 前往 `Profile` 屏幕：

```tsx
import {useNavigation} from '@react-navigation/native';

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <Button
      title="转到 Jane 的个人资料"
      onPress={() =>
        navigation.navigate('Profile', {name: 'Jane'})
      }
    />
  );
}

function ProfileScreen({route}) {
  return <Text>这就是 {route.params.name} 的个人资料</Text>;
}
```

这个 `native-stack` 导航器使用原生 API：iOS 上的 `UINavigationController` 和 Android 上的 `Fragment`，因此使用 `createNativeStackNavigator` 构建的导航将表现一致，并且具有与基于这些 API 原生构建的应用相似的性能特征。

React Navigation 还为不同类型的导航器提供了包，例如 tabs 和 drawer。你可以使用它们在你的应用中实现各种模式。

若要完整了解 React Navigation，请参阅 [React Navigation 入门指南](https://reactnavigation.org/docs/getting-started)。
