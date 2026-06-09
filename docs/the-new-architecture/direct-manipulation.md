---
id: direct-manipulation-new-architecture
title: 直接操作
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

有时需要直接对组件进行更改，而不使用 state/props 来触发整个子树的重新渲染。比如在浏览器中使用 React 时，有时需要直接修改一个 DOM 节点，移动应用中的视图也是如此。`setNativeProps` 相当于在 React Native 中直接设置 DOM 节点属性。

:::caution
当频繁重新渲染造成性能瓶颈时，请使用 `setNativeProps`！

直接操作并不是你会经常使用的工具。它通常只会用于创建连续动画，以避免渲染组件层级和协调多个视图所带来的开销。
`setNativeProps` 是命令式的，并且将状态存储在原生层（DOM、UIView 等）中，而不是存储在你的 React 组件内，这会让代码更难以推理。

在使用它之前，先尝试用 `setState` 和 [`shouldComponentUpdate`](https://react.dev/reference/react/Component#shouldcomponentupdate) 来解决问题。
:::

## 使用 setNativeProps 编辑 TextInput 的值

`setNativeProps` 另一个非常常见的使用场景是编辑 TextInput 的值。TextInput 的 `controlled` 属性在 `bufferDelay` 较低且用户输入非常快时，有时会丢失字符。一些开发者更倾向于完全跳过这个属性，而是在必要时使用 `setNativeProps` 直接操作 TextInput 的值。

例如，下面的代码演示了在你点击按钮时编辑输入框：

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
    inputRef.current.setNativeProps({text: 'Edited Text'});
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
    inputRef.current?.setNativeProps({text: 'Edited Text'});
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

你可以使用 [`clear`](../textinput#clear) 方法来清空 `TextInput`，这会使用相同的方法清除当前输入文本。

## 避免与 render 函数冲突

如果你更新了一个也由 render 函数管理的属性，可能会导致一些不可预测且令人困惑的 bug，因为每当组件重新渲染且该属性发生变化时，之前通过 `setNativeProps` 设置的任何值都会被完全忽略并覆盖。
