---
id: optimizing-javascript-loading
title: 优化 JavaScript 加载
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

解析和运行 JavaScript 代码需要消耗内存和时间。因此，随着应用的增长，通常推迟加载代码直到首次需要时才加载是很有用的。React Native 自带一些默认开启的标准优化手段，您也可以在自己的代码中采用一些技巧，帮助 React 更高效地加载您的应用。此外，还有一些适合非常大型应用的高级自动优化（但有其各自的权衡）。

## 推荐：使用 Hermes

Hermes 是新建 React Native 应用的默认引擎，针对高效代码加载做了高度优化。在发布构建中，JavaScript 代码会提前完全编译成字节码。字节码按需加载到内存，不像普通 JavaScript 代码那样需要解析。

:::info
关于在 React Native 中使用 Hermes 的更多信息，请参见[这里](./hermes)。
:::

## 推荐：懒加载大型组件

如果某个含有大量代码/依赖的组件在首次渲染应用时不太可能被使用，您可以使用 React 的 [`lazy`](https://react.dev/reference/react/lazy) API 来推迟加载其代码，直到组件首次渲染。通常，您应该考虑对应用中的屏幕级组件进行懒加载，这样增加新屏幕时就不会增加启动时间。

:::info
关于使用 Suspense [懒加载组件的更多内容](https://react.dev/reference/react/lazy#suspense-for-code-splitting)，包括代码示例，请参考 React 官方文档。
:::

### 小提示：避免模块副作用

如果组件模块（或其依赖）具有_副作用_，例如修改全局变量或订阅组件外的事件，懒加载组件可能会改变应用行为。React 应用中的大多数模块不应具有副作用。

```tsx title="SideEffects.tsx"
import Logger from './utils/Logger';

//  🚩 🚩 🚩 副作用！这必须在 React 开始渲染 SplashScreen 组件之前执行，
// 如果之后决定懒加载 SplashScreen，可能会意外破坏应用中其他代码。
global.logger = new Logger();

export function SplashScreen() {
  // ...
}
```

## 高级：内联调用 `require`

有时您可能想推迟加载某些代码直到首次使用，而不使用 `lazy` 或异步 `import()`。可通过在文件顶部的静态 `import` 位置使用 [`require()`](https://metrobundler.dev/docs/module-api/#require) 函数来实现。

```tsx title="VeryExpensive.tsx"
import {Component} from 'react';
import {Text} from 'react-native';
// ... 引入一些非常大的模块

export default function VeryExpensive() {
  // ... 许多渲染逻辑
  return <Text>非常昂贵的组件</Text>;
}
```

```tsx title="Optimized.tsx"
import {useCallback, useState} from 'react';
import {TouchableOpacity, View, Text} from 'react-native';
// 通常我们会写静态导入：
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

如果您使用 React Native CLI 来构建应用，`require` 调用（但不包含 `import`）会自动为您内联，无论是在您自己的代码中，还是在所用的第三方包（`node_modules`）中。

```tsx
import {useCallback, useState} from 'react';
import {TouchableOpacity, View, Text} from 'react-native';

// 这个顶级 require 调用将在下面的组件中被懒惰求值。
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
某些 React Native 框架会禁用此行为。尤其是 Expo 项目中，默认不会内联 `require` 调用。您可以通过编辑项目的 Metro 配置，在 [`getTransformOptions`](https://metrobundler.dev/docs/configuration#gettransformoptions) 中设置 `inlineRequires: true` 来启用此优化。
:::

### 内联 `require` 的陷阱

内联 `require` 调用会改变模块的求值顺序，甚至可能导致某些模块 _永远不会_ 被求值。通常自动进行这类优化是安全的，因为 JavaScript 模块往往是无副作用的。

如果某个模块有副作用（例如初始化日志机制，或修补全局 API），则可能出现意外行为甚至崩溃。在此情况下，您可能想从优化中排除特定模块，或完全禁用此功能。

要**禁用所有自动内联的 `require` 调用：**

更新您的 `metro.config.js`，将 `inlineRequires` 转换器选项设置为 `false`：

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

要**仅排除特定模块不进行 `require` 内联：**

有两个相关转换器选项：`inlineRequires.blockList` 和 `nonInlinedRequires`。下面示例说明了各自的用法。

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
              // 匹配 nonInlinedRequires（见下）。
            },
          },
          nonInlinedRequires: [
            // 任何地方的 require('react') 调用都不会被内联
            'react',
          ],
        },
      };
    },
  },
};
```

有关配置和调整内联 `require` 的更多细节，请参阅 Metro 中 [`getTransformOptions`](https://metrobundler.dev/docs/configuration#gettransformoptions) 文档。

## 高级：使用随机访问模块包（非 Hermes）

:::tip
**[使用 Hermes](#use-hermes) 时不支持。** Hermes 字节码与 RAM bundle 格式不兼容，且在所有用例中提供相同（或更好）的性能。
:::

随机访问模块包（也称 RAM bundles）配合上述技术减少需要解析和加载到内存的 JavaScript 代码量。每个模块作为独立字符串（或文件）存储，只有执行模块时才解析。

RAM bundles 可物理拆分成多个文件，也可以使用 _索引_ 格式，将多个模块放到单文件的查找表中。

<Tabs groupId="platform" queryString defaultValue={constants.defaultPlatform} values={constants.platforms}>
<TabItem value="android">

在 Android 上，通过编辑 `android/app/build.gradle` 启用 RAM 格式。在 `apply from: "../../node_modules/react-native/react.gradle"` 行之前添加或修改 `project.ext.react` 配置块：

```
project.ext.react = [
  bundleCommand: "ram-bundle",
]
```

若想在 Android 上使用单个索引文件，请使用以下配置：

```
project.ext.react = [
  bundleCommand: "ram-bundle",
  extraPackagerArgs: ["--indexed-ram-bundle"]
]
```

</TabItem>
<TabItem value="ios">

在 iOS 上，RAM bundles 总是索引形式（单文件）。

在 Xcode 通过编辑构建阶段 “Bundle React Native code and images” 启用 RAM 格式。在 `../node_modules/react-native/scripts/react-native-xcode.sh` 命令之前添加：

```
export BUNDLE_COMMAND="ram-bundle"
export NODE_BINARY=node
../node_modules/react-native/scripts/react-native-xcode.sh
```

</TabItem>
</Tabs>

有关设置和调整 RAM bundle 构建的详细信息，请参阅 Metro 中 [`getTransformOptions`](https://metrobundler.dev/docs/configuration#gettransformoptions) 文档。