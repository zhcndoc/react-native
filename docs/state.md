---
id: state
title: 状态
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

控制组件的数据有两种类型：`props` 和 `state`。`props` 由父组件设置，并且在组件的整个生命周期内保持不变。对于会变化的数据，我们必须使用 `state`。

一般来说，你应该在构造函数中初始化 `state`，然后在想要更改它时调用 `setState`。

例如，假设我们想要制作一段会一直闪烁的文本。文本本身是在闪烁组件创建时设置一次的，所以文本本身是一个 `prop`。而“文本当前是显示还是隐藏”会随着时间变化，所以应该保存在 `state` 中。

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer name=State&ext=js
import {useState, useEffect} from 'react';
import {Text, View} from 'react-native';

const Blink = props => {
  const [isShowingText, setIsShowingText] = useState(true);

  useEffect(() => {
    const toggle = setInterval(() => {
      setIsShowingText(!isShowingText);
    }, 1000);

    return () => clearInterval(toggle);
  });

  if (!isShowingText) {
    return null;
  }

  return <Text>{props.text}</Text>;
};

const BlinkApp = () => {
  return (
    <View style={{marginTop: 50}}>
      <Blink text="I love to blink" />
      <Blink text="Yes blinking is so great" />
      <Blink text="Why did they ever take this out of HTML" />
      <Blink text="Look at me look at me look at me" />
    </View>
  );
};

export default BlinkApp;
```

</TabItem>
<TabItem value="typescript">

```SnackPlayer name=State&ext=tsx
import {useState, useEffect} from 'react';
import {Text, View} from 'react-native';

type BlinkProps = {
  text: string;
};

const Blink = (props: BlinkProps) => {
  const [isShowingText, setIsShowingText] = useState(true);

  useEffect(() => {
    const toggle = setInterval(() => {
      setIsShowingText(!isShowingText);
    }, 1000);

    return () => clearInterval(toggle);
  });

  if (!isShowingText) {
    return null;
  }

  return <Text>{props.text}</Text>;
};

const BlinkApp = () => {
  return (
    <View style={{marginTop: 50}}>
      <Blink text="I love to blink" />
      <Blink text="Yes blinking is so great" />
      <Blink text="Why did they ever take this out of HTML" />
      <Blink text="Look at me look at me look at me" />
    </View>
  );
};

export default BlinkApp;
```

</TabItem>
</Tabs>

在实际应用中，你大概不会用定时器来设置 state。你可能会在从服务器获取到新数据时，或者在用户输入时设置 state。你也可以使用像 [Redux](https://redux.js.org/) 或 [MobX](https://mobx.js.org/) 这样的状态容器来控制数据流。在这种情况下，你会使用 Redux 或 MobX 来修改 state，而不是直接调用 `setState`。

当调用 setState 时，BlinkApp 会重新渲染其组件。通过在 Timer 中调用 setState，组件会在每次 Timer 触发时重新渲染。

State 的工作方式与 React 中相同，因此有关处理 state 的更多细节，你可以查看 [React.Component API](https://react.dev/reference/react/Component#setstate)。到这一步，你可能已经注意到我们的大多数示例都使用默认的文本颜色。要自定义文本颜色，你需要[了解样式](style.md)。
