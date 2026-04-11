---
id: direct-manipulation
title: 直接操作
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

有时需要直接更改组件，而不使用 state/props 来触发整个子树的重新渲染。例如，在浏览器中使用 React 时，有时需要直接修改一个 DOM 节点，移动应用中的视图也一样。`setNativeProps` 是 React Native 中直接设置原生视图属性的等价物。

:::caution
当频繁重新渲染导致性能瓶颈时，请使用 `setNativeProps`！

直接操作不会是你经常使用的工具。你通常只会在创建连续动画时使用它，以避免渲染组件层级和协调多个视图的开销。
`setNativeProps` 是命令式的，它将状态存储在原生层（DOM、UIView 等）而非 React 组件内，这会让你的代码更难理解。

在使用它之前，先尝试使用 `setState` 和 [`shouldComponentUpdate`](https://react.dev/reference/react/Component#shouldcomponentupdate) 来解决你的问题。
:::

## TouchableOpacity 中的 setNativeProps

[TouchableOpacity](https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/Components/Touchable/TouchableOpacity.js) 内部使用了 `setNativeProps` 来更新其子组件的不透明度：

```tsx
const viewRef = useRef<View>();
const setOpacityTo = useCallback(value => {
  // 省略：动画相关代码
  viewRef.current.setNativeProps({
    opacity: value,
  });
}, []);
```

这让我们能写出如下代码，并保证子组件会根据点击事件更新其不透明度，而子组件本身无需对此有任何感知或更改实现：

```tsx
<TouchableOpacity onPress={handlePress}>
  <View>
    <Text>Press me!</Text>
  </View>
</TouchableOpacity>
```

假如没有 `setNativeProps`，实现方式可能是将不透明度保存到 state 中，然后在 `onPress` 触发时更新：

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

相比原例，这种做法计算开销更大——每次不透明度变更时，React 都需重新渲染组件层级，尽管视图及其子视图的其它属性未变。通常这类开销无关紧要，但在执行连续动画和响应手势时，精细优化组件可提升动画的流畅度。

查看 [NativeMethodsMixin](https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/Renderer/implementations/ReactNativeRenderer-prod.js) 中 `setNativeProps` 的实现，你会发现它是对 `RCTUIManager.updateView` 的封装——这正是重新渲染时调用的函数，参见 [ReactNativeBaseComponent 中的 receiveComponent](https://github.com/facebook/react-native/blob/fb2ec1ea47c53c2e7b873acb1cb46192ac74274e/Libraries/Renderer/oss/ReactNativeRenderer-prod.js#L5793-L5813)。

## 复合组件与 setNativeProps

复合组件没有对应的原生视图，因此你不能在它们上调用 `setNativeProps`。例如：

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

运行后会看到错误：`Touchable 子组件必须是原生组件，或者将 setNativeProps 转发给原生组件`。这是因为 `MyButton` 并非直接对应一个应被设置不透明度的原生视图。你可以这样理解：如果用 `createReactClass` 创建一个组件，你不会希望直接设置样式属性生效——你需要将样式属性传递给其子组件，除非你包裹了一个原生组件。同理，我们要将 `setNativeProps` 传递给一个原生支持的子组件。

#### 将 setNativeProps 转发给子组件

由于 `setNativeProps` 方法存在于对 `View` 的 ref 引用上，把你自定义组件的 ref 转发给其渲染的 `<View />` 组件即可。这意味着调用自定义组件上的 `setNativeProps` 与调用该包装的 `View` 组件的 `setNativeProps` 效果相同。

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

这样你就可以在 `TouchableOpacity` 内使用 `MyButton` 了！

你可能注意到我们使用 `{...props}` 将所有属性传递给了子视图。这是因为 `TouchableOpacity` 实际上是一个复合组件，除了依赖子组件的 `setNativeProps`，它还要求子组件能够处理触摸事件。为此，它会传递 [各种属性](view.md#onmoveshouldsetresponder) 回调到 `TouchableOpacity`。相比之下，`TouchableHighlight` 是由原生视图支持的，仅需实现 `setNativeProps`。

## 使用 setNativeProps 编辑 TextInput 的值

另一个非常常见的使用场景是直接编辑 TextInput 的值。当 `TextInput` 处于“受控”状态时，如果 `bufferDelay` 较低且用户输入很快，有时会丢失字符。一些开发者倾向于完全跳过“受控”模式，而在必要时使用 `setNativeProps` 直接操作 TextInput 的值。下面示例展示了点击按钮时更新输入框内容：

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

你也可以用 [`clear`](../textinput#clear) 方法清空 `TextInput`，它采用了相同的方案。

## 避免与渲染函数的冲突

如果你更新了由渲染函数管理的属性，可能会产生不可预测且令人困惑的 Bug。因为每当组件重新渲染且该属性改变时，之前通过 `setNativeProps` 设置的值会被完全忽略和覆盖。

## setNativeProps 与 shouldComponentUpdate

通过 [智能地应用 `shouldComponentUpdate`](https://react.dev/reference/react/Component#shouldcomponentupdate)，你可以避免对未改变的组件子树进行不必要的协调开销，甚至可以使使用 `setState` 代替 `setNativeProps` 变得性能足够良好。

## 其他原生方法

这里描述的方法大多数 React Native 默认组件都支持。但请注意，它们**不**适用于没有直接对应原生视图的复合组件。这通常涵盖你在自己的应用中定义的大部分组件。

### measure(callback)

确定给定视图在屏幕上的位置、宽度和高度，并通过异步回调返回。如果成功，回调会被调用，参数如下：

- x
- y
- width
- height
- pageX
- pageY

注意，这些测量结果只有在原生渲染完成后才可用。如果你需要尽快获得测量值，且不需要 `pageX` 和 `pageY`，可以考虑改用 [`onLayout`](view.md#onlayout) 属性。

另外，`measure()` 返回的宽度和高度是视口中的尺寸。如需组件的实际大小，也建议使用 [`onLayout`](view.md#onlayout) 属性。

### measureInWindow(callback)

确定给定视图在窗口中的位置，并通过异步回调返回。如果 React 根视图嵌套在另一个原生视图中，该方法会返回绝对坐标。如果成功，回调会被调用，参数如下：

- x
- y
- width
- height

### measureLayout(relativeToNativeComponentRef, onSuccess, onFail)

类似 `measure()`，但测量值是相对于祖先视图——由 `relativeToNativeComponentRef` 指定。即返回的坐标是相对于祖先视图的原点 `(x, y)`。

:::note
此方法也可以传入 `relativeToNativeNode`（而非引用），不过此用法在新架构下已废弃。
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

请求为指定的输入框或视图获取焦点。具体行为取决于平台和视图类型。

### blur()

移除输入框或视图的焦点。与 `focus()` 相反。