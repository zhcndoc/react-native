---
id: layout-props
title: 布局属性
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

:::info
关于这些属性的更详细示例可以在 [使用 Flexbox 布局](flexbox) 页面找到。
:::

### 示例

以下示例展示了不同的属性如何影响或塑造 React Native 布局。例如，您可以尝试在更改属性 flexWrap 的值的同时，从 UI 中添加或移除方块。

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
                title="Change Flex Direction"
                onPress={() =>
                  changeSetting(flexDirection, flexDirections, setFlexDirection)
                }
              />
              <Text style={styles.text}>{flexDirections[flexDirection]}</Text>
            </View>
            <View style={styles.buttonView}>
              <Button
                title="Change Justify Content"
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
                title="Change Align Items"
                onPress={() =>
                  changeSetting(alignItems, alignItemsArr, setAlignItems)
                }
              />
              <Text style={styles.text}>{alignItemsArr[alignItems]}</Text>
            </View>
            <View style={styles.buttonView}>
              <Button
                title="Change Direction"
                onPress={() =>
                  changeSetting(direction, directions, setDirection)
                }
              />
              <Text style={styles.text}>{directions[direction]}</Text>
            </View>
            <View style={styles.buttonView}>
              <Button
                title="Change Flex Wrap"
                onPress={() => changeSetting(wrap, wraps, setWrap)}
              />
              <Text style={styles.text}>{wraps[wrap]}</Text>
            </View>
            <View style={styles.buttonView}>
              <Button
                title="Add Square"
                onPress={() => setSquares([...squares, <Square />])}
              />
            </View>
            <View style={styles.buttonView}>
              <Button
                title="Delete Square"
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
                title="Change Flex Direction"
                onPress={() =>
                  changeSetting(flexDirection, flexDirections, setFlexDirection)
                }
              />
              <Text style={styles.text}>{flexDirections[flexDirection]}</Text>
            </View>
            <View style={styles.buttonView}>
              <Button
                title="Change Justify Content"
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
                title="Change Align Items"
                onPress={() =>
                  changeSetting(alignItems, alignItemsArr, setAlignItems)
                }
              />
              <Text style={styles.text}>{alignItemsArr[alignItems]}</Text>
            </View>
            <View style={styles.buttonView}>
              <Button
                title="Change Direction"
                onPress={() =>
                  changeSetting(direction, directions, setDirection)
                }
              />
              <Text style={styles.text}>{directions[direction]}</Text>
            </View>
            <View style={styles.buttonView}>
              <Button
                title="Change Flex Wrap"
                onPress={() => changeSetting(wrap, wraps, setWrap)}
              />
              <Text style={styles.text}>{wraps[wrap]}</Text>
            </View>
            <View style={styles.buttonView}>
              <Button
                title="Add Square"
                onPress={() => setSquares([...squares, <Square />])}
              />
            </View>
            <View style={styles.buttonView}>
              <Button
                title="Delete Square"
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

`alignContent` 控制行如何在交叉轴方向上对齐，覆盖父元素的 `alignContent`。

参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/align-content) 了解更多详情。

| 类型                                                                                                 | 是否必填 |
| ---------------------------------------------------------------------------------------------------- | -------- |
| 枚举 ('flex-start', 'flex-end', 'center', 'stretch', 'space-between', 'space-around', 'space-evenly') | 否       |

---

### `alignItems`

`alignItems` 在交叉轴方向上对齐子元素。例如，如果子元素垂直流动，`alignItems` 控制它们如何水平对齐。它的工作原理类似于 CSS 中的 `align-items`（默认值：stretch）。

参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/align-items) 了解更多详情。

| 类型                                                            | 是否必填 |
| --------------------------------------------------------------- | -------- |
| 枚举 ('flex-start', 'flex-end', 'center', 'stretch', 'baseline') | 否       |

---

### `alignSelf`

`alignSelf` 控制子元素如何在交叉轴方向上对齐，覆盖父元素的 `alignItems`。它的工作原理类似于 CSS 中的 `align-self`（默认值：auto）。

参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/align-self) 了解更多详情。

| 类型                                                                    | 是否必填 |
| ----------------------------------------------------------------------- | -------- |
| 枚举 ('auto', 'flex-start', 'flex-end', 'center', 'stretch', 'baseline') | 否       |

---

### `aspectRatio`

宽高比控制节点未定义维度的大小。

