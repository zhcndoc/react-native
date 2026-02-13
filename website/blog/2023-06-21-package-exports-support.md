---
title: 'React Native 中的包导出支持'
authors: [huntie]
tags: [公告, metro]
date: 2023-06-21
---

# React Native 中的包导出支持

随着 [React Native 0.72](/blog/2023/06/21/0.72-metro-package-exports-symlinks) 的发布，我们的 JavaScript 构建工具 Metro 现已加入对 `package.json` 中 [`"exports"`](https://nodejs.org/docs/latest-v18.x/api/packages.html#exports) 字段的测试支持。启用后[（详情见此处）](/blog/2023/06/21/package-exports-support#enabling-package-exports-beta)，它提供了以下功能：

- [React Native 项目可开箱即用地支持更多 npm 包](/blog/2023/06/21/package-exports-support#for-app-developers)
- [包维护者可定义其 API 及针对 React Native 的新能力](/blog/2023/06/21/package-exports-support#for-package-maintainers-preview)
- [包解析中的部分破坏性变更（针对边缘情况）](/blog/2023/06/21/package-exports-support#breaking-changes)

本文将介绍包导出的工作原理，以及这些变更对你作为 React Native 应用开发者或包维护者意味着什么。

<!-- truncate -->

## 什么是包导出（Package Exports）？

包导出是 Node.js 12.7.0 引入的现代机制，允许 npm 包指定**入口点**——即可外部导入的包子路径与其应解析到的文件之间的映射。

支持 `"exports"` 可提升 React Native 项目与更广泛 JavaScript 生态系统的兼容性（[目前约有 1.66 万包使用](https://github.com/search?q=path%3A%2A%2A%2Fpackage.json+%22%5C%22access%5C%22%3A+%5C%22public%5C%22%22+%22%5C%22exports%5C%22%22+NOT+path%3A%2A%2A%2Fnode_modules+NOT+is%3Afork+NOT+is%3Aarchived&type=code)），并为包作者提供多平台包针对 React Native 的标准功能集。

[`"exports"`](https://nodejs.org/docs/latest-v19.x/api/packages.html#exports) 可以与 `package.json` 中的 [`"main"`](https://nodejs.org/docs/latest-v19.x/api/packages.html#main) 字段同时使用或替代。

```json
{
  "name": "@storybook/addon-actions",
  "main": "./dist/index.js",
  ...
  "exports": {
    ".": {
      "node": "./dist/index.js",
      "import": "./dist/index.mjs",
      "default": "./dist/index.js"
    },
    "./preview": {
      "import": "./dist/preview.mjs",
      "default": "./dist/preview.js"
    },
    ...
    "./package.json": "./package.json"
  }
}
```

下面是一些应用代码，通过导入 `@storybook/addon-actions` 的不同子路径来使用上述包。

```js
import {action} from '@storybook/addon-actions';
// -> '@storybook/addon-actions/dist/index.js'

import {action} from '@storybook/addon-actions/preview';
// -> '@storybook/addon-actions/dist/preview.js'

import helpers from '@storybook/addon-actions/src/preset/addArgsHelpers';
// 无法访问 - 未在 "exports" 中列出！
```

包导出的主要特性包括：

- **包封装**：只有在 `"exports"` 中定义的子路径才能被包外部导入——赋予包对其公共 API 的控制权。
- **子路径别名**：包可以定义自定义子路径映射到不同的文件位置（包括通过[子路径模式](https://nodejs.org/docs/latest-v19.x/api/packages.html#subpath-patterns)），允许重定位文件的同时保持公共 API 不变。
- **条件导出**：同一子路径可根据环境解析到不同的底层文件，比如针对 `"node"`、`"browser"` 或 `"react-native"` 运行时——替代了之前的 [`"browser"` 字段规范](https://github.com/defunctzombie/package-browser-field-spec)。

:::note
`"exports"` 的完整能力详见 [Node.js 包入口点规范](https://nodejs.org/docs/latest-v19.x/api/packages.html#package-entry-points)。

由于这些功能与 React Native 现有概念（例如[平台特定扩展](/docs/platform-specific-code)）部分重叠，且 `"exports"` 在 npm 生态中已存在一段时间，我们联系了 React Native 社区，确保我们的实现符合开发者需求（[PR](https://github.com/react-native-community/discussions-and-proposals/pull/534)，[最终 RFC](https://github.com/react-native-community/discussions-and-proposals/blob/main/proposals/0534-metro-package-exports-support.md)）。
:::

## 针对应用开发者

包导出功能今天可通过测试版启用。

- 对使用包导出功能的包（例如 [**Firebase**](https://www.npmjs.com/package/firebase) 和 [**Storybook**](https://www.npmjs.com/search?q=%40storybook)）的导入现在应该能正常工作。
- 使用 Metro 的 React Native for Web 项目现在也能使用 `"browser"` 条件导出，省去了许多解决方案。

启用包导出会引入一些 [边缘案例的破坏性变更](#breaking-changes)，可能会影响特定项目，你可以[立即进行验证](#validating-changes-in-your-project)。

**未来 React Native 版本中，包导出将默认启用**。此前 React Native 应用是一些包迁移到 `"exports"` 的瓶颈，或使用我们的 `"react-native"` 根字段作为逃生通道。Metro 支持这些功能将推动整个生态系统发展。

### 启用包导出（测试版）

你可通过在应用的 [**metro.config.js**](https://github.com/facebook/react-native/blob/0.72-stable/packages/react-native/template/metro.config.js) 文件中设置 [`resolver.unstable_enablePackageExports`](https://metrobundler.dev/docs/configuration/#unstable_enablepackageexports-experimental) 选项来启用包导出。

```js
const config = {
  // ...
  resolver: {
    unstable_enablePackageExports: true,
  },
};
```

Metro 还提供两个解析器选项，用于配置条件导出的行为：

- [`unstable_conditionNames`](https://metrobundler.dev/docs/configuration/#unstable_conditionnames-experimental) — 解析条件导出时匹配的[条件名集合](https://nodejs.org/docs/latest-v19.x/api/packages.html#community-conditions-definitions)。默认为 `['require', 'import', 'react-native']`。
- [`unstable_conditionsByPlatform`](https://metrobundler.dev/docs/configuration/#unstable_conditionsbyplatform-experimental) — 针对特定平台目标时额外匹配的条件名。默认为当平台是 `'web'` 时匹配 `'browser'`。

:::tip
**记得使用 React Native 的 [Jest 预设配置](https://github.com/facebook/react-native/blob/main/template/jest.config.js#L2)！** Jest 默认支持包导出。测试时，你可以通过 [`testEnvironmentOptions`](https://jestjs.io/docs/configuration#testenvironmentoptions-object) 选项覆盖 `customExportConditions`。

**如果你使用 TypeScript**，可在项目的 `tsconfig.json` 中设置 [`moduleResolution: 'bundler'`](https://www.typescriptlang.org/tsconfig#moduleResolution) 和 [`resolvePackageJsonImports: false`](https://www.typescriptlang.org/tsconfig#resolvePackageJsonExports) 来匹配解析行为。
:::

#### 验证你项目中的变更

对于现有项目，我们建议提前采用者按照以下步骤，查看启用 `unstable_enablePackageExports` 后解析是否发生变化。这是一次性操作。很可能不会有任何变化，但我们希望开发者能放心选择是否启用。

<details>
<summary>💡 验证你项目中的变更</summary>

:::note
如果你不使用 Yarn，请将 `yarn` 替换为 `npx`（或项目里用到的相关工具）。
:::

1. 获取所有解析依赖（变更前）：

   ```sh
   # 如有需要，将 index.js 替换为你的入口文件，比如 App.js
   yarn metro get-dependencies index.js --platform android --output before.txt
   ```

   - **Expo CLI**：如果项目中无 `metro.config.js` 文件，运行 `npx expo customize metro.config.js`。
   - 为覆盖所有平台，请替换 `--platform android` 为项目使用的其他平台（如 `ios`、`web`）。

2. 在 `metro.config.js` 中启用 `resolver.unstable_enablePackageExports`。
3. 获取所有解析依赖（变更后）：

   ```sh
   yarn metro get-dependencies index.js --platform android --output after.txt
   ```

4. 对比文件差异：

   ```sh
   diff before.txt after.txt
   ```

</details>

### 破坏性变更

我们在 Metro 中采用了符合规范的包导出实现（因此引入了某些破坏性变更），但同时保持向后兼容性（帮助已有导入的应用逐步迁移）。

最主要的破坏性变化是：当包的 `package.json` 中存在 `"exports"` 字段时，Metro 会优先咨询该字段（优先于其他字段），并直接使用匹配子路径的目标映射。

- Metro 不会对导入标识符应用 [`sourceExts`](https://metrobundler.dev/docs/configuration/#sourceexts) 扩展名扩展。
- Metro 不会对目标文件应用[平台特定扩展](/docs/platform-specific-code)。

更多详情请参考 Metro 文档中的所有 [**破坏性变更**](https://metrobundler.dev/docs/package-exports#summary-of-breaking-changes)。

### 包封装是宽松的

当 Metro 遇到未列在 `"exports"` 中的子路径时，**会回退到传统解析**。这是兼容性特性，旨在减少现存 React Native 项目中允许的导入所带来的用户摩擦。

Metro 不会抛出错误，而是记录警告：

```sh
warn: 你导入了模块 "foo/private/fn.js"，但它未列在 "foo" 包的 "exports" 中。建议更新调用位置或联系包维护者以公开该 API。
```

:::note
我们计划未来引入严格模式，实现与 Node 默认行为一致的包封装策略。因此，**建议所有开发者在出现警告时积极修正**。
:::

## 针对包维护者（预览）

:::info
根据我们的[发布计划](#the-future-stable-exports-enabled-by-default)，包导出将在本年度稍晚发布的下一个 React Native 版本（0.73）中对大多数项目默认启用。

**我们暂无计划在近期移除对 `"main"` 字段以及其他当前包解析功能的支持。**
:::

包导出让你能限制包的内部访问权限，并提供更可预测的手段来针对 React Native 和 React Native for Web 编写库。

### 如果你今天已经使用 `"exports"`

若你的包同时使用 `"exports"` 和现有的 `"react-native"` 根字段，请留意上述用户侧的[破坏性变更](#breaking-changes)。启用此功能的用户在模块解析时，`"exports"` 会被优先考虑。

实际中，我们预测用户面临的主要变更是应用中对不可访问子路径的警告（通过遵守包封装机制）。

### 迁移到 `"exports"`

**向包中添加 `"exports"` 字段是完全可选的**。不使用 `"exports"` 的包将按当前方式保持行为不变——我们也无意移除这套行为。

但我们认为 `"exports"` 的新特性为 React Native 包维护者带来了强有力的功能集：

- **收紧包的 API**：这是个很好的机会，审查和正式定义你包的模块 API，通过导出子路径别名防止用户访问内部 API，减少潜在的 bug 面。
- **条件导出**：如果目标是 React Native for Web（即同时兼容 `"react-native"` 和 `"browser"`），现在包可以控制这些条件的解析顺序（见下节）。

如果决定引入 `"exports"`，**建议将此作为破坏性变更发布**。Metro 文档中已准备 [**迁移指南**](https://metrobundler.dev/docs/package-exports#migration-guide-for-package-maintainers)，包括如何替代平台特定扩展等功能。

:::note
**请勿依赖 Metro 实现中的宽松行为。** 虽然 Metro 兼容老版行为，但包应遵循规范中记录且其他工具严格执行的 `"exports"` 规则。
:::

### 新的 `"react-native"` 条件

我们新增了 `"react-native"` 作为社区条件（用于条件导出）。该条件代表 React Native 框架，与其它被认可的运行时如 `"node"`、`"deno"` 并列（参见 [RFC](https://github.com/nodejs/node/pull/45367)）。

:::info
[社区条件定义 — **`"react-native"`**](https://nodejs.org/docs/latest-v19.x/api/packages.html#community-conditions-definitions)

_将匹配所有平台下的 React Native 框架。对于 React Native for Web，应在此条件之前指定 `"browser"`。_
:::

这替代了之前的 `"react-native"` 根字段。之前解析此字段的优先顺序由项目自行决定，导致[在使用 React Native for Web 时存在歧义](https://github.com/expo/router/issues/37#issuecomment-1275925758)。使用 `"exports"` 后，**包明确规定了条件入口点的解析顺序**，消除了歧义。

```json
  "exports": {
    "browser": "./dist/index-browser.js",
    "react-native": "./dist/index-react-native.js",
    "default": "./dist/index.js"
  }
```

:::note
我们没有引入 `"android"` 和 `"ios"` 条件，原因是已有其他成熟的跨框架平台选择方案，且这类条件的行为复杂。请使用 [`Platform.select()`](/docs/platform#select) API 代替。
:::

## 未来：默认启用、稳定的 `"exports"`

在下一版本 React Native 中，我们计划移除此功能的 `unstable_` 前缀（解决预定的性能工作和所有 Bug），并默认启用包导出解析。

启用 `"exports"` 后，我们将引领 React Native 社区向前发展——例如，React Native 核心包可更新以更好地划分公共与内部模块。

![Package Exports 支持的发布计划](../static/blog/assets/package-exports-rollout.png)

## 致谢

感谢 React Native 社区成员对该 RFC 的反馈支持：[SimenB](https://github.com/SimenB)、[tido64](https://github.com/tido64)、[byCedric](https://github.com/byCedric)、[thymikee](https://github.com/thymikee)。

特别感谢 Meta 的 [motiz88](https://github.com/motiz88) 和 [robhogan](https://github.com/robhogan) 对该功能开发的支持。