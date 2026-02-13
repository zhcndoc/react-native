---
id: handling-text-input
title: 处理文本输入
---

[`TextInput`](textinput#content) 是一个允许用户输入文本的 [核心组件](intro-react-native-components)。它有一个 `onChangeText` 属性，接收一个在文本每次变化时调用的函数，还有一个 `onSubmitEditing` 属性，接收一个在文本提交时调用的函数。

例如，假设用户输入时，你正在把他们的文字翻译成另一种语言。在这门新语言中，每个单词的写法都相同：🍕。所以句子 "Hello there Bob" 会被翻译成 "🍕 🍕 🍕"。

```SnackPlayer name=Handling%20Text%20Input
import React, {useState} from 'react';
import {Text, TextInput, View} from 'react-native';

const PizzaTranslator = () => {
  const [text, setText] = useState('');
  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      <TextInput
        placeholder="Type here to translate!"
        onChangeText={newText => setText(newText)}
        defaultValue={text}
        style={{
          height: 40,
          padding: 5,
          marginHorizontal: 8,
          borderWidth: 1,
        }}
      />
      <Text style={{padding: 10, fontSize: 42}}>
        {text
          .split(' ')
          .map(word => word && '🍕')
          .join(' ')}
      </Text>
    </View>
  );
};

export default PizzaTranslator;
```

在这个例子中，我们将 `text` 存储在状态中，因为它会随着时间变化。

你可能还会想对文本输入做更多操作。例如，可以在用户输入时验证文本。更多详细示例，请参考 [React 官网关于受控组件的文档](https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable)，或者查看 [TextInput 的参考文档](textinput.md)。

`TextInput` 是多种用户与应用交互方式中的一种。关于处理输入的其他方式示例，请参见有关 [如何处理触摸](handling-touches.md) 的文档。

现在，让我们来看一下另一个核心组件 [ScrollView](using-a-scrollview)。