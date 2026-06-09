---
id: fabric-native-components-introduction
title: Fabric 原生组件介绍
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import constants from '@site/core/TabsConstants';
import {FabricNativeComponentsAndroid,FabricNativeComponentsIOS} from './\_fabric-native-components';

# 原生组件

如果你想构建 _新的_ React Native 组件，用于包裹一个 [Host Component](https://reactnative.dev/architecture/glossary#host-view-tree-and-host-view)，例如 Android 上一种独特的 [CheckBox](https://developer.android.com/reference/androidx/appcompat/widget/AppCompatCheckBox)，或者 iOS 上的 [UIButton](https://developer.apple.com/documentation/uikit/uibutton?language=objc)，你应该使用 Fabric 原生组件。

本指南将通过实现一个 web view 组件来展示如何构建 Fabric 原生组件。具体步骤如下：

1. 使用 Flow 或 TypeScript 定义 JavaScript 规范。
2. 配置依赖管理系统，以便根据提供的规范生成代码并自动链接。
3. 实现原生代码。
4. 在应用中使用该组件。

你需要一个由普通模板生成的应用来使用该组件：

```bash
npx @react-native-community/cli@latest init Demo --install-pods false
```

## 创建 WebView 组件

本指南将展示如何创建一个 Web View 组件。我们将使用 Android 的 [`WebView`](https://developer.android.com/reference/android/webkit/WebView) 组件，以及 iOS 的 [`WKWebView`](https://developer.apple.com/documentation/webkit/wkwebview?language=objc) 组件来创建该组件。

让我们先创建用于存放组件代码的文件夹结构：

```bash
mkdir -p Demo/{specs,android/app/src/main/java/com/webview}
```

这会得到如下的工作目录布局：

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

你的规范必须使用 [TypeScript](https://www.typescriptlang.org/) 或 [Flow](https://flow.org/) 定义（更多细节请参见 [Codegen](the-new-architecture/what-is-codegen) 文档）。Codegen 会使用它生成 C++、Objective-C++ 和 Java 代码，以将你的平台代码连接到 React 运行所在的 JavaScript 运行时。

规范文件必须命名为 `<MODULE_NAME>NativeComponent.{ts|js}` 才能与 Codegen 配合使用。后缀 `NativeComponent` 不仅仅是一种约定，它实际上会被 Codegen 用来检测规范文件。

为我们的 WebView 组件使用以下规范：

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

该规范由三部分主要内容组成，不包括导入：

- `WebViewScriptLoadedEvent` 是一个辅助数据类型，用于承载事件从原生传递到 JavaScript 所需的数据。
- `NativeProps` 是我们可以设置在组件上的 props 定义。
- `codegenNativeComponent` 语句允许我们为自定义组件生成代码，并定义一个用于匹配原生实现的组件名称。

与原生模块一样，你可以在 `specs/` 目录中放置多个规范文件。有关你可以使用的类型以及它们映射到的平台类型的更多信息，请参见 [附录](appendix.md#codegen-typings)。

## 2. 配置 Codegen 运行

该规范会被 React Native 的 Codegen 工具用于为我们生成平台特定的接口和样板代码。为此，Codegen 需要知道去哪里找到我们的规范，以及如何处理它。请更新你的 `package.json`，添加以下内容：

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

完成 Codegen 的所有连接后，我们需要准备原生代码，以接入生成的代码。

注意，对于 iOS，我们以声明式方式将规范导出的 JS 组件名称（`CustomWebView`）映射到将原生实现该组件的 iOS 类。

## 2. 构建你的原生代码

现在该编写原生平台代码了，这样当 React 需要渲染一个视图时，平台就可以创建正确的原生视图并将其渲染到屏幕上。

你需要同时处理 Android 和 iOS 两个平台。

:::note
本指南展示的是如何创建一个只适用于新架构的原生组件。如果你需要同时支持新架构和旧架构，请参阅我们的[向后兼容指南](https://github.com/reactwg/react-native-new-architecture/blob/main/docs/backwards-compat.md)。

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

最后，你可以在应用中使用这个新组件。将你生成的 `App.tsx` 更新为：

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
          Alert.alert('页面已加载');
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

这段代码创建了一个应用，它使用我们创建的新的 `WebView` 组件来加载 `react.dev` 网站。

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
