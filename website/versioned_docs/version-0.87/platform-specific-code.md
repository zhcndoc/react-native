---
id: platform-specific-code
title: 平台特定代码
---

在构建跨平台应用时，你会希望尽可能多地复用代码。有时可能会出现代码适合有所不同的情况，例如，你可能希望为 Android 和 iOS 实现单独的视觉组件。

React Native 提供了两种组织代码并按平台进行拆分的方式：

- 使用 [`Platform` 模块](platform-specific-code.md#platform-module)
- 使用[平台特定的文件扩展名](platform-specific-code.md#platform-specific-extensions)

某些组件可能具有仅在一个平台上生效的属性。所有这些 props 都标注了 `@platform`，并且在网站上它们旁边有一个小徽章。

## Platform 模块

React Native 提供了一个用于检测应用运行平台的模块。你可以使用检测逻辑来实现平台特定的代码。当组件中只有少量部分与平台相关时，可以使用此选项。

```tsx
import {Platform, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  height: Platform.OS === 'ios' ? 200 : 100,
});
```

在 iOS 上运行时，`Platform.OS` 将为 `ios`，在 Android 上运行时将为 `android`。

此外还有一个可用的 `Platform.select` 方法。给定一个对象（其键可以是 `'ios' | 'android' | 'native' | 'default'`），该方法会返回与你当前运行平台最匹配的值。也就是说，如果你在手机上运行，`ios` 和 `android` 键将优先使用。如果未指定这些键，则会使用 `native` 键，然后使用 `default` 键。

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
        // other platforms, web for example
        backgroundColor: 'blue',
      },
    }),
  },
});
```

这样会使所有平台上的容器都具有 `flex: 1`，在 iOS 上具有红色背景，在 Android 上具有绿色背景，在其他平台上具有蓝色背景。

由于它接受 `any` 值，因此你也可以使用它来返回平台特定的组件，如下所示：

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

在 Android 上，还可以使用 `Platform` 模块检测应用运行所在的 Android Platform 版本：

```tsx
import {Platform} from 'react-native';

if (Platform.Version === 25) {
  console.log('Running on Nougat!');
}
```

**注意**：`Version` 设置的是 Android API 版本，而不是 Android OS 版本。要查找对应关系，请参阅 [Android Version History](https://en.wikipedia.org/wiki/Android_version_history#Overview)。

### 检测 iOS 版本 <div className="label ios">iOS</div>

在 iOS 上，`Version` 是 `-[UIDevice systemVersion]` 的结果，它是一个包含当前操作系统版本的字符串。系统版本的示例是 "10.3"。例如，要检测 iOS 上的主版本号：

```tsx
import {Platform} from 'react-native';

const majorVersionIOS = parseInt(Platform.Version, 10);
if (majorVersionIOS <= 9) {
  console.log('Work around a change in behavior');
}
```

## 平台特定的扩展名

当你的平台特定代码更加复杂时，应考虑将代码拆分到单独的文件中。React Native 会检测文件是否具有 `.ios.` 或 `.android.` 扩展名，并在其他组件需要该文件时加载相应的平台文件。

例如，假设你的项目中有以下文件：

```shell
BigButton.ios.js
BigButton.android.js
```

然后你可以按如下方式导入组件：

```tsx
import BigButton from './BigButton';
```

React Native 会根据运行平台自动选择正确的文件。

## Native 特定的扩展名（即与 NodeJS 和 Web 共享代码）

当某个模块需要在 NodeJS/Web 与 React Native 之间共享，但不存在 Android/iOS 差异时，也可以使用 `.native.js` 扩展名。这对于在 React Native 和 ReactJS 之间共享通用代码的项目尤其有用。

例如，假设你的项目中有以下文件：

```shell
Container.js # picked up by webpack, Rollup or any other Web bundler
Container.native.js # picked up by the React Native bundler for both Android and iOS (Metro)
```

你仍然可以在不使用 `.native` 扩展名的情况下导入它，如下所示：

```tsx
import Container from './Container';
```

**专业提示：**将你的 Web bundler 配置为忽略 `.native.js` 扩展名，以避免未使用的代码进入生产构建包，从而减小最终构建包的大小。
