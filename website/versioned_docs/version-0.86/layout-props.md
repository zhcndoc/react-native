---
id: layout-props
title: 布局属性
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

:::info
关于这些属性的更详细示例可以在 [使用 Flexbox 布局](flexbox) 页面中找到。
:::

### 示例

下面的示例展示了不同属性如何影响或塑造 React Native 布局。你可以尝试例如在更改属性 `flexWrap` 的值时，向 UI 中添加或删除方块。

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

`alignContent` 控制行在交叉方向上的对齐方式，会覆盖父组件的 `alignContent`。

更多详情请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/align-content)。

| 类型                                                                                                 | 必需 |
| ---------------------------------------------------------------------------------------------------- | -------- |
| enum('flex-start', 'flex-end', 'center', 'stretch', 'space-between', 'space-around', 'space-evenly') | 否       |

---

### `alignItems`

`alignItems` 控制子元素在交叉方向上的对齐方式。例如，如果子元素是垂直排列的，`alignItems` 就控制它们如何水平对齐。其作用类似于 CSS 中的 `align-items`（默认值：stretch）。

更多详情请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/align-items)。

| 类型                                                            | 必需 |
| --------------------------------------------------------------- | -------- |
| enum('flex-start', 'flex-end', 'center', 'stretch', 'baseline') | 否       |

---

### `alignSelf`

`alignSelf` 控制子元素在交叉方向上的对齐方式，会覆盖父组件的 `alignItems`。其作用类似于 CSS 中的 `align-self`（默认值：auto）。

更多详情请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/align-self)。

| 类型                                                                    | 必需 |
| ----------------------------------------------------------------------- | -------- |
| enum('auto', 'flex-start', 'flex-end', 'center', 'stretch', 'baseline') | 否       |

---

### `aspectRatio`

宽高比控制节点未定义尺寸的大小。

- 对于已设置宽/高的节点，宽高比控制未设置维度的大小
- 对于已设置 flex basis 的节点，如果未设置，则宽高比控制其在交叉轴上的大小
- 对于带有 measure function 的节点，宽高比的作用相当于 measure function 测量 flex basis
- 对于设置了 flex grow/shrink 的节点，如果未设置，则宽高比控制其在交叉轴上的大小
- 宽高比会考虑最小/最大尺寸

更多详情请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio)。

| 类型           | 必需 |
| -------------- | -------- |
| number, string | 否       |

---

### `borderBottomWidth`

`borderBottomWidth` 的作用类似于 CSS 中的 `border-bottom-width`。

更多详情请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/border-bottom-width)。

| 类型   | 必需 |
| ------ | -------- |
| number | 否       |

---

### `borderEndWidth`

当 direction 为 `ltr` 时，`borderEndWidth` 等同于 `borderRightWidth`。当 direction 为 `rtl` 时，`borderEndWidth` 等同于 `borderLeftWidth`。

| 类型   | 必需 |
| ------ | -------- |
| number | 否       |

---

### `borderLeftWidth`

`borderLeftWidth` 的作用类似于 CSS 中的 `border-left-width`。

更多详情请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/border-left-width)。

| 类型   | 必需 |
| ------ | -------- |
| number | 否       |

---

### `borderRightWidth`

`borderRightWidth` 的作用类似于 CSS 中的 `border-right-width`。

更多详情请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/border-right-width)。

| 类型   | 必需 |
| ------ | -------- |
| number | 否       |

---

### `borderStartWidth`

当 direction 为 `ltr` 时，`borderStartWidth` 等同于 `borderLeftWidth`。当 direction 为 `rtl` 时，`borderStartWidth` 等同于 `borderRightWidth`。

| 类型   | 必需 |
| ------ | -------- |
| number | 否       |

---

### `borderTopWidth`

`borderTopWidth` 的作用类似于 CSS 中的 `border-top-width`。

更多详情请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/border-top-width)。

| 类型   | 必需 |
| ------ | -------- |
| number | 否       |

---

### `borderWidth`

