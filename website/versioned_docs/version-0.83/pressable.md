---
id: pressable
title: 可按压组件（Pressable）
---

Pressable 是一个核心组件的包装器，可以检测其定义的任何子元素上的多种按压交互阶段。

```tsx
<Pressable onPress={onPressFunction}>
  <Text>我可以被按压！</Text>
</Pressable>
```

## 工作原理

在被 `Pressable` 包裹的元素上：

- [`onPressIn`](#onpressin) 在按压激活时被调用。
- [`onPressOut`](#onpressout) 在按压手势解除时被调用。

在触发 [`onPressIn`](#onpressin) 后，会发生以下两种情况之一：

1. 用户移开手指，触发 [`onPressOut`](#onpressout)，随后触发 [`onPress`](#onpress)。
2. 如果用户手指停留超过 500 毫秒后才移开，触发 [`onLongPress`](#onlongpress)。 （用户移开手指时仍然会触发 [`onPressOut`](#onpressout)）

<img src="/docs/assets/d_pressable_pressing.svg" width="1000" alt="按压事件顺序示意图。" />

手指并不是非常精准的操作工具，用户很可能会错误激活了错误的元素或错过了激活区域。为此，`Pressable` 提供了可选的 `HitRect`（命中区域），你可以用它来定义触摸距离被包裹元素的最大有效范围。按压可以从 `HitRect` 区域内的任意位置开始。

`PressRect` 允许按压手势在元素及其 `HitRect` 之外移动，同时保持激活状态，并且依然可以识别为“按压”——想象你慢慢从按下的按钮上滑开手指。

:::note
触摸区域永远不会超出父视图边界，如果触摸到了两个重叠的视图，兄弟视图的 Z 轴顺序始终优先。
:::

<figure>
  <img src="/docs/assets/d_pressable_anatomy.svg" width="1000" alt="HitRect 和 PressRect 及其工作示意图。" />
  <figcaption>
    你可以使用 <code>hitSlop</code> 设置 <code>HitRect</code>，使用 <code>pressRetentionOffset</code> 设置 <code>PressRect</code>。
  </figcaption>
</figure>

:::info
`Pressable` 采用了 React Native 的 `Pressability` API。更多关于 Pressability 状态机流程以及其工作机制的信息，请查阅 [Pressability](https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/Pressability/Pressability.js#L350) 的实现。
:::

## 示例

```SnackPlayer name=Pressable
import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  const [timesPressed, setTimesPressed] = useState(0);

  let textLog = '';
  if (timesPressed > 1) {
    textLog = timesPressed + '次 onPress';
  } else if (timesPressed > 0) {
    textLog = 'onPress';
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Pressable
          onPress={() => {
            setTimesPressed(current => current + 1);
          }}
          style={({pressed}) => [
            {
              backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
            },
            styles.wrapperCustom,
          ]}>
          {({pressed}) => (
            <Text style={styles.text}>{pressed ? '已按压！' : '按我'}</Text>
          )}
        </Pressable>
        <View style={styles.logBox}>
          <Text testID="pressable_press_console">{textLog}</Text>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
  },
  wrapperCustom: {
    borderRadius: 8,
    padding: 6,
  },
  logBox: {
    padding: 20,
    margin: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#f0f0f0',
    backgroundColor: '#f9f9f9',
  },
});

export default App;
```

## 属性（Props）

### `android_disableSound` <div className="label android">Android</div>

如果为 true，则按压时不会播放 Android 系统音效。

| 类型      | 默认值   |
| --------- | -------- |
| boolean   | `false`  |

### `android_ripple` <div className="label android">Android</div>

启用 Android 涟漪效果并配置其属性。

| 类型                                |
| ----------------------------------- |
| [RippleConfig](pressable#rippleconfig) |

### `children`

子元素，或一个接收当前组件是否被按压的布尔值的函数。

| 类型             |
| ---------------- |
| [React 节点](react-node) |

### `unstable_pressDelay`

按下后等待调用 `onPressIn` 的时长（毫秒）。

| 类型    |
| ------- |
| number  |

### `delayLongPress`

从 `onPressIn` 到调用 `onLongPress` 的时间（毫秒）。

| 类型    | 默认值  |
| ------- | ------- |
| number  | `500`   |

### `disabled`

是否禁用按压行为。

| 类型      | 默认值  |
| --------- | ------- |
| boolean   | `false` |

### `hitSlop`

设置在元素之外额外允许按压的区域距离。

| 类型               |
| ------------------ |
| [Rect](rect) 或 number |

### `onHoverIn`

当激活悬停状态以提供视觉反馈时调用。

| 类型                                                                                                      |
| --------------------------------------------------------------------------------------------------------- |
| `md ({ nativeEvent: [MouseEvent](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) }) => void` |

### `onHoverOut`

当悬停状态失效时调用，用于撤销视觉反馈。

| 类型                                                                                                      |
| --------------------------------------------------------------------------------------------------------- |
| `md ({ nativeEvent: [MouseEvent](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) }) => void` |

### `onLongPress`

如果从 `onPressIn` 起持续时间超过 500 毫秒，调用此函数。此时间可通过 [`delayLongPress`](#delaylongpress) 自定义。

| 类型                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

### `onPress`

在 `onPressOut` 之后调用。

| 类型                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

### `onPressIn`

手指接触时立即调用，早于 `onPressOut` 和 `onPress`。

| 类型                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

### `onPressMove`

按压位置移动时调用。

| 类型                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

### `onPressOut`

手指松开时调用。

| 类型                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

### `pressRetentionOffset`

在元素之外额外允许按压仍被视为有效的距离，超过此距离触发 `onPressOut`。

| 类型               | 默认值                             |
| ------------------ | --------------------------------- |
| [Rect](rect) 或 number | `{bottom: 30, left: 20, right: 20, top: 20}` |

### `style`

视图样式或接收当前是否按压的布尔值并返回视图样式的函数。

| 类型                                                                                               |
| ------------------------------------------------------------------------------------------------- |
| [视图样式](view-style-props) 或 `md ({ pressed: boolean }) => [视图样式](view-style-props)` |

### `testOnly_pressed`

仅用于文档或测试（例如快照测试）。

| 类型      | 默认值  |
| --------- | ------- |
| boolean   | `false` |

## 类型定义

### RippleConfig

`android_ripple` 属性的涟漪效果配置。

| 类型  |
| ----- |
| object |

**属性说明：**

| 名称        | 类型             | 是否必需 | 说明                                                                                                                        |
| ----------- | ---------------- | -------- | --------------------------------------------------------------------------------------------------------------------------- |
| color       | [color](colors)  | 否       | 定义涟漪效果的颜色。                                                                                                        |
| borderless  | boolean          | 否       | 是否渲染无边框涟漪效果。                                                                                                    |
| radius      | number           | 否       | 定义涟漪效果的半径。                                                                                                        |
| foreground  | boolean          | 否       | 设置为 true 会将涟漪效果添加到视图的前景层，而非背景层。当子视图本身有背景，或展示图片时，这个属性很有用，避免涟漪效果被遮挡。 |