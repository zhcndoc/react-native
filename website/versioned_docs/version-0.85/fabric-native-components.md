---
id: fabric-native-components-introduction
title: Fabric 原生组件介绍
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import constants from '@site/core/TabsConstants';
import {FabricNativeComponentsAndroid,FabricNativeComponentsIOS} from './\_fabric-native-components';

# 原生组件

如果你想构建 _新_ 的 React Native 组件，这些组件封装了 [宿主组件](https://reactnative.dev/architecture/glossary#host-view-tree-and-host-view)，例如 Android 上独特的 [CheckBox](https://developer.android.com/reference/androidx/appcompat/widget/AppCompatCheckBox) 种类，或 iOS 上的 [UIButton](https://developer.apple.com/documentation/uikit/uibutton?language=objc)，你应该使用 Fabric 原生组件。

本指南将通过实现一个 web view 组件来展示如何构建 Fabric 原生组件。步骤如下：

1. 使用 Flow 或 TypeScript 定义 JavaScript 规范。
2. 配置依赖管理系统，以便从提供的规范生成代码并自动链接。
3. 实现原生代码。
4. 在 App 中使用该组件。

你需要一个使用普通模板生成的应用程序来使用该组件：

```bash
npx @react-native-community/cli@latest init Demo --install-pods false
```

## 创建 WebView 组件

本指南将展示如何创建 Web View 组件。我们将使用 Android 的 [`WebView`](https://developer.android.com/reference/android/webkit/WebView) 组件和 iOS 的 [`WKWebView`](https://developer.apple.com/documentation/webkit/wkwebview?language=objc) 组件来创建该组件。

首先，让我们创建文件夹结构来存放组件代码：

```bash
mkdir -p Demo/{specs,android/app/src/main/java/com/webview}
```

这将为你提供以下工作布局：

```
Demo
├── android/app/src/main/java/com/webview
└── ios
└── specs
```

- `android/app/src/main/java/com/webview` 文件夹将包含我们的 Android 代码。
- `ios` 文件夹将包含我们的 iOS 代码。
- `specs` 文件夹将包含 Codegen 的规范文件。

## 1. 为 Codegen 定义规范

你的规范必须定义为 [TypeScript](https://www.typescriptlang.org/) 或 [Flow](https://flow.org/)（详见 [Codegen](the-new-architecture/what-is-codegen) 文档）。Codegen 使用它来生成 C++、Objective-C++ 和 Java 代码，以将你的平台代码连接到 React 运行的 JavaScript 运行时。

规范文件必须命名为 `<MODULE_NAME>NativeComponent.{ts|js}` 才能与 Codegen 配合使用。后缀 `NativeComponent` 不仅是一个约定，它实际上被 Codegen 用于检测规范文件。

为我们的 WebView 组件使用此规范：

<Tabs groupId="language" queryString defaultValue={constants.defaultJavaScriptSpecLanguage} values={constants.javaScriptSpecLanguages}>
<TabItem value="typescript">

```typescript title="Demo/specs/WebViewNativeComponent.ts"
import type {
  CodegenTypes,
  HostComponent,
  ViewProps,
} from 'react-native';
import {codegenNativeComponent} from 'react-native';

type WebViewScriptLoadedEvent = {
  result: 'success' | 'error';
};

export interface NativeProps extends ViewProps {
  sourceURL?: string;
  onScriptLoaded?: CodegenTypes.BubblingEventHandler<WebViewScriptLoadedEvent> | null;
}

export default codegenNativeComponent<NativeProps>(
  'CustomWebView',
) as HostComponent<NativeProps>;
```

</TabItem>
<TabItem value="flow">

```ts title="Demo/RCTWebView/js/RCTWebViewNativeComponent.js":
// @flow strict-local

import type {CodegenTypes, HostComponent, ViewProps} from 'react-native';
import {codegenNativeComponent} from 'react-native';

type WebViewScriptLoadedEvent = $ReadOnly<{|
  result: "success" | "error",
|}>;

type NativeProps = $ReadOnly<{|
  ...ViewProps,
  sourceURL?: string;
  onScriptLoaded?: CodegenTypes.BubblingEventHandler<WebViewScriptLoadedEvent>?;
|}>;

export default (codegenNativeComponent<NativeProps>(
  'CustomWebView',
): HostComponent<NativeProps>);

```

</TabItem>
</Tabs>

此规范由三个主要部分组成，不包括导入：

- `WebViewScriptLoadedEvent` 是事件需要从原生传递到 JavaScript 的数据的支持数据类型。
- `NativeProps` 是我们可以设置在组件上的属性定义。
- `codegenNativeComponent` 语句允许我们为自定义组件生成代码，并定义一个用于匹配原生实现的组件名称。

与原生模块一样，你可以在 `specs/` 目录中拥有多个规范文件。有关你可以使用的类型以及这些类型映射到的平台类型的更多信息，请参阅 [附录](appendix.md#codegen-typings)。

## 2. 配置 Codegen 运行

规范由 React Native 的 Codegen 工具用于为我们生成平台特定的接口和样板代码。为此，Codegen 需要知道在哪里找到我们的规范以及如何处理它。更新你的 `package.json` 以包含：

```json package.json
    "start": "react-native start",
    "test": "jest"
  },
  // highlight-start
  "codegenConfig": {
    "name": "AppSpec",
    "type": "components",
    "jsSrcsDir": "specs",
    "android": {
      "javaPackageName": "com.webview"
    },
    "ios": {
      "componentProvider": {
        "CustomWebView": "RCTWebView"
      }
    }
  },
  // highlight-end
  "dependencies": {
```

一切都为 Codegen 连接好后，我们需要准备原生代码以挂钩到生成的代码中。

请注意，对于 iOS，我们以声明方式映射了规范导出的 JS 组件名称（`CustomWebView`）与将在原生实现组件的 iOS 类。

## 2. 构建你的原生代码

现在是编写原生平台代码的时候了，这样当 React 需要渲染视图时，平台可以创建正确的原生视图并将其渲染在屏幕上。

你应该同时处理 Android 和 iOS 平台。

:::note
本指南展示如何创建仅适用于新架构的原生组件。如果你需要同时支持新架构和旧架构，请参阅我们的 [向后兼容指南](https://github.com/reactwg/react-native-new-architecture/blob/main/docs/backwards-compat.md)。

:::

<Tabs groupId="platforms" queryString defaultValue={constants.defaultPlatform}>
    <TabItem value="android" label="Android">
        <FabricNativeComponentsAndroid />
    </TabItem>
    <TabItem value="ios" label="iOS">
        <FabricNativeComponentsIOS />
    </TabItem>
</Tabs>

## 3. 使用你的原生组件

最后，你可以在你的应用中使用新组件。更新生成的 `App.tsx` 为：

```javascript title="Demo/App.tsx"
import React from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import WebView from './specs/WebViewNativeComponent';

function App(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <WebView
        sourceURL="https://react.dev/"
        style={styles.webview}
        onScriptLoaded={() => {
          Alert.alert('Page Loaded');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    alignContent: 'center',
  },
  webview: {
    width: '100%',
    height: '100%',
  },
});

export default App;
```

此代码创建了一个使用我们创建的新 `WebView` 组件来加载 `react.dev` 网站的应用。

当网页加载完成时，应用还会显示一个警报。

## 4. 使用 WebView 组件运行你的应用

<Tabs groupId="platforms" queryString defaultValue={constants.defaultPlatform}>
<TabItem value="android" label="Android">
```bash
yarn run android
```
</TabItem>
<TabItem value="ios" label="iOS">
```bash
yarn run ios
```
</TabItem>
</Tabs>

|                                      Android                                      |                                     iOS                                      |
| :-------------------------------------------------------------------------------: | :--------------------------------------------------------------------------: |
| <img style={{ "max-height": "600px" }} src="/docs/assets/webview-android.webp" /> | <img style={{"max-height": "600px" }} src="/docs/assets/webview-ios.webp" /> |
