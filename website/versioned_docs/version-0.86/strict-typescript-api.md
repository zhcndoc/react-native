---
id: strict-typescript-api
title: 严格 TypeScript API（选择加入）
---

import RNRepoLink from '@site/core/RNRepoLink';

Strict TypeScript API 是我们面向 React Native 未来稳定 JavaScript API 的预览版本。

具体来说，这是 `react-native` npm 包的一组新的 TypeScript 类型，从 0.80 起可用。它们提供了更强、更面向未来的类型准确性，并将使我们能够自信地将 React Native 的 API 演进为稳定形态。选择加入 Strict TypeScript API 会带来一些结构上的类型差异，因此这是一次性的破坏性变更。

这些新类型具有以下特点：

1. **直接从我们的源代码生成** — 提高了覆盖率和正确性，因此你可以期待更强的兼容性保证。
2. **限制在 `react-native` 的索引文件中** — 更严格地定义我们的公共 API，这意味着我们在修改内部文件时不会破坏 API。

当社区准备就绪时，Strict TypeScript API 将在未来成为我们的默认 API——并与深层导入移除保持同步。

## 选择加入

我们会将这些新类型与现有类型一起发布，这意味着你可以在准备好时再进行迁移。我们鼓励早期采用者和新创建的应用通过 `tsconfig.json` 文件选择加入。

选择加入是一次**破坏性变更**，因为我们的一些新类型有了更新的名称和形状，不过许多应用不会受到影响。你可以在下一节了解每项破坏性变更。

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

这将指示 TypeScript 从我们新的 [`types_generated/`](https://www.npmjs.com/package/react-native?activeTab=code) 目录解析 `react-native` 类型，而不是之前手动维护的 [`types/`](https://www.npmjs.com/package/react-native?activeTab=code) 目录。无需重启 TypeScript 或你的编辑器。

:::

Strict TypeScript API 遵循我们的 [RFC](https://github.com/react-native-community/discussions-and-proposals/pull/894)，以移除 React Native 的深层导入。因此，某些 API 不再从根目录导出。这是有意为之，目的是减少 React Native API 的整体表面积。

:::tip[API 反馈]

**发送反馈**：在接下来的至少两个 React Native 版本中，我们将与社区合作，最终确定我们会导出哪些 API。请在我们的 [反馈线程](https://github.com/react-native-community/discussions-and-proposals/discussions/893) 中分享你的意见。

另请参阅我们的 [公告博文](/blog/2025/06/12/moving-towards-a-stable-javascript-api)，了解更多关于我们的动机和时间线。

:::

## 迁移指南

### Codegen 类型现在应从 `react-native` 包中导入

用于 codegen 的类型，例如 `Int32`、`Double`、`WithDefault` 等，现在都可在统一的 `CodegenTypes` 命名空间下使用。同样，`codegenNativeComponent` 和 `codegenNativeCommands` 现在可以直接从 react-native 包导入，而不必使用深层导入。

当未启用 Strict API 时，带命名空间的 `CodegenTypes` 以及 `codegenNativeCommands` 和 `codegenNativeComponent` 也可以从 `react-native` 包中使用，以便第三方库更容易采用。

**Before**

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

**After**

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

**Before**

```tsx title=""
import {Linking, LinkingStatic} from 'react-native';

function foo(linking: LinkingStatic) {}
foo(Linking);
```

**After**

```tsx title=""
import {Linking} from 'react-native';

function foo(linking: Linking) {}
foo(Linking);
```

以下 API 之前的命名方式是 `*Static`，并且还会有一个该类型的变量声明。大多数情况下会有一个别名，使得值和类型都以相同标识符导出，但也有一些缺失。

（例如，曾经有一个 `AlertStatic` 类型、一个类型为 `AlertStatic` 的 `Alert` 变量，以及一个作为 `AlertStatic` 别名的类型 `Alert`。但在 `PixelRatio` 的情况下，只有一个 `PixelRatioStatic` 类型和一个该类型的 `PixelRatio` 变量，没有额外的类型别名。）

**受影响的 API**

- `AlertStatic`
- `ActionSheetIOSStatic`
- `ToastAndroidStatic`
- `InteractionManagerStatic`（在这种情况下没有相关的 `InteractionManager` 类型别名）
- `UIManagerStatic`
- `PlatformStatic`
- `SectionListStatic`
- `PixelRatioStatic`（在这种情况下没有相关的 `PixelRatio` 类型别名）
- `AppStateStatic`
- `AccessibilityInfoStatic`
- `ImageResizeModeStatic`
- `BackHandlerStatic`
- `DevMenuStatic`（在这种情况下没有相关的 `DevMenu` 类型别名）
- `ClipboardStatic`
- `PermissionsAndroidStatic`
- `ShareStatic`
- `DeviceEventEmitterStatic`
- `LayoutAnimationStatic`
- `KeyboardStatic`（在这种情况下没有相关的 `Keyboard` 类型别名）
- `DevSettingsStatic`（在这种情况下没有相关的 `DevSettings` 类型别名）
- `I18nManagerStatic`
- `EasingStatic`
- `PanResponderStatic`
- `NativeModulesStatic`（在这种情况下没有相关的 `NativeModules` 类型别名）
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

由于这一变化，访问这些视图的 ref 类型需要使用 `React.ComponentRef<typeof View>` 模式，该模式对类组件和函数组件都能按预期工作，例如：

```ts title=""
const ref = useRef<React.ComponentRef<typeof View>>(null);
```

## 其他破坏性变更

### Animated 类型的变化

Animated 节点以前是基于其插值输出的泛型类型。现在，它们是不带泛型的类型，并拥有一个泛型的 `interpolate` 方法。

`Animated.LegacyRef` 不再可用。

### 可选属性的统一类型

在新类型中，每个可选属性都会被类型化为 `type | undefined`。

### 移除一些已弃用的类型

<RNRepoLink href="/packages/react-native/types/public/DeprecatedPropertiesAlias.d.ts">`DeprecatedPropertiesAlias.d.ts`</RNRepoLink> 中列出的所有类型，在 Strict API 下都无法访问。

### 移除残留的组件属性

一些在类型定义中存在但未被组件使用，或者缺少定义的属性已被移除（例如：`Text` 上的 `lineBreakMode`、`ScrollView` 上的 `scrollWithoutAnimationTo`、定义在 transform 数组外的 transform 样式）。

### 以前可访问的私有类型辅助工具现在可能已被移除

由于之前类型定义的配置方式，`react-native` 包中可访问所有已定义类型。这包括未显式导出的类型，以及本应仅供内部使用的辅助类型。

其中值得注意的示例是与 StyleSheet 相关的类型（如 `RecursiveArray`、`RegisteredStyle` 和 `Falsy`）以及 Animated 相关的类型（如 `WithAnimatedArray` 和 `WithAnimatedObject`）。
