---
id: optimizing-javascript-loading
title: 优化 JavaScript 加载
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

解析和运行 JavaScript 代码需要消耗内存和时间。因此，随着应用的增长，通常有必要将代码的加载延迟到第一次需要它时。React Native 默认提供了一些标准优化，并且你也可以在自己的代码中采用一些技术，帮助 React 更高效地加载你的应用。还有一些更高级的自动优化（各有取舍），适用于非常大型的应用。

## 推荐：使用 Hermes

Hermes 是新 React Native 应用的默认引擎，并且经过高度优化，可实现高效的代码加载。在发布构建中，JavaScript 代码会在预编译阶段被完全编译为字节码。字节码按需加载到内存中，不需要像普通 JavaScript 那样进行解析。

:::info
在 React Native 中了解更多关于使用 Hermes 的内容 [这里](./hermes)。
:::

## 推荐：懒加载大型组件

如果一个包含大量代码/依赖的组件在你的应用初始渲染时不太可能被使用，你可以使用 React 的 [`lazy`](https://react.dev/reference/react/lazy) API，将其代码的加载推迟到它第一次被渲染时。通常，你应该考虑对应用中的页面级组件进行懒加载，这样为应用新增页面就不会增加启动时间。

:::info
在 React 的文档中了解更多关于 [使用 Suspense 懒加载组件
](https://react.dev/reference/react/lazy#suspense-for-code-splitting) 的内容，包括代码示例。
:::

### 提示：避免模块副作用

如果你的组件模块（或其依赖）具有 _副作用_，例如修改全局变量或订阅组件之外的事件，那么懒加载组件可能会改变应用的行为。React 应用中的大多数模块都不应该有任何副作用。

```tsx title="SideEffects.tsx"
import Logger from './utils/Logger';

//  🚩 🚩 🚩 副作用！这必须在 React 甚至开始渲染
// SplashScreen 组件之前执行，并且如果你之后决定懒加载 SplashScreen，
// 可能会意外破坏应用中其他位置的代码。
global.logger = new Logger();

export function SplashScreen() {
  // ...
}
```

## 高级：内联调用 `require`

有时你可能希望将某些代码的加载推迟到第一次使用它时，而不使用 `lazy` 或异步 `import()`。你可以在原本会在文件顶部使用静态 `import` 的地方，改用 [`require()`](https://metrobundler.dev/docs/module-api/#require) 函数。

```tsx title="VeryExpensive.tsx"
import {Component} from 'react';
import {Text} from 'react-native';
// ... 导入一些非常耗资源的模块

export default function VeryExpensive() {
  // ... 大量大量的渲染逻辑
  return <Text>非常昂贵的组件</Text>;
}
```

```tsx title="Optimized.tsx"
import {useCallback, useState} from 'react';
import {TouchableOpacity, View, Text} from 'react-native';
// 通常我们会写一个静态导入：
// import VeryExpensive from './VeryExpensive';

let VeryExpensive = null;

export default function Optimize() {
  const [needsExpensive, setNeedsExpensive] = useState(false);
  const didPress = useCallback(() => {
    if (VeryExpensive == null) {
      VeryExpensive = require('./VeryExpensive').default;
    }

    setNeedsExpensive(true);
  }, []);

  return (
    <View style={{marginTop: 20}}>
      <TouchableOpacity onPress={didPress}>
        <Text>加载</Text>
      </TouchableOpacity>
      {needsExpensive ? <VeryExpensive /> : null}
    </View>
  );
}
```

## 高级：自动内联 `require` 调用

如果你使用 React Native CLI 构建应用，`require` 调用（但不是 `import`）会自动为你内联，无论是在你自己的代码中还是在你使用的任何第三方包（`node_modules`）中。

```tsx
import {useCallback, useState} from 'react';
import {TouchableOpacity, View, Text} from 'react-native';

// 这个顶层 require 调用将作为下面组件的一部分被惰性求值。
const VeryExpensive = require('./VeryExpensive').default;

export default function Optimize() {
  const [needsExpensive, setNeedsExpensive] = useState(false);
  const didPress = useCallback(() => {
    setNeedsExpensive(true);
  }, []);

  return (
    <View style={{marginTop: 20}}>
      <TouchableOpacity onPress={didPress}>
        <Text>加载</Text>
      </TouchableOpacity>
      {needsExpensive ? <VeryExpensive /> : null}
    </View>
  );
}
```

:::info
某些 React Native 框架会禁用此行为。特别是在 Expo 项目中，默认不会内联 `require` 调用。你可以通过编辑项目的 Metro 配置，并在 [`getTransformOptions`](https://metrobundler.dev/docs/configuration#gettransformoptions) 中将 `inlineRequires: true` 来启用此优化。
:::

### 内联 `require` 的注意事项

内联 `require` 调用会改变模块的求值顺序，甚至可能导致某些模块 _永远_ 不会被求值。通常自动执行这种操作是安全的，因为 JavaScript 模块通常会编写成没有副作用。

如果你的某个模块确实有副作用——例如，它初始化了一些日志机制，或者补丁化了供代码其余部分使用的全局 API——那么你可能会看到意外行为，甚至崩溃。在这些情况下，你可能希望将某些模块排除在此优化之外，或者完全禁用它。

要 **禁用所有 `require` 调用的自动内联：**

将你的 `metro.config.js` 更新为把 `inlineRequires` 转换器选项设置为 `false`：

```tsx title="metro.config.js"
module.exports = {
  transformer: {
    async getTransformOptions() {
      return {
        transform: {
          inlineRequires: false,
        },
      };
    },
  },
};
```

要仅 **将某些模块排除在 `require` 内联之外：**

有两个相关的转换器选项：`inlineRequires.blockList` 和 `nonInlinedRequires`。请参阅代码片段以了解如何使用它们。

```tsx title="metro.config.js"
module.exports = {
  transformer: {
    async getTransformOptions() {
      return {
        transform: {
          inlineRequires: {
            blockList: {
              // `DoNotInlineHere.js` 中的 require() 调用不会被内联。
              [require.resolve('./src/DoNotInlineHere.js')]: true,

              // 其他任何地方的 require() 调用都会被内联，除非它们
              // 匹配下面的任何 nonInlinedRequires 条目。
            },
          },
          nonInlinedRequires: [
            // `react` 的 require('react') 调用不会在任何地方被内联
            'react',
          ],
        },
      };
    },
  },
};
```

有关设置和微调你的内联 `require` 的更多细节，请参阅 Metro 中的 [`getTransformOptions` 文档](https://metrobundler.dev/docs/configuration#gettransformoptions)。

## 高级：使用随机访问模块 bundle（非 Hermes）

:::tip
**在[使用 Hermes](#use-hermes)时不支持。** Hermes 字节码与 RAM bundle 格式不兼容，并且在所有使用场景中都提供相同（或更好）的性能。
:::

随机访问模块 bundle（也称为 RAM bundle）与上面提到的技术配合使用，以限制需要解析并加载到内存中的 JavaScript 代码量。每个模块都存储为一个单独的字符串（或文件），只有在需要执行该模块时才会被解析。

RAM bundle 可以在物理上拆分为多个独立文件，也可以使用 _indexed_ 格式，即在单个文件中包含多个模块的查找表。

<Tabs groupId="platform" queryString defaultValue={constants.defaultPlatform} values={constants.platforms}>
<TabItem value="android">

在 Android 上，通过编辑 `android/app/build.gradle` 文件来启用 RAM 格式。在 `apply from: "../../node_modules/react-native/react.gradle"` 这一行之前，添加或修改 `project.ext.react` 块：

```
project.ext.react = [
  bundleCommand: "ram-bundle",
]
```

如果你想使用单个 indexed 文件，请在 Android 上使用以下几行：

```
project.ext.react = [
  bundleCommand: "ram-bundle",
  extraPackagerArgs: ["--indexed-ram-bundle"]
]
```

</TabItem>
<TabItem value="ios">

在 iOS 上，RAM bundle 始终是 indexed（= 单个文件）。

通过编辑构建阶段 "Bundle React Native code and images" 在 Xcode 中启用 RAM 格式。在 `../node_modules/react-native/scripts/react-native-xcode.sh` 之前添加 `export BUNDLE_COMMAND="ram-bundle"`：

```
export BUNDLE_COMMAND="ram-bundle"
export NODE_BINARY=node
../node_modules/react-native/scripts/react-native-xcode.sh
```

</TabItem>
</Tabs>

有关设置和微调你的 RAM bundle 构建的更多细节，请参阅 Metro 中的 [`getTransformOptions` 文档](https://metrobundler.dev/docs/configuration#gettransformoptions)。