- 在设置了宽度/高度的节点上，宽高比控制未设置维度的大小
- 在设置了 flex 基准的节点上，如果未设置，宽高比控制节点在交叉轴上的大小
- 在具有测量函数的节点上，宽高比的工作原理仿佛测量函数测量的是 flex 基准
- 在具有 flex 增长/收缩的节点上，如果未设置，宽高比控制节点在交叉轴上的大小
- 宽高比会考虑最小/最大维度

参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio) 了解更多详情。

| 类型           | 是否必填 |
| -------------- | -------- |
| number, string | 否       |

---

### `borderBottomWidth`

`borderBottomWidth` 的工作原理类似于 CSS 中的 `border-bottom-width`。

参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/border-bottom-width) 了解更多详情。

| 类型   | 是否必填 |
| ------ | -------- |
| number | 否       |

---

### `borderEndWidth`

当方向为 `ltr` 时，`borderEndWidth` 等同于 `borderRightWidth`。当方向为 `rtl` 时，`borderEndWidth` 等同于 `borderLeftWidth`。

| 类型   | 是否必填 |
| ------ | -------- |
| number | 否       |

---

### `borderLeftWidth`

`borderLeftWidth` 的工作原理类似于 CSS 中的 `border-left-width`。

参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/border-left-width) 了解更多详情。

| 类型   | 是否必填 |
| ------ | -------- |
| number | 否       |

---

### `borderRightWidth`

`borderRightWidth` 的工作原理类似于 CSS 中的 `border-right-width`。

参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/border-right-width) 了解更多详情。

| 类型   | 是否必填 |
| ------ | -------- |
| number | 否       |

---

### `borderStartWidth`

当方向为 `ltr` 时，`borderStartWidth` 等同于 `borderLeftWidth`。当方向为 `rtl` 时，`borderStartWidth` 等同于 `borderRightWidth`。

| 类型   | 是否必填 |
| ------ | -------- |
| number | 否       |

---

### `borderTopWidth`

`borderTopWidth` 的工作原理类似于 CSS 中的 `border-top-width`。

参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/border-top-width) 了解更多详情。

| 类型   | 是否必填 |
| ------ | -------- |
| number | 否       |

---

### `borderWidth`

`borderWidth` 的工作原理类似于 CSS 中的 `border-width`。

参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/border-width) 了解更多详情。

| 类型   | 是否必填 |
| ------ | -------- |
| number | 否       |

---

### `bottom`

`bottom` 是偏移此组件底部边缘的逻辑像素数。

它的工作原理类似于 CSS 中的 `bottom`，但在 React Native 中你必须使用点数或百分比。不支持 Em 及其他单位。

参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/bottom) 了解更多关于 `bottom` 如何影响布局的详情。

| 类型           | 是否必填 |
| -------------- | -------- |
| number, string | 否       |

---

### `boxSizing`

`boxSizing` 定义如何计算元素的各种尺寸属性（`width`、`height`、`minWidth`、`minHeight` 等）。如果 `boxSizing` 为 `border-box`，这些尺寸适用于元素的边框盒。如果为 `content-box`，它们适用于元素的内容盒。默认值为 `border-box`。如果你想了解更多关于此属性如何工作的信息，[Web 文档](https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing) 是一个很好的信息来源。

| 类型                              | 是否必填 |
| --------------------------------- | -------- |
| 枚举 ('border-box', 'content-box') | 否       |

---

### `columnGap`

`columnGap` 的工作原理类似于 CSS 中的 `column-gap`。React Native 中仅支持像素单位。

参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/column-gap) 了解更多详情。

| 类型   | 是否必填 |
| ------ | -------- |
| number | 否       |

---

### `direction`

`direction` 指定用户界面的方向流。默认值为 `inherit`，根节点除外，其值将基于当前区域设置。