`borderWidth` 的作用类似于 CSS 中的 `border-width`。

更多详情请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/border-width)。

| 类型   | 必需 |
| ------ | -------- |
| number | 否       |

---

### `bottom`

`bottom` 是用于偏移该组件底边的逻辑像素数。

它的工作方式类似于 CSS 中的 `bottom`，但在 React Native 中必须使用点数或百分比。Ems 和其他单位不受支持。

更多关于 `bottom` 如何影响布局的细节，请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/bottom)。

| 类型           | 必需 |
| -------------- | -------- |
| number, string | 否       |

---

### `boxSizing`

`boxSizing` 定义元素的各种尺寸属性（`width`、`height`、`minWidth`、`minHeight` 等）如何计算。如果 `boxSizing` 为 `border-box`，这些尺寸会应用于元素的边框盒。如果为 `content-box`，则应用于元素的内容盒。默认值是 `border-box`。如果你想了解更多关于此属性的工作方式，[Web 文档](https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing) 是很好的信息来源。

| 类型                              | 必需 |
| --------------------------------- | -------- |
| enum('border-box', 'content-box') | 否       |

---

### `columnGap`

`columnGap` 的作用类似于 CSS 中的 `column-gap`。React Native 仅支持像素单位。

更多详情请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/column-gap)。

| 类型   | 必需 |
| ------ | -------- |
| number | 否       |

---

### `direction`

`direction` 指定用户界面的方向流。默认值为 `inherit`，但根节点会根据当前区域设置使用对应的值。

更多详情请参见 [MDN CSS 参考](https://www.yogalayout.dev/docs/styling/layout-direction)。

| 类型                          | 必需 |
| ----------------------------- | -------- |
| enum('inherit', 'ltr', 'rtl') | 否       |

---

### `display`

`display` 设置该组件的显示类型。

它的工作方式类似于 CSS 中的 `display`，但只支持 'flex'、'none' 和 'contents'。默认值为 `flex`。

| 类型                             | 必需 |
| -------------------------------- | -------- |
| enum('none', 'flex', 'contents') | 否       |

---

### `end`

当 direction 为 `ltr` 时，`end` 等同于 `right`。当 direction 为 `rtl` 时，`end` 等同于 `left`。

此样式的优先级高于 `left` 和 `right` 样式。

| 类型           | 必需 |
| -------------- | -------- |
| number, string | 否       |

---

### `flex`

在 React Native 中，`flex` 的工作方式与 CSS 不同。`flex` 是一个数值而不是字符串，并且它按照 [Yoga](https://github.com/facebook/yoga) 布局引擎的规则工作。

当 `flex` 为正数时，它会使组件具有弹性，并按其 flex 值的比例分配尺寸。因此，`flex` 设为 `2` 的组件会占据 `flex` 设为 1 的组件两倍的空间。`flex: <positive number>` 等同于 `flexGrow: <positive number>, flexShrink: 1, flexBasis: 0`。

当 `flex` 为 `0` 时，组件会根据 `width` 和 `height` 定尺寸，并且没有弹性。

当 `flex` 为 `-1` 时，组件通常会根据 `width` 和 `height` 定尺寸。不过，如果空间不足，组件会收缩到其 `minWidth` 和 `minHeight`。

`flexGrow`、`flexShrink` 和 `flexBasis` 的作用与 CSS 中相同。

| 类型   | 必需 |
| ------ | -------- |
| number | 否       |

---

### `flexBasis`

`flexBasis` 是一种与轴无关的方式，用于提供项目在主轴上的默认尺寸。为子元素设置 `flexBasis`，类似于在父元素为 `flexDirection: row` 的容器时设置该子元素的 `width`，或在父元素为 `flexDirection: column` 的容器时设置该子元素的 `height`。项目的 `flexBasis` 是该项目的默认尺寸，即在执行任何 `flexGrow` 和 `flexShrink` 计算之前的尺寸。

| 类型           | 必需 |
| -------------- | -------- |
| number, string | 否       |

---

### `flexDirection`

`flexDirection` 控制容器子元素的排列方向。`row` 表示从左到右，`column` 表示从上到下，另外两个的作用你大概也能猜到。它的作用类似于 CSS 中的 `flex-direction`，只是默认值为 `column`。

更多详情请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/flex-direction)。

| 类型                                                   | 必需 |
| ------------------------------------------------------ | -------- |
| enum('row', 'row-reverse', 'column', 'column-reverse') | 否       |

---

### `flexGrow`

`flexGrow` 描述容器中的可用空间应如何沿主轴分配给子元素。在布局完成后，容器会根据其子元素指定的 flex grow 值分配剩余空间。

`flexGrow` 接受任何大于等于 0 的浮点值，默认值为 0。容器会按子元素的 `flexGrow` 值加权分配剩余空间。

| 类型   | 必需 |
| ------ | -------- |
| number | 否       |

---

### `flexShrink`

[`flexShrink`](layout-props#flexshrink) 描述当子元素总尺寸在主轴上超出容器尺寸时，如何沿主轴收缩子元素。`flexShrink` 与 `flexGrow` 非常相似，如果将任何溢出尺寸视为负的剩余空间，它们也可以以相同方式理解。这两个属性也可以很好地协同工作，使子元素能够按需伸缩。

`flexShrink` 接受任何大于等于 0 的浮点值，默认值为 0。容器会按子元素的 `flexShrink` 值加权收缩子元素。

| 类型   | 必需 |
| ------ | -------- |
| number | 否       |

---

### `flexWrap`

`flexWrap` 控制子元素在到达 flex 容器末尾后是否可以换行。它的作用类似于 CSS 中的 `flex-wrap`（默认值：nowrap）。

注意，它不再与 `alignItems: stretch`（默认值）一起工作，因此你可能需要例如使用 `alignItems: flex-start`（破坏性变更详情：https://github.com/facebook/react-native/releases/tag/v0.28.0）。

更多详情请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/flex-wrap)。

| 类型                                   | 必需 |
| -------------------------------------- | -------- |
| enum('wrap', 'nowrap', 'wrap-reverse') | 否       |

---

### `gap`

`gap` 的作用类似于 CSS 中的 `gap`。React Native 仅支持像素单位。

更多详情请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/gap)。

