---
id: layout-props
title: 布局属性
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

:::info
有关这些属性的更详细示例，可以在 [使用 Flexbox 布局](flexbox) 页面找到。
:::

### 示例

下面的示例展示了不同属性如何影响或塑造 React Native 布局。你可以尝试在更改属性 `flexWrap` 的值时，添加或移除 UI 中的方块。

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
                title="更改 Flex Direction"
                onPress={() =>
                  changeSetting(flexDirection, flexDirections, setFlexDirection)
                }
              />
              <Text style={styles.text}>{flexDirections[flexDirection]}</Text>
            </View>
            <View style={styles.buttonView}>
              <Button
                title="更改 Justify Content"
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
                title="更改 Align Items"
                onPress={() =>
                  changeSetting(alignItems, alignItemsArr, setAlignItems)
                }
              />
              <Text style={styles.text}>{alignItemsArr[alignItems]}</Text>
            </View>
            <View style={styles.buttonView}>
              <Button
                title="更改 Direction"
                onPress={() =>
                  changeSetting(direction, directions, setDirection)
                }
              />
              <Text style={styles.text}>{directions[direction]}</Text>
            </View>
            <View style={styles.buttonView}>
              <Button
                title="更改 Flex Wrap"
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
                title="更改 Flex Direction"
                onPress={() =>
                  changeSetting(flexDirection, flexDirections, setFlexDirection)
                }
              />
              <Text style={styles.text}>{flexDirections[flexDirection]}</Text>
            </View>
            <View style={styles.buttonView}>
              <Button
                title="更改 Justify Content"
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
                title="更改 Align Items"
                onPress={() =>
                  changeSetting(alignItems, alignItemsArr, setAlignItems)
                }
              />
              <Text style={styles.text}>{alignItemsArr[alignItems]}</Text>
            </View>
            <View style={styles.buttonView}>
              <Button
                title="更改 Direction"
                onPress={() =>
                  changeSetting(direction, directions, setDirection)
                }
              />
              <Text style={styles.text}>{directions[direction]}</Text>
            </View>
            <View style={styles.buttonView}>
              <Button
                title="更改 Flex Wrap"
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

`alignContent` 控制行在交叉方向上的对齐方式，会覆盖父组件的 `alignContent`。

有关更多详情，请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/align-content)。

| 类型                                                                                                 | 必需 |
| ---------------------------------------------------------------------------------------------------- | ---- |
| enum('flex-start', 'flex-end', 'center', 'stretch', 'space-between', 'space-around', 'space-evenly') | 否   |

---

### `alignItems`

`alignItems` 控制子组件在交叉方向上的对齐方式。例如，如果子组件是纵向排列的，`alignItems` 会控制它们如何在水平方向上对齐。它的作用类似于 CSS 中的 `align-items`（默认值：stretch）。

有关更多详情，请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/align-items)。

| 类型                                                            | 必需 |
| --------------------------------------------------------------- | ---- |
| enum('flex-start', 'flex-end', 'center', 'stretch', 'baseline') | 否   |

---

### `alignSelf`

`alignSelf` 控制子组件在交叉方向上的对齐方式，会覆盖父组件的 `alignItems`。它的作用类似于 CSS 中的 `align-self`（默认值：auto）。

有关更多详情，请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/align-self)。

| 类型                                                                    | 必需 |
| ----------------------------------------------------------------------- | ---- |
| enum('auto', 'flex-start', 'flex-end', 'center', 'stretch', 'baseline') | 否   |

---

### `aspectRatio`

宽高比控制节点未定义维度的大小。

- 对于已设置宽度/高度的节点，宽高比控制未设置维度的大小
- 对于已设置 flex basis 的节点，如果交叉轴维度未设置，宽高比控制节点在交叉轴上的大小
- 对于带有测量函数的节点，宽高比的作用类似于测量函数测量 flex basis
- 对于带有 flex grow/shrink 的节点，如果交叉轴维度未设置，宽高比控制节点在交叉轴上的大小
- 宽高比会考虑最小/最大尺寸

