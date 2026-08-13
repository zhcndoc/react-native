---
id: dynamiccolorios
title: DynamicColorIOS
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

`DynamicColorIOS` 函数是 iOS 特有的平台颜色类型。

```tsx
DynamicColorIOS({
  light: color,
  dark: color,
  highContrastLight: color, // (optional) will fallback to "light" if not provided
  highContrastDark: color, // (optional) will fallback to "dark" if not provided
});
```

`DynamicColorIOS` 接受一个对象作为唯一参数，该对象包含两个必需键：`dark` 和 `light`，以及两个可选键 `highContrastLight` 和 `highContrastDark`。这些键分别对应于你想在 iOS 的“浅色模式”和“深色模式”下使用的颜色，以及启用高对比度辅助功能模式时使用的对应高对比度颜色。

在运行时，系统将根据当前的系统外观和辅助功能设置选择要显示的颜色。动态颜色适用于品牌颜色或其他特定于应用的颜色，同时仍能自动响应系统设置的变化。

#### 开发者说明

<Tabs groupId="guide" queryString defaultValue="web" values={constants.getDevNotesTabs(["ios", "web"])}>

<TabItem value="web">

:::info
如果你熟悉 CSS 中的 `@media (prefers-color-scheme: dark)`，这与它类似！不同之处在于，你不是在媒体查询中定义所有颜色，而是在使用颜色的地方直接定义在什么情况下使用哪种颜色。很棒！
:::

</TabItem>
<TabItem value="ios">

:::info
`DynamicColorIOS` 函数类似于 iOS 原生方法 [`UIColor colorWithDynamicProvider:`](https://developer.apple.com/documentation/uikit/uicolor/3238040-colorwithdynamicprovider)。
:::

</TabItem>
</Tabs>

## 示例

```tsx
import {DynamicColorIOS} from 'react-native';

const customDynamicTextColor = DynamicColorIOS({
  dark: 'lightskyblue',
  light: 'midnightblue',
});

const customContrastDynamicTextColor = DynamicColorIOS({
  dark: 'darkgray',
  light: 'lightgray',
  highContrastDark: 'black',
  highContrastLight: 'white',
});
```
