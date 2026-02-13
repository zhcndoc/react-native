import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

# 在你的原生组件上调用原生函数

在编写新原生组件的[基础指南](/docs/fabric-native-components-introduction)中，你已经了解了如何创建新组件、如何从 JS 侧向原生侧传递属性，以及如何从原生侧向 JS 发射事件。

自定义组件还可以命令式地调用原生代码中实现的一些函数，以实现更高级的功能，例如编程式地重新加载网页。

在本指南中，你将学习如何实现这一点，使用一个新概念：原生命令（Native Commands）。

本指南基于[原生组件](/docs/fabric-native-components-introduction)指南，假设你已经熟悉它，并且熟悉[Codegen](/docs/next/the-new-architecture/what-is-codegen)。

## 1. 更新你的组件规格说明

第一步是更新组件规格，声明 `NativeCommand`。

<Tabs groupId="language" queryString defaultValue={constants.defaultJavaScriptSpecLanguage} values={constants.javaScriptSpecLanguages}>
<TabItem value="typescript">

更新 `WebViewNativeComponent.ts` 内容如下：

```diff title="Demo/specs/WebViewNativeComponent.ts"
import type {HostComponent, ViewProps} from 'react-native';
import type {BubblingEventHandler} from 'react-native/Libraries/Types/CodegenTypes';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
+import codegenNativeCommands from 'react-native/Libraries/Utilities/codegenNativeCommands';

type WebViewScriptLoadedEvent = {
  result: 'success' | 'error';
};

export interface NativeProps extends ViewProps {
  sourceURL?: string;
  onScriptLoaded?: BubblingEventHandler<WebViewScriptLoadedEvent> | null;
}

+interface NativeCommands {
+    reload: (viewRef: React.ElementRef<HostComponent<NativeProps>>) => void;
+}

+export const Commands: NativeCommands = codegenNativeCommands<NativeCommands>({
+    supportedCommands: ['reload'],
+});

export default codegenNativeComponent<NativeProps>(
  'CustomWebView',
) as HostComponent<NativeProps>;
```

</TabItem>
<TabItem value="flow">

更新 `WebViewNativeComponent.js` 内容如下：

```diff title="Demo/specs/WebViewNativeComponent.js"
// @flow strict-local

import type {HostComponent, ViewProps} from 'react-native';
import type {BubblingEventHandler} from 'react-native/Libraries/Types/CodegenTypes';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
+import codegenNativeCommands from 'react-native/Libraries/Utilities/codegenNativeCommands';

type WebViewScriptLoadedEvent = $ReadOnly<{|
  result: "success" | "error",
|}>;

type NativeProps = $ReadOnly<{|
  ...ViewProps,
  sourceURL?: string;
  onScriptLoaded?: BubblingEventHandler<WebViewScriptLoadedEvent>?;
|}>;

+interface NativeCommands {
+    reload: (viewRef: React.ElementRef<HostComponent<NativeProps>>) => void;
+}

+export const Commands: NativeCommands = codegenNativeCommands<NativeCommands>({
+    supportedCommands: ['reload'],
+});

export default (codegenNativeComponent<NativeProps>(
  'CustomWebView',
): HostComponent<NativeProps>);

```

</TabItem>
</Tabs>

这些更改需要你：

1. 从 `react-native` 导入 `codegenNativeCommands` 函数。它告诉 codegen 需要生成 `NativeCommands` 相关代码；
2. 定义一个接口，包含想要在原生侧调用的方法。所有原生命令的第一个参数必须是 `React.ElementRef` 类型；
3. 导出 `Commands` 变量，它是调用 `codegenNativeCommands` 并传入支持命令列表的结果。

:::warning
在 TypeScript 中，`React.ElementRef` 已被弃用。正确的类型其实是 `React.ComponentRef`。但由于 Codegen 的一个 bug，使用 `ComponentRef` 会导致应用崩溃。我们已经有修复方案，但需要发布新版本的 React Native 才能生效。
:::

## 2. 更新 App 代码以使用新命令

现在你可以在 App 中使用这个命令了。

<Tabs groupId="language" queryString defaultValue={constants.defaultJavaScriptSpecLanguage} values={constants.javaScriptSpecLanguages}>
<TabItem value="typescript">

打开 `App.tsx` 并修改如下：

