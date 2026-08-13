---
id: tutorial
title: 学习基础知识
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

React Native 类似于 React，但它使用原生组件而不是 Web 组件作为构建模块。因此，要理解 React Native 应用的基本结构，你需要了解一些基本的 React 概念，例如 JSX、组件、`state` 和 `props`。如果你已经了解 React，仍然需要学习一些 React Native 特有的内容，例如原生组件。本教程面向所有读者，无论你是否有 React 使用经验。

让我们开始吧。

## Hello World

按照我们民族的古老传统，我们必须首先构建一个除了说“Hello，world！”之外什么都不做的应用。就是这样：

```SnackPlayer name=Hello%20World
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

如果你好奇，可以直接在 Web 模拟器中运行示例代码。你也可以将其粘贴到本地计算机上的 `App.js` 文件中，以创建一个真实的应用。

## 这里发生了什么？

1. 首先，我们需要导入 `React` 才能使用 `JSX`，之后它会被转换为各个平台的原生组件
2. 在第 2 行，我们从 `react-native` 中导入 `Text` 和 `View` 组件

然后我们定义 `HelloWorldApp` 函数，它是一个[函数组件](https://react.dev/reference/react/Component)，其行为与 Web 端 React 中的函数组件相同。这个函数返回一个带有一些样式的 `View` 组件，并将一个`Text` 作为其子组件。

`Text` 组件允许我们渲染文本，而 `View` 组件则渲染一个容器。这个容器应用了多种样式，让我们来分析每种样式的作用。

我们看到的第一个样式是 `flex: 1`，[`flex`](layout-props#flex) 属性将定义你的项目如何沿主轴“填充”可用空间。由于我们只有一个容器，它将占用父组件的全部可用空间。在本例中，它就是唯一的组件，因此会占用屏幕上全部的可用空间。

接下来的样式是 [`justifyContent`](layout-props#justifycontent)：“center”。这会将容器的子元素沿容器的主轴居中对齐。最后是 [`alignItems`](layout-props#alignitems)：“center”，它会将容器的子元素沿容器的交叉轴居中对齐。

这里有些内容可能看起来不像 JavaScript。不要惊慌。_这就是未来_。

首先，ES2015（也称为 ES6）是一组对 JavaScript 的改进，现在已经成为官方标准的一部分，但还没有得到所有浏览器的支持，因此在 Web 开发中通常还没有被广泛使用。React Native 自带对 ES2015 的支持，所以你可以放心使用这些特性，而不必担心兼容性。上面示例中的 `import`、`export`、`const` 和 `from` 都是 ES2015 特性。如果你不熟悉 ES2015，通过阅读类似本教程中的示例代码，你可能就能掌握它。如果你愿意，[这个页面](https://babeljs.io/learn-es2015/)对 ES2015 特性进行了很好的概述。

这个代码示例中的另一个不同寻常之处是 `<View><Text>Hello world!</Text></View>`。这就是 JSX——一种在 JavaScript 中嵌入 XML 的语法。许多框架都使用专门的模板语言，让你能够在标记语言中嵌入代码。而在 React 中，情况正好相反。JSX 让你能够在代码中编写标记语言。它看起来像 Web 上的 HTML，只不过你使用的是 React 组件，而不是 `<div>` 或 `<span>` 之类的 Web 元素。在本例中，`<Text>` 是一个用于显示文本的[核心组件](intro-react-native-components)，而 `View` 类似于 `<div>` 或 `<span>`。

## 组件

所以，这段代码定义了一个新的`Component`，名为 `HelloWorldApp`。构建 React Native 应用时，你会经常创建新组件。屏幕上看到的任何内容都属于某种组件。

## Props

大多数组件在创建时都可以通过不同的参数进行定制。这些创建参数称为 props。

你自己的组件也可以使用 `props`。这样，你就可以创建一个组件，并在应用中的许多不同位置使用它，同时在每个位置设置略有不同的属性。在函数组件中使用 `props.YOUR_PROP_NAME`，或在类组件中使用 `this.props.YOUR_PROP_NAME`。下面是一个示例：

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer name=Hello%20Props&ext=js
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

使用 `name` 作为 prop 可以让我们定制 `Greeting` 组件，这样我们就能在每次问候时复用该组件。这个示例还在 JSX 中使用了 `Greeting` 组件。正是这种能力让 React 如此酷炫。

这里发生的另一件新事情是 [`View`](view.md) 组件。[`View`](view.md) 可以作为其他组件的容器，用于帮助控制样式和布局。

借助 `props` 以及基础的 [`Text`](text.md)、[`Image`](image.md) 和 [`View`](view.md) 组件，你可以构建各种各样的静态界面。要了解如何让应用随时间发生变化，你需要[了解 State](#state)。

## State

与[只读](https://react.dev/reference/react/Component#props)且不应被修改的 props 不同，`state` 允许 React 组件根据用户操作、网络响应以及其他任何因素随时间改变其输出。

#### React 中 state 和 props 有什么区别？

在 React 组件中，props 是我们从父组件传递给子组件的变量。类似地，state 也是变量，不同之处在于它们不会作为参数传递，而是由组件在内部进行初始化和管理。

#### React 和 React Native 在处理 state 方面有区别吗？

<div className="two-columns">

```tsx
// React Counter Example using Hooks!

import {useState} from 'react';



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
// React Native Counter Example using Hooks!

import {useState} from 'react';
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

// React Native Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

</div>

如上所示，[React](https://react.dev/learn/state-a-components-memory) 和 `React Native` 在处理 `state` 方面没有区别。你可以在类组件和函数组件中使用组件的 state，并通过 [hooks](https://react.dev/reference/react/useState) 实现这一点！

在下面的示例中，我们将使用类来展示与上面相同的计数器示例。

```SnackPlayer name=Hello%20Classes
import {Component} from 'react';
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
