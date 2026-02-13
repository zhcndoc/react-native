---
title: 对 TypeScript 的一流支持
authors: [lunaleaps, NickGerleman]
tags: [typescript, engineering]
date: 2023-01-03
---

# 对 TypeScript 的一流支持

随着 0.71 版本的发布，React Native 致力于提升 TypeScript 体验，做出了以下改进：

- [新应用模板默认使用 TypeScript](/blog/2023/01/03/typescript-first#new-app-template-is-typescript-by-default)
- [React Native 自带 TypeScript 声明文件](/blog/2023/01/03/typescript-first#declarations-shipped-with-react-native)
- [React Native 文档以 TypeScript 优先](/blog/2023/01/03/typescript-first#documentation-is-typescript-first)

本文将介绍这些变化对你作为 TypeScript 或 Flow 用户意味着什么。

<!--truncate-->

## 新应用模板默认使用 TypeScript

从 0.71 版本开始，通过 React Native CLI 创建的新应用默认将是一个 TypeScript 应用！

```shell
npx react-native init My71App --version 0.71.0
```

![iPhone 模拟器中运行由 React Native CLI 生成的新应用截图。旁边是 Visual Studio Code 编辑器打开的 "App.tsx" 文件截图，说明正在运行 TypeScript 文件。](/blog/assets/typescript-first-new-app.png)

新生成的应用起点将是 `App.tsx`，而非 `App.js` —— 完全使用 TypeScript 类型定义。新项目已经配置好了 `tsconfig.json`，这样你的 IDE 可以开箱即用，协助你立刻编写有类型的代码！

## React Native 自带的声明文件

0.71 是第一个内置 TypeScript（TS）声明文件的版本。

此前，React Native 的 TypeScript 声明文件由托管在 [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) 仓库中的 [`@types/react-native`](https://www.npmjs.com/package/@types/react-native) 提供。将 TypeScript 类型和 React Native 源码共置的决策旨在提升准确性和维护性。

`@types/react-native` 只提供稳定版本的类型定义。这意味着如果你想用 TypeScript 开发预发布版本的 React Native，你只能使用旧版本的类型定义，可能存在不准确之处。发布 `@types/react-native` 过程也容易出错。其版本发布时间滞后于 React Native，且需要手动检查 React Native 公共 API 的类型变更并更新 TS 声明。

将 TS 类型与 React Native 源码共置后，可见性和所有权提升。我们的团队正积极开发工具，保证 Flow 与 TS 之间的类型同步。

此变化也删除了 React Native 用户需管理的一个依赖。升级到 0.71 或更高版本时，可以删除 `@types/react-native` 依赖。[请参阅新应用模板，了解如何设置 TypeScript 支持。](https://github.com/facebook/react-native/blob/main/template/tsconfig.json)

我们计划在 0.73 及以后版本弃用 `@types/react-native`。具体来说：

- 会发布跟踪 React Native 0.71 和 0.72 版本的 `@types/react-native`，它们将与对应发布分支中的类型保持一致。
- 0.73 及以后版本的 React Native，TS 类型将仅由 React Native 自带提供。

### 如何迁移

请尽快迁移到新的共置类型。以下是根据你的情况提供的迁移详情。

#### 应用维护者

升级到 React Native >= 0.71 后，可以从 `devDependency` 中移除 `@types/react-native`。

:::note

如果你看到某个你用的库引用 `@types/react-native` 作为 `peerDependency` 导致警告，请向那个库提交 issue 或 PR，建议其使用 [可选的 peerDependencies](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#peerdependenciesmeta)，暂时忽略警告即可。

:::

#### 库维护者

支持 React Native 0.71 以下版本的库可能会使用 `@types/react-native` 作为 `peerDependency`，以便和应用的类型定义匹配。该依赖应在 [`peerDependenciesMeta`](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#peerdependenciesmeta) 中标记为可选，以使未使用 TypeScript 或已内置类型的 0.71 用户无需安装。

#### 依赖 `@types/react-native` 的 TypeScript 声明维护者

请查看 [0.71 引入的重大变更](https://github.com/facebook/react-native/blob/main/CHANGELOG.md)，确认是否准备好迁移。

### 如果我使用 Flow 怎么办？

Flow 用户仍可对 0.71+ 的应用进行类型检查，但模板中已不再内置相关配置逻辑。

此前，Flow 用户通过合并新应用模板中的 `.flowconfig` 并手动更新 `flow-bin` 来升级 React Native 的 Flow 类型。新应用模板中已无 `.flowconfig`，但 [React Native 仓库中依然保留了一个](https://github.com/facebook/react-native/blob/main/.flowconfig)，可以用作你应用的基础。

如果需要用 Flow 启动新 React Native 应用，可参考 [0.70 的新应用模板](https://github.com/facebook/react-native/tree/0.70-stable/template)。

### 如果我发现 TypeScript 声明有错误怎么办？

无论你使用内置 TS 类型还是 `@types/react-native`，如果发现错误，请提交 PR 至 [React Native](https://github.com/facebook/react-native) 和 [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) 仓库。如果不知道如何修复，请在 React Native 仓库开启 issue，并在 issue 中提及 [@lunaleaps](https://github.com/lunaleaps)。

## 文档以 TypeScript 优先

为了确保一致的 TypeScript 体验，我们对 React Native 文档进行了多项更新，将 TypeScript 作为默认语言。

代码示例现支持内联 TypeScript，且超过 170 个交互式示例已更新，可通过新模板完成代码格式、lint 和类型检查。大多数示例同时符合 TypeScript 和 JavaScript 标准。如示例不兼容两者，你可以任意选择想看的语言版本。

如果你发现错误或有改善建议，别忘了网站是开源的，我们欢迎你的 PR！

## 感谢 React Native TypeScript 社区！

最后，我们要感谢这些年来社区为确保 React Native 开发者可顺利使用 TypeScript 所做的所有努力。

感谢所有自 [2015 年](https://github.com/DefinitelyTyped/DefinitelyTyped/commit/efce0c25ec532a4651859f10eda49e97a5716a42) 起维护 `@types/react-native` 的[贡献者](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react-native/index.d.ts#L3)！大家的付出和细心，确保了 React Native 用户拥有最佳体验。

感谢 [@acoates](https://github.com/acoates)、[@eps1lon](https://github.com/eps1lon)、[@kelset](https://github.com/kelset)、[@tido64](https://github.com/tido64)、[@Titozzz](https://github.com/Titozzz) 和 [@ZihanChen-MSFT](https://github.com/ZihanChen-MSFT) 在咨询、质疑、沟通、审查等方面的帮助，推动了 TypeScript 类型向 React Native 集成的发展。

同样感谢 [react-native-template-typescript 的维护者们](https://github.com/react-native-community/react-native-template-typescript/graphs/contributors)，自一开始就支持 React Native 的 TypeScript 新应用开发体验。

我们期待在 React Native 仓库中更直接地合作，持续改善 React Native 开发者的体验！