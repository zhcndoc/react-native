---
id: layout-props
title: 布局属性
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

:::info
有关这些属性的更多详细示例，请参见[使用 Flexbox 布局](flexbox)页面。
:::

### 示例

以下示例展示了不同属性如何影响或塑造 React Native 布局。你可以尝试在更改属性 `flexWrap` 的值时，从 UI 中添加或删除正方形。

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer name=LayoutProps%20Example&ext=js
import {useState} from 'react';
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
import {useState} from 'react';
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

`alignContent` 控制行在交叉方向上的对齐方式，并覆盖父级的 `alignContent`。

有关更多详细信息，请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/align-content)。

| 类型                                                                                                 | 必需 |
| ---------------------------------------------------------------------------------------------------- | ---- |
| enum('flex-start', 'flex-end', 'center', 'stretch', 'space-between', 'space-around', 'space-evenly') | 否   |

---

### `alignItems`

`alignItems` 控制子元素在交叉方向上的对齐方式。例如，如果子元素沿垂直方向排列，`alignItems` 控制它们在水平方向上的对齐方式。它的工作方式类似于 CSS 中的 `align-items`（默认值：stretch）。

有关更多详细信息，请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/align-items)。

| 类型                                                            | 必需 |
| --------------------------------------------------------------- | ---- |
| enum('flex-start', 'flex-end', 'center', 'stretch', 'baseline') | 否   |

---

### `alignSelf`

`alignSelf` 控制子元素在交叉方向上的对齐方式，并覆盖父级的 `alignItems`。它的工作方式类似于 CSS 中的 `align-self`（默认值：auto）。

有关更多详细信息，请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/align-self)。

| 类型                                                                    | 必需 |
| ----------------------------------------------------------------------- | ---- |
| enum('auto', 'flex-start', 'flex-end', 'center', 'stretch', 'baseline') | 否   |

---

### `aspectRatio`

宽高比控制节点未定义尺寸的大小。

- 对于设置了宽度或高度的节点，宽高比控制未设置尺寸的大小
- 对于设置了 flex basis 的节点，如果交叉轴尺寸未设置，宽高比控制节点在交叉轴上的大小
- 对于具有测量函数的节点，宽高比的作用相当于测量函数测量 flex basis
- 对于具有 flex grow 或 shrink 的节点，如果交叉轴尺寸未设置，宽高比控制节点在交叉轴上的大小
- 宽高比会考虑最小和最大尺寸

有关更多详细信息，请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `borderBottomWidth`

`borderBottomWidth` 的工作方式类似于 CSS 中的 `border-bottom-width`。

有关更多详细信息，请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/border-bottom-width)。

| 类型   | 必需 |
| ------ | ---- |
| number | 否   |

---

### `borderEndWidth`

当方向为 `ltr` 时，`borderEndWidth` 等同于 `borderRightWidth`。当方向为 `rtl` 时，`borderEndWidth` 等同于 `borderLeftWidth`。

| 类型   | 必需 |
| ------ | ---- |
| number | 否   |

---

### `borderLeftWidth`

`borderLeftWidth` 的工作方式类似于 CSS 中的 `border-left-width`。

有关更多详细信息，请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/border-left-width)。

| 类型   | 必需 |
| ------ | ---- |
| number | 否   |

---

### `borderRightWidth`

`borderRightWidth` 的工作方式类似于 CSS 中的 `border-right-width`。

有关更多详细信息，请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/border-right-width)。

| 类型   | 必需 |
| ------ | ---- |
| number | 否   |

---

### `borderStartWidth`

当方向为 `ltr` 时，`borderStartWidth` 等同于 `borderLeftWidth`。当方向为 `rtl` 时，`borderStartWidth` 等同于 `borderRightWidth`。

| 类型   | 必需 |
| ------ | ---- |
| number | 否   |

---

### `borderTopWidth`

`borderTopWidth` 的工作方式类似于 CSS 中的 `border-top-width`。

