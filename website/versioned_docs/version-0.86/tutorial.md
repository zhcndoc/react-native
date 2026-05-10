---
id: tutorial
title: 了解基础知识
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

React Native 就像 React，但它使用原生组件而不是 Web 组件作为构建块。因此，要理解 React Native 应用的基本结构，你需要了解一些 React 的基本概念，比如 JSX、组件、`state` 和 `props`。如果你已经了解 React，你仍然需要学习一些 React Native 特有的内容，比如原生组件。本教程面向所有人，无论你是否有 React 经验。

让我们开始吧。

## Hello World

按照我们族群古老的传统，我们必须先构建一个除了说“Hello, world!”之外什么都不做的应用。如下所示：

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

如果你感到好奇，可以直接在网页模拟器中摆弄示例代码。你也可以把它粘贴到你的 `App.js` 文件中，在本地机器上创建一个真正的应用。

## 这里发生了什么？

1. 首先，我们需要导入 `React`，这样才能使用 `JSX`，而它随后会被转换为各个平台的原生组件。
2. 在第 2 行，我们从 `react-native` 中导入 `Text` 和 `View` 组件

然后我们定义 `HelloWorldApp` 函数，它是一个 [函数组件](https://react.dev/reference/react/Component)，其行为与 Web 端 React 中的函数组件相同。这个函数返回一个带有一些样式的 `View` 组件，以及一个作为其子元素的 `Text`。

`Text` 组件允许我们渲染文本，而 `View` 组件会渲染一个容器。这个容器应用了几个样式，我们来分析一下它们分别在做什么。

我们看到的第一个样式是 `flex: 1`，[`flex`](layout-props#flex) 属性会定义你的项目如何沿主轴“填充”可用空间。由于我们只有一个容器，它将占据父组件的所有可用空间。在这种情况下，它是唯一的组件，因此它将占据屏幕上的所有可用空间。

接下来的样式是 [`justifyContent`](layout-props#justifycontent)：`"center"`。它会将容器的子元素沿容器主轴居中对齐。最后，我们有 [`alignItems`](layout-props#alignitems)：`"center"`，它会将容器的子元素沿容器交叉轴居中对齐。

这里有些东西对你来说可能不像 JavaScript。别慌。_这是未来_。

首先，ES2015（也称为 ES6）是一组对 JavaScript 的改进，如今已成为官方标准的一部分，但并非所有浏览器都支持，因此它在 Web 开发中通常还没有被广泛使用。React Native 自带对 ES2015 的支持，所以你可以放心使用这些内容，而不必担心兼容性。上面示例中的 `import`、`export`、`const` 和 `from` 都是 ES2015 特性。如果你不熟悉 ES2015，你大概可以通过阅读像本教程这样的示例代码来掌握它。如果你愿意，[这个页面](https://babeljs.io/learn-es2015/)对 ES2015 特性有很好的概述。

这个代码示例中另一个不寻常的地方是 `<View><Text>Hello world!</Text></View>`。这就是 JSX——一种在 JavaScript 中嵌入 XML 的语法。许多框架使用一种专门的模板语言，让你可以在标记语言中嵌入代码。而在 React 中，这是反过来的。JSX 让你可以在代码中编写标记语言。它看起来像 Web 上的 HTML，只不过你使用的是 React 组件，而不是 `<div>` 或 `<span>` 之类的 Web 元素。在这里，`<Text>` 是一个 [核心组件](intro-react-native-components)，用于显示文本，而 `View` 则类似于 `<div>` 或 `<span>`。

## 组件

所以这段代码定义了 `HelloWorldApp`，一个新的 `Component`。当你构建 React Native 应用时，你会经常创建新组件。你在屏幕上看到的任何东西都属于某种组件。

## Props

大多数组件在创建时都可以通过不同的参数进行定制。这些创建参数被称为 props。

你自己的组件也可以使用 `props`。这使你能够创建一个单独的组件，并在应用中的许多不同地方使用它，只是在不同的位置赋予它略有不同的属性。在函数组件中引用 `props.YOUR_PROP_NAME`，在类组件中引用 `this.props.YOUR_PROP_NAME`。下面是一个示例：

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

将 `name` 作为一个 prop 使我们能够定制 `Greeting` 组件，因此我们可以在每个问候语中重复使用该组件。这个示例还在 JSX 中使用了 `Greeting` 组件。能够这样做，正是 React 如此酷的原因。

这里另一个新的东西是 [`View`](view.md) 组件。[`View`](view.md) 作为其他组件的容器很有用，可以帮助控制样式和布局。

有了 `props` 以及基础的 [`Text`](text.md)、[`Image`](image.md) 和 [`View`](view.md) 组件，你就可以构建各种各样的静态界面。要学习如何让你的应用随着时间变化，你需要[了解 State](#state)。

## State

与 [只读](https://react.dev/reference/react/Component#props) 且不应被修改的 props 不同，`state` 允许 React 组件根据用户操作、网络响应以及其他任何情况随时间改变它们的输出。

#### React 中 state 和 props 有什么区别？

在 React 组件中，props 是我们从父组件传递给子组件的变量。类似地，state 也是变量，不同之处在于它们不是作为参数传入的，而是由组件在内部初始化和管理。

#### React 和 React Native 在处理 state 时有区别吗？

<div className="two-columns">

```tsx
// 使用 Hooks 的 ReactJS 计数器示例！

import React, {useState} from 'react';



const App = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="container">
      <p>你点击了 {count} 次</p>
      <button
        onClick={() => setCount(count + 1)}>
        点击我！
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
      <Text>你点击了 {count} 次</Text>
      <Button
        onPress={() => setCount(count + 1)}
        title="点击我！"
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

如上所示，React 和 `React Native` 在处理 `state` 方面没有区别。你可以在类组件和函数组件中使用 [hooks](https://react.dev/reference/react/useState) 来使用组件的 state！

在下面的示例中，我们将使用类来展示上面的相同计数器示例。

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
