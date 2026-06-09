---
id: navigation
title: 屏幕间的导航
---

移动应用很少只包含单个屏幕。管理多个屏幕的展示和切换，通常由被称为导航器（navigator）的组件来处理。

本指南介绍 React Native 中可用的各种导航组件。如果你刚开始使用导航，很可能会想使用 [React Navigation](navigation.md#react-navigation)。React Navigation 提供了一个简单明了的导航解决方案，能够在 Android 和 iOS 平台上呈现常见的栈导航和标签页导航模式。

如果你在将 React Native 集成到一个已经原生管理导航的应用中，或者正在寻找 React Navigation 的替代方案，下面的库在两个平台上都提供了原生导航支持：[react-native-navigation](https://github.com/wix/react-native-navigation)。

## React Navigation

社区中的导航方案是一个独立的库，允许开发者用几行代码配置应用的各个屏幕。

### 启动模板

如果你要新建一个项目，可以使用 React Navigation 模板快速通过 [Expo](https://expo.dev/) 创建新项目：

```shell
npx create-expo-app@latest --template react-navigation/template
```

有关如何开始的更多信息，请参阅项目的 `README.md`。

### 安装与设置

首先，需要在项目中安装以下依赖：

```shell
npm install @react-navigation/native @react-navigation/native-stack
```

接下来，安装所需的 peer 依赖。具体命令取决于你的项目是 Expo 管理的还是纯 React Native 项目。

- 如果是 Expo 管理的项目，使用 `expo` 安装依赖：

  ```shell
  npx expo install react-native-screens react-native-safe-area-context
  ```

- 如果是纯 React Native 项目，使用 `npm` 安装依赖：

  ```shell
  npm install react-native-screens react-native-safe-area-context
  ```

  对于 iOS 纯 React Native 项目，请确保安装了 [CocoaPods](https://cocoapods.org/)。然后安装 pods 来完成安装：

  ```shell
  cd ios
  pod install
  cd ..
  ```

安装并配置好依赖后，就可以开始设置你的项目以使用 React Navigation 了。

使用 React Navigation 时，你需要在应用中配置 [导航器](https://reactnavigation.org/docs/glossary-of-terms#navigator)。导航器负责处理屏幕之间的切换，并提供诸如标题栏、标签栏等界面元素。

现在，你可以在设备或模拟器上构建并运行你的应用了。

### 使用方法

现在，你可以创建一个包含主界面和个人资料界面的应用：

```tsx
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

在这个例子中，`RootStack` 是一个包含两个屏幕（`Home` 与 `Profile`）的导航器，屏幕在 `createNativeStackNavigator` 的 `screens` 属性中定义。你可以根据需求定义任意多个屏幕。

你可以通过每个屏幕的 `options` 属性设置诸如屏幕标题等选项。每个屏幕定义也必须有一个 `screen` 属性，该属性为一个 React 组件或另一个导航器。

在每个屏幕组件内部，你可以使用 `useNavigation` 钩子获取 `navigation` 对象，该对象包含多个用于跳转到其他屏幕的方法。例如，可以用 `navigation.navigate` 跳转到 `Profile` 屏幕：

```tsx
import {useNavigation} from '@react-navigation/native';

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <Button
      title="前往 Jane 的个人资料"
      onPress={() =>
        navigation.navigate('Profile', {name: 'Jane'})
      }
    />
  );
}

function ProfileScreen({route}) {
  return <Text>这是 {route.params.name} 的个人资料</Text>;
}
```

这个 `native-stack` 导航器使用了原生 API：iOS 上的 `UINavigationController` 和 Android 上的 `Fragment`，因此用 `createNativeStackNavigator` 构建的导航，在行为和性能上都会与基于这些原生 API 构建的应用相似。

React Navigation 还提供了用于不同导航类型的包，例如标签页和抽屉导航，你可以用它们来实现应用中的各种导航模式。

有关 React Navigation 的完整入门教程，请参考 [React Navigation 入门指南](https://reactnavigation.org/docs/getting-started)。