---
id: direct-manipulation-new-architecture
title: Direct Manipulation
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

Sometimes it is necessary to make changes to components directly, without using state/props to trigger a re-render of the entire subtree. For example, when using React in the browser, it is sometimes necessary to directly modify a DOM node, and the same is true for views in mobile apps. `setNativeProps` is equivalent to setting properties directly on a DOM node.

:::caution
Use `setNativeProps` when frequent re-renders cause a performance bottleneck!

Direct manipulation is not a tool you will use often. You will typically only use it to create continuous animations to avoid the overhead of rendering the component hierarchy and reconciling many views.
`setNativeProps` is imperative and stores state in the native layer (DOM, UIView, etc.) rather than in your React component, which makes your code harder to reason about.

Before using it, try solving your problem with `setState` and [`shouldComponentUpdate`](https://react.dev/reference/react/Component#shouldcomponentupdate).
:::

## Use setNativeProps to Edit TextInput Value

Another very common use case for `setNativeProps` is editing the value of a TextInput. When `bufferDelay` is low and user input is very fast, the `controlled` property of TextInput can sometimes lose characters. Some developers prefer to skip this property entirely and instead use `setNativeProps` to directly manipulate the TextInput value when needed.

For example, the following code demonstrates editing the input when you press a button:

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

You can use the [`clear`](../textinput#clear) method to clear a `TextInput`; it uses the same method to clear the current input text.

## Avoid Conflicts with the Render Function

If you update a property that is also managed by the render function, you may run into some unpredictable and confusing bugs, because whenever the component re-renders and that property changes, any value previously set through `setNativeProps` will be completely ignored and overwritten.
