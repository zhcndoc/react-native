---
id: optimizing-javascript-loading
title: 优化 JavaScript 加载
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

解析和运行 JavaScript 代码需要内存和时间。因此，随着应用不断增长，通常可以考虑延迟加载代码，直到首次需要使用它时再加载。React Native 默认启用了一些标准优化，你也可以在自己的代码中采用一些技术，帮助 React 更高效地加载应用。此外，还有一些适用于超大型应用的高级自动优化方案（但它们也各有取舍）。

## 推荐：使用 Hermes

Hermes 是新建 React Native 应用的默认引擎，并针对高效加载代码进行了高度优化。在 release 构建中，JavaScript 代码会提前完全编译为字节码。字节码会按需加载到内存中，并且不需要像普通 JavaScript 那样进行解析。

:::info
在 React Native 中了解更多关于使用 Hermes 的信息，请参阅[此处](./hermes)。
:::

## 推荐：延迟加载大型组件

如果某个包含大量代码或依赖项的组件在应用首次渲染时不太可能被使用，可以使用 React 的 [`lazy`](https://react.dev/reference/react/lazy) API，将其代码的加载推迟到首次渲染该组件时。通常，应考虑对应用中的屏幕级组件进行延迟加载，这样向应用添加新屏幕就不会增加应用的启动时间。

:::info
有关[使用 Suspense 延迟加载组件
](https://react.dev/reference/react/lazy#suspense-for-code-splitting)的更多信息（包括代码示例），请参阅 React 文档。
:::

### 提示：避免模块副作用

如果组件模块（或其依赖项）存在*副作用*，例如修改全局变量或订阅组件外部的事件，那么延迟加载组件可能会改变应用的行为。React 应用中的大多数模块都不应包含任何副作用。

```tsx title="SideEffects.tsx"
import Logger from './utils/Logger';

//  🚩 🚩 🚩 Side effect! This must be executed before React can even begin to
// render the SplashScreen component, and can unexpectedly break code elsewhere
// in your app if you later decide to lazy-load SplashScreen.
global.logger = new Logger();

export function SplashScreen() {
  // ...
}
```

## 高级：内联调用 `require`

有时，你可能希望延迟加载某些代码，直到首次使用它时再加载，同时又不使用 `lazy` 或异步 `import()`。你可以在原本会在文件顶部使用静态 `import` 的位置，使用 [`require()`](https://metrobundler.dev/docs/module-api/#require) 函数来实现这一点。

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
// Usually we would write a static import:
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

如果你使用 React Native CLI 构建应用，`require` 调用（但不包括 `import`）会自动为你进行内联，这既适用于你的代码，也适用于你使用的任何第三方软件包（`node_modules`）。

```tsx
import {useCallback, useState} from 'react';
import {TouchableOpacity, View, Text} from 'react-native';

// This top-level require call will be evaluated lazily as part of the component below.
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
某些 React Native 框架会禁用此行为。特别是在 Expo 项目中，默认不会内联 `require` 调用。你可以编辑项目的 Metro 配置，在 [`getTransformOptions`](https://metrobundler.dev/docs/configuration#gettransformoptions) 中将 `inlineRequires` 设置为 `true`，以启用此优化。
:::

### 内联 `require` 的注意事项

内联 `require` 调用会改变模块的求值顺序，甚至可能导致某些模块*永远不会*被求值。通常可以安全地自动执行此操作，因为 JavaScript 模块通常编写为无副作用模块。

如果你的某个模块确实存在副作用——例如，它初始化了某种日志机制，或修改了代码其他部分使用的全局 API——那么你可能会看到意外行为，甚至发生崩溃。在这些情况下，你可以选择将某些模块排除在此优化之外，或者完全禁用此优化。

要**禁用所有自动内联 `require` 调用：**

更新 `metro.config.js`，将 `inlineRequires` 转换器选项设置为 `false`：

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

要仅**排除特定模块进行 `require` 内联：**

有两个相关的转换器选项：`inlineRequires.blockList` 和 `nonInlinedRequires`。请参阅代码片段，了解如何使用这两个选项的示例。

```tsx title="metro.config.js"
module.exports = {
  transformer: {
    async getTransformOptions() {
      return {
        transform: {
          inlineRequires: {
            blockList: {
              // require() calls in `DoNotInlineHere.js` will not be inlined.
              [require.resolve('./src/DoNotInlineHere.js')]: true,

              // require() calls anywhere else will be inlined, unless they
              // match any entry nonInlinedRequires (see below).
            },
          },
          nonInlinedRequires: [
            // require('react') calls will not be inlined anywhere
            'react',
          ],
        },
      };
    },
  },
};
```

有关设置和微调内联 `require` 的更多详细信息，请参阅 [`getTransformOptions` in Metro](https://metrobundler.dev/docs/configuration#gettransformoptions) 文档。

## 高级：使用随机访问模块包（非 Hermes）

:::tip
**使用 [Hermes](#use-hermes) 时不支持。**Hermes 字节码与 RAM bundle 格式不兼容，并且在所有使用场景中都能提供相同或更好的性能。
:::

随机访问模块包（也称为 RAM bundle）与上述技术结合使用，可以限制需要解析并加载到内存中的 JavaScript 代码量。每个模块都存储为单独的字符串（或文件），只有在需要执行该模块时才会进行解析。

RAM bundle 可以在物理上拆分为多个文件，也可以使用*索引*格式，即在单个文件中包含多个模块的查找表。

<Tabs groupId="platform" queryString defaultValue={constants.defaultPlatform} values={constants.platforms}>
<TabItem value="android">

在 Android 上，编辑 `android/app/build.gradle` 文件以启用 RAM 格式。在 `apply from: "../../node_modules/react-native/react.gradle"` 所在行之前，添加或修改 `project.ext.react` 代码块：

```
project.ext.react = [
  bundleCommand: "ram-bundle",
]
```

如果希望使用单个索引文件，请在 Android 上使用以下代码行：

```
project.ext.react = [
  bundleCommand: "ram-bundle",
  extraPackagerArgs: ["--indexed-ram-bundle"]
]
```

</TabItem>
<TabItem value="ios">

在 iOS 上，RAM bundle 始终使用索引格式（＝单个文件）。

在 Xcode 中编辑构建阶段“Bundle React Native code and images”以启用 RAM 格式。在 `../node_modules/react-native/scripts/react-native-xcode.sh` 之前添加 `export BUNDLE_COMMAND="ram-bundle"`：

```
export BUNDLE_COMMAND="ram-bundle"
export NODE_BINARY=node
../node_modules/react-native/scripts/react-native-xcode.sh
```

</TabItem>
</Tabs>

有关设置和微调 RAM bundle 构建的更多详细信息，请参阅 [`getTransformOptions` in Metro](https://metrobundler.dev/docs/configuration#gettransformoptions) 文档。
