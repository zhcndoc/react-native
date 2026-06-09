---
id: direct-manipulation
title: 直接操作
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

有时需要在不使用 state/props 触发整个子树重新渲染的情况下，直接对组件进行更改。例如，在浏览器中使用 React 时，你有时需要直接修改某个 DOM 节点，移动应用中的视图也是如此。`setNativeProps` 是 React Native 中相当于直接设置 DOM 节点属性的方法。

:::caution
当频繁重新渲染会造成性能瓶颈时，请使用 `setNativeProps`！

直接操作并不是你会经常使用的工具。通常只有在创建连续动画时才会用到它，以避免渲染组件层次结构和协调大量视图所带来的开销。
`setNativeProps` 是命令式的，并且会将状态存储在原生层（DOM、UIView 等）中，而不是存储在你的 React 组件内部，这会让代码更难以推理。

在使用它之前，先尝试用 `setState` 和 [`shouldComponentUpdate`](https://react.dev/reference/react/Component#shouldcomponentupdate) 来解决问题。
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

这样我们就可以编写下面的代码，并且知道子组件会在点击时更新其透明度，而子组件本身无需知道这一点，也不需要对其实现做任何修改：

```tsx
<TouchableOpacity onPress={handlePress}>
  <View>
    <Text>按我！</Text>
  </View>
</TouchableOpacity>
```

假设 `setNativeProps` 不可用。受此限制，我们可能会用一种方式来实现：将透明度值存储在状态中，然后在 `onPress` 触发时更新该值：

```tsx
const [buttonOpacity, setButtonOpacity] = useState(1);
return (
  <TouchableOpacity
    onPressIn={() => setButtonOpacity(0.5)}
    onPressOut={() => setButtonOpacity(1)}>
    <View style={{opacity: buttonOpacity}}>
      <Text>按我！</Text>
    </View>
  </TouchableOpacity>
);
```

与原始示例相比，这样做的计算开销更大——即使视图及其子元素的其他属性没有变化，React 也需要在每次透明度变化时重新渲染组件层次结构。通常这种开销并不是问题，但在执行连续动画和响应手势时，审慎地优化组件可以提升动画的保真度。

如果你查看 [NativeMethodsMixin](https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/Renderer/implementations/ReactNativeRenderer-prod.js) 中 `setNativeProps` 的实现，你会注意到它只是对 `RCTUIManager.updateView` 的一层封装——这与重新渲染后产生的函数调用完全相同——参见 [ReactNativeBaseComponent 中的 receiveComponent](https://github.com/facebook/react-native/blob/fb2ec1ea47c53c2e7b873acb1cb46192ac74274e/Libraries/Renderer/oss/ReactNativeRenderer-prod.js#L5793-L5813)。

## 复合组件与 setNativeProps

复合组件并不由原生视图支撑，因此不能在它们上面调用 `setNativeProps`。请看下面这个例子：

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
    <MyButton label="Press me!" />
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
    <MyButton label="Press me!" />
  </TouchableOpacity>
);

export default App;
```

</TabItem>
</Tabs>

如果你运行这段代码，你会立刻看到这个错误：`Touchable child must either be native or forward setNativeProps to a native component`。之所以会这样，是因为 `MyButton` 并不是直接由一个原生视图支撑，而该视图的透明度应当被设置。你可以这样理解：如果你用 `createReactClass` 定义了一个组件，你不会期望能直接给它设置一个 style 属性并让它生效——除非你包装的是一个原生组件，否则你需要把 style 属性传递给子组件。同理，我们将把 `setNativeProps` 转发给一个由原生视图支撑的子组件。

#### 将 setNativeProps 转发给子组件

由于 `setNativeProps` 方法存在于任何指向 `View` 组件的 ref 上，因此只需在你的自定义组件中将 ref 转发到它渲染的某个 `<View />` 组件即可。这意味着，对自定义组件调用 `setNativeProps` 会产生与直接对被包装的 `View` 组件调用 `setNativeProps` 相同的效果。

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
    <MyButton label="Press me!" />
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
    <MyButton label="Press me!" />
  </TouchableOpacity>
);

export default App;
```

</TabItem>
</Tabs>

现在你就可以在 `TouchableOpacity` 内使用 `MyButton` 了！

你可能已经注意到，我们通过 `{...props}` 将所有 props 传递给了子视图。这样做的原因是 `TouchableOpacity` 实际上是一个复合组件，因此除了依赖其子组件上的 `setNativeProps` 之外，它还要求子组件执行触摸处理。为此，它会传递一些[各种 props](view.md#onmoveshouldsetresponder)，这些 props 会回调到 `TouchableOpacity` 组件。相比之下，`TouchableHighlight` 是由原生视图支撑的，只需要我们实现 `setNativeProps`。

## 使用 setNativeProps 编辑 TextInput 的值

`setNativeProps` 另一个非常常见的用例是编辑 TextInput 的值。TextInput 的 `controlled` prop 在 `bufferDelay` 较低且用户输入非常快时，有时会丢失字符。有些开发者更愿意完全跳过这个 prop，而是在必要时直接使用 `setNativeProps` 来操作 TextInput 的值。例如，下面的代码演示了在你点击按钮时编辑输入框：

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
    inputRef.current.setNativeProps({text: '编辑后的文本'});
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
    inputRef.current?.setNativeProps({text: '编辑后的文本'});
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

你可以使用 [`clear`](../textinput#clear) 方法来清空 `TextInput`，它会以相同的方式清除当前输入文本。

## 避免与渲染函数冲突

如果你更新了一个同样由渲染函数管理的属性，可能会引发一些不可预测且令人困惑的 bug，因为组件每次重新渲染并且该属性发生变化时，之前通过 `setNativeProps` 设置的任何值都会被完全忽略并覆盖。

## `setNativeProps` 与 `shouldComponentUpdate`

通过[智能地应用 `shouldComponentUpdate`](https://react.dev/reference/react/Component#shouldcomponentupdate)，你可以避免在协调未更改的组件子树时产生不必要的开销，甚至在性能足够好的情况下改用 `setState` 而不是 `setNativeProps`。

## 其他原生方法

这里描述的方法适用于 React Native 提供的大多数默认组件。不过请注意，它们**不**适用于那些没有直接由原生视图支持的复合组件。这通常包括你在自己的应用中定义的大多数组件。

### `measure(callback)`

确定给定视图在屏幕上的位置，以及其在视口中的宽度和高度，并通过异步回调返回这些值。如果成功，回调将使用以下参数调用：

- x
- y
- width
- height
- pageX
- pageY

请注意，这些测量值要等到原生端完成渲染后才可用。如果你希望尽快获取测量值，并且不需要 `pageX` 和 `pageY`，可以考虑改用 [`onLayout`](view.md#onlayout) 属性。

另外，`measure()` 返回的宽度和高度是组件在视口中的宽度和高度。如果你需要组件的实际尺寸，可以考虑改用 [`onLayout`](view.md#onlayout) 属性。

### `measureInWindow(callback)`

确定给定视图在窗口中的位置，并通过异步回调返回这些值。如果 React 根视图嵌入在另一个原生视图中，这将给出绝对坐标。如果成功，回调将使用以下参数调用：

- x
- y
- width
- height

### `measureLayout(relativeToNativeComponentRef, onSuccess, onFail)`

与 `measure()` 类似，但会相对于通过 `relativeToNativeComponentRef` 引用指定的某个祖先来测量视图。这意味着返回的坐标是相对于祖先视图原点 `x`、`y` 的。

:::note
此方法也可以使用 `relativeToNativeNode` 处理器（而不是引用）来调用，但在新架构中，这个变体已过时。
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
          console.error('measurement failed');
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

### `focus()`

请求给定输入框或视图获得焦点。触发的具体行为取决于平台和视图类型。

### `blur()`

移除输入框或视图的焦点。这是 `focus()` 的反向操作。
