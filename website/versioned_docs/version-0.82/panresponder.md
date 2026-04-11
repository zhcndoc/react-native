---
id: panresponder
title: PanResponder
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

`PanResponder` 将多次触摸协调为单个手势。它使单触摸手势对额外触摸具有弹性，并可用于识别基本的多触摸手势。

默认情况下，`PanResponder` 持有一个 `InteractionManager` 句柄，以阻止长时间运行的 JS 事件中断活动手势。

它为 [gesture responder system](gesture-responder-system.md) 提供的响应器处理程序提供了一个可预测的包装器。对于每个处理程序，除了原生事件对象外，它还提供一个新的 `gestureState` 对象：

```
onPanResponderMove: (event, gestureState) => {}
```

原生事件是一个具有 [PressEvent](pressevent) 形式的合成触摸事件。

`gestureState` 对象具有以下内容：

- `stateID` - gestureState 的 ID - 只要屏幕上至少有一个触摸就会持久存在
- `moveX` - 最近移动的触摸的最新屏幕坐标
- `moveY` - 最近移动的触摸的最新屏幕坐标
- `x0` - 响应器授予时的屏幕坐标
- `y0` - 响应器授予时的屏幕坐标
- `dx` - 自触摸开始以来手势的累积距离
- `dy` - 自触摸开始以来手势的累积距离
- `vx` - 手势的当前速度
- `vy` - 手势的当前速度
- `numberActiveTouches` - 当前屏幕上的触摸数量

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
        // 手势已开始。显示视觉反馈以便用户知道
        // 正在发生什么！
        // gestureState.d{x,y} 现在将被设置为零
      },
      onPanResponderMove: (evt, gestureState) => {
        // 最近的移动距离是 gestureState.move{X,Y}
        // 自成为响应器以来累积的手势距离是
        // gestureState.d{x,y}
      },
      onPanResponderTerminationRequest: (evt, gestureState) =>
        true,
      onPanResponderRelease: (evt, gestureState) => {
        // 当此视图是
        // 响应器时，用户已释放所有触摸。这通常意味着手势已成功
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // 另一个组件已成为响应器，因此此手势
        // 应被取消
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // 返回此组件是否应阻止原生组件成为 JS
        // 响应器。默认返回 true。目前仅在 android 上支持。
        return true;
      },
    }),
  ).current;

  return <View {...panResponder.panHandlers} />;
};
```

## 示例

`PanResponder` 与 `Animated` API 配合使用，以帮助在 UI 中构建复杂的手势。以下示例包含一个动画 `View` 组件，可以在屏幕上自由拖动

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
        <Text style={styles.titleText}>Drag this box!</Text>
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

尝试 [RNTester 中的 PanResponder 示例](https://github.com/facebook/react-native/blob/main/packages/rn-tester/js/examples/PanResponder/PanResponderExample.js)。

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
| config <div className="label basic required">必需</div> | object | 见下文 |

`config` 对象提供了所有响应器回调的增强版本，它不仅提供 [`PressEvent`](pressevent)，还提供 `PanResponder` 手势状态，方法是将每个典型的 `onResponder*` 回调中的单词 `Responder` 替换为 `PanResponder`。例如，`config` 对象看起来像：

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

通常，对于具有捕获等效项的事件，我们在捕获阶段更新一次 gestureState，并可以在冒泡阶段使用它。

小心 `onStartShould*` 回调。它们仅反映冒泡/捕获到节点的开始/结束事件的更新 `gestureState`。一旦节点成为响应器，你可以依赖每个开始/结束事件都被手势处理并且 `gestureState` 相应更新。(numberActiveTouches) 可能不完全准确，除非你是响应器。