有关更多详细信息，请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/border-top-width)。

| 类型   | 必需 |
| ------ | ---- |
| number | 否   |

---

### `borderWidth`

`borderWidth` 的工作方式类似于 CSS 中的 `border-width`。

有关更多详细信息，请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/border-width)。

| 类型   | 必需 |
| ------ | ---- |
| number | 否   |

---

### `bottom`

`bottom` 是该组件底边偏移的逻辑像素数。

它的工作方式类似于 CSS 中的 `bottom`，但在 React Native 中必须使用点或百分比。不支持 em 和其他单位。

有关 `bottom` 如何影响布局的更多详细信息，请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/bottom)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `boxSizing`

`boxSizing` 定义如何计算元素的各种尺寸属性（`width`、`height`、`minWidth`、`minHeight` 等）。如果 `boxSizing` 为 `border-box`，这些尺寸将应用于元素的边框盒。如果为 `content-box`，则应用于元素的内容盒。默认值为 `border-box`。如果你希望进一步了解此属性的工作方式，[Web 文档](https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing)是很好的信息来源。

| 类型                              | 必需 |
| --------------------------------- | ---- |
| enum('border-box', 'content-box') | 否   |

---

### `columnGap`

`columnGap` 的工作方式类似于 CSS 中的 `column-gap`。React Native 仅支持像素单位。

有关更多详细信息，请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/column-gap)。

| 类型   | 必需 |
| ------ | ---- |
| number | 否   |

---

### `direction`

`direction` 指定用户界面的方向流。默认值为 `inherit`，但根节点除外，根节点的值将基于当前区域设置。

