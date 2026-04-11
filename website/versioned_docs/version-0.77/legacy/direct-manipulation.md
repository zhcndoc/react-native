---
id: direct-manipulation
title: 直接操作
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

有时有必要直接更改组件，而不使用 state/props 来触发整个子树的重渲染。例如，在浏览器中使用 React 时，你有时需要直接修改 DOM 节点，移动应用中的视图也是如此。`setNativeProps` 相当于在 DOM 节点上直接设置属性，是 React Native 中的等价物。

:::caution
当频繁重渲染造成性能瓶颈时，请使用 `setNativeProps`！

直接操作不会是你经常使用的工具。你通常只会用它来创建连续动画，以避免渲染组件层次结构和协调许多视图的开销。
`setNativeProps` 是命令式的，并将状态存储在原生层（DOM、UIView 等）中，而不是在你的 React 组件内，这使得你的代码更难推理。

在使用它之前，尝试用 `setState` 和 [`shouldComponentUpdate`](https://react.dev/reference/react/Component#shouldcomponentupdate) 解决问题。
:::

## 使用 TouchableOpacity 的 setNativeProps

[TouchableOpacity](https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/Components/Touchable/TouchableOpacity.js) 内部使用 `setNativeProps` 来更新其子组件的不透明度：

```tsx
const viewRef = useRef<View>();
const setOpacityTo = useCallback(value => {
  // 省略：动画相关代码
  viewRef.current.setNativeProps({
    opacity: value,
  });
}, []);
```

这允许我们编写以下代码，并知道子组件的不透明度会响应点击而更新，而子组件无需知晓该事实或需要任何实现更改：

```tsx
<TouchableOpacity onPress={handlePress}>
  <View>
    <Text>Press me!</Text>
  </View>
</TouchableOpacity>
```

让我们想象一下 `setNativeProps` 不可用。在这种限制下，我们实现它的一种方法是将不透明度值存储在 state 中，然后在每次触发 `onPress` 时更新该值：

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

与原始示例相比，这在计算上更密集 - React 需要每次不透明度更改时重新渲染组件层次结构，即使视图及其子组件的其他属性未更改。通常这种开销不是问题，但在执行连续动画和响应手势时，明智地优化你的组件可以提高动画的保真度。

如果你查看 [NativeMethodsMixin](https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/Renderer/implementations/ReactNativeRenderer-prod.js) 中 `setNativeProps` 的实现，你会注意到它是 `RCTUIManager.updateView` 的包装器 - 这与重新渲染产生的函数调用完全相同 - 参见 [ReactNativeBaseComponent 中的 receiveComponent](https://github.com/facebook/react-native/blob/fb2ec1ea47c53c2e7b873acb1cb46192ac74274e/Libraries/Renderer/oss/ReactNativeRenderer-prod.js#L5793-L5813)。

## 复合组件和 setNativeProps

复合组件没有原生视图支持，因此你不能在它们身上调用 `setNativeProps`。考虑这个例子：

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer name=setNativeProps%20with%20Composite%20Components&ext=js
import React from 'react';
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
import React from 'react';
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

如果你运行这个，你会立即看到此错误：`Touchable child must either be native or forward setNativeProps to a native component`。这是因为 `MyButton` 没有直接由需要设置不透明度的原生视图支持。你可以这样想：如果你用 `createReactClass` 定义一个组件，你不会期望能在它身上设置 style prop 并使其生效 - 你需要将 style prop 传递给子组件，除非你包裹的是一个原生组件。同样，我们将把 `setNativeProps` 转发给原生支持的子组件。

#### 将 setNativeProps 转发给子组件

由于 `setNativeProps` 方法存在于任何 `View` 组件的 ref 上，因此足以将自定义组件上的 ref 转发到它渲染的其中一个 `<View />` 组件。这意味着在自定义组件上调用 `setNativeProps` 的效果与在被包裹的 `View` 组件本身上调用 `setNativeProps` 相同。

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer name=Forwarding%20setNativeProps&ext=js
import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

const MyButton = React.forwardRef((props, ref) => (
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
import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

const MyButton = React.forwardRef<View, {label: string}>((props, ref) => (
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

你现在可以在 `TouchableOpacity` 内部使用 `MyButton` 了！

你可能已经注意到我们使用 `{...props}` 将所有 props 传递给了子视图。这是因为 `TouchableOpacity` 实际上是一个复合组件，因此除了依赖其子组件上的 `setNativeProps` 外，它还要求子组件执行触摸处理。为此，它传递了 [各种 props](view.md#onmoveshouldsetresponder) 回调到 `TouchableOpacity` 组件。相比之下，`TouchableHighlight` 由原生视图支持，只要求我们实现 `setNativeProps`。

## 使用 setNativeProps 编辑 TextInput 值

另一个非常常见的 `setNativeProps` 用例是编辑 TextInput 的值。当 `bufferDelay` 较低且用户输入非常快时，TextInput 的 `controlled` 属性有时可能会丢失字符。一些开发者倾向于完全跳过此属性，而是在必要时使用 `setNativeProps` 直接操作 TextInput 值。例如，以下代码演示了点击按钮时编辑输入：

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer name=Clear%20text&ext=js
import React from 'react';
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
import React from 'react';
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

你可以使用 [`clear`](../textinput#clear) 方法来清除 `TextInput`，它使用相同的方法清除当前输入文本。

## 避免与渲染函数冲突

如果你更新了一个也由渲染函数管理的属性，你可能会遇到一些不可预测和令人困惑的错误，因为每当组件重新渲染且该属性更改时，之前通过 `setNativeProps` 设置的任何值都将被完全忽略和覆盖。

## setNativeProps & shouldComponentUpdate

通过 [智能地应用 `shouldComponentUpdate`](https://react.dev/reference/react/Component#shouldcomponentupdate) 你可以避免协调未更改组件子树所带来的不必要开销，以至于性能足够好，可以使用 `setState` 而不是 `setNativeProps`。

## 其他原生方法

此处描述的方法适用于 React Native 提供的大多数默认组件。但是请注意，它们 _不_ 适用于没有直接由原生视图支持的复合组件。这通常包括你在自己的应用中定义的大多数组件。

### measure(callback)

确定给定视图在视口中的屏幕位置、宽度和高度，并通过异步回调返回这些值。如果成功，回调将通过以下参数被调用：

- x
- y
- width
- height
- pageX
- pageY

请注意，这些测量数据直到原生渲染完成后才可用。如果你需要尽快获取测量数据且不需要 `pageX` 和 `pageY`，请考虑改用 [`onLayout`](view.md#onlayout) 属性。

此外，`measure()` 返回的宽度和高度是组件在视口中的宽度和高度。如果你需要组件的实际尺寸，请考虑改用 [`onLayout`](view.md#onlayout) 属性。

### measureInWindow(callback)

确定给定视图在窗口中的位置，并通过异步回调返回这些值。如果 React 根视图嵌入在另一个原生视图中，这将为你提供绝对坐标。如果成功，回调将通过以下参数被调用：

- x
- y
- width
- height

### measureLayout(relativeToNativeComponentRef, onSuccess, onFail)

类似于 `measure()`，但相对于祖先视图测量给定视图，祖先视图通过 `relativeToNativeComponentRef` 引用来指定。这意味着返回的坐标是相对于祖先视图原点 `x`, `y` 的。

:::note
此方法也可以使用 `relativeToNativeNode` 处理程序（而不是引用）来调用，但此变体在新架构中已过时。
:::

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer name=measureLayout%20example&supportedPlatforms=android,ios&ext=js
import React, {useEffect, useRef, useState} from 'react';
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
import React, {useEffect, useRef, useState} from 'react';
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

请求给定输入或视图的焦点。触发的确切行为将取决于平台和视图类型。

### blur()

移除输入或视图的焦点。这与 `focus()` 相反。
