---
id: intro-react
title: React 基础
description: 要全面理解 React Native，你需要扎实的 React 基础。这篇简短的 React 介绍可以帮助你入门或温故知新。
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

React Native 运行于 [React](https://react.dev/) 之上，React 是一个使用 JavaScript 构建用户界面的热门开源库。为了充分发挥 React Native 的能力，了解 React 本身会很有帮助。本节可以帮助你入门，也可以作为复习课程。

我们将介绍 React 背后的核心概念：

- 组件
- JSX
- props
- state

如果你想深入了解，我们建议你查看 [React 官方文档](https://react.dev/learn)。

## 你的第一个组件

本篇 React 入门的其余部分会在示例中使用猫：它们是友好、平易近人的生物，需要名字和一家可以工作的咖啡馆。下面是你的第一个 Cat 组件：

```SnackPlayer name=Your%20Cat
import {Text} from 'react-native';

const Cat = () => {
  return <Text>Hello, I am your cat!</Text>;
};

export default Cat;
```

具体做法如下：要定义 `Cat` 组件，首先使用 JavaScript 的 [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) 导入 React Native 的 [`Text`](/docs/next/text) Core Component：

```tsx
import {Text} from 'react-native';
```

你的组件从一个函数开始：

```tsx
const Cat = () => {};
```

你可以将组件看作蓝图。函数组件返回的任何内容都会被渲染为 **React 元素。** React 元素让你能够描述想要在屏幕上看到的内容。

这里的 `Cat` 组件将渲染一个 `<Text>` 元素：

```tsx
const Cat = () => {
  return <Text>Hello, I am your cat!</Text>;
};
```

你可以使用 JavaScript 的 [`export default`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) 导出函数组件，以便在应用中的各处使用：

```tsx
const Cat = () => {
  return <Text>Hello, I am your cat!</Text>;
};

export default Cat;
```

:::tip
导出组件的方法有很多种。这种导出方式与 Snack Player 配合得很好。不过，根据应用的文件结构，你可能需要使用不同的约定。这份关于 JavaScript 导入和导出的[实用速查表](https://medium.com/dailyjs/javascript-module-cheatsheet-7bd474f1d829)可以提供帮助。
:::

现在仔细看看 `return` 语句。`<Text>Hello, I am your cat!</Text>` 使用了一种让编写元素更加方便的 JavaScript 语法：JSX。

## JSX

React 和 React Native 使用 **JSX，**这是一种让你可以像这样在 JavaScript 中编写元素的语法：`<Text>Hello, I am your cat!</Text>`。React 文档提供了[一份全面的 JSX 指南](https://react.dev/learn/writing-markup-with-jsx)，你可以参考它来进一步了解。由于 JSX 是 JavaScript，你可以在其中使用变量。这里你为猫声明了一个名称 `name`，并将其放在 `<Text>` 内部的花括号中。

```SnackPlayer name=Curly%20Braces
import {Text} from 'react-native';

const Cat = () => {
  const name = 'Maru';
  return <Text>Hello, I am {name}!</Text>;
};

export default Cat;
```

花括号之间可以使用任何 JavaScript 表达式，包括 `{getFullName("Rum", "Tum", "Tugger")}` 这样的函数调用：

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

你可以将花括号看作一个通往 JSX 中 JS 功能的入口！

## 自定义组件

你已经了解了 [React Native 的 Core Components](intro-react-native-components)。React 允许你将这些组件相互嵌套，从而创建新的组件。这些可以嵌套、重复使用的组件是 React 范式的核心。

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
如果你熟悉 Web 开发，`<View>` 和 `<Text>` 可能会让你联想到 HTML！你可以将它们看作应用开发中的 `<div>` 和 `<p>` 标签。
:::

</TabItem>
<TabItem value="android">

:::info
在 Android 上，你通常会将视图放在 `LinearLayout`、`FrameLayout`、`RelativeLayout` 等容器中，以定义视图子元素在屏幕上的排列方式。在 React Native 中，`View` 使用 Flexbox 来布局其子元素。你可以在[我们的 Flexbox 布局指南](flexbox)中了解更多信息。
:::

</TabItem>
</Tabs>

通过使用 `<Cat>`，你可以在多个位置多次渲染此组件，而无需重复代码：

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

任何会渲染其他组件的组件都是**父组件。**这里，`Cafe` 是父组件，而每个 `Cat` 都是**子组件。**

你可以在咖啡馆里放任意数量的猫。每个 `<Cat>` 都会渲染一个独特的元素，你可以使用 props 对其进行自定义。

## Props

**Props** 是“properties”的缩写。Props 可以让你自定义 React 组件。例如，这里你为每个 `<Cat>` 传入不同的 `name`，供 `Cat` 进行渲染：

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

React Native 的大多数 Core Components 也都可以使用 props 进行自定义。例如，使用 [`Image`](image) 时，你可以向它传入名为 [`source`](image#source) 的 prop，以定义它显示的图像：

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

`Image` 有[许多不同的 props](image#props)，包括 [`style`](image#style)，它接受一个 JS 对象，其中包含与设计和布局相关的属性值对。

:::note
注意 `style` 的宽度和高度周围有双花括号 `{{ }}`。在 JSX 中，JavaScript 值使用 `{}` 引用。当你将字符串以外的内容作为 props 传入时，这会很方便，例如数组或数字：`<Cat food={["fish", "kibble"]} age={2} />`。不过，JS 对象***也***使用花括号表示：`{width: 200, height: 200}`。因此，要在 JSX 中传入 JS 对象，必须将对象包裹在**另一对**花括号中：`{{width: 200, height: 200}}`
:::

使用 props 以及 Core Components [`Text`](text)、[`Image`](image) 和 [`View`](view)，你可以构建许多东西！但要构建交互式内容，你还需要 state。

## State

虽然你可以将 props 看作配置组件渲染方式时使用的参数，但 **state** 就像组件的个人数据存储。State 适用于处理会随时间变化的数据，或处理来自用户交互的数据。State 赋予组件记忆！

:::info
一般来说，在组件渲染时使用 props 配置组件。使用 state 跟踪你预计会随时间变化的组件数据。
:::

下面的示例发生在一家猫咖啡馆里，两只饥饿的猫正在等待进食。它们的饥饿状态与名字不同，我们预计这种状态会随时间变化，因此将其存储为 state。要喂猫，请按下它们的按钮，这会更新它们的 state。

你可以调用 [React 的 `useState` Hook](https://react.dev/learn/state-a-components-memory) 为组件添加 state。Hook 是一种让你能够“接入” React 功能的函数。例如，`useState` 是一种让你可以向函数组件添加 state 的 Hook。你可以在 [React 文档中的其他类型的 Hook](https://react.dev/reference/react) 中了解更多信息。

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

然后，在组件函数内部调用 `useState` 来声明组件的 state。在此示例中，`useState` 创建了一个 `isHungry` state 变量：

```tsx
const Cat = (props: CatProps) => {
  const [isHungry, setIsHungry] = useState(true);
  // ...
};
```

:::tip
你可以使用 `useState` 跟踪任何类型的数据：字符串、数字、布尔值、数组、对象。例如，你可以使用 `const [timesPetted, setTimesPetted] = useState(0)` 跟踪一只猫被抚摸的次数！
:::

调用 `useState` 会执行两件事：

- 创建一个带有初始值的“state 变量”——在此例中，state 变量是 `isHungry`，其初始值为 `true`
- 创建一个用于设置该 state 变量值的函数——`setIsHungry`

使用什么名称并不重要。不过，将这种模式理解为 `[<getter>, <setter>] = useState(<initialValue>)` 可能会很方便。

接下来添加 [`Button`](button) Core Component，并为其指定一个 `onPress` prop：

```tsx
<Button
  onPress={() => {
    setIsHungry(false);
  }}
  //..
/>
```

现在，当有人按下按钮时，`onPress` 会触发并调用 `setIsHungry(false)`。这会将 state 变量 `isHungry` 设置为 `false`。当 `isHungry` 为 false 时，`Button` 的 `disabled` prop 会被设置为 `true`，其 `title` 也会发生变化：

```tsx
<Button
  //..
  disabled={!isHungry}
  title={isHungry ? 'Give me some food, please!' : 'Thank you!'}
/>
```

:::info
你可能已经注意到，虽然 `isHungry` 是一个 [const](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/const)，但它看起来似乎可以被重新赋值！这里的 `const` 关键字并不意味着 state 本身是不可变的。相反，它意味着包含 state 和更新 state 的函数的对象引用不会改变。
实际发生的情况是，当调用 `setIsHungry` 这样的 state 设置函数时，其组件会重新渲染。在此例中，`Cat` 函数会再次运行——这一次，`useState` 会为我们提供 `isHungry` 的下一个值。
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
看到上面的 `<>` 和 `</>` 了吗？这些 JSX 片段是 [fragments](https://react.dev/reference/react/Fragment)。相邻的 JSX 元素必须包裹在一个外部标签中。Fragments 让你无需嵌套额外且不必要的包装元素（例如 `View`），就能做到这一点。
:::

---

现在你已经学习了 React 和 React Native 的 Core Components，接下来让我们通过了解[如何处理 `<TextInput>`](handling-text-input)，进一步深入学习其中的一些核心组件。
