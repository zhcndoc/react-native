---
id: platform-specific-code
title: 平台特定代码
---

当构建跨平台应用时，你会希望尽可能复用代码。在某些情况下，代码需要有所不同是合理的，例如你可能希望为 Android 和 iOS 实现不同的视觉组件。

React Native 提供了两种方式来组织代码并按平台进行区分：

- 使用 [`Platform` 模块](platform-specific-code.md#platform-module)。
- 使用 [平台特定的文件扩展名](platform-specific-code.md#platform-specific-extensions)。

某些组件可能只有在某个平台上才可用某些属性。所有这些 props 都标注了 `@platform`，并且在网站上它们旁边会显示一个小徽章。

## Platform 模块

React Native 提供了一个模块来检测应用正在运行的平台。你可以使用这个检测逻辑来实现平台特定代码。当只有组件的一小部分是平台特定时，请使用此选项。

```tsx
import {Platform, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  height: Platform.OS === 'ios' ? 200 : 100,
});
```

`Platform.OS` 在 iOS 上运行时会是 `ios`，在 Android 上运行时会是 `android`。

此外还有一个可用的 `Platform.select` 方法，它会根据一个对象返回最适合当前运行平台的值，其中键可以是 `'ios' | 'android' | 'native' | 'default'` 之一。也就是说，如果你在手机上运行，`ios` 和 `android` 键会优先。如果未指定这些键，则会使用 `native` 键，然后再使用 `default` 键。

```tsx
import {Platform, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...Platform.select({
      ios: {
        backgroundColor: 'red',
      },
      android: {
        backgroundColor: 'green',
      },
      default: {
        // 其他平台，例如 web
        backgroundColor: 'blue',
      },
    }),
  },
});
```

这将使容器在所有平台上都具有 `flex: 1`，在 iOS 上有红色背景，在 Android 上有绿色背景，在其他平台上有蓝色背景。

由于它接受 `any` 值，你也可以用它来返回平台特定组件，如下所示：

```tsx
const Component = Platform.select({
  ios: () => require('ComponentIOS'),
  android: () => require('ComponentAndroid'),
})();

<Component />;
```

```tsx
const Component = Platform.select({
  native: () => require('ComponentForNative'),
  default: () => require('ComponentForWeb'),
})();

<Component />;
```

### 检测 Android 版本 <div className="label android">Android</div>

在 Android 上，`Platform` 模块也可用于检测应用运行所在的 Android 平台版本：

```tsx
import {Platform} from 'react-native';

if (Platform.Version === 25) {
  console.log('运行在 Nougat 上！');
}
```

**注意**：`Version` 设置的是 Android API 版本，而不是 Android OS 版本。要查找对应关系，请参阅 [Android 版本历史](https://en.wikipedia.org/wiki/Android_version_history#Overview)。

### 检测 iOS 版本 <div className="label ios">iOS</div>

在 iOS 上，`Version` 的值来自 `-[UIDevice systemVersion]`，它是一个包含当前操作系统版本的字符串。系统版本的一个示例是 "10.3"。例如，要检测 iOS 上的主版本号：

```tsx
import {Platform} from 'react-native';

const majorVersionIOS = parseInt(Platform.Version, 10);
if (majorVersionIOS <= 9) {
  console.log('处理行为变更的兼容方案');
}
```

## 平台特定扩展

当你的平台特定代码更复杂时，你应该考虑将代码拆分到单独的文件中。React Native 会检测文件是否具有 `.ios.` 或 `.android.` 扩展名，并在其他组件引用时加载相应的平台文件。

例如，假设你的项目中有以下文件：

```shell
BigButton.ios.js
BigButton.android.js
```

然后你可以按如下方式导入该组件：

```tsx
import BigButton from './BigButton';
```

React Native 会根据当前运行平台自动选择正确的文件。

## 原生特定扩展（即与 NodeJS 和 Web 共享代码）

当某个模块需要在 NodeJS/Web 和 React Native 之间共享，但又没有 Android/iOS 差异时，你也可以使用 `.native.js` 扩展名。这对于在 React Native 和 ReactJS 之间共享公共代码的项目尤其有用。

例如，假设你的项目中有以下文件：

```shell
Container.js # 被 webpack、Rollup 或任何其他 Web 打包器选中
Container.native.js # 被 React Native 打包器用于 Android 和 iOS（Metro）选中
```

你仍然可以不带 `.native` 扩展名来导入它，如下所示：

```tsx
import Container from './Container';
```

**小提示：** 配置你的 Web 打包器忽略 `.native.js` 扩展名，以避免生产包中包含未使用的代码，从而减小最终包体积。