参见 [MDN CSS 参考](https://www.yogalayout.dev/docs/styling/layout-direction) 了解更多详情。

| 类型                          | 是否必填 |
| ----------------------------- | -------- |
| 枚举 ('inherit', 'ltr', 'rtl') | 否       |

---

### `display`

`display` 设置此组件的显示类型。

它的工作原理类似于 CSS 中的 `display`，但仅支持值 'flex'、'none' 和 'contents'。默认值为 `flex`。

| 类型                             | 是否必填 |
| -------------------------------- | -------- |
| 枚举 ('none', 'flex', 'contents') | 否       |

---

### `end`

当方向为 `ltr` 时，`end` 等同于 `right`。当方向为 `rtl` 时，`end` 等同于 `left`。

此样式优先于 `left` 和 `right` 样式。

| 类型           | 是否必填 |
| -------------- | -------- |
| number, string | 否       |

---

### `flex`

在 React Native 中，`flex` 的工作方式与 CSS 中不完全相同。`flex` 是一个数字而不是字符串，它根据 [Yoga](https://github.com/facebook/yoga) 布局引擎工作。

当 `flex` 为正数时，它使组件具有灵活性，并且其大小将与其 flex 值成比例。因此，`flex` 设置为 `2` 的组件将占据 `flex` 设置为 1 的组件两倍的空間。`flex: <正数>` 等同于 `flexGrow: <正数>, flexShrink: 1, flexBasis: 0`。

当 `flex` 为 `0` 时，组件根据 `width` 和 `height` 调整大小，并且它是不可灵活的。

当 `flex` 为 `-1` 时，组件通常根据 `width` 和 `height` 调整大小。但是，如果没有足够的空间，组件将收缩到其 `minWidth` 和 `minHeight`。

`flexGrow`、`flexShrink` 和 `flexBasis` 的工作方式与 CSS 中相同。

| 类型   | 是否必填 |
| ------ | -------- |
| number | 否       |

---

### `flexBasis`

`flexBasis` 是一种与轴无关的方式，用于提供项目沿主轴的默认大小。设置子元素的 `flexBasis` 类似于设置该子元素的 `width`（如果其父元素是 `flexDirection: row` 的容器）或设置子元素的 `height`（如果其父元素是 `flexDirection: column` 的容器）。项目的 `flexBasis` 是该项目的默认大小，即在执行任何 `flexGrow` 和 `flexShrink` 计算之前的大小。

| 类型           | 是否必填 |
| -------------- | -------- |
| number, string | 否       |

---

### `flexDirection`

`flexDirection` 控制容器的子元素走向哪个方向。`row` 从左到右，`column` 从上到下，你可以猜到另外两个做什么。它的工作原理类似于 CSS 中的 `flex-direction`，除了默认值为 `column`。

参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/flex-direction) 了解更多详情。

| 类型                                                   | 是否必填 |
| ------------------------------------------------------ | -------- |
| 枚举 ('row', 'row-reverse', 'column', 'column-reverse') | 否       |

---

### `flexGrow`

`flexGrow` 描述容器内的任何空间应如何沿主轴在其子元素之间分配。在布局其子元素后，容器将根据其子元素指定的 flex 增长值分配任何剩余空间。

`flexGrow` 接受任何 >= 0 的浮点值，默认值为 0。容器将根据子元素的 `flexGrow` 值加权分配任何剩余空间。

| 类型   | 是否必填 |
| ------ | -------- |
| number | 否       |

---

### `flexShrink`

[`flexShrink`](layout-props#flexshrink) 描述在子元素的总大小溢出容器主轴大小的情况下，如何沿主轴收缩子元素。`flexShrink` 与 `flexGrow` 非常相似，如果任何溢出大小被视为负剩余空间，则可以以相同的方式思考。这两个属性也配合得很好，允许子元素根据需要增长和收缩。

`flexShrink` 接受任何 >= 0 的浮点值，默认值为 0。容器将根据子元素的 `flexShrink` 值加权收缩其子元素。

| 类型   | 是否必填 |
| ------ | -------- |
| number | 否       |

---

### `flexWrap`

`flexWrap` 控制子元素在碰到 flex 容器末端后是否可以换行。它的工作原理类似于 CSS 中的 `flex-wrap`（默认值：nowrap）。

注意，它不再与 `alignItems: stretch`（默认值）一起工作，因此你可能想使用 `alignItems: flex-start` 例如（变更详情：https://github.com/facebook/react-native/releases/tag/v0.28.0）。

参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/flex-wrap) 了解更多详情。

| 类型                                   | 是否必填 |
| -------------------------------------- | -------- |
| 枚举 ('wrap', 'nowrap', 'wrap-reverse') | 否       |

---

### `gap`

`gap` 的工作原理类似于 CSS 中的 `gap`。React Native 中仅支持像素单位。

参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/gap) 了解更多详情。

| 类型   | 是否必填 |
| ------ | -------- |
| number | 否       |

---

### `height`

`height` 设置此组件的高度。

它的工作原理类似于 CSS 中的 `height`，但在 React Native 中你必须使用点数或百分比。不支持 Em 及其他单位。