| 类型   | 必需 |
| ------ | -------- |
| number | 否       |

---

### `height`

`height` 设置该组件的高度。

它的工作方式类似于 CSS 中的 `height`，但在 React Native 中必须使用点数或百分比。Ems 和其他单位不受支持。

更多详情请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/height)。

| 类型           | 必需 |
| -------------- | -------- |
| number, string | 否       |

---

### `inset`

:::note
`inset` 仅在 [新架构](/architecture/landing-page) 中可用
:::

设置 `inset` 的效果与分别设置 `top`、`bottom`、`right` 和 `left` 属性相同。

更多详情请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/inset)。

| 类型           | 必需 |
| -------------- | -------- |
| number, string | 否       |

---

### `insetBlock`

:::note
`insetBlock` 仅在 [新架构](/architecture/landing-page) 中可用
:::

等同于 [`top`](layout-props#top) 和 [`bottom`](layout-props#bottom)。

更多详情请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/inset-block)。

| 类型           | 必需 |
| -------------- | -------- |
| number, string | 否       |

---

### `insetBlockEnd`

:::note
`insetBlockEnd` 仅在 [新架构](/architecture/landing-page) 中可用
:::

等同于 [`bottom`](layout-props#bottom)。

更多详情请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/inset-block-end)。

| 类型           | 必需 |
| -------------- | -------- |
| number, string | 否       |

---

### `insetBlockStart`

:::note
`insetBlockStart` 仅在 [新架构](/architecture/landing-page) 中可用
:::

等同于 [`top`](layout-props#top)。

更多详情请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/inset-block-start)。

| 类型           | 必需 |
| -------------- | -------- |
| number, string | 否       |

