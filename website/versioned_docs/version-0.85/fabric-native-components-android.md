---
id: fabric-native-components-android
title: 'Fabric 原生模块：Android'
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

现在是时候编写一些 Android 平台代码以便能够渲染 web 视图了。你需要遵循的步骤如下：

- 运行 Codegen
- 编写 `ReactWebView` 的代码
- 编写 `ReactWebViewManager` 的代码
- 编写 `ReactWebViewPackage` 的代码
- 在应用程序中注册 `ReactWebViewPackage`

### 1. 通过 Gradle 运行 Codegen

运行一次此命令以生成你的首选 IDE 可以使用的样板代码。

```bash title="Demo/"
cd android
./gradlew generateCodegenArtifactsFromSchema
```

Codegen 将生成你需要实现的 `ViewManager` 接口和 web 视图的 `ViewManager` 代理。

### 2. 编写 `ReactWebView`

`ReactWebView` 是包裹 Android 原生视图的组件，当使用我们的自定义组件时，React Native 将渲染它。

在 `android/src/main/java/com/webview` 文件夹中创建一个带有此代码的 `ReactWebView.java` 或 `ReactWebView.kt` 文件：

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="java">

```java title="Demo/android/src/main/java/com/webview/ReactWebView.java"
package com.webview;

import android.content.Context;
import android.util.AttributeSet;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.events.Event;

public class ReactWebView extends WebView {
  public ReactWebView(Context context) {
    super(context);
    configureComponent();
  }

  public ReactWebView(Context context, AttributeSet attrs) {
    super(context, attrs);
    configureComponent();
  }

  public ReactWebView(Context context, AttributeSet attrs, int defStyleAttr) {
    super(context, attrs, defStyleAttr);
    configureComponent();
  }

  private void configureComponent() {
    this.setLayoutParams(new LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT));
    this.setWebViewClient(new WebViewClient() {
      @Override
      public void onPageFinished(WebView view, String url) {
        emitOnScriptLoaded(OnScriptLoadedEventResult.success);
      }
    });
  }

  public void emitOnScriptLoaded(OnScriptLoadedEventResult result) {
    ReactContext reactContext = (ReactContext) context;
    int surfaceId = UIManagerHelper.getSurfaceId(reactContext);
    EventDispatcher eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, getId());
    WritableMap payload = Arguments.createMap();
    payload.putString("result", result.name());

    OnScriptLoadedEvent event = new OnScriptLoadedEvent(surfaceId, getId(), payload);
    if (eventDispatcher != null) {
      eventDispatcher.dispatchEvent(event);
    }
  }

  public enum OnScriptLoadedEventResult {
    success,
    error
  }

  private class OnScriptLoadedEvent extends Event<OnScriptLoadedEvent> {
    private final WritableMap payload;

    OnScriptLoadedEvent(int surfaceId, int viewId, WritableMap payload) {
      super(surfaceId, viewId);
      this.payload = payload;
    }

    @Override
    public String getEventName() {
      return "onScriptLoaded";
    }

    @Override
    public WritableMap getEventData() {
      return payload;
    }
  }
}
```

</TabItem>
<TabItem value="kotlin">

```kotlin title="Demo/android/src/main/java/com/webview/ReactWebView.kt"
package com.webview

import android.content.Context
import android.util.AttributeSet
import android.webkit.WebView
import android.webkit.WebViewClient
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.ReactContext
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.events.Event

class ReactWebView: WebView {
  constructor(context: Context) : super(context) {
    configureComponent()
  }

  constructor(context: Context, attrs: AttributeSet?) : super(context, attrs) {
    configureComponent()
  }

  constructor(context: Context, attrs: AttributeSet?, defStyleAttr: Int) : super(context, attrs, defStyleAttr) {
    configureComponent()
  }

  private fun configureComponent() {
    this.layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
    this.webViewClient = object : WebViewClient() {
      override fun onPageFinished(view: WebView, url: String) {
        emitOnScriptLoaded(OnScriptLoadedEventResult.success)
      }
    }
  }

  fun emitOnScriptLoaded(result: OnScriptLoadedEventResult) {
    val reactContext = context as ReactContext
    val surfaceId = UIManagerHelper.getSurfaceId(reactContext)
    val eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(reactContext, id)
    val payload =
        Arguments.createMap().apply {
          putString("result", result.name)
        }
    val event = OnScriptLoadedEvent(surfaceId, id, payload)

    eventDispatcher?.dispatchEvent(event)
  }

  enum class OnScriptLoadedEventResult {
    success,
    error;
  }

  inner class OnScriptLoadedEvent(
      surfaceId: Int,
      viewId: Int,
      private val payload: WritableMap
  ) : Event<OnScriptLoadedEvent>(surfaceId, viewId) {
    override fun getEventName() = "onScriptLoaded"

    override fun getEventData() = payload
  }
}
```

</TabItem>
</Tabs>

`ReactWebView` 扩展了 Android 的 `WebView`，因此你可以轻松地重用平台已经定义的所有属性。

