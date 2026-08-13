---
id: typescript
title: 使用 TypeScript
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

[TypeScript][ts] 是一种通过添加类型定义来扩展 JavaScript 的语言。新的 React Native 项目默认使用 TypeScript，同时也支持 JavaScript 和 Flow。

## 开始使用 TypeScript

通过 [React Native CLI](getting-started-without-a-framework#step-1-creating-a-new-application) 或 [Ignite][ignite] 等热门模板创建的新项目默认使用 TypeScript。

TypeScript 也可以与 [Expo][expo] 一起使用，Expo 维护着 TypeScript 模板；或者，当项目中添加 `.ts` 或 `.tsx` 文件时，Expo 会提示你自动安装并配置 TypeScript。

```shell
npx create-expo-app --template
```

## 将 TypeScript 添加到现有项目

1. 将 TypeScript、类型和 ESLint 插件添加到项目中。

<Tabs groupId="package-manager" queryString defaultValue={constants.defaultPackageManager} values={constants.packageManagers}>
<TabItem value="npm">

```shell
npm install -D typescript @react-native/typescript-config @types/jest @types/react @types/react-test-renderer
```

</TabItem>
<TabItem value="yarn">

```shell
yarn add --dev typescript @react-native/typescript-config @types/jest @types/react @types/react-test-renderer
```

</TabItem>
</Tabs>

:::note
此命令会添加每个依赖项的最新版本。可能需要更改版本，以匹配项目所使用的现有软件包。你可以使用 [React Native Upgrade Helper](https://react-native-community.github.io/upgrade-helper/) 等工具，查看 React Native 所附带的版本。
:::

2. 添加 TypeScript 配置文件。在项目根目录中创建 `tsconfig.json`：

```json title="tsconfig.json"
{
  "extends": "@react-native/typescript-config"
}
```

3. 将一个 JavaScript 文件重命名为 `*.tsx`

:::warning
应保持 `./index.js` 入口文件不变，否则在打包生产构建版本时可能会遇到问题。
:::

4. 运行 `tsc`，对新的 TypeScript 文件进行类型检查。

<Tabs groupId="package-manager" queryString defaultValue={constants.defaultPackageManager} values={constants.packageManagers}>
<TabItem value="npm">

```shell
npx tsc
```

</TabItem>
<TabItem value="yarn">

```shell
yarn tsc
```

</TabItem>
</Tabs>

## 使用 JavaScript 代替 TypeScript

React Native 默认将新应用设置为 TypeScript，但仍然可以使用 JavaScript。扩展名为 `.jsx` 的文件会被视为 JavaScript 而不是 TypeScript，并且不会进行类型检查。JavaScript 模块仍然可以由 TypeScript 模块导入，反之亦然。

## TypeScript 和 React Native 如何工作

开箱即用，TypeScript 源代码会在打包期间由 [Babel][babel] 转换。我们建议仅使用 TypeScript 编译器进行类型检查。这是新创建应用中 `tsc` 的默认行为。如果你有要移植到 React Native 的现有 TypeScript 代码，那么使用 Babel 而非 TypeScript 时存在[一两个注意事项][babel-7-caveats]。

## React Native + TypeScript 是什么样的

你可以通过 `React.Component<Props, State>` 为 React Component 的 [Props](props) 和 [State](state) 提供接口，这样在 JSX 中使用该组件时，就能获得类型检查和编辑器自动补全。

```tsx title="components/Hello.tsx"
import {useState} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';

export type Props = {
  name: string;
  baseEnthusiasmLevel?: number;
};

function Hello({name, baseEnthusiasmLevel = 0}: Props) {
  const [enthusiasmLevel, setEnthusiasmLevel] = useState(
    baseEnthusiasmLevel,
  );

  const onIncrement = () =>
    setEnthusiasmLevel(enthusiasmLevel + 1);
  const onDecrement = () =>
    setEnthusiasmLevel(
      enthusiasmLevel > 0 ? enthusiasmLevel - 1 : 0,
    );

  const getExclamationMarks = (numChars: number) =>
    numChars > 0 ? Array(numChars + 1).join('!') : '';

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>
        Hello {name}
        {getExclamationMarks(enthusiasmLevel)}
      </Text>
      <View>
        <Button
          title="Increase enthusiasm"
          accessibilityLabel="increment"
          onPress={onIncrement}
          color="blue"
        />
        <Button
          title="Decrease enthusiasm"
          accessibilityLabel="decrement"
          onPress={onDecrement}
          color="red"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 16,
  },
});

export default Hello;
```

你可以在 [TypeScript playground][tsplay] 中进一步了解语法。

## 在哪里可以找到有用的建议

- [TypeScript Handbook][ts-handbook]
- [React 关于 TypeScript 的文档][react-ts]
- [React + TypeScript Cheatsheets][cheat] 对如何将 React 与 TypeScript 结合使用进行了很好的概述

## 在 TypeScript 中使用自定义路径别名

要在 TypeScript 中使用自定义路径别名，需要设置路径别名，使其同时适用于 Babel 和 TypeScript。具体方法如下：

1. 编辑 `tsconfig.json`，添加[自定义路径映射][path-map]。将 `src` 根目录中的所有内容设置为无需前置路径引用即可访问，并允许使用 `tests/File.tsx` 访问任意测试文件：

```diff
{
-  "extends": "@react-native/typescript-config"
+  "extends": "@react-native/typescript-config",
+  "compilerOptions": {
+    "baseUrl": ".",
+    "paths": {
+      "*": ["src/*"],
+      "tests": ["tests/*"],
+      "@components/*": ["src/components/*"],
+    },
+  }
}
```

2. 将 [`babel-plugin-module-resolver`][bpmr] 作为开发依赖包添加到项目中：

<Tabs groupId="package-manager" queryString defaultValue={constants.defaultPackageManager} values={constants.packageManagers}>
<TabItem value="npm">

```shell
npm install --save-dev babel-plugin-module-resolver
```

</TabItem>
<TabItem value="yarn">

```shell
yarn add --dev babel-plugin-module-resolver
```

</TabItem>
</Tabs>

3. 最后，配置 `babel.config.js`（注意，`babel.config.js` 的语法与 `tsconfig.json` 不同）：

```diff
{
   presets: ['module:metro-react-native-babel-preset'],
+  plugins: [
+    [
+       'module-resolver',
+       {
+         root: ['./src'],
+         extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
+         alias: {
+           tests: ['./tests/'],
+           "@components": "./src/components",
+         }
+       }
+    ]
+  ]
}
```

[react-ts]: https://react.dev/learn/typescript
[ts]: https://www.typescriptlang.org/
[flow]: https://flow.org
[ts-template]: https://github.com/react-native-community/react-native-template-typescript
[babel]: /docs/javascript-environment#javascript-syntax-transformers
[babel-7-caveats]: https://babeljs.io/docs/en/next/babel-plugin-transform-typescript
[cheat]: https://github.com/typescript-cheatsheets/react-typescript-cheatsheet#reacttypescript-cheatsheets
[ts-handbook]: https://www.typescriptlang.org/docs/handbook/intro.html
[path-map]: https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping
[bpmr]: https://github.com/tleunen/babel-plugin-module-resolver
[expo]: https://expo.io
[ignite]: https://github.com/infinitered/ignite
[tsplay]: https://www.typescriptlang.org/play?strictNullChecks=false&jsx=3#code/JYWwDg9gTgLgBAJQKYEMDG8BmUIjgcilQ3wG4BYAKFEljgG8AhAVxhggDsAaOAZRgCeAGyS8AFkiQweAFSQAPaXABqwJAHcAvnGy4CRdDAC0HFDGAA3JGSpUFteILBI4ABRxgAznAC8DKnBwpiBIAFxwnjBQwBwA5hSUgQBGKJ5IAKIcMGLMnsCpIAAySFZCAPzhHMwgSUhQCZq2lGickXAAEkhCQhDhyIYAdABiAMIAPO4QXgB8vnAAFPRBKCE8KWmZ2bn5nkUlXXMADHCaAJS+s-QBcC0cbQDaSFk5eQXFpTxpMJsvO3ulAF05v0MANcqIYGYkPN1hlnts3vshKcEtdbm1OABJDhoIghLJzebnHyzL4-BG7d5deZPLavSlIuAAajgAEYUWjWvBOAARJC4pD4+B+IkXCJScn0-7U2m-RGlOCzY5lOCyinSoRwIxsuDhQ4cyicu7wWIS+RoIQrMzATgAWRQUAA1t4RVUQCMxA7PJVqrUoMTZm6PV7FXBlXAAIJQKAoATzIOeqDeFnsgYAKwgMXm+AAhPhzuF8DZDYk4EQYMwoBwFtdAmNVBoIoIRD56JFhEhPANbpCYnVNNNa4E4GM5Iomx3W+2RF3YkQpDFYgOh8OOl0evR8ARGqXV4F6MEkDu98P6KbvubLSBrXaHc6afCpVTkce92MAPRjmCD3fD+tqdQfxPOsWDYTgVz3cwYBbAAibEBVSFw1SlGCINXdA0E7PIkmAIRgEEQoUFqIQfBgmIBSFVDfxPTh3Cw1ssRxPFaVfYCbggHooFIpIhGYJAqLY98gOAsZQPYDg0OHKDYL5BC0lVR8-gEti4AwrDgBwvCCKIrpSIAE35ZismUtjaKITxPAYjhZKMmBWOAlpONIog9JMvchIgj8G0AocvIA4SDU0VFmi5CcZzmfgO3ESQYG7AwYGhK5Sx7FA+ygcIktXTARHkcJWS4IcUDw2IOExBKQG9OAYMwrI6hggrfzTXJzEwAQRk4BKsnCaraTq65NAawI5xixcMqHTAOt4YAAC8wjgAAmQ5BuHCasgAdSQYBYjEGBCySDi9PwZbAmvKBYhiPKADZloGqgzmC+xoHgAzMBQZghHgTpuggBIgA
