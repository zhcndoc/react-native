---
id: intro-react
title: React 基础
description: 要全面理解 React Native，你需要扎实的 React 基础。这段简短的 React 介绍可以帮助你入门或复习。
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

React Native 运行在 [React](https://react.dev/) 之上，它是一个流行的开源 JavaScript 用户界面库。为了更好地利用 React Native，理解 React 本身非常有帮助。本节内容可以帮助你入门或作为复习课程。

我们将介绍 React 背后的核心概念：

- 组件
- JSX
- props
- state

如果你想深入学习，我们鼓励你查看 [React 官方文档](https://react.dev/learn)。

## 你的第一个组件

接下来这段 React 入门示例用猫做例子：友好而易接近的生物，需要名字和一家咖啡馆作为场景。这里是你的第一个 Cat 组件：

```SnackPlayer name=Your%20Cat
import React from 'react';
import {Text} from 'react-native';

const Cat = () => {
  return <Text>Hello, I am your cat!</Text>;
};

export default Cat;
```

实现步骤如下：要定义你的 `Cat` 组件，首先使用 JavaScript 的 [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) 引入 React 和 React Native 的 [`Text`](/docs/next/text) 核心组件：

```tsx
import React from 'react';
import {Text} from 'react-native';
```

你的组件以函数形式开始：

```tsx
const Cat = () => {};
```

你可以将组件理解为蓝图。函数组件返回的内容将被渲染为一个 **React 元素**。React 元素让你描述希望在屏幕上看到的内容。

这里，`Cat` 组件将渲染一个 `<Text>` 元素：

```tsx
const Cat = () => {
  return <Text>Hello, I am your cat!</Text>;
};
```

你可以通过 JavaScript 的 [`export default`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) 导出你的函数组件，以便在应用中使用：

```tsx
const Cat = () => {
  return <Text>Hello, I am your cat!</Text>;
};

export default Cat;
```

:::tip
这只是导出组件的多种方式之一。这种导出方式非常适合 Snack Player。然而，基于你的应用文件结构，你可能需要使用不同的规范。这里有一份 [JavaScript 导入和导出速查表](https://medium.com/dailyjs/javascript-module-cheatsheet-7bd474f1d829)，可以帮到你。
:::

仔细看看那个 `return` 语句。`<Text>Hello, I am your cat!</Text>` 使用了一种 JavaScript 语法，使得编写元素非常方便：JSX。

## JSX

React 和 React Native 使用 **JSX**，这是一种语法，允许你在 JavaScript 中像这样编写元素：`<Text>Hello, I am your cat!</Text>`。React 官方文档有一份 [全面的 JSX 指南](https://react.dev/learn/writing-markup-with-jsx)，你可以参考学习更多。因为 JSX 是 JavaScript，你可以在其中使用变量。这里你声明了猫的名字 `name`，并用大括号在 `<Text>` 中嵌入它。

```SnackPlayer name=Curly%20Braces
import React from 'react';
import {Text} from 'react-native';

const Cat = () => {
  const name = 'Maru';
  return <Text>Hello, I am {name}!</Text>;
};

export default Cat;
```

任何 JavaScript 表达式都可以写在大括号里，包括函数调用，例如 `{getFullName("Rum", "Tum", "Tugger")}`：

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

你可以把大括号看作是 JSX 中进入 JS 功能的门户！

:::tip
因为 JSX 被包含在 React 库中，如果你的文件顶部没有 `import React from 'react'`，它将无法使用！
:::

## 自定义组件

你已经见过 [React Native 的核心组件](intro-react-native-components)。React 允许你在组件内嵌套其他组件，创建新的组件。这种可嵌套、可复用的组件是 React 范式的核心。

例如，你可以在下面的例子中将 [`Text`](text) 和 [`TextInput`](textinput) 嵌套在 [`View`](view) 中，React Native 会将它们一起渲染：

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

#### 开发者笔记

<Tabs groupId="guide" queryString defaultValue="web" values={constants.getDevNotesTabs(["android", "web"])}>

<TabItem value="web">

:::info
如果你熟悉 Web 开发，`<View>` 和 `<Text>` 可能会让你联想到 HTML！你可以把它们看作是应用开发中的 `<div>` 和 `<p>` 标签。
:::

</TabItem>
<TabItem value="android">

:::info
在 Android 中，通常将视图放入 `LinearLayout`、`FrameLayout`、`RelativeLayout` 等，以定义子视图在屏幕上的排列方式。React Native 中，`View` 使用 Flexbox 来布局子视图。你可以在 [我们的 Flexbox 布局指南](flexbox) 了解更多。
:::

</TabItem>
</Tabs>

你可以多次在不同位置渲染这个组件，而不必重复你的代码，只需使用 `<Cat>`：

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

任何渲染其他组件的组件都是 **父组件**。这里 `Cafe` 是父组件，每个 `Cat` 是 **子组件**。

你可以给你的咖啡馆里放任意数量的猫。每个 `<Cat>` 都渲染一个独特的元素——你可以用 props 来定制它们。

## Props

**Props** 是“属性”（properties）的缩写，允许你自定义 React 组件。例如，这里你给每个 `<Cat>` 传递不同的 `name`，让 Cat 渲染不同的名字：

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

React Native 大多数核心组件也可以通过 props 自定义。例如，使用 [`Image`](image) 时，你可以传递名为 [`source`](image#source) 的 prop 来定义显示的图片：

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

`Image` 有 [许多不同的 props](image#props)，其中包括接受设计与布局相关属性 - 值对 JS 对象的 [`style`](image#style)。

:::note
注意 `style` 值外面的双重大括号 `{{ }}`。在 JSX 中，JavaScript 值用 `{}` 引用。这在你传递非字符串的 props 时很方便，比如数组或数字：`<Cat food={["fish", "kibble"]} age={2} />`。然而 JS 对象本身也是用大括号表示的：`{width: 200, height: 200}`。因此，要在 JSX 中传递 JS 对象，必须用**另一对**大括号包裹它：`{{width: 200, height: 200}}`。
:::

你可以结合 props 和核心组件 [`Text`](text)、[`Image`](image)、[`View`](view) 做很多事情！但要构建交互式的内容，你需要 state。

## State

你可以把 props 看作配置组件渲染时传入的参数，而 **state** 则像组件的个人数据存储。State 对处理随时间变化或由用户交互产生的数据很有用。State 赋予你的组件记忆能力！

:::info
一般原则是，使用 props 配置组件首次渲染时的状态。使用 state 跟踪预期会随时间变化的组件数据。
:::

以下示例发生在一家猫咪咖啡馆，里面有两只饥饿的猫等待喂食。它们的饥饿状态会随时间变化（不同于它们的名字），被存储为 state。喂食猫咪时点击它们的按钮，会更新它们的状态。

你可以通过调用 [React 的 `useState` Hook](https://react.dev/learn/state-a-components-memory) 向组件添加 state。Hook 是一类函数，允许你“接入”React 的特性。例如，`useState` 允许你给函数组件添加 state。你可以在 [React 文档了解更多 Hook](https://react.dev/reference/react)。

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

首先，你想从 React 导入 `useState`：

```tsx
import React, {useState} from 'react';
```

然后在组件函数内部调用 `useState` 声明组件的 state。示例中，`useState` 创建了名为 `isHungry` 的 state 变量：

```tsx
const Cat = (props: CatProps) => {
  const [isHungry, setIsHungry] = useState(true);
  // ...
};
```

:::tip
你可以用 `useState` 追踪任何类型的数据：字符串、数字、布尔、数组、对象。例如，你可以使用 `const [timesPetted, setTimesPetted] = useState(0)` 追踪猫被抚摸的次数！
:::

调用 `useState` 做了两件事：

- 创建一个"state 变量”，并赋初始值——这里是 `isHungry`，初始为 `true`
- 创建一个函数用来设置该 state 变量值——`setIsHungry`

变量名自己取，不过习惯用 `[读值函数，写值函数] = useState(初始值)` 模式。

接着你添加 [`Button`](button) 组件，并赋予 `onPress` prop：

```tsx
<Button
  onPress={() => {
    setIsHungry(false);
  }}
  //..
/>
```

当有人点击按钮时，`onPress` 会被触发，调用 `setIsHungry(false)`，将状态变量 `isHungry` 设为 `false`。当 `isHungry` 为 false 时，按钮的 `disabled` 属性为 `true`，`title` 也随之变更：

```tsx
<Button
  //..
  disabled={!isHungry}
  title={isHungry ? 'Give me some food, please!' : 'Thank you!'}
/>
```

:::info
注意，虽然 `isHungry` 用了 [const](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/const) 声明，看似可以重新赋值！`const` 在这里并不意味着 state 本身不可变，而是说明对包含状态及其更新函数的对象引用不可变。
实际上，当调用像 `setIsHungry` 这样的状态设置函数时，组件会重新渲染。这次运行时，`useState` 会返回新的 `isHungry` 值。
:::

最后，将你的猫放入 `Cafe` 组件：

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
注意上面 `<>` 和 `</>` 是什么？它们是 [Fragments](https://react.dev/reference/react/Fragment)。JSX 中相邻元素必须有一个父级包裹。Fragment 允许你这样做，同时避免多嵌套一个额外的包裹元素，如 `View`。
:::

---

现在你已经掌握了 React 和 React Native 的核心组件，让我们通过查看 [处理 `<TextInput>`](handling-text-input) 进一步深入这些核心组件吧。