有关更多详细信息，请参见 [MDN CSS 参考](https://www.yogalayout.dev/docs/styling/layout-direction)。

| 类型                          | 必需 |
| ----------------------------- | ---- |
| enum('inherit', 'ltr', 'rtl') | 否   |

---

### `display`

`display` 设置该组件的显示类型。

它的工作方式类似于 CSS 中的 `display`，但仅支持值 'flex'、'none' 和 'contents'。默认值为 `flex`。

| 类型                             | 必需 |
| -------------------------------- | ---- |
| enum('none', 'flex', 'contents') | 否   |

---

### `end`

当方向为 `ltr` 时，`end` 等同于 `right`。当方向为 `rtl` 时，`end` 等同于 `left`。

此样式的优先级高于 `left` 和 `right` 样式。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `flex`

在 React Native 中，`flex` 的工作方式与 CSS 中不同。`flex` 是数字而不是字符串，并且根据 [Yoga](https://github.com/facebook/yoga) 布局引擎运行。

当 `flex` 为正数时，组件会变得具有弹性，并按照其 flex 值的比例调整大小。因此，将 `flex` 设置为 `2` 的组件所占空间将是 `flex` 设置为 1 的组件的两倍。`flex: <positive number>` 等同于 `flexGrow: <positive number>, flexShrink: 1, flexBasis: 0`。

当 `flex` 为 `0` 时，组件根据 `width` 和 `height` 调整大小，并且不具有弹性。

当 `flex` 为 `-1` 时，组件通常根据 `width` 和 `height` 调整大小。但是，如果空间不足，组件将缩小到其 `minWidth` 和 `minHeight`。

`flexGrow`、`flexShrink` 和 `flexBasis` 的工作方式与 CSS 中相同。

| 类型   | 必需 |
| ------ | ---- |
| number | 否   |

---

### `flexBasis`

`flexBasis` 是一种与轴无关的方式，用于提供项目沿主轴的默认尺寸。设置子元素的 `flexBasis`，类似于在其父级为 `flexDirection: row` 的容器时设置该子元素的 `width`，或在其父级为 `flexDirection: column` 的容器时设置该子元素的 `height`。项目的 `flexBasis` 是该项目的默认尺寸，即执行任何 `flexGrow` 和 `flexShrink` 计算之前项目的尺寸。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `flexDirection`

`flexDirection` 控制容器子元素排列的方向。`row` 从左到右排列，`column` 从上到下排列，另外两个值的作用应该也不难猜到。它的工作方式类似于 CSS 中的 `flex-direction`，但默认值为 `column`。

有关更多详细信息，请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/flex-direction)。

| 类型                                                   | 必需 |
| ------------------------------------------------------ | ---- |
| enum('row', 'row-reverse', 'column', 'column-reverse') | 否   |

---

### `flexGrow`

`flexGrow` 描述容器中的空间应如何沿主轴分配给其子元素。布局其子元素后，容器会根据子元素指定的 flex grow 值分配所有剩余空间。

`flexGrow` 接受大于等于 0 的任意浮点值，默认值为 0。容器会根据子元素的 `flexGrow` 值加权，将所有剩余空间分配给子元素。

| 类型   | 必需 |
| ------ | ---- |
| number | 否   |

---

### `flexShrink`

[`flexShrink`](layout-props#flexshrink) 描述当子元素的总尺寸超出容器在主轴上的尺寸时，如何沿主轴缩小子元素。`flexShrink` 与 `flexGrow` 非常相似；如果将任何溢出尺寸视为负的剩余空间，可以用相同的方式理解它。通过允许子元素根据需要增长和缩小，这两个属性也能很好地协同工作。

`flexShrink` 接受大于等于 0 的任意浮点值，默认值为 0。容器会根据子元素的 `flexShrink` 值加权缩小其子元素。

| 类型   | 必需 |
| ------ | ---- |
| number | 否   |

---

### `flexWrap`

`flexWrap` 控制子元素在到达 flex 容器末端后是否可以换行。它的工作方式类似于 CSS 中的 `flex-wrap`（默认值：nowrap）。

请注意，它不再与 `alignItems: stretch`（默认值）一起工作，因此你可能需要使用 `alignItems: flex-start`，例如（重大变更详情：https://github.com/facebook/react-native/releases/tag/v0.28.0）。

有关更多详细信息，请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/flex-wrap)。

| 类型                                   | 必需 |
| -------------------------------------- | ---- |
| enum('wrap', 'nowrap', 'wrap-reverse') | 否   |

---

### `gap`

`gap` 的工作方式类似于 CSS 中的 `gap`。React Native 仅支持像素单位。

有关更多详细信息，请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/gap)。

| 类型   | 必需 |
| ------ | ---- |
| number | 否   |

---

### `height`

`height` 设置该组件的高度。

它的工作方式类似于 CSS 中的 `height`，但在 React Native 中必须使用点或百分比。不支持 em 和其他单位。

有关更多详细信息，请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/height)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `inset`

:::note
`inset` 仅在[新架构](/architecture/landing-page)中可用
:::

设置 `inset` 的效果与分别设置 `top`、`bottom`、`right` 和 `left` 属性相同。

有关更多详细信息，请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/inset)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `insetBlock`

:::note
`insetBlock` 仅在[新架构](/architecture/landing-page)中可用
:::

等同于 [`top`](layout-props#top) 和 [`bottom`](layout-props#bottom)。

有关更多详细信息，请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/inset-block)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `insetBlockEnd`

:::note
`insetBlockEnd` 仅在[新架构](/architecture/landing-page)中可用
:::

等同于 [`bottom`](layout-props#bottom)。

有关更多详细信息，请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/inset-block-end)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `insetBlockStart`

:::note
`insetBlockStart` 仅在[新架构](/architecture/landing-page)中可用
:::

等同于 [`top`](layout-props#top)。

有关更多详细信息，请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/inset-block-start)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `insetInline`

:::note
`insetInline` 仅在[新架构](/architecture/landing-page)中可用
:::

等同于 [`right`](layout-props#right) 和 [`left`](layout-props#left)。

有关更多详细信息，请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/inset-inline)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `insetInlineEnd`

:::note
`insetInlineEnd` 仅在[新架构](/architecture/landing-page)中可用
:::