```diff title="App.tsx"
import React from 'react';
-import {Alert, StyleSheet, View} from 'react-native';
-import WebView from '../specs/WebViewNativeComponent';
+import {Alert, StyleSheet, Pressable, Text, View} from 'react-native';
+import WebView, {Commands} from '../specs/WebViewNativeComponent';

function App(): React.JSX.Element {
+    const webViewRef = React.useRef<React.ElementRef<typeof View> | null>(null);
+
+    const refresh = () => {
+        if (webViewRef.current) {
+            Commands.reload(webViewRef.current);
+        }
+    };

  return (
    <View style={styles.container}>
      <WebView
+       ref={webViewRef}
        sourceURL="https://react.dev/"
        style={styles.webview}
        onScriptLoaded={() => {
          Alert.alert('Page Loaded');
        }}
      />
+      <View style={styles.tabbar}>
+        <Pressable onPress={refresh} style={styles.button}>
+            {({pressed}) => (
+                !pressed ? <Text style={styles.buttonText}>Refresh</Text> : <Text style={styles.buttonTextPressed}>Refresh</Text>) }
+        </Pressable>
+      </View>
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
-    height: '100%',
+    height: '90%',
  },
+  tabbar: {
+    flex: 1,
+    backgroundColor: 'gray',
+    width: '100%',
+    alignItems: 'center',
+    alignContent: 'center',
+  },
+  button: {
+    margin: 10,
+  },
+  buttonText: {
+    fontSize: 20,
+    fontWeight: 'bold',
+    color: '#00D6FF',
+    width: '100%',
+  },
+  buttonTextPressed: {
+    fontSize: 20,
+    fontWeight: 'bold',
+    color: '#00D6FF77',
+    width: '100%',
+  },
});

export default App;
```

</TabItem>
<TabItem value="flow">

打开 `App.tsx` 并修改如下：

```diff title="App.jsx"
import React from 'react';
-import {Alert, StyleSheet, View} from 'react-native';
-import WebView from '../specs/WebViewNativeComponent';
+import {Alert, StyleSheet, Pressable, Text, View} from 'react-native';
+import WebView, {Commands} from '../specs/WebViewNativeComponent';

function App(): React.JSX.Element {
+    const webViewRef = React.useRef<React.ElementRef<typeof View> | null>(null);
+
+    const refresh = () => {
+        if (webViewRef.current) {
+            Commands.reload(webViewRef.current);
+        }
+    };

  return (
    <View style={styles.container}>
      <WebView
+       ref={webViewRef}
        sourceURL="https://react.dev/"
        style={styles.webview}
        onScriptLoaded={() => {
          Alert.alert('Page Loaded');
        }}
      />
+      <View style={styles.tabbar}>
+        <Pressable onPress={refresh} style={styles.button}>
+            {({pressed}) => (
+                !pressed ? <Text style={styles.buttonText}>Refresh</Text> : <Text style={styles.buttonTextPressed}>Refresh</Text>) }
+        </Pressable>
+      </View>
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
-    height: '100%',
+    height: '90%',
  },
+  tabbar: {
+    flex: 1,
+    backgroundColor: 'gray',
+    width: '100%',
+    alignItems: 'center',
+    alignContent: 'center',
+  },
+  button: {
+    margin: 10,
+  },
+  buttonText: {
+    fontSize: 20,
+    fontWeight: 'bold',
+    color: '#00D6FF',
+    width: '100%',
+  },
+  buttonTextPressed: {
+    fontSize: 20,
+    fontWeight: 'bold',
+    color: '#00D6FF77',
+    width: '100%',
+  },
});

export default App;
```

</TabItem>
</Tabs>

这里的相关变更是：

1. 从规格文件导入 `Commands` 常量。这个对象允许我们调用原生实现的方法。
2. 使用 `useRef` 声明对自定义 `WebView` 组件的引用，并传递给原生命令。
3. 实现 `refresh` 函数。该函数首先检测 WebView 的 ref 是否为空，如果不为空，则调用命令。
4. 添加一个可点击组件，用户点击按钮时调用命令。

其余更改是普通的 React 改动，添加了 `Pressable` 控件并美化视图布局。

## 3. 重新运行 Codegen

规格更新后，代码已准备好使用命令，接下来是实现原生代码前，必须重新运行 codegen，生成原生代码所需的新类型定义。

<Tabs groupId="platforms" queryString defaultValue={constants.defaultPlatform}>
<TabItem value="android" label="Android">
Codegen 是通过 Gradle 任务 `generateCodegenArtifactsFromSchema` 执行的：

```bash
cd android
./gradlew generateCodegenArtifactsFromSchema

BUILD SUCCESSFUL in 837ms
14 actionable tasks: 3 executed, 11 up-to-date
```

当你构建 Android 应用时会自动运行此任务。
</TabItem>
<TabItem value="ios" label="iOS">
Codegen 是作为 CocoaPods 项目自动添加的脚本阶段运行的。

