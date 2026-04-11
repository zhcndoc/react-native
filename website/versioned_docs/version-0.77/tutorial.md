---
id: tutorial
title: 学习基础知识
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

React Native 就像 React，但它使用原生组件而不是 Web 组件作为构建块。所以要理解 React Native 应用的基本结构，你需要理解一些基本的 React 概念，比如 JSX、组件、`state` 和 `props`。如果你已经知道 React，你仍然需要学习一些 React Native 特有的东西，比如原生组件。本教程面向所有受众，无论你是否具有 React 经验。

让我们开始吧。

## 你好世界

按照我们人民的古老传统，我们必须首先构建一个除了说"Hello, world!"之外什么都不做的应用。如下所示：

```SnackPlayer name=Hello%20World
import React from 'react';
import {Text, View} from 'react-native';

const HelloWorldApp = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text>Hello, world!</Text>
    </View>
  );
};
export default HelloWorldApp;
```

如果你感到好奇，可以直接在 Web 模拟器中玩转示例代码。你也可以将其粘贴到你的 `App.js` 文件中，在本地机器上创建一个真实的应用。

## 这里发生了什么？

1. 首先，我们需要导入 `React` 以便能够使用 `JSX`，然后它将被转换为每个平台的原生组件。
2. 在第 2 行，我们从 `react-native` 导入 `Text` 和 `View` 组件。

然后我们定义 `HelloWorldApp` 函数，它是一个 [函数组件](https://react.dev/reference/react/Component)，其行为方式与 Web 上的 React 相同。此函数返回一个带有某些样式的 `View` 组件，并将 `Text` 作为其子组件。

`Text` 组件允许我们渲染文本，而 `View` 组件渲染一个容器。此容器应用了多种样式，让我们分析一下每个样式的作用。

我们发现的第一个样式是 `flex: 1`，[`flex`](layout-props#flex) 属性将定义你的项目如何沿着主轴“填充”可用空间。因为我们只有一个容器，它将占据父组件的所有可用空间。在这种情况下，它是唯一的组件，所以它将占据所有可用的屏幕空间。

接下来的样式是 [`justifyContent`](layout-props#justifycontent): "center"。这将容器的子组件对齐到容器主轴的中心。最后，我们有 [`alignItems`](layout-props#alignitems): "center"，它将容器的子组件对齐到容器交叉轴的中心。

这里的一些东西在你看来可能不像 JavaScript。别慌。_这是未来_。

首先，ES2015（也称为 ES6）是对 JavaScript 的一组改进，它现在是官方标准的一部分，但尚未被所有浏览器支持，因此通常尚未在 Web 开发中使用。React Native 附带了 ES2015 支持，所以你可以使用这些东西而无需担心兼容性。上面示例中的 `import`、`export`、`const` 和 `from` 都是 ES2015 特性。如果你不熟悉 ES2015，你可能可以通过阅读像本教程这样的示例代码来掌握它。如果你愿意，[这个页面](https://babeljs.io/learn-es2015/) 有一个很好的 ES2015 特性概述。

此代码示例中的另一个不寻常的事情是 `<View><Text>Hello world!</Text></View>`。这是 JSX - 一种在 JavaScript 中嵌入 XML 的语法。许多框架使用专门的模板语言，允许你在标记语言中嵌入代码。在 React 中，这是反过来的。JSX 允许你在代码中编写标记语言。它看起来像 Web 上的 HTML，除了像 `<div>` 或 `<span>` 这样的 Web 东西，你使用的是 React 组件。在这种情况下，`<Text>` 是一个显示文本的 [核心组件](intro-react-native-components)，`View` 就像 `<div>` 或 `<span>`。

## 组件

所以这段代码定义了 `HelloWorldApp`，一个新的 `Component`。当你构建 React Native 应用时，你会经常制作新组件。你在屏幕上看到的任何东西都是某种组件。

## Props

大多数组件在创建时可以使用不同的参数进行自定义。这些创建参数称为 props。

你自己的组件也可以使用 `props`。这让你可以制作一个单个组件，在应用中的许多不同地方使用，在每个地方具有略微不同的属性。在你的函数组件中引用 `props.YOUR_PROP_NAME`，或在你的类组件中引用 `this.props.YOUR_PROP_NAME`。这是一个示例：

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer name=Hello%20Props&ext=js
import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
  },
});

const Greeting = props => {
  return (
    <View style={styles.center}>
      <Text>Hello {props.name}!</Text>
    </View>
  );
};

const LotsOfGreetings = () => {
  return (
    <View style={[styles.center, {top: 50}]}>
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

```SnackPlayer name=Hello%20Props&ext=tsx
import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
  },
});

type GreetingProps = {
  name: string;
};

const Greeting = (props: GreetingProps) => {
  return (
    <View style={styles.center}>
      <Text>Hello {props.name}!</Text>
    </View>
  );
};

const LotsOfGreetings = () => {
  return (
    <View style={[styles.center, {top: 50}]}>
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

使用 `name` 作为 prop 允许我们自定义 `Greeting` 组件，所以我们可以为每个问候语重用该组件。此示例还在 JSX 中使用了 `Greeting` 组件。能够做到这一点是 React 如此酷的原因。

这里发生的另一个新事物是 [`View`](view.md) 组件。[`View`](view.md) 用作其他组件的容器很有用，有助于控制样式和布局。

使用 `props` 和基本的 [`Text`](text.md)、[`Image`](image.md) 和 [`View`](view.md) 组件，你可以构建各种各样的静态屏幕。要了解如何让你的应用随时间变化，你需要 [了解 State](#state)。

## State

与 [只读的](https://react.dev/reference/react/Component#props) 且不应修改的 props 不同，`state` 允许 React 组件响应用户操作、网络响应和任何其他事情随时间改变其输出。

#### React 中 state 和 props 有什么区别？

在 React 组件中，props 是我们从父组件传递给子组件的变量。同样，state 也是变量，区别在于它们不是作为参数传递的，而是由组件内部初始化和管理的。

#### React 和 React Native 在处理 state 方面有区别吗？

<div className="two-columns">

```tsx
// 使用 Hooks 的 ReactJS 计数器示例！

import React, {useState} from 'react';



const App = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="container">
      <p>You clicked {count} times</p>
      <button
        onClick={() => setCount(count + 1)}>
        Click me!
      </button>
    </div>
  );
};


// CSS
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}

```

```tsx
// 使用 Hooks 的 React Native 计数器示例！

import React, {useState} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';

const App = () => {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
      <Text>You clicked {count} times</Text>
      <Button
        onPress={() => setCount(count + 1)}
        title="Click me!"
      />
    </View>
  );
};

// React Native 样式
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

</div>

如上所示，在 [React](https://react.dev/learn/state-a-components-memory) 和 `React Native` 之间处理 `state` 没有区别。你可以使用 [hooks](https://reactjs.org/docs/hooks-intro.html) 在类和函数组件中使用组件的 state！

在下面的示例中，我们将使用类展示上述相同的计数器示例。

```SnackPlayer name=Hello%20Classes
import React, {Component} from 'react';
import {StyleSheet, TouchableOpacity, Text, View} from 'react-native';

class App extends Component {
  state = {
    count: 0,
  };

  onPress = () => {
    this.setState({
      count: this.state.count + 1,
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={this.onPress}>
          <Text>Click me</Text>
        </TouchableOpacity>
        <View>
          <Text>You clicked {this.state.count} times</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    marginBottom: 10,
  },
});

export default App;
```
