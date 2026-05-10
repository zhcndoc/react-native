---
id: panresponder
title: PanResponder
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

`PanResponder` 会将多个触摸点协调为一个手势。它使单指手势对额外触摸更具鲁棒性，并可用于识别基本的多点触控手势。

默认情况下，`PanResponder` 会持有一个 `InteractionManager` 句柄，以阻止耗时较长的 JS 事件打断正在进行的手势。

它提供了由 [gesture responder system](gesture-responder-system.md) 提供的响应器处理函数的一个可预测包装。对于每个处理函数，它都会在原生事件对象旁边提供一个新的 `gestureState` 对象：

```
onPanResponderMove: (event, gestureState) => {}
```

原生事件是一个形如 [PressEvent](pressevent) 的合成触摸事件。

`gestureState` 对象包含以下内容：

- `stateID` - gestureState 的 ID；只要屏幕上至少有一个触摸点，它就会一直保持
- `moveX` - 最近移动的触摸点的最新屏幕坐标
- `moveY` - 最近移动的触摸点的最新屏幕坐标
- `x0` - 响应器授予时的屏幕坐标
- `y0` - 响应器授予时的屏幕坐标
- `dx` - 自触摸开始以来手势累计移动距离
- `dy` - 自触摸开始以来手势累计移动距离
- `vx` - 手势当前速度
- `vy` - 手势当前速度
- `numberActiveTouches` - 当前屏幕上的触摸点数量

## 使用模式

```tsx
const ExampleComponent = () => {
  const panResponder = React.useRef(
    PanResponder.create({
      // 请求成为响应器：
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) =>
        true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) =>
        true,

      onPanResponderGrant: (evt, gestureState) => {
        // 手势已开始。显示视觉反馈，让用户知道
        // 正在发生什么！
        // 现在 gestureState.d{x,y} 将被设为零
      },
      onPanResponderMove: (evt, gestureState) => {
        // 最近一次移动距离是 gestureState.move{X,Y}
        // 自成为响应器以来累计的手势距离是
        // gestureState.d{x,y}
      },
      onPanResponderTerminationRequest: (evt, gestureState) =>
        true,
      onPanResponderRelease: (evt, gestureState) => {
        // 当此视图是响应器时，用户已释放所有触摸点。
        // 这通常意味着一个手势已成功
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // 另一个组件已经成为响应器，因此该手势
        // 应该被取消
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // 返回此组件是否应阻止原生组件成为 JS
        // 响应器。默认返回 true。目前仅在 android 上受支持。
        return true;
      },
    }),
  ).current;

  return <View {...panResponder.panHandlers} />;
};
```

## 示例

`PanResponder` 可与 `Animated` API 配合使用，帮助在 UI 中构建复杂手势。以下示例包含一个可在屏幕上自由拖动的动画 `View` 组件

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
        <Text style={styles.titleText}>拖动这个方块！</Text>
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

试试 [RNTester 中的 PanResponder 示例](https://github.com/facebook/react-native/blob/main/packages/rn-tester/js/examples/PanResponder/PanResponderExample.js)。

---

# 参考

## 方法

### `create()`

```tsx
static create(config: PanResponderCallbacks): PanResponderInstance;
```

**参数：**

| 名称                                                        | 类型   | 描述 |
| ----------------------------------------------------------- | ------ | ----------- |
| config <div className="label basic required">必需</div> | object | 参见下文 |

`config` 对象提供了所有响应器回调函数的增强版本：它不仅提供 [`PressEvent`](pressevent)，还提供 `PanResponder` 的手势状态。其方式是将每个常见的 `onResponder*` 回调中的 `Responder` 替换为 `PanResponder`。例如，`config` 对象会像这样：

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

一般来说，对于具有捕获版本的事件，我们会在捕获阶段更新一次 `gestureState`，并且也可以在冒泡阶段使用它。

请谨慎使用 `onStartShould*` 回调。它们只会反映会冒泡/捕获到 Node 的开始/结束事件所更新的 `gestureState`。一旦该节点成为响应器，你就可以依赖每个开始/结束事件都由手势处理，并且 `gestureState` 会相应更新。（numberActiveTouches）在你不是响应器时可能并不完全准确。