参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/height) 了解更多详情。

| 类型           | 是否必填 |
| -------------- | -------- |
| number, string | 否       |

---

### `inset`

:::note
`inset` 仅在 [新架构](/architecture/landing-page) 上可用
:::

设置 `inset` 的效果与设置 `top`、`bottom`、`right` 和 `left` 属性中的每一个相同。

参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/inset) 了解更多详情。

| 类型           | 是否必填 |
| -------------- | -------- |
| number, string | 否       |

---

### `insetBlock`

:::note
`insetBlock` 仅在 [新架构](/architecture/landing-page) 上可用
:::

等同于 [`top`](layout-props#top) 和 [`bottom`](layout-props#bottom)。

参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/inset-block) 了解更多详情。

| 类型           | 是否必填 |
| -------------- | -------- |
| number, string | 否       |

---

### `insetBlockEnd`

:::note
`insetBlockEnd` 仅在 [新架构](/architecture/landing-page) 上可用
:::

等同于 [`bottom`](layout-props#bottom)。

参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/inset-block-end) 了解更多详情。

| 类型           | 是否必填 |
| -------------- | -------- |
| number, string | 否       |

---

### `insetBlockStart`

:::note
`insetBlockStart` 仅在 [新架构](/architecture/landing-page) 上可用
:::

等同于 [`top`](layout-props#top)。

参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/inset-block-start) 了解更多详情。

| 类型           | 是否必填 |
| -------------- | -------- |
| number, string | 否       |

---

### `insetInline`

:::note
`insetInline` 仅在 [新架构](/architecture/landing-page) 上可用
:::

等同于 [`right`](layout-props#right) 和 [`left`](layout-props#left)。

参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/inset-inline) 了解更多详情。

| 类型           | 是否必填 |
| -------------- | -------- |
| number, string | 否       |

---

### `insetInlineEnd`

:::note
`insetInlineEnd` 仅在 [新架构](/architecture/landing-page) 上可用
:::

当方向为 `ltr` 时，`insetInlineEnd` 等同于 [`right`](layout-props#right)。当方向为 `rtl` 时，`insetInlineEnd` 等同于 [`left`](layout-props#left)。

参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/inset-inline-end) 了解更多详情。

| 类型           | 是否必填 |
| -------------- | -------- |
| number, string | 否       |

---

### `insetInlineStart`

:::note
`insetInlineStart` 仅在 [新架构](/architecture/landing-page) 上可用
:::

当方向为 `ltr` 时，`insetInlineStart` 等同于 [`left`](layout-props#left)。当方向为 `rtl` 时，`insetInlineStart` 等同于 [`right`](layout-props#right)。

参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/inset-inline-start) 了解更多详情。

| 类型           | 是否必填 |
| -------------- | -------- |
| number, string | 否       |

---

### `isolation`

:::note
`isolation` 仅在 [新架构](/architecture/landing-page) 上可用
:::

`isolation` 让你形成一个 [堆叠上下文](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_positioned_layout/Stacking_context)。

有两个值：

- `auto`（默认）：什么都不做。
- `isolate`：形成一个堆叠上下文。

| 类型                    | 是否必填 |
| ----------------------- | -------- |
| 枚举 ('auto', 'isolate') | 否       |

---

### `justifyContent`

`justifyContent` 在主轴方向上对齐子元素。例如，如果子元素垂直流动，`justifyContent` 控制它们如何垂直对齐。它的工作原理类似于 CSS 中的 `justify-content`（默认值：flex-start）。

参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/justify-content) 了解更多详情。

| 类型                                                                                      | 是否必填 |
| ----------------------------------------------------------------------------------------- | -------- |
| 枚举 ('flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly') | 否       |

---

### `left`

`left` 是偏移此组件左边缘的逻辑像素数。

它的工作原理类似于 CSS 中的 `left`，但在 React Native 中你必须使用点数或百分比。不支持 Em 及其他单位。

参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/left) 了解更多关于 `left` 如何影响布局的详情。

| 类型           | 是否必填 |
| -------------- | -------- |
| number, string | 否       |

---

### `margin`

设置 `margin` 的效果与设置 `marginTop`、`marginLeft`、`marginBottom` 和 `marginRight` 中的每一个相同。

参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/margin) 了解更多详情。

| 类型           | 是否必填 |
| -------------- | -------- |
| number, string | 否       |

