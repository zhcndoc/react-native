---
id: optimizing-javascript-loading
title: 优化 JavaScript 加载
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

解析和运行 JavaScript 代码需要内存和时间。因此，随着你的应用增长，通常最好延迟加载代码，直到首次需要时。React Native 自带一些默认启用的标准优化，你可以采用一些技术来帮助 React 更高效地加载你的应用。还有一些高级自动优化（各有权衡）适用于非常大的应用。

## 推荐：使用 Hermes

Hermes 是新 React Native 应用的默认引擎，并针对高效代码加载进行了高度优化。在发布构建中，JavaScript 代码会预先完全编译为字节码。字节码按需加载到内存，不需要像普通 JavaScript 那样进行解析。

:::info
有关在 React Native 中使用 Hermes 的更多信息，请阅读 [这里](./hermes)。
:::

## 推荐：懒加载大型组件

如果一个包含大量代码/依赖的组件在初始渲染应用时不太可能被使用，你可以使用 React 的 [`lazy`](https://react.dev/reference/react/lazy) API 来推迟加载其代码，直到首次渲染它。通常，你应该考虑懒加载应用中的屏幕级组件，这样向应用添加新屏幕不会增加其启动时间。

:::info
在 React 文档中阅读更多关于 [使用 Suspense 懒加载组件](https://react.dev/reference/react/lazy#suspense-for-code-splitting) 的信息，包括代码示例。
:::

### 提示：避免模块副作用

如果你的组件模块（或其依赖）具有 _副作用_，例如修改全局变量或在组件外部订阅事件，懒加载组件可能会改变你的应用行为。React 应用中的大多数模块不应有任何副作用。

```tsx title="SideEffects.tsx"
import Logger from './utils/Logger';

//  🚩 🚩 🚩 副作用！这必须在 React 甚至开始
// 渲染 SplashScreen 组件之前执行，如果你后来决定懒加载 SplashScreen，
// 可能会意外破坏应用其他地方的代码。
global.logger = new Logger();

export function SplashScreen() {
  // ...
}
```

## 高级：内联调用 `require`

有时你可能希望推迟加载某些代码，直到首次使用它，而不使用 `lazy` 或异步 `import()`。你可以通过在原本会在文件顶部使用静态 `import` 的地方使用 [`require()`](https://metrobundler.dev/docs/module-api/#require) 函数来实现这一点。

```tsx title="VeryExpensive.tsx"
import {Component} from 'react';
import {Text} from 'react-native';
// ... import some very expensive modules

export default function VeryExpensive() {
  // ... lots and lots of rendering logic
  return <Text>Very Expensive Component</Text>;
}
```

```tsx title="Optimized.tsx"
import {useCallback, useState} from 'react';
import {TouchableOpacity, View, Text} from 'react-native';
// 通常我们会编写一个静态导入：
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
        <Text>Load</Text>
      </TouchableOpacity>
      {needsExpensive ? <VeryExpensive /> : null}
    </View>
  );
}
```

## 高级：自动内联 `require` 调用

如果你使用 React Native CLI 构建应用，`require` 调用（但不是 `import`）将自动为你内联，无论是在你的代码中还是在你使用的任何第三方包（`node_modules`）中。

```tsx
import {useCallback, useState} from 'react';
import {TouchableOpacity, View, Text} from 'react-native';

// 这个顶层 require 调用将作为下面组件的一部分被懒评估。
const VeryExpensive = require('./VeryExpensive').default;

export default function Optimize() {
  const [needsExpensive, setNeedsExpensive] = useState(false);
  const didPress = useCallback(() => {
    setNeedsExpensive(true);
  }, []);

  return (
    <View style={{marginTop: 20}}>
      <TouchableOpacity onPress={didPress}>
        <Text>Load</Text>
      </TouchableOpacity>
      {needsExpensive ? <VeryExpensive /> : null}
    </View>
  );
}
```

:::info
一些 React Native 框架禁用了此行为。特别是，在 Expo 项目中，`require` 调用默认不会内联。你可以通过编辑项目的 Metro 配置并在 [`getTransformOptions`](https://metrobundler.dev/docs/configuration#gettransformoptions) 中设置 `inlineRequires: true` 来启用此优化。
:::

### 内联 `require` 的陷阱

内联 `require` 调用会改变模块评估的顺序，甚至可能导致某些模块 _永远_ 不被评估。自动执行这通常是安全的，因为 JavaScript 模块通常编写为无副作用的。

如果你的某个模块确实有副作用 - 例如，如果它初始化某些日志机制，或修补其余代码使用的全局 API - 那么你可能会看到意外行为甚至崩溃。在这些情况下，你可能希望从此优化中排除某些模块，或完全禁用它。

要 **禁用所有自动内联 `require` 调用：**

更新你的 `metro.config.js` 将 `inlineRequires` 转换器选项设置为 `false`：

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

要仅 **从 `require` 内联中排除某些模块：**

有两个相关的转换器选项：`inlineRequires.blockList` 和 `nonInlinedRequires`。参见代码片段以了解如何使用每个选项的示例。

```tsx title="metro.config.js"
module.exports = {
  transformer: {
    async getTransformOptions() {
      return {
        transform: {
          inlineRequires: {
            blockList: {
              // `DoNotInlineHere.js` 中的 require() 调用将不会被内联。
              [require.resolve('./src/DoNotInlineHere.js')]: true,

              // 其他任何地方的 require() 调用将被内联，除非它们
              // 匹配任何 nonInlinedRequires 条目（见下文）。
            },
          },
          nonInlinedRequires: [
            // require('react') 调用在任何地方都不会被内联
            'react',
          ],
        },
      };
    },
  },
};
```

参见 Metro 中的 [`getTransformOptions` 文档](https://metrobundler.dev/docs/configuration#gettransformoptions) 以获取更多关于设置和微调内联 `require` 的详细信息。

## 高级：使用随机访问模块包（非 Hermes）

:::info
**当 [使用 Hermes](#use-hermes) 时不支持。** Hermes 字节码与 RAM 包格式不兼容，并在所有用例中提供相同（或更好）的性能。
:::

随机访问模块包（也称为 RAM 包）与上述技术结合使用，以限制需要解析和加载到内存中的 JavaScript 代码量。每个模块存储为单独的字符串（或文件），仅在需要执行模块时才进行解析。

RAM 包可以物理分割为单独的文件，或者它们可以使用 _索引_ 格式，由单个文件中多个模块的查找表组成。

<Tabs groupId="platform" queryString defaultValue={constants.defaultPlatform} values={constants.platforms}>
<TabItem value="android">

在 Android 上，通过编辑你的 `android/app/build.gradle` 文件启用 RAM 格式。在 `apply from: "../../node_modules/react-native/react.gradle"` 行之前添加或修改 `project.ext.react` 块：

```
project.ext.react = [
  bundleCommand: "ram-bundle",
]
```

如果你想在 Android 上使用单个索引文件，请使用以下行：

```
project.ext.react = [
  bundleCommand: "ram-bundle",
  extraPackagerArgs: ["--indexed-ram-bundle"]
]
```

</TabItem>
<TabItem value="ios">

在 iOS 上，RAM 包始终是索引的（= 单个文件）。

在 Xcode 中通过编辑构建阶段 "Bundle React Native code and images" 启用 RAM 格式。在 `../node_modules/react-native/scripts/react-native-xcode.sh` 之前添加 `export BUNDLE_COMMAND="ram-bundle"`：

```
export BUNDLE_COMMAND="ram-bundle"
export NODE_BINARY=node
../node_modules/react-native/scripts/react-native-xcode.sh
```

</TabItem>
</Tabs>

参见 Metro 中的 [`getTransformOptions` 文档](https://metrobundler.dev/docs/configuration#gettransformoptions) 以获取更多关于设置和微调 RAM 包构建的详细信息。
