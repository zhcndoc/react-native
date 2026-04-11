---
id: direct-manipulation-new-architecture
title: 直接操作
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

有时有必要直接对组件进行更改，而不使用 state/props 来触发整个子树的重新渲染。例如，当在浏览器中使用 React 时，有时需要直接修改 DOM 节点，移动应用中的视图也是如此。`setNativeProps` 是 React Native 中等价于直接在 DOM 节点上设置属性的方法。

:::caution
当频繁重新渲染造成性能瓶颈时，请使用 `setNativeProps`！

直接操作不会是你经常使用的工具。通常你只会用它来创建连续动画，以避免渲染组件层次结构和协调许多视图的开销。
`setNativeProps` 是命令式的，并将状态存储在本机层（DOM、UIView 等）中，而不是在你的 React 组件中，这使得你的代码更难推理。

在使用它之前，请尝试使用 `setState` 和 [`shouldComponentUpdate`](https://react.dev/reference/react/Component#shouldcomponentupdate) 来解决你的问题。
:::

## 使用 setNativeProps 编辑 TextInput 值

`setNativeProps` 的另一个非常常见的用例是编辑 TextInput 的值。当 `bufferDelay` 较低且用户输入非常快时，TextInput 的 `controlled` 属性有时会丢失字符。一些开发人员更喜欢完全跳过此属性，而是在必要时使用 `setNativeProps` 直接操作 TextInput 值。

例如，以下代码演示了点击按钮时编辑输入内容：

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer name=setNativeProps%20on%20TextInput&ext=js
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

如果你更新了一个也由渲染函数管理的属性，你可能会遇到一些不可预测且令人困惑的错误，因为每当组件重新渲染且该属性发生变化时，之前通过 `setNativeProps` 设置的任何值都将被完全忽略并覆盖。
