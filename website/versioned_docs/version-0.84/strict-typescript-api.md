---
id: strict-typescript-api
title: 严格的 TypeScript API（可选）
---

import RNRepoLink from '@site/core/RNRepoLink';

严格的 TypeScript API 是我们未来稳定 JavaScript API 的预览，适用于 React Native。

具体来说，这是一组为 `react-native` npm 包提供的新的 TypeScript 类型，从 0.80 版本开始可用。这些类型提供了更强、更具未来兼容性的类型准确性，使我们能够自信地将 React Native 的 API 发展为一个稳定的形态。选择使用严格的 TypeScript API 会带来一些结构上的类型差异，因此这是一次一劳永逸的重大变更。

新类型的特点是：

1. **直接从源代码生成** — 提高覆盖率和正确性，因此您可以期待更强的兼容性保障。
2. **仅限于 `react-native` 的索引文件** — 更严格地定义我们的公共 API，意味着我们在进行内部文件更改时不会破坏 API。

当社区准备好后，严格的 TypeScript API 将成为我们未来的默认 API —— 与深度导入的移除同步。

## 选择启用

我们将这些新类型与现有类型一同发布，意味着您可以在准备好时选择迁移。我们鼓励早期采用者和新创建的应用通过您的 `tsconfig.json` 文件进行选择启用。

启用是一个**破坏性变更**，因为我们的部分新类型更新了名称和结构，尽管许多应用不会受到影响。您可以在下一节了解每个破坏性变更的内容。

```json title="tsconfig.json"
{
  "extends": "@react-native/typescript-config",
  "compilerOptions": {
    ...
    "customConditions": ["react-native-strict-api"]
  }
}
```

:::note[在底层]

这将指示 TypeScript 从我们的新 [`types_generated/`](https://www.npmjs.com/package/react-native?activeTab=code) 目录解析 `react-native` 类型，而非之前手动维护的 [`types/`](https://www.npmjs.com/package/react-native?activeTab=code) 目录。不需要重启 TypeScript 或您的编辑器。

:::

严格的 TypeScript API 遵循我们的 [RFC](https://github.com/react-native-community/discussions-and-proposals/pull/894)，以移除 React Native 的深度导入。因此，部分 API 不再从根目录导出。这是有意为之，目的是减少 React Native API 的整体表面积。

:::tip[API 反馈]

**反馈途径**：我们将在未来至少两个 React Native 版本中，与社区一同确定导出的 API。请在我们的[反馈帖](https://github.com/react-native-community/discussions-and-proposals/discussions/893)中分享您的意见。

更多关于我们的动机和时间表，请参见我们的[公告博客](/blog/2025/06/12/moving-towards-a-stable-javascript-api)。

:::

## 迁移指南

### 代码生成类型现在应从 `react-native` 包导入

用于代码生成的类型，如 `Int32`、`Double`、`WithDefault` 等，现在都在单一的 `CodegenTypes` 命名空间下提供。同样，`codegenNativeComponent` 和 `codegenNativeCommands` 也可以直接从 `react-native` 包导入，而无需使用深度导入。

为了方便第三方库采用，即使未启用严格 API，`react-native` 包中仍提供命名空间 `CodegenTypes` 以及 `codegenNativeCommands` 和 `codegenNativeComponent`。

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

以下 API 之前具有 `*Static` 后缀的类型加上该类型的变量声明。在大多数情况下，有别名将值和类型以同一标识符导出，但部分存在遗漏。

（例如，存在 `AlertStatic` 类型、类型为 `AlertStatic` 的 `Alert` 变量，以及 `Alert` 类型别名指向 `AlertStatic`。但对于 `PixelRatio`，存在 `PixelRatioStatic` 类型和对应类型的变量 `PixelRatio`，但无额外类型别名。）

**受影响的 API**

- `AlertStatic`
- `ActionSheetIOSStatic`
- `ToastAndroidStatic`
- `InteractionManagerStatic`（此例中无相关的 `InteractionManager` 类型别名）
- `UIManagerStatic`
- `PlatformStatic`
- `SectionListStatic`
- `PixelRatioStatic`（此例中无相关的 `PixelRatio` 类型别名）
- `AppStateStatic`
- `AccessibilityInfoStatic`
- `ImageResizeModeStatic`
- `BackHandlerStatic`
- `DevMenuStatic`（此例中无相关的 `DevMenu` 类型别名）
- `ClipboardStatic`
- `PermissionsAndroidStatic`
- `ShareStatic`
- `DeviceEventEmitterStatic`
- `LayoutAnimationStatic`
- `KeyboardStatic`（此例中无相关的 `Keyboard` 类型别名）
- `DevSettingsStatic`（此例中无相关的 `DevSettings` 类型别名）
- `I18nManagerStatic`
- `EasingStatic`
- `PanResponderStatic`
- `NativeModulesStatic`（此例中无相关的 `NativeModules` 类型别名）
- `LogBoxStatic`
- `PushNotificationIOSStatic`
- `SettingsStatic`
- `VibrationStatic`

### 一些核心组件现在是函数组件而非类组件

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

由于此更改，访问这些视图的 ref 类型需要使用 `React.ComponentRef<typeof View>` 模式，这对类组件和函数组件均正常工作，例如：

```ts title=""
const ref = useRef<React.ComponentRef<typeof View>>(null);
```

## 其他破坏性变更

### Animated 类型的变更

Animated 节点之前是基于其插值输出的泛型类型。现在，它们是不带泛型的类型，带有泛型的 `interpolate` 方法。

`Animated.LegacyRef` 已不再提供。

### 可选属性的统一类型

在新类型中，所有可选属性都将被类型化为 `type | undefined`。

### 移除部分弃用类型

所有列在 <RNRepoLink href="/packages/react-native/types/public/DeprecatedPropertiesAlias.d.ts">`DeprecatedPropertiesAlias.d.ts`</RNRepoLink> 中的类型，在严格 API 下不可访问。

### 移除遗留的组件属性

在类型定义中存在但组件未使用或缺少定义的一些属性已被移除（例如：`Text` 的 `lineBreakMode`，`ScrollView` 的 `scrollWithoutAnimationTo`，定义在变换数组之外的变换样式）。

### 之前可访问的私有类型辅助工具现在可能被移除

由于之前类型定义的配置，所有定义的类型都可从 `react-native` 包访问，包括未显式导出及仅供内部使用的辅助类型。

显著的例子包括与 StyleSheet 相关的类型（如 `RecursiveArray`、`RegisteredStyle` 和 `Falsy`）以及 Animated（如 `WithAnimatedArray` 和 `WithAnimatedObject`）。