---

### `insetInline`

:::note
`insetInline` 仅在 [新架构](/architecture/landing-page) 中可用
:::

等同于 [`right`](layout-props#right) 和 [`left`](layout-props#left)。

更多详情请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/inset-inline)。

| 类型           | 必需 |
| -------------- | -------- |
| number, string | 否       |

---

### `insetInlineEnd`

:::note
`insetInlineEnd` 仅在 [新架构](/architecture/landing-page) 中可用
:::

当 direction 为 `ltr` 时，`insetInlineEnd` 等同于 [`right`](layout-props#right)。当 direction 为 `rtl` 时，`insetInlineEnd` 等同于 [`left`](layout-props#left)。

更多详情请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/inset-inline-end)。

| 类型           | 必需 |
| -------------- | -------- |
| number, string | 否       |

---

### `insetInlineStart`

:::note
`insetInlineStart` 仅在 [新架构](/architecture/landing-page) 中可用
:::

当 direction 为 `ltr` 时，`insetInlineStart` 等同于 [`left`](layout-props#left)。当 direction 为 `rtl` 时，`insetInlineStart` 等同于 [`right`](layout-props#right)。

更多详情请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/inset-inline-start)。

| 类型           | 必需 |
| -------------- | -------- |
| number, string | 否       |

---

### `isolation`

:::note
`isolation` 仅在 [新架构](/architecture/landing-page) 中可用
:::

`isolation` 允许你形成一个[层叠上下文](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_positioned_layout/Stacking_context)。

有两个值：

- `auto`（默认值）：不执行任何操作。
- `isolate`：形成层叠上下文。

| 类型                    | 必需 |
| ----------------------- | -------- |
| enum('auto', 'isolate') | 否       |

---

### `justifyContent`

`justifyContent` 控制子元素在主方向上的对齐方式。例如，如果子元素是垂直排列的，`justifyContent` 就控制它们如何垂直对齐。其作用类似于 CSS 中的 `justify-content`（默认值：flex-start）。

更多详情请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/justify-content)。

| 类型                                                                                      | 必需 |
| ----------------------------------------------------------------------------------------- | -------- |
| enum('flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly') | 否       |

---

### `left`

`left` 是用于偏移该组件左边缘的逻辑像素数。

它的工作方式类似于 CSS 中的 `left`，但在 React Native 中必须使用点数或百分比。Ems 和其他单位不受支持。

更多关于 `left` 如何影响布局的细节，请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/left)。

| 类型           | 必需 |
| -------------- | -------- |
| number, string | 否       |

---

### `margin`

设置 `margin` 的效果与分别设置 `marginTop`、`marginLeft`、`marginBottom` 和 `marginRight` 相同。

更多详情请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/margin)。

| 类型           | 必需 |
| -------------- | -------- |
| number, string | 否       |

---

### `marginBottom`

`marginBottom` 的作用类似于 CSS 中的 `margin-bottom`。更多详情请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-bottom)。

| 类型           | 必需 |
| -------------- | -------- |
| number, string | 否       |

---

### `marginBlock`

等同于 [`marginVertical`](layout-props#marginvertical)。

更多详情请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/margin-block)。

| 类型           | 必需 |
| -------------- | -------- |
| number, string | 否       |

---

### `marginBlockEnd`

等同于 [`marginBottom`](layout-props#marginbottom)。

更多详情请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/margin-block-end)。

| 类型           | 必需 |
| -------------- | -------- |
| number, string | 否       |

---

### `marginBlockStart`

等同于 [`marginTop`](layout-props#margintop)。

更多详情请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/margin-block-start)。

| 类型           | 必需 |
| -------------- | -------- |
| number, string | 否       |

---

### `marginEnd`

当 direction 为 `ltr` 时，`marginEnd` 等同于 `marginRight`。当 direction 为 `rtl` 时，`marginEnd` 等同于 `marginLeft`。

| 类型           | 必需 |
| -------------- | -------- |
| number, string | 否       |

