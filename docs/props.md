---
id: props
title: Props
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

大多数组件在创建时都可以通过不同的参数进行自定义。这些创建时传入的参数称为 `props`，是 properties 的缩写。

例如，一个基础的 React Native 组件是 `Image`。当你创建一张图片时，可以使用名为 `source` 的 prop 来控制它显示什么图片。

```SnackPlayer name=Props
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

注意包围 `{pic}` 的大括号——它们将变量 `pic` 嵌入到 JSX 中。你可以在 JSX 的大括号里放入任何 JavaScript 表达式。

你自己的组件也可以使用 `props`。这使你可以创建一个单独的组件，并在应用的许多不同位置使用它，只需通过在 `render` 函数中引用 `props`，就能让每个位置拥有略有不同的属性。下面是一个例子：

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer name=Props&ext=js
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

使用 `name` 作为 prop 可以让我们自定义 `Greeting` 组件，这样就能在每个问候语中复用这个组件。这个示例还在 JSX 中使用了 `Greeting` 组件，类似于 [Core Components](intro-react-native-components)。能够做到这一点正是 React 如此出色的原因——如果你发现自己希望拥有一组不同的 UI 基元来使用，你可以发明新的。

这里另一个新出现的内容是 [`View`](view.md) 组件。[`View`](view.md) 很适合作为其他组件的容器，有助于控制样式和布局。

借助 `props` 以及基础的 [`Text`](text.md)、[`Image`](image.md) 和 [`View`](view.md) 组件，你可以构建各种各样的静态界面。要了解如何让你的应用随时间变化，你需要[了解 State](state.md)。
