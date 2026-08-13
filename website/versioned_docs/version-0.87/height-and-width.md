---
id: height-and-width
title: 高度和宽度
---

组件的高度和宽度决定其在屏幕上的大小

## 固定尺寸

设置组件尺寸的常用方式是在样式中添加固定的 `width` 和 `height`。React Native 中的所有尺寸都没有单位，表示与密度无关的像素

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

对于尺寸应始终固定为某个点数，而不是根据屏幕大小计算的组件，以这种方式设置尺寸很常见

:::caution
点数与物理测量单位之间不存在通用的映射关系。这意味着，在不同的设备和屏幕尺寸上，具有固定尺寸的组件可能不会具有相同的物理大小。不过，对于大多数使用场景来说，这种差异并不明显
:::

## Flex 尺寸

在组件的样式中使用 `flex`，可以让组件根据可用空间动态扩展和收缩。通常你会使用 `flex: 1`，它会指示组件填充所有可用空间，并与其他具有相同父组件的组件平均共享这些空间。指定的 `flex` 越大，与其兄弟组件相比，组件所占空间的比例就越高

:::info
只有当父组件的尺寸大于 `0` 时，组件才能扩展以填充可用空间。如果父组件既没有固定的 `width` 和 `height`，也没有 `flex`，那么父组件的尺寸将为 `0`，并且 `flex` 子组件将不可见
:::

```SnackPlayer name=Flex%20Dimensions
import {View} from 'react-native';

const FlexDimensionsBasics = () => {
  return (
    // Try removing the `flex: 1` on the parent View.
    // The parent will not have dimensions, so the children can't expand.
    // What if you add `height: 300` instead of `flex: 1`?
    <View style={{flex: 1}}>
      <View style={{flex: 1, backgroundColor: 'powderblue'}} />
      <View style={{flex: 2, backgroundColor: 'skyblue'}} />
      <View style={{flex: 3, backgroundColor: 'steelblue'}} />
    </View>
  );
};

export default FlexDimensionsBasics;
```

掌握如何控制组件的大小后，下一步是[了解如何在屏幕上布局组件](flexbox.md)

## 百分比尺寸

如果你想填充屏幕的某个部分，但又*不想*使用 `flex` 布局，则*可以*在组件的样式中使用**百分比值**。与 Flex 尺寸类似，百分比尺寸要求父组件具有已定义的尺寸

```SnackPlayer name=Percentage%20Dimensions
import {View} from 'react-native';

const PercentageDimensionsBasics = () => {
  // Try removing the `height: '100%'` on the parent View.
  // The parent will not have dimensions, so the children can't expand.
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
