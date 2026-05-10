---
id: props
title: 属性
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

大多数组件在创建时都可以通过不同的参数进行自定义。这些创建时的参数称为 `props`，是 properties 的缩写。

例如，一个基本的 React Native 组件是 `Image`。当你创建一张图片时，可以使用名为 `source` 的 prop 来控制它显示什么图片。

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

注意包围 `{pic}` 的大括号——它们将变量 `pic` 嵌入到 JSX 中。你可以在 JSX 的大括号中放入任何 JavaScript 表达式。

你自己的组件也可以使用 `props`。这使你能够在应用的许多不同位置使用同一个组件，并通过在 `render` 函数中引用 `props`，让每个位置拥有略有不同的属性。下面是一个示例：

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

使用 `name` 作为 prop 可以让我们自定义 `Greeting` 组件，因此我们可以在每个问候语中复用这个组件。这个示例还在 JSX 中使用了 `Greeting` 组件，类似于 [核心组件](intro-react-native-components)。能够做到这一点正是 React 如此酷的原因——如果你发现自己希望拥有一组不同的 UI 基础组件来使用，你可以创造新的组件。

这里另外一个新的内容是 [`View`](view.md) 组件。[`View`](view.md) 作为其他组件的容器非常有用，可以帮助控制样式和布局。

借助 `props` 以及基础的 [`Text`](text.md)、[`Image`](image.md) 和 [`View`](view.md) 组件，你可以构建各种各样的静态界面。要了解如何让你的应用随时间变化，你需要[了解 State](state.md)。
