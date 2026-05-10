---
id: platform-specific-code
title: 平台特定代码
---

在构建跨平台应用时，你会希望尽可能多地复用代码。可能会出现代码需要不同的情况，例如你可能想要为 Android 和 iOS 实现单独的视觉组件。

React Native 提供了两种组织代码并按平台分离的方式：

- 使用 [`Platform` 模块](platform-specific-code.md#platform-module)。
- 使用 [平台特定的文件扩展名](platform-specific-code.md#platform-specific-extensions)。

某些组件可能具有仅在一个平台上有效的属性。所有这些属性都用 `@platform` 标注，并在网站上旁边有一个小徽章。

## Platform 模块

React Native 提供了一个模块来检测应用运行的平台。你可以使用检测逻辑来实现平台特定的代码。当只有组件的一小部分是平台特定的时，使用此选项。

```tsx
import {Platform, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  height: Platform.OS === 'ios' ? 200 : 100,
});
```

`Platform.OS` 将在 iOS 上运行时为 `ios`，在 Android 上运行时为 `android`。

还有一个可用的 `Platform.select` 方法，给定一个对象，其键可以是 `'ios' | 'android' | 'native' | 'default'` 之一，返回最适合当前运行平台的值。也就是说，如果你在手机上运行，`ios` 和 `android` 键将优先。如果未指定这些，则将使用 `native` 键，然后是 `default` 键。

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

这将导致容器在所有平台上都有 `flex: 1`，在 iOS 上有红色背景色，在 Android 上有绿色背景色，在其他平台上有蓝色背景色。

由于它接受 `any` 值，你也可以用它来返回平台特定的组件，如下所示：

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

在 Android 上，`Platform` 模块还可用于检测应用运行的 Android 平台版本：

```tsx
import {Platform} from 'react-native';

if (Platform.Version === 25) {
  console.log('正在 Nougat 上运行！');
}
```

**注意**：`Version` 设置为 Android API 版本，而不是 Android 操作系统版本。要查找映射，请参阅 [Android 版本历史](https://en.wikipedia.org/wiki/Android_version_history#Overview)。

### 检测 iOS 版本 <div className="label ios">iOS</div>

在 iOS 上，`Version` 是 `-[UIDevice systemVersion]` 的结果，这是一个包含当前操作系统版本的字符串。系统版本的一个示例是 "10.3"。例如，要检测 iOS 上的主版本号：

```tsx
import {Platform} from 'react-native';

const majorVersionIOS = parseInt(Platform.Version, 10);
if (majorVersionIOS <= 9) {
  console.log('绕过行为变更');
}
```

## 平台特定的扩展名

当你的平台特定代码更复杂时，你应该考虑将代码拆分到单独的文件中。当文件具有 `.ios.` 或 `.android.` 扩展名时，React Native 会检测到并在需要从其他组件加载时加载相关的平台文件。

例如，假设你的项目中有以下文件：

```shell
BigButton.ios.js
BigButton.android.js
```

然后你可以按以下方式导入组件：

```tsx
import BigButton from './BigButton';
```

React Native 将根据运行的平台自动选取正确的文件。

## Native 特定的扩展名（即与 NodeJS 和 Web 共享代码）

当模块需要在 NodeJS/Web 和 React Native 之间共享但没有 Android/iOS 差异时，你也可以使用 `.native.js` 扩展名。这对于在 React Native 和 ReactJS 之间共享通用代码的项目特别有用。

例如，假设你的项目中有以下文件：

```shell
Container.js # 由 webpack、Rollup 或任何其他 Web 打包工具选取
Container.native.js # 由 React Native 打包工具为 Android 和 iOS 选取 (Metro)
```

你仍然可以不带 `.native` 扩展名导入它，如下所示：

```tsx
import Container from './Container';
```

**专业提示：** 配置你的 Web 打包器以忽略 `.native.js` 扩展名，以避免在生产包中包含未使用的代码，从而减小最终包的大小。