---

### `marginHorizontal`

设置 `marginHorizontal` 的效果与同时设置 `marginLeft` 和 `marginRight` 相同。

| 类型           | 必需 |
| -------------- | -------- |
| number, string | 否       |

---

### `marginInline`

等同于 [`marginHorizontal`](layout-props#marginhorizontal)。

更多详情请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/margin-inline)。

| 类型           | 必需 |
| -------------- | -------- |
| number, string | 否       |

---

### `marginInlineEnd`

当 direction 为 `ltr` 时，`marginInlineEnd` 等同于 [`marginEnd`](layout-props#marginend)（即 `marginRight`）。当 direction 为 `rtl` 时，`marginInlineEnd` 等同于 [`marginEnd`](layout-props#marginend)（即 `marginLeft`）。

更多详情请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/margin-inline-end)。

| 类型           | 必需 |
| -------------- | -------- |
| number, string | 否       |

---

### `marginInlineStart`

当 direction 为 `ltr` 时，`marginInlineStart` 等同于 [`marginStart`](layout-props#marginstart)（即 `marginLeft`）。当 direction 为 `rtl` 时，`marginInlineStart` 等同于 [`marginStart`](layout-props#marginstart)（即 `marginRight`）。

更多详情请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/margin-inline-start)。

| 类型           | 必需 |
| -------------- | -------- |
| number, string | 否       |

---

### `marginLeft`

`marginLeft` 的作用类似于 CSS 中的 `margin-left`。更多详情请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-left)。

| 类型           | 必需 |
| -------------- | -------- |
| number, string | 否       |

---

### `marginRight`

`marginRight` 的作用类似于 CSS 中的 `margin-right`。

更多详情请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-right)。

| 类型           | 必需 |
| -------------- | -------- |
| number, string | 否       |

---

### `marginStart`

当 direction 为 `ltr` 时，`marginStart` 等同于 `marginLeft`。当 direction 为 `rtl` 时，`marginStart` 等同于 `marginRight`。

| 类型           | 必需 |
| -------------- | -------- |
| number, string | 否       |

---

### `marginTop`

`marginTop` 的作用类似于 CSS 中的 `margin-top`。

更多详情请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/margin-top)。

| 类型           | 必需 |
| -------------- | -------- |
| number, string | 否       |

---

### `marginVertical`

设置 `marginVertical` 的效果与同时设置 `marginTop` 和 `marginBottom` 相同。

| 类型           | 必需 |
| -------------- | -------- |
| number, string | 否       |

---

### `maxHeight`

`maxHeight` 是该组件的最大高度，以逻辑像素为单位。

它的工作方式类似于 CSS 中的 `max-height`，但在 React Native 中必须使用点数或百分比。Ems 和其他单位不受支持。

更多详情请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/max-height)。

| 类型           | 必需 |
| -------------- | -------- |
| number, string | 否       |

---

### `maxWidth`

`maxWidth` 是该组件的最大宽度，以逻辑像素为单位。

它的工作方式类似于 CSS 中的 `max-width`，但在 React Native 中必须使用点数或百分比。Ems 和其他单位不受支持。

更多详情请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/max-width)。

| 类型           | 必需 |
| -------------- | -------- |
| number, string | 否       |

---

### `minHeight`

`minHeight` 是该组件的最小高度，以逻辑像素为单位。

它的工作方式类似于 CSS 中的 `min-height`，但在 React Native 中必须使用点数或百分比。Ems 和其他单位不受支持。

更多详情请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/min-height)。

| 类型           | 必需 |
| -------------- | -------- |
| number, string | 否       |

---

### `minWidth`

`minWidth` 是该组件的最小宽度，以逻辑像素为单位。

它的工作方式类似于 CSS 中的 `min-width`，但在 React Native 中必须使用点数或百分比。Ems 和其他单位不受支持。

更多详情请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/min-width)。

| 类型           | 必需 |
| -------------- | -------- |
| number, string | 否       |

---

### `overflow`

