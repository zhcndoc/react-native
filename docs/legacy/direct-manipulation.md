---
id: direct-manipulation
title: 直接操作
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

有时需要直接修改组件，而不使用 state/props 来触发整个子树的重新渲染。举例来说，在浏览器中使用 React 时，你有时需要直接修改某个 DOM 节点，移动应用中的视图也是如此。`setNativeProps` 是 React Native 中对应于直接在 DOM 节点上设置属性的方式。

:::caution
当频繁重新渲染造成性能瓶颈时，请使用 `setNativeProps`！

直接操作不会是你经常会用到的工具。通常它只会用于创建连续动画，以避免渲染组件层级和协调许多视图所带来的开销。
`setNativeProps` 是命令式的，并且会将状态存储在原生层（DOM、UIView 等）中，而不是存储在 React 组件内部，这会让你的代码更难推理。

在使用它之前，请先尝试用 `setState` 和 [`shouldComponentUpdate`](https://react.dev/reference/react/Component#shouldcomponentupdate) 来解决问题。
:::

## 在 TouchableOpacity 中使用 setNativeProps

[TouchableOpacity](https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/Components/Touchable/TouchableOpacity.js) 内部使用 `setNativeProps` 来更新其子组件的透明度：

```tsx
const viewRef = useRef<View>();
const setOpacityTo = useCallback(value => {
  // 已省略：与动画相关的代码
  viewRef.current.setNativeProps({
    opacity: value,
  });
}, []);
```

这样我们就可以编写下面的代码，并且知道子组件会在点击时更新透明度，而子组件本身并不需要知道这件事，也不需要对其实现做任何修改：

```tsx
<TouchableOpacity onPress={handlePress}>
  <View>
    <Text>点击我！</Text>
  </View>
</TouchableOpacity>
```

假设 `setNativeProps` 不可用。受此限制，我们可能会用一种方式来实现它：将透明度值存储在 state 中，然后在 `onPress` 触发时更新该值：

```tsx
const [buttonOpacity, setButtonOpacity] = useState(1);
return (
  <TouchableOpacity
    onPressIn={() => setButtonOpacity(0.5)}
    onPressOut={() => setButtonOpacity(1)}>
    <View style={{opacity: buttonOpacity}}>
      <Text>点击我！</Text>
    </View>
  </TouchableOpacity>
);
```

与原始示例相比，这种方式计算开销更大——每次透明度变化时，React 都需要重新渲染组件层级，即使视图及其子组件的其他属性并没有变化。通常这种开销并不值得担心，但在执行连续动画和响应手势时，谨慎地优化组件可以提高动画的保真度。

如果你查看 [NativeMethodsMixin](https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/Renderer/implementations/ReactNativeRenderer-prod.js) 中 `setNativeProps` 的实现，你会发现它只是 `RCTUIManager.updateView` 的一个封装——这和重新渲染最终调用的是同一个函数；参见 [ReactNativeBaseComponent 中的 receiveComponent](https://github.com/facebook/react-native/blob/fb2ec1ea47c53c2e7b873acb1cb46192ac74274e/Libraries/Renderer/oss/ReactNativeRenderer-prod.js#L5793-L5813)。

## 复合组件与 setNativeProps

复合组件没有对应的原生视图，因此不能在它们上面调用 `setNativeProps`。来看这个例子：

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer name=setNativeProps%20with%20Composite%20Components&ext=js
import {Text, TouchableOpacity, View} from 'react-native';

const MyButton = props => (
  <View style={{marginTop: 50}}>
    <Text>{props.label}</Text>
  </View>
);

const App = () => (
  <TouchableOpacity>
    <MyButton label="点击我！" />
  </TouchableOpacity>
);

export default App;
```

</TabItem>
<TabItem value="typescript">

```SnackPlayer name=setNativeProps%20with%20Composite%20Components&ext=tsx
import {Text, TouchableOpacity, View} from 'react-native';

const MyButton = (props: {label: string}) => (
  <View style={{marginTop: 50}}>
    <Text>{props.label}</Text>
  </View>
);

const App = () => (
  <TouchableOpacity>
    <MyButton label="点击我！" />
  </TouchableOpacity>
);

export default App;
```

</TabItem>
</Tabs>

如果你运行这段代码，会立刻看到这个错误：`Touchable child must either be native or forward setNativeProps to a native component`。出现这个错误是因为 `MyButton` 并不是直接由一个原生视图支撑，而该原生视图的透明度应当被设置。你可以这样理解：如果你用 `createReactClass` 定义一个组件，你不会期待能直接给它设置 `style` 属性并让它生效——除非你包装的是一个原生组件，否则你需要把这个 `style` 属性向下传递给子组件。类似地，我们将把 `setNativeProps` 转发给一个由原生视图支撑的子组件。

#### 将 setNativeProps 转发给子组件

由于 `setNativeProps` 方法存在于任何指向 `View` 组件的 ref 上，因此只需将你自定义组件上的 ref 转发到它渲染的某个 `<View />` 组件即可。这意味着，在自定义组件上调用 `setNativeProps` 的效果，会与在被包装的 `View` 组件本身上调用 `setNativeProps` 的效果相同。

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer name=Forwarding%20setNativeProps&ext=js
import {forwardRef} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

const MyButton = forwardRef((props, ref) => (
  <View {...props} ref={ref} style={{marginTop: 50}}>
    <Text>{props.label}</Text>
  </View>
));

const App = () => (
  <TouchableOpacity>
    <MyButton label="点击我！" />
  </TouchableOpacity>
);

export default App;
```

</TabItem>
<TabItem value="typescript">

```SnackPlayer name=Forwarding%20setNativeProps&ext=tsx
import {forwardRef} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

const MyButton = forwardRef<View, {label: string}>((props, ref) => (
  <View {...props} ref={ref} style={{marginTop: 50}}>
    <Text>{props.label}</Text>
  </View>
));

const App = () => (
  <TouchableOpacity>
    <MyButton label="点击我！" />
  </TouchableOpacity>
);

export default App;
```

</TabItem>
</Tabs>

现在你就可以在 `TouchableOpacity` 中使用 `MyButton` 了！

你可能注意到，我们使用 `{...props}` 将所有 props 都传递给了子视图。这样做的原因是 `TouchableOpacity` 实际上是一个复合组件，因此除了依赖其子组件上的 `setNativeProps` 之外，它还要求子组件能够处理触摸。为此，它会传递一些[不同的 props](view.md#onmoveshouldsetresponder)，这些 props 会回调到 `TouchableOpacity` 组件。相比之下，`TouchableHighlight` 由原生视图支撑，因此只需要我们实现 `setNativeProps`。

## 使用 setNativeProps 编辑 TextInput 的值

`setNativeProps` 另一个非常常见的用法是编辑 TextInput 的值。TextInput 的 `controlled` prop 在 `bufferDelay` 较低且用户输入非常快时，有时会丢失字符。一些开发者更倾向于完全跳过这个 prop，而是在必要时使用 `setNativeProps` 直接操作 TextInput 的值。例如，下面的代码演示了在你点击按钮时编辑输入框：

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer name=Clear%20text&ext=js
import {useCallback, useRef} from 'react';
import {
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const App = () => {
  const inputRef = useRef(null);
  const editText = useCallback(() => {
    inputRef.current.setNativeProps({text: '已编辑的文本'});
  }, []);

  return (
    <View style={styles.container}>
      <TextInput ref={inputRef} style={styles.input} />
      <TouchableOpacity onPress={editText}>
        <Text>编辑文本</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 50,
    width: 200,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

export default App;
```

</TabItem>
<TabItem value="typescript">

```SnackPlayer name=Clear%20text&ext=tsx
import {useCallback, useRef} from 'react';
import {
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const App = () => {
  const inputRef = useRef<TextInput>(null);
  const editText = useCallback(() => {
    inputRef.current?.setNativeProps({text: '已编辑的文本'});
  }, []);

  return (
    <View style={styles.container}>
      <TextInput ref={inputRef} style={styles.input} />
      <TouchableOpacity onPress={editText}>
        <Text>编辑文本</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 50,
    width: 200,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

export default App;
```

</TabItem>
</Tabs>

你可以使用 [`clear`](../textinput#clear) 方法以相同的方式清空 `TextInput`，该方法会清除当前输入文本。

## 避免与渲染函数发生冲突

如果你更新了一个也由渲染函数管理的属性，那么你可能会遇到一些不可预测且令人困惑的 bug，因为只要组件重新渲染并且该属性发生变化，之前通过 `setNativeProps` 设置的任何值都会被完全忽略并覆盖。

## setNativeProps & shouldComponentUpdate

通过智能地应用 [`shouldComponentUpdate`](https://react.dev/reference/react/Component#shouldcomponentupdate)，你可以避免在协调未变化的组件子树时产生不必要的开销，甚至可能使使用 `setState` 而不是 `setNativeProps` 也足够高效。

## 其他原生方法

这里描述的方法可用于 React Native 提供的大多数默认组件。不过请注意，它们 _不_ 适用于没有直接由原生视图支持的复合组件。通常，这包括你在自己应用中定义的大多数组件。

### measure(callback)

确定给定视图在屏幕上的位置，以及其在视口中的宽度和高度，并通过异步回调返回这些值。如果成功，回调将以以下参数被调用：

- x
- y
- width
- height
- pageX
- pageY

请注意，这些测量值要等到原生端渲染完成后才可用。如果你希望尽快获取测量值，并且不需要 `pageX` 和 `pageY`，可以考虑改用 [`onLayout`](view.md#onlayout) 属性。

另外，`measure()` 返回的宽度和高度是该组件在视口中的宽高。如果你需要组件的实际尺寸，可以考虑改用 [`onLayout`](view.md#onlayout) 属性。

### measureInWindow(callback)

确定给定视图在窗口中的位置，并通过异步回调返回这些值。如果 React 根视图嵌入在另一个原生视图中，这将为你提供绝对坐标。如果成功，回调将以以下参数被调用：

- x
- y
- width
- height

### measureLayout(relativeToNativeComponentRef, onSuccess, onFail)

与 `measure()` 类似，但会相对于通过 `relativeToNativeComponentRef` 引用指定的祖先来测量视图。这意味着返回的坐标是相对于祖先视图原点 `x`、`y` 的。

:::note
此方法也可以使用 `relativeToNativeNode` 处理器（而不是引用）调用，但在新架构中这一变体已过时。
:::

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer name=measureLayout%20example&supportedPlatforms=android,ios&ext=js
import {useEffect, useRef, useState} from 'react';
import {Text, View, StyleSheet} from 'react-native';

const App = () => {
  const textContainerRef = useRef(null);
  const textRef = useRef(null);
  const [measure, setMeasure] = useState(null);

  useEffect(() => {
    if (textRef.current && textContainerRef.current) {
      textRef.current.measureLayout(
        textContainerRef.current,
        (left, top, width, height) => {
          setMeasure({left, top, width, height});
        },
      );
    }
  }, [measure]);

  return (
    <View style={styles.container}>
      <View ref={textContainerRef} style={styles.textContainer}>
        <Text ref={textRef}>我在哪里？（相对于文本容器）</Text>
      </View>
      <Text style={styles.measure}>{JSON.stringify(measure)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  textContainer: {
    backgroundColor: '#61dafb',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  measure: {
    textAlign: 'center',
    padding: 12,
  },
});

export default App;
```

</TabItem>
<TabItem value="typescript">

```SnackPlayer name=measureLayout%20example&ext=tsx
import {useEffect, useRef, useState} from 'react';
import {Text, View, StyleSheet} from 'react-native';

type Measurements = {
  left: number;
  top: number;
  width: number;
  height: number;
};

const App = () => {
  const textContainerRef = useRef<View>(null);
  const textRef = useRef<Text>(null);
  const [measure, setMeasure] = useState<Measurements | null>(null);

  useEffect(() => {
    if (textRef.current && textContainerRef.current) {
      textRef.current?.measureLayout(
        textContainerRef.current,
        (left, top, width, height) => {
          setMeasure({left, top, width, height});
        },
        () => {
          console.error('测量失败');
        },
      );
    }
  }, [measure]);

  return (
    <View style={styles.container}>
      <View ref={textContainerRef} style={styles.textContainer}>
        <Text ref={textRef}>我在哪里？（相对于文本容器）</Text>
      </View>
      <Text style={styles.measure}>{JSON.stringify(measure)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  textContainer: {
    backgroundColor: '#61dafb',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  measure: {
    textAlign: 'center',
    padding: 12,
  },
});

export default App;
```

</TabItem>
</Tabs>

### focus()

请求给定输入框或视图获得焦点。触发的具体行为取决于平台和视图类型。

### blur()

移除输入框或视图的焦点。这与 `focus()` 相反。
