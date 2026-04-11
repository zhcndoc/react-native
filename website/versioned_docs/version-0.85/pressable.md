---
id: pressable
title: Pressable
---

Pressable 是一个核心组件包装器，可以检测其任何定义的子元素上的各种按压交互阶段。

```tsx
<Pressable onPress={onPressFunction}>
  <Text>I'm pressable!</Text>
</Pressable>
```

## 工作原理

在由 `Pressable` 包装的元素上：

- [`onPressIn`](#onpressin) 当按压被激活时调用。
- [`onPressOut`](#onpressout) 当按压手势被停用时调用。

在按下 [`onPressIn`](#onpressin) 之后，会发生以下两种情况之一：

1. 用户将移开手指，触发 [`onPressOut`](#onpressout)，随后触发 [`onPress`](#onpress)。
2. 如果用户在移开手指之前停留超过 500 毫秒，则会触发 [`onLongPress`](#onlongpress)。（当他们移开手指时，[`onPressOut`](#onpressout) 仍然会触发。）

<img src="/docs/assets/d_pressable_pressing.svg" width="1000" alt="onPress 事件序列图。" />

手指并不是最精确的工具，用户意外激活错误的元素或错过激活区域是很常见的。为了提供帮助，`Pressable` 具有一个可选的 `HitRect`，你可以使用它来定义触摸可以在距离包装元素多远的地方注册。按压可以在 `HitRect` 内的任何地方开始。

`PressRect` 允许按压移出元素及其 `HitRect`，同时保持激活状态并有资格成为“按压”——想象一下将你按在按钮上的手指慢慢滑开。

:::note
触摸区域永远不会超出父视图边界，如果触摸命中两个重叠视图，兄弟视图的 Z-index 始终优先。
:::

<figure>
  <img src="/docs/assets/d_pressable_anatomy.svg" width="1000" alt="HitRect 和 PressRect 及其工作原理图。" />
  <figcaption>
    你可以使用 <code>hitSlop</code> 设置 <code>HitRect</code>，并使用 <code>pressRetentionOffset</code> 设置 <code>PressRect</code>。
  </figcaption>
</figure>

:::info
`Pressable` 使用 React Native 的 `Pressability` API。有关 `Pressability` 的状态机流程及其工作原理的更多信息，请查看 [Pressability](https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/Pressability/Pressability.js#L350) 的实现。
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
    textLog = timesPressed + 'x onPress';
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
            <Text style={styles.text}>{pressed ? 'Pressed!' : 'Press Me'}</Text>
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

## 属性

### `android_disableSound` <div className="label android">Android</div>

如果为 true，则按压时不播放 Android 系统声音。

| 类型    | 默认值 |
| ------- | ------- |
| boolean | `false` |

### `android_ripple` <div className="label android">Android</div>

启用 Android 涟漪效果并配置其属性。

| 类型                                   |
| -------------------------------------- |
| [RippleConfig](pressable#rippleconfig) |

### `children`

子元素或一个函数，接收一个布尔值反映组件当前是否被按下。

| 类型                     |
| ------------------------ |
| [React Node](react-node) |

### `unstable_pressDelay`

按下后等待调用 `onPressIn` 的持续时间（毫秒）。

| 类型   |
| ------ |
| number |

### `delayLongPress`

从 `onPressIn` 到调用 `onLongPress` 的持续时间（毫秒）。

| 类型   | 默认值 |
| ------ | ------- |
| number | `500`   |

### `disabled`

是否禁用按压行为。

| 类型    | 默认值 |
| ------- | ------- |
| boolean | `false` |

### `hitSlop`

设置在元素外部可以检测到按压的额外距离。

| 类型                   |
| ---------------------- |
| [Rect](rect) 或 number |

### `onHoverIn`

当悬停被激活以提供视觉反馈时调用。

| 类型                                                                                                      |
| --------------------------------------------------------------------------------------------------------- |
| `md ({ nativeEvent: [MouseEvent](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) }) => void` |

### `onHoverOut`

当悬停被停用以撤销视觉反馈时调用。

| 类型                                                                                                      |
| --------------------------------------------------------------------------------------------------------- |
| `md ({ nativeEvent: [MouseEvent](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) }) => void` |

### `onLongPress`

如果 `onPressIn` 后的持续时间超过 500 毫秒则调用。此时间段可以使用 [`delayLongPress`](#delaylongpress) 自定义。

| 类型                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

### `onPress`

在 `onPressOut` 之后调用。

| 类型                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

### `onPressIn`

当触摸参与时立即调用，在 `onPressOut` 和 `onPress` 之前。

| 类型                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

### `onPressMove`

当按压位置移动时调用。

| 类型                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

### `onPressOut`

当触摸释放时调用。

| 类型                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

### `pressRetentionOffset`

在此视图外部的额外距离，在此距离内的触摸在触发 `onPressOut` 之前被视为按压。

| 类型                   | 默认值                                      |
| ---------------------- | -------------------------------------------- |
| [Rect](rect) 或 number | `{bottom: 30, left: 20, right: 20, top: 20}` |

### `style`

视图样式或一个函数，接收一个布尔值反映组件当前是否被按下并返回视图样式。

| 类型                                                                                            |
| ----------------------------------------------------------------------------------------------- |
| [View Style](view-style-props) 或 `md ({ pressed: boolean }) => [View Style](view-style-props)` |

### `testOnly_pressed`

仅用于文档或测试（例如快照测试）。

| 类型    | 默认值 |
| ------- | ------- |
| boolean | `false` |

## 类型定义

### RippleConfig

`android_ripple` 属性的涟漪效果配置。

| 类型   |
| ------ |
| object |

**属性：**

| 名称       | 类型            | 是否必填 | 描述                                                                                                                                                                                                                                                  |
| ---------- | --------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| color      | [color](colors) | 否       | 定义涟漪效果的颜色。                                                                                                                                                                                                                      |
| borderless | boolean         | 否       | 定义涟漪效果是否不应包含边框。                                                                                                                                                                                                          |
| radius     | number          | 否       | 定义涟漪效果的半径。                                                                                                                                                                                                                     |
| foreground | boolean         | 否       | 设置为 true 可将涟漪效果添加到视图的前景而不是背景。如果你的某个子视图有自己的背景，或者你例如正在显示图像，并且你不希望涟漪被它们覆盖，这很有用。 |
