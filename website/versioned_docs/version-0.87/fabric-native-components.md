---
id: fabric-native-components-introduction
title: Fabric Native Components 简介
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import constants from '@site/core/TabsConstants';
import {FabricNativeComponentsAndroid,FabricNativeComponentsIOS} from './\_fabric-native-components';

# 原生组件

如果你想构建包裹 [Host Component](https://reactnative.dev/architecture/glossary#host-view-tree-and-host-view) 的*新* React Native Components，例如 Android 上的独特类型 [CheckBox](https://developer.android.com/reference/androidx/appcompat/widget/AppCompatCheckBox)，或 iOS 上的 [UIButton](https://developer.apple.com/documentation/uikit/uibutton?language=objc)，你应该使用 Fabric Native Component。

本指南将通过实现一个 web view component，向你展示如何构建 Fabric Native Components。具体步骤如下：

1. 使用 Flow 或 TypeScript 定义 JavaScript 规范。
2. 配置依赖项管理系统，从提供的规范生成代码并实现自动链接。
3. 实现 Native 代码。
4. 在 App 中使用 Component。

你需要一个通过以下命令生成的普通模板应用来使用该组件：

```bash
npx @react-native-community/cli@latest init Demo --install-pods false
```

## 创建 WebView Component

本指南将向你展示如何创建 Web View component。我们将使用 Android 的 [`WebView`](https://developer.android.com/reference/android/webkit/WebView) component，以及 iOS 的 [`WKWebView`](https://developer.apple.com/documentation/webkit/wkwebview?language=objc) component 来创建该组件。

首先创建用于存放 component 代码的文件夹结构：

```bash
mkdir -p Demo/{specs,android/app/src/main/java/com/webview}
```

这将生成以下布局，你将在其中进行工作：

```
Demo
├── android/app/src/main/java/com/webview
└── ios
└── specs
```

- `android/app/src/main/java/com/webview` 文件夹用于存放 Android 代码。
- `ios` 文件夹用于存放 iOS 代码。
- `specs` 文件夹用于存放 Codegen 的规范文件。

## 1. 为 Codegen 定义规范

你的规范必须使用 [TypeScript](https://www.typescriptlang.org/) 或 [Flow](https://flow.org/) 定义（有关更多详细信息，请参阅 [Codegen](the-new-architecture/what-is-codegen) 文档）。Codegen 使用此规范生成 C++、Objective-C++ 和 Java 代码，以将你的平台代码连接到 React 运行的 JavaScript runtime。

规范文件必须命名为 `<MODULE_NAME>NativeComponent.{ts|js}` 才能与 Codegen 配合使用。`NativeComponent` 后缀不仅是一种约定，Codegen 实际上会使用它来检测规范文件。

为我们的 WebView Component 使用以下规范：

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

该规范由三个主要部分组成，不包括导入：

- `WebViewScriptLoadedEvent` 是一种支持性数据类型，用于定义事件需要从 native 传递到 JavaScript 的数据。
- `NativeProps` 定义了我们可以在 component 上设置的 props。
- `codegenNativeComponent` 语句允许我们为 custom component 生成代码，并定义用于匹配 native implementations 的 component 名称。

与 Native Modules 一样，你可以在 `specs/` 目录中拥有多个规范文件。有关可以使用的类型，以及这些类型映射到的平台类型的更多信息，请参阅[附录](appendix.md#codegen-typings)。

## 2. 配置 Codegen 运行

React Native 的 Codegen 工具使用该规范为我们生成特定平台的接口和样板代码。为此，Codegen 需要知道在哪里找到我们的规范以及如何处理它。更新你的 `package.json`，加入以下内容：

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

Codegen 的所有配置完成后，我们需要准备 native code，以接入生成的代码。

请注意，对于 iOS，我们以声明方式将规范导出的 JS component 名称（`CustomWebView`）映射到将在 native 中实现该 component 的 iOS class。

## 2. 构建你的 Native Code

现在是时候编写 native platform code 了，这样当 React 需要渲染一个 view 时，平台就可以创建正确的 native view 并将其渲染到屏幕上。

你应该分别完成 Android 和 iOS 平台的实现。

:::note
本指南介绍了如何创建仅适用于 New Architecture 的 Native Component。如果你需要同时支持 New Architecture 和 Legacy Architecture，请参阅我们的[向后兼容指南](https://github.com/reactwg/react-native-new-architecture/blob/main/docs/backwards-compat.md)。

:::

<Tabs groupId="platforms" queryString defaultValue={constants.defaultPlatform}>
    <TabItem value="android" label="Android">
        <FabricNativeComponentsAndroid />
    </TabItem>
    <TabItem value="ios" label="iOS">
        <FabricNativeComponentsIOS />
    </TabItem>
</Tabs>

## 3. 使用你的 Native Component

最后，你可以在 app 中使用新的 component。将生成的 `App.tsx` 更新为：

```javascript title="Demo/App.tsx"
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

此代码创建了一个使用我们创建的新 `WebView` component 来加载 `react.dev` 网站的 app。

该 app 还会在网页加载完成时显示一个 alert。

## 4. 使用 WebView Component 运行你的 App

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