---

### `marginBottom`

`marginBottom` 的工作原理类似于 CSS 中的 `margin-bottom`。参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-bottom) 了解更多详情。

| 类型           | 是否必填 |
| -------------- | -------- |
| number, string | 否       |

---

### `marginBlock`

等同于 [`marginVertical`](layout-props#marginvertical)。

参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/margin-block) 了解更多详情。

| 类型           | 是否必填 |
| -------------- | -------- |
| number, string | 否       |

---

### `marginBlockEnd`

等同于 [`marginBottom`](layout-props#marginbottom)。

参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/margin-block-end) 了解更多详情。

| 类型           | 是否必填 |
| -------------- | -------- |
| number, string | 否       |

---

### `marginBlockStart`

等同于 [`marginTop`](layout-props#margintop)。

参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/margin-block-start) 了解更多详情。

| 类型           | 是否必填 |
| -------------- | -------- |
| number, string | 否       |

---

### `marginEnd`

当方向为 `ltr` 时，`marginEnd` 等同于 `marginRight`。当方向为 `rtl` 时，`marginEnd` 等同于 `marginLeft`。

| 类型           | 是否必填 |
| -------------- | -------- |
| number, string | 否       |

---

### `marginHorizontal`

设置 `marginHorizontal` 的效果与同时设置 `marginLeft` 和 `marginRight` 相同。

| 类型           | 是否必填 |
| -------------- | -------- |
| number, string | 否       |

---

### `marginInline`

等同于 [`marginHorizontal`](layout-props#marginhorizontal)。

参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/margin-inline) 了解更多详情。

| 类型           | 是否必填 |
| -------------- | -------- |
| number, string | 否       |

---

### `marginInlineEnd`

当方向为 `ltr` 时，`marginInlineEnd` 等同于 [`marginEnd`](layout-props#marginend)（即 `marginRight`）。当方向为 `rtl` 时，`marginInlineEnd` 等同于 [`marginEnd`](layout-props#marginend)（即 `marginLeft`）。

参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/margin-inline-end) 了解更多详情。

| 类型           | 是否必填 |
| -------------- | -------- |
| number, string | 否       |

---

### `marginInlineStart`

当方向为 `ltr` 时，`marginInlineStart` 等同于 [`marginStart`](layout-props#marginstart)（即 `marginLeft`）。当方向为 `rtl` 时，`marginInlineStart` 等同于 [`marginStart`](layout-props#marginstart)（即 `marginRight`）。

参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/margin-inline-start) 了解更多详情。

| 类型           | 是否必填 |
| -------------- | -------- |
| number, string | 否       |

---

### `marginLeft`

`marginLeft` 的工作原理类似于 CSS 中的 `margin-left`。参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-left) 了解更多详情。

| 类型           | 是否必填 |
| -------------- | -------- |
| number, string | 否       |

---

### `marginRight`

`marginRight` 的工作原理类似于 CSS 中的 `margin-right`。

参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-right) 了解更多详情。

| 类型           | 是否必填 |
| -------------- | -------- |
| number, string | 否       |

---

### `marginStart`

当方向为 `ltr` 时，`marginStart` 等同于 `marginLeft`。当方向为 `rtl` 时，`marginStart` 等同于 `marginRight`。

| 类型           | 是否必填 |
| -------------- | -------- |
| number, string | 否       |

---

### `marginTop`

`marginTop` 的工作原理类似于 CSS 中的 `margin-top`。

参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-top) 了解更多详情。

| 类型           | 是否必填 |
| -------------- | -------- |
| number, string | 否       |

---

### `marginVertical`

设置 `marginVertical` 的效果与同时设置 `marginTop` 和 `marginBottom` 相同。

| 类型           | 是否必填 |
| -------------- | -------- |
| number, string | 否       |

---

### `maxHeight`

`maxHeight` 是此组件的最大高度，单位为逻辑像素。

它的工作原理类似于 CSS 中的 `max-height`，但在 React Native 中你必须使用点数或百分比。不支持 Em 及其他单位。

参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/max-height) 了解更多详情。

| 类型           | 是否必填 |
| -------------- | -------- |
| number, string | 否       |

---

### `maxWidth`

`maxWidth` 是此组件的最大宽度，单位为逻辑像素。

它的工作原理类似于 CSS 中的 `max-width`，但在 React Native 中你必须使用点数或百分比。不支持 Em 及其他单位。

参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/max-width) 了解更多详情。

