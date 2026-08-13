---
id: strict-typescript-api
title: 严格 TypeScript API
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import RNRepoLink from '@site/core/RNRepoLink';

:::info[0.87 新增]

**Strict API 现已默认启用**（此前在 0.80 及更高版本中需要选择启用）。这是一项**破坏性变更**，详情请参阅下方指南。

:::

Strict TypeScript API 是 React Native 现代化的 TypeScript API，用于替代早期版本中之前由人工维护的 TypeScript 定义。

### 主要变更（破坏性变更）

1. **不再支持深层导入。** API 仅限于 `react-native` 的索引文件。这是一份更严格且更有意设计的公共 API 合约，也确保 React Native 源代码中的内部文件路径变更不会造成破坏性影响。
2. **直接从源代码生成。** 之前，React Native 使用单独维护的手写类型。现在从源代码生成类型，意味着我们可以改进覆盖范围、正确性和兼容性保证。

### 选择退出 <div className="label primary">自 0.87 起</div>

Strict API 是一项**破坏性变更**，并非所有应用和库都能立即完成迁移。

我们仍会继续提供之前的手写类型，你可以通过 `tsconfig.json` 配置恢复使用。请注意，我们将在未来的版本中移除这一选择退出机制。

```diff title="tsconfig.json"
  {
    "extends": "@react-native/typescript-config",
    "compilerOptions": {
      ...
+     "customConditions": ["react-native", "react-native-legacy-deep-imports"]
    }
  }
```

:::info[有问题／反馈？]

默认启用 Strict API 的 0.87 版本发布是一次生态系统范围的变更，也是我们为了确保 React Native 在未来拥有稳定 API 保证而必须进行的变更。

自最初的 0.80 预览版以来，我们一直与社区和合作伙伴共同研究哪些 API 应在根目录导出，以及对类型名称／形状进行有意的更新。

