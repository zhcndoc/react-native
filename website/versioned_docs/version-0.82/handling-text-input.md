---
id: handling-text-input
title: 处理文本输入
---

[`TextInput`](textinput#content) 是一个 [核心组件](intro-react-native-components)，允许用户输入文本。它有一个 `onChangeText` 属性，每次文本发生变化时都会调用传入的函数，还有一个 `onSubmitEditing` 属性，在文本提交时调用传入的函数。

例如，假设用户在输入时，你正在把他们的话翻译成另一种语言。在这种新语言中，每个单词都以相同的方式书写：🍕。所以句子“Hello there Bob”会被翻译成“🍕 🍕 🍕”。

```SnackPlayer name=Handling%20Text%20Input
import {useState} from 'react';
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

在这个示例中，我们将 `text` 存储在状态中，因为它会随着时间变化。

你可能还想对文本输入执行许多其他操作。例如，你可以在用户输入时验证其中的文本。有关更详细的示例，请参阅 [React docs on controlled components](https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable) 或 [TextInput 的参考文档](textinput.md)。

`TextInput` 是用户与应用交互的多种方式之一。有关处理输入的其他方式示例，请参阅 [如何处理触摸](handling-touches.md) 的文档。

现在，让我们来看一下 [ScrollView](using-a-scrollview)，另一个核心组件。
