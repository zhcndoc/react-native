---
id: strict-typescript-api
title: 严格 TypeScript API
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import RNRepoLink from '@site/core/RNRepoLink';

:::info[0.87 中的新内容]

**Strict API 现在默认启用**（此前在 0.80 及更高版本中需要选择启用）。这是一项**破坏性变更**，详见下方指南。

:::

Strict TypeScript API 是 React Native 现代化的 TypeScript API，取代了早期版本中以前由人工维护的 TypeScript 定义。

### 关键变更（破坏性变更）

1. **不再支持深层导入。** API 仅限于 `react-native` 的索引文件。这是一份更加严格且更有意设计的公共 API 契约。同时也确保 React Native 源代码中的内部文件路径变更不会造成破坏性影响。
2. **直接从源代码生成。** 以前，React Native 使用单独维护的手写类型。现在从源代码生成意味着我们能够改进覆盖范围、正确性和兼容性保证。

### 选择退出 <div className="label primary">自 0.87 起</div>

Strict API 是一项**破坏性变更**，并非所有应用和库都能立即完成迁移。

我们仍会发布之前的手写类型，你可以通过 `tsconfig.json` 配置恢复使用这些类型。请注意，我们将在未来的版本中移除此选择退出选项。

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

0.87 默认启用 Strict API 是一项全生态范围的变更。为了确保 React Native 未来拥有稳定的 API 保证，我们必须进行这项变更。

关于哪些 API 应从根目录导出，以及类型名称／结构的有意更新，我们自最初的 0.80 预览版以来一直与社区和合作伙伴共同推进。