该类定义了三个 Android 构造函数，但将其实际实现延迟到私有 `configureComponent` 函数中。此函数负责初始化所有组件特定的属性：在这种情况下，你正在设置 `WebView` 的布局，并且正在定义用于自定义 `WebView` 行为的 `WebClient`。在此代码中，通过实现 `WebClient` 的 `onPageFinished` 方法，当页面完成加载时，`ReactWebView` 会发出一个事件。

然后代码定义了一个辅助函数来实际发出事件。要发出事件，你需要：

- 获取 `ReactContext` 的引用；
- 检索你正在呈现的视图的 `surfaceId`；
- 获取与视图关联的 `eventDispatcher` 的引用；
- 使用 `WritableMap` 对象构建事件的有效负载；
- 创建你需要发送到 JavaScript 的事件对象；
- 调用 `eventDispatcher.dispatchEvent` 发送事件。

文件的最后一部分包含发送事件所需的数据类型定义：

- `OnScriptLoadedEventResult`，包含 `OnScriptLoaded` 事件的可能结果。
- 实际的 `OnScriptLoadedEvent`，需要扩展 React Native 的 `Event` 类。

### 3. 编写 `WebViewManager`

`WebViewManager` 是将 React Native 运行时与原生视图连接起来的类。

当 React 收到来自应用程序渲染特定组件的指令时，React 使用注册的视图管理器来创建视图并传递所有所需的属性。

这是 `ReactWebViewManager` 的代码。

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="java">

```java title="Demo/android/src/main/java/com/webview/ReactWebViewManager.java"
package com.webview;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewManagerDelegate;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.viewmanagers.CustomWebViewManagerInterface;
import com.facebook.react.viewmanagers.CustomWebViewManagerDelegate;

import java.util.HashMap;
import java.util.Map;

@ReactModule(name = ReactWebViewManager.REACT_CLASS)
class ReactWebViewManager extends SimpleViewManager<ReactWebView> implements CustomWebViewManagerInterface<ReactWebView> {
  private final CustomWebViewManagerDelegate<ReactWebView, ReactWebViewManager> delegate =
          new CustomWebViewManagerDelegate<>(this);

  @Override
  public ViewManagerDelegate<ReactWebView> getDelegate() {
    return delegate;
  }

  @Override
  public String getName() {
    return REACT_CLASS;
  }

  @Override
  public ReactWebView createViewInstance(ThemedReactContext context) {
    return new ReactWebView(context);
  }

  @ReactProp(name = "sourceUrl")
  @Override
  public void setSourceURL(ReactWebView view, String sourceURL) {
    if (sourceURL == null) {
      view.emitOnScriptLoaded(ReactWebView.OnScriptLoadedEventResult.error);
      return;
    }
    view.loadUrl(sourceURL, new HashMap<>());
  }

  public static final String REACT_CLASS = "CustomWebView";

  @Override
  public Map<String, Object> getExportedCustomBubblingEventTypeConstants() {
    Map<String, Object> map = new HashMap<>();
    Map<String, Object> bubblingMap = new HashMap<>();
    bubblingMap.put("phasedRegistrationNames", new HashMap<String, String>() {{
      put("bubbled", "onScriptLoaded");
      put("captured", "onScriptLoadedCapture");
    }});
    map.put("onScriptLoaded", bubblingMap);
    return map;
  }
}
```

</TabItem>
<TabItem value="kotlin">

```kotlin title="Demo/android/src/main/java/com/webview/ReactWebViewManager.kt"
package com.webview

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewManagerDelegate;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.viewmanagers.CustomWebViewManagerInterface;
import com.facebook.react.viewmanagers.CustomWebViewManagerDelegate;

@ReactModule(name = ReactWebViewManager.REACT_CLASS)
class ReactWebViewManager(context: ReactApplicationContext) : SimpleViewManager<ReactWebView>(), CustomWebViewManagerInterface<ReactWebView> {
  private val delegate: CustomWebViewManagerDelegate<ReactWebView, ReactWebViewManager> =
    CustomWebViewManagerDelegate(this)

  override fun getDelegate(): ViewManagerDelegate<ReactWebView> = delegate

  override fun getName(): String = REACT_CLASS

  override fun createViewInstance(context: ThemedReactContext): ReactWebView = ReactWebView(context)

  @ReactProp(name = "sourceUrl")
  override fun setSourceURL(view: ReactWebView, sourceURL: String?) {
    if (sourceURL == null) {
      view.emitOnScriptLoaded(ReactWebView.OnScriptLoadedEventResult.error)
      return;
    }
    view.loadUrl(sourceURL, emptyMap())
  }

  companion object {
    const val REACT_CLASS = "CustomWebView"
  }

  override fun getExportedCustomBubblingEventTypeConstants(): Map<String, Any> =
      mapOf(
          "onScriptLoaded" to
              mapOf(
                  "phasedRegistrationNames" to
                      mapOf(
                          "bubbled" to "onScriptLoaded",
                          "captured" to "onScriptLoadedCapture"
                      )))
}
```

</TabItem>
</Tabs>

`ReactWebViewManager` 扩展了 React 的 `SimpleViewManager` 类并实现了由 Codegen 生成的 `CustomWebViewManagerInterface`。

