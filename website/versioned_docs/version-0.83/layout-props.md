---
id: layout-props
title: 布局属性
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

:::info
关于这些属性的更详细示例可以在 [基于 Flexbox 的布局](flexbox) 页面找到。
:::

### 示例

以下示例展示了不同属性如何影响或塑造 React Native 布局。你可以尝试在 UI 中添加或删除方块，同时改变属性 `flexWrap` 的值。

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer name=LayoutProps%20Example&ext=js
import React, {useState} from 'react';
import {Button, ScrollView, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  const [flexDirection, setFlexDirection] = useState(0);
  const [justifyContent, setJustifyContent] = useState(0);
  const [alignItems, setAlignItems] = useState(0);
  const [direction, setDirection] = useState(0);
  const [wrap, setWrap] = useState(0);

  const [squares, setSquares] = useState([<Square />, <Square />, <Square />]);

  const hookedStyles = {
    flexDirection: flexDirections[flexDirection],
    justifyContent: justifyContents[justifyContent],
    alignItems: alignItemsArr[alignItems],
    direction: directions[direction],
    flexWrap: wraps[wrap],
  };

  const changeSetting = (value, options, setterFunction) => {
    if (value === options.length - 1) {
      setterFunction(0);
      return;
    }
    setterFunction(value + 1);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={[styles.container, styles.playingSpace, hookedStyles]}>
          {squares.map(elem => elem)}
        </View>
        <ScrollView style={styles.layoutContainer}>
          <View style={styles.controlSpace}>
            <View style={styles.buttonView}>
              <Button
                title="更改 Flex 方向"
                onPress={() =>
                  changeSetting(flexDirection, flexDirections, setFlexDirection)
                }
              />
              <Text style={styles.text}>{flexDirections[flexDirection]}</Text>
            </View>
            <View style={styles.buttonView}>
              <Button
                title="更改主轴对齐"
                onPress={() =>
                  changeSetting(
                    justifyContent,
                    justifyContents,
                    setJustifyContent,
                  )
                }
              />
              <Text style={styles.text}>{justifyContents[justifyContent]}</Text>
            </View>
            <View style={styles.buttonView}>
              <Button
                title="更改交叉轴对齐"
                onPress={() =>
                  changeSetting(alignItems, alignItemsArr, setAlignItems)
                }
              />
              <Text style={styles.text}>{alignItemsArr[alignItems]}</Text>
            </View>
            <View style={styles.buttonView}>
              <Button
                title="更改方向"
                onPress={() =>
                  changeSetting(direction, directions, setDirection)
                }
              />
              <Text style={styles.text}>{directions[direction]}</Text>
            </View>
            <View style={styles.buttonView}>
              <Button
                title="更改换行方式"
                onPress={() => changeSetting(wrap, wraps, setWrap)}
              />
              <Text style={styles.text}>{wraps[wrap]}</Text>
            </View>
            <View style={styles.buttonView}>
              <Button
                title="添加方块"
                onPress={() => setSquares([...squares, <Square />])}
              />
            </View>
            <View style={styles.buttonView}>
              <Button
                title="删除方块"
                onPress={() =>
                  setSquares(squares.filter((v, i) => i !== squares.length - 1))
                }
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const flexDirections = ['row', 'row-reverse', 'column', 'column-reverse'];
const justifyContents = [
  'flex-start',
  'flex-end',
  'center',
  'space-between',
  'space-around',
  'space-evenly',
];
const alignItemsArr = [
  'flex-start',
  'flex-end',
  'center',
  'stretch',
  'baseline',
];
const wraps = ['nowrap', 'wrap', 'wrap-reverse'];
const directions = ['inherit', 'ltr', 'rtl'];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  layoutContainer: {
    flex: 0.5,
  },
  playingSpace: {
    backgroundColor: 'white',
    borderColor: 'blue',
    borderWidth: 3,
    overflow: 'hidden',
  },
  controlSpace: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  buttonView: {
    width: '50%',
    padding: 10,
  },
  text: {
    textAlign: 'center',
  },
});

const Square = () => (
  <View
    style={{
      width: 50,
      height: 50,
      backgroundColor: randomHexColor(),
    }}
  />
);

const randomHexColor = () => {
  return '#000000'.replace(/0/g, () => {
    return Math.round(Math.random() * 14).toString(16);
  });
};

