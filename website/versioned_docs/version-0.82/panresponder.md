---
id: panresponder
title: PanResponder
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

`PanResponder` 将多个触摸事件协调为一个手势。它使单指手势能够抵抗额外触摸的干扰，也可用于识别基本的多点触控手势。

默认情况下，`PanResponder` 会持有一个 `InteractionManager` 句柄，以阻止耗时的 JS 事件打断正在进行的手势。

它提供了一个可预测的包装层，用于封装 [gesture responder system](gesture-responder-system.md) 提供的 responder 处理函数。对于每个处理函数，它都会在原生事件对象旁边提供一个新的 `gestureState` 对象：

```
onPanResponderMove: (event, gestureState) => {}
```

原生事件是一种形如 [PressEvent](pressevent) 的合成触摸事件。

`gestureState` 对象包含以下内容：

- `stateID` - gestureState 的 ID；只要屏幕上至少还有一个触摸点，它就会一直保持不变
- `moveX` - 最近移动的触摸点的最新屏幕坐标
- `moveY` - 最近移动的触摸点的最新屏幕坐标
- `x0` - responder 被授予时的屏幕坐标
- `y0` - responder 被授予时的屏幕坐标
- `dx` - 自触摸开始以来手势累计移动距离
- `dy` - 自触摸开始以来手势累计移动距离
- `vx` - 手势当前速度
- `vy` - 手势当前速度
- `numberActiveTouches` - 当前屏幕上的触摸点数量

## 用法模式

```tsx
const ExampleComponent = () => {
  const panResponder = useRef(
    PanResponder.create({
      // 请求成为 responder：
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) =>
        true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) =>
        true,

      onPanResponderGrant: (evt, gestureState) => {
        // 手势已经开始。显示视觉反馈，让用户知道
        // 正在发生什么！
        // gestureState.d{x,y} 现在将被设为零
      },
      onPanResponderMove: (evt, gestureState) => {
        // 最近的移动距离是 gestureState.move{X,Y}
        // 自成为 responder 以来累计的手势距离是
        // gestureState.d{x,y}
      },
      onPanResponderTerminationRequest: (evt, gestureState) =>
        true,
      onPanResponderRelease: (evt, gestureState) => {
        // 当此视图作为 responder 时，用户已释放所有触摸。
        // 这通常表示一次手势已成功
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // 另一个组件已经成为 responder，因此这个手势
        // 应该被取消
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // 返回此组件是否应阻止原生组件成为 JS
        // responder。默认返回 true。当前仅在 android 上支持。
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
import {useRef} from 'react';
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

| Name                                                        | Type   | Description |
| ----------------------------------------------------------- | ------ | ----------- |
| config <div className="label basic required">Required</div> | object | 请参见下文 |

`config` 对象为所有 responder 回调提供了增强版本：它们不仅提供 [`PressEvent`](pressevent)，还提供 `PanResponder` 的手势状态。实现方式是在每个典型的 `onResponder*` 回调中，将单词 `Responder` 替换为 `PanResponder`。例如，`config` 对象可以如下所示：

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

通常情况下，对于具有 capture 对应项的事件，我们会在 capture 阶段更新一次 gestureState，并且也可以在 bubble 阶段使用它。

请小心使用 `onStartShould*` 回调。它们只会反映那些冒泡/捕获到 Node 的 start/end 事件的已更新 `gestureState`。一旦该节点成为 responder，你就可以依赖每一个 start/end 事件都由手势处理，并且 `gestureState` 会相应更新。`numberActiveTouches` 可能并不完全准确，除非你就是 responder。