我们相信已经解决了所有明显问题，但可能仍然存在边缘情况。如果你选择在 0.87 或更高版本中退出 Strict API，我们很希望了解原因：[**讨论主题**](https://github.com/react-native-community/discussions-and-proposals/discussions/1015)。

:::

---

## 迁移指南

:::tip

使用 [**/migrate-to-strict-api**](https://www.skills.sh/react-native-community/skills/migrate-to-strict-api) skill，通过代理迁移你的代码库。

```sh
npx skills add react-native-community/skills --skill migrate-to-strict-api
```

:::

### 开始之前

启用 Strict API——升级到 0.87，或在更早的版本中选择启用——只会影响 TypeScript 对你自己项目的分析，作用范围由项目的 `tsconfig.json` 决定。

在大多数情况下，代码库可以独立迁移——应用开发者不需要等待特定依赖完成选择启用，库作者也不需要等待用户完成选择启用。

#### 保持启用 `skipLibCheck`

上述机制依赖于 `skipLibCheck`，而 `@react-native/typescript-config` 默认会启用该选项。这样可以避免第三方 `.d.ts` 文件中的错误出现在结果中。如果你的项目覆盖了该设置，请在开始之前重新启用它——否则你会看到无法修复的依赖项错误。

#### 更新你的依赖

在 Strict API 下，你的依赖偶尔可能存在问题。当类型错误涉及某个库时，请先检查并更新到已修复问题的版本。

一个具体的问题是：某些库会提供原始 TypeScript 源代码供你的项目导入，例如 Jest 设置文件。这些代码会作为项目的一部分进行类型检查。一些热门库已经重新打包了这些入口：

- `@expensify/react-native-live-markdown` — 在 [0.1.335](https://github.com/Expensify/react-native-live-markdown/pull/771) 中修复
- `react-native-safe-area-context` — 在 [5.8.1](https://github.com/AppAndFlow/react-native-safe-area-context/pull/745) 中修复

<details>
<summary>**高级：排除不兼容的库**</summary>

如果某个不兼容的库在 `node_modules` 下产生错误（通常为 `TS2307: Cannot find module 'react-native/Libraries/...'`），你可以通过将导入的子路径重定向到无类型存根，将其排除在 TypeScript 分析之外，作为本地修复方案：

```json title="tsconfig.json"
{
  "compilerOptions": {
    "paths": {
      "some-library/jest/mock": ["./untyped-module.d.ts"]
    }
  }
}
```

```ts title="untyped-module.d.ts"
declare const anyExport: unknown;
export default anyExport;
```

同时也请向该库报告此不兼容问题——上面链接的修复方案是很好的参考模板。

</details>

### 新的 `CodegenTypes` 命名空间

用于 codegen 的类型，例如 `Int32`、`Double`、`WithDefault` 等，现在都可以在单一的 `CodegenTypes` 命名空间下使用。同样，`codegenNativeComponent` 和 `codegenNativeCommands` 现在可以直接从 react-native 包导入，而不是使用深度导入。

当未启用 Strict API 时，带命名空间的 `CodegenTypes` 以及 `codegenNativeCommands` 和 `codegenNativeComponent` 也可以从 `react-native` 包中使用，以便第三方库更容易采用。

#### 迁移

<Tabs defaultValue="after">
<TabItem value="before" label="迁移前">

```ts title=""
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type {
  Int32,
  WithDefault,
} from 'react-native/Libraries/Types/CodegenTypes';

interface NativeProps extends ViewProps {
  enabled?: WithDefault<boolean, true>;
  size?: Int32;
}

export default codegenNativeComponent<NativeProps>(
  'RNCustomComponent',
);
```

</TabItem>
<TabItem value="after" label="迁移后">

```ts title=""
import {CodegenTypes, codegenNativeComponent} from 'react-native';

interface NativeProps extends ViewProps {
  enabled?: CodegenTypes.WithDefault<boolean, true>;
  size?: CodegenTypes.Int32;
}

export default codegenNativeComponent<NativeProps>(
  'RNCustomComponent',
);
```

</TabItem>
</Tabs>

### Refs 现在使用 `*Instance` 类型 <div className="label primary">自 0.87 起</div>

现在，每个内置组件都有专用的 `*Instance` 类型用于 refs——例如 `ViewInstance`、`TextInputInstance`、`ScrollViewInstance`。在 Strict TypeScript API 下，这些是**为 refs 设置类型的推荐方式**。

此前，`useRef<View>` 可以正常工作，是因为 `View` 和其他组件被作为类进行类型化。在 Strict API 下，内置组件被作为函数进行类型化，因此 `View` 指的是函数本身——**组件类型名称不再适合作为 ref 类型**。

<Tabs defaultValue="after">
<TabItem value="before" label="迁移前">

```tsx title=""
import {useRef} from 'react';
import {View, TextInput} from 'react-native';

function MyComponent() {
  const viewRef = useRef<View>(null);
  const inputRef = useRef<TextInput>(null);

  return (
    <>
      <View ref={viewRef} />
      <TextInput ref={inputRef} />
    </>
  );
}
```

</TabItem>
<TabItem value="after" label="迁移后">

```tsx title=""
import {useRef} from 'react';
import type {
  TextInput,
  TextInputInstance,
  View,
  ViewInstance,
} from 'react-native';

function MyComponent() {
  const viewRef = useRef<ViewInstance>(null);
  const inputRef = useRef<TextInputInstance>(null);

  return (
    <>
      <View ref={viewRef} />
      <TextInput ref={inputRef} />
    </>
  );
}
```

</TabItem>
</Tabs>

`*Instance` 类型也可以透明地与 `Animated` 变体配合使用——不需要单独的类型：

```tsx title=""
const viewRef = useRef<ViewInstance>(null);

<View ref={viewRef} />
<Animated.View ref={viewRef} />
```

这也替代了已移除的 `Animated.LegacyRef` 类型。使用 `ref={ref as React.Ref<Animated.LegacyRef<View>>}` 的代码，可以简化为对使用 `ViewInstance` 类型的 ref 使用 `ref={ref}`。

<details>
<summary>**可用的实例类型**</summary>

| 组件                      | 实例类型                          |
| ------------------------- | --------------------------------- |
| `ActivityIndicator`       | `ActivityIndicatorInstance`       |
| `Button`                  | `ButtonInstance`                  |
| `DrawerLayoutAndroid`     | `DrawerLayoutAndroidInstance`     |
| `FlatList`                | `FlatListInstance`                |
| `Image`                   | `ImageInstance`                   |
| `ImageBackground`         | `ImageBackgroundInstance`         |
| `KeyboardAvoidingView`    | `KeyboardAvoidingViewInstance`    |
| `Modal`                   | `ModalInstance`                   |
| `Pressable`               | `PressableInstance`               |
| `ProgressBarAndroid`      | `ProgressBarAndroidInstance`      |
| `RefreshControl`          | `RefreshControlInstance`          |
| `SafeAreaView`            | `SafeAreaViewInstance`            |
| `ScrollView`              | `ScrollViewInstance`              |
| `SectionList`             | `SectionListInstance`             |
| `StatusBar`               | `StatusBarInstance`               |
| `Switch`                  | `SwitchInstance`                  |
| `Text`                    | `TextInstance`                    |
| `TextInput`               | `TextInputInstance`               |
| `TouchableHighlight`      | `TouchableHighlightInstance`      |
| `TouchableNativeFeedback` | `TouchableNativeFeedbackInstance` |
| `TouchableOpacity`        | `TouchableOpacityInstance`        |
| `View`                    | `ViewInstance`                    |
| `VirtualizedList`         | `VirtualizedListInstance`         |
| `VirtualizedSectionList`  | `VirtualizedSectionListInstance`  |

不支持 ref 的组件（`InputAccessoryView`、`TouchableWithoutFeedback`、`experimental_LayoutConformance`）没有实例类型。

</details>

**迁移**

| 迁移前                                          | 迁移后                       |
| ----------------------------------------------- | ---------------------------- |
| `useRef<View>(null)`                            | `useRef<ViewInstance>(null)` |
| `useRef<React.ComponentRef<typeof View>>(null)` | `useRef<ViewInstance>(null)` |
| `useRef<HostInstance>(null)`（针对特定组件）    | `useRef<ViewInstance>(null)` |
| `Ref<Animated.LegacyRef<View>>`                 | `Ref<ViewInstance>`          |

:::note

`React.ComponentRef<typeof View>` 仍然有效，并会生成与 `ViewInstance` 相同的类型。`*Instance` 类型是便捷的别名——两种方式都可以使用。

:::

### 移除 `*Static` 类型

#### 迁移

<Tabs defaultValue="after">
<TabItem value="before" label="迁移前">

```tsx title=""
import {Linking, LinkingStatic} from 'react-native';

function foo(linking: LinkingStatic) {}
foo(Linking);
```

</TabItem>
<TabItem value="after" label="迁移后">

```tsx title=""
import {Linking} from 'react-native';

function foo(linking: Linking) {}
foo(Linking);
```

</TabItem>
</Tabs>

以下 API 之前的命名方式是 `*Static`，并带有一个声明为该类型的变量。在大多数情况下，存在一个别名，因此值和类型会以同一个标识符导出，但也有一些缺少别名。

<details>
<summary>**受影响的 API**</summary>

- `AlertStatic`
- `ActionSheetIOSStatic`
- `ToastAndroidStatic`
- `InteractionManagerStatic`（在这种情况下，没有相关的 `InteractionManager` 类型别名）
- `UIManagerStatic`
- `PlatformStatic`
- `SectionListStatic`
- `PixelRatioStatic`（在这种情况下，没有相关的 `PixelRatio` 类型别名）
- `AppStateStatic`
- `AccessibilityInfoStatic`
- `ImageResizeModeStatic`
- `BackHandlerStatic`
- `DevMenuStatic`（在这种情况下，没有相关的 `DevMenu` 类型别名）
- `ClipboardStatic`
- `PermissionsAndroidStatic`
- `ShareStatic`
- `DeviceEventEmitterStatic`
- `LayoutAnimationStatic`
- `KeyboardStatic`（在这种情况下，没有相关的 `Keyboard` 类型别名）
- `DevSettingsStatic`（在这种情况下，没有相关的 `DevSettings` 类型别名）
- `I18nManagerStatic`
- `EasingStatic`
- `PanResponderStatic`
- `NativeModulesStatic`（在这种情况下，没有相关的 `NativeModules` 类型别名）
- `LogBoxStatic`
- `PushNotificationIOSStatic`
- `SettingsStatic`
- `VibrationStatic`

</details>

### 更新测试 mock

在大多数项目中，这里不需要进行任何更改。现有针对 `react-native/*` 路径的 `jest.mock()` 调用仍然有效——Strict API 不会改变 Jest 或 Metro 解析模块路径的方式，并且 `jest.mock()` 的路径字符串不会进行类型检查。

如果测试文件将深层路径作为模块导入（例如，为了通过 `jest.requireActual()` 包装真实实现），TypeScript 会将该导入报告为无类型。在没有根导出能够覆盖该用例的情况下，你可以保留该导入，并压制错误：

```ts
// @ts-expect-error - React Native internal, untyped under the Strict API
import NativeAppState from 'react-native/Libraries/AppState/NativeAppState';
```

另外，如果你的 Jest 设置导入了 `react-native/Libraries/Core/InitializeCore`，请更新它——参见 [`InitializeCore` 现在是 `react-native/setup-env`](#initializecore-is-now-react-nativesetup-env-since-087)。

## 其他破坏性变更

### `InitializeCore` 现在是 `react-native/setup-env` <div className="label primary">自 0.87 起</div>

与其他深层导入不同，该模块是一个具有副作用的入口点，在 `react-native` 根目录没有对应项。`InitializeCore` 自 0.87 起已弃用。

```diff title=""
- import 'react-native/Libraries/Core/InitializeCore';
+ import 'react-native/setup-env';
```

大多数应用从不直接导入它——它通常出现在 Jest 设置文件和自定义入口点中。

### Animated 类型的变更

Animated 节点过去是基于其插值输出的泛型类型。现在，它们是非泛型类型，并带有一个泛型的 `interpolate` 方法。

`Animated.LegacyRef` 不再可用。请改用适当的 `*Instance` 类型（例如，`Animated.View` 使用 `ViewInstance`）。

### 可选属性的统一类型

在新类型中，每个可选属性都会被类型化为 `type | undefined`。

### 移除一些已弃用类型

长期弃用的 `*Properties` 别名在 Strict API 下无法访问。这些别名源于 props 类型早期重命名为现代 `*Props` 名称的过程，每个别名都有直接替代项：`ViewProperties` 变为 `ViewProps`，`TextInputProperties` 变为 `TextInputProps`，依此类推（以及 `ImagePropertiesSourceOptions`，它变为 `ImageSourcePropType`）。

有关别名的完整列表，请参阅 <RNRepoLink href="/packages/react-native/types/public/DeprecatedPropertiesAlias.d.ts">`DeprecatedPropertiesAlias.d.ts`</RNRepoLink>。

### 移除遗留的组件 props

一些在类型定义中声明但组件未使用，或缺少定义的属性已被移除（例如：`Text` 上的 `lineBreakMode`、`ScrollView` 上的 `scrollWithoutAnimationTo`、定义在 transform 数组之外的 transform 样式）。

### 移除仅供内部使用的辅助类型

由于先前类型定义的配置方式，所有已定义的类型都可以从 `react-native` 包中访问。这包括未明确导出的类型，以及本应仅供内部使用的辅助类型。

值得注意的例子包括与 StyleSheet 相关的类型（如 `RecursiveArray`、`RegisteredStyle` 和 `Falsy`）以及与 Animated 相关的类型（如 `WithAnimatedArray` 和 `WithAnimatedObject`）。

## 常见问题

<details>
<summary>**这会改变运行时的任何行为吗？**</summary>

不会。Strict API 改变的是 TypeScript 解析的类型定义——两种模式解析的是相同的 JavaScript，你的 bundle 不受影响。

请注意，0.87 还会单独从 package 的 exports 中移除 `react-native/src/private/*`，这会影响运行时。该变更与 Strict API 无关。

</details>

<details>
<summary>**我维护一个库。在用户升级之前，我需要先完成迁移吗？**</summary>

不需要——库和应用应该能够独立迁移。Strict API 通过每个项目自己的 `tsconfig.json` 按项目启用：应用采用它不会影响你的库，而你的库采用它也不会影响用户。消费者始终只能看到你的包提供的类型定义。

有两点需要注意：你提供给消费者导入的任何原始 TypeScript 源代码（例如 Jest mock 入口点）都会在他们的项目中进行类型检查，因此不能依赖深层导入——请提供带有 `.d.ts` 文件的已编译输出（参见[更新你的依赖](#update-your-dependencies)）。此外，你仍应计划迁移自己的源代码：旧版类型的选择退出机制只是临时的。

</details>

<details>
<summary>**我使用的某个 API 没有从 `react-native` 导出。这是 bug 吗？**</summary>

在大多数情况下，这是有意为之，而不是遗漏。我们的 [RFC](https://github.com/react-native-community/discussions-and-proposals/pull/894) 将公共 API 限定为 `react-native` 索引文件导出的内容，因此一些以前可以访问的内部 API 现在变为私有。

如果你依赖的内容没有根目录对应项，请在[讨论主题](https://github.com/react-native-community/discussions-and-proposals/discussions/1015)中告诉我们。在合理的情况下，我们可能会将 API 提升到索引导出中。

</details>

<details>
<summary>**为什么要替换 React Native 的手写类型？**</summary>

React Native 使用 [Flow](https://flow.org/) 编写，而不是 TypeScript。此前，它的 TypeScript 类型由社区贡献并手动维护（源自 DefinitelyTyped 中的 `@types/react-native`），因此存在正确性方面的缺口——从源代码生成类型可以确保类型始终与实现保持一致。

有关完整原因，请参阅[迈向稳定的 JavaScript API](/blog/2025/06/12/moving-towards-a-stable-javascript-api)。

</details>

:::note[了解更多]

<div style={{display: 'flex', alignItems: 'center', gap: 40}}>
  <div style={{flex: 1, gap: 8}}>
    <strong style={{display: 'block', marginBottom: 8}}>
      观看演讲！
    </strong>
    <span>
      我们在{' '}
      <strong>App.js 2025</strong> 上深入介绍了 Strict TypeScript API 背后的动机和相关工作。
    </span>
    <a
      href="https://www.youtube.com/live/UTaJlqhTk2g?si=SDRmj80kss7hXuGG&t=6520"
      target="_blank">
      <strong>在 YouTube 上观看</strong>
    </a>
  </div>
  <img
    src="/blog/assets/0.80-js-stable-api-appjs.jpg"
    style={{
      flexShrink: 0,
      maxWidth: '200px',
      aspectRatio: '16/9',
      borderRadius: 10,
    }}
    alt="App.js 2025 Talk"
  />
</div>

:::
