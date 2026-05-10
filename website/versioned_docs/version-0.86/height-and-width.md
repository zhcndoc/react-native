---
id: height-and-width
title: 高度和宽度
---

组件的高度和宽度决定了它在屏幕上的大小。

## 固定尺寸

设置组件尺寸的一般方式是在样式中添加固定的 `width` 和 `height`。React Native 中的所有尺寸都是无单位的，并表示与密度无关的像素。

```SnackPlayer name=Height%20and%20Width
import React from 'react';
import {View} from 'react-native';

const FixedDimensionsBasics = () => {
  return (
    <View>
      <View
        style={{
          width: 50,
          height: 50,
          backgroundColor: 'powderblue',
        }}
      />
      <View
        style={{
          width: 100,
          height: 100,
          backgroundColor: 'skyblue',
        }}
      />
      <View
        style={{
          width: 150,
          height: 150,
          backgroundColor: 'steelblue',
        }}
      />
    </View>
  );
};

export default FixedDimensionsBasics;
```

以这种方式设置尺寸很适合那些大小应始终固定为若干点，而不是根据屏幕大小计算的组件。

:::caution
点与物理测量单位之间并没有统一的映射。这意味着，具有固定尺寸的组件在不同设备和屏幕大小上，其物理大小可能并不相同。不过，对于大多数使用场景，这种差异是难以察觉的。
:::

## 弹性尺寸

在组件样式中使用 `flex`，可以让组件根据可用空间动态地扩展和收缩。通常你会使用 `flex: 1`，它会让组件填满所有可用空间，并与同一父组件下的其他组件平均分配。给定的 `flex` 值越大，组件相对于其兄弟组件所占据的空间比例就越高。

:::info
只有当父组件的尺寸大于 `0` 时，组件才能扩展以填充可用空间。如果父组件没有固定的 `width` 和 `height`，也没有 `flex`，那么父组件的尺寸将为 `0`，而 `flex` 子组件将不可见。
:::

```SnackPlayer name=Flex%20Dimensions
import React from 'react';
import {View} from 'react-native';

const FlexDimensionsBasics = () => {
  return (
    // 尝试移除父级 View 上的 `flex: 1`。
    // 父组件将没有尺寸，因此子组件无法扩展。
    // 如果改为添加 `height: 300` 而不是 `flex: 1` 会怎样？
    <View style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: 'powderblue'}} />
      <View style={{flex: 2, backgroundColor: 'skyblue'}} />
      <View style={{flex: 3, backgroundColor: 'steelblue'}} />
    </View>
  );
};

export default FlexDimensionsBasics;
```

当你能够控制组件的大小之后，下一步就是[学习如何在屏幕上进行布局](flexbox.md)。

## 百分比尺寸

如果你想填充屏幕的一部分，但 _不_ 想使用 `flex` 布局，那么你 _可以_ 在组件样式中使用**百分比值**。与弹性尺寸类似，百分比尺寸也要求父组件具有明确的大小。

```SnackPlayer name=Percentage%20Dimensions
import React from 'react';
import {View} from 'react-native';

const PercentageDimensionsBasics = () => {
  // 尝试移除父级 View 上的 `height: '100%'`。
  // 父组件将没有尺寸，因此子组件无法扩展。
  return (
    <View style={{height: '100%'}}>
      <View
        style={{
          height: '15%',
          backgroundColor: 'powderblue',
        }}
      />
      <View
        style={{
          width: '66%',
          height: '35%',
          backgroundColor: 'skyblue',
        }}
      />
      <View
        style={{
          width: '33%',
          height: '50%',
          backgroundColor: 'steelblue',
        }}
      />
    </View>
  );
};

export default PercentageDimensionsBasics;
```