`overflow` 控制子元素如何被测量和显示。`overflow: hidden` 会对视图进行裁剪，而 `overflow: scroll` 会使视图独立于其父元素的主轴进行测量。它的作用类似于 CSS 中的 `overflow`（默认值：visible）。

更多详情请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/overflow)。

| 类型                                | 必需 |
| ----------------------------------- | -------- |
| enum('visible', 'hidden', 'scroll') | 否       |

---

### `padding`

设置 `padding` 的效果与分别设置 `paddingTop`、`paddingBottom`、`paddingLeft` 和 `paddingRight` 相同。

更多详情请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/padding)。

| 类型           | 必需 |
| -------------- | -------- |
| number, string | 否       |

---

### `paddingBottom`

`paddingBottom` 的作用类似于 CSS 中的 `padding-bottom`。

更多详情请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/padding-bottom)。

| 类型           | 必需 |
| -------------- | -------- |
| number, string | 否       |

---

### `paddingBlock`

等同于 [`paddingVertical`](layout-props#paddingvertical)。

更多详情请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/padding-block)。

| 类型           | 必需 |
| -------------- | -------- |
| number, string | 否       |

---

### `paddingBlockEnd`

等同于 [`paddingBottom`](layout-props#paddingbottom)。

更多详情请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/padding-block-end)。

| 类型           | 必需 |
| -------------- | -------- |
| number, string | 否       |

---

### `paddingBlockStart`

等同于 [`paddingTop`](layout-props#paddingtop)。

更多详情请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/padding-block-start)。

| 类型           | 必需 |
| -------------- | -------- |
| number, string | 否       |

---

### `paddingEnd`

当 direction 为 `ltr` 时，`paddingEnd` 等同于 `paddingRight`。当 direction 为 `rtl` 时，`paddingEnd` 等同于 `paddingLeft`。

| 类型           | 必需 |
| -------------- | -------- |
| number, string | 否       |

---

### `paddingHorizontal`

设置 `paddingHorizontal` 的效果就像同时设置 `paddingLeft` 和 `paddingRight`。

| 类型           | 必需 |
| -------------- | -------- |
| number, string | 否       |

---

### `paddingInline`

等同于 [`paddingHorizontal`](layout-props#paddinghorizontal)。

更多详情请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/padding-inline)。

| 类型           | 必需 |
| -------------- | -------- |
| number, string | 否       |

---

### `paddingInlineEnd`

当 direction 为 `ltr` 时，`paddingInlineEnd` 等同于 [`paddingEnd`](layout-props#paddingend)（即 `paddingRight`）。当 direction 为 `rtl` 时，`paddingInlineEnd` 等同于 [`paddingEnd`](layout-props#paddingend)（即 `paddingLeft`）。

更多详情请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/padding-inline-end)。

| 类型           | 必需 |
| -------------- | -------- |
| number, string | 否       |

---

### `paddingInlineStart`

当 direction 为 `ltr` 时，`paddingInlineStart` 等同于 [`paddingStart`](layout-props#paddingstart)（即 `paddingLeft`）。当 direction 为 `rtl` 时，`paddingInlineStart` 等同于 [`paddingStart`](layout-props#paddingstart)（即 `paddingRight`）。

更多详情请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/padding-inline-start)。

| 类型           | 必需 |
| -------------- | -------- |
| number, string | 否       |

---

### `paddingLeft`

`paddingLeft` 的作用类似于 CSS 中的 `padding-left`。

更多详情请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/padding-left)。

| 类型           | 必需 |
| -------------- | -------- |
| number, string | 否       |

---

### `paddingRight`

`paddingRight` 的作用类似于 CSS 中的 `padding-right`。

更多详情请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/padding-right)。

| 类型           | 必需 |
| -------------- | -------- |
| number, string | 否       |

---

### `paddingStart`

当 direction 为 `ltr` 时，`paddingStart` 等同于 `paddingLeft`。当 direction 为 `rtl` 时，`paddingStart` 等同于 `paddingRight`。