有关更多详情，请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `borderBottomWidth`

`borderBottomWidth` 的作用类似于 CSS 中的 `border-bottom-width`。

有关更多详情，请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/border-bottom-width)。

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

`borderLeftWidth` 的作用类似于 CSS 中的 `border-left-width`。

有关更多详情，请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/border-left-width)。

| 类型   | 必需 |
| ------ | ---- |
| number | 否   |

---

### `borderRightWidth`

`borderRightWidth` 的作用类似于 CSS 中的 `border-right-width`。

有关更多详情，请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/border-right-width)。

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

`borderTopWidth` 的作用类似于 CSS 中的 `border-top-width`。

有关更多详情，请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/border-top-width)。

| 类型   | 必需 |
| ------ | ---- |
| number | 否   |

---

### `borderWidth`

`borderWidth` 的作用类似于 CSS 中的 `border-width`。

有关更多详情，请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/border-width)。

| 类型   | 必需 |
| ------ | ---- |
| number | 否   |

---

### `bottom`

`bottom` 是用于偏移此组件底边的逻辑像素数。

它的作用类似于 CSS 中的 `bottom`，但在 React Native 中你必须使用点或百分比。Ems 和其他单位不受支持。

有关 `bottom` 如何影响布局的更多详情，请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/bottom)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `boxSizing`

`boxSizing` 定义元素的各类尺寸属性（`width`、`height`、`minWidth`、`minHeight` 等）如何计算。如果 `boxSizing` 为 `border-box`，这些尺寸将应用于元素的边框盒。如果为 `content-box`，这些尺寸将应用于元素的内容盒。默认值是 `border-box`。如果你想进一步了解此属性的工作方式，[Web 文档](https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing) 是一个很好的信息来源。

| 类型                              | 必需 |
| --------------------------------- | ---- |
| enum('border-box', 'content-box') | 否   |

---

### `columnGap`

`columnGap` 的作用类似于 CSS 中的 `column-gap`。在 React Native 中仅支持像素单位。

有关更多详情，请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/column-gap)。

| 类型   | 必需 |
| ------ | ---- |
| number | 否   |

---

### `direction`

`direction` 指定用户界面的方向流。默认值为 `inherit`，但根节点除外，根节点会根据当前区域设置具有对应的值。

