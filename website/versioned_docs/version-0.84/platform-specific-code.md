---
id: platform-specific-code
title: 平台特定代码
---

在构建跨平台应用时，您会希望尽可能重用代码。但有些情况下，代码需要有所不同，例如您可能想为 Android 和 iOS 实现不同的视觉组件。

React Native 提供了两种方式来组织代码并按平台区分：

- 使用 [`Platform` 模块](platform-specific-code.md#platform-module)。
- 使用 [平台特定文件扩展名](platform-specific-code.md#platform-specific-extensions)。

某些组件的属性仅在某个平台上有效。所有这些属性都带有 `@platform` 注释，并且在官网页面旁边带有小徽章标识。

## Platform 模块

React Native 提供了一个模块，用以检测应用运行的平台。您可以利用这个检测逻辑来实现平台特定代码。当组件中只有少部分内容是平台特定时，推荐使用此方法。

```tsx
import {Platform, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  height: Platform.OS === 'ios' ? 200 : 100,
});
```

`Platform.OS` 在 iOS 运行时为 `ios`，在 Android 运行时为 `android`。

此外，还有一个 `Platform.select` 方法，它接受一个对象，对象的键可以是 `'ios' | 'android' | 'native' | 'default'`，并返回当前平台最合适的值。也就是说，如果您当前在手机上运行，优先使用 `ios` 和 `android` 键对应的值；如果没有定义，则使用 `native` 键对应的值；再没有则使用 `default` 键。

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
        // 其他平台，例如 Web
        backgroundColor: 'blue',
      },
    }),
  },
});
```

这样，`container` 在所有平台上都有 `flex: 1`，iOS 平台背景色为红色，Android 平台为绿色，其他平台为蓝色。

因为它接受 `any` 类型值，您也可以用它来返回平台特定组件，如下：

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

### 检测 Android 版本 <div className="label android" title="本节与 Android 平台相关">Android</div>

在 Android 上，`Platform` 模块还能用于检测运行应用的 Android 平台版本：

```tsx
import {Platform} from 'react-native';

if (Platform.Version === 25) {
  console.log('运行在 Nougat 系统！');
}
```

**注意**：`Version` 表示的是 Android API 版本，而非 Android 操作系统版本。想查看对应关系，请参考 [Android 版本历史](https://zh.wikipedia.org/wiki/Android 版本历史#概览)。

### 检测 iOS 版本 <div className="label ios" title="本节与 iOS 平台相关">iOS</div>

在 iOS 上，`Version` 来源于 `-[UIDevice systemVersion]`，是一个表示当前操作系统版本的字符串。例如 "10.3"。比如要检测 iOS 的主版本号：

```tsx
import {Platform} from 'react-native';

const majorVersionIOS = parseInt(Platform.Version, 10);
if (majorVersionIOS <= 9) {
  console.log('处理行为变化的兼容逻辑');
}
```

## 平台特定扩展名

当您的平台特定代码较为复杂时，应考虑拆分成不同文件。React Native 会识别以 `.ios.` 或 `.android.` 作为扩展名的文件，并在其他组件导入时自动加载对应的平台文件。

例如，假设项目中有以下文件：

```shell
BigButton.ios.js
BigButton.android.js
```

您可以这样导入组件：

```tsx
import BigButton from './BigButton';
```

React Native 会根据运行平台自动选择正确的文件。

## 原生特定扩展名（即与 NodeJS 和 Web 共享代码）

当一个模块需在 NodeJS/Web 和 React Native 中共享，且不含 Android/iOS 差异时，可以使用 `.native.js` 扩展名。这对于 React Native 和 ReactJS 共享通用代码的项目特别有用。

例如，项目中有如下文件：

```shell
Container.js # 由 webpack、Rollup 或其他 Web 打包器处理
Container.native.js # 由 React Native 打包器（Metro）处理（适用于 Android 和 iOS）
```

导入时仍然不需带 `.native` 后缀，如下：

```tsx
import Container from './Container';
```

**专业提示：** 配置您的 Web 打包器忽略 `.native.js` 扩展名，以避免生产环境包中包含未使用代码，从而减小最终包体积。