export default App;
```

</TabItem>
<TabItem value="typescript">

```SnackPlayer name=LayoutProps%20Example&ext=tsx
import React, {useState} from 'react';
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
  FlexAlignType,
  FlexStyle,
} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  const [flexDirection, setFlexDirection] = useState(0);
  const [justifyContent, setJustifyContent] = useState(0);
  const [alignItems, setAlignItems] = useState(0);
  const [direction, setDirection] = useState(0);
  const [wrap, setWrap] = useState(0);

  const [squares, setSquares] = useState([<Square />, <Square />, <Square />]);

  const hookedStyles = {
    flexDirection: flexDirections[flexDirection],
    justifyContent: justifyContents[justifyContent],
    alignItems: alignItemsArr[alignItems],
    direction: directions[direction],
    flexWrap: wraps[wrap],
  } as FlexStyle;

  const changeSetting = (
    value: number,
    options: any[],
    setterFunction: (index: number) => void,
  ) => {
    if (value === options.length - 1) {
      setterFunction(0);
      return;
    }
    setterFunction(value + 1);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={[styles.container, styles.playingSpace, hookedStyles]}>
          {squares.map(elem => elem)}
        </View>
        <ScrollView style={styles.layoutContainer}>
          <View style={styles.controlSpace}>
            <View style={styles.buttonView}>
              <Button
                title="更改 Flex 方向"
                onPress={() =>
                  changeSetting(flexDirection, flexDirections, setFlexDirection)
                }
              />
              <Text style={styles.text}>{flexDirections[flexDirection]}</Text>
            </View>
            <View style={styles.buttonView}>
              <Button
                title="更改主轴对齐"
                onPress={() =>
                  changeSetting(
                    justifyContent,
                    justifyContents,
                    setJustifyContent,
                  )
                }
              />
              <Text style={styles.text}>{justifyContents[justifyContent]}</Text>
            </View>
            <View style={styles.buttonView}>
              <Button
                title="更改交叉轴对齐"
                onPress={() =>
                  changeSetting(alignItems, alignItemsArr, setAlignItems)
                }
              />
              <Text style={styles.text}>{alignItemsArr[alignItems]}</Text>
            </View>
            <View style={styles.buttonView}>
              <Button
                title="更改方向"
                onPress={() =>
                  changeSetting(direction, directions, setDirection)
                }
              />
              <Text style={styles.text}>{directions[direction]}</Text>
            </View>
            <View style={styles.buttonView}>
              <Button
                title="更改换行方式"
                onPress={() => changeSetting(wrap, wraps, setWrap)}
              />
              <Text style={styles.text}>{wraps[wrap]}</Text>
            </View>
            <View style={styles.buttonView}>
              <Button
                title="添加方块"
                onPress={() => setSquares([...squares, <Square />])}
              />
            </View>
            <View style={styles.buttonView}>
              <Button
                title="删除方块"
                onPress={() =>
                  setSquares(squares.filter((v, i) => i !== squares.length - 1))
                }
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const flexDirections = [
  'row',
  'row-reverse',
  'column',
  'column-reverse',
] as FlexStyle['flexDirection'][];
const justifyContents = [
  'flex-start',
  'flex-end',
  'center',
  'space-between',
  'space-around',
  'space-evenly',
] as FlexStyle['justifyContent'][];
const alignItemsArr = [
  'flex-start',
  'flex-end',
  'center',
  'stretch',
  'baseline',
] as FlexAlignType[];
const wraps = ['nowrap', 'wrap', 'wrap-reverse'];
const directions = ['inherit', 'ltr', 'rtl'];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  layoutContainer: {
    flex: 0.5,
  },
  playingSpace: {
    backgroundColor: 'white',
    borderColor: 'blue',
    borderWidth: 3,
    overflow: 'hidden',
  },
  controlSpace: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  buttonView: {
    width: '50%',
    padding: 10,
  },
  text: {
    textAlign: 'center',
  },
});

const Square = () => (
  <View
    style={{
      width: 50,
      height: 50,
      backgroundColor: randomHexColor(),
    }}
  />
);

const randomHexColor = () => {
  return '#000000'.replace(/0/g, () => {
    return Math.round(Math.random() * 14).toString(16);
  });
};