有关更多详情，请参阅 [MDN CSS 参考](https://www.yogalayout.dev/docs/styling/layout-direction)。

| 类型                          | 必需 |
| ----------------------------- | ---- |
| enum('inherit', 'ltr', 'rtl') | 否   |

---

### `display`

`display` 设置此组件的显示类型。

它的作用类似于 CSS 中的 `display`，但只支持 'flex'、'none' 和 'contents'。默认值是 `flex`。

| 类型                             | 必需 |
| -------------------------------- | ---- |
| enum('none', 'flex', 'contents') | 否   |

---

### `end`

当方向为 `ltr` 时，`end` 等同于 `right`。当方向为 `rtl` 时，`end` 等同于 `left`。

此样式优先于 `left` 和 `right` 样式。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `flex`

在 React Native 中，`flex` 的工作方式与 CSS 不同。`flex` 是一个数字而不是字符串，并且它按照 [Yoga](https://github.com/facebook/yoga) 布局引擎的规则工作。

当 `flex` 为正数时，它会使组件具有弹性，并按其 flex 值的比例分配大小。因此，`flex` 设置为 `2` 的组件会占用 `flex` 设置为 `1` 的组件两倍的空间。`flex: <正数>` 等同于 `flexGrow: <正数>, flexShrink: 1, flexBasis: 0`。

当 `flex` 为 `0` 时，组件会根据 `width` 和 `height` 定义大小，并且没有弹性。

当 `flex` 为 `-1` 时，组件通常会根据 `width` 和 `height` 定义大小。不过，如果空间不足，组件会收缩到其 `minWidth` 和 `minHeight`。

`flexGrow`、`flexShrink` 和 `flexBasis` 的作用与 CSS 中相同。

| 类型   | 必需 |
| ------ | ---- |
| number | 否   |

---

### `flexBasis`

`flexBasis` 是一种与轴无关的方式，用于提供项目在主轴上的默认尺寸。为子组件设置 `flexBasis` 类似于：当其父组件是 `flexDirection: row` 的容器时设置该子组件的 `width`；或者当其父组件是 `flexDirection: column` 的容器时设置该子组件的 `height`。项目的 `flexBasis` 是其默认尺寸，即在执行任何 `flexGrow` 和 `flexShrink` 计算之前的尺寸。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `flexDirection`

`flexDirection` 控制容器中子组件的排列方向。`row` 表示从左到右，`column` 表示从上到下，另外两个的含义你应该也能猜到。它的作用类似于 CSS 中的 `flex-direction`，只是默认值是 `column`。

有关更多详情，请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/flex-direction)。

| 类型                                                   | 必需 |
| ------------------------------------------------------ | ---- |
| enum('row', 'row-reverse', 'column', 'column-reverse') | 否   |

---

### `flexGrow`

`flexGrow` 描述容器内任何剩余空间应如何沿主轴分配给其子组件。完成子组件布局后，容器会根据子组件指定的 flex grow 值分配剩余空间。

`flexGrow` 接受任何大于等于 0 的浮点数，默认值为 0。容器会根据子组件的 `flexGrow` 值按权重分配剩余空间。

| 类型   | 必需 |
| ------ | ---- |
| number | 否   |

---

### `flexShrink`

[`flexShrink`](layout-props#flexshrink) 描述当子组件总尺寸超过容器在主轴上的尺寸时，如何沿主轴收缩子组件。`flexShrink` 与 `flexGrow` 非常相似，如果将任何溢出的尺寸视为负的剩余空间，它们可以用同样的方式来理解。这两个属性也能很好地协同工作，使子组件能够按需伸缩。

`flexShrink` 接受任何大于等于 0 的浮点数，默认值为 0。容器会根据子组件的 `flexShrink` 值按权重收缩子组件。

| 类型   | 必需 |
| ------ | ---- |
| number | 否   |

---

### `flexWrap`

`flexWrap` 控制子组件在达到 flex 容器末尾后是否可以换行。它的作用类似于 CSS 中的 `flex-wrap`（默认值：nowrap）。

注意，它不再与 `alignItems: stretch`（默认值）一起工作，因此你可能希望改用 `alignItems: flex-start`，例如（破坏性变更详情：https://github.com/facebook/react-native/releases/tag/v0.28.0）。

有关更多详情，请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/flex-wrap)。

| 类型                                   | 必需 |
| -------------------------------------- | ---- |
| enum('wrap', 'nowrap', 'wrap-reverse') | 否   |

---

### `gap`

`gap` 的作用类似于 CSS 中的 `gap`。在 React Native 中仅支持像素单位。

有关更多详情，请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/gap)。

| 类型   | 必需 |
| ------ | ---- |
| number | 否   |

---

### `height`

`height` 设置此组件的高度。

它的作用类似于 CSS 中的 `height`，但在 React Native 中你必须使用点或百分比。Ems 和其他单位不受支持。

有关更多详情，请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/height)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `inset`

:::note
`inset` 仅在[新架构](/architecture/landing-page)中可用
:::

设置 `inset` 与分别设置 `top`、`bottom`、`right` 和 `left` 属性具有相同效果。

有关更多详情，请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/inset)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `insetBlock`

:::note
`insetBlock` 仅在[新架构](/architecture/landing-page)中可用
:::

等同于 [`top`](layout-props#top) 和 [`bottom`](layout-props#bottom)。

有关更多详情，请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/inset-block)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `insetBlockEnd`