| 类型           | 是否必填 |
| -------------- | -------- |
| number, string | 否       |

---

### `minHeight`

`minHeight` 是此组件的最小高度，单位为逻辑像素。

它的工作原理类似于 CSS 中的 `min-height`，但在 React Native 中你必须使用点数或百分比。不支持 Em 及其他单位。

参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/min-height) 了解更多详情。

| 类型           | 是否必填 |
| -------------- | -------- |
| number, string | 否       |

---

### `minWidth`

`minWidth` 是此组件的最小宽度，单位为逻辑像素。

它的工作原理类似于 CSS 中的 `min-width`，但在 React Native 中你必须使用点数或百分比。不支持 Em 及其他单位。

参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/min-width) 了解更多详情。

| 类型           | 是否必填 |
| -------------- | -------- |
| number, string | 否       |

---

### `overflow`

`overflow` 控制子元素如何测量和显示。`overflow: hidden` 导致视图被裁剪，而 `overflow: scroll` 导致视图独立于其父元素的主轴进行测量。它的工作原理类似于 CSS 中的 `overflow`（默认值：visible）。

参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow) 了解更多详情。

| 类型                                | 是否必填 |
| ----------------------------------- | -------- |
| 枚举 ('visible', 'hidden', 'scroll') | 否       |

---

### `padding`

设置 `padding` 的效果与设置 `paddingTop`、`paddingBottom`、`paddingLeft` 和 `paddingRight` 中的每一个相同。

参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/padding) 了解更多详情。

| 类型           | 是否必填 |
| -------------- | -------- |
| number, string | 否       |

---

### `paddingBottom`

`paddingBottom` 的工作原理类似于 CSS 中的 `padding-bottom`。

参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/padding-bottom) 了解更多详情。

| 类型           | 是否必填 |
| -------------- | -------- |
| number, string | 否       |

---

### `paddingBlock`

等同于 [`paddingVertical`](layout-props#paddingvertical)。

参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/padding-block) 了解更多详情。

| 类型           | 是否必填 |
| -------------- | -------- |
| number, string | 否       |

---

### `paddingBlockEnd`

等同于 [`paddingBottom`](layout-props#paddingbottom)。

参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/padding-block-end) 了解更多详情。

| 类型           | 是否必填 |
| -------------- | -------- |
| number, string | 否       |

---

### `paddingBlockStart`

等同于 [`paddingTop`](layout-props#paddingtop)。

参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/padding-block-start) 了解更多详情。

| 类型           | 是否必填 |
| -------------- | -------- |
| number, string | 否       |

---

### `paddingEnd`

当方向为 `ltr` 时，`paddingEnd` 等同于 `paddingRight`。当方向为 `rtl` 时，`paddingEnd` 等同于 `paddingLeft`。

| 类型           | 是否必填 |
| -------------- | -------- |
| number, string | 否       |

---

### `paddingHorizontal`

设置 `paddingHorizontal` 类似于同时设置 `paddingLeft` 和 `paddingRight`。

| 类型           | 是否必填 |
| -------------- | -------- |
| number, string | 否       |

---

### `paddingInline`

等同于 [`paddingHorizontal`](layout-props#paddinghorizontal)。

参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/padding-inline) 了解更多详情。

| 类型           | 是否必填 |
| -------------- | -------- |
| number, string | 否       |

---

### `paddingInlineEnd`

当方向为 `ltr` 时，`paddingInlineEnd` 等同于 [`paddingEnd`](layout-props#paddingend)（即 `paddingRight`）。当方向为 `rtl` 时，`paddingInlineEnd` 等同于 [`paddingEnd`](layout-props#paddingend)（即 `paddingLeft`）。

参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/padding-inline-end) 了解更多详情。

| 类型           | 是否必填 |
| -------------- | -------- |
| number, string | 否       |

---

### `paddingInlineStart`

当方向为 `ltr` 时，`paddingInlineStart` 等同于 [`paddingStart`](layout-props#paddingstart)（即 `paddingLeft`）。当方向为 `rtl` 时，`paddingInlineStart` 等同于 [`paddingStart`](layout-props#paddingstart)（即 `paddingRight`）。

参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/padding-inline-start) 了解更多详情。

| 类型           | 是否必填 |
| -------------- | -------- |
| number, string | 否       |

---

### `paddingLeft`

`paddingLeft` 的工作原理类似于 CSS 中的 `padding-left`。

