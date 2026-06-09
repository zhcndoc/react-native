---
id: fabric-native-components-introduction
title: Fabric 原生组件介绍
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import constants from '@site/core/TabsConstants';
import {FabricNativeComponentsAndroid,FabricNativeComponentsIOS} from './\_fabric-native-components';

# 原生组件

如果你想构建 _新的_ React Native 组件，包装一个像 Android 上独特的 [CheckBox](https://developer.android.com/reference/androidx/appcompat/widget/AppCompatCheckBox)，或 iOS 上的 [UIButton](https://developer.apple.com/documentation/uikit/uibutton?language=objc) 这样的[宿主组件](https://reactnative.dev/architecture/glossary#host-view-tree-and-host-view)，你应该使用 Fabric 原生组件。

本指南将通过实现一个 Web View 组件来展示如何构建 Fabric 原生组件。步骤如下：

1. 使用 Flow 或 TypeScript 定义 JavaScript 规范。
2. 配置依赖管理系统，从规范生成代码并支持自动链接。
3. 实现原生代码。
4. 在应用中使用该组件。

你需要先生成一个基础模板应用来使用该组件：

```bash
npx @react-native-community/cli@latest init Demo --install-pods false
```

## 创建 WebView 组件

本指南将教你如何创建一个 Web View 组件。我们将使用 Android 的 [`WebView`](https://developer.android.com/reference/android/webkit/WebView) 组件和 iOS 的 [`WKWebView`](https://developer.apple.com/documentation/webkit/wkwebview?language=objc) 组件来创建该组件。

先创建文件夹结构来存放组件代码：

```bash
mkdir -p Demo/{specs,android/app/src/main/java/com/webview}
```

你将获得如下工作目录结构：

```
Demo
├── android/app/src/main/java/com/webview
└── ios
└── specs
```

- `android/app/src/main/java/com/webview` 文件夹包含我们的 Android 代码。
- `ios` 文件夹包含我们的 iOS 代码。
- `specs` 文件夹包含 Codegen 的规范文件。

## 1. 定义 Codegen 规范

你的规范必须使用 [TypeScript](https://www.typescriptlang.org/) 或 [Flow](https://flow.org/) 定义（详细信息见 [Codegen](the-new-architecture/what-is-codegen) 文档）。Codegen 利用它生成 C++、Objective-C++ 和 Java 代码，将平台代码与 React 运行的 JavaScript 运行时连接。

规范文件名必须为 `<MODULE_NAME>NativeComponent.{ts|js}`，才能被 Codegen 识别。后缀 `NativeComponent` 不仅是约定，Codegen 也通过它识别规范文件。

使用以下规格文件来定义我们的 WebView 组件：

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
  result: '成功' | '错误';
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
  result: "成功" | "错误",
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

此规范包含三部分，去掉导入部分：

- `WebViewScriptLoadedEvent` 是事件从原生向 JavaScript 传递的数据类型。
- `NativeProps` 定义了组件可接受的 props。
- `codegenNativeComponent` 语句用于生成自定义组件代码，并定义组件名以匹配原生实现。

和原生模块类似，你可以在 `specs/` 目录下拥有多个规范文件。有关可用类型及其对应平台类型的更多信息，请参见[附录](appendix.md#codegen-typings)。

## 2. 配置 Codegen 运行

该规范由 React Native 的 Codegen 工具使用，生成特定平台的接口和模板代码。为此，Codegen 需要知道规范位置及如何处理它。更新你的 `package.json`，添加如下内容：

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

配置完成后，我们需要准备原生代码，以挂钩生成的代码。

注意，iOS 端我们声明性地映射了规范导出的 JS 组件名 (`CustomWebView`) 与将实现原生组件的 iOS 类名 (`RCTWebView`)。

## 2. 编写你的原生代码

现在是时候编写原生代码了，使 React 在渲染视图时能创建正确的原生视图并显示。

你需要完成 Android 和 iOS 两个平台的实现。

:::note
本指南介绍如何创建仅支持新架构的原生组件。如果你需要同时支持新架构和旧架构，请参见我们的[向后兼容指南](https://github.com/reactwg/react-native-new-architecture/blob/main/docs/backwards-compat.md)。
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

最后，你可以在应用中使用新组件。更新生成的 `App.tsx`：

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

这段代码创建了一个应用，使用我们新创建的 `WebView` 组件加载 `react.dev` 网站。

当网页加载完成时，应用会弹出一个提示框。

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