---
id: pressable
title: Pressable
---

Pressable 是一个 Core Component 包装器，可以检测其定义的任意子组件上的各种按压交互阶段。

```tsx
<Pressable onPress={onPressFunction}>
  <Text>I'm pressable!</Text>
</Pressable>
```

## 工作原理

在由 `Pressable` 包装的元素上：

- [`onPressIn`](#onpressin) 会在按压激活时调用。
- [`onPressOut`](#onpressout) 会在按压手势停用时调用。

在按下 [`onPressIn`](#onpressin) 后，会发生以下两种情况之一：

1. 用户移开手指，触发 [`onPressOut`](#onpressout)，然后触发 [`onPress`](#onpress)。
2. 如果用户在移开手指前保持按压超过 500 毫秒，则会触发 [`onLongPress`](#onlongpress)。（移开手指时仍会触发 [`onPressOut`](#onpressout)。）

<img src="/docs/assets/d_pressable_pressing.svg" width="1000" alt="按压事件按顺序发生的示意图。" />

手指并不是最精确的操作工具，用户误触错误元素或错过激活区域是很常见的。为此，`Pressable` 提供了可选的 `HitRect`，你可以使用它来定义触摸在距离包装元素多远的位置仍可注册。按压可以从 `HitRect` 内的任意位置开始。

`PressRect` 允许按压移动到元素及其 `HitRect` 之外，同时保持激活状态并符合“按压”的条件——可以想象成你按住一个按钮，然后缓慢将手指移开。

:::note
触摸区域永远不会超出父视图边界，如果触摸同时命中两个重叠视图，兄弟视图的 Z-index 始终优先。
:::

<figure>
  <img src="/docs/assets/d_pressable_anatomy.svg" width="1000" alt="HitRect 和 PressRect 以及其工作方式的示意图。" />
  <figcaption>
    你可以使用 <code>hitSlop</code> 设置 <code>HitRect</code>，并使用 <code>pressRetentionOffset</code> 设置 <code>PressRect</code>。
  </figcaption>
</figure>

:::info
`Pressable` 使用 React Native 的 `Pressability` API。有关 Pressability 的状态机流程及其工作方式的更多信息，请参阅 [Pressability](https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/Pressability/Pressability.js#L350) 的实现。
:::

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

如果为 true，则按压时不会播放 Android 系统声音。

| Type    | Default |
| ------- | ------- |
| boolean | `false` |

### `android_ripple` <div className="label android">Android</div>

启用 Android 波纹效果并配置其属性。`color` 字段同时接受普通颜色和 [`PlatformColor`](platformcolor) 值，因此你可以引用 `?attr/colorAccent` 等主题属性。使用 `PlatformColor` 时，当系统配置发生变化（例如在浅色模式和深色模式之间切换）时，波纹会自动更新。

| Type                                   |
| -------------------------------------- |
| [RippleConfig](pressable#rippleconfig) |

### `children`

可以是子元素，也可以是一个接收布尔值的函数，该布尔值反映组件当前是否处于按压状态。

| Type                     |
| ------------------------ |
| [React Node](react-node) |

### `unstable_pressDelay`

按下后到调用 `onPressIn` 之前等待的时长（以毫秒为单位）。

| Type   |
| ------ |
| number |

### `delayLongPress`

从 `onPressIn` 开始到调用 `onLongPress` 之前的时长（以毫秒为单位）。

| Type   | Default |
| ------ | ------- |
| number | `500`   |

### `disabled`

是否禁用按压行为。

| Type    | Default |
| ------- | ------- |
| boolean | `false` |

### `hitSlop`

设置元素外部可以检测到按压的额外距离。

| Type                   |
| ---------------------- |
| [Rect](rect) or number |

### `onHoverIn`

悬停激活时调用，以提供视觉反馈。

| Type                                                                                                      |
| --------------------------------------------------------------------------------------------------------- |
| `md ({ nativeEvent: [MouseEvent](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) }) => void` |

### `onHoverOut`

悬停停用时调用，以撤销视觉反馈。

| Type                                                                                                      |
| --------------------------------------------------------------------------------------------------------- |
| `md ({ nativeEvent: [MouseEvent](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) }) => void` |

### `onLongPress`

如果 `onPressIn` 之后的时长超过 500 毫秒，则调用。此时长可以通过 [`delayLongPress`](#delaylongpress) 自定义。

| Type                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

### `onPress`

在 `onPressOut` 之后调用。

| Type                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

### `onPressIn`

触摸开始时立即调用，在 `onPressOut` 和 `onPress` 之前。

| Type                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

### `onPressMove`

按压位置移动时调用。

| Type                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

### `onPressOut`

触摸释放时调用。

| Type                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

### `pressRetentionOffset`

在触发 `onPressOut` 之前，触摸被视为按压时视图外部的额外距离。

| Type                   | Default                                      |
| ---------------------- | -------------------------------------------- |
| [Rect](rect) or number | `{bottom: 30, left: 20, right: 20, top: 20}` |

### `style`

可以是视图样式，也可以是一个接收布尔值的函数，该布尔值反映组件当前是否处于按压状态，并返回视图样式。

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

`android_ripple` 属性的波纹效果配置。

| Type   |
| ------ |
| object |

**属性：**

| Name       | Type                                              | Required | Description                                                                                                                                       |
| ---------- | ------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| color      | [color](colors) or [PlatformColor](platformcolor) | No       | 定义波纹效果的颜色。                                                                                                                              |
| borderless | boolean                                           | No       | 定义波纹效果是否不包含边框。                                                                                                                      |
| radius     | number                                            | No       | 定义波纹效果的半径。                                                                                                                              |
| foreground | boolean                                           | No       | 设置为 true 可将波纹效果添加到视图的前景，而不是背景。 如果子视图之一有自己的背景，或者例如正在显示图像，并且你不希望波纹被它们覆盖，这会很有用。 |
| alpha      | number                                            | No       | 控制波纹的不透明度。接受 `0.0`（完全透明）到 `1.0`（完全不透明）之间的值。该值会叠加在颜色中已有的 alpha 值之上。                                 |
