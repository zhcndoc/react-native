import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

# 在你的原生组件上调用原生函数

在编写新的 Native Component 的[基础指南](/docs/fabric-native-components-introduction)中，你已经了解了如何创建一个新组件、如何将属性从 JS 侧传递到原生侧，以及如何从原生侧向 JS 发出事件。

自定义组件也可以命令式地调用原生代码中实现的某些函数，以实现更高级的功能，例如通过编程方式重新加载网页。

在本指南中，你将学习如何通过一个新概念来实现这一点：Native Commands。

本指南基于 [Native Components](/docs/fabric-native-components-introduction) 指南，并假设你已经熟悉它，以及熟悉 [Codegen](/docs/next/the-new-architecture/what-is-codegen)。

## 1. 更新你的组件规范

第一步是更新组件规范以声明 `NativeCommand`。

<Tabs groupId="language" queryString defaultValue={constants.defaultJavaScriptSpecLanguage} values={constants.javaScriptSpecLanguages}>
<TabItem value="typescript">

按如下方式更新 `WebViewNativeComponent.ts`：

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
+
+export const Commands: NativeCommands = codegenNativeCommands<NativeCommands>({
+    supportedCommands: ['reload'],
+});

export default codegenNativeComponent<NativeProps>(
  'CustomWebView',
) as HostComponent<NativeProps>;
```

</TabItem>
<TabItem value="flow">

按如下方式更新 `WebViewNativeComponent.js`：

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
+
+export const Commands: NativeCommands = codegenNativeCommands<NativeCommands>({
+    supportedCommands: ['reload'],
+});

export default (codegenNativeComponent<NativeProps>(
  'CustomWebView',
): HostComponent<NativeProps>);

```

</TabItem>
</Tabs>

这些改动要求你：

1. 从 `react-native` 导入 `codegenNativeCommands` 函数。这会指示 codegen 生成 `NativeCommands` 的代码
2. 定义一个包含我们想要在原生端调用的方法的接口。所有 Native Commands 都必须有一个类型为 `React.ElementRef` 的第一个参数。
3. 导出 `Commands` 变量，它是调用 `codegenNativeCommands` 的结果，并传入支持的命令列表。

:::warning
在 TypeScript 中，`React.ElementRef` 已被弃用。正确应使用的类型实际上是 `React.ComponentRef`。但是，由于 Codegen 中的一个 bug，使用 `ComponentRef` 会导致应用崩溃。我们已经有了修复，但还需要发布一个新的 React Native 版本来应用它。
:::

## 2. 更新 App 代码以使用新命令

现在你可以在应用中使用该命令了。

<Tabs groupId="language" queryString defaultValue={constants.defaultJavaScriptSpecLanguage} values={constants.javaScriptSpecLanguages}>
<TabItem value="typescript">

打开 `App.tsx` 文件，并按如下方式修改：

```diff title="App.tsx"
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

打开 `App.tsx` 文件，并按如下方式修改：

```diff title="App.jsx"
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

这里相关的改动如下：

1. 从规范文件中导入 `Commands` 常量。该命令是一个对象，让我们能够调用原生端已有的方法。
2. 使用 `useRef` 为 `WebView` 自定义原生组件声明一个 ref。你需要把这个 ref 传给原生命令。
3. 实现 `refresh` 函数。这个函数会检查 WebView 的 ref 是否为 `null`，如果不是，就调用该命令。
4. 添加一个 `Pressable`，在用户点击按钮时调用该命令。

其余改动都是常规的 React 修改，用于添加 `Pressable` 并优化视图样式，使其看起来更美观。

## 3. 重新运行 Codegen

现在规范已经更新，代码也已经准备好使用该命令，是时候实现原生代码了。不过，在开始编写原生代码之前，你必须重新运行 codegen，以便它生成原生代码所需的新类型。

<Tabs groupId="platforms" queryString defaultValue={constants.defaultPlatform}>
<TabItem value="android" label="Android">
Codegen 通过 `generateCodegenArtifactsFromSchema` Gradle 任务执行：

```bash
cd android
./gradlew generateCodegenArtifactsFromSchema

BUILD SUCCESSFUL in 837ms
14 actionable tasks: 3 executed, 11 up-to-date
```

这会在你构建 Android 应用时自动运行。
</TabItem>
<TabItem value="ios" label="iOS">
Codegen 作为 CocoaPods 自动添加到项目中的脚本阶段的一部分运行。

```bash
cd ios
bundle install
bundle exec pod install
```

输出看起来会像这样：

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

现在是时候实现原生改动了，这些改动将使你的 JS 能够直接调用原生视图上的方法。

<Tabs groupId="platforms" queryString defaultValue={constants.defaultPlatform}>
<TabItem value="android" label="Android">

要让你的视图响应 Native Command，你只需要修改 `ReactWebViewManager`。

如果你现在尝试构建，构建会失败，因为当前的 `ReactWebViewManager` 还没有实现新的 `reload` 方法。
为了解决这个构建错误，我们来修改 `ReactWebViewManager` 以实现它。

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

在这个例子中，直接调用 `view.reload()` 方法就足够了，因为我们的 `ReactWebView` 继承自 Android 的 `WebView`，因此可以直接使用 `reload` 方法。如果你实现的是一个自定义函数，而这个函数在你的自定义视图中并不存在，那么你还可能需要在由 React Native 的 `ViewManager` 管理的 Android `View` 中实现所需的方法。

</TabItem>
<TabItem value="ios" label="iOS">

要让你的视图响应 Native Command，我们需要在 iOS 上实现几个方法。

让我们打开 `RCTWebView.mm` 文件，并按如下方式修改：

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

要让你的视图响应 Native Commands，你需要进行以下更改：

1. 添加一个 `handleCommand:args` 函数。该函数由组件基础设施调用，用于处理命令。这个函数的实现对每个组件来说都很相似：你需要调用一个由 Codegen 为你生成的 `RCT<componentNameInJS>HandleCommand` 函数。`RCT<componentNameInJS>HandleCommand` 会执行一系列校验，验证我们需要调用的命令是否属于支持的命令之一，以及传入的参数是否与预期匹配。如果所有检查都通过，`RCT<componentNameInJS>HandleCommand` 就会调用正确的原生方法。
2. 实现 `reload` 方法。在这个示例中，`reload` 方法调用了 WebKit 的 WebView 的 `reloadFromOrigin` 函数。

</TabItem>
</Tabs>

## 5. 运行你的应用

最后，你可以使用常规命令运行你的应用。应用运行后，你可以点击刷新按钮，查看页面重新加载。

| <center>Android</center>                                                                         | <center>iOS</center>                                                                         |
| ------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| <center><img src="/docs/assets/native-commands-android.gif" height="75%" width="75%" /></center> | <center><img src="/docs/assets/native-commands-ios.gif" height="75%" width="75%" /></center> |
