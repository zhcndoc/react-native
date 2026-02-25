---
id: appearance
title: 外观
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

```tsx
import {Appearance} from 'react-native';
```

`Appearance` 模块暴露了关于用户外观偏好的信息，例如他们偏好的配色方案（亮色或暗色）。

#### 开发者笔记

<Tabs groupId="guide" queryString defaultValue="web" values={constants.getDevNotesTabs(["android", "ios", "web"])}>

<TabItem value="web">

:::info
`Appearance` API 灵感来源于 W3C 的 [Media Queries 草案](https://drafts.csswg.org/mediaqueries-5/)。配色方案偏好借鉴了 [`prefers-color-scheme` CSS 媒体特性](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) 的设计。
:::

</TabItem>
<TabItem value="android">

:::info
配色方案偏好会映射到 Android 10（API 级别 29）及以上设备上的用户亮色或[暗色主题](https://developer.android.com/guide/topics/ui/look-and-feel/darktheme)偏好。
:::

</TabItem>
<TabItem value="ios">

:::info
配色方案偏好会映射到 iOS 13 及以上设备上的用户亮色或[暗黑模式](https://developer.apple.com/design/human-interface-guidelines/ios/visual-design/dark-mode/)偏好。
:::

:::note
截屏时，默认情况下，配色方案可能会在亮色和暗色模式间闪烁。这是因为 iOS 会在两种配色方案下截取快照，而使用配色方案更新 UI 是异步的。
:::

</TabItem>
</Tabs>

## 示例

你可以使用 `Appearance` 模块来判断用户是否偏好暗色配色方案：

```tsx
const colorScheme = Appearance.getColorScheme();
if (colorScheme === 'dark') {
  // 使用暗色配色方案
}
```

虽然配色方案可以立即获得，但它可能会变化（例如，配色方案根据日出或日落定时切换）。任何依赖用户偏好配色方案的渲染逻辑或样式，应该尽量在每次渲染时调用此函数，而不是缓存该值。例如，你可以使用 [`useColorScheme`](usecolorscheme) React 钩子，它会提供配色方案并订阅配色方案的更新，或者你可以使用内联样式而非在 `StyleSheet` 中设置值。

---

# 参考

## 方法

### `getColorScheme()`

```tsx
static getColorScheme(): 'light' | 'dark' | null;
```

指示当前用户偏好的配色方案。该值之后可能会更新，更新原因可能是用户直接操作（例如，在设备设置中选择主题，或应用级别通过 `setColorScheme` 选择用户界面样式）或是按预设时间表（例如随着昼夜变化的亮暗主题）。

支持的配色方案：

- `'light'`：用户偏好亮色主题。
- `'dark'`：用户偏好暗色主题。
- `null`：用户未指定偏好的配色主题。

另请参阅：`useColorScheme` 钩子。

:::note
调试时（使用 Chrome），`getColorScheme()` 始终返回 `light`。
:::

---

### `setColorScheme()`

```tsx
static setColorScheme('light' | 'dark' | null): void;
```

强制应用始终采用亮色或暗色界面样式。默认值是 `null`，表示应用继承系统的界面样式。如果赋予不同的值，则新样式会应用于应用及所有原生界面元素（如 Alert、Picker 等）。

支持的配色方案：

- `light`：应用亮色用户界面样式。
- `dark`：应用暗色用户界面样式。
- null：遵循系统的界面样式。

:::note
该设置不会影响系统选定的界面样式或其他应用中设置的样式。
:::

---

### `addChangeListener()`

```tsx
static addChangeListener(
  listener: (preferences: {colorScheme: 'light' | 'dark' | null}) => void,
): NativeEventSubscription;
```

添加当外观偏好变化时触发的事件处理函数。
