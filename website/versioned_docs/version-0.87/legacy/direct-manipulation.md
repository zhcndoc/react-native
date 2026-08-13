---
id: direct-manipulation
title: 直接操作
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

有时需要直接对组件进行更改，而不使用 state/props 来触发整个子树的重新渲染。例如，在浏览器中使用 React 时，有时需要直接修改 DOM 节点，移动应用中的视图也是如此。`setNativeProps` 是 React Native 中直接设置 DOM 节点属性的等效方式。

:::caution
当频繁重新渲染造成性能瓶颈时，请使用 `setNativeProps`！

直接操作不会是你经常使用的工具。通常，你只会使用它来创建连续动画，以避免渲染组件层次结构并协调许多视图所带来的开销。
`setNativeProps` 是命令式的，并将状态存储在原生层（DOM、UIView 等）中，而不是存储在你的 React 组件内，这会使代码更难理解。

在使用它之前，请尝试通过 `setState` 和 [`shouldComponentUpdate`](https://react.dev/reference/react/Component#shouldcomponentupdate) 解决问题。
:::

## TouchableOpacity 中的 setNativeProps

[TouchableOpacity](https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/Components/Touchable/TouchableOpacity.js) 在内部使用 `setNativeProps` 来更新其子组件的不透明度：

```tsx
const viewRef = useRef<View>();
const setOpacityTo = useCallback(value => {
  // Redacted: animation related code
  viewRef.current.setNativeProps({
    opacity: value,
  });
}, []);
```

这使我们能够编写以下代码，并且可以确定子组件的不透明度会在点击后更新，而无需子组件知晓这一事实，也不需要对其实现进行任何更改：

```tsx
<TouchableOpacity onPress={handlePress}>
  <View>
    <Text>Press me!</Text>
  </View>
</TouchableOpacity>
```

假设 `setNativeProps` 不可用。在这种限制下，实现相同效果的一种方式是将不透明度值存储在状态中，然后在触发 `onPress` 时更新该值：

```tsx
const [buttonOpacity, setButtonOpacity] = useState(1);
return (
  <TouchableOpacity
    onPressIn={() => setButtonOpacity(0.5)}
    onPressOut={() => setButtonOpacity(1)}>
    <View style={{opacity: buttonOpacity}}>
      <Text>Press me!</Text>
    </View>
  </TouchableOpacity>
);
```

与原始示例相比，这种方式的计算开销更大——每次不透明度发生变化时，React 都需要重新渲染组件层次结构，即使视图及其子组件的其他属性并没有变化。通常，这种开销并不值得关注，但在执行连续动画和响应手势时，谨慎地优化组件可以提高动画的还原度。

如果查看 [NativeMethodsMixin](https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/Renderer/implementations/ReactNativeRenderer-prod.js) 中 `setNativeProps` 的实现，你会注意到它是 `RCTUIManager.updateView` 的包装器——这与重新渲染所产生的函数调用完全相同——请参阅 [ReactNativeBaseComponent 中的 receiveComponent](https://github.com/facebook/react-native/blob/fb2ec1ea47c53c2e7b873acb1cb46192ac74274e/Libraries/Renderer/oss/ReactNativeRenderer-prod.js#L5793-L5813)。

## 复合组件和 setNativeProps

复合组件并不是由原生视图支持的，因此你无法对它们调用 `setNativeProps`。请考虑以下示例：

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

运行这段代码后，你会立即看到以下错误：`Touchable child must either be native or forward setNativeProps to a native component`。这是因为 `MyButton` 并不是由应该设置其不透明度的原生视图直接支持的。你可以这样理解：如果你使用 `createReactClass` 定义一个组件，你不会期望能够在它上面设置 style 属性并使其生效——你需要将 style 属性传递给子组件，除非你包装的是一个原生组件。同样，我们需要将 `setNativeProps` 转发给由原生支持的子组件。

#### 将 setNativeProps 转发给子组件

由于 `setNativeProps` 方法存在于对 `View` 组件的任何 ref 上，因此只需将自定义组件的 ref 转发给它所渲染的某个 `<View />` 组件即可。这意味着，对自定义组件调用 `setNativeProps` 的效果，将与直接对被包装的 `View` 组件调用 `setNativeProps` 的效果相同。

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

现在你可以在 `TouchableOpacity` 中使用 `MyButton` 了！

你可能已经注意到，我们通过 `{...props}` 将所有 props 都传递给了子视图。这样做的原因是，`TouchableOpacity` 实际上是一个复合组件，因此除了依赖其子组件的 `setNativeProps` 外，它还要求子组件执行触摸处理。为此，它会传递[各种 props](view.md#onmoveshouldsetresponder)，这些 props 会回调 `TouchableOpacity` 组件。相比之下，`TouchableHighlight` 由原生视图支持，因此只需要实现 `setNativeProps`。

## 使用 setNativeProps 编辑 TextInput 值

`setNativeProps` 的另一个非常常见的使用场景是编辑 TextInput 的值。当 `bufferDelay` 较低且用户输入速度很快时，TextInput 的 `controlled` prop 有时会丢失字符。一些开发者更愿意完全跳过这个 prop，而是在必要时使用 `setNativeProps` 直接操作 TextInput 的值。例如，以下代码演示了点击按钮时编辑输入内容：

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
    inputRef.current.setNativeProps({text: 'Edited Text'});
  }, []);

  return (
    <View style={styles.container}>
      <TextInput ref={inputRef} style={styles.input} />
      <TouchableOpacity onPress={editText}>
        <Text>Edit text</Text>
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
    inputRef.current?.setNativeProps({text: 'Edited Text'});
  }, []);

  return (
    <View style={styles.container}>
      <TextInput ref={inputRef} style={styles.input} />
      <TouchableOpacity onPress={editText}>
        <Text>Edit text</Text>
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

你可以使用 [`clear`](../textinput#clear) 方法清除 `TextInput`，该方法会以相同的方式清除当前输入文本。

## 避免与渲染函数发生冲突

如果你更新了一个同时由渲染函数管理的属性，可能会遇到一些不可预测且令人困惑的错误，因为每当组件重新渲染且该属性发生变化时，之前通过 `setNativeProps` 设置的值都会被完全忽略并覆盖。

## setNativeProps 和 shouldComponentUpdate

通过[智能地应用 `shouldComponentUpdate`](https://react.dev/reference/react/Component#shouldcomponentupdate)，你可以避免协调未发生变化的组件子树所带来的不必要开销，甚至可能达到使用 `setState` 代替 `setNativeProps` 也能满足性能要求的程度。

## 其他原生方法

这里描述的方法在 React Native 提供的大多数默认组件上都可用。但请注意，它们不适用于不是由原生视图直接支持的复合组件。这通常包括你在自己的应用中定义的大多数组件。

### measure(callback)

确定给定视图在屏幕上的位置、宽度，以及其在视口中的高度，并通过异步回调返回这些值。如果成功，回调将接收以下参数：

- x
- y
- width
- height
- pageX
- pageY

请注意，在原生端完成渲染之前，这些测量值不可用。如果你需要尽快获取测量值，并且不需要 `pageX` 和 `pageY`，可以考虑改用 [`onLayout`](view.md#onlayout) 属性。

此外，`measure()` 返回的宽度和高度是组件在视口中的宽度和高度。如果你需要组件的实际尺寸，可以考虑改用 [`onLayout`](view.md#onlayout) 属性。

### measureInWindow(callback)

确定给定视图在窗口中的位置，并通过异步回调返回这些值。如果 React 根视图嵌入了另一个原生视图，这将返回绝对坐标。如果成功，回调将接收以下参数：

- x
- y
- width
- height

### measureLayout(relativeToNativeComponentRef, onSuccess, onFail)

与 `measure()` 类似，但会测量相对于某个祖先视图的视图，该祖先视图通过 `relativeToNativeComponentRef` 引用指定。这意味着返回的坐标是相对于祖先视图原点 `x`、`y` 的坐标。

:::note
此方法也可以使用 `relativeToNativeNode` 处理器调用（而不是引用），但在新架构中，此变体已过时
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
        <Text ref={textRef}>Where am I? (relative to the text container)</Text>
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
        <Text ref={textRef}>Where am I? (relative to the text container)</Text>
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

请求使给定的输入框或视图获得焦点。触发的具体行为取决于平台和视图类型。

### blur()

移除输入框或视图的焦点。这与 `focus()` 相反。
