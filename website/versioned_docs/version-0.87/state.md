---
id: state
title: 状态
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

控制组件的数据有两种类型：`props` 和 `state`。`props` 由父组件设置，并且在组件的整个生命周期内都是固定的。对于会发生变化的数据，我们必须使用 `state`。

通常，你应该在构造函数中初始化 `state`，然后在想要修改它时调用 `setState`。

例如，假设我们想要让文本一直闪烁。文本本身在闪烁组件创建时设置一次，因此文本本身是一个 `prop`。而“文本当前是显示还是隐藏”会随时间变化，因此应该将其保存在 `state` 中。

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

在真实应用中，你可能不会使用计时器来设置 state。当你从服务器获取新数据或接收到用户输入时，可能会设置 state。你也可以使用 [Redux](https://redux.js.org/) 或 [MobX](https://mobx.js.org/) 这样的状态容器来控制数据流。在这种情况下，你应该使用 Redux 或 MobX 来修改 state，而不是直接调用 `setState`。

调用 setState 时，BlinkApp 会重新渲染其组件。通过在计时器中调用 setState，组件会在计时器每次计时结束时重新渲染。

State 的工作方式与在 React 中相同，因此如需详细了解如何处理 state，可以查看 [React.Component API](https://react.dev/reference/react/Component#setstate)。此时，你可能已经注意到，我们的大多数示例都使用默认的文本颜色。要自定义文本颜色，你需要[了解 Style](style.md)。
