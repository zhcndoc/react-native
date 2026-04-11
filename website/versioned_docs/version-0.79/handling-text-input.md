---
id: handling-text-input
title: 处理文本输入
---

[`TextInput`](textinput#content) 是一个 [核心组件](intro-react-native-components)，允许用户输入文本。它有一个 `onChangeText` 属性，接受一个函数，每次文本更改时调用该函数；还有一个 `onSubmitEditing` 属性，接受一个函数，在文本提交时调用该函数。

例如，假设当用户输入时，你正在将他们的单词翻译成另一种语言。在这种新语言中，每个单词的写法都一样：🍕。所以句子 "Hello there Bob" 会被翻译成 "🍕 🍕 🍕"。

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

在这个示例中，我们将 `text` 存储在状态中，因为它会随时间变化。

对于文本输入，你可能还想做很多事情。例如，你可以在用户输入时验证其中的文本。有关更详细的示例，请参阅 [React 关于受控组件的文档](https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable)，或 [TextInput 的参考文档](textinput.md)。

文本输入是用户与应用程序交互的方式之一。接下来，让我们看看另一种输入类型，并 [学习如何处理触摸](handling-touches.md)。
