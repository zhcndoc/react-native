---
id: tutorial
title: 学习基础知识
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

React Native 和 React 很像，但它使用原生组件而不是网页组件作为构建模块。因此，要理解 React Native 应用的基本结构，你需要了解一些 React 的基础概念，比如 JSX、组件、`state` 和 `props`。如果你已经了解 React，你仍然需要学习一些 React Native 的特定内容，比如原生组件。本教程面向所有读者，无论你是否有 React 经验。

我们开始吧。

## 你好，世界

按照我们民族的古老传统，我们必须先构建一个除了说“你好，世界！”之外什么也不做的应用。如下所示：

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
      <Text>你好，世界！</Text>
    </View>
  );
};
export default HelloWorldApp;
```

如果你感兴趣，可以直接在网页模拟器中把玩示例代码。你也可以把它粘贴到你的 `App.js` 文件中，在本地机器上创建一个真正的应用。

## 这里发生了什么？

1. 首先，我们需要导入 `React`，这样才能使用 `JSX`，它随后会被转换为各个平台的原生组件。
2. 在第 2 行，我们从 `react-native` 中导入了 `Text` 和 `View` 组件

然后我们定义 `HelloWorldApp` 函数，它是一个[函数组件](https://react.dev/reference/react/Component)，其行为与 Web 端的 React 相同。这个函数返回一个带有一些样式的 `View` 组件，以及一个作为其子元素的 `Text`。

`Text` 组件允许我们渲染文本，而 `View` 组件则渲染一个容器。这个容器应用了若干样式，我们来分析一下每个样式的作用。

我们遇到的第一个样式是 `flex: 1`，[`flex`](layout-props#flex) 属性将定义你的元素如何沿主轴“填充”可用空间。由于我们只有一个容器，它会占据父组件的全部可用空间。在这个例子中，它是唯一的组件，因此它会占据全部可用屏幕空间。

接下来的样式是 [`justifyContent`](layout-props#justifycontent): "center"。这会将容器的子元素对齐到容器主轴的中心。最后，我们有 [`alignItems`](layout-props#alignitems): "center"，它会将容器的子元素对齐到容器交叉轴的中心。

这里的一些内容对你来说可能不像 JavaScript。别慌。_这是未来。_

首先，ES2015（也称为 ES6）是一组对 JavaScript 的改进，如今已经成为官方标准的一部分，但并非所有浏览器都支持，所以在 Web 开发中通常还不会使用。React Native 自带 ES2015 支持，因此你可以放心使用这些内容，而不必担心兼容性。上面示例中的 `import`、`export`、`const` 和 `from` 都是 ES2015 特性。如果你对 ES2015 不熟悉，可以通过阅读像本教程这样的示例代码来掌握它。如果你愿意，[这个页面](https://babeljs.io/learn-es2015/)对 ES2015 特性有很好的概述。

这个代码示例里另一个不太寻常的地方是 `<View><Text>你好 world!</Text></View>`。这就是 JSX——一种在 JavaScript 中嵌入 XML 的语法。许多框架使用专门的模板语言，让你把代码嵌入标记语言中。而在 React 中，这是反过来的。JSX 让你把标记语言写在代码里。它看起来像 Web 上的 HTML，只不过你使用的不是 `<div>` 或 `<span>` 这类 Web 元素，而是 React 组件。在这个例子里，`<Text>` 是一个显示文本的 [核心组件](intro-react-native-components)，而 `View` 就像 `<div>` 或 `<span>`。

## 组件

所以这段代码定义了 `HelloWorldApp`，一个新的 `Component`。当你构建 React Native 应用时，你会经常创建新组件。你在屏幕上看到的任何东西都是某种组件。

## Props

大多数组件在创建时都可以通过不同参数进行自定义。这些创建参数称为 props。

你自己的组件也可以使用 `props`。这让你可以在应用的多个不同地方复用同一个组件，只是每个地方的属性略有不同。在你的函数组件中引用 `props.YOUR_PROP_NAME`，或者在类组件中引用 `this.props.YOUR_PROP_NAME`。下面是一个示例：

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
      <Text>你好 {props.name}！</Text>
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
      <Text>你好 {props.name}！</Text>
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

将 `name` 作为 prop 让我们能够自定义 `Greeting` 组件，因此可以在每一个问候语中复用这个组件。这个示例也在 JSX 中使用了 `Greeting` 组件。能够做到这一点，正是 React 如此酷的原因。

这里另一个新东西是 [`View`](view.md) 组件。[`View`](view.md) 适合作为其他组件的容器，有助于控制样式和布局。

有了 `props` 以及基本的 [`Text`](text.md)、[`Image`](image.md) 和 [`View`](view.md) 组件，你就可以构建各种各样的静态界面。要学习如何让应用随着时间变化，你需要[了解 State](#state)。

## State

与 [只读的 props](https://react.dev/reference/react/Component#props) 不同，`state` 允许 React 组件根据用户操作、网络响应以及其他任何事件，随着时间改变它们的输出。

#### React 中 state 和 props 的区别是什么？

在 React 组件中，props 是我们从父组件传递给子组件的变量。类似地，state 也是变量，不同之处在于它们不是作为参数传入的，而是由组件在内部初始化和管理。

#### React 和 React Native 在处理 state 时有区别吗？

<div className="two-columns">

```tsx
// 使用 Hooks 的 React Counter 示例！

import {useState} from 'react';



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
// 使用 Hooks 的 React Native Counter 示例！

import {useState} from 'react';
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

如上所示，在 [React](https://react.dev/learn/state-a-components-memory) 和 `React Native` 中处理 `state` 没有区别。你可以在类组件和函数组件中使用 [hooks](https://react.dev/reference/react/useState) 来使用组件的 state！

在下面的示例中，我们将展示上面的计数器示例的类组件版本。

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