:::note
`insetBlockEnd` 仅在[新架构](/architecture/landing-page)中可用
:::

等同于 [`bottom`](layout-props#bottom)。

有关更多详情，请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/inset-block-end)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `insetBlockStart`

:::note
`insetBlockStart` 仅在[新架构](/architecture/landing-page)中可用
:::

等同于 [`top`](layout-props#top)。

有关更多详情，请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/inset-block-start)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `insetInline`

:::note
`insetInline` 仅在[新架构](/architecture/landing-page)中可用
:::

等同于 [`right`](layout-props#right) 和 [`left`](layout-props#left)。

有关更多详情，请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/inset-inline)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `insetInlineEnd`

:::note
`insetInlineEnd` 仅在[新架构](/architecture/landing-page)中可用
:::

当方向为 `ltr` 时，`insetInlineEnd` 等同于 [`right`](layout-props#right)。当方向为 `rtl` 时，`insetInlineEnd` 等同于 [`left`](layout-props#left)。

有关更多详情，请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/inset-inline-end)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `insetInlineStart`

:::note
`insetInlineStart` 仅在[新架构](/architecture/landing-page)中可用
:::

当方向为 `ltr` 时，`insetInlineStart` 等同于 [`left`](layout-props#left)。当方向为 `rtl` 时，`insetInlineStart` 等同于 [`right`](layout-props#right)。

有关更多详情，请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/inset-inline-start)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `isolation`

:::note
`isolation` 仅在[新架构](/architecture/landing-page)中可用
:::

`isolation` 允许你形成一个[堆叠上下文](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_positioned_layout/Stacking_context)。

它有两个取值：

- `auto`（默认值）：不执行任何操作。
- `isolate`：形成一个堆叠上下文。

| 类型                    | 必需 |
| ----------------------- | ---- |
| enum('auto', 'isolate') | 否   |

---

### `justifyContent`

`justifyContent` 控制子组件在主方向上的对齐方式。例如，如果子组件是纵向排列的，`justifyContent` 会控制它们如何在垂直方向上对齐。它的作用类似于 CSS 中的 `justify-content`（默认值：flex-start）。

有关更多详情，请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/justify-content)。

| 类型                                                                                      | 必需 |
| ----------------------------------------------------------------------------------------- | ---- |
| enum('flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly') | 否   |

---

### `left`

`left` 是用于偏移此组件左边缘的逻辑像素数。

它的作用类似于 CSS 中的 `left`，但在 React Native 中你必须使用点或百分比。Ems 和其他单位不受支持。

有关 `left` 如何影响布局的更多详情，请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/left)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `margin`

设置 `margin` 与分别设置 `marginTop`、`marginLeft`、`marginBottom` 和 `marginRight` 具有相同效果。

有关更多详情，请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/margin)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `marginBottom`

`marginBottom` 的作用类似于 CSS 中的 `margin-bottom`。有关更多详情，请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-bottom)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `marginBlock`

等同于 [`marginVertical`](layout-props#marginvertical)。

有关更多详情，请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/margin-block)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `marginBlockEnd`

等同于 [`marginBottom`](layout-props#marginbottom)。

有关更多详情，请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/margin-block-end)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `marginBlockStart`

等同于 [`marginTop`](layout-props#margintop)。

有关更多详情，请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/margin-block-start)。

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

设置 `marginHorizontal` 与同时设置 `marginLeft` 和 `marginRight` 具有相同效果。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `marginInline`

等同于 [`marginHorizontal`](layout-props#marginhorizontal)。

有关更多详情，请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/margin-inline)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `marginInlineEnd`

当方向为 `ltr` 时，`marginInlineEnd` 等同于 [`marginEnd`](layout-props#marginend)（即 `marginRight`）。当方向为 `rtl` 时，`marginInlineEnd` 等同于 [`marginEnd`](layout-props#marginend)（即 `marginLeft`）。

有关更多详情，请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/margin-inline-end)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `marginInlineStart`