当方向为 `ltr` 时，`insetInlineEnd` 等同于 [`right`](layout-props#right)。当方向为 `rtl` 时，`insetInlineEnd` 等同于 [`left`](layout-props#left)。

有关更多详细信息，请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/inset-inline-end)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `insetInlineStart`

:::note
`insetInlineStart` 仅在[新架构](/architecture/landing-page)中可用
:::

当方向为 `ltr` 时，`insetInlineStart` 等同于 [`left`](layout-props#left)。当方向为 `rtl` 时，`insetInlineStart` 等同于 [`right`](layout-props#right)。

有关更多详细信息，请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/inset-inline-start)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `isolation`

:::note
`isolation` 仅在[新架构](/architecture/landing-page)中可用
:::

`isolation` 允许你形成一个[堆叠上下文](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_positioned_layout/Stacking_context)。

有两个值：

- `auto`（默认值）：不执行任何操作
- `isolate`：形成堆叠上下文

| 类型                    | 必需 |
| ----------------------- | ---- |
| enum('auto', 'isolate') | 否   |

---

### `justifyContent`

`justifyContent` 控制子元素在主方向上的对齐方式。例如，如果子元素沿垂直方向排列，`justifyContent` 控制它们在垂直方向上的对齐方式。它的工作方式类似于 CSS 中的 `justify-content`（默认值：flex-start）。

有关更多详细信息，请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/justify-content)。

| 类型                                                                                      | 必需 |
| ----------------------------------------------------------------------------------------- | ---- |
| enum('flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly') | 否   |

---

### `left`

`left` 是该组件左边缘偏移的逻辑像素数。

它的工作方式类似于 CSS 中的 `left`，但在 React Native 中必须使用点或百分比。不支持 em 和其他单位。

有关 `left` 如何影响布局的更多详细信息，请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/left)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `margin`

设置 `margin` 的效果与分别设置 `marginTop`、`marginLeft`、`marginBottom` 和 `marginRight` 相同。

有关更多详细信息，请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/margin)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `marginBottom`

`marginBottom` 的工作方式类似于 CSS 中的 `margin-bottom`。有关更多详细信息，请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-bottom)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `marginBlock`

等同于 [`marginVertical`](layout-props#marginvertical)。

有关更多详细信息，请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/margin-block)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `marginBlockEnd`

等同于 [`marginBottom`](layout-props#marginbottom)。

有关更多详细信息，请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/margin-block-end)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `marginBlockStart`

等同于 [`marginTop`](layout-props#margintop)。

有关更多详细信息，请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/margin-block-start)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `marginEnd`

当方向为 `ltr` 时，`marginEnd` 等同于 `marginRight`。当方向为 `rtl` 时，`marginEnd` 等同于 `marginLeft`。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `marginHorizontal`

设置 `marginHorizontal` 的效果与同时设置 `marginLeft` 和 `marginRight` 相同。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `marginInline`

等同于 [`marginHorizontal`](layout-props#marginhorizontal)。

有关更多详细信息，请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/margin-inline)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `marginInlineEnd`

当方向为 `ltr` 时，`marginInlineEnd` 等同于 [`marginEnd`](layout-props#marginend)（即 `marginRight`）。当方向为 `rtl` 时，`marginInlineEnd` 等同于 [`marginEnd`](layout-props#marginend)（即 `marginLeft`）。

有关更多详细信息，请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/margin-inline-end)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `marginInlineStart`

当方向为 `ltr` 时，`marginInlineStart` 等同于 [`marginStart`](layout-props#marginstart)（即 `marginLeft`）。当方向为 `rtl` 时，`marginInlineStart` 等同于 [`marginStart`](layout-props#marginstart)（即 `marginRight`）。

有关更多详细信息，请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/margin-inline-start)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `marginLeft`

`marginLeft` 的工作方式类似于 CSS 中的 `margin-left`。有关更多详细信息，请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-left)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `marginRight`

