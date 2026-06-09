---
id: pressable
title: Pressable
---

Pressable 是一个 Core Component 包装器，可检测其任意已定义子元素上的各种按压交互阶段。

```tsx
<Pressable onPress={onPressFunction}>
  <Text>I'm pressable!</Text>
</Pressable>
```

## 其工作原理

在被 `Pressable` 包裹的元素上：

- 当按压被激活时，会调用 [`onPressIn`](#onpressin)。
- 当按压手势被取消激活时，会调用 [`onPressOut`](#onpressout)。

在按下 [`onPressIn`](#onpressin) 之后，会发生以下两种情况之一：

1. 该人会移开手指，触发 [`onPressOut`](#onpressout)，随后触发 [`onPress`](#onpress)。
2. 如果该人在松开前将手指停留超过 500 毫秒，则会触发 [`onLongPress`](#onlongpress)。（在他们移开手指时，[`onPressOut`](#onpressout) 仍会触发。）

<img src="/docs/assets/d_pressable_pressing.svg" width="1000" alt="按压事件按顺序发生的示意图。" />

手指并不是最精确的工具，用户经常会不小心点到错误的元素，或错过激活区域。为此，`Pressable` 提供了可选的 `HitRect`，你可以用它来定义触摸距离包裹元素多远时仍可被识别。按压可以从 `HitRect` 内的任意位置开始。

`PressRect` 允许按压在保持激活状态并仍可被视为一次“press”的情况下，移动到元素及其 `HitRect` 之外——可以把它想象成手指正按在按钮上，然后缓慢向外滑开。

> 触摸区域绝不会超出父视图边界；如果一次触摸同时命中两个重叠视图，则始终以兄弟视图的 Z-index 为准。

<figure>
  <img src="/docs/assets/d_pressable_anatomy.svg" width="1000" alt="HitRect 和 PressRect 及其工作方式的示意图。" />
  <figcaption>
    你可以使用 <code>hitSlop</code> 设置 <code>HitRect</code>，并使用 <code>pressRetentionOffset</code> 设置 <code>PressRect</code>。
  </figcaption>
</figure>

> `Pressable` 使用 React Native 的 `Pressability` API。有关 Pressability 状态机流程及其工作方式的更多信息，请查看 [Pressability](https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/Pressability/Pressability.js#L350) 的实现。

## 示例

```SnackPlayer name=Pressable
import {useState} from 'react';
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

## Props

### `android_disableSound` <div className="label android">Android</div>

如果为 true，则按下时不会播放 Android 系统音效。

| Type    | Default |
| ------- | ------- |
| boolean | `false` |

### `android_ripple` <div className="label android">Android</div>

启用 Android 涟漪效果并配置其属性。

| Type                                   |
| -------------------------------------- |
| [RippleConfig](pressable#rippleconfig) |

### `children`

子元素，或一个接收布尔值的函数，该布尔值表示组件当前是否处于按下状态。

| Type                     |
| ------------------------ |
| [React Node](react-node) |

### `unstable_pressDelay`

在按下后、调用 `onPressIn` 之前等待的持续时间（毫秒）。

| Type   |
| ------ |
| number |

### `delayLongPress`

从 `onPressIn` 开始到调用 `onLongPress` 之间的持续时间（毫秒）。

| Type   | Default |
| ------ | ------- |
| number | `500`   |

### `disabled`

是否禁用按压行为。

| Type    | Default |
| ------- | ------- |
| boolean | `false` |

### `hitSlop`

设置元素外部可检测按压的附加距离。

| Type                   |
| ---------------------- |
| [Rect](rect) or number |

### `onHoverIn`

在悬停被激活时调用，以提供视觉反馈。

| Type                                                                                                      |
| --------------------------------------------------------------------------------------------------------- |
| `md ({ nativeEvent: [MouseEvent](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) }) => void` |

### `onHoverOut`

在悬停被取消激活时调用，以撤销视觉反馈。

| Type                                                                                                      |
| --------------------------------------------------------------------------------------------------------- |
| `md ({ nativeEvent: [MouseEvent](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) }) => void` |

### `onLongPress`

如果 `onPressIn` 之后的时间超过 500 毫秒，则调用。此时间段可通过 [`delayLongPress`](#delaylongpress) 自定义。

| Type                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

### `onPress`

在 `onPressOut` 之后调用。

| Type                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

### `onPressIn`

在触摸接触时立即调用，早于 `onPressOut` 和 `onPress`。

| Type                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

### `onPressMove`

在按压位置移动时调用。

| Type                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

### `onPressOut`

在触摸释放时调用。

| Type                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

### `pressRetentionOffset`

在触发 `onPressOut` 之前，视图外部仍被视为一次按压的附加距离。

| Type                   | Default                                      |
| ---------------------- | -------------------------------------------- |
| [Rect](rect) or number | `{bottom: 30, left: 20, right: 20, top: 20}` |

### `style`

可以是视图样式，或一个接收布尔值的函数，该布尔值表示组件当前是否处于按下状态，并返回视图样式。

| Type                                                                                            |
| ----------------------------------------------------------------------------------------------- |
| [View Style](view-style-props) or `md ({ pressed: boolean }) => [View Style](view-style-props)` |

### `testOnly_pressed`

仅用于文档或测试（例如快照测试）。

| Type    | Default |
| ------- | ------- |
| boolean | `false` |

## 类型定义

### RippleConfig

`android_ripple` 属性的涟漪效果配置。

| Type   |
| ------ |
| object |

**Properties:**

| Name       | Type            | Required | Description                                                                                                                                                                                                                                                  |
| ---------- | --------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| color      | [color](colors) | No       | 定义涟漪效果的颜色。                                                                                                                                                                                                                                          |
| borderless | boolean         | No       | 定义涟漪效果是否不包含边框。                                                                                                                                                                                                                                  |
| radius     | number          | No       | 定义涟漪效果的半径。                                                                                                                                                                                                                                          |
| foreground | boolean         | No       | 设为 true 时，将涟漪效果添加到视图前景而不是背景。如果你的某个子视图本身有背景，或者例如正在显示图片且不希望涟漪被其遮挡，这会很有用。
