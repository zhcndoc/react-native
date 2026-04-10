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
  highContrastLight: color, // (可选) 如果未提供将回退到 "light"
  highContrastDark: color, // (可选) 如果未提供将回退到 "dark"
});
```

`DynamicColorIOS` 接受单个参数作为对象，包含两个必填键：`dark` 和 `light`，以及两个可选键 `highContrastLight` 和 `highContrastDark`。这些对应于你想在 iOS 上用于“浅色模式”和“深色模式”的颜色，以及当启用高对比度辅助功能模式时，它们的高对比度版本。

在运行时，系统将根据当前的系统外观和辅助功能设置选择显示哪种颜色。动态颜色对于品牌颜色或其他特定于应用的颜色非常有用，这些颜色仍然可以自动响应系统设置的变化。

#### 开发者说明

<Tabs groupId="guide" queryString defaultValue="web" values={constants.getDevNotesTabs(["ios", "web"])}>

<TabItem value="web">

:::info
如果你熟悉 CSS 中的 `@media (prefers-color-scheme: dark)`，这很像！只不过不是在媒体查询中定义所有颜色，而是在使用颜色的地方直接定义在什么情况下使用哪种颜色。很简洁！
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
