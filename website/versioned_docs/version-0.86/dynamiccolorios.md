---
id: dynamiccolorios
title: DynamicColorIOS
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

`DynamicColorIOS` 函数是 iOS 平台特有的颜色类型。

```tsx
DynamicColorIOS({
  light: color,
  dark: color,
  highContrastLight: color, // （可选）如果未提供，将回退为 "light"
  highContrastDark: color, // （可选）如果未提供，将回退为 "dark"
});
```

`DynamicColorIOS` 接收一个对象作为单个参数，其中包含两个必需键：`dark` 和 `light`，以及两个可选键 `highContrastLight` 和 `highContrastDark`。它们分别对应你希望在 iOS 上用于“浅色模式”和“深色模式”的颜色；当启用高对比度辅助功能模式时，则使用它们的高对比度版本。

在运行时，系统会根据当前的系统外观和辅助功能设置来决定显示哪种颜色。动态颜色适用于品牌颜色或其他应用特定颜色，因为它们仍会自动响应系统设置的变化。

#### 开发者说明

<Tabs groupId="guide" queryString defaultValue="web" values={constants.getDevNotesTabs(["ios", "web"])}>

<TabItem value="web">

:::info
如果你熟悉 CSS 中的 `@media (prefers-color-scheme: dark)`，那这很相似！只不过不是在媒体查询中定义所有颜色，而是直接在使用它的地方定义在什么情况下使用哪种颜色。很巧妙！
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
