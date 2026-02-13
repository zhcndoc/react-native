---
title: 在 React Native 中使用 TypeScript
author: Ash Furrow
authorTitle: Artsy 软件工程师
authorURL: 'https://github.com/ashfurrow'
authorImageURL: 'https://avatars2.githubusercontent.com/u/498212?s=460&v=4'
authorTwitter: ashfurrow
tags: [engineering]
---

JavaScript！我们都喜欢它。但我们中的一些人也喜欢[类型](https://en.wikipedia.org/wiki/Data_type)。幸运的是，有办法为 JavaScript 增加更强的类型。我最喜欢的是[TypeScript](https://www.typescriptlang.org)，但 React Native 开箱即用地支持[Flow](https://flow.org)。你喜欢哪个完全是个人偏好，它们各自有自己将类型魔力赋予 JavaScript 的方法。今天，我们来看看如何在 React Native 应用中使用 TypeScript。

本文借助微软的[TypeScript-React-Native-Starter](https://github.com/Microsoft/TypeScript-React-Native-Starter) 仓库作为指南。

**更新**：自从这篇博客文章写成以来，事情变得更简单了。你只需运行一条命令即可替代本博客中所有的设置步骤：

```sh
npx react-native init MyAwesomeProject --template react-native-template-typescript
```

不过，Babel 对 TypeScript 的支持仍存在一些限制，上述博客文章对此有详细说明。本文中介绍的步骤依然有效，Artsy 仍在生产中使用 [react-native-typescript-transformer](https://github.com/ds300/react-native-typescript-transformer)，但最快启动 React Native 和 TypeScript 的方式是使用上述命令。如果需要，之后你也可以随时切换。

无论如何，玩得开心！原始博客内容如下。

## 前提条件

因为你可能在多种不同平台开发，针对多类型设备，基本设置可能比较繁琐。你应首先确保能运行一个不带 TypeScript 的普通 React Native 应用。请按照[React Native 官网的指南开始](/docs/getting-started)。当你成功部署到设备或模拟器后，就可以开始开发 TypeScript React Native 应用了。

你还需要安装 [Node.js](https://nodejs.org/en/)、[npm](https://www.npmjs.com) 和 [Yarn](https://yarnpkg.com/lang/en)。

## 初始化

当你尝试搭建了一个普通的 React Native 项目后，便可以开始添加 TypeScript。我们现在动手操作。

```sh
react-native init MyAwesomeProject
cd MyAwesomeProject
```

## 添加 TypeScript

下一步为项目添加 TypeScript。以下命令将会：

- 向项目添加 TypeScript
- 添加 [React Native TypeScript Transformer](https://github.com/ds300/react-native-typescript-transformer)
- 初始化一个空的 TypeScript 配置文件，我们接下来会配置它
- 添加一个空的 React Native TypeScript Transformer 配置文件，我们也会配置它
- 添加 React 和 React Native 的 [类型定义](https://github.com/DefinitelyTyped/DefinitelyTyped)

好，开始运行它们。

```sh
yarn add --dev typescript
yarn add --dev react-native-typescript-transformer
yarn tsc --init --pretty --jsx react
touch rn-cli.config.js
yarn add --dev @types/react @types/react-native
```

`tsconfig.json` 文件包含所有 TypeScript 编译器的设置。上述命令创建的默认配置大多合适，但打开文件并取消注释以下行：

```js
{
  /* 找到配置文件中的以下行并取消注释。 */
  // "allowSyntheticDefaultImports": true,  /* 允许从无默认导出的模块中默认导入。不会影响代码生成，仅用于类型检查。 */
}
```

`rn-cli.config.js` 包含 React Native TypeScript Transformer 的设置。打开它并添加以下内容：

```js
module.exports = {
  getTransformModulePath() {
    return require.resolve('react-native-typescript-transformer');
  },
  getSourceExts() {
    return ['ts', 'tsx'];
  },
};
```

## 迁移到 TypeScript

将生成的 `App.js` 和 `__tests__/App.js` 文件重命名为 `App.tsx`。`index.js` 仍须使用 `.js` 扩展名。所有新文件应使用 `.tsx` （如果文件含 JSX）或 `.ts` （不含 JSX）。

如果现在尝试运行应用，会出现类似 `object prototype may only be an object or null` 的错误。这是因为在同一行既试图导入 React 的默认导出也导入具名导出失败。打开 `App.tsx`，修改文件顶部的导入：

```diff
-import React, { Component } from 'react';
+import React from 'react'
+import { Component } from 'react';
```

部分原因是 Babel 和 TypeScript 在处理 CommonJS 模块时的互操作差异。未来两者将逐渐统一行为。

此时，你应该能运行 React Native 应用了。

## 添加 TypeScript 测试基础设施

React Native 默认附带 [Jest](https://github.com/facebook/jest)，所以要用 TypeScript 测试 React Native 应用，我们需要向 `devDependencies` 添加 [ts-jest](https://www.npmjs.com/package/ts-jest)。

```sh
yarn add --dev ts-jest
```

接着打开项目的 `package.json`，替换 `jest` 字段为：

```js
{
  "jest": {
    "preset": "react-native",
    "moduleFileExtensions": [
      "ts",
      "tsx",
      "js"
    ],
    "transform": {
      "^.+\\.(js)$": "<rootDir>/node_modules/babel-jest",
      "\\.(ts|tsx)$": "<rootDir>/node_modules/ts-jest/preprocessor.js"
    },
    "testRegex": "(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$",
    "testPathIgnorePatterns": [
      "\\.snap$",
      "<rootDir>/node_modules/"
    ],
    "cacheDirectory": ".jest/cache"
  }
}
```

这样 Jest 就配置为用 `ts-jest` 运行 `.ts` 和 `.tsx` 文件。

## 安装依赖的类型声明

为了在 TypeScript 中获得最佳体验，希望类型检查器能够理解我们依赖库的结构和 API。有些库会自带 `.d.ts` 类型声明文件，能够描述其 JavaScript 形态。其他库则需要我们显式安装 npm `@types/` 范围内的对应包。

例如，这里我们需要为 Jest、React、React Native 和 React Test Renderer 安装类型：

```ts
yarn add --dev @types/jest @types/react @types/react-native @types/react-test-renderer
```

我们把这些声明文件包放在了 _开发依赖_ 中，因为这是一个 React Native _应用_，这些依赖只在开发阶段使用，而非运行时。如果你发布一个库到 NPM，可能需要将某些类型依赖放入正常依赖。

你可以在[这里了解更多关于 `.d.ts` 文件的信息](https://www.typescriptlang.org/docs/handbook/declaration-files/consumption.html)。

## 忽略更多文件

为了你的源代码管理，你会想开始忽略 `.jest` 文件夹。如果你使用 git，直接向 `.gitignore` 添加条目即可。

```config
# Jest
#
.jest/
```

作为一个检查点，考虑将这些文件提交到版本控制。

```sh
git init
git add .gitignore # 先添加这个很重要，这样才能忽略其他文件
git add .
git commit -am "Initial commit."
```

## 添加一个组件

我们来给应用添加一个组件。创建一个 `Hello.tsx` 组件。它是一个教学用途的组件，不是你在生产中必写的东西，但能展示如何在 React Native 中使用 TypeScript。

创建一个 `components` 目录，添加以下示例：

```ts
// components/Hello.tsx
import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';

export interface Props {
  name: string;
  enthusiasmLevel?: number;
}

interface State {
  enthusiasmLevel: number;
}

export class Hello extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    if ((props.enthusiasmLevel || 0) <= 0) {
      throw new Error(
        'You could be a little more enthusiastic. :D',
      );
    }

    this.state = {
      enthusiasmLevel: props.enthusiasmLevel || 1,
    };
  }

  onIncrement = () =>
    this.setState({
      enthusiasmLevel: this.state.enthusiasmLevel + 1,
    });
  onDecrement = () =>
    this.setState({
      enthusiasmLevel: this.state.enthusiasmLevel - 1,
    });
  getExclamationMarks = (numChars: number) =>
    Array(numChars + 1).join('!');

  render() {
    return (
      <View style={styles.root}>
        <Text style={styles.greeting}>
          Hello{' '}
          {this.props.name +
            this.getExclamationMarks(this.state.enthusiasmLevel)}
        </Text>

        <View style={styles.buttons}>
          <View style={styles.button}>
            <Button
              title="-"
              onPress={this.onDecrement}
              accessibilityLabel="decrement"
              color="red"
            />
          </View>

          <View style={styles.button}>
            <Button
              title="+"
              onPress={this.onIncrement}
              accessibilityLabel="increment"
              color="blue"
            />
          </View>
        </View>
      </View>
    );
  }
}

// 样式
const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttons: {
    flexDirection: 'row',
    minHeight: 70,
    alignItems: 'stretch',
    alignSelf: 'center',
    borderWidth: 5,
  },
  button: {
    flex: 1,
    paddingVertical: 0,
  },
  greeting: {
    color: '#999',
    fontWeight: 'bold',
  },
});
```

哇！代码挺多，但我们来拆解一下：

- 我们不是渲染 HTML 元素比如 `div`、`span`、`h1`，而是渲染比如 `View` 和 `Button` 这样的组件。这些是跨平台的原生组件。
- 样式通过 React Native 提供的 `StyleSheet.create` 函数指定。React 的样式表允许我们用 Flexbox 控制布局，使用类似 CSS 的构造进行样式设计。

## 添加组件测试

既然有了组件，我们就来尝试测试它。

我们已经安装了 Jest 作为测试运行器。要对组件编写快照测试，还需要安装用于快照测试的附加库：

```sh
yarn add --dev react-addons-test-utils
```

接着在 `components` 目录下创建 `__tests__` 文件夹，并添加 `Hello.tsx` 的测试：

```ts
// components/__tests__/Hello.tsx
import React from 'react';
import renderer from 'react-test-renderer';

import {Hello} from '../Hello';

it('renders correctly with defaults', () => {
  const button = renderer
    .create(<Hello name="World" enthusiasmLevel={1} />)
    .toJSON();
  expect(button).toMatchSnapshot();
});
```

首次运行测试时，会生成组件渲染的快照并存储于 `components/__tests__/__snapshots__/Hello.tsx.snap` 文件。当你修改组件时，需要更新快照并审查改动，避免不经意的变更。你可以在[这里了解更多关于测试 React Native 组件的信息](https://facebook.github.io/jest/docs/en/tutorial-react-native.html)。

## 下一步

查看官方的[React 教程](https://reactjs.org/tutorial/tutorial.html) 和状态管理库 [Redux](https://redux.js.org)。这些资源在编写 React Native 应用时很有帮助。另外，你还可以看看 [ReactXP](https://microsoft.github.io/reactxp/)，它是一个完全用 TypeScript 编写的组件库，同时支持网页上的 React 和 React Native。

祝你在更类型安全的 React Native 开发环境中玩得愉快！