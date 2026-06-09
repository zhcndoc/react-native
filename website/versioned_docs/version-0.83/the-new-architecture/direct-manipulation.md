---
id: direct-manipulation-new-architecture
title: 直接操作
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

有时需要直接更改组件，而无需使用 state/props 来触发整个子树的重新渲染。例如，在浏览器中使用 React 时，有时需要直接修改 DOM 节点，移动应用中的视图也是如此。`setNativeProps` 是 React Native 中直接设置 DOM 节点属性的等价方法。

:::caution
当频繁重新渲染导致性能瓶颈时，请使用 `setNativeProps`！

直接操作并不是你经常会用到的工具。你通常只会在创建连续动画时使用它，以避免渲染组件层次结构和协调多个视图的开销。
`setNativeProps` 是命令式的，并且在本地层（DOM、UIView 等）存储状态，而不在你的 React 组件中，这会使你的代码更难理解。

在使用之前，先尝试使用 `setState` 和 [`shouldComponentUpdate`](https://react.dev/reference/react/Component#shouldcomponentupdate) 来解决你的问题。
:::

## 使用 setNativeProps 编辑 TextInput 的值

`setNativeProps` 的另一个非常常见的用例是编辑 TextInput 的值。当 TextInput 的 `controlled` 属性的 `bufferDelay` 很低且用户输入非常快时，有时会丢失字符。一些开发者更倾向于完全跳过该属性，改为在必要时直接使用 `setNativeProps` 来操作 TextInput 的值。

例如，下面的代码演示了在点击按钮时编辑输入框内容：

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer name=setNativeProps%20on%20TextInput&ext=js
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

你也可以使用 [`clear`](../textinput#clear) 方法清除 `TextInput`，该方法采用相同的方式清除当前输入文本。

## 避免与 render 函数冲突

如果你更新了一个同时也由 render 函数管理的属性，可能会遇到一些不可预测且令人困惑的错误，因为每当组件重新渲染且该属性发生变化时，之前通过 `setNativeProps` 设置的值会被完全忽略并被覆盖。