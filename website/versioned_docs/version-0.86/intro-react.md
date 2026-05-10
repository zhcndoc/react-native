---
id: intro-react
title: React 基础
description: 要全面理解 React Native，你需要扎实的 React 基础。这个关于 React 的简短介绍可以帮助你入门或复习。
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

React Native 运行在 [React](https://react.dev/) 之上，React 是一个用于使用 JavaScript 构建用户界面的流行开源库。要充分利用 React Native，理解 React 本身会很有帮助。本节可以帮助你入门，也可以作为复习材料。

我们将介绍 React 背后的核心概念：

- components
- JSX
- props
- state

如果你想深入了解，我们建议你查看 [React 的官方文档](https://react.dev/learn)。

## 你的第一个组件

这篇关于 React 的其余介绍都会使用猫作为示例：友好、平易近人的生物，需要名字和一个可以工作的咖啡馆。下面是你的第一个 Cat 组件：

```SnackPlayer name=Your%20Cat
import React from 'react';
import {Text} from 'react-native';

const Cat = () => {
  return <Text>Hello, I am your cat!</Text>;
};

export default Cat;
```

下面是具体做法：要定义你的 `Cat` 组件，首先使用 JavaScript 的 [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) 导入 React 和 React Native 的 [`Text`](/docs/next/text) 核心组件：

```tsx
import React from 'react';
import {Text} from 'react-native';
```

你的组件从一个函数开始：

```tsx
const Cat = () => {};
```

你可以把组件想象成蓝图。函数组件返回的任何内容都会被渲染为一个 **React 元素。** React 元素让你能够描述你想在屏幕上看到什么。

这里 `Cat` 组件将渲染一个 `<Text>` 元素：

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
这是导出组件的多种方式之一。这种导出方式与 Snack Player 配合得很好。不过，根据你的应用文件结构，你可能需要使用不同的约定。这个关于 JavaScript 导入和导出的 [实用速查表](https://medium.com/dailyjs/javascript-module-cheatsheet-7bd474f1d829) 可以提供帮助。
:::

现在仔细看看那个 `return` 语句。`<Text>Hello, I am your cat!</Text>` 使用了一种让编写元素更方便的 JavaScript 语法：JSX。

## JSX

React 和 React Native 使用 **JSX，** 这是一种让你可以像这样在 JavaScript 中编写元素的语法：`<Text>Hello, I am your cat!</Text>`。React 文档中有一份 [完整的 JSX 指南](https://react.dev/learn/writing-markup-with-jsx)，你可以参考以了解更多。由于 JSX 本质上是 JavaScript，你可以在其中使用变量。这里你正在为猫声明一个名字 `name`，并用大括号将它嵌入到 `<Text>` 中。

```SnackPlayer name=Curly%20Braces
import React from 'react';
import {Text} from 'react-native';

const Cat = () => {
  const name = 'Maru';
  return <Text>Hello, I am {name}!</Text>;
};

export default Cat;
```

任何 JavaScript 表达式都可以放在大括号之间，包括函数调用，比如 `{getFullName("Rum", "Tum", "Tugger")}`：

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer name=Curly%20Braces&ext=js
import React from 'react';
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
import React from 'react';
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

你可以把大括号想象成在 JSX 中打开了一个通往 JS 功能的入口！

:::tip
因为 JSX 包含在 React 库中，如果你的文件顶部没有 `import React from 'react'`，它将无法工作！
:::

## 自定义组件

你已经见过 [React Native 的核心组件](intro-react-native-components)。React 允许你将这些组件相互嵌套，从而创建新的组件。这些可嵌套、可复用的组件是 React 范式的核心。

例如，你可以在下面的一个 [`View`](view) 中嵌套 [`Text`](text) 和 [`TextInput`](textinput)，React Native 会将它们一起渲染：

```SnackPlayer name=Custom%20Components
import React from 'react';
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

#### 开发者注释

<Tabs groupId="guide" queryString defaultValue="web" values={constants.getDevNotesTabs(["android", "web"])}>

<TabItem value="web">

:::info
如果你熟悉 Web 开发，`<View>` 和 `<Text>` 可能会让你想起 HTML！你可以把它们看作应用开发中的 `<div>` 和 `<p>` 标签。
:::

</TabItem>
<TabItem value="android">

:::info
在 Android 上，你通常会将视图放在 `LinearLayout`、`FrameLayout`、`RelativeLayout` 等容器中，以定义视图的子元素如何在屏幕上排列。在 React Native 中，`View` 使用 Flexbox 来布局其子元素。你可以在 [我们的 Flexbox 布局指南](flexbox) 中了解更多。
:::

</TabItem>
</Tabs>

你可以使用 `<Cat>` 在多个地方多次渲染这个组件，而无需重复代码：

```SnackPlayer name=Multiple%20Components
import React from 'react';
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

任何渲染其他组件的组件都是一个 **父组件。** 这里，`Cafe` 是父组件，而每个 `Cat` 都是一个 **子组件。**

你可以在咖啡馆里放任意多只猫。每个 `<Cat>` 都会渲染一个独特的元素——你可以通过 props 来自定义它。

## Props

**Props** 是“properties（属性）”的缩写。Props 让你可以自定义 React 组件。例如，这里你给每个 `<Cat>` 传入不同的 `name`，让 `Cat` 渲染：

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer name=Multiple%20Props&ext=js
import React from 'react';
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
import React from 'react';
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

React Native 的大多数核心组件也可以通过 props 进行自定义。例如，使用 [`Image`](image) 时，你会传入一个名为 [`source`](image#source) 的 prop 来定义它显示的图片：

```SnackPlayer name=Props
import React from 'react';
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

`Image` 有 [许多不同的 props](image#props)，包括 [`style`](image#style)，它接受一个包含设计和布局相关属性-值对的 JS 对象。

:::note
注意 `style` 的宽度和高度外层包裹了双大括号 `{{ }}`。在 JSX 中，JavaScript 值用 `{}` 来引用。如果你传递给 props 的不是字符串，而是数组或数字之类的值，这会很方便：`<Cat food={["fish", "kibble"]} age={2} />`。不过，JS 对象 **_也_** 是用大括号表示的：`{width: 200, height: 200}`。因此，要在 JSX 中传递一个 JS 对象，你必须用 **另一层** 大括号把对象包起来：`{{width: 200, height: 200}}`
:::

你可以借助 props 和核心组件 [`Text`](text)、[`Image`](image) 以及 [`View`](view) 构建很多东西！但要构建交互式内容，你需要 state。

## State

你可以把 props 看作用于配置组件渲染方式的参数，而 **state** 则像是组件的个人数据存储。State 适合处理会随时间变化，或来自用户交互的数据。State 让你的组件拥有记忆！

:::info
一般来说，当组件渲染时，使用 props 来配置组件。使用 state 来跟踪任何你预计会随时间变化的组件数据。
:::

下面的示例发生在一家猫咖啡馆里，两只饥饿的猫正等着被喂食。它们的饥饿状态会随时间变化（不同于它们的名字），因此被存储为 state。要喂猫，请按下它们的按钮——这会更新它们的 state。

你可以通过调用 [React 的 `useState` Hook](https://react.dev/learn/state-a-components-memory) 来向组件添加 state。Hook 是一种函数，它让你可以“接入” React 功能。例如，`useState` 是一个 Hook，它能让你向函数组件添加 state。你可以在 [React 文档中了解更多关于其他类型 Hook 的内容。](https://react.dev/reference/react)

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer name=State&ext=js
import React, {useState} from 'react';
import {Button, Text, View} from 'react-native';

const Cat = props => {
  const [isHungry, setIsHungry] = useState(true);

  return (
    <View>
      <Text>
        我是 {props.name}，而且我{isHungry ? '饿了' : '饱了'}！
      </Text>
      <Button
        onPress={() => {
          setIsHungry(false);
        }}
        disabled={!isHungry}
        title={isHungry ? '给我一些食物吧！' : '谢谢你！'}
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
import React, {useState} from 'react';
import {Button, Text, View} from 'react-native';

type CatProps = {
  name: string;
};

const Cat = (props: CatProps) => {
  const [isHungry, setIsHungry] = useState(true);

  return (
    <View>
      <Text>
        我是 {props.name}，而且我{isHungry ? '饿了' : '饱了'}！
      </Text>
      <Button
        onPress={() => {
          setIsHungry(false);
        }}
        disabled={!isHungry}
        title={isHungry ? '给我一些食物吧！' : '谢谢你！'}
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

首先，你需要像这样从 React 中导入 `useState`：

```tsx
import React, {useState} from 'react';
```

然后在组件函数内部调用 `useState` 来声明组件的 state。在这个例子中，`useState` 创建了一个 `isHungry` state 变量：

```tsx
const Cat = (props: CatProps) => {
  const [isHungry, setIsHungry] = useState(true);
  // ...
};
```

:::tip
你可以使用 `useState` 跟踪任何类型的数据：字符串、数字、布尔值、数组、对象。例如，你可以用 `const [timesPetted, setTimesPetted] = useState(0)` 来跟踪猫被抚摸了多少次！
:::

调用 `useState` 会做两件事：

- 它会创建一个带有初始值的“state 变量”——在这个例子中，state 变量是 `isHungry`，其初始值为 `true`
- 它会创建一个用于设置该 state 变量值的函数——`setIsHungry`

你使用什么名字并不重要。但可以把这个模式理解为 `[<getter>, <setter>] = useState(<initialValue>)`，这样会很方便。

接下来你添加 [`Button`](button) 核心组件，并给它一个 `onPress` prop：

```tsx
<Button
  onPress={() => {
    setIsHungry(false);
  }}
  //..
/>
```

现在，当有人按下按钮时，`onPress` 会触发，调用 `setIsHungry(false)`。这会将 state 变量 `isHungry` 设为 `false`。当 `isHungry` 为 false 时，`Button` 的 `disabled` prop 会被设为 `true`，它的 `title` 也会随之改变：

```tsx
<Button
  //..
  disabled={!isHungry}
  title={isHungry ? '给我一些食物吧！' : '谢谢你！'}
/>
```

:::info
你可能注意到了，虽然 `isHungry` 是一个 [const](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/const)，它似乎仍然可以被重新赋值！这里的 `const` 关键字并不意味着 state 本身是不可变的。相反，它表示包含 state 以及用于更新 state 的函数的那个对象引用不会改变。
实际发生的是，当像 `setIsHungry` 这样的 state 设置函数被调用时，它所在的组件会重新渲染。在这种情况下，`Cat` 函数会再次运行——而这一次，`useState` 会给我们 `isHungry` 的下一个值。
:::

最后，把你的猫放进一个 `Cafe` 组件中：

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
看到上面的 `<>` 和 `</>` 了吗？这些 JSX 片段是 [fragment](https://react.dev/reference/react/Fragment)。相邻的 JSX 元素必须被包裹在一个外层标签中。Fragment 让你无需再嵌套一个额外且不必要的包裹元素，比如 `View`。
:::

---

现在你已经了解了 React 和 React Native 的核心组件，让我们通过查看 [处理 `<TextInput>`](handling-text-input) 来更深入地了解其中一些核心组件。
