---
id: tutorial
title: 学习基础知识
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

React Native 就像 React，但它使用原生组件而不是网页组件作为构建模块。所以，要理解一个 React Native 应用的基本结构，你需要理解一些基本的 React 概念，比如 JSX、组件、`state` 和 `props`。如果你已经了解 React，你仍然需要学习一些 React Native 特有的内容，比如原生组件。本教程适合所有人群，无论你有没有 React 经验。

让我们开始吧。

## Hello World

遵循我们祖先的古老传统，我们必须先构建一个除了显示"Hello, world!"外什么都不做的应用。代码如下：

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

如果你感到好奇，可以直接在网页模拟器中玩转示例代码。你也可以将其粘贴到你的 `App.js` 文件中，在本地机器上创建一个真正的应用。

## 这里发生了什么？

1. 首先，我们需要导入 `React`，以便能使用 `JSX`，它随后会被转换为各个平台的原生组件。
2. 在第二行，我们从 `react-native` 中导入了 `Text` 和 `View` 组件。

接着我们定义了 `HelloWorldApp` 函数，这是一个 [函数组件](https://react.dev/reference/react/Component)，行为和网页上的 React 一样。该函数返回一个带有样式的 `View` 组件，里面包含一个 `Text` 作为子组件。

`Text` 组件用于渲染文本，而 `View` 组件渲染一个容器。这个容器被应用了几种样式，让我们来分析每一项的作用。

首先是 `flex: 1`，[`flex`](layout-props#flex) 属性决定你的项目沿主轴将如何“填充”可用空间。由于这里只有一个容器，它会占满父组件所有可用空间。本例中它是唯一组件，因此会占满整个屏幕可用空间。

接下来是 [`justifyContent`](layout-props#justifycontent): "center"，它将容器的子组件沿主轴居中对齐。最后是 [`alignItems`](layout-props#alignitems): "center"，它将容器的子组件沿交叉轴居中对齐。

这里的一些内容你可能看起来不像 JavaScript，不用慌。_这就是未来_。

首先，ES2015（又名 ES6）是一组对 JavaScript 的改进，现在已成为官方标准，但还未被所有浏览器支持，所以通常 web 开发还未完全使用。React Native 内置支持 ES2015，因此你可以放心使用这些新特性。示例中的 `import`、`export`、`const` 和 `from` 都是 ES2015 特性。如果你不熟悉 ES2015，可以通过阅读本教程中的示例代码来学习这部分内容。如果想要系统了解，[这个页面](https://babeljs.io/learn-es2015/) 提供了 ES2015 特性的良好概览。

另一个代码中不寻常的部分是 `<View><Text>Hello world!</Text></View>`。这是 JSX —— 一种允许你在 JavaScript 中嵌入 XML 的语法。许多框架使用专门的模板语言，允许你在标记语言中嵌入代码。而 React 则相反，JSX 允许你在代码中写标记语言。看起来类似网页上的 HTML，但不是用 `<div>` 或 `<span>` 这些网页元素，而是用 React 组件。这里 `<Text>` 是一个 [核心组件](intro-react-native-components)，用于显示文本，`View` 则类似 `<div>` 或 `<span>`。

## 组件

这段代码定义了一个新的 `Component` —— `HelloWorldApp`。当你构建 React Native 应用时，会经常创建新组件。屏幕上看到的任何事物都是某种组件。

## Props

大多数组件都可以在创建时通过不同参数进行定制。这些创建时传入的参数称为 props。

你自己的组件也可以使用 `props`。这允许你创建一个组件，并在应用的多个位置以不同的属性复用它。在函数组件中通过 `props.YOUR_PROP_NAME` 访问，在类组件中通过 `this.props.YOUR_PROP_NAME` 访问。示例如下：

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

使用 `name` 作为 prop 让我们可以自定义 `Greeting` 组件，这样可以在每个问候中复用该组件。这个例子也在 JSX 中使用了 `Greeting` 组件。能够这样做正是 React 很酷的原因。

这里的另一个新玩意是 [`View`](view.md) 组件。[`View`](view.md) 主要用作其他组件的容器，帮助控制样式和布局。

通过 `props` 和基本的 [`Text`](text.md)、[`Image`](image.md) 与 [`View`](view.md) 组件，你可以构建各种静态界面。想要让你的应用随时间变化，接下来你需要 [了解 State](#state)。

## State

与只读的 props 不同（[props 是只读的](https://react.dev/reference/react/Component#props)，不应被修改），`state` 允许 React 组件随着时间推移响应用户操作、网络响应等事件，动态更新其输出。

#### React 中 state 和 props 有何区别？

在 React 组件中，props 是从父组件传递给子组件的变量。state 也是变量，但不同之处在于它们不是作为参数传递，而是组件内部初始化和管理的。

#### React 和 React Native 对状态管理有区别吗？

<div className="two-columns">

```tsx
// ReactJS 使用 Hooks 实现计数器示例！

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
// React Native 使用 Hooks 实现计数器示例！

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

如上所示，React（[React 状态介绍](https://react.dev/learn/state-a-components-memory)）和 React Native 之间在处理 `state` 上没有区别。你可以使用类组件的 state，也可以通过 [hooks](https://react.dev/reference/react/useState) 在函数组件中使用 state！

下面的示例展示了同样的计数器，使用类组件实现。

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
          <Text>点击我</Text>
        </TouchableOpacity>
        <View>
          <Text>你点击了 {this.state.count} 次</Text>
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
