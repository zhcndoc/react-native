---
id: height-and-width
title: 高度和宽度
---

组件的高度和宽度决定了它在屏幕上的大小。

## 固定尺寸

设置组件尺寸的通用方法是在样式中添加固定的 `width` 和 `height`。React Native 中的所有尺寸都是无单位的，代表与密度无关的像素。

```SnackPlayer name=Height%20and%20Width
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

对于大小应始终固定为特定数值而不基于屏幕尺寸计算的组件，通常使用这种方式设置尺寸。

:::caution
点 到物理测量单位之间没有通用的映射关系。这意味着具有固定尺寸的组件在不同设备和屏幕尺寸上可能不具有相同的物理大小。然而，对于大多数用例来说，这种差异是察觉不到的。
:::

## Flex 尺寸

在组件的样式中使用 `flex` 可以让组件根据可用空间动态地扩展和收缩。通常你会使用 `flex: 1`，这告诉组件填充所有可用空间，并与具有相同父组件的其他组件均匀共享。给定的 `flex` 值越大，组件与其兄弟组件相比所占的空间比例就越高。

:::info
只有当父组件的尺寸大于 `0` 时，组件才能扩展以填充可用空间。如果父组件既没有固定的 `width` 和 `height`，也没有 `flex`，则父组件的尺寸将为 `0`，并且 `flex` 子组件将不可见。
:::

```SnackPlayer name=Flex%20Dimensions
import {View} from 'react-native';

const FlexDimensionsBasics = () => {
  return (
    // 尝试移除父 View 上的 `flex: 1`。
    // 父组件将没有尺寸，因此子组件无法扩展。
    // 如果你添加 `height: 300` 而不是 `flex: 1` 会怎样？
    <View style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: 'powderblue'}} />
      <View style={{flex: 2, backgroundColor: 'skyblue'}} />
      <View style={{flex: 3, backgroundColor: 'steelblue'}} />
    </View>
  );
};

export default FlexDimensionsBasics;
```

当你可以控制组件的大小后，下一步是 [学习如何在屏幕上布局它](flexbox.md)。

## 百分比尺寸

如果你想填充屏幕的某一部分，但 _不_ 想使用 `flex` 布局，你 _可以_ 在组件的样式中使用 **百分比值**。与 flex 尺寸类似，百分比尺寸需要父组件具有定义的尺寸。

```SnackPlayer name=Percentage%20Dimensions
import {View} from 'react-native';

const PercentageDimensionsBasics = () => {
  // 尝试移除父 View 上的 `height: '100%'`。
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
