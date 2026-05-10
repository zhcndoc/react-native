---
id: platform-specific-code
title: 平台特定代码
---

在构建跨平台应用时，你会希望尽可能复用更多代码。有些场景下，代码需要有所不同才更合理，例如，你可能希望为 Android 和 iOS 分别实现不同的视觉组件。

React Native 提供了两种方式来组织代码，并按平台进行拆分：

- 使用 [`Platform` 模块](platform-specific-code.md#platform-module)。
- 使用 [平台特定的文件扩展名](platform-specific-code.md#platform-specific-extensions)。

某些组件可能拥有只在一个平台上有效的属性。这些 props 都会标注 `@platform`，并在网站上在其旁边显示一个小徽标。

## Platform 模块

React Native 提供了一个模块，用于检测应用正在运行的平台。你可以使用这种检测逻辑来实现平台特定代码。当组件中只有很小一部分是平台特定时，适合使用这种方式。

```tsx
import {Platform, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  height: Platform.OS === 'ios' ? 200 : 100,
});
```

当运行在 iOS 上时，`Platform.OS` 的值将是 `ios`；当运行在 Android 上时，将是 `android`。

此外，还提供了 `Platform.select` 方法：它接收一个对象，其中键可以是 `'ios' | 'android' | 'native' | 'default'` 之一，并返回最适合当前运行平台的值。也就是说，如果你运行在手机上，`ios` 和 `android` 键会优先匹配；如果未指定这些键，则会使用 `native` 键，然后再使用 `default` 键。

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

这将使容器在所有平台上都具有 `flex: 1`，在 iOS 上背景色为红色，在 Android 上背景色为绿色，而在其他平台上背景色为蓝色。

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

在 Android 上，`Platform` 模块也可以用来检测应用正在运行的 Android 平台版本：

```tsx
import {Platform} from 'react-native';

if (Platform.Version === 25) {
  console.log('运行在 Nougat 上！');
}
```

**注意**：`Version` 设置的是 Android API 版本，而不是 Android 操作系统版本。要查找对应关系，请参考 [Android Version History](https://en.wikipedia.org/wiki/Android_version_history#Overview)。

### 检测 iOS 版本 <div className="label ios">iOS</div>

在 iOS 上，`Version` 的值来自 `-[UIDevice systemVersion]`，它是一个表示当前操作系统版本的字符串。系统版本的一个示例是 "10.3"。例如，要检测 iOS 的主版本号：

```tsx
import {Platform} from 'react-native';

const majorVersionIOS = parseInt(Platform.Version, 10);
if (majorVersionIOS <= 9) {
  console.log('解决行为变化带来的问题');
}
```

## 平台特定扩展名

当平台特定代码更加复杂时，你应该考虑将代码拆分到独立文件中。React Native 会检测文件是否具有 `.ios.` 或 `.android.` 扩展名，并在其他组件引用时加载相应的平台文件。

例如，假设你的项目中有以下文件：

```shell
BigButton.ios.js
BigButton.android.js
```

然后你可以按如下方式导入该组件：

```tsx
import BigButton from './BigButton';
```

React Native 会根据运行平台自动选择正确的文件。

## 原生特定扩展名（即与 NodeJS 和 Web 共享代码）

当某个模块需要在 NodeJS/Web 和 React Native 之间共享，但没有 Android/iOS 差异时，你也可以使用 `.native.js` 扩展名。这对于在 React Native 和 ReactJS 之间共享公共代码的项目尤其有用。

例如，假设你的项目中有以下文件：

```shell
Container.js # 被 webpack、Rollup 或其他任何 Web 打包器选中
Container.native.js # 被 React Native 打包器在 Android 和 iOS 上选中（Metro）
```

你仍然可以不带 `.native` 扩展名来导入它，如下所示：

```tsx
import Container from './Container';
```

**专业提示：** 配置你的 Web 打包器忽略 `.native.js` 扩展名，以避免生产包中包含未使用的代码，从而减小最终打包体积。