它持有 `CustomWebViewManagerDelegate` 的引用，这是由 Codegen 生成的另一个元素。

然后它重写了 `getName` 函数，该函数必须返回与 spec 的 `codegenNativeComponent` 函数调用中使用的名称相同的名称。

`createViewInstance` 函数负责实例化一个新的 `ReactWebView`。

然后，ViewManager 需要定义所有 React 组件的 props 将如何更新原生视图。在示例中，你需要决定如何处理 React 将在 `WebView` 上设置的 `sourceURL` 属性。

最后，如果组件可以发出事件，你需要通过重写 `getExportedCustomBubblingEventTypeConstants` 来映射冒泡事件的事件名称，或者通过重写 `getExportedCustomDirectEventTypeConstants` 来映射直接事件。

### 4. 编写 `ReactWebViewPackage`

就像你对原生模块所做的那样，原生组件也需要实现 `ReactPackage` 类。这是一个你可以用来在 React Native 运行时中注册组件的对象。

这是 `ReactWebViewPackage` 的代码：

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="java">

```java title="Demo/android/src/main/java/com/webview/ReactWebViewPackage.java"
package com.webview;

import com.facebook.react.BaseReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;
import com.facebook.react.uimanager.ViewManager;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ReactWebViewPackage extends BaseReactPackage {
  @Override
  public List<ViewManager<?, ?>> createViewManagers(ReactApplicationContext reactContext) {
    return Collections.singletonList(new ReactWebViewManager(reactContext));
  }

  @Override
  public NativeModule getModule(String s, ReactApplicationContext reactApplicationContext) {
    if (ReactWebViewManager.REACT_CLASS.equals(s)) {
      return new ReactWebViewManager(reactApplicationContext);
    }
    return null;
  }

  @Override
  public ReactModuleInfoProvider getReactModuleInfoProvider() {
    return new ReactModuleInfoProvider() {
      @Override
      public Map<String, ReactModuleInfo> getReactModuleInfos() {
        Map<String, ReactModuleInfo> map = new HashMap<>();
        map.put(ReactWebViewManager.REACT_CLASS, new ReactModuleInfo(
                ReactWebViewManager.REACT_CLASS, // name
                ReactWebViewManager.REACT_CLASS, // className
                false,                           // canOverrideExistingModule
                false,                           // needsEagerInit
                false,                           // isCxxModule
                true                             // isTurboModule
        ));
        return map;
      }
    };
  }
}
```

</TabItem>
<TabItem value="kotlin">

```kotlin title="Demo/android/src/main/java/com/webview/ReactWebViewPackage.kt"
package com.webview

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider
import com.facebook.react.uimanager.ViewManager

class ReactWebViewPackage : BaseReactPackage() {
  override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
    return listOf(ReactWebViewManager(reactContext))
  }

  override fun getModule(s: String, reactApplicationContext: ReactApplicationContext): NativeModule? {
    when (s) {
      ReactWebViewManager.REACT_CLASS -> ReactWebViewManager(reactApplicationContext)
    }
    return null
  }

  override fun getReactModuleInfoProvider(): ReactModuleInfoProvider = ReactModuleInfoProvider {
    mapOf(ReactWebViewManager.REACT_CLASS to ReactModuleInfo(
      name = ReactWebViewManager.REACT_CLASS,
      className = ReactWebViewManager.REACT_CLASS,
      canOverrideExistingModule = false,
      needsEagerInit = false,
      isCxxModule = false,
      isTurboModule = true,
    )
    )
  }
}
```

</TabItem>
</Tabs>

`ReactWebViewPackage` 扩展了 `BaseReactPackage` 并实现了所有正确注册我们组件所需的方法。

- `createViewManagers` 方法是创建管理自定义视图的 `ViewManager` 的工厂方法。
- `getModule` 方法根据 React Native 需要渲染的视图返回适当的 ViewManager。
- `getReactModuleInfoProvider` 提供在运行时注册模块时所需的所有信息，

### 5. 在应用程序中注册 `ReactWebViewPackage`

最后，你需要在应用程序中注册 `ReactWebViewPackage`。我们通过修改 `MainApplication` 文件来实现这一点，将 `ReactWebViewPackage` 添加到 `getPackages` 函数返回的包列表中。

```kotlin title="Demo/app/src/main/java/com/demo/MainApplication.kt"
package com.demo

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.react.soloader.OpenSourceMergedSoMapping
import com.facebook.soloader.SoLoader
// highlight-next-line
import com.webview.ReactWebViewPackage

class MainApplication : Application(), ReactApplication {

  override val reactNativeHost: ReactNativeHost =
      object : DefaultReactNativeHost(this) {
        override fun getPackages(): List<ReactPackage> =
            PackageList(this).packages.apply {
              // highlight-next-line
              add(ReactWebViewPackage())
            }

        override fun getJSMainModuleName(): String = "index"

        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

        override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
      }

  override val reactHost: ReactHost
    get() = getDefaultReactHost(applicationContext, reactNativeHost)

  override fun onCreate() {
    super.onCreate()
    SoLoader.init(this, OpenSourceMergedSoMapping)
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      load()
    }
  }
}

```
