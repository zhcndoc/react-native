---
id: props
title: Props
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

大多数组件在创建时可以使用不同的参数进行自定义。这些创建参数被称为 `props`，是 properties 的缩写。

例如，一个基本的 React Native 组件是 `Image`。当你创建图像时，你可以使用名为 `source` 的 prop 来控制它显示什么图像。

```SnackPlayer name=Props
import React from 'react';
import {Image} from 'react-native';

const Bananas = () => {
  let pic = {
    uri: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Bananavarieties.jpg',
  };
  return (
    <Image source={pic} style={{width: 193, height: 110, marginTop: 50}} />
  );
};

export default Bananas;
```

注意 `{pic}` 周围的大括号——这些将变量 `pic` 嵌入到 JSX 中。你可以在 JSX 的大括号内放入任何 JavaScript 表达式。

你自己的组件也可以使用 `props`。这让你可以创建一个组件，它在你的应用中的许多不同地方使用，并通过在 `render` 函数中引用 `props`，使每个地方具有略微不同的属性。这是一个示例：

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer name=Props&ext=js
import React from 'react';
import {Text, View} from 'react-native';

const Greeting = props => {
  return (
    <View style={{alignItems: 'center'}}>
      <Text>Hello {props.name}!</Text>
    </View>
  );
};

const LotsOfGreetings = () => {
  return (
    <View style={{alignItems: 'center', top: 50}}>
      <Greeting name="Rexxar" />
      <Greeting name="Jaina" />
      <Greeting name="Valeera" />
    </View>
  );
};

export default LotsOfGreetings;
```

</TabItem>
<TabItem value="typescript">

```SnackPlayer name=Props&ext=tsx
import React from 'react';
import {Text, View} from 'react-native';

type GreetingProps = {
  name: string;
};

const Greeting = (props: GreetingProps) => {
  return (
    <View style={{alignItems: 'center'}}>
      <Text>Hello {props.name}!</Text>
    </View>
  );
};

const LotsOfGreetings = () => {
  return (
    <View style={{alignItems: 'center', top: 50}}>
      <Greeting name="Rexxar" />
      <Greeting name="Jaina" />
      <Greeting name="Valeera" />
    </View>
  );
};

export default LotsOfGreetings;
```

</TabItem>
</Tabs>

使用 `name` 作为 prop 让我们可以自定义 `Greeting` 组件，因此我们可以为每个问候语重用该组件。此示例还在 JSX 中使用 `Greeting` 组件，类似于 [核心组件](intro-react-native-components)。能够做到这一点正是 React 如此酷的原因——如果你发现自己希望有一套不同的 UI 原语来使用，你可以发明新的。

这里出现的另一个新事物是 [`View`](view.md) 组件。[`View`](view.md) 可用作其他组件的容器，有助于控制样式和布局。

使用 `props` 以及基本的 [`Text`](text.md)、[`Image`](image.md) 和 [`View`](view.md) 组件，你可以构建各种各样的静态屏幕。要了解如何让你的应用随时间变化，你需要 [学习状态](state.md)。
