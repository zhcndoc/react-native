---
id: state
title: 状态（State）
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

有两种类型的数据来控制一个组件：`props` 和 `state`。`props` 由父组件设置，并且在组件的整个生命周期中是固定的。对于会变化的数据，我们必须使用 `state`。

一般来说，你应该在构造函数中初始化 `state`，然后在想要改变它时调用 `setState`。

例如，假设我们想让文本一直闪烁。文本内容本身在闪烁组件被创建时设置一次，所以文本内容本身是一个 `prop`。“文本当前是否显示”会随着时间而变化，因此应保存在 `state` 中。

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer name=State&ext=js
import React, {useState, useEffect} from 'react';
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
import React, {useState, useEffect} from 'react';
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

在实际应用中，你可能不会用定时器来设置状态。你可能会在从服务器获取新数据或用户输入时设置状态。你也可以使用像 [Redux](https://redux.js.org/) 或 [MobX](https://mobx.js.org/) 这样的状态容器来控制你的数据流。在这种情况下，你会使用 Redux 或 MobX 来修改状态，而不是直接调用 `setState`。

当调用 setState 时，BlinkApp 会重新渲染其组件。通过在定时器内部调用 setState，组件会在定时器每次触发时重新渲染。

状态（state）的工作方式和 React 中一样，想了解状态处理的更多细节，你可以查看 [React.Component API](https://react.dev/reference/react/Component#setstate)。到这里，你可能已经注意到我们的示例大多使用了默认的文字颜色。要自定义文字颜色，你需要 [了解样式](style.md)。