| 类型           | 必需 |
| -------------- | -------- |
| number, string | 否       |

---

### `paddingTop`

`paddingTop` 的作用类似于 CSS 中的 `padding-top`。

更多详情请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/padding-top)。

| 类型           | 必需 |
| -------------- | -------- |
| number, string | 否       |

---

### `paddingVertical`

设置 `paddingVertical` 的效果就像同时设置 `paddingTop` 和 `paddingBottom`。

| 类型           | 必需 |
| -------------- | -------- |
| number, string | 否       |

---

### `position`

React Native 中的 `position` 类似于[常规 CSS](https://developer.mozilla.org/en-US/docs/Web/CSS/position)，但默认都会设为 `relative`。

`relative` 会根据布局的正常流来定位元素。偏移量（`top`、`bottom`、`left`、`right`）会相对于此布局进行偏移。

`absolute` 会将元素从布局的正常流中移除。偏移量会相对于其[包含块](./flexbox.md#the-containing-block)进行偏移。

`static` 会根据布局的正常流来定位元素。偏移量不会生效。
`static` 元素不会为绝对定位的后代形成包含块。

更多信息请参见 [Flexbox 布局文档](./flexbox.md#position)。另外，[Yoga 文档](https://www.yogalayout.dev/docs/styling/position) 也提供了关于 React Native 与 CSS 中 `position` 差异的更多细节。

| 类型                                   | 必需 |
| -------------------------------------- | -------- |
| enum('absolute', 'relative', 'static') | 否       |

---

### `right`

`right` 是用于偏移该组件右边缘的逻辑像素数。

它的工作方式类似于 CSS 中的 `right`，但在 React Native 中必须使用点数或百分比。Ems 和其他单位不受支持。

更多关于 `right` 如何影响布局的细节，请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/right)。

| 类型           | 必需 |
| -------------- | -------- |
| number, string | 否       |

---

### `rowGap`

`rowGap` 的作用类似于 CSS 中的 `row-gap`。React Native 仅支持像素单位。

更多详情请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/row-gap)。

| 类型   | 必需 |
| ------ | -------- |
| number | 否       |

---

### `start`

当 direction 为 `ltr` 时，`start` 等同于 `left`。当 direction 为 `rtl` 时，`start` 等同于 `right`。

此样式的优先级高于 `left`、`right` 和 `end` 样式。

| 类型           | 必需 |
| -------------- | -------- |
| number, string | 否       |

---

### `top`

`top` 是用于偏移该组件上边缘的逻辑像素数。

它的工作方式类似于 CSS 中的 `top`，但在 React Native 中必须使用点数或百分比。Ems 和其他单位不受支持。

更多关于 `top` 如何影响布局的细节，请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/top)。

| 类型           | 必需 |
| -------------- | -------- |
| number, string | 否       |

---

### `width`

`width` 设置该组件的宽度。

它的工作方式类似于 CSS 中的 `width`，但在 React Native 中必须使用点数或百分比。Ems 和其他单位不受支持。

更多详情请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/width)。

| 类型           | 必需 |
| -------------- | -------- |
| number, string | 否       |

---

### `zIndex`

`zIndex` 控制哪些组件显示在其他组件之上。通常情况下，你不需要使用 `zIndex`。组件会按照它们在文档树中的顺序渲染，因此后面的组件会绘制在前面的组件之上。如果你有动画或自定义的模态界面，并且不希望出现这种行为，那么 `zIndex` 可能会有用。

它的作用类似于 CSS 的 `z-index` 属性——`zIndex` 更大的组件会渲染在上层。可以把 z 方向想象成从手机指向你的眼睛。

在 iOS 上，`zIndex` 可能需要 `View` 彼此成为兄弟节点才能按预期工作。

更多详情请参见 [MDN CSS 参考](https://developer.mozilla.org/en-US/docs/Web/CSS/z-index)。

| 类型   | 必需 |
| ------ | -------- |
| number | 否       |
