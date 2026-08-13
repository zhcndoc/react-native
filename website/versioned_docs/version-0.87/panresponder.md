---
id: panresponder
title: PanResponder
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

`PanResponder` 将多个触摸操作协调为单个手势。它使单触摸手势能够抵抗额外触摸操作的干扰，也可用于识别基本的多点触摸手势。

默认情况下，`PanResponder` 会持有一个交互句柄，以阻止长时间运行的 JS 事件中断活动手势。

它为[手势响应系统](gesture-responder-system.md)提供的响应器处理程序提供了一个可预测的封装。对于每个处理程序，它都会在原生事件对象旁提供一个新的 `gestureState` 对象：

```
onPanResponderMove: (event, gestureState) => {}
```

原生事件是一个合成触摸事件，其形式为 [PressEvent](pressevent)。

`gestureState` 对象具有以下属性：

- `stateID` - gestureState 的 ID，只要屏幕上至少存在一个触摸操作，该 ID 就会持续存在
- `moveX` - 最近移动的触摸操作的最新屏幕坐标
- `moveY` - 最近移动的触摸操作的最新屏幕坐标
- `x0` - 响应器获得授权时的屏幕坐标
- `y0` - 响应器获得授权时的屏幕坐标
- `dx` - 自触摸开始以来手势累计移动的距离
- `dy` - 自触摸开始以来手势累计移动的距离
- `vx` - 手势当前的速度
- `vy` - 手势当前的速度
- `numberActiveTouches` - 当前屏幕上的触摸操作数量

## 使用模式

```tsx
const ExampleComponent = () => {
  const panResponder = useRef(
    PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) =>
        true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) =>
        true,

      onPanResponderGrant: (evt, gestureState) => {
        // The gesture has started. Show visual feedback so the user knows
        // what is happening!
        // gestureState.d{x,y} will be set to zero now
      },
      onPanResponderMove: (evt, gestureState) => {
        // The most recent move distance is gestureState.move{X,Y}
        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}
      },
      onPanResponderTerminationRequest: (evt, gestureState) =>
        true,
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true;
      },
    }),
  ).current;

  return <View {...panResponder.panHandlers} />;
};
```

## 示例

`PanResponder` 与 `Animated` API 配合使用，有助于在 UI 中构建复杂手势。以下示例包含一个可在屏幕上自由拖动的动画 `View` 组件

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

请尝试 [RNTester 中的 PanResponder 示例](https://github.com/facebook/react-native/blob/main/packages/rn-tester/js/examples/PanResponder/PanResponderExample.js)。

---

# 参考

## 方法

### `create()`

```tsx
static create(config: PanResponderCallbacks): PanResponderInstance;
```

**参数：**

| 名称                                                        | 类型   | 描述     |
| ----------------------------------------------------------- | ------ | -------- |
| config <div className="label basic required">Required</div> | object | 参见下文 |

`config` 对象提供了所有响应器回调的增强版本：除了 [`PressEvent`](pressevent) 外，还提供 `PanResponder` 手势状态，具体方式是在每个典型的 `onResponder*` 回调中将单词 `Responder` 替换为 `PanResponder`。例如，`config` 对象如下所示：

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

通常，对于具有捕获等效处理程序的事件，我们会在捕获阶段更新一次 `gestureState`，并且也可以在冒泡阶段使用它。

请谨慎处理 `onStartShould*` 回调。它们仅会反映冒泡或捕获到 Node 的开始／结束事件所对应的更新后 `gestureState`。一旦 Node 成为响应器，就可以依赖每个开始／结束事件都由手势处理，并且 `gestureState` 会相应更新。除非你是响应器，否则 `numberActiveTouches` 可能并不完全准确。
