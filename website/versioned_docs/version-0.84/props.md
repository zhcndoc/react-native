---
id: props
title: 属性（Props）
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

大多数组件可以在创建时通过不同的参数进行自定义。这些创建时传入的参数称为 `props`，即属性的缩写。

例如，一个基本的 React Native 组件是 `Image`。当你创建一个图片时，可以使用一个名为 `source` 的 prop 来控制显示哪张图片。

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

注意 `{pic}` 两侧的花括号——它们将变量 `pic` 嵌入到了 JSX 里。你可以在 JSX 的花括号中放入任意的 JavaScript 表达式。

你自己的组件也可以使用 `props`。这允许你创建一个单一组件，在应用的多个不同地方使用，并通过 `props` 在每个地方传递略有不同的属性。下面是一个例子：

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

使用 `name` 作为 prop 让我们可以定制 `Greeting` 组件，从而在每个问候中复用该组件。这个例子同样展示了如何在 JSX 中使用 `Greeting` 组件，类似于 [核心组件](intro-react-native-components) 一节。React 之所以这么强大，就是因为你可以创建、组合新的 UI 基元组件。

这里新出现的另一个组件是 [`View`](view.md)。[`View`](view.md) 常用作其他组件的容器，方便控制样式和布局。

通过 `props` 以及基础的 [`Text`](text.md)、[`Image`](image.md) 和 [`View`](view.md) 组件，你可以构建各种静态界面。要学习如何让应用随时间变化，你需要了解 [状态（State）](state.md)。