```bash
cd ios
bundle install
bundle exec pod install
```

输出大致如下：

```shell
...
Framework build type is static library
[Codegen] Adding script_phases to ReactCodegen.
[Codegen] Generating ./build/generated/ios/ReactCodegen.podspec.json
[Codegen] Analyzing /Users/me/src/TurboModuleExample/package.json
[Codegen] Searching for codegen-enabled libraries in the app.
[Codegen] Found TurboModuleExample
[Codegen] Searching for codegen-enabled libraries in the project dependencies.
[Codegen] Found react-native
...
```

</TabItem>
</Tabs>

## 4. 实现原生代码

现在是实现原生变更的时候了，这将使你的 JS 代码能够直接调用原生视图上的方法。

<Tabs groupId="platforms" queryString defaultValue={constants.defaultPlatform}>
<TabItem value="android" label="Android">

要让视图响应原生命令，只需要修改 `ReactWebViewManager` 即可。

若你现在直接构建，构建会失败，因为当前的 `ReactWebViewManager` 没有实现新的 `reload` 方法。
为了解决构建错误，我们修改 `ReactWebViewManager` 来实现它。

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="java">

```diff title="ReactWebViewManager.java"

//...
  @ReactProp(name = "sourceUrl")
  @Override
  public void setSourceURL(ReactWebView view, String sourceURL) {
    if (sourceURL == null) {
      view.emitOnScriptLoaded(ReactWebView.OnScriptLoadedEventResult.error);
      return;
    }
    view.loadUrl(sourceURL, new HashMap<>());
  }

+  @Override
+  public void reload(ReactWebView view) {
+    view.reload();
+  }

  public static final String REACT_CLASS = "CustomWebView";
//...
```

</TabItem>
<TabItem value="kotlin">

```diff title="ReactWebViewManager.kt"
  @ReactProp(name = "sourceUrl")
  override fun setSourceURL(view: ReactWebView, sourceURL: String?) {
    if (sourceURL == null) {
      view.emitOnScriptLoaded(ReactWebView.OnScriptLoadedEventResult.error)
      return;
    }
    view.loadUrl(sourceURL, emptyMap())
  }

+  override fun reload(view: ReactWebView) {
+    view.reload()
+  }

  companion object {
    const val REACT_CLASS = "CustomWebView"
  }
```

</TabItem>
</Tabs>

这里可以直接调用 `view.reload()` 方法，因为我们的 ReactWebView 继承自 Android 的 `WebView`，其自身有可用的 reload 方法。如果你实现的是没有现成方法的自定义功能，可能还需要在被 React Native `ViewManager` 管理的 Android 视图类中实现对应方法。

</TabItem>
<TabItem value="ios" label="iOS">

要让视图响应原生命令，我们需要在 iOS 上实现几个方法。

打开 `RCTWebView.mm` 文件，做如下修改：

```diff title="RCTWebView.mm"
  // Event emitter convenience method
  - (const CustomWebViewEventEmitter &)eventEmitter
  {
  return static_cast<const CustomWebViewEventEmitter &>(*_eventEmitter);
  }

+  - (void)handleCommand:(const NSString *)commandName args:(const NSArray *)args
+  {
+  RCTCustomWebViewHandleCommand(self, commandName, args);
+  }
+
+  - (void)reload
+  {
+  [_webView reloadFromOrigin];
+  }

  + (ComponentDescriptorProvider)componentDescriptorProvider
  {
  return concreteComponentDescriptorProvider<CustomWebViewComponentDescriptor>();
  }
```

要使视图响应原生命令，需做以下改动：

1. 添加 `handleCommand:args` 函数。该方法由组件基础设施调用以处理命令。方法实现对所有组件类似——调用 Codegen 自动生成的 `RCT<组件名>HandleCommand` 函数。该函数会做验证，比如确认要调用的命令在支持列表中、参数匹配预期等。验证通过后，`RCT<组件名>HandleCommand` 会调用对应的原生方法。
2. 实现 `reload` 方法。在本例中，`reload` 方法调用了 WebKit 的 WebView 的 `reloadFromOrigin` 函数。

</TabItem>
</Tabs>

## 5. 运行你的应用

最后，你可以用平常的命令运行你的应用。应用启动后，点击刷新按钮即可看到页面重新加载。

| <center>Android</center>                                                                         | <center>iOS</center>                                                                         |
| ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| <center><img src="/docs/assets/native-commands-android.gif" height="75%" width="75%" /></center> | <center><img src="/docs/assets/native-commands-ios.gif" height="75%" width="75%" /></center> |
