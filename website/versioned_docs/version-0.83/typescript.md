---
id: typescript
title: 使用 TypeScript
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

[TypeScript][ts] 是一种通过添加类型定义扩展 JavaScript 的语言。新的 React Native 项目默认以 TypeScript 为目标，但也支持 JavaScript 和 Flow。

## 入门 TypeScript

由 [React Native CLI](getting-started-without-a-framework#step-1-creating-a-new-application) 或类似 [Ignite][ignite] 的流行模板创建的新项目默认使用 TypeScript。

TypeScript 也可以与 [Expo][expo] 一起使用，Expo 提供了 TypeScript 模板，或者当您的项目添加 `.ts` 或 `.tsx` 文件时，会提示自动安装和配置 TypeScript。

```shell
npx create-expo-app --template
```

## 向现有项目添加 TypeScript

1. 向项目添加 TypeScript、类型以及 ESLint 插件。

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
该命令会安装所有依赖的最新版本。您可能需要根据项目中已有的包来调整版本。您可以使用类似 [React Native Upgrade Helper](https://react-native-community.github.io/upgrade-helper/) 的工具查看 React Native 自带的版本。
:::

2. 添加 TypeScript 配置文件。在项目根目录下创建 `tsconfig.json`：

```json title="tsconfig.json"
{
  "extends": "@react-native/typescript-config"
}
```

3. 将一个 JavaScript 文件重命名为 `*.tsx`

:::warning
应保留 `./index.js` 作为入口文件，否则在打包生产版本时可能会遇到问题。
:::

4. 运行 `tsc` 来静态检查您的新 TypeScript 文件。

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

## 使用 JavaScript 而非 TypeScript

React Native 默认使用 TypeScript 创建新应用，但仍可使用 JavaScript。带有 `.jsx` 扩展名的文件会被视为 JavaScript 而非 TypeScript，不会进行类型检查。TypeScript 模块仍然可以导入 JavaScript 模块，反之亦然。

## TypeScript 与 React Native 的工作原理

默认情况下，TypeScript 源代码会在打包时由 [Babel][babel] 转换。我们建议只用 TypeScript 编译器做类型检查。这是 `tsc` 新创建应用的默认行为。如果您将现有的 TypeScript 代码迁移至 React Native，使用 Babel 而非 TypeScript 编译器存在 [一两个注意事项][babel-7-caveats]。

## React Native + TypeScript 样例

您可以通过 `React.Component<Props, State>` 为 React 组件的 [Props](props) 和 [State](state) 提供接口，这样在 JSX 中使用该组件时就可以获得类型检查和编辑器自动补全。

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

您可以在 [TypeScript playground][tsplay] 中进一步学习语法。

## 哪里可以找到有用的建议

- [TypeScript 手册][ts-handbook]
- [React 官方文档中的 TypeScript 部分][react-ts]
- [React + TypeScript 备忘单][cheat] 提供了 React 与 TypeScript 的使用概览

## 在 TypeScript 中使用自定义路径别名

如果想在 TypeScript 中使用自定义路径别名，需让别名同时被 Babel 和 TypeScript 识别。具体步骤：

1. 编辑 `tsconfig.json` 以增加您的 [自定义路径映射][path-map]。设置 src 根目录下的路径无需前置路径引用，并允许以 `tests/File.tsx` 访问任何测试文件：

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

2. 将 [`babel-plugin-module-resolver`][bpmr] 作为开发依赖添加到项目中：

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

3. 最后，配置 `babel.config.js`（注意它的语法与 `tsconfig.json` 不同）：

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