当方向为 `ltr` 时，`marginInlineStart` 等同于 [`marginStart`](layout-props#marginstart)（即 `marginLeft`）。当方向为 `rtl` 时，`marginInlineStart` 等同于 [`marginStart`](layout-props#marginstart)（即 `marginRight`）。

有关更多详情，请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/margin-inline-start)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `marginLeft`

`marginLeft` 的作用类似于 CSS 中的 `margin-left`。有关更多详情，请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-left)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `marginRight`

`marginRight` 的作用类似于 CSS 中的 `margin-right`。

有关更多详情，请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-right)。

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

`marginTop` 的作用类似于 CSS 中的 `margin-top`。

有关更多详情，请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-top)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `marginVertical`

设置 `marginVertical` 与同时设置 `marginTop` 和 `marginBottom` 具有相同效果。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `maxHeight`

`maxHeight` 是此组件的最大高度，单位为逻辑像素。

它的作用类似于 CSS 中的 `max-height`，但在 React Native 中你必须使用点或百分比。Ems 和其他单位不受支持。

有关更多详情，请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/max-height)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `maxWidth`

`maxWidth` 是此组件的最大宽度，单位为逻辑像素。

它的作用类似于 CSS 中的 `max-width`，但在 React Native 中你必须使用点或百分比。Ems 和其他单位不受支持。

有关更多详情，请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/max-width)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `minHeight`

`minHeight` 是此组件的最小高度，单位为逻辑像素。

它的作用类似于 CSS 中的 `min-height`，但在 React Native 中你必须使用点或百分比。Ems 和其他单位不受支持。

有关更多详情，请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/min-height)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `minWidth`

`minWidth` 是此组件的最小宽度，单位为逻辑像素。

它的作用类似于 CSS 中的 `min-width`，但在 React Native 中你必须使用点或百分比。Ems 和其他单位不受支持。

有关更多详情，请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/min-width)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `overflow`

`overflow` 控制子组件如何被测量和显示。`overflow: hidden` 会导致视图被裁剪，而 `overflow: scroll` 会使视图独立于其父级主轴进行测量。它的作用类似于 CSS 中的 `overflow`（默认值：visible）。

有关更多详情，请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow)。

| 类型                                | 必需 |
| ----------------------------------- | ---- |
| enum('visible', 'hidden', 'scroll') | 否   |

---

### `padding`

设置 `padding` 与分别设置 `paddingTop`、`paddingBottom`、`paddingLeft` 和 `paddingRight` 具有相同效果。

有关更多详情，请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/padding)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `paddingBottom`

`paddingBottom` 的作用类似于 CSS 中的 `padding-bottom`。

有关更多详情，请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/padding-bottom)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `paddingBlock`

等同于 [`paddingVertical`](layout-props#paddingvertical)。

有关更多详情，请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/padding-block)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `paddingBlockEnd`

等同于 [`paddingBottom`](layout-props#paddingbottom)。

有关更多详情，请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/padding-block-end)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `paddingBlockStart`

等同于 [`paddingTop`](layout-props#paddingtop)。

有关更多详情，请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/padding-block-start)。

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

设置 `paddingHorizontal` 就像同时设置 `paddingLeft` 和 `paddingRight` 一样。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `paddingInline`

等同于 [`paddingHorizontal`](layout-props#paddinghorizontal)。

有关更多详情，请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/padding-inline)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `paddingInlineEnd`

当方向为 `ltr` 时，`paddingInlineEnd` 等同于 [`paddingEnd`](layout-props#paddingend)（即 `paddingRight`）。当方向为 `rtl` 时，`paddingInlineEnd` 等同于 [`paddingEnd`](layout-props#paddingend)（即 `paddingLeft`）。

有关更多详情，请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/padding-inline-end)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `paddingInlineStart`

