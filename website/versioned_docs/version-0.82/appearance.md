---
id: appearance
title: 外观
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

```tsx
import {Appearance} from 'react-native';
```

`Appearance` 模块暴露了关于用户外观偏好的信息，例如他们首选的配色方案（浅色或深色）。

#### 开发者说明

<Tabs groupId="guide" queryString defaultValue="web" values={constants.getDevNotesTabs(["android", "ios", "web"])}>

<TabItem value="web">

:::info
`Appearance` API 灵感来自 W3C 的 [Media Queries draft](https://drafts.csswg.org/mediaqueries-5/)。配色方案偏好建模自 [`prefers-color-scheme` CSS media feature](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)。
:::

</TabItem>
<TabItem value="android">

:::info
在 Android 10（API level 29）及更高版本的设备上，配色方案偏好将映射到用户的浅色或 [深色主题](https://developer.android.com/guide/topics/ui/look-and-feel/darktheme) 偏好。
:::

</TabItem>
<TabItem value="ios">

:::info
在 iOS 13 及更高版本的设备上，配色方案偏好将映射到用户的浅色或 [深色模式](https://developer.apple.com/design/human-interface-guidelines/ios/visual-design/dark-mode/) 偏好。
:::

:::note
截取屏幕时，默认情况下，配色方案可能会在浅色和深色模式之间闪烁。这是因为 iOS 会在两种配色方案上拍摄快照，而使用配色方案更新用户界面是异步的。
:::

</TabItem>
</Tabs>

## 示例

你可以使用 `Appearance` 模块来确定用户是否偏好深色配色方案：

```tsx
const colorScheme = Appearance.getColorScheme();
if (colorScheme === 'dark') {
  // 使用深色配色方案
}
```

虽然配色方案立即可用，但它可能会发生变化（例如在日出或日落时计划的配色方案更改）。任何依赖于用户首选配色方案的渲染逻辑或样式都应尝试在每次渲染时调用此函数，而不是缓存该值。例如，你可以使用 [`useColorScheme`](usecolorscheme) React hook，因为它提供并订阅配色方案更新，或者你可以使用内联样式，而不是在 `StyleSheet` 中设置值。

---

# 参考

## 方法

### `getColorScheme()`

```tsx
static getColorScheme(): 'light' | 'dark' | null;
```

表示当前用户首选的配色方案。该值可能会稍后更新，要么通过直接用户操作（例如设备设置中的主题选择或通过 `setColorScheme` 选择的应用程序级用户界面样式），要么按计划（例如遵循昼夜循环的浅色和深色主题）。

支持的配色方案：

- `'light'`：用户偏好浅色主题。
- `'dark'`：用户偏好深色主题。
- `null`：用户未指示首选配色主题。

另见：`useColorScheme` hook。

:::note
`getColorScheme()` 在使用 Chrome 调试时将始终返回 `light`。
:::

---

### `setColorScheme()`

```tsx
static setColorScheme('light' | 'dark' | null): void;
```

强制应用程序始终采用浅色或深色界面样式。默认值为 `null`，这将导致应用程序继承系统的界面样式。如果你分配了不同的值，新样式将应用于应用程序及其中的所有原生元素（Alerts、Pickers 等）。

支持的配色方案：

- `light`：应用浅色用户界面样式。
- `dark`：应用深色用户界面样式。
- null：遵循系统的界面样式。

:::note
此更改不会影响系统选择的界面样式或在其他应用程序中设置的任何样式。
:::

---

### `addChangeListener()`

```tsx
static addChangeListener(
  listener: (preferences: {colorScheme: 'light' | 'dark' | null}) => void,
): NativeEventSubscription;
```

添加一个当外观偏好更改时触发的事件处理程序。