参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/padding-left) 了解更多详情。

| 类型           | 是否必填 |
| -------------- | -------- |
| number, string | 否       |

---

### `paddingRight`

`paddingRight` 的工作原理类似于 CSS 中的 `padding-right`。

参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/padding-right) 了解更多详情。

| 类型           | 是否必填 |
| -------------- | -------- |
| number, string | 否       |

---

### `paddingStart`

当方向为 `ltr` 时，`paddingStart` 等同于 `paddingLeft`。当方向为 `rtl` 时，`paddingStart` 等同于 `paddingRight`。

| 类型           | 是否必填 |
| -------------- | -------- |
| number, string | 否       |

---

### `paddingTop`

`paddingTop` 的工作原理类似于 CSS 中的 `padding-top`。

参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/padding-top) 了解更多详情。

| 类型           | 是否必填 |
| -------------- | -------- |
| number, string | 否       |

---

### `paddingVertical`

设置 `paddingVertical` 类似于同时设置 `paddingTop` 和 `paddingBottom`。

| 类型           | 是否必填 |
| -------------- | -------- |
| number, string | 否       |

---

### `position`

React Native 中的 `position` 类似于 [常规 CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/position)，但默认情况下所有内容都设置为 `relative`。

`relative` 将根据布局的正常流定位元素。插入值（`top`、`bottom`、`left`、`right`）将相对于此布局进行偏移。

`absolute` 将元素从布局的正常流中取出。插入值将相对于其 [包含块](./flexbox.md#the-containing-block) 进行偏移。

`static` 将根据布局的正常流定位元素。插入值将无效。
`static` 元素不为绝对后代形成包含块。

有关更多信息，请参阅 [使用 Flexbox 布局文档](./flexbox.md#position)。此外，[Yoga 文档](https://www.yogalayout.dev/docs/styling/position) 有关於 `position` 在 React Native 和 CSS 之间如何不同的更多详情。

| 类型                                   | 是否必填 |
| -------------------------------------- | -------- |
| 枚举 ('absolute', 'relative', 'static') | 否       |

---

### `right`

`right` 是偏移此组件右边缘的逻辑像素数。

它的工作原理类似于 CSS 中的 `right`，但在 React Native 中你必须使用点数或百分比。不支持 Em 及其他单位。

参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/right) 了解更多关于 `right` 如何影响布局的详情。

| 类型           | 是否必填 |
| -------------- | -------- |
| number, string | 否       |

---

### `rowGap`

`rowGap` 的工作原理类似于 CSS 中的 `row-gap`。React Native 中仅支持像素单位。

参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/row-gap) 了解更多详情。

| 类型   | 是否必填 |
| ------ | -------- |
| number | 否       |

---

### `start`

当方向为 `ltr` 时，`start` 等同于 `left`。当方向为 `rtl` 时，`start` 等同于 `right`。

此样式优先于 `left`、`right` 和 `end` 样式。

| 类型           | 是否必填 |
| -------------- | -------- |
| number, string | 否       |

---

### `top`

`top` 是偏移此组件顶部边缘的逻辑像素数。

它的工作原理类似于 CSS 中的 `top`，但在 React Native 中你必须使用点数或百分比。不支持 Em 及其他单位。

参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/top) 了解更多关于 `top` 如何影响布局的详情。

| 类型           | 是否必填 |
| -------------- | -------- |
| number, string | 否       |

---

### `width`

`width` 设置此组件的宽度。

它的工作原理类似于 CSS 中的 `width`，但在 React Native 中你必须使用点数或百分比。不支持 Em 及其他单位。

参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/width) 了解更多详情。

| 类型           | 是否必填 |
| -------------- | -------- |
| number, string | 否       |

---

### `zIndex`

`zIndex` 控制哪些组件显示在其他组件之上。通常，你不使用 `zIndex`。组件根据它们在文档树中的顺序渲染，因此后面的组件绘制在较早的组件之上。如果你有动画或自定义模态界面且不希望出现这种行为，`zIndex` 可能很有用。

它的工作原理类似于 CSS `z-index` 属性 - 具有较大 `zIndex` 的组件将渲染在顶部。将 z 方向想象成它从手机指向你的眼球。

在 iOS 上，`zIndex` 可能需要 `View` 互为兄弟元素才能按预期工作。

参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/z-index) 了解更多详情。

| 类型   | 是否必填 |
| ------ | -------- |
| number | 否       |
