---
id: pressable
title: Pressable
---

Pressable 是一个 Core Component 包装器，可检测其任意已定义子元素上的多种按压交互阶段。

```tsx
<Pressable onPress={onPressFunction}>
  <Text>我是可按压的！</Text>
</Pressable>
```

## 它是如何工作的

在被 `Pressable` 包裹的元素上：

- 调用 [`onPressIn`](#onpressin) 时，表示一次按压被激活。
- 调用 [`onPressOut`](#onpressout) 时，表示按压手势被取消激活。

在按下 [`onPressIn`](#onpressin) 之后，会发生以下两种情况之一：

1. 该人会移开手指，触发 [`onPressOut`](#onpressout)，随后触发 [`onPress`](#onpress)。
2. 如果该人将手指停留超过 500 毫秒后才移开，则会触发 [`onLongPress`](#onlongpress)。([`onPressOut`](#onpressout) 仍会在其移开手指时触发。)

<img src="/docs/assets/d_pressable_pressing.svg" width="1000" alt="按压事件顺序图。" />

手指并不是最精确的工具，用户很常会意外激活错误的元素或错过激活区域。为了解决这个问题，`Pressable` 提供了一个可选的 `HitRect`，你可以用它来定义触摸在距离被包裹元素多远的位置仍可被识别。按压可以从 `HitRect` 内的任意位置开始。

`PressRect` 允许按压在保持激活并具备成为一次“press”的资格的同时，移动到元素及其 `HitRect` 之外——可以把它想象成手指在按住按钮时缓慢滑开。

:::note
触摸区域绝不会超出父视图边界；如果一次触摸命中两个重叠视图，兄弟视图的 Z-index 总是优先。
:::

<figure>
  <img src="/docs/assets/d_pressable_anatomy.svg" width="1000" alt="HitRect 和 PressRect 以及它们如何工作的示意图。" />
  <figcaption>
    你可以使用 <code>hitSlop</code> 设置 <code>HitRect</code>，并使用 <code>pressRetentionOffset</code> 设置 <code>PressRect</code>。
  </figcaption>
</figure>

:::info
`Pressable` 使用 React Native 的 `Pressability` API。有关 Pressability 状态机流程及其工作方式的更多信息，请查看 [Pressability](https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/Pressability/Pressability.js#L350) 的实现。
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
            <Text style={styles.text}>{pressed ? '按下了！' : '按我'}</Text>
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

如果为 true，则按下时不会播放 Android 系统声音。

| Type    | Default |
| ------- | ------- |
| boolean | `false` |

### `android_ripple` <div className="label android">Android</div>

启用 Android 涟漪效果并配置其属性。

| Type                                   |
| -------------------------------------- |
| [RippleConfig](pressable#rippleconfig) |

### `children`

可以是子元素，也可以是接收一个布尔值的函数，用于表示组件当前是否处于按下状态。

| Type                     |
| ------------------------ |
| [React Node](react-node) |

### `unstable_pressDelay`

按下后到调用 `onPressIn` 之前等待的时长（毫秒）。

| Type   |
| ------ |
| number |

### `delayLongPress`

从 `onPressIn` 开始到调用 `onLongPress` 的时长（毫秒）。

| Type   | Default |
| ------ | ------- |
| number | `500`   |

### `disabled`

是否禁用按压行为。

| Type    | Default |
| ------- | ------- |
| boolean | `false` |

### `hitSlop`

设置元素外部可检测按压的额外距离。

| Type                   |
| ---------------------- |
| [Rect](rect) or number |

### `onHoverIn`

悬停被激活时调用，以提供视觉反馈。

| Type                                                                                                      |
| --------------------------------------------------------------------------------------------------------- |
| `md ({ nativeEvent: [MouseEvent](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) }) => void` |

### `onHoverOut`

悬停被取消激活时调用，以撤销视觉反馈。

| Type                                                                                                      |
| --------------------------------------------------------------------------------------------------------- |
| `md ({ nativeEvent: [MouseEvent](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) }) => void` |

### `onLongPress`

如果 `onPressIn` 之后的时间超过 500 毫秒，则调用。此时间可通过 [`delayLongPress`](#delaylongpress) 自定义。

| Type                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

### `onPress`

在 `onPressOut` 之后调用。

| Type                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

### `onPressIn`

在触摸开始时立即调用，早于 `onPressOut` 和 `onPress`。

| Type                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

### `onPressMove`

按压位置移动时调用。

| Type                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

### `onPressOut`

在触摸释放时调用。

| Type                                                   |
| ------------------------------------------------------ |
| `md ({nativeEvent: [PressEvent](pressevent)}) => void` |

### `pressRetentionOffset`

在 `onPressOut` 触发之前，视图外部额外的触摸距离，在此范围内仍会被视为一次按压。

| Type                   | Default                                      |
| ---------------------- | -------------------------------------------- |
| [Rect](rect) or number | `{bottom: 30, left: 20, right: 20, top: 20}` |

### `style`

可以是视图样式，也可以是接收一个布尔值来表示组件当前是否处于按下状态并返回视图样式的函数。

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

**属性：**

| Name       | Type            | Required | Description                                                                                                                                                                                                                                                  |
| ---------- | --------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| color      | [color](colors) | No       | 定义涟漪效果的颜色。                                                                                                                                                                                                                                           |
| borderless | boolean         | No       | 定义涟漪效果是否不包含边框。                                                                                                                                                                                                                                   |
| radius     | number          | No       | 定义涟漪效果的半径。                                                                                                                                                                                                                                           |
| foreground | boolean         | No       | 设为 true 时，会将涟漪效果添加到视图前景，而不是背景。如果你的某个子视图本身有背景，或者例如正在显示图片，并且不希望涟漪被它们遮住，这会很有用。