`marginRight` 的工作方式类似于 CSS 中的 `margin-right`。

有关更多详细信息，请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-right)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `marginStart`

当方向为 `ltr` 时，`marginStart` 等同于 `marginLeft`。当方向为 `rtl` 时，`marginStart` 等同于 `marginRight`。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `marginTop`

`marginTop` 的工作方式类似于 CSS 中的 `margin-top`。

有关更多详细信息，请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-top)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `marginVertical`

设置 `marginVertical` 的效果与同时设置 `marginTop` 和 `marginBottom` 相同。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `maxHeight`

`maxHeight` 是该组件的最大高度，以逻辑像素为单位。

它的工作方式类似于 CSS 中的 `max-height`，但在 React Native 中必须使用点或百分比。不支持 em 和其他单位。

有关更多详细信息，请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/max-height)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `maxWidth`

`maxWidth` 是该组件的最大宽度，以逻辑像素为单位。

它的工作方式类似于 CSS 中的 `max-width`，但在 React Native 中必须使用点或百分比。不支持 em 和其他单位。

有关更多详细信息，请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/max-width)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `minHeight`

`minHeight` 是该组件的最小高度，以逻辑像素为单位。

它的工作方式类似于 CSS 中的 `min-height`，但在 React Native 中必须使用点或百分比。不支持 em 和其他单位。

有关更多详细信息，请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/min-height)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `minWidth`

`minWidth` 是该组件的最小宽度，以逻辑像素为单位。

它的工作方式类似于 CSS 中的 `min-width`，但在 React Native 中必须使用点或百分比。不支持 em 和其他单位。

有关更多详细信息，请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/min-width)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `overflow`

`overflow` 控制子元素的测量和显示方式。`overflow: hidden` 会裁剪视图，而 `overflow: scroll` 会使视图的测量独立于其父级的主轴。它的工作方式类似于 CSS 中的 `overflow`（默认值：visible）。

有关更多详细信息，请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow)。

| 类型                                | 必需 |
| ----------------------------------- | ---- |
| enum('visible', 'hidden', 'scroll') | 否   |

---

### `padding`

设置 `padding` 的效果与分别设置 `paddingTop`、`paddingBottom`、`paddingLeft` 和 `paddingRight` 相同。

有关更多详细信息，请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/padding)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `paddingBottom`

`paddingBottom` 的工作方式类似于 CSS 中的 `padding-bottom`。

有关更多详细信息，请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/padding-bottom)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `paddingBlock`

等同于 [`paddingVertical`](layout-props#paddingvertical)。

有关更多详细信息，请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/padding-block)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `paddingBlockEnd`

等同于 [`paddingBottom`](layout-props#paddingbottom)。

有关更多详细信息，请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/padding-block-end)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `paddingBlockStart`

等同于 [`paddingTop`](layout-props#paddingtop)。

有关更多详细信息，请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/padding-block-start)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `paddingEnd`

当方向为 `ltr` 时，`paddingEnd` 等同于 `paddingRight`。当方向为 `rtl` 时，`paddingEnd` 等同于 `paddingLeft`。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `paddingHorizontal`

设置 `paddingHorizontal` 相当于同时设置 `paddingLeft` 和 `paddingRight`。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `paddingInline`

等同于 [`paddingHorizontal`](layout-props#paddinghorizontal)。

有关更多详细信息，请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/padding-inline)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `paddingInlineEnd`

当方向为 `ltr` 时，`paddingInlineEnd` 等同于 [`paddingEnd`](layout-props#paddingend)（即 `paddingRight`）。当方向为 `rtl` 时，`paddingInlineEnd` 等同于 [`paddingEnd`](layout-props#paddingend)（即 `paddingLeft`）。

有关更多详细信息，请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/padding-inline-end)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `paddingInlineStart`

