---
id: panresponder
title: PanResponder
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

`PanResponder` 将多个触摸合并为单一手势。它使单点触摸手势对额外触摸更具韧性，并可用于识别基本的多点触摸手势。

默认情况下，`PanResponder` 持有一个 `InteractionManager` 句柄，用于阻止长时间运行的 JS 事件打断当前活跃的手势。

它提供了一个可预测的响应者处理函数包装，基于 [手势响应者系统](gesture-responder-system.md) 提供的响应者处理函数。对于每个处理函数，它都会提供一个新的 `gestureState` 对象，和原生事件对象一同传递：

```
onPanResponderMove: (event, gestureState) => {}
```

原生事件是具有 [PressEvent](pressevent) 结构的合成触摸事件。

`gestureState` 对象包含以下字段：

- `stateID` - 手势状态的 ID — 只要屏幕上至少有一个触点，该 ID 即持续有效
- `moveX` - 最近移动的触点的最新屏幕坐标 X
- `moveY` - 最近移动的触点的最新屏幕坐标 Y
- `x0` - 响应者授权时的屏幕坐标 X
- `y0` - 响应者授权时的屏幕坐标 Y
- `dx` - 手势自触摸开始以来累计的水平移动距离
- `dy` - 手势自触摸开始以来累计的垂直移动距离
- `vx` - 当前手势的水平速度
- `vy` - 当前手势的垂直速度
- `numberActiveTouches` - 当前屏幕上的触点数量

## 使用模式

```tsx
const ExampleComponent = () => {
  const panResponder = React.useRef(
    PanResponder.create({
      // 请求成为响应者：
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) =>
        true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) =>
        true,

      onPanResponderGrant: (evt, gestureState) => {
        // 手势开始。显示视觉反馈让用户知道当前状态！
        // gestureState.d{x,y} 当前将被重置为零
      },
      onPanResponderMove: (evt, gestureState) => {
        // 最近的移动距离为 gestureState.move{X,Y}
        // 成为响应者以来的累计手势距离为 gestureState.d{x,y}
      },
      onPanResponderTerminationRequest: (evt, gestureState) =>
        true,
      onPanResponderRelease: (evt, gestureState) => {
        // 用户松开了所有触点且此视图仍为响应者。通常表示手势成功完成
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // 其他组件成为响应者，所以此手势应被取消
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // 返回是否该组件应阻止原生组件成为 JS 响应者。默认返回 true。当前仅在安卓上支持。
        return true;
      },
    }),
  ).current;

  return <View {...panResponder.panHandlers} />;
};
```

## 示例

`PanResponder` 与 `Animated` API 配合使用，帮助构建 UI 中复杂的手势。以下示例包含一个可自由拖动的动画 `View` 组件：

```SnackPlayer name=PanResponder
import React, {useRef} from 'react';
import {Animated, View, StyleSheet, PanResponder, Text} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, {dx: pan.x, dy: pan.y}]),
      onPanResponderRelease: () => {
        pan.extractOffset();
      },
    }),
  ).current;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.titleText}>拖动这个盒子！</Text>
        <Animated.View
          style={{
            transform: [{translateX: pan.x}, {translateY: pan.y}],
          }}
          {...panResponder.panHandlers}>
          <View style={styles.box} />
        </Animated.View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 14,
    lineHeight: 24,
    fontWeight: 'bold',
  },
  box: {
    height: 150,
    width: 150,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
});

export default App;
```

可尝试查看 [RNTester 中的 PanResponder 示例](https://github.com/facebook/react-native/blob/main/packages/rn-tester/js/examples/PanResponder/PanResponderExample.js)。

---

# 参考

## 方法

### `create()`

```tsx
static create(config: PanResponderCallbacks): PanResponderInstance;
```

**参数：**

| 名称                                                        | 类型   | 描述       |
| ----------------------------------------------------------- | ------ | ---------- |
| config <div className="label basic required">必需</div>      | object | 详见下文   |

`config` 对象提供了所有响应者回调的增强版本，这些版本不仅提供 [`PressEvent`](pressevent)，还包含 `PanResponder` 的手势状态，通过将典型的 `onResponder*` 回调中的"Responder"替换为"PanResponder"。例如，该 `config` 对象形式如下：

- `onMoveShouldSetPanResponder: (e, gestureState) => {...}`
- `onMoveShouldSetPanResponderCapture: (e, gestureState) => {...}`
- `onStartShouldSetPanResponder: (e, gestureState) => {...}`
- `onStartShouldSetPanResponderCapture: (e, gestureState) => {...}`
- `onPanResponderReject: (e, gestureState) => {...}`
- `onPanResponderGrant: (e, gestureState) => {...}`
- `onPanResponderStart: (e, gestureState) => {...}`
- `onPanResponderEnd: (e, gestureState) => {...}`
- `onPanResponderRelease: (e, gestureState) => {...}`
- `onPanResponderMove: (e, gestureState) => {...}`
- `onPanResponderTerminate: (e, gestureState) => {...}`
- `onPanResponderTerminationRequest: (e, gestureState) => {...}`
- `onShouldBlockNativeResponder: (e, gestureState) => {...}`

通常，对于具有捕获阶段对应事件的回调，我们会在捕获阶段更新 `gestureState` 并在冒泡阶段使用它。

请注意 `onStartShould*` 回调。它们仅反映冒泡/捕获至节点的 start/end 事件中的更新 `gestureState`。一旦该节点成为响应者，可依赖手势处理所有 start/end 事件及相应更新 `gestureState`。（除非您是响应者，否则 `numberActiveTouches` 可能不完全准确。）