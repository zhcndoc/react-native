---
id: colors
title: 颜色参考
---

React Native 中的组件使用 [JavaScript 进行样式设置](style)。颜色属性通常与 [Web 上的 CSS 工作方式](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value) 相匹配。可以在下面找到各平台颜色使用的通用指南：

- [Android](https://material.io/design/color/color-usage.html)
- [iOS](https://developer.apple.com/design/human-interface-guidelines/ios/visual-design/color/)

## 颜色 API

React Native 有几个颜色 API，旨在让您充分利用平台的设计和用户偏好。

- [PlatformColor](platformcolor) 允许您引用平台的颜色系统。
- [DynamicColorIOS](dynamiccolorios) 是 iOS 特有的，允许您指定在浅色或深色模式下应使用哪些颜色。

## 颜色表示

### 红绿蓝 (RGB)

React Native 支持十六进制和函数表示法中的 `rgb()` 和 `rgba()`：

- `'#f0f'` (#rgb)
- `'#ff00ff'` (#rrggbb)
- `'#f0ff'` (#rgba)
- `'#ff00ff00'` (#rrggbbaa)
- `'rgb(255, 0, 255)'`
- `'rgb(255 0 255)'`
- `'rgba(255, 0, 255, 1.0)'`
- `'rgba(255 0 255 / 1.0)'`

### 色相饱和度亮度 (HSL)

React Native 支持函数表示法中的 `hsl()` 和 `hsla()`：

- `'hsl(360, 100%, 100%)'`
- `'hsl(360 100% 100%)'`
- `'hsla(360, 100%, 100%, 1.0)'`
- `'hsla(360 100% 100% / 1.0)'`

### 色相白度黑度 (HWB)

React Native 支持函数表示法中的 `hwb()`：

- `'hwb(0, 0%, 100%)'`
- `'hwb(360, 100%, 100%)'`
- `'hwb(0 0% 0%)'`
- `'hwb(70 50% 0%)'`

### 颜色整数

React Native 还支持将颜色作为 `int` 值（在 RGB 颜色模式中）：

- `0xff00ff00` (0xrrggbbaa)

:::caution
这可能看起来类似于 Android [Color](https://developer.android.com/reference/android/graphics/Color) 整数表示，但在 Android 上值存储在 SRGB 颜色模式 (0xaarrggbb) 中。
:::

### 命名颜色

在 React Native 中，您也可以使用颜色名称字符串作为值。

:::info
React Native 仅支持小写颜色名称。不支持大写颜色名称。
:::

#### `transparent`

这是 `rgba(0,0,0,0)` 的简写，与 [CSS3](https://www.w3.org/TR/css-color-3/#transparent) 中相同。

#### 颜色关键字

命名颜色的实现遵循 [CSS3/SVG 规范](https://www.w3.org/TR/css-color-3/#svg-color)：

- <ins style={{background: '#f0f8ff'}} className="color-box" /> 爱丽丝蓝 (<code>#f0f8ff</code>)
- <ins style={{background: '#faebd7'}} className="color-box" /> 古董白 (<code>#faebd7</code>)
- <ins style={{background: '#00ffff'}} className="color-box" /> 水绿色 (<code>#00ffff</code>)
- <ins style={{background: '#7fffd4'}} className="color-box" /> 海蓝宝石色 (<code>#7fffd4</code>)
- <ins style={{background: '#f0ffff'}} className="color-box" /> 蔚蓝 (<code>#f0ffff</code>)
- <ins style={{background: '#f5f5dc'}} className="color-box" /> 米色 (<code>#f5f5dc</code>)
- <ins style={{background: '#ffe4c4'}} className="color-box" /> 浅橙黄 (<code>#ffe4c4</code>)
- <ins style={{background: '#000000'}} className="color-box" /> 黑色 (<code>#000000</code>)
- <ins style={{background: '#ffebcd'}} className="color-box" /> 漂白杏仁色 (<code>#ffebcd</code>)
- <ins style={{background: '#0000ff'}} className="color-box" /> 蓝色 (<code>#0000ff</code>)
- <ins style={{background: '#8a2be2'}} className="color-box" /> 蓝紫色 (<code>#8a2be2</code>)
- <ins style={{background: '#a52a2a'}} className="color-box" /> 棕色 (<code>#a52a2a</code>)
- <ins style={{background: '#deb887'}} className="color-box" /> 碧棕色 (<code>#deb887</code>)
- <ins style={{background: '#5f9ea0'}} className="color-box" /> 军服蓝 (<code>#5f9ea0</code>)
- <ins style={{background: '#7fff00'}} className="color-box" /> 黄绿色 (<code>#7fff00</code>)
- <ins style={{background: '#d2691e'}} className="color-box" /> 巧克力色 (<code>#d2691e</code>)
- <ins style={{background: '#ff7f50'}} className="color-box" /> 珊瑚色 (<code>#ff7f50</code>)
- <ins style={{background: '#6495ed'}} className="color-box" /> 矢车菊蓝 (<code>#6495ed</code>)
- <ins style={{background: '#fff8dc'}} className="color-box" /> 玉米丝色 (<code>#fff8dc</code>)
- <ins style={{background: '#dc143c'}} className="color-box" /> 猩红 (<code>#dc143c</code>)
- <ins style={{background: '#00ffff'}} className="color-box" /> 青色 (<code>#00ffff</code>)
- <ins style={{background: '#00008b'}} className="color-box" /> 深蓝色 (<code>#00008b</code>)
- <ins style={{background: '#008b8b'}} className="color-box" /> 深青色 (<code>#008b8b</code>)
- <ins style={{background: '#b8860b'}} className="color-box" /> 暗金菊色 (<code>#b8860b</code>)
- <ins style={{background: '#a9a9a9'}} className="color-box" /> 深灰色 (<code>#a9a9a9</code>)
- <ins style={{background: '#006400'}} className="color-box" /> 深绿色 (<code>#006400</code>)
- <ins style={{background: '#a9a9a9'}} className="color-box" /> 深灰色 (<code>#a9a9a9</code>)
- <ins style={{background: '#bdb76b'}} className="color-box" /> 暗卡其色 (<code>#bdb76b</code>)
- <ins style={{background: '#8b008b'}} className="color-box" /> 深洋红 (<code>#8b008b</code>)
- <ins style={{background: '#556b2f'}} className="color-box" /> 深橄榄绿 (<code>#556b2f</code>)
- <ins style={{background: '#ff8c00'}} className="color-box" /> 深橙色 (<code>#ff8c00</code>)
- <ins style={{background: '#9932cc'}} className="color-box" /> 深兰花色 (<code>#9932cc</code>)
- <ins style={{background: '#8b0000'}} className="color-box" /> 深红色 (<code>#8b0000</code>)
- <ins style={{background: '#e9967a'}} className="color-box" /> 深鲑红 (<code>#e9967a</code>)
- <ins style={{background: '#8fbc8f'}} className="color-box" /> 深海绿色 (<code>#8fbc8f</code>)
- <ins style={{background: '#483d8b'}} className="color-box" /> 深板岩蓝 (<code>#483d8b</code>)
- <ins style={{background: '#2f4f4f'}} className="color-box" /> 深板岩灰 (<code>#2f4f4f</code>)
- <ins style={{background: '#00ced1'}} className="color-box" /> 深绿松石色 (<code>#00ced1</code>)
- <ins style={{background: '#9400d3'}} className="color-box" /> 深紫罗兰 (<code>#9400d3</code>)
- <ins style={{background: '#ff1493'}} className="color-box" /> 深粉红 (<code>#ff1493</code>)
- <ins style={{background: '#00bfff'}} className="color-box" /> 深天蓝 (<code>#00bfff</code>)
- <ins style={{background: '#696969'}} className="color-box" /> 暗灰色 (<code>#696969</code>)
- <ins style={{background: '#696969'}} className="color-box" /> 暗灰色 (<code>#696969</code>)
- <ins style={{background: '#1e90ff'}} className="color-box" /> 道奇蓝 (<code>#1e90ff</code>)
- <ins style={{background: '#b22222'}} className="color-box" /> 砖红 (<code>#b22222</code>)
- <ins style={{background: '#fffaf0'}} className="color-box" /> 花白 (<code>#fffaf0</code>)
- <ins style={{background: '#228b22'}} className="color-box" /> 森林绿 (<code>#228b22</code>)
- <ins style={{background: '#ff00ff'}} className="color-box" /> 品红 (<code>#ff00ff</code>)
- <ins style={{background: '#dcdcdc'}} className="color-box" /> 盖恩斯伯勒灰 (<code>#dcdcdc</code>)
- <ins style={{background: '#f8f8ff'}} className="color-box" /> 幽灵白 (<code>#f8f8ff</code>)
- <ins style={{background: '#ffd700'}} className="color-box" /> 金色 (<code>#ffd700</code>)
- <ins style={{background: '#daa520'}} className="color-box" /> 金麒麟色 (<code>#daa520</code>)
- <ins style={{background: '#808080'}} className="color-box" /> 灰色 (<code>#808080</code>)
- <ins style={{background: '#008000'}} className="color-box" /> 绿色 (<code>#008000</code>)
- <ins style={{background: '#adff2f'}} className="color-box" /> 绿黄色 (<code>#adff2f</code>)
- <ins style={{background: '#808080'}} className="color-box" /> 灰色 (<code>#808080</code>)
- <ins style={{background: '#f0fff0'}} className="color-box" /> 蜜露色 (<code>#f0fff0</code>)
- <ins style={{background: '#ff69b4'}} className="color-box" /> 热粉红 (<code>#ff69b4</code>)
- <ins style={{background: '#cd5c5c'}} className="color-box" /> 印度红 (<code>#cd5c5c</code>)
- <ins style={{background: '#4b0082'}} className="color-box" /> 靛蓝 (<code>#4b0082</code>)
- <ins style={{background: '#fffff0'}} className="color-box" /> 象牙白 (<code>#fffff0</code>)
- <ins style={{background: '#f0e68c'}} className="color-box" /> 卡其色 (<code>#f0e68c</code>)
- <ins style={{background: '#e6e6fa'}} className="color-box" /> 薰衣草色 (<code>#e6e6fa</code>)
- <ins style={{background: '#fff0f5'}} className="color-box" /> 薰衣草紫红 (<code>#fff0f5</code>)
- <ins style={{background: '#7cfc00'}} className="color-box" /> 草坪绿 (<code>#7cfc00</code>)
- <ins style={{background: '#fffacd'}} className="color-box" /> 柠檬绸色 (<code>#fffacd</code>)
- <ins style={{background: '#add8e6'}} className="color-box" /> 浅蓝 (<code>#add8e6</code>)
- <ins style={{background: '#f08080'}} className="color-box" /> 浅珊瑚 (<code>#f08080</code>)
- <ins style={{background: '#e0ffff'}} className="color-box" /> 浅青 (<code>#e0ffff</code>)
- <ins style={{background: '#fafad2'}} className="color-box" /> 浅金菊黄 (<code>#fafad2</code>)
- <ins style={{background: '#d3d3d3'}} className="color-box" /> 浅灰 (<code>#d3d3d3</code>)
- <ins style={{background: '#90ee90'}} className="color-box" /> 浅绿 (<code>#90ee90</code>)
- <ins style={{background: '#d3d3d3'}} className="color-box" /> 浅灰 (<code>#d3d3d3</code>)
- <ins style={{background: '#ffb6c1'}} className="color-box" /> 浅粉红 (<code>#ffb6c1</code>)
- <ins style={{background: '#ffa07a'}} className="color-box" /> 浅鲑红 (<code>#ffa07a</code>)
- <ins style={{background: '#20b2aa'}} className="color-box" /> 浅海绿色 (<code>#20b2aa</code>)
- <ins style={{background: '#87cefa'}} className="color-box" /> 浅天蓝 (<code>#87cefa</code>)
- <ins style={{background: '#778899'}} className="color-box" /> 浅板岩灰 (<code>#778899</code>)
- <ins style={{background: '#b0c4de'}} className="color-box" /> 浅钢蓝 (<code>#b0c4de</code>)
- <ins style={{background: '#ffffe0'}} className="color-box" /> 浅黄 (<code>#ffffe0</code>)
- <ins style={{background: '#00ff00'}} className="color-box" /> 酸橙绿 (<code>#00ff00</code>)
- <ins style={{background: '#32cd32'}} className="color-box" /> 酸橙绿 (<code>#32cd32</code>)
- <ins style={{background: '#faf0e6'}} className="color-box" /> 亚麻色 (<code>#faf0e6</code>)
- <ins style={{background: '#ff00ff'}} className="color-box" /> 品红 (<code>#ff00ff</code>)
- <ins style={{background: '#800000'}} className="color-box" /> 栗色 (<code>#800000</code>)
- <ins style={{background: '#66cdaa'}} className="color-box" /> 中海蓝宝石色 (<code>#66cdaa</code>)
- <ins style={{background: '#0000cd'}} className="color-box" /> 中蓝 (<code>#0000cd</code>)
- <ins style={{background: '#ba55d3'}} className="color-box" /> 中兰花色 (<code>#ba55d3</code>)
- <ins style={{background: '#9370db'}} className="color-box" /> 中紫 (<code>#9370db</code>)
- <ins style={{background: '#3cb371'}} className="color-box" /> 中海绿 (<code>#3cb371</code>)
- <ins style={{background: '#7b68ee'}} className="color-box" /> 中板岩蓝 (<code>#7b68ee</code>)
- <ins style={{background: '#00fa9a'}} className="color-box" /> 中春绿 (<code>#00fa9a</code>)
- <ins style={{background: '#48d1cc'}} className="color-box" /> 中绿松石 (<code>#48d1cc</code>)
- <ins style={{background: '#c71585'}} className="color-box" /> 中紫红 (<code>#c71585</code>)
- <ins style={{background: '#191970'}} className="color-box" /> 午夜蓝 (<code>#191970</code>)
- <ins style={{background: '#f5fffa'}} className="color-box" /> 薄荷奶油色 (<code>#f5fffa</code>)
- <ins style={{background: '#ffe4e1'}} className="color-box" /> 雾玫瑰色 (<code>#ffe4e1</code>)
- <ins style={{background: '#ffe4b5'}} className="color-box" /> 鹿皮色 (<code>#ffe4b5</code>)
- <ins style={{background: '#ffdead'}} className="color-box" /> 纳瓦霍白 (<code>#ffdead</code>)
- <ins style={{background: '#000080'}} className="color-box" /> 海军蓝 (<code>#000080</code>)
- <ins style={{background: '#fdf5e6'}} className="color-box" /> 老花边色 (<code>#fdf5e6</code>)
- <ins style={{background: '#808000'}} className="color-box" /> 橄榄色 (<code>#808000</code>)
- <ins style={{background: '#6b8e23'}} className="color-box" /> 橄榄褐 (<code>#6b8e23</code>)
- <ins style={{background: '#ffa500'}} className="color-box" /> 橙色 (<code>#ffa500</code>)
- <ins style={{background: '#ff4500'}} className="color-box" /> 橙红 (<code>#ff4500</code>)
- <ins style={{background: '#da70d6'}} className="color-box" /> 兰花色 (<code>#da70d6</code>)
- <ins style={{background: '#eee8aa'}} className="color-box" /> 苍金菊色 (<code>#eee8aa</code>)
- <ins style={{background: '#98fb98'}} className="color-box" /> 苍绿 (<code>#98fb98</code>)
- <ins style={{background: '#afeeee'}} className="color-box" /> 苍绿松石 (<code>#afeeee</code>)
- <ins style={{background: '#db7093'}} className="color-box" /> 苍紫红 (<code>#db7093</code>)
- <ins style={{background: '#ffefd5'}} className="color-box" /> 木瓜奶油色 (<code>#ffefd5</code>)
- <ins style={{background: '#ffdab9'}} className="color-box" /> 桃色 (<code>#ffdab9</code>)
- <ins style={{background: '#cd853f'}} className="color-box" /> 秘鲁色 (<code>#cd853f</code>)
- <ins style={{background: '#ffc0cb'}} className="color-box" /> 粉红 (<code>#ffc0cb</code>)
- <ins style={{background: '#dda0dd'}} className="color-box" /> 李子色 (<code>#dda0dd</code>)
- <ins style={{background: '#b0e0e6'}} className="color-box" /> 粉蓝 (<code>#b0e0e6</code>)
- <ins style={{background: '#800080'}} className="color-box" /> 紫色 (<code>#800080</code>)
- <ins style={{background: '#663399'}} className="color-box" /> 丽贝卡紫 (<code>#663399</code>)
- <ins style={{background: '#ff0000'}} className="color-box" /> 红色 (<code>#ff0000</code>)
- <ins style={{background: '#bc8f8f'}} className="color-box" /> 玫瑰棕 (<code>#bc8f8f</code>)
- <ins style={{background: '#4169e1'}} className="color-box" /> 宝蓝 (<code>#4169e1</code>)
- <ins style={{background: '#8b4513'}} className="color-box" /> 马鞍棕 (<code>#8b4513</code>)
- <ins style={{background: '#fa8072'}} className="color-box" /> 鲑红 (<code>#fa8072</code>)
- <ins style={{background: '#f4a460'}} className="color-box" /> 沙褐 (<code>#f4a460</code>)
- <ins style={{background: '#2e8b57'}} className="color-box" /> 海绿 (<code>#2e8b57</code>)
- <ins style={{background: '#fff5ee'}} className="color-box" /> 海贝壳色 (<code>#fff5ee</code>)
- <ins style={{background: '#a0522d'}} className="color-box" /> 赭色 (<code>#a0522d</code>)
- <ins style={{background: '#c0c0c0'}} className="color-box" /> 银色 (<code>#c0c0c0</code>)
- <ins style={{background: '#87ceeb'}} className="color-box" /> 天蓝 (<code>#87ceeb</code>)
- <ins style={{background: '#6a5acd'}} className="color-box" /> 板岩蓝 (<code>#6a5acd</code>)
- <ins style={{background: '#708090'}} className="color-box" /> 板岩灰 (<code>#708090</code>)
- <ins style={{background: '#fffafa'}} className="color-box" /> 雪白 (<code>#fffafa</code>)
- <ins style={{background: '#00ff7f'}} className="color-box" /> 春绿 (<code>#00ff7f</code>)
- <ins style={{background: '#4682b4'}} className="color-box" /> 钢蓝 (<code>#4682b4</code>)
- <ins style={{background: '#d2b48c'}} className="color-box" /> 棕褐色 (<code>#d2b48c</code>)
- <ins style={{background: '#008080'}} className="color-box" /> 水鸭色 (<code>#008080</code>)
- <ins style={{background: '#d8bfd8'}} className="color-box" /> 蓟色 (<code>#d8bfd8</code>)
- <ins style={{background: '#ff6347'}} className="color-box" /> 番茄红 (<code>#ff6347</code>)
- <ins style={{background: '#40e0d0'}} className="color-box" /> 绿松石色 (<code>#40e0d0</code>)
- <ins style={{background: '#ee82ee'}} className="color-box" /> 紫罗兰 (<code>#ee82ee</code>)
- <ins style={{background: '#f5deb3'}} className="color-box" /> 小麦色 (<code>#f5deb3</code>)
- <ins style={{background: '#ffffff'}} className="color-box" /> 白色 (<code>#ffffff</code>)
- <ins style={{background: '#f5f5f5'}} className="color-box" /> 白烟 (<code>#f5f5f5</code>)
- <ins style={{background: '#ffff00'}} className="color-box" /> 黄色 (<code>#ffff00</code>)
- <ins style={{background: '#9acd32'}} className="color-box" /> 黄绿色 (<code>#9acd32</code>)