当方向为 `ltr` 时，`paddingInlineStart` 等同于 [`paddingStart`](layout-props#paddingstart)（即 `paddingLeft`）。当方向为 `rtl` 时，`paddingInlineStart` 等同于 [`paddingStart`](layout-props#paddingstart)（即 `paddingRight`）。

有关更多详细信息，请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/padding-inline-start)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `paddingLeft`

`paddingLeft` 的工作方式类似于 CSS 中的 `padding-left`。

有关更多详细信息，请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/padding-left)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `paddingRight`

`paddingRight` 的工作方式类似于 CSS 中的 `padding-right`。

有关更多详细信息，请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/padding-right)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `paddingStart`

当方向为 `ltr` 时，`paddingStart` 等同于 `paddingLeft`。当方向为 `rtl` 时，`paddingStart` 等同于 `paddingRight`。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `paddingTop`

`paddingTop` 的工作方式类似于 CSS 中的 `padding-top`。

有关更多详细信息，请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/padding-top)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `paddingVertical`

设置 `paddingVertical` 相当于同时设置 `paddingTop` 和 `paddingBottom`。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `position`

React Native 中的 `position` 类似于[常规 CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/position)，但默认情况下所有内容都设置为 `relative`。

`relative` 会根据布局的正常流定位元素。内嵌偏移（`top`、`bottom`、`left`、`right`）将相对于此布局进行偏移。

`absolute` 会将元素移出布局的正常流。内嵌偏移将相对于其[包含块](./flexbox.md#the-containing-block)进行偏移。

`static` 会根据布局的正常流定位元素。内嵌偏移不会产生任何效果。
`static` 元素不会为绝对定位的后代元素形成包含块。

有关更多信息，请参阅[使用 Flexbox 布局文档](./flexbox.md#position)。此外，[Yoga 文档](https://www.yogalayout.dev/docs/styling/position)还详细说明了 `position` 在 React Native 和 CSS 之间的差异。

| 类型                                   | 必需 |
| -------------------------------------- | ---- |
| enum('absolute', 'relative', 'static') | 否   |

---

### `right`

`right` 是该组件右边缘偏移的逻辑像素数。

它的工作方式类似于 CSS 中的 `right`，但在 React Native 中必须使用点或百分比。不支持 em 和其他单位。

有关 `right` 如何影响布局的更多详细信息，请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/right)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `rowGap`

`rowGap` 的工作方式类似于 CSS 中的 `row-gap`。React Native 仅支持像素单位。

有关更多详细信息，请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/row-gap)。

| 类型   | 必需 |
| ------ | ---- |
| number | 否   |

---

### `start`

当方向为 `ltr` 时，`start` 等同于 `left`。当方向为 `rtl` 时，`start` 等同于 `right`。

此样式的优先级高于 `left`、`right` 和 `end` 样式。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `top`

`top` 是该组件顶边偏移的逻辑像素数。

它的工作方式类似于 CSS 中的 `top`，但在 React Native 中必须使用点或百分比。不支持 em 和其他单位。

有关 `top` 如何影响布局的更多详细信息，请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/top)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `width`

`width` 设置该组件的宽度。

它的工作方式类似于 CSS 中的 `width`，但在 React Native 中必须使用点或百分比。不支持 em 和其他单位。

有关更多详细信息，请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/width)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `zIndex`

`zIndex` 控制哪些组件显示在其他组件之上。通常情况下，你不会使用 `zIndex`。组件会按照其在文档树中的顺序进行渲染，因此后面的组件会绘制在前面的组件之上。如果你有动画或自定义模态界面，不希望采用这种行为，`zIndex` 可能会很有用。

它的工作方式类似于 CSS 的 `z-index` 属性——`zIndex` 较大的组件会渲染在上方。可以将 z 方向想象成从手机指向你的眼睛。

在 iOS 上，可能需要让 `View` 彼此成为兄弟节点，`zIndex` 才能按预期工作。

有关更多详细信息，请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/z-index)。

| 类型   | 必需 |
| ------ | ---- |
| number | 否   |
