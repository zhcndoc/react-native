---
id: intro-react
title: React 基础
description: 要全面理解 React Native，你需要扎实的 React 基础。这个简短的 React 入门可以帮助你开始上手，或者帮助你温故知新。
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

React Native 运行在 [React](https://react.dev/) 上，React 是一个广受欢迎的开源库，用于使用 JavaScript 构建用户界面。要充分利用 React Native，理解 React 本身会很有帮助。本节可以帮助你入门，也可以作为复习材料。

我们将介绍 React 背后的核心概念：

- 组件
- JSX
- props
- state

如果你想深入了解，我们鼓励你查看 [React 官方文档](https://react.dev/learn)。

## 你的第一个组件

本 React 入门的其余部分会用猫作为示例：友好、平易近人的生物，需要名字和一个可以工作的咖啡馆。下面是你的第一个 Cat 组件：

```SnackPlayer name=Your%20Cat
import {Text} from 'react-native';

const Cat = () => {
  return <Text>你好，我是你的猫！</Text>;
};

export default Cat;
```

下面是具体做法：要定义你的 `Cat` 组件，首先使用 JavaScript 的 [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) 导入 React Native 的 [`Text`](/docs/next/text) Core Component：

```tsx
import {Text} from 'react-native';
```

你的组件一开始是一个函数：

```tsx
const Cat = () => {};
```

你可以把组件看作蓝图。函数组件返回的任何内容都会被渲染为 **React 元素。** React 元素让你能够描述你希望在屏幕上看到什么。

这里 `Cat` 组件会渲染一个 `<Text>` 元素：

```tsx
const Cat = () => {
  return <Text>你好，我是你的猫！</Text>;
};
```

你可以使用 JavaScript 的 [`export default`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) 导出你的函数组件，以便在整个应用中使用，如下所示：

```tsx
const Cat = () => {
  return <Text>你好，我是你的猫！</Text>;
};

export default Cat;
```

:::tip
这是导出组件的多种方式之一。这种导出方式与 Snack Player 配合良好。不过，根据你的应用文件结构，你可能需要使用不同的约定。这个关于 JavaScript 导入和导出的 [实用备忘单](https://medium.com/dailyjs/javascript-module-cheatsheet-7bd474f1d829) 可以提供帮助。
:::

现在让我们更仔细地看看那个 `return` 语句。`<Text>你好，我是你的猫！</Text>` 使用了一种让编写元素变得更方便的 JavaScript 语法：JSX。

## JSX

React 和 React Native 使用 **JSX，** 这是一种允许你像这样在 JavaScript 中编写元素的语法：`<Text>你好，我是你的猫！</Text>`。React 文档中有一份 [关于 JSX 的完整指南](https://react.dev/learn/writing-markup-with-jsx)，你可以参考以了解更多。由于 JSX 本质上就是 JavaScript，你可以在其中使用变量。这里你正在为猫声明一个名字 `name`，并在 `<Text>` 中用花括号把它嵌入进去。

```SnackPlayer name=Curly%20Braces
import {Text} from 'react-native';

const Cat = () => {
  const name = 'Maru';
  return <Text>你好，我是 {name}！</Text>;
};

export default Cat;
```

任何 JavaScript 表达式都可以放在花括号之间，包括像 `{getFullName("Rum", "Tum", "Tugger")}` 这样的函数调用：

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer name=Curly%20Braces&ext=js
import {Text} from 'react-native';

const getFullName = (firstName, secondName, thirdName) => {
  return firstName + ' ' + secondName + ' ' + thirdName;
};

const Cat = () => {
  return <Text>你好，我是 {getFullName('Rum', 'Tum', 'Tugger')}！</Text>;
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
  return <Text>你好，我是 {getFullName('Rum', 'Tum', 'Tugger')}！</Text>;
};

export default Cat;
```

</TabItem>
</Tabs>

你可以把花括号看作是在 JSX 中打开了一个通往 JS 功能的入口！

## 自定义组件

你已经见过 [React Native 的核心组件](intro-react-native-components) 了。React 允许你将这些组件相互嵌套，以创建新的组件。这些可嵌套、可复用的组件是 React 范式的核心。

例如，你可以将下面的 [`Text`](text) 和 [`TextInput`](textinput) 嵌套在一个 [`View`](view) 中，而 React Native 会将它们一起渲染：

```SnackPlayer name=Custom%20Components
import {Text, TextInput, View} from 'react-native';

const Cat = () => {
  return (
    <View>
      <Text>你好，我是……</Text>
      <TextInput
        style={{
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
        }}
        defaultValue="给我起个名字吧！"
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
如果你熟悉 Web 开发，`<View>` 和 `<Text>` 可能会让你想起 HTML！你可以把它们看作应用开发中的 `<div>` 和 `<p>` 标签。
:::

</TabItem>
<TabItem value="android">

:::info
在 Android 上，你通常会把视图放在 `LinearLayout`、`FrameLayout`、`RelativeLayout` 等容器中，以定义视图的子元素如何在屏幕上排列。在 React Native 中，`View` 使用 Flexbox 来布局其子元素。你可以在 [我们的 Flexbox 布局指南](flexbox) 中了解更多。
:::

</TabItem>
</Tabs>

你可以使用 `<Cat>` 多次、在多个地方渲染这个组件，而无需重复代码：

```SnackPlayer name=Multiple%20Components
import {Text, View} from 'react-native';

const Cat = () => {
  return (
    <View>
      <Text>我也是一只猫！</Text>
    </View>
  );
};

const Cafe = () => {
  return (
    <View>
      <Text>欢迎！</Text>
      <Cat />
      <Cat />
      <Cat />
    </View>
  );
};

export default Cafe;
```

任何渲染其他组件的组件都是 **父组件。** 在这里，`Cafe` 是父组件，而每个 `Cat` 都是 **子组件。**

你可以在咖啡馆里放任意多只猫。每个 `<Cat>` 都会渲染一个独特的元素——你可以通过 props 来自定义它。

## Props

**Props** 是 “properties” 的缩写。Props 让你可以自定义 React 组件。例如，在这里你给每个 `<Cat>` 传入不同的 `name`，让 `Cat` 渲染出来：

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer name=Multiple%20Props&ext=js
import {Text, View} from 'react-native';

const Cat = props => {
  return (
    <View>
      <Text>你好，我是 {props.name}！</Text>
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
      <Text>你好，我是 {props.name}！</Text>
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

React Native 的大多数核心组件也可以通过 props 来定制。例如，在使用 [`Image`](image) 时，你会传入一个名为 [`source`](image#source) 的 prop 来定义它显示的图片：

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
      <Text>你好，我是你的猫！</Text>
    </View>
  );
};

export default CatApp;
```

`Image` 有 [许多不同的 props](image#props)，包括 [`style`](image#style)，它接受一个包含设计和布局相关属性-值对的 JS 对象。

:::note
注意包围 `style` 的宽度和高度的双层花括号 `{{ }}`。在 JSX 中，JavaScript 值使用 `{}` 引用。如果你传入的 props 不是字符串，比如数组或数字，这会很方便：`<Cat food={["fish", "kibble"]} age={2} />`。不过，JS 对象也**同样**使用花括号表示：`{width: 200, height: 200}`。因此，要在 JSX 中传递 JS 对象，你必须用**另一对**花括号把对象包起来：`{{width: 200, height: 200}}`
:::

你可以通过 props 和核心组件 [`Text`](text)、[`Image`](image) 和 [`View`](view) 构建很多东西！但要构建交互式内容，你还需要 state。

## State

虽然你可以把 props 看作用于配置组件渲染方式的参数，但 **state** 更像是组件的个人数据存储。State 适合处理会随时间变化的数据，或者来自用户交互的数据。State 赋予你的组件记忆！

:::info
一般来说，在组件渲染时使用 props 来配置组件。使用 state 来跟踪任何你预期会随时间变化的组件数据。
:::

下面的示例发生在一家猫咖啡馆里，两只饥肠辘辘的猫正在等待喂食。它们的饥饿程度会随时间变化（不同于它们的名字），因此会作为 state 存储。要喂猫，只需按下它们的按钮——这会更新它们的 state。

你可以通过调用 [React 的 `useState` Hook](https://react.dev/learn/state-a-components-memory) 将 state 添加到组件中。Hook 是一种函数，允许你“接入” React 的特性。例如，`useState` 就是一个可以让你向函数组件添加 state 的 Hook。你可以在 [React 文档中了解更多其他类型的 Hooks。](https://react.dev/reference/react)

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
        我是 {props.name}，而且我{isHungry ? '饿了' : '饱了'}！
      </Text>
      <Button
        onPress={() => {
          setIsHungry(false);
        }}
        disabled={!isHungry}
        title={isHungry ? '请给我一些食物！' : '谢谢你！'}
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
        我是 {props.name}，而且我{isHungry ? '饿了' : '饱了'}！
      </Text>
      <Button
        onPress={() => {
          setIsHungry(false);
        }}
        disabled={!isHungry}
        title={isHungry ? '请给我一些食物！' : '谢谢你！'}
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
import {useState} from 'react';
```

然后，在组件函数内部调用 `useState` 来声明组件的 state。在这个例子中，`useState` 创建了一个 `isHungry` state 变量：

```tsx
const Cat = (props: CatProps) => {
  const [isHungry, setIsHungry] = useState(true);
  // ...
};
```

:::tip
你可以使用 `useState` 跟踪任何类型的数据：字符串、数字、布尔值、数组、对象。例如，你可以用 `const [timesPetted, setTimesPetted] = useState(0)` 来跟踪一只猫被抚摸了多少次！
:::

调用 `useState` 会做两件事：

- 它创建一个带有初始值的“state 变量”——在这个例子中，state 变量是 `isHungry`，其初始值为 `true`
- 它创建一个用于设置该 state 变量值的函数——`setIsHungry`

你使用什么名称都无所谓。但把这个模式记作 `[<getter>, <setter>] = useState(<initialValue>)` 会很方便。

接着，你添加 [`Button`](button) Core Component，并为它提供一个 `onPress` prop：

```tsx
<Button
  onPress={() => {
    setIsHungry(false);
  }}
  //..
/>
```

现在，当有人按下按钮时，`onPress` 会触发并调用 `setIsHungry(false)`。这会将 state 变量 `isHungry` 设置为 `false`。当 `isHungry` 为 false 时，`Button` 的 `disabled` prop 会被设为 `true`，它的 `title` 也会随之改变：

```tsx
<Button
  //..
  disabled={!isHungry}
  title={isHungry ? '请给我一些食物！' : '谢谢你！'}
/>
```

:::info
你可能已经注意到，虽然 `isHungry` 是一个 [const](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/const)，它似乎却可以被重新赋值！这里的 `const` 关键字并不意味着 state 本身是不可变的。相反，它表示包含 state 和用于更新 state 的函数的那个对象的引用不会改变。
实际发生的是，当像 `setIsHungry` 这样的状态设置函数被调用时，它的组件会重新渲染。在这种情况下，`Cat` 函数会再次执行——而这一次，`useState` 会为我们提供 `isHungry` 的下一个值。
:::

最后，把你的猫放进 `Cafe` 组件中：

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
看到上面的 `<>` 和 `</>` 了吗？这些 JSX 片段是 [Fragments](https://react.dev/reference/react/Fragment)。相邻的 JSX 元素必须包裹在一个外层标签中。Fragments 让你无需再嵌套一个额外且不必要的包裹元素，比如 `View`。
:::

---

现在你已经了解了 React 和 React Native 的核心组件，让我们通过查看 [处理 `<TextInput>`](handling-text-input) 来进一步深入了解这些核心组件。
