---
id: shadow-props
title: 阴影属性
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer name=Shadow%20Props&supportedPlatforms=ios&ext=js&dependencies=@react-native-community/slider
import React, {useState} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';

const ShadowPropSlider = ({label, value, ...props}) => {
  return (
    <>
      <Text>
        {label} ({value.toFixed(2)})
      </Text>
      <Slider step={1} value={value} {...props} />
    </>
  );
};

const App = () => {
  const [shadowOffsetWidth, setShadowOffsetWidth] = useState(0);
  const [shadowOffsetHeight, setShadowOffsetHeight] = useState(0);
  const [shadowRadius, setShadowRadius] = useState(0);
  const [shadowOpacity, setShadowOpacity] = useState(0.1);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View
          style={[
            styles.square,
            {
              shadowOffset: {
                width: shadowOffsetWidth,
                height: -shadowOffsetHeight,
              },
              shadowOpacity,
              shadowRadius,
            },
          ]}
        />
        <View style={styles.controls}>
          <ShadowPropSlider
            label="shadowOffset - X"
            minimumValue={-50}
            maximumValue={50}
            value={shadowOffsetWidth}
            onValueChange={setShadowOffsetWidth}
          />
          <ShadowPropSlider
            label="shadowOffset - Y"
            minimumValue={-50}
            maximumValue={50}
            value={shadowOffsetHeight}
            onValueChange={setShadowOffsetHeight}
          />
          <ShadowPropSlider
            label="shadowRadius"
            minimumValue={0}
            maximumValue={100}
            value={shadowRadius}
            onValueChange={setShadowRadius}
          />
          <ShadowPropSlider
            label="shadowOpacity"
            minimumValue={0}
            maximumValue={1}
            step={0.05}
            value={shadowOpacity}
            onValueChange={val => setShadowOpacity(val)}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  square: {
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 4,
    height: 150,
    shadowColor: 'black',
    width: 150,
  },
  controls: {
    paddingHorizontal: 12,
  },
});

export default App;
```

</TabItem>
<TabItem value="typescript">

```SnackPlayer name=Shadow%20Props&supportedPlatforms=ios&ext=tsx&dependencies=@react-native-community/slider
import React, {useState} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import Slider, {SliderProps} from '@react-native-community/slider';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

type ShadowPropSliderProps = SliderProps & {
  label: string;
};

const ShadowPropSlider = ({label, value, ...props}: ShadowPropSliderProps) => {
  return (
    <>
      <Text>
        {label} ({value?.toFixed(2)})
      </Text>
      <Slider step={1} value={value} {...props} />
    </>
  );
};

const App = () => {
  const [shadowOffsetWidth, setShadowOffsetWidth] = useState(0);
  const [shadowOffsetHeight, setShadowOffsetHeight] = useState(0);
  const [shadowRadius, setShadowRadius] = useState(0);
  const [shadowOpacity, setShadowOpacity] = useState(0.1);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View
          style={[
            styles.square,
            {
              shadowOffset: {
                width: shadowOffsetWidth,
                height: -shadowOffsetHeight,
              },
              shadowOpacity,
              shadowRadius,
            },
          ]}
        />
        <View style={styles.controls}>
          <ShadowPropSlider
            label="shadowOffset - X"
            minimumValue={-50}
            maximumValue={50}
            value={shadowOffsetWidth}
            onValueChange={setShadowOffsetWidth}
          />
          <ShadowPropSlider
            label="shadowOffset - Y"
            minimumValue={-50}
            maximumValue={50}
            value={shadowOffsetHeight}
            onValueChange={setShadowOffsetHeight}
          />
          <ShadowPropSlider
            label="shadowRadius"
            minimumValue={0}
            maximumValue={100}
            value={shadowRadius}
            onValueChange={setShadowRadius}
          />
          <ShadowPropSlider
            label="shadowOpacity"
            minimumValue={0}
            maximumValue={1}
            step={0.05}
            value={shadowOpacity}
            onValueChange={val => setShadowOpacity(val)}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  square: {
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 4,
    height: 150,
    shadowColor: 'black',
    width: 150,
  },
  controls: {
    paddingHorizontal: 12,
  },
});

export default App;
```

</TabItem>
</Tabs>

---

# 参考资料

React Native 中有三套阴影相关的 API：

- `boxShadow`：一个 View 样式属性，是对 [同名 Web 样式属性](https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow) 的规范实现。
- `dropShadow`：View 样式属性 [`filter`](./view-style-props#filter) 的一个特定滤镜函数。
- 各种 `shadow` 属性（`shadowColor`、`shadowOffset`、`shadowOpacity`、`shadowRadius`）：直接映射到底层平台提供的原生 API。

`dropShadow` 和 `boxShadow` 的区别如下：

- `dropShadow` 作为 `filter` 的一部分存在，而 `boxShadow` 是一个独立的样式属性。
- `dropShadow` 是一个 alpha 遮罩，因此只有 alpha 值为正的像素才会“投射”阴影。`boxShadow` 无论内容如何（除非是内阴影），都会围绕元素的边框框投射阴影。
- `dropShadow` 仅在 Android 上可用，而 `boxShadow` 在 iOS 和 Android 上均可用。
- `dropShadow` 不能像 `boxShadow` 那样设置为内阴影（inset）。
- `dropShadow` 没有像 `boxShadow` 那样的 `spreadDistance` 参数。

相比之下，`boxShadow` 和 `dropShadow` 通常比 `shadow` 属性功能更强大。但 `shadow` 属性映射到底层平台原生 API，因此如果只需要简单的阴影效果，推荐使用这些属性。注意，只有 `shadowColor` 在 Android 和 iOS 上都有效，其他 `shadow` 属性仅在 iOS 上有效。

## 属性

### `boxShadow`

文档见 [View 样式属性](./view-style-props#boxshadow)。

### `dropShadow` <div className="label android">Android</div>

文档见 [View 样式属性](./view-style-props#filter)。

### `shadowColor`

设置阴影的颜色。

此属性仅在 Android API 28 及以上有效。若需在较低版本 Android API 上实现类似功能，请使用 [`elevation` 属性](view-style-props#elevation-android)。

| 类型               |
| ------------------ |
| [颜色](colors.md) |

---

### `shadowOffset` <div className="label ios">iOS</div>

设置阴影偏移量。

| 类型                                     |
| ---------------------------------------- |
| 对象：`{width: number, height: number}` |

---

### `shadowOpacity` <div className="label ios">iOS</div>

设置阴影的不透明度（会乘以颜色的 alpha 分量）。

| 类型   |
| ------ |
| number |

---

### `shadowRadius` <div className="label ios">iOS</div>

设置阴影模糊半径。

| 类型   |
| ------ |
| number |
