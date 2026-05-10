---
id: pressable
title: Pressable
---

Pressable 是一个 Core Component 包装器，它可以检测其任意已定义子组件上的各种按压交互阶段。

```tsx
<Pressable onPress={onPressFunction}>
  <Text>I'm pressable!</Text>
</Pressable>
```

## 工作原理

在由 `Pressable` 包裹的元素上：

- 在按压被激活时会调用 [`onPressIn`](#onpressin)。
- 在按压手势失效时会调用 [`onPressOut`](#onpressout)。

在按下 [`onPressIn`](#onpressin) 之后，会发生以下两种情况之一：

1. 用户移开手指，触发 [`onPressOut`](#onpressout)，随后触发 [`onPress`](#onpress)。
2. 如果用户在移开手指前按住超过 500 毫秒，则会触发 [`onLongPress`](#onlongpress)。([`onPressOut`](#onpressout) 仍会在其移开手指时触发。)

<img src="/docs/assets/d_pressable_pressing.svg" width="1000" alt="按压事件顺序示意图。" />

手指并不是最精确的工具，用户常常会不小心激活错误的元素或错过激活区域。为此，`Pressable` 提供了一个可选的 `HitRect`，你可以用它来定义距离包裹元素多远的地方也能被识别为一次触摸。按压可以从 `HitRect` 内的任意位置开始。

`PressRect` 允许按压在保持激活状态并仍然具备触发“press”的资格的同时，越过元素及其 `HitRect` 移动——可以把它想象成你正按住按钮时，手指缓慢向外滑开的过程。

:::note
触摸区域永远不会延伸到父视图边界之外，并且如果一次触摸同时命中两个重叠视图，兄弟视图的 Z-index 始终具有优先级。
:::

<figure>
  <img src="/docs/assets/d_pressable_anatomy.svg" width="1000" alt="HitRect 和 PressRect 及其工作方式示意图。" />
  <figcaption>
    你可以使用 <code>hitSlop</code> 设置 <code>HitRect</code>，并使用 <code>pressRetentionOffset</code> 设置 <code>PressRect</code>。
  </figcaption>
</figure>

:::info
`Pressable` 使用 React Native 的 `Pressability` API。有关 Pressability 状态机流程及其工作方式的更多信息，请查看 [Pressability](https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/Pressability/Pressability.js#L350) 的实现。
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

如果为 true，则按压时不会播放 Android 系统声音。

| 类型    | 默认值 |
| ------- | ------- |
| boolean | `false` |

### `android_ripple` <div className="label android">Android</div>

启用 Android 涟漪效果并配置其属性。

| 类型                                   |
| -------------------------------------- |
| [RippleConfig](pressable#rippleconfig) |

### `children`

可以是子元素，或者是一个接收布尔值的函数，该布尔值表示组件当前是否处于按下状态。

| 类型                     |
| ------------------------ |
| [React Node](react-node) |

### `unstable_pressDelay`

在按下后等待多长时间（以毫秒为单位）再调用 `onPressIn`。

| 类型   |
| ------ |
| number |

### `delayLongPress`

从 `onPressIn` 开始到调用 `onLongPress` 之间的持续时间（以毫秒为单位）。

| 类型   | 默认值 |
| ------ | ------- |
| number | `500`   |

### `disabled`

是否禁用按压行为。

| 类型    | 默认值 |
| ------- | ------- |
| boolean | `false` |

### `hitSlop`

设置元素外部可检测按压的额外距离。

| 类型                   |
| ---------------------- |
| [Rect](rect) or number |

### `onHoverIn`

在悬停被激活时调用，以提供视觉反馈。

| 类型                                                                                                      |
| --------------------------------------------------------------------------------------------------------- |
| `md ({ nativeEvent: [MouseEvent](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) }) => void` |

### `onHoverOut`

在悬停被取消激活时调用，以撤销视觉反馈。

| 类型                                                                                                      |
| --------------------------------------------------------------------------------------------------------- |
| `md ({ nativeEvent: [MouseEvent](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) }) => void` |

### `onLongPress`

如果 `onPressIn` 之后的时间持续超过 500 毫秒，则会调用。此时间可通过 [`delayLongPress`](#delaylongpress) 自定义。

| 类型                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

### `onPress`

在 `onPressOut` 之后调用。

| 类型                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

### `onPressIn`

在触摸接触时立即调用，早于 `onPressOut` 和 `onPress`。

| 类型                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

### `onPressMove`

在按压位置移动时调用。

| 类型                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

### `onPressOut`

在触摸释放时调用。

| 类型                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

### `pressRetentionOffset`

在此视图外部的额外距离，在 `onPressOut` 触发之前，该区域内的触摸会被视为一次按压。

| 类型                   | 默认值                                      |
| ---------------------- | -------------------------------------------- |
| [Rect](rect) or number | `{bottom: 30, left: 20, right: 20, top: 20}` |

### `style`

可以是视图样式，或者是一个接收布尔值的函数，该布尔值表示组件当前是否处于按下状态，并返回视图样式。

| 类型                                                                                            |
| ----------------------------------------------------------------------------------------------- |
| [View Style](view-style-props) or `md ({ pressed: boolean }) => [View Style](view-style-props)` |

### `testOnly_pressed`

仅用于文档或测试（例如快照测试）。

| 类型    | 默认值 |
| ------- | ------- |
| boolean | `false` |

## 类型定义

### RippleConfig

`android_ripple` 属性的涟漪效果配置。

| 类型   |
| ------ | ------ |
| object |

**属性：**

| 名称       | 类型            | 必需 | 描述                                                                                                                                                                                                                                                  |
| ---------- | --------------- | ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| color      | [color](colors) | 否   | 定义涟漪效果的颜色。                                                                                                                                                                                                                                   |
| borderless | boolean         | 否   | 定义涟漪效果是否不包含边框。                                                                                                                                                                                                                            |
| radius     | number          | 否   | 定义涟漪效果的半径。                                                                                                                                                                                                                                   |
| foreground | boolean         | 否   | 设为 true 时，将涟漪效果添加到视图前景，而不是背景。如果你的某个子视图本身有背景，或者你正在例如显示图片，并且不希望涟漪被它们遮挡，这会很有用。 |
