---
title: '迈向稳定的 JavaScript API（0.80 版本的新变更）'
authors: [huntie, iwoplaza, jpiasecki, coado]
tags: [announcement]
date: 2025-06-12T16:00
---

在 React Native 0.80 版本中，我们引入了 React Native JavaScript API 的两项重要变更——弃用深度导入以及我们的新 Strict TypeScript API。这些都是为精确定义我们的 API 并为用户和框架提供可靠的类型安全所做的持续努力的一部分。

**快速摘要：**

- **弃用深度导入**：从 0.80 版本开始，我们对从 `react-native` 包的深度导入引入弃用警告。
- **可选的 Strict TypeScript API**：我们转向基于源码的 TypeScript 类型以及新的 TypeScript 下的公共 API 基线。这能实现更强且更具未来适应性的类型准确性，将作为一次性破坏性变更。[可通过项目的 `tsconfig.json` 中的 `compilerOptions` 进行选择启用](/blog/2025/06/12/moving-towards-a-stable-javascript-api#strict-typescript-api)。
- 我们将与社区合作，确保这些变更适用于所有人，然后在未来的 React Native 版本中默认启用 Strict TypeScript API。

<!--truncate-->

## 变更内容及原因

我们正着手改进并稳定 React Native 公开的 JavaScript API——即你从 `'react-native'` 导入时获得的内容。

历史上，我们只是大致勾勒出这些。React Native 是用 [Flow](https://flow.org/) 编写的，但社区早已转向使用 TypeScript 开发开源项目，也正是通过 TypeScript 来消费和验证公共 API 兼容性。我们的类型定义是由社区（用心地）贡献的 [社区维护类型](https://www.npmjs.com/package/@types/react-native)，后来被合并并与我们代码库进行对齐。然而，这些类型依赖手动维护，缺乏自动化工具，导致存在准确性差异。

此外，我们的公共 JS API 在模块边界定义上不明晰——例如，内部的 `'react-native/Libraries/'` 深度导入可以被应用代码访问，但内部变更时经常变化。

在 0.80 版本中，我们通过弃用深度导入以及引入用户可选的基于 TypeScript 生成的新 API 基线来解决这些问题。我们称之为 **Strict TypeScript API**。这最终为未来提供一个稳定的 React Native API 打下基础。

## 弃用从 `react-native` 的深度导入

我们今天对 API 做出的主要变更是弃用深度导入 ([RFC](https://github.com/react-native-community/discussions-and-proposals/pull/894))，并在 ESLint 及 JS 控制台中显示警告。值和类型的深度导入应更新为从 `react-native` 根路径导入。

```js title=""
// 之前 - 从子路径导入
import {Alert} from 'react-native/Libraries/Alert/Alert';

// 之后 - 从 `react-native` 根路径导入
import {Alert} from 'react-native';
```

此变更减少了我们的 JavaScript API 总的表面面积，限制为一组固定的导出，这些导出我们可以控制并于未来版本保持稳定。目标是在 0.82 版本中移除这些导入路径。

:::info API 反馈

部分 API 未在根处导出，会因为弃用深度导入而变得不可用。我们有一个**[公开反馈讨论串](https://github.com/react-native-community/discussions-and-proposals/discussions/893)**，将与社区协作确定公共 API 中的导出。请分享您的反馈！

:::

**选择不启用**

请注意，我们目标是在未来版本中移除 React Native 的深度导入，代码应改为使用根导入。

<details>
<summary>**禁用警告**</summary>

#### ESLint

通过 `overrides` 禁用 `no-deep-imports` 规则。

<!-- prettier-ignore -->
```js title=".eslintrc.js"
  overrides: [
    {
      files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
      rules: {
        '@react-native/no-deep-imports': 0,
      },
    },
  ]
```

#### 控制台警告

向 `@react-native/babel-preset` 传入 `disableDeepImportWarnings` 选项。

<!-- prettier-ignore -->
```js title="babel.config.js"
module.exports = {
  presets: [
    ['module:@react-native/babel-preset', {disableDeepImportWarnings: true}]
  ],
};
```

使用 `--reset-cache` 重启你的应用以清除 Metro 缓存。

```sh title=""
npx @react-native-community/cli start --reset-cache
```

</details>
<details>
<summary>**禁用警告（Expo）**</summary>

#### ESLint

通过 `overrides` 禁用 `no-deep-imports` 规则。

<!-- prettier-ignore -->
```js title=".eslintrc.js"
overrides: [
  {
    files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
    rules: {
      '@react-native/no-deep-imports': 0,
    },
  },
];
```

#### 控制台警告

向 `babel-preset-expo` 传入 `disableDeepImportWarnings` 选项。

<!-- prettier-ignore -->
```js title="babel.config.js"
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo', {disableDeepImportWarnings: true}]],
  };
};
```

使用 `--clear` 重启你的应用以清除 Metro 缓存。

```sh name=""
npx expo start --clear
```

</details>

## Strict TypeScript API（可选启用）

Strict TypeScript API 是 `react-native` 包中新提供的一套 TypeScript 类型，可以通过你的 `tsconfig.json` 选择启用。我们会将其和现有的 TS 类型一起发布，意味着你可以在准备好时逐步迁移。

新类型有如下特点：

1. **直接从源码生成** —— 提升覆盖率和正确性，你可以期待更强的兼容性保证。
2. **限定于 `react-native` 的入口文件** —— 更严格定义公共 API，意味着内部文件改动不会破坏 API。

当社区准备就绪，Strict TypeScript API 将成为未来的默认 API——这一计划和深度导入的移除是同步进行的。这意味着现在开始选择启用非常明智，这样你就为 React Native 未来的稳定 JS API 做好准备。

```json title="tsconfig.json"
{
  "extends": "@react-native/typescript-config",
  "compilerOptions": {
    ...
    "customConditions": ["react-native-strict-api"]
  }
}
```

:::note 底层原理

这将指导 TypeScript 从我们新的 [`types_generated/`](https://www.npmjs.com/package/react-native?activeTab=code) 目录解析 `react-native` 类型，而非之前手动维护的 [`types/`](https://www.npmjs.com/package/react-native?activeTab=code) 目录。无需重启 TypeScript 或编辑器。

:::

### 破坏性变更：禁止深度导入

如上所述，在 Strict TypeScript API 下，类型只能从主 `'react-native'` 导入路径解析，以遵循【包封装】(/blog/2023/06/21/package-exports-support)和之前的弃用策略。

```tsx
// 之前 - 从子路径导入
import {Alert} from 'react-native/Libraries/Alert/Alert';

// 之后 - 必须从 `react-native` 导入
import {Alert} from 'react-native';
```

:::tip 关键优势

我们将公共 API 限定为 React Native 的 `index.js` 文件的导出，并对其进行严格维护。这意味着代码库其他文件的变更将不再成为破坏性变更。

:::

### 破坏性变更：部分类型名/类型结构有变

类型现改为从源码生成，而非人工维护。基于此：

- 统一了社区贡献类型之间积累的差异，并提升了源码类型覆盖率。
- 故意更新了某些类型名和类型结构，简化或减少歧义。

:::tip 关键优势

由于类型直接基于 React Native 源码生成，你可以相信类型检查器对对应 `react-native` 版本是**始终准确的**。

:::

#### 示例：更严格的导出符号

`Linking` API 现在是单个 `interface`，而非两个导出。其他多个 API 同样如此（[参见文档](/docs/strict-typescript-api)）。

```tsx
// 之前
import {Linking, LinkingStatic} from 'react-native';

function foo(linking: LinkingStatic) {}
foo(Linking);

// 之后
import {Linking} from 'react-native';

function foo(linking: Linking) {}
foo(Linking);
```

#### 示例：更完善/更准确的类型

之前手工维护的类型定义存在类型缺失的可能性。通过 Flow → TypeScript 生成后，这些缺失已不存在（且 Flow 在多平台代码中具备额外的类型验证）。

```tsx
import {Dimensions} from 'react-native';

// 之前 - 类型错误
// 之后 - 类型为 number | undefined
const {densityDpi} = Dimensions.get();
```

### 其他破坏性变更

请参阅我们的[专门指南](/docs/strict-typescript-api)，详细说明所有破坏性类型变更及更新方式。

## 推出计划

我们理解任何 React Native 的破坏性变更都需要开发者在自己的应用中花时间更新。

#### 现在 — 可选启用（0.80）

`"react-native-strict-api"` 选项在 0.80 版本中已稳定。

- 这是一次性迁移。我们期望应用和库能在接下来的几个版本中自行节奏迁移。
- 无论选择哪种模式，运行时行为不会改变——仅影响 TypeScript 分析。
- **同时**，我们会通过[专门反馈讨论串](https://github.com/react-native-community/discussions-and-proposals/discussions/893) 收集缺失 API 的反馈。

:::tip 推荐

Strict TypeScript API 将成为未来的默认 API。

如果你有时间，建议现在就在你的 `tsconfig.json` 中测试启用，以提前适配你的应用或库。这样能立即评估在严格 API 下是否产生类型错误。**可能完全没有错误！** — 如果是，恭喜你，已准备就绪。

:::

#### 未来 — 默认启用 Strict TypeScript API

未来，我们将要求所有代码库使用 Strict API，并移除旧有类型。

具体时间表将基于社区反馈。至少在接下来的两个 React Native 版本中，Strict API 仍将保持可选启用。

## 常见问题

<details>
<summary>
**我目前使用子路径导入，应该怎么办？**
</summary>

请迁移至根 `'react-native'` 导入路径。

- 子路径导入（如 `'react-native/Libraries/Alert/Alert'`）将变成私有 API。若不限制访问 React Native 内部实现文件，我们无法保证稳定的 JavaScript API。
- 我们希望通过弃用警告得到社区反馈。若你认为我们未暴露某些对你的应用至关重要的代码路径，欢迎通过我们的[集中讨论串](https://github.com/react-native-community/discussions-and-proposals/discussions/893)提出。经合理评估，我们可能会将该 API 提升为根导出。

</details>

<details>
<summary>
**我是库维护者，这会对我有哪些影响？**
</summary>

应用和库都可按自身节奏选择启用，因为 `tsconfig.json` 仅影响当前代码库。

- 通常情况下，React Native 项目中 TypeScript 服务器会忽略 `node_modules` 验证。因此，你库中导出的类型定义是类型检查的最终依据。

**💡 我们需要反馈！** 若遇到与 Strict API 集成有关的问题，请通过我们的[GitHub 反馈](https://github.com/react-native-community/discussions-and-proposals/discussions/893)告知。

</details>

<details>
<summary>
**这是否已经保证 React Native 的最终 API？**
</summary>

遗憾的是，还没有。0.80 版本做了工具层面的投入，保证 React Native 现有的 JS API 基线可以由 TypeScript 准确消费——为未来的稳定变更做好准备。我们正在形式化你熟悉的现有 API。

未来，我们将采取措施最终固定核心中的 API——涵盖所有语言层面。API 变更将通过 RFC/公告进行沟通，通常伴随弃用周期。

</details>

<details>
<summary>
**为什么 React Native 没用 TypeScript 开发？**
</summary>

React Native 是 Meta 的核心基础设施。每次合并变更都会在 Meta 全家桶应用中经过测试，才会推向开源。

在这种规模和敏感度下，正确性至关重要。核心原因是 Flow 为我们提供了比 TypeScript 更好的性能和严格性，并且专门支持 React Native 的多平台特性（详见 [Flow 多平台支持](https://flow.org/en/docs/react/multiplatform/)）。

</details>

## 致谢

这些变更得以实现，感谢 [Iwo Plaza](https://x.com/iwoplaza)、[Jakub Piasecki](https://x.com/breskin67)、[Dawid Małecki](https://github.com/coado)、[Alex Hunt](https://x.com/huntie) 和 [Riccardo Cipolleschi](https://x.com/CipolleschiR)。

同时感谢 [Pieter Vanderwerff](https://github.com/pieterv)、[Rubén Norte](https://github.com/rubennorte) 和 [Rob Hogan](https://x.com/robjhogan) 的额外帮助和建议。

:::note 了解更多

<div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
  <div style={{ flex: 1 }}>
    <strong style={{ display: 'block', marginTop: 8, marginBottom: 8 }}>观看演讲！</strong>
    <span style={{ display: 'block', marginBottom: 8 }}>我们在 <strong>App.js 2025</strong> 中深入分享了 Strict TypeScript API 背后的动机与工作。</span>
    <p style={{ marginBottom: 8 }}>**[YouTube 观看链接](https://www.youtube.com/live/UTaJlqhTk2g?si=SDRmj80kss7hXuGG&t=6520)**</p>
  </div>
  <img
    src="/blog/assets/0.80-js-stable-api-appjs.jpg"
    style={{ flexShrink: 0, maxWidth: '200px', aspectRatio: '16/9', borderRadius: 10 }}
    alt="App.js 2025 演讲"
  />
</div>

:::