---
id: intro-react
title: React 基础
description: 要完全理解 React Native，你需要坚实的 React 基础。这篇简短的 React 介绍可以帮助你入门或温故知新。
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

React Native 运行在 [React](https://react.dev/) 之上，这是一个用于使用 JavaScript 构建用户界面的流行开源库。为了充分利用 React Native，理解 React 本身会有所帮助。本节可以帮助你入门，也可以作为复习课程。

我们将涵盖 React 背后的核心概念：

- 组件
- JSX
- props
- state

如果你想深入挖掘，我们鼓励你查看 [React 的官方文档](https://react.dev/learn)。

## 你的第一个组件

这篇 React 介绍的其余部分将在示例中使用猫：友好、亲切的生物，它们需要名字和一个工作的咖啡馆。这是你的第一个 Cat 组件：

```SnackPlayer name=Your%20Cat
import {Text} from 'react-native';

const Cat = () => {
  return <Text>Hello, I am your cat!</Text>;
};

export default Cat;
```

Here is how you do it: To define your `Cat` component, first use JavaScript’s [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) to import React Native’s [`Text`](/docs/next/text) Core Component:

```tsx
import {Text} from 'react-native';
```

你的组件起初是一个函数：

```tsx
const Cat = () => {};
```

你可以将组件视为蓝图。函数组件返回的任何内容都会作为 **React 元素** 渲染。React 元素让你描述你想在屏幕上看到的内容。

此处 `Cat` 组件将渲染一个 `<Text>` 元素：

```tsx
const Cat = () => {
  return <Text>Hello, I am your cat!</Text>;
};
```

你可以使用 JavaScript 的 [`export default`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) 导出你的函数组件，以便在整个应用中使用，如下所示：

```tsx
const Cat = () => {
  return <Text>Hello, I am your cat!</Text>;
};

export default Cat;
```

:::tip
这是导出组件的多种方法之一。这种导出方式与 Snack Player 配合良好。但是，根据你的应用文件结构，你可能需要使用不同的约定。这份 [关于 JavaScript 导入和导出的便捷速查表](https://medium.com/dailyjs/javascript-module-cheatsheet-7bd474f1d829) 会有所帮助。
:::

现在仔细看看那个 `return` 语句。`<Text>Hello, I am your cat!</Text>` 使用了一种让编写元素变得方便的 JavaScript 语法：JSX。

## JSX

React 和 React Native 使用 **JSX**，这是一种允许你在 JavaScript 内部编写元素的语法，如下所示：`<Text>Hello, I am your cat!</Text>`。React 文档有一份 [关于 JSX 的综合指南](https://react.dev/learn/writing-markup-with-jsx)，你可以参考它以了解更多。因为 JSX 是 JavaScript，你可以在其中使用变量。这里你为猫声明了一个名字 `name`，并使用花括号将其嵌入到 `<Text>` 中。

```SnackPlayer name=Curly%20Braces
import {Text} from 'react-native';

const Cat = () => {
  const name = 'Maru';
  return <Text>Hello, I am {name}!</Text>;
};

export default Cat;
```

任何 JavaScript 表达式都可以在花括号之间工作，包括函数调用，如 `{getFullName("Rum", "Tum", "Tugger")}`：

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer name=Curly%20Braces&ext=js
import {Text} from 'react-native';

const getFullName = (firstName, secondName, thirdName) => {
  return firstName + ' ' + secondName + ' ' + thirdName;
};

const Cat = () => {
  return <Text>Hello, I am {getFullName('Rum', 'Tum', 'Tugger')}!</Text>;
};

export default Cat;
```

</TabItem>
<TabItem value="typescript">

```SnackPlayer name=Curly%20Braces&ext=tsx
import {Text} from 'react-native';

const getFullName = (
  firstName: string,
  secondName: string,
  thirdName: string,
) => {
  return firstName + ' ' + secondName + ' ' + thirdName;
};

const Cat = () => {
  return <Text>Hello, I am {getFullName('Rum', 'Tum', 'Tugger')}!</Text>;
};

export default Cat;
```

</TabItem>
</Tabs>

你可以将花括号视为创建一个进入 JSX 中 JS 功能的门户！

## 自定义组件

你已经见过 [React Native 的核心组件](intro-react-native-components)。React 允许你将这些组件相互嵌套以创建新组件。这些可嵌套、可重用的组件是 React 范式的核心。

例如，你可以在下面的 [`View`](view) 中嵌套 [`Text`](text) 和 [`TextInput`](textinput)，React Native 会将它们一起渲染：

```SnackPlayer name=Custom%20Components
import {Text, TextInput, View} from 'react-native';

const Cat = () => {
  return (
    <View>
      <Text>Hello, I am...</Text>
      <TextInput
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
        }}
        defaultValue="Name me!"
      />
    </View>
  );
};

export default Cat;
```

#### 开发者说明

<Tabs groupId="guide" queryString defaultValue="web" values={constants.getDevNotesTabs(["android", "web"])}>

<TabItem value="web">

:::info
如果你熟悉 Web 开发，`<View>` 和 `<Text>` 可能会让你想起 HTML！你可以将它们视为应用开发中的 `<div>` 和 `<p>` 标签。
:::

</TabItem>
<TabItem value="android">

:::info
在 Android 上，你通常将视图放在 `LinearLayout`、`FrameLayout`、`RelativeLayout` 等内部，以定义视图的子元素如何在屏幕上排列。在 React Native 中，`View` 使用 Flexbox 来进行子元素的布局。你可以在 [我们关于使用 Flexbox 布局的指南](flexbox) 中了解更多。
:::

</TabItem>
</Tabs>

你可以通过使用 `<Cat>` 多次渲染此组件并在多个地方渲染，而无需重复代码：

```SnackPlayer name=Multiple%20Components
import {Text, View} from 'react-native';

const Cat = () => {
  return (
    <View>
      <Text>I am also a cat!</Text>
    </View>
  );
};

const Cafe = () => {
  return (
    <View>
      <Text>Welcome!</Text>
      <Cat />
      <Cat />
      <Cat />
    </View>
  );
};

export default Cafe;
```

任何渲染其他组件的组件都是 **父组件。** 此处，`Cafe` 是父组件，每个 `Cat` 都是 **子组件。**

你可以在咖啡馆里放任意数量的猫。每个 `<Cat>` 渲染一个独特的元素——你可以使用 props 对其进行定制。

## Props

**Props** 是"properties"的缩写。Props 允许你定制 React 组件。例如，这里你传递每个 `<Cat>` 一个不同的 `name` 供 `Cat` 渲染：

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer name=Multiple%20Props&ext=js
import {Text, View} from 'react-native';

const Cat = props => {
  return (
    <View>
      <Text>Hello, I am {props.name}!</Text>
    </View>
  );
};

const Cafe = () => {
  return (
    <View>
      <Cat name="Maru" />
      <Cat name="Jellylorum" />
      <Cat name="Spot" />
    </View>
  );
};

export default Cafe;
```

</TabItem>
<TabItem value="typescript">

```SnackPlayer name=Multiple%20Props&ext=tsx
import {Text, View} from 'react-native';

type CatProps = {
  name: string;
};

const Cat = (props: CatProps) => {
  return (
    <View>
      <Text>Hello, I am {props.name}!</Text>
    </View>
  );
};

const Cafe = () => {
  return (
    <View>
      <Cat name="Maru" />
      <Cat name="Jellylorum" />
      <Cat name="Spot" />
    </View>
  );
};

export default Cafe;
```

</TabItem>
</Tabs>

大多数 React Native 的核心组件也可以用 props 定制。例如，当使用 [`Image`](image) 时，你传递一个名为 [`source`](image#source) 的 prop 来定义它显示什么图像：

```SnackPlayer name=Props
import {Text, View, Image} from 'react-native';

const CatApp = () => {
  return (
    <View>
      <Image
        source={{
          uri: 'https://reactnative.dev/docs/assets/p_cat1.png',
        }}
        style={{width: 200, height: 200}}
      />
      <Text>Hello, I am your cat!</Text>
    </View>
  );
};

export default CatApp;
```

`Image` 有 [许多不同的 props](image#props)，包括 [`style`](image#style)，它接受一个设计与布局相关的属性 - 值对的 JS 对象。

:::note
注意 `style` 的宽度和高度周围的双花括号 `{{ }}`。在 JSX 中，JavaScript 值使用 `{}` 引用。如果你传递的不是字符串而是其他内容作为 props，比如数组或数字，这很方便：`<Cat food={["fish", "kibble"]} age={2} />`。但是，JS 对象 **_也_** 用花括号表示：`{width: 200, height: 200}`。因此，要在 JSX 中传递 JS 对象，你必须将对象包裹在 **另一对** 花括号中：`{{width: 200, height: 200}}`
:::

你可以使用 props 和核心组件 [`Text`](text)、[`Image`](image) 和 [`View`](view) 构建许多东西！但要构建交互式的东西，你需要 state。

## State

虽然你可以将 props 视为用于配置组件渲染方式的参数，但 **state** 就像组件的个人数据存储。State 对于处理随时间变化的数据或来自用户交互的数据很有用。State 赋予你的组件记忆！

:::info
作为一般规则，使用 props 在组件渲染时对其进行配置。使用 state 跟踪你预期会随时间变化的任何组件数据。
:::

以下示例发生在一家猫咖啡馆，两只饥饿的猫正在等待喂食。它们的饥饿感（我们预期会随时间变化，与它们的名字不同）存储为 state。要喂猫，请按它们的按钮——这将更新它们的 state。

你可以通过调用 [React 的 `useState` Hook](https://react.dev/learn/state-a-components-memory) 向组件添加 state。Hook 是一种让你“钩入”React 功能的函数。例如，`useState` 是一个允许你向函数组件添加 state 的 Hook。你可以在 [React 文档中了解更多关于其他种类 Hook 的信息。](https://react.dev/reference/react)

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer name=State&ext=js
import {useState} from 'react';
import {Button, Text, View} from 'react-native';

const Cat = props => {
  const [isHungry, setIsHungry] = useState(true);

  return (
    <View>
      <Text>
        I am {props.name}, and I am {isHungry ? 'hungry' : 'full'}!
      </Text>
      <Button
        onPress={() => {
          setIsHungry(false);
        }}
        disabled={!isHungry}
        title={isHungry ? 'Give me some food, please!' : 'Thank you!'}
      />
    </View>
  );
};

const Cafe = () => {
  return (
    <>
      <Cat name="Munkustrap" />
      <Cat name="Spot" />
    </>
  );
};

export default Cafe;
```

</TabItem>
<TabItem value="typescript">

```SnackPlayer name=State&ext=tsx
import {useState} from 'react';
import {Button, Text, View} from 'react-native';

type CatProps = {
  name: string;
};

const Cat = (props: CatProps) => {
  const [isHungry, setIsHungry] = useState(true);

  return (
    <View>
      <Text>
        I am {props.name}, and I am {isHungry ? 'hungry' : 'full'}!
      </Text>
      <Button
        onPress={() => {
          setIsHungry(false);
        }}
        disabled={!isHungry}
        title={isHungry ? 'Give me some food, please!' : 'Thank you!'}
      />
    </View>
  );
};

const Cafe = () => {
  return (
    <>
      <Cat name="Munkustrap" />
      <Cat name="Spot" />
    </>
  );
};

export default Cafe;
```

</TabItem>
</Tabs>

首先，你需要像这样从 React 导入 `useState`：

```tsx
import {useState} from 'react';
```

然后你在组件函数内部调用 `useState` 来声明组件的 state。在此示例中，`useState` 创建一个 `isHungry` state 变量：

```tsx
const Cat = (props: CatProps) => {
  const [isHungry, setIsHungry] = useState(true);
  // ...
};
```

:::tip
你可以使用 `useState` 跟踪任何类型的数据：字符串、数字、布尔值、数组、对象。例如，你可以跟踪猫被抚摸的次数，使用 `const [timesPetted, setTimesPetted] = useState(0)`！
:::

调用 `useState` 会做两件事：

- 它创建一个具有初始值的"state 变量”——在此例中 state 变量是 `isHungry`，其初始值是 `true`
- 它创建一个函数来设置该 state 变量的值——`setIsHungry`

你使用什么名字并不重要。但将模式视为 `[<getter>, <setter>] = useState(<initialValue>)` 会很有帮助。

接下来你添加 [`Button`](button) 核心组件并给它一个 `onPress` prop：

```tsx
<Button
  onPress={() => {
    setIsHungry(false);
  }}
  //..
/>
```

现在，当有人按下按钮时，`onPress` 将触发，调用 `setIsHungry(false)`。这将 state 变量 `isHungry` 设置为 `false`。当 `isHungry` 为 false 时，`Button` 的 `disabled` prop 设置为 `true`，其 `title` 也会改变：

```tsx
<Button
  //..
  disabled={!isHungry}
  title={isHungry ? 'Give me some food, please!' : 'Thank you!'}
/>
```

:::info
You might’ve noticed that although `isHungry` is a [const](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/const), it is seemingly reassignable! The `const` keyword here does not mean that the state itself is immutable. Rather, it means that the reference to the object, that contains the state and the function to update it, will not change.
What is happening is when a state-setting function like `setIsHungry` is called, its component will re-render. In this case the `Cat` function will run again—and this time, `useState` will give us the next value of `isHungry`.
:::

最后，将你的猫放入 `Cafe` 组件中：

```tsx
const Cafe = () => {
  return (
    <>
      <Cat name="Munkustrap" />
      <Cat name="Spot" />
    </>
  );
};
```

:::info
看到上面的 `<>` 和 `</>` 了吗？这些 JSX 片段是 [fragments](https://react.dev/reference/react/Fragment)。相邻的 JSX 元素必须包裹在一个封闭标签中。Fragments 让你这样做而无需嵌套额外的、不必要的包装元素，如 `View`。
:::

---

现在你已经涵盖了 React 和 React Native 的核心组件，让我们通过查看 [处理 `<TextInput>`](handling-text-input) 来更深入地探讨一些这些核心组件。
