---
id: strict-typescript-api
title: 严格 TypeScript API（可选）
---

import RNRepoLink from '@site/core/RNRepoLink';

严格 TypeScript API 是我们未来稳定的 React Native JavaScript API 的预览版。

具体来说，这是一组新的 `react-native` npm 包 TypeScript 类型，从 0.80 版本开始可用。这些类型提供了更强、更面向未来的类型准确性，并将使我们能够自信地将 React Native 的 API 演变为稳定的形态。启用严格 TypeScript API 会带来一些结构类型差异，因此这是一次性的破坏性变更。

新类型具有以下特点：

1. **直接从我们的源代码生成** — 提高覆盖率和正确性，因此您可以期待更强的兼容性保证。
2. **仅限于 `react-native` 的索引文件** — 更严格地定义我们的公共 API，意味着我们在进行内部文件更改时不会破坏 API。

当社区准备好后，严格 TypeScript API 将成为我们未来的默认 API — 与深层导入的移除同步进行。

## 启用

我们将这些新类型与现有类型一起发布，意味着您可以选择在准备好时迁移。我们鼓励早期采用者和新创建的应用通过 `tsconfig.json` 文件启用。

启用是一个**破坏性变更**，因为我们的一些新类型更新了名称和结构，尽管许多应用不会受到影响。您可以在下一节了解每个破坏性变更。

```json title="tsconfig.json"
{
  "extends": "@react-native/typescript-config",
  "compilerOptions": {
    ...
    "customConditions": ["react-native-strict-api"]
  }
}
```

:::note[在幕后]

这将指示 TypeScript 从我们新的 [`types_generated/`](https://www.npmjs.com/package/react-native?activeTab=code) 目录解析 `react-native` 类型，而不是之前的 [`types/`](https://www.npmjs.com/package/react-native?activeTab=code) 目录（手动维护）。不需要重启 TypeScript 或编辑器。

:::

严格 TypeScript API 遵循我们的 [RFC](https://github.com/react-native-community/discussions-and-proposals/pull/894) 以从 React Native 中移除深层导入。因此，某些 API 不再在根目录导出。这是有意为之，目的是减少 React Native API 的整体暴露面。

:::tip[API 反馈]

**发送反馈**：我们将与社区合作，在接下来的（至少）两个 React Native 版本中最终确定我们导出哪些 API。请在我们的 [反馈讨论区](https://github.com/react-native-community/discussions-and-proposals/discussions/893) 中分享您的反馈。

另请参阅我们的 [公告博客文章](/blog/2025/06/12/moving-towards-a-stable-javascript-api) 以了解更多关于我们的动机和时间表的信息。

:::

## 迁移指南

### Codegen 类型现在应从 `react-native` 包导入

用于代码生成的类型，如 `Int32`、`Double`、`WithDefault` 等，现在可在单个 `CodegenTypes` 命名空间下使用。同样，`codegenNativeComponent` 和 `codegenNativeCommands` 现在可以从 react-native 包导入，而无需使用深层导入。

即使未启用严格 API，`react-native` 包中也提供命名空间 `CodegenTypes` 以及 `codegenNativeCommands` 和 `codegenNativeComponent`，以便第三方库更容易采用。

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

以下 API 以前命名为 `*Static` 加上该类型的变量声明。在大多数情况下，有一个别名，使得值和类型在同一个标识符下导出，但有些缺失。

（例如，有一个 `AlertStatic` 类型，类型为 `AlertStatic` 的 `Alert` 变量，以及作为 `AlertStatic` 别名的类型 `Alert`。但在 `PixelRatio` 的情况下，有一个 `PixelRatioStatic` 类型和一个该类型的 `PixelRatio` 变量，没有额外的类型别名。）

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

由于此更改，访问这些视图的 ref 类型需要使用 `React.ComponentRef<typeof View>` 模式，这对类和函数组件都有效，例如：

```ts title=""
const ref = useRef<React.ComponentRef<typeof View>>(null);
```

## 其他破坏性变更

### Animated 类型的更改

Animated 节点以前是基于其插值输出的泛型类型。现在，它们是具有泛型 `interpolate` 方法的非泛型类型。

`Animated.LegacyRef` 不再可用。

### 可选属性的统一类型

在新类型中，每个可选属性都将类型为 `type | undefined`。

### 移除一些已弃用的类型

<RNRepoLink href="/packages/react-native/types/public/DeprecatedPropertiesAlias.d.ts">`DeprecatedPropertiesAlias.d.ts`</RNRepoLink> 中列出的所有类型在严格 API 下无法访问。

### 移除遗留的组件属性

一些在类型定义中定义但未由组件使用或缺乏定义的属性被移除（例如：`Text` 上的 `lineBreakMode`，`ScrollView` 上的 `scrollWithoutAnimationTo`，在 transform 数组之外定义的 transform 样式）。

### 以前可访问的私有类型辅助工具现在可能被移除

由于以前类型定义的配置，每个定义的类型都可以从 `react-native` 包访问。这包括未明确导出的类型和仅应在内部使用的辅助类型。

这方面的显著示例是与 StyleSheet 相关的类型（如 `RecursiveArray`、`RegisteredStyle` 和 `Falsy`）和 Animated（如 `WithAnimatedArray` 和 `WithAnimatedObject`）。
