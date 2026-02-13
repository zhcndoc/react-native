---
id: height-and-width
title: 高度和宽度
---

组件的高度和宽度决定了它在屏幕上的大小。

## 固定尺寸

设置组件尺寸的常用方法是为样式添加固定的 `width` 和 `height`。React Native 中的所有尺寸均无单位，表示与像素密度无关的像素。

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

以这种方式设置尺寸适用于尺寸应始终固定为某个点数而不根据屏幕大小计算的组件。

:::caution
点数到物理测量单位之间没有通用映射。这意味着具有固定尺寸的组件在不同设备和屏幕尺寸上可能不会有相同的物理大小。然而，在大多数使用场景下，这种差异是难以察觉的。
:::

## 弹性尺寸

在组件样式中使用 `flex` 使组件能根据可用空间动态扩展和缩小。通常会使用 `flex: 1`，这告诉组件填充所有可用空间，并与具有相同父组件的其他组件共享这些空间。`flex` 数值越大，组件相较于兄弟组件占用的空间比例越高。

:::info
只有当父组件具有大于 `0` 的尺寸时，子组件才能扩展以填充可用空间。如果父组件没有设置固定的 `width` 和 `height` 或 `flex`，则父组件尺寸为 `0`，`flex` 子组件将不可见。
:::

```SnackPlayer name=Flex%20Dimensions
import React from 'react';
import {View} from 'react-native';

const FlexDimensionsBasics = () => {
  return (
    // 尝试移除父组件 View 上的 `flex: 1`。
    // 父组件不会有尺寸，因此子组件无法扩展。
    // 如果用 `height: 300` 替代 `flex: 1` 会怎么样？
    <View style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: 'powderblue'}} />
      <View style={{flex: 2, backgroundColor: 'skyblue'}} />
      <View style={{flex: 3, backgroundColor: 'steelblue'}} />
    </View>
  );
};

export default FlexDimensionsBasics;
```

掌握如何控制组件尺寸后，下一步是[学习如何在屏幕上布局](flexbox.md)。

## 百分比尺寸

如果想占据屏幕的某一部分，但**不想使用** `flex` 布局，也**可以**在组件样式中使用**百分比值**。类似于弹性尺寸，百分比尺寸也需要父组件有定义的尺寸。

```SnackPlayer name=Percentage%20Dimensions
import React from 'react';
import {View} from 'react-native';

const PercentageDimensionsBasics = () => {
  // 尝试移除父组件 View 上的 `height: '100%'`。
  // 父组件不会有尺寸，因此子组件无法扩展。
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
