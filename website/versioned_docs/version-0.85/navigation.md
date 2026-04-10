---
id: navigation
title: 屏幕间导航
---

移动应用很少由单个屏幕组成。管理多个屏幕的展示以及屏幕之间的过渡通常由所谓的导航器（navigator）处理。

本指南涵盖了 React Native 中可用的各种导航组件。如果你刚开始接触导航，你可能会想要使用 [React Navigation](navigation.md#react-navigation)。React Navigation 提供了一个直接的导航解决方案，能够在 Android 和 iOS 上呈现常见的栈导航和标签页导航模式。

如果你正在将 React Native 集成到一个已经原生管理导航的应用中，或者正在寻找 React Navigation 的替代方案，以下库在两个平台上都提供了原生导航：[react-native-navigation](https://github.com/wix/react-native-navigation)。

## React Navigation

社区的导航解决方案是一个独立的库，允许开发者用几行代码设置应用的屏幕。

### 入门模板

如果你正在启动一个新项目，你可以使用 React Navigation 模板通过 [Expo](https://expo.dev/) 快速设置一个新项目：

```shell
npx create-expo-app@latest --template react-navigation/template
```

查看项目的 `README.md` 以获取有关如何开始的更多信息。

### 安装和设置

首先，你需要将它们安装到你的项目中：

```shell
npm install @react-navigation/native @react-navigation/native-stack
```

接下来，安装所需的 peer 依赖。你需要根据你的项目是 Expo 托管项目还是裸 React Native 项目来运行不同的命令。

- 如果你有一个 Expo 托管项目，使用 `expo` 安装依赖：

  ```shell
  npx expo install react-native-screens react-native-safe-area-context
  ```

- 如果你有一个裸 React Native 项目，使用 `npm` 安装依赖：

  ```shell
  npm install react-native-screens react-native-safe-area-context
  ```

  对于带有裸 React Native 项目的 iOS，确保你已安装 [CocoaPods](https://cocoapods.org/)。然后安装 pods 以完成安装：

  ```shell
  cd ios
  pod install
  cd ..
  ```

一旦你安装并配置好依赖，就可以继续设置项目以使用 React Navigation。

使用 React Navigation 时，你在应用中配置 [导航器](https://reactnavigation.org/docs/glossary-of-terms#navigator)。导航器处理应用中屏幕之间的过渡，并提供诸如头部、标签栏等 UI。

现在你可以准备在设备/模拟器上构建并运行你的应用了。

### 用法

现在你可以创建一个带有主屏幕和个人资料屏幕的应用：

```tsx
import * as React from 'react';
import {createStaticNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const RootStack = createNativeStackNavigator({
  screens: {
    Home: {
      screen: HomeScreen,
      options: {title: 'Welcome'},
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

在这个例子中，`RootStack` 是一个包含 2 个屏幕（`Home` 和 `Profile`）的导航器，定义在 `createNativeStackNavigator` 的 `screens` 属性中。同样，你可以定义任意数量的屏幕。

你可以在每个屏幕的 `options` 属性中指定选项，例如每个屏幕的屏幕标题。每个屏幕定义还需要一个 `screen` 属性，它是一个 React 组件或另一个导航器。

在每个屏幕组件内部，你可以使用 `useNavigation` Hook 来获取 `navigation` 对象，该对象具有各种方法来链接到其他屏幕。例如，你可以使用 `navigation.navigate` 跳转到 `Profile` 屏幕：

```tsx
import {useNavigation} from '@react-navigation/native';

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <Button
      title="Go to Jane's profile"
      onPress={() =>
        navigation.navigate('Profile', {name: 'Jane'})
      }
    />
  );
}

function ProfileScreen({route}) {
  return <Text>This is {route.params.name}'s profile</Text>;
}
```

这个 `native-stack` 导航器使用原生 API：iOS 上的 `UINavigationController` 和 Android 上的 `Fragment`，因此使用 `createNativeStackNavigator` 构建的导航将与基于这些 API 原生构建的应用具有相同的行为和相似的性能特征。

React Navigation 还有用于不同类型导航器的包，例如标签页和抽屉。你可以使用它们在你的应用中实现各种模式。

关于 React Navigation 的完整介绍，请参阅 [React Navigation 入门指南](https://reactnavigation.org/docs/getting-started)。