export default App;
```

</TabItem>
</Tabs>

---

# 参考

## 属性

### `alignContent`

`alignContent` 控制行在交叉轴方向的对齐方式，覆盖父元素的 `alignContent`。

详情请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/align-content)。

| 类型                                                                                                 | 必需   |
| ---------------------------------------------------------------------------------------------------- | ------ |
| 枚举('flex-start', 'flex-end', 'center', 'stretch', 'space-between', 'space-around', 'space-evenly') | 否     |

---

### `alignItems`

`alignItems` 用来在交叉轴方向对齐子元素。例如，如果子元素是垂直排列的，`alignItems` 控制它们在水平方向上的对齐。它的工作机制与 CSS 中的 `align-items` 类似（默认值：stretch）。

详情请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/align-items)。

| 类型                                                            | 必需   |
| --------------------------------------------------------------- | ------ |
| 枚举('flex-start', 'flex-end', 'center', 'stretch', 'baseline') | 否     |

---

### `alignSelf`

`alignSelf` 控制单个子元素在交叉轴方向的对齐方式，覆盖父元素的 `alignItems`。它的工作机制与 CSS 中的 `align-self` 类似（默认值：auto）。

详情请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/align-self)。

| 类型                                                                    | 必需   |
| ----------------------------------------------------------------------- | ------ |
| 枚举('auto', 'flex-start', 'flex-end', 'center', 'stretch', 'baseline') | 否     |

---

### `aspectRatio`

宽高比控制节点未定义维度的大小。

- 对于指定了宽度或高度的节点，宽高比控制未设置的维度的大小。
- 对于设置了 flex basis 的节点，宽高比在未设置时控制交叉轴方向的大小。
- 对于带测量函数的节点，宽高比相当于测量函数测量的是 flex basis。
- 对于具有 flex grow/shrink 的节点，宽高比在未设置时控制交叉轴方向的大小。
- 宽高比会考虑最小/最大尺寸限制。

详情请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio)。

| 类型           | 必需   |
| -------------- | ------ |
| number, string | 否     |

---

### `borderBottomWidth`

`borderBottomWidth` 类似于 CSS 中的 `border-bottom-width`。

详情请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/border-bottom-width)。

| 类型   | 必需   |
| ------ | ------ |
| number | 否     |

---

### `borderEndWidth`

当方向为 `ltr` 时，`borderEndWidth` 等同于 `borderRightWidth`；当方向为 `rtl` 时，`borderEndWidth` 等同于 `borderLeftWidth`。

| 类型   | 必需   |
| ------ | ------ |
| number | 否     |

---

### `borderLeftWidth`

`borderLeftWidth` 类似于 CSS 中的 `border-left-width`。

详情请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/border-left-width)。

| 类型   | 必需   |
| ------ | ------ |
| number | 否     |

---

### `borderRightWidth`

`borderRightWidth` 类似于 CSS 中的 `border-right-width`。

详情请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/border-right-width)。

| 类型   | 必需   |
| ------ | ------ |
| number | 否     |

---

### `borderStartWidth`

当方向为 `ltr` 时，`borderStartWidth` 等同于 `borderLeftWidth`；当方向为 `rtl` 时，`borderStartWidth` 等同于 `borderRightWidth`。

| 类型   | 必需   |
| ------ | ------ |
| number | 否     |

---

### `borderTopWidth`

`borderTopWidth` 类似于 CSS 中的 `border-top-width`。

详情请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/border-top-width)。

| 类型   | 必需   |
| ------ | ------ |
| number | 否     |

---

### `borderWidth`

`borderWidth` 类似于 CSS 中的 `border-width`。

详情请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/border-width)。

| 类型   | 必需   |
| ------ | ------ |
| number | 否     |

---

### `bottom`

`bottom` 是组件底部边缘的逻辑像素偏移量。

它的用法类似于 CSS 中的 `bottom`，但在 React Native 中必须使用点数或百分比，不支持 em 等其他单位。

详情请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/bottom) 了解 `bottom` 如何影响布局。

| 类型           | 必需   |
| -------------- | ------ |
| number, string | 否     |

---

### `boxSizing`

`boxSizing` 定义元素各种尺寸属性（如 `width`、`height`、`minWidth`、`minHeight` 等）如何计算。如果 `boxSizing` 为 `border-box`，这些尺寸应用于元素的边框盒；如果为 `content-box`，应用于元素的内容盒。默认值为 `border-box`。若想深入了解此属性，推荐参考 [web 文档](https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing)。

| 类型                              | 必需   |
| --------------------------------- | ------ |
| 枚举('border-box', 'content-box') | 否     |

---

### `columnGap`

`columnGap` 类似于 CSS 中的 `column-gap`。React Native 中仅支持像素单位。

详情请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/column-gap)。

| 类型   | 必需   |
| ------ | ------ |
| number | 否     |

---

### `direction`

`direction` 指定用户界面的文本方向流。默认值为 `inherit`，根节点除外，其值基于当前语言环境。

详情请参阅 [MDN CSS 参考](https://www.yogalayout.dev/docs/styling/layout-direction)。

| 类型                          | 必需   |
| ----------------------------- | ------ |
| 枚举('inherit', 'ltr', 'rtl') | 否     |

---

### `display`

`display` 设置此组件的显示类型。

类似于 CSS 中的 `display`，但仅支持 'flex'、'none' 和 'contents'，默认值为 `flex`。

| 类型                             | 必需   |
| -------------------------------- | ------ |
| 枚举('none', 'flex', 'contents') | 否     |

---

### `end`

当方向为 `ltr` 时，`end` 等同于 `right`；当方向为 `rtl` 时，`end` 等同于 `left`。

此样式优先于 `left` 和 `right`。

| 类型           | 必需   |
| -------------- | ------ |
| number, string | 否     |

---

### `flex`

在 React Native 中，`flex` 的行为与 CSS 不同。`flex` 是数字类型，而非字符串，且基于 [Yoga](https://github.com/facebook/yoga) 布局引擎工作。

- 当 `flex` 为正数时，组件具有弹性，大小按 `flex` 值比例分配。例如设置 `flex: 2` 的组件将占用两倍于 `flex: 1` 组件的空间。`flex: <正数>` 等价于 `flexGrow: <正数>`, `flexShrink: 1`, `flexBasis: 0`。
- 当 `flex` 为 0 时，组件按 `width` 和 `height` 大小固定，无弹性。
- 当 `flex` 为 -1 时，组件通常按 `width` 和 `height` 尺寸；但空间不足时会收缩到最小宽度和高度。
- `flexGrow`、`flexShrink` 和 `flexBasis` 的行为和 CSS 相同。

| 类型   | 必需   |
| ------ | ------ |
| number | 否     |

---

### `flexBasis`

`flexBasis` 是沿主轴定义元素默认大小的独立于轴的属性。设置子元素的 `flexBasis` 类似于当父容器 `flexDirection: row` 时设置 `width`，或当父容器 `flexDirection: column` 时设置 `height`。它是子元素在进行 `flexGrow` 和 `flexShrink` 计算前的默认大小。

| 类型           | 必需   |
| -------------- | ------ |
| number, string | 否     |

---

### `flexDirection`

`flexDirection` 控制容器子元素的排列方向。`row` 表示从左到右，`column` 表示从上到下，另外两个方向分别是这两者的反向。它的作用类似于 CSS 中的 `flex-direction`，但默认值为 `column`。

详情请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/flex-direction)。

| 类型                                                   | 必需   |
| ------------------------------------------------------ | ------ |
| 枚举('row', 'row-reverse', 'column', 'column-reverse') | 否     |

---

### `flexGrow`

`flexGrow` 描述容器主轴上如何分配剩余空间。当容器布局完子元素后，会根据子元素的 `flexGrow` 比例分配剩余空间。

`flexGrow` 接受大于等于 0 的浮点数，默认为 0。容器会根据子元素 `flexGrow` 的权重来分配剩余空间。

| 类型   | 必需   |
| ------ | ------ |
| number | 否     |

---

### `flexShrink`

[`flexShrink`](layout-props#flexshrink) 描述当子元素总尺寸超出容器主轴尺寸时，如何按比例缩小子元素大小。`flexShrink` 类似于 `flexGrow`，可以把超出尺寸看作负的剩余空间。这两个属性常配合使用，允许子元素根据需要增长或缩小。

`flexShrink` 接受大于等于 0 的浮点数，默认为 0。容器将按子元素 `flexShrink` 权重缩小子元素。

| 类型   | 必需   |
| ------ | ------ |
| number | 否     |

---

### `flexWrap`

`flexWrap` 控制子元素是否在达到 flex 容器末尾后折行。类似于 CSS 的 `flex-wrap`（默认值：nowrap）。

注意，它不再支持与 `alignItems: stretch`（默认值）一同使用，因此通常需要设置为 `alignItems: flex-start` 等（破坏性变更详情见 https://github.com/facebook/react-native/releases/tag/v0.28.0）。

详情请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/flex-wrap)。

| 类型                                   | 必需   |
| -------------------------------------- | ------ |
| 枚举('wrap', 'nowrap', 'wrap-reverse') | 否     |

---

### `gap`

`gap` 类似于 CSS 的 `gap`。React Native 中仅支持像素单位。

详情请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/gap)。

| 类型   | 必需   |
| ------ | ------ |
| number | 否     |

---

### `height`

`height` 设置组件高度。

类似于 CSS 的 `height`，但在 React Native 中必须使用点数或百分比，不支持 em 等其他单位。

详情请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/height)。

| 类型           | 必需   |
| -------------- | ------ |
| number, string | 否     |

---

### `inset`

:::note
`inset` 仅在 [新架构](/architecture/landing-page) 中可用
:::

设置 `inset` 等同于分别设置 `top`、`bottom`、`right` 和 `left`。

详情请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/inset)。

| 类型           | 必需   |
| -------------- | ------ |
| number, string | 否     |

---

### `insetBlock`

:::note
`insetBlock` 仅在 [新架构](/architecture/landing-page) 中可用
:::

等同于 [`top`](layout-props#top) 和 [`bottom`](layout-props#bottom)。

详情请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/inset-block)。

| 类型           | 必需   |
| -------------- | ------ |
| number, string | 否     |

---

### `insetBlockEnd`

:::note
`insetBlockEnd` 仅在 [新架构](/architecture/landing-page) 中可用
:::

等同于 [`bottom`](layout-props#bottom)。

详情请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/inset-block-end)。

| 类型           | 必需   |
| -------------- | ------ |
| number, string | 否     |

---

### `insetBlockStart`

:::note
`insetBlockStart` 仅在 [新架构](/architecture/landing-page) 中可用
:::

等同于 [`top`](layout-props#top)。

详情请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/inset-block-start)。

| 类型           | 必需   |
| -------------- | ------ |
| number, string | 否     |

---

### `insetInline`

:::note
`insetInline` 仅在 [新架构](/architecture/landing-page) 中可用
:::

等同于 [`right`](layout-props#right) 和 [`left`](layout-props#left)。

详情请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/inset-inline)。

| 类型           | 必需   |
| -------------- | ------ |
| number, string | 否     |

---

### `insetInlineEnd`

:::note
`insetInlineEnd` 仅在 [新架构](/architecture/landing-page) 中可用
:::

当方向为 `ltr` 时，`insetInlineEnd` 等同于 [`right`](layout-props#right)；当方向为 `rtl` 时，等同于 [`left`](layout-props#left)。

详情请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/inset-inline-end)。

| 类型           | 必需   |
| -------------- | ------ |
| number, string | 否     |

---

### `insetInlineStart`

:::note
`insetInlineStart` 仅在 [新架构](/architecture/landing-page) 中可用
:::

当方向为 `ltr` 时，`insetInlineStart` 等同于 [`left`](layout-props#left)；当方向为 `rtl` 时，等同于 [`right`](layout-props#right)。

详情请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/inset-inline-start)。

| 类型           | 必需   |
| -------------- | ------ |
| number, string | 否     |

---

### `isolation`

:::note
`isolation` 仅在 [新架构](/architecture/landing-page) 中可用
:::

`isolation` 允许你创建 [堆叠上下文](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_positioned_layout/Stacking_context)。

有两个值：

- `auto`（默认）：无效果。
- `isolate`：创建堆叠上下文。

| 类型                    | 必需   |
| ----------------------- | ------ |
| 枚举('auto', 'isolate') | 否     |

---

### `justifyContent`

`justifyContent` 控制子元素在主轴方向的对齐方式。例如，如果子元素垂直排列，`justifyContent` 控制它们在垂直方向上的对齐。它的行为类似于 CSS 中的 `justify-content`（默认值：flex-start）。

详情请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/justify-content)。

| 类型                                                                                      | 必需   |
| ----------------------------------------------------------------------------------------- | ------ |
| 枚举('flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly') | 否     |

---

### `left`

`left` 是组件左边缘的逻辑像素偏移量。

它的用法类似于 CSS 中的 `left`，但在 React Native 中必须使用点数或百分比，不支持 em 等其他单位。

详情请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/left) 了解 `left` 如何影响布局。

| 类型           | 必需   |
| -------------- | ------ |
| number, string | 否     |

---

### `margin`

设置 `margin` 等同于分别设置 `marginTop`、`marginLeft`、`marginBottom` 和 `marginRight`。

详情请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/margin)。

| 类型           | 必需   |
| -------------- | ------ |
| number, string | 否     |

---

### `marginBottom`

`marginBottom` 类似于 CSS 中的 `margin-bottom`。详情见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-bottom)。

| 类型           | 必需   |
| -------------- | ------ |
| number, string | 否     |

---

### `marginBlock`

等同于 [`marginVertical`](layout-props#marginvertical)。

详情见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/margin-block)。

| 类型           | 必需   |
| -------------- | ------ |
| number, string | 否     |

---

### `marginBlockEnd`

等同于 [`marginBottom`](layout-props#marginbottom)。

详情见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/margin-block-end)。

| 类型           | 必需   |
| -------------- | ------ |
| number, string | 否     |

---

### `marginBlockStart`

等同于 [`marginTop`](layout-props#margintop)。

详情见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/margin-block-start)。

| 类型           | 必需   |
| -------------- | ------ |
| number, string | 否     |

---

### `marginEnd`

当方向为 `ltr` 时，`marginEnd` 等同于 `marginRight`；当方向为 `rtl` 时，等同于 `marginLeft`。

| 类型           | 必需   |
| -------------- | ------ |
| number, string | 否     |

---

### `marginHorizontal`

设置 `marginHorizontal` 等同于同时设置 `marginLeft` 和 `marginRight`。

| 类型           | 必需   |
| -------------- | ------ |
| number, string | 否     |

---

### `marginInline`

等同于 [`marginHorizontal`](layout-props#marginhorizontal)。

详情见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/margin-inline)。

| 类型           | 必需   |
| -------------- | ------ |
| number, string | 否     |

---

### `marginInlineEnd`

当方向为 `ltr` 时，`marginInlineEnd` 等同于 [`marginEnd`](layout-props#marginend)（即 `marginRight`）；当方向为 `rtl` 时，等同于 [`marginEnd`](layout-props#marginend)（即 `marginLeft`）。

详情见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/margin-inline-end)。

| 类型           | 必需   |
| -------------- | ------ |
| number, string | 否     |

---

### `marginInlineStart`

当方向为 `ltr` 时，`marginInlineStart` 等同于 [`marginStart`](layout-props#marginstart)（即 `marginLeft`）；当方向为 `rtl` 时，等同于 [`marginStart`](layout-props#marginstart)（即 `marginRight`）。

详情见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/margin-inline-start)。

| 类型           | 必需   |
| -------------- | ------ |
| number, string | 否     |

---

### `marginLeft`

`marginLeft` 类似于 CSS 中的 `margin-left`。详情见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-left)。

| 类型           | 必需   |
| -------------- | ------ |
| number, string | 否     |

---

### `marginRight`

`marginRight` 类似于 CSS 中的 `margin-right`。

详情见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-right)。

| 类型           | 必需   |
| -------------- | ------ |
| number, string | 否     |

---

### `marginStart`

当方向为 `ltr` 时，`marginStart` 等同于 `marginLeft`；当方向为 `rtl` 时，等同于 `marginRight`。

| 类型           | 必需   |
| -------------- | ------ |
| number, string | 否     |

---

### `marginTop`

`marginTop` 类似于 CSS 中的 `margin-top`。

详情见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-top)。

| 类型           | 必需   |
| -------------- | ------ |
| number, string | 否     |

---

### `marginVertical`

设置 `marginVertical` 等同于同时设置 `marginTop` 和 `marginBottom`。

| 类型           | 必需   |
| -------------- | ------ |
| number, string | 否     |

---

### `maxHeight`

`maxHeight` 是组件的最大高度，单位为逻辑像素。

类似于 CSS 中的 `max-height`，但在 React Native 中必须使用点数或百分比，不支持 em 等其他单位。

详情见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/max-height)。

| 类型           | 必需   |
| -------------- | ------ |
| number, string | 否     |

---

### `maxWidth`

`maxWidth` 是组件的最大宽度，单位为逻辑像素。

类似于 CSS 中的 `max-width`，但在 React Native 中必须使用点数或百分比，不支持 em 等其他单位。

详情见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/max-width)。

| 类型           | 必需   |
| -------------- | ------ |
| number, string | 否     |

---

### `minHeight`

`minHeight` 是组件的最小高度，单位为逻辑像素。

类似于 CSS 中的 `min-height`，但在 React Native 中必须使用点数或百分比，不支持 em 等其他单位。

详情见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/min-height)。

| 类型           | 必需   |
| -------------- | ------ |
| number, string | 否     |

---

### `minWidth`

`minWidth` 是组件的最小宽度，单位为逻辑像素。

类似于 CSS 中的 `min-width`，但在 React Native 中必须使用点数或百分比，不支持 em 等其他单位。

详情见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/min-width)。

| 类型           | 必需   |
| -------------- | ------ |
| number, string | 否     |

---

### `overflow`

`overflow` 控制子元素如何被测量和显示。`overflow: hidden` 会裁剪视图，而 `overflow: scroll` 使视图的测量独立于父容器的主轴。它的行为类似于 CSS 中的 `overflow`（默认值：visible）。

详情见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow)。

| 类型                                | 必需   |
| ----------------------------------- | ------ |
| 枚举('visible', 'hidden', 'scroll') | 否     |

---

### `padding`

设置 `padding` 等同于分别设置 `paddingTop`、`paddingBottom`、`paddingLeft` 和 `paddingRight`。

详情见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/padding)。

| 类型           | 必需   |
| -------------- | ------ |
| number, string | 否     |

---

### `paddingBottom`

`paddingBottom` 类似于 CSS 中的 `padding-bottom`。

详情见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/padding-bottom)。

| 类型           | 必需   |
| -------------- | ------ |
| number, string | 否     |

---

### `paddingBlock`

等同于 [`paddingVertical`](layout-props#paddingvertical)。

详情见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/padding-block)。

| 类型           | 必需   |
| -------------- | ------ |
| number, string | 否     |

---

### `paddingBlockEnd`

等同于 [`paddingBottom`](layout-props#paddingbottom)。

详情见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/padding-block-end)。

| 类型           | 必需   |
| -------------- | ------ |
| number, string | 否     |

---

### `paddingBlockStart`

等同于 [`paddingTop`](layout-props#paddingtop)。

详情见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/padding-block-start)。

| 类型           | 必需   |
| -------------- | ------ |
| number, string | 否     |

---

### `paddingEnd`

当方向为 `ltr` 时，`paddingEnd` 等同于 `paddingRight`；当方向为 `rtl` 时，等同于 `paddingLeft`。

| 类型           | 必需   |
| -------------- | ------ |
| number, string | 否     |

---

### `paddingHorizontal`

设置 `paddingHorizontal` 等同于同时设置 `paddingLeft` 和 `paddingRight`。

| 类型           | 必需   |
| -------------- | ------ |
| number, string | 否     |

---

### `paddingInline`

等同于 [`paddingHorizontal`](layout-props#paddinghorizontal)。

详情见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/padding-inline)。

| 类型           | 必需   |
| -------------- | ------ |
| number, string | 否     |

---

### `paddingInlineEnd`

当方向为 `ltr` 时，`paddingInlineEnd` 等同于 [`paddingEnd`](layout-props#paddingend)（即 `paddingRight`）；当方向为 `rtl` 时，等同于 [`paddingEnd`](layout-props#paddingend)（即 `paddingLeft`）。

详情见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/padding-inline-end)。

| 类型           | 必需   |
| -------------- | ------ |
| number, string | 否     |

---

### `paddingInlineStart`

当方向为 `ltr` 时，`paddingInlineStart` 等同于 [`paddingStart`](layout-props#paddingstart)（即 `paddingLeft`）；当方向为 `rtl` 时，等同于 [`paddingStart`](layout-props#paddingstart)（即 `paddingRight`）。

详情见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/padding-inline-start)。

| 类型           | 必需   |
| -------------- | ------ |
| number, string | 否     |

---

### `paddingLeft`

`paddingLeft` 类似于 CSS 中的 `padding-left`。

详情见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/padding-left)。

| 类型           | 必需   |
| -------------- | ------ |
| number, string | 否     |

---

### `paddingRight`

`paddingRight` 类似于 CSS 中的 `padding-right`。

详情见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/padding-right)。

| 类型           | 必需   |
| -------------- | ------ |
| number, string | 否     |

---

### `paddingStart`

当方向为 `ltr` 时，`paddingStart` 等同于 `paddingLeft`；当方向为 `rtl` 时，等同于 `paddingRight`。

| 类型           | 必需   |
| -------------- | ------ |
| number, string | 否     |

---

### `paddingTop`

`paddingTop` 类似于 CSS 中的 `padding-top`。

详情见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/padding-top)。

| 类型           | 必需   |
| -------------- | ------ |
| number, string | 否     |

---

### `paddingVertical`

设置 `paddingVertical` 等同于同时设置 `paddingTop` 和 `paddingBottom`。

| 类型           | 必需   |
| -------------- | ------ |
| number, string | 否     |

---

### `position`

React Native 中的 `position` 类似于 [标准 CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/position)，但默认值都是 `relative`。

- `relative` 会使元素依据正常布局流定位。内边距（`top`、`bottom`、`left`、`right`）相对该布局进行偏移。
- `absolute` 会使元素脱离正常布局流。内边距相对其 [包含块](./flexbox.md#the-containing-block) 偏移。
- `static` 会让元素按照正常布局流定位。内边距无效。`static` 元素不会为 `absolute` 子孙元素形成包含块。

更多信息请见 [基于 Flexbox 的布局文档](./flexbox.md#position)，以及 [Yoga 文档](https://www.yogalayout.dev/docs/styling/position) 了解 React Native 与 CSS 中 `position` 的区别。

| 类型                                   | 必需   |
| -------------------------------------- | ------ |
| 枚举('absolute', 'relative', 'static') | 否     |

---

### `right`

`right` 是组件右边缘的逻辑像素偏移量。

它的用法类似于 CSS 中的 `right`，但在 React Native 中必须使用点数或百分比，不支持 em 等其他单位。

详情请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/right) 了解 `right` 如何影响布局。

| 类型           | 必需   |
| -------------- | ------ |
| number, string | 否     |

---

### `rowGap`

`rowGap` 类似于 CSS 中的 `row-gap`。React Native 中仅支持像素单位。

详情请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/row-gap)。

| 类型   | 必需   |
| ------ | ------ |
| number | 否     |

---

### `start`

当方向为 `ltr` 时，`start` 等同于 `left`；当方向为 `rtl` 时，等同于 `right`。

此样式优先于 `left`、`right` 和 `end`。

| 类型           | 必需   |
| -------------- | ------ |
| number, string | 否     |

---

### `top`

`top` 是组件顶部边缘的逻辑像素偏移量。

它的用法类似于 CSS 中的 `top`，但在 React Native 中必须使用点数或百分比，不支持 em 等其他单位。

详情请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/top) 了解 `top` 如何影响布局。

| 类型           | 必需   |
| -------------- | ------ |
| number, string | 否     |

---

### `width`

`width` 设置组件宽度。

类似于 CSS 的 `width`，但在 React Native 中必须使用点数或百分比，不支持 em 等其他单位。

详情请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/width)。

| 类型           | 必需   |
| -------------- | ------ |
| number, string | 否     |

---

### `zIndex`

`zIndex` 控制组件的显示层级。通常不需要使用 `zIndex`，组件按文档树顺序渲染，后渲染的覆盖先渲染的。`zIndex` 在动画或自定义模态界面中有用，以打破默认渲染顺序。

它的行为类似 CSS 的 `z-index`，较大值的组件会渲染在上面。可以把 z 轴方向想象成从手机屏幕指向你的眼睛。

在 iOS 上，`zIndex` 可能需要组件是彼此的兄弟元素才能正常工作。

详情见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/z-index)。

| 类型   | 必需   |
| ------ | ------ |
| number | 否     |