---
id: props
title: Props
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

大多数组件在创建时都可以通过不同的参数进行自定义。这些创建时传入的参数称为 `props`，是 properties 的缩写。

例如，一个基本的 React Native 组件是 `Image`。创建图像时，你可以使用名为 `source` 的 prop 来控制它显示的图像。

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

注意 `{pic}` 周围的花括号——它们会将变量 `pic` 嵌入 JSX 中。你可以在 JSX 的花括号内放入任何 JavaScript 表达式。

你自己的组件也可以使用 `props`。通过在 `render` 函数中引用 `props`，你可以创建一个组件，并在应用中的许多不同位置使用它，同时让它在每个位置拥有略有不同的属性。示例如下：

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

使用 `name` 作为 prop 可以让我们自定义 `Greeting` 组件，因此我们可以在每条问候语中重复使用这个组件。这个示例还在 JSX 中使用了 `Greeting` 组件，类似于[核心组件](intro-react-native-components)。正是这种能力让 React 如此酷——如果你希望使用一组不同的 UI 基元，那么你可以创造新的 UI 基元。

这里的另一个新内容是 [`View`](view.md) 组件。[`View`](view.md) 可以作为其他组件的容器，用于帮助控制样式和布局。

借助 `props` 以及基本的 [`Text`](text.md)、[`Image`](image.md) 和 [`View`](view.md) 组件，你可以构建各种各样的静态屏幕。要了解如何让应用随着时间的推移发生变化，你需要[了解状态](state.md)。
