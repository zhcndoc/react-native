---
id: handling-text-input
title: 处理文本输入
---

[`TextInput`](textinput#content) 是一个 [核心组件](intro-react-native-components)，它允许用户输入文本。它有一个 `onChangeText` 属性，接受一个函数，每当文本发生变化时都会被调用；还有一个 `onSubmitEditing` 属性，接受一个函数，当文本提交时会被调用。

例如，假设用户在输入时，你正在把他们的话翻译成另一种语言。在这种新语言中，每个单词的写法都一样：🍕。所以句子 "Hello there Bob" 会被翻译成 "🍕 🍕 🍕"。

```SnackPlayer name=Handling%20Text%20Input
import {useState} from 'react';
import {Text, TextInput, View} from 'react-native';

const PizzaTranslator = () => {
  const [text, setText] = useState('');
  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      <TextInput
        placeholder="在这里输入以进行翻译！"
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

关于文本输入，你还可能想做很多其他事情。例如，你可以在用户输入时验证文本。更多详细示例，请参阅 [React 关于受控组件的文档](https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable)，或 [TextInput 的参考文档](textinput.md)。

`TextInput` 是用户与你的应用交互的众多方式之一。关于处理其他输入方式的示例，请参阅 [如何处理触摸](handling-touches.md) 文档。

现在，让我们来看看另一个核心组件 [ScrollView](using-a-scrollview)。