我们相信已经解决了所有棘手问题，但可能仍存在一些边缘情况。如果你选择在 0.87 或更高版本中退出 Strict API，我们很希望了解原因：[**讨论主题**](https://github.com/react-native-community/discussions-and-proposals/discussions/1015)。

:::

---

## 迁移指南

:::tip

使用 [**/migrate-to-strict-api**](https://www.skills.sh/react-native-community/skills/migrate-to-strict-api) skill，通过 agent 迁移你的代码库。

```sh
npx skills add react-native-community/skills --skill migrate-to-strict-api
```

:::

### 开始之前

启用 Strict API——升级到 0.87，或在更早的版本中选择启用——只会影响你自己项目的 TypeScript 分析范围，该范围由其 `tsconfig.json` 限定。

在大多数情况下，代码库可以独立迁移——应用开发者不需要等待特定依赖选择启用，库作者也不需要等待其用户。

#### 保持启用 `skipLibCheck`

上述内容依赖于 `skipLibCheck`，而 `@react-native/typescript-config` 默认会启用它。这会让源自第三方 `.d.ts` 文件的错误不出现在结果中。如果你的项目覆盖了该配置，请在开始之前重新启用它——否则你会看到依赖项中的错误，而这些错误是你无法修复的。

#### 更新你的依赖

有时，你的依赖在 Strict API 下可能存在棘手问题。当类型错误涉及某个库时，请先检查并更新到已修复问题的版本。

一个具体的棘手问题是：某些库会发布原始 TypeScript 源代码，而你的项目会导入这些源代码，例如 Jest 设置文件。这些文件会作为项目的一部分进行类型检查。一些热门库已经重新打包了这些入口点：

- `@expensify/react-native-live-markdown` — 已在 [0.1.335](https://github.com/Expensify/react-native-live-markdown/pull/771) 中修复
- `react-native-safe-area-context` — 已在 [5.8.1](https://github.com/AppAndFlow/react-native-safe-area-context/pull/745) 中修复

<details>
<summary>**高级：排除不兼容的库**</summary>

如果某个不兼容的库在 `node_modules` 下产生错误（通常为 `TS2307: Cannot find module 'react-native/Libraries/...'`），你可以将导入的子路径重定向到一个无类型存根，从而将其排除在 TypeScript 分析之外，作为本地修复方案：

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

同时也请向该库报告不兼容问题——上面链接的修复是很好的参考模板。

</details>

### 新的 `CodegenTypes` 命名空间

用于代码生成的类型，例如 `Int32`、`Double`、`WithDefault` 等，现在都可以通过单一的 `CodegenTypes` 命名空间使用。同样，`codegenNativeComponent` 和 `codegenNativeCommands` 现在也可以从 react-native 包中导入，而不再需要使用深层导入。

当 Strict API 未启用时，命名空间形式的 `CodegenTypes` 以及 `codegenNativeCommands` 和 `codegenNativeComponent` 同样可以从 `react-native` 包中使用，从而让第三方库更容易采用这些 API。

#### 迁移

<Tabs defaultValue="after">
<TabItem value="before" label="之前">

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
<TabItem value="after" label="之后">

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

现在每个内置组件都有专用的 `*Instance` 类型，可用于 refs——例如 `ViewInstance`、`TextInputInstance`、`ScrollViewInstance`。在 Strict TypeScript API 下，这些是**推荐用于标注 refs 类型的方式**。

以前，`useRef<View>` 能够正常工作，是因为 `View` 和其他组件被标注为类。在 Strict API 下，内置组件被标注为函数，因此 `View` 指的是函数本身——**组件类型名称不再适合作为 ref 类型**。

<Tabs defaultValue="after">
<TabItem value="before" label="之前">

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
<TabItem value="after" label="之后">

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

`*Instance` 类型也可以透明地用于 `Animated` 变体——不需要单独的类型：

```tsx title=""
const viewRef = useRef<ViewInstance>(null);

<View ref={viewRef} />
<Animated.View ref={viewRef} />
```

这也取代了已移除的 `Animated.LegacyRef` 类型。使用 `ref={ref as React.Ref<Animated.LegacyRef<View>>}` 的代码，可以将其简化为 `ref={ref}`，并使用标注为 `ViewInstance` 类型的 ref。

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

| 之前                                            | 之后                         |
| ----------------------------------------------- | ---------------------------- |
| `useRef<View>(null)`                            | `useRef<ViewInstance>(null)` |
| `useRef<React.ComponentRef<typeof View>>(null)` | `useRef<ViewInstance>(null)` |
| `useRef<HostInstance>(null)`（针对特定组件）    | `useRef<ViewInstance>(null)` |
| `Ref<Animated.LegacyRef<View>>`                 | `Ref<ViewInstance>`          |

:::note

`React.ComponentRef<typeof View>` 仍然有效，并且会生成与 `ViewInstance` 相同的类型。`*Instance` 类型是便捷的别名——两种方式都可以使用。

:::

### 移除 `*Static` 类型

#### 迁移

<Tabs defaultValue="after">
<TabItem value="before" label="之前">

```tsx title=""
import {Linking, LinkingStatic} from 'react-native';

function foo(linking: LinkingStatic) {}
foo(Linking);
```

</TabItem>
<TabItem value="after" label="之后">

```tsx title=""
import {Linking} from 'react-native';

function foo(linking: Linking) {}
foo(Linking);
```

</TabItem>
</Tabs>

以下 API 之前被命名为 `*Static`，并带有一个声明为该类型的变量。在大多数情况下，存在一个别名，使值和类型通过同一标识符导出，但其中一些缺少该别名。

<details>
<summary>**受影响的 API**</summary>

- `AlertStatic`
- `ActionSheetIOSStatic`
- `ToastAndroidStatic`
- `InteractionManagerStatic`（在此情况下没有相关的 `InteractionManager` 类型别名）
- `UIManagerStatic`
- `PlatformStatic`
- `SectionListStatic`
- `PixelRatioStatic`（在此情况下没有相关的 `PixelRatio` 类型别名）
- `AppStateStatic`
- `AccessibilityInfoStatic`
- `ImageResizeModeStatic`
- `BackHandlerStatic`
- `DevMenuStatic`（在此情况下没有相关的 `DevMenu` 类型别名）
- `ClipboardStatic`
- `PermissionsAndroidStatic`
- `ShareStatic`
- `DeviceEventEmitterStatic`
- `LayoutAnimationStatic`
- `KeyboardStatic`（在此情况下没有相关的 `Keyboard` 类型别名）
- `DevSettingsStatic`（在此情况下没有相关的 `DevSettings` 类型别名）
- `I18nManagerStatic`
- `EasingStatic`
- `PanResponderStatic`
- `NativeModulesStatic`（在此情况下没有相关的 `NativeModules` 类型别名）
- `LogBoxStatic`
- `PushNotificationIOSStatic`
- `SettingsStatic`
- `VibrationStatic`

</details>

### 更新测试 mock

在大多数项目中，这里不需要任何更改。针对 `react-native/*` 路径的现有 `jest.mock()` 调用仍然有效——Strict API 不会改变 Jest 或 Metro 中模块路径的解析方式，并且 `jest.mock()` 的路径字符串不会进行类型检查。

如果测试文件将深层路径作为模块导入（例如，为了从 `jest.requireActual()` 包装真实实现），TypeScript 会将该导入报告为无类型。在没有根导出能够覆盖使用场景的情况下，你可以保留该导入，并消除错误：

```ts
// @ts-expect-error - React Native internal, untyped under the Strict API
import NativeAppState from 'react-native/Libraries/AppState/NativeAppState';
```

另外，如果你的 Jest 设置导入了 `react-native/Libraries/Core/InitializeCore`，请更新它——参见 [`InitializeCore` 现在是 `react-native/setup-env`](#initializecore-is-now-react-nativesetup-env-since-087)。

## 其他破坏性变更

### `InitializeCore` 现在是 `react-native/setup-env` <div className="label primary">自 0.87 起</div>

与其他深层导入不同，该模块是一个副作用入口点，在根目录的 `react-native` 中没有对应项。`InitializeCore` 自 0.87 起已弃用。

```diff title=""
- import 'react-native/Libraries/Core/InitializeCore';
+ import 'react-native/setup-env';
```

大多数应用从不直接导入它——它通常出现在 Jest 设置文件和自定义入口点中。

### Animated 类型的变更

Animated 节点以前是基于其插值输出的泛型类型。现在，它们是不带泛型的类型，并拥有一个泛型 `interpolate` 方法。

`Animated.LegacyRef` 不再可用。请改用适当的 `*Instance` 类型（例如，`Animated.View` 使用 `ViewInstance`）。

### 可选 props 的统一类型

在新类型中，每个可选 prop 都会被标注为 `type | undefined`。

### 移除部分已弃用的类型

长期弃用的 `*Properties` 别名在 Strict API 下不可访问。这些别名源自 props 类型早期重命名为现代 `*Props` 名称的过程，每个别名都有直接的替代项：`ViewProperties` 变为 `ViewProps`，`TextInputProperties` 变为 `TextInputProps`，依此类推（以及 `ImagePropertiesSourceOptions`，它变为 `ImageSourcePropType`）。

完整的别名列表请参见 <RNRepoLink href="/packages/react-native/types/public/DeprecatedPropertiesAlias.d.ts">`DeprecatedPropertiesAlias.d.ts`</RNRepoLink>。

### 移除遗留的组件 props

一些在类型定义中存在、但组件未使用或缺少定义的属性已被移除（例如：`Text` 上的 `lineBreakMode`、`ScrollView` 上的 `scrollWithoutAnimationTo`，以及在 transform 数组外定义的变换样式）。

### 移除仅供内部使用的辅助类型

由于之前类型定义的配置方式，每个已定义的类型都可以从 `react-native` 包访问。这包括未显式导出的类型，以及本应仅供内部使用的辅助类型。

值得注意的示例包括与 StyleSheet 相关的类型（例如 `RecursiveArray`、`RegisteredStyle` 和 `Falsy`），以及与 Animated 相关的类型（例如 `WithAnimatedArray` 和 `WithAnimatedObject`）。

## 常见问题

<details>
<summary>**这会改变运行时的任何行为吗？**</summary>

不会。Strict API 会改变 TypeScript 解析的类型定义——两种模式解析的是相同的 JavaScript，你的 bundle 不受影响。

请注意，0.87 还会单独从包的导出中移除 `react-native/src/private/*`，这会影响运行时。该变更与 Strict API 无关。

</details>

<details>
<summary>**我维护一个库。在用户升级之前，我需要先完成迁移吗？**</summary>

不需要——库和应用应该可以独立迁移。Strict API 通过每个项目自己的 `tsconfig.json` 按项目启用：应用采用它不会影响你的库，而你的库采用它也不会影响用户。消费者始终只能看到你的包所发布的类型定义。

有两个注意事项：你为消费者发布的、供其导入的任何原始 TypeScript 源代码（例如 Jest mock 入口点）都会在其项目中进行类型检查，因此不能依赖深层导入——请发布带有 `.d.ts` 文件的已编译输出（参见[更新你的依赖](#update-your-dependencies)）。此外，你仍应计划迁移自己的源代码：旧版类型的选择退出选项只是临时的。

</details>

<details>
<summary>**我使用的某个 API 没有从 `react-native` 导出。这是 bug 吗？**</summary>

在大多数情况下，这是有意为之，而不是疏忽。我们的 [RFC](https://github.com/react-native-community/discussions-and-proposals/pull/894) 将公共 API 限定为 `react-native` 索引文件导出的内容，因此一些之前可访问的内部 API 现在变成了私有 API。

如果你依赖的某个 API 没有根目录对应项，请在[讨论主题](https://github.com/react-native-community/discussions-and-proposals/discussions/1015)中告诉我们。在合理的情况下，我们可能会将 API 提升为索引导出。

</details>

<details>
<summary>**为什么 React Native 的手写类型会被替换？**</summary>

React Native 使用 [Flow](https://flow.org/) 编写，而不是 TypeScript。其 TypeScript 类型以前由社区贡献并手动维护（源自 DefinitelyTyped 上的 `@types/react-native`），存在正确性方面的缺口——从源代码生成类型可以确保类型始终与实现保持一致。

完整的理由请参见[迈向稳定的 JavaScript API](/blog/2025/06/12/moving-towards-a-stable-javascript-api)。

</details>

:::note[了解更多]

<div style={{display: 'flex', alignItems: 'center', gap: 40}}>
  <div style={{flex: 1, gap: 8}}>
    <strong style={{display: 'block', marginBottom: 8}}>
      观看演讲！
    </strong>
    <span>
      我们在{' '}
      <strong>App.js 2025</strong> 上分享了 Strict TypeScript API 背后的动机和工作内容的深入介绍。
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
