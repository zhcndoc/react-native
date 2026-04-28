---
id: strict-typescript-api
title: 严格 TypeScript API（可选择启用）
---

import RNRepoLink from '@site/core/RNRepoLink';

Strict TypeScript API 是我们未来稳定版 React Native JavaScript API 的预览。

具体来说，这是 `react-native` npm 包的一组新的 TypeScript 类型，从 0.80 起可用。这些类型提供了更强、更具前瞻性的类型准确性，并将帮助我们自信地将 React Native 的 API 演进为稳定形态。启用 Strict TypeScript API 会带来一些结构性的类型差异，因此这是一次性的破坏性变更。

新的类型具有以下特点：

1. **直接从我们的源代码生成** —— 提升覆盖率和正确性，因此你可以期待更强的兼容性保证。
2. **仅限于 `react-native` 的索引文件** —— 更严格地定义我们的公共 API，这意味着当我们修改内部文件时，不会破坏 API。

当社区准备好之后，Strict TypeScript API 将在未来成为我们的默认 API——并与深度导入的移除同步进行。

## 启用

我们会将这些新类型与现有类型一起发布，这意味着你可以在准备好时选择迁移。我们鼓励早期采用者和新创建的应用通过 `tsconfig.json` 文件启用。

启用是一个**破坏性变更**，因为我们的一些新类型更新了名称和形状，不过许多应用不会受到影响。你可以在下一节了解每一项破坏性变更。

```json title="tsconfig.json"
{
  "extends": "@react-native/typescript-config",
  "compilerOptions": {
    ...
    "customConditions": ["react-native-strict-api"]
  }
}
```

:::note[底层机制]

这会指示 TypeScript 从我们新的 [`types_generated/`](https://www.npmjs.com/package/react-native?activeTab=code) 目录解析 `react-native` 类型，而不是之前手动维护的 [`types/`](https://www.npmjs.com/package/react-native?activeTab=code) 目录。无需重启 TypeScript 或你的编辑器。

:::

Strict TypeScript API 遵循我们的 [RFC](https://github.com/react-native-community/discussions-and-proposals/pull/894)，以移除 React Native 的深度导入。因此，某些 API 不再在根目录导出。这是有意为之，目的是减少 React Native API 的整体表面积。

:::tip[API 反馈]

**发送反馈**：在接下来的至少两个 React Native 版本中，我们将与社区合作，最终确定我们会导出的 API。请在我们的 [反馈讨论串](https://github.com/react-native-community/discussions-and-proposals/discussions/893) 中分享你的反馈。

另请参阅我们的 [公告博客文章](/blog/2025/06/12/moving-towards-a-stable-javascript-api) 以了解更多关于我们的动机和时间安排的信息。

:::

## 迁移指南

### Codegen 类型现在应从 `react-native` 包中导入

用于 codegen 的类型，例如 `Int32`、`Double`、`WithDefault` 等，现在都可以在单一的 `CodegenTypes` 命名空间下使用。同样，`codegenNativeComponent` 和 `codegenNativeCommands` 现在可以直接从 react-native 包导入，而不是使用深度导入。

当未启用 Strict API 时，带命名空间的 `CodegenTypes` 以及 `codegenNativeCommands` 和 `codegenNativeComponent` 也可以从 `react-native` 包中使用，以便第三方库更容易采用。

**之前**

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

**之后**

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

### 移除 `*Static` 类型

**之前**

```tsx title=""
import {Linking, LinkingStatic} from 'react-native';

function foo(linking: LinkingStatic) {}
foo(Linking);
```

**之后**

```tsx title=""
import {Linking} from 'react-native';

function foo(linking: Linking) {}
foo(Linking);
```

以下 API 过去的命名方式是 `*Static`，并附带一个该类型的变量声明。在大多数情况下，存在一个别名，使得值和类型都以相同的标识符导出，但有些并没有。

（例如，曾有 `AlertStatic` 类型、类型为 `AlertStatic` 的 `Alert` 变量，以及作为 `AlertStatic` 别名的类型 `Alert`。但在 `PixelRatio` 的情况下，只有 `PixelRatioStatic` 类型和一个该类型的 `PixelRatio` 变量，没有额外的类型别名。）

**受影响的 API**

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

### 一些核心组件现在是函数组件而不是类组件

- `View`
- `Image`
- `TextInput`
- `Modal`
- `Text`
- `TouchableWithoutFeedback`
- `Switch`
- `ActivityIndicator`
- `ProgressBarAndroid`
- `InputAccessoryView`
- `Button`
- `SafeAreaView`

由于这一变化，访问这些视图的 ref 类型需要使用 `React.ComponentRef<typeof View>` 模式，这种方式对类组件和函数组件都能按预期工作，例如：

```ts title=""
const ref = useRef<React.ComponentRef<typeof View>>(null);
```

## 其他破坏性变更

### Animated 类型的变化

Animated 节点过去是基于其插值输出的泛型类型。现在，它们是非泛型类型，并带有一个泛型的 `interpolate` 方法。

`Animated.LegacyRef` 不再可用。

### 可选属性的统一类型

在新类型中，每个可选属性都会被类型化为 `type | undefined`。

### 移除一些已弃用类型

<RNRepoLink href="/packages/react-native/types/public/DeprecatedPropertiesAlias.d.ts">`DeprecatedPropertiesAlias.d.ts`</RNRepoLink> 中列出的所有类型在 Strict API 下都无法访问。

### 移除遗留的组件 props

一些在类型定义中声明但组件未使用，或缺少定义的属性已被移除（例如：`Text` 上的 `lineBreakMode`、`ScrollView` 上的 `scrollWithoutAnimationTo`、定义在 transform 数组之外的 transform 样式）。

### 之前可访问的私有类型辅助工具现在可能已被移除

由于先前类型定义的配置方式，所有已定义的类型都可以从 `react-native` 包中访问。这包括未明确导出的类型，以及本应仅供内部使用的辅助类型。

其中值得注意的例子包括与 StyleSheet 相关的类型（如 `RecursiveArray`、`RegisteredStyle` 和 `Falsy`）以及与 Animated 相关的类型（如 `WithAnimatedArray` 和 `WithAnimatedObject`）。