当方向为 `ltr` 时，`paddingInlineStart` 等同于 [`paddingStart`](layout-props#paddingstart)（即 `paddingLeft`）。当方向为 `rtl` 时，`paddingInlineStart` 等同于 [`paddingStart`](layout-props#paddingstart)（即 `paddingRight`）。

有关更多详情，请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/padding-inline-start)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `paddingLeft`

`paddingLeft` 的作用类似于 CSS 中的 `padding-left`。

有关更多详情，请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/padding-left)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `paddingRight`

`paddingRight` 的作用类似于 CSS 中的 `padding-right`。

有关更多详情，请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/padding-right)。

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

`paddingTop` 的作用类似于 CSS 中的 `padding-top`。

有关更多详情，请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/padding-top)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `paddingVertical`

设置 `paddingVertical` 就像同时设置 `paddingTop` 和 `paddingBottom` 一样。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `position`

React Native 中的 `position` 类似于[普通 CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/position)，但默认所有元素都设置为 `relative`。

`relative` 会根据布局的正常流来定位元素。偏移量（`top`、`bottom`、`left`、`right`）会相对于此布局进行偏移。

`absolute` 会将元素从布局的正常流中移除。偏移量会相对于其[包含块](./flexbox.md#the-containing-block)进行偏移。

`static` 会根据布局的正常流来定位元素。偏移量不会产生任何影响。
`static` 元素不会为绝对定位的后代形成包含块。

有关更多信息，请参阅 [Flexbox 布局文档](./flexbox.md#position)。另外，[Yoga 文档](https://www.yogalayout.dev/docs/styling/position) 也提供了关于 `position` 在 React Native 与 CSS 之间差异的更多细节。

| 类型                                   | 必需 |
| -------------------------------------- | ---- |
| enum('absolute', 'relative', 'static') | 否   |

---

### `right`

`right` 是用于偏移此组件右边缘的逻辑像素数。

它的作用类似于 CSS 中的 `right`，但在 React Native 中你必须使用点或百分比。Ems 和其他单位不受支持。

有关 `right` 如何影响布局的更多详情，请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/right)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `rowGap`

`rowGap` 的作用类似于 CSS 中的 `row-gap`。在 React Native 中仅支持像素单位。

有关更多详情，请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/row-gap)。

| 类型   | 必需 |
| ------ | ---- |
| number | 否   |

---

### `start`

当方向为 `ltr` 时，`start` 等同于 `left`。当方向为 `rtl` 时，`start` 等同于 `right`。

此样式优先于 `left`、`right` 和 `end` 样式。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `top`

`top` 是用于偏移此组件顶边的逻辑像素数。

它的作用类似于 CSS 中的 `top`，但在 React Native 中你必须使用点或百分比。Ems 和其他单位不受支持。

有关 `top` 如何影响布局的更多详情，请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/top)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `width`

`width` 设置此组件的宽度。

它的作用类似于 CSS 中的 `width`，但在 React Native 中你必须使用点或百分比。Ems 和其他单位不受支持。

有关更多详情，请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/width)。

| 类型           | 必需 |
| -------------- | ---- |
| number, string | 否   |

---

### `zIndex`

`zIndex` 控制哪些组件显示在其他组件之上。通常你不会使用 `zIndex`。组件会按照它们在文档树中的顺序渲染，因此后面的组件会覆盖前面的组件。如果你有动画或自定义模态界面，并且不希望出现这种行为，`zIndex` 可能会很有用。

它的作用类似于 CSS 的 `z-index` 属性——更大的 `zIndex` 值会渲染在上层。可以把 z 方向想象成从手机指向你眼球的方向。

在 iOS 上，`zIndex` 可能要求 `View` 彼此成为兄弟节点时才能按预期工作。

有关更多详情，请参阅 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/z-index)。

| 类型   | 必需 |
| ------ | ---- |
| number | 否   |
