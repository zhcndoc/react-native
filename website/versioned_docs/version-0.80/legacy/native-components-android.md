---
id: native-components-android
title: Android 原生 UI 组件
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';
import NativeDeprecated from '../the-new-architecture/\_markdown_native_deprecation.mdx'

<NativeDeprecated />

有大量原生 UI 组件已经可以直接用于最新的应用中——其中一些是平台自带的，另一些来自第三方库，还有一些可能就在你自己的项目中被使用。React Native 已经封装了若干最关键的平台组件，比如 `ScrollView` 和 `TextInput`，但并不是全部，更不一定包括你为之前的应用自己写过的那些组件。好在，我们可以把这些现有组件封装起来，与 React Native 应用无缝集成。

和原生模块指南一样，这也是一份更高级的指南，默认你已经对 Android SDK 编程有一定了解。本指南将展示如何构建一个原生 UI 组件，并带你实现 React Native 核心库中现有 `ImageView` 组件的一个子集。

:::info
你也可以通过一条命令搭建包含原生组件的本地库。更多详情请阅读 [本地库搭建](local-library-setup) 指南。
:::

## ImageView 示例

在这个示例中，我们将逐步讲解如何实现，让你能在 JavaScript 中使用 ImageView。

原生视图通过继承 `ViewManager` 或更常见的 `SimpleViewManager` 来创建和操作。`SimpleViewManager` 在这里很方便，因为它会应用诸如背景色、透明度和 Flexbox 布局等常见属性。

这些子类本质上是单例——桥接层只会为每个类创建一个实例。它们会把原生视图发送给 `NativeViewHierarchyManager`，后者再回调它们，在需要时设置和更新视图属性。`ViewManagers` 通常也会充当这些视图的代理，通过桥接层向 JavaScript 发送事件。

要发送一个视图：

1. 创建 `ViewManager` 子类。
2. 实现 `createViewInstance` 方法
3. 使用 `@ReactProp`（或 `@ReactPropGroup`）注解暴露视图属性 setter
4. 在应用包的 `createViewManagers` 中注册该管理器。
5. 实现 JavaScript 模块

### 1. 创建 `ViewManager` 子类

在这个示例中，我们创建名为 `ReactImageManager` 的视图管理器类，它继承了类型为 `ReactImageView` 的 `SimpleViewManager`。`ReactImageView` 是由该管理器管理的对象类型，这将是自定义的原生视图。`getName` 返回的名称用于在 JavaScript 中引用该原生视图类型。

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="kotlin">

```kotlin
class ReactImageManager(
    private val callerContext: ReactApplicationContext
) : SimpleViewManager<ReactImageView>() {

  override fun getName() = REACT_CLASS

  companion object {
    const val REACT_CLASS = "RCTImageView"
  }
}
```

</TabItem>
<TabItem value="java">

```java
public class ReactImageManager extends SimpleViewManager<ReactImageView> {

  public static final String REACT_CLASS = "RCTImageView";
  ReactApplicationContext mCallerContext;

  public ReactImageManager(ReactApplicationContext reactContext) {
    mCallerContext = reactContext;
  }

  @Override
  public String getName() {
    return REACT_CLASS;
  }
}
```

</TabItem>
</Tabs>

### 2. 实现 `createViewInstance` 方法

视图会在 `createViewInstance` 方法中创建，视图应先初始化到默认状态，任何属性都将通过后续对 `updateView` 的调用来设置。

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="kotlin">

```kotlin
  override fun createViewInstance(context: ThemedReactContext) =
      ReactImageView(context, Fresco.newDraweeControllerBuilder(), null, callerContext)
```

</TabItem>
<TabItem value="java">

```java
  @Override
  public ReactImageView createViewInstance(ThemedReactContext context) {
    return new ReactImageView(context, Fresco.newDraweeControllerBuilder(), null, mCallerContext);
  }
```

</TabItem>
</Tabs>

### 3. 使用 `@ReactProp`（或 `@ReactPropGroup`）注解暴露视图属性 setter

需要在 JavaScript 中体现的属性，必须通过带有 `@ReactProp`（或 `@ReactPropGroup`）注解的 setter 方法暴露出来。setter 方法应将要更新的视图（当前视图类型）作为第一个参数，将属性值作为第二个参数。setter 应为 public 且不返回值（即在 Java 中返回类型应为 `void`，在 Kotlin 中应为 `Unit`）。发送给 JS 的属性类型会根据 setter 的值参数类型自动确定。目前支持的值类型（Java 中）有：`boolean`、`int`、`float`、`double`、`String`、`Boolean`、`Integer`、`ReadableArray`、`ReadableMap`。Kotlin 中对应的类型为：`Boolean`、`Int`、`Float`、`Double`、`String`、`ReadableArray`、`ReadableMap`。

`@ReactProp` 注解有一个必需参数 `name`，类型为 `String`。赋给 `@ReactProp` 注解并关联到 setter 方法的名称，会被用来在 JS 侧引用该属性。

除了 `name` 之外，`@ReactProp` 注解还可以接受以下可选参数：`defaultBoolean`、`defaultInt`、`defaultFloat`。这些参数应为对应类型（Java 中分别为 `boolean`、`int`、`float`，Kotlin 中分别为 `Boolean`、`Int`、`Float`），并且当 setter 所引用的属性已从组件中移除时，会把提供的值传给 setter 方法。请注意，只有原始类型才会提供“默认”值；如果 setter 是某种复杂类型，那么在对应属性被移除时，将传入 `null` 作为默认值。

对于带有 `@ReactPropGroup` 注解的方法，setter 声明要求与 `@ReactProp` 不同；更多信息请参阅 `@ReactPropGroup` 注解类文档。**重要！** 在 ReactJS 中，更新属性值会触发 setter 方法调用。请注意，我们更新组件的一种方式，是移除之前已设置的属性。在这种情况下，setter 方法也会被调用，以通知视图管理器该属性已发生变化。在这种情况下，会提供“默认”值（对于原始类型，“默认”值可以通过 `@ReactProp` 注解的 `defaultBoolean`、`defaultFloat` 等参数指定；对于复杂类型，setter 会收到 `null` 值）。

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="kotlin">

```kotlin
  @ReactProp(name = "src")
  fun setSrc(view: ReactImageView, sources: ReadableArray?) {
    view.setSource(sources)
  }

  @ReactProp(name = "borderRadius", defaultFloat = 0f)
  override fun setBorderRadius(view: ReactImageView, borderRadius: Float) {
    view.setBorderRadius(borderRadius)
  }

  @ReactProp(name = ViewProps.RESIZE_MODE)
  fun setResizeMode(view: ReactImageView, resizeMode: String?) {
    view.setScaleType(ImageResizeMode.toScaleType(resizeMode))
  }
```

</TabItem>
<TabItem value="java">

```java
  @ReactProp(name = "src")
  public void setSrc(ReactImageView view, @Nullable ReadableArray sources) {
    view.setSource(sources);
  }

  @ReactProp(name = "borderRadius", defaultFloat = 0f)
  public void setBorderRadius(ReactImageView view, float borderRadius) {
    view.setBorderRadius(borderRadius);
  }

  @ReactProp(name = ViewProps.RESIZE_MODE)
  public void setResizeMode(ReactImageView view, @Nullable String resizeMode) {
    view.setScaleType(ImageResizeMode.toScaleType(resizeMode));
  }
```

</TabItem>
</Tabs>

### 4. 注册 `ViewManager`

最后一步是将 ViewManager 注册到应用中，这与 [原生模块](native-modules-android.md) 的做法类似，通过应用包的成员函数 `createViewManagers` 完成。

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="kotlin">

```kotlin
  override fun createViewManagers(
      reactContext: ReactApplicationContext
  ) = listOf(ReactImageManager(reactContext))
```

</TabItem>
<TabItem value="java">

```java
  @Override
  public List<ViewManager> createViewManagers(
                            ReactApplicationContext reactContext) {
    return Arrays.<ViewManager>asList(
      new ReactImageManager(reactContext)
    );
  }
```

</TabItem>
</Tabs>

### 5. 实现 JavaScript 模块

最后一步是创建 JavaScript 模块，用于定义 Java/Kotlin 与 JavaScript 之间的接口层，供你新视图的使用者调用。建议你在这个模块中为组件接口编写文档（例如使用 TypeScript、Flow，或者普通注释）。

```tsx title="ImageView.tsx"
import {requireNativeComponent} from 'react-native';

/**
 * 组合 `View`。
 *
 * - src: Array<{url: string}>
 * - borderRadius: number
 * - resizeMode: 'cover' | 'contain' | 'stretch'
 */
export default requireNativeComponent('RCTImageView');
```

`requireNativeComponent` 函数接收原生视图的名称。请注意，如果你的组件需要做更复杂的事情（例如自定义事件处理），你应该把原生组件再包一层 React 组件。下面的 `MyCustomView` 示例说明了这一点。

## 事件

现在我们知道了如何暴露可以从 JS 自由控制的原生视图组件，但如果要处理来自用户的事件，比如捏合缩放或拖拽平移，该怎么办？当原生事件发生时，原生代码应向该 View 的 JavaScript 表示发出事件，并且这两个视图通过 `getId()` 方法返回的值进行关联。

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="kotlin">

```kotlin
class MyCustomView(context: Context) : View(context) {
  ...
  fun onReceiveNativeEvent() {
    val event = Arguments.createMap().apply {
      putString("message", "MyMessage")
    }
    val reactContext = context as ReactContext
    reactContext
        .getJSModule(RCTEventEmitter::class.java)
        .receiveEvent(id, "topChange", event)
  }
}
```

</TabItem>
<TabItem value="java">

```java
class MyCustomView extends View {
   ...
   public void onReceiveNativeEvent() {
      WritableMap event = Arguments.createMap();
      event.putString("message", "MyMessage");
      ReactContext reactContext = (ReactContext)getContext();
      reactContext
          .getJSModule(RCTEventEmitter.class)
          .receiveEvent(getId(), "topChange", event);
    }
}
```

</TabItem>
</Tabs>

要将 `topChange` 事件名映射到 JavaScript 中的 `onChange` 回调属性，请通过重写 `ViewManager` 中的 `getExportedCustomBubblingEventTypeConstants` 方法来注册：

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="kotlin">

```kotlin
class ReactImageManager : SimpleViewManager<MyCustomView>() {
  ...
  override fun getExportedCustomBubblingEventTypeConstants(): Map<String, Any> {
    return mapOf(
      "topChange" to mapOf(
        "phasedRegistrationNames" to mapOf(
          "bubbled" to "onChange"
        )
      )
    )
  }
}
```

</TabItem>
<TabItem value="java">

```java
public class ReactImageManager extends SimpleViewManager<MyCustomView> {
    ...
    public Map getExportedCustomBubblingEventTypeConstants() {
        return MapBuilder.builder().put(
            "topChange",
            MapBuilder.of(
                "phasedRegistrationNames",
                MapBuilder.of("bubbled", "onChange")
            )
        ).build();
    }
}
```

</TabItem>
</Tabs>

这个回调会携带原始事件，我们通常会在包装组件中对其进行处理，以提供一个更简单的 API：

```tsx {8-11,13-17} title="MyCustomView.tsx"
import {useCallback} from 'react';
import {requireNativeComponent} from 'react-native';

const RCTMyCustomView = requireNativeComponent('RCTMyCustomView');

export default function MyCustomView(props: {
  // ...
  /**
   * 当用户拖动地图时会持续调用的回调。
   */
  onChangeMessage: (message: string) => unknown;
}) {
  const onChange = useCallback(
    event => {
      props.onChangeMessage?.(event.nativeEvent.message);
    },
    [props.onChangeMessage],
  );

  return <RCTMyCustomView {...props} onChange={onChange} />;
}
```

## 与 Android Fragment 示例的集成

为了将现有的 Native UI 元素集成到你的 React Native 应用中，你可能需要使用 Android Fragments，以便相比从 `ViewManager` 返回一个 `View`，能对你的原生组件进行更细粒度的控制。如果你希望借助 [生命周期方法](https://developer.android.com/guide/fragments/lifecycle)（例如 `onViewCreated`、`onPause`、`onResume`）添加与视图绑定的自定义逻辑，就需要这样做。下面的步骤将向你展示如何实现：

### 1. 创建一个示例自定义视图

首先，让我们创建一个继承自 `FrameLayout` 的 `CustomView` 类（此视图中的内容可以是任何你想渲染的视图）

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="kotlin">

```kotlin title="CustomView.kt"
// 用你的包名替换
package com.mypackage

import android.content.Context
import android.graphics.Color
import android.widget.FrameLayout
import android.widget.TextView

class CustomView(context: Context) : FrameLayout(context) {
  init {
    // 设置内边距和背景颜色
    setPadding(16,16,16,16)
    setBackgroundColor(Color.parseColor("#5FD3F3"))

    // 添加默认文本视图
    addView(TextView(context).apply {
      text = "Welcome to Android Fragments with React Native."
    })
  }
}
```

</TabItem>
<TabItem value="java">

```java title="CustomView.java"
// 用你的包名替换
package com.mypackage;

import android.content.Context;
import android.graphics.Color;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;

public class CustomView extends FrameLayout {
  public CustomView(@NonNull Context context) {
    super(context);
    // 设置内边距和背景颜色
    this.setPadding(16,16,16,16);
    this.setBackgroundColor(Color.parseColor("#5FD3F3"));

    // 添加默认文本视图
    TextView text = new TextView(context);
    text.setText("Welcome to Android Fragments with React Native.");
    this.addView(text);
  }
}
```

</TabItem>
</Tabs>

### 2. 创建一个 `Fragment`

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="kotlin">

```kotlin title="MyFragment.kt"
// 用你的包名替换
package com.mypackage

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment

// 用你的视图导入替换
import com.mypackage.CustomView

class MyFragment : Fragment() {
  private lateinit var customView: CustomView

  override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
    super.onCreateView(inflater, container, savedInstanceState)
    customView = CustomView(requireNotNull(context))
    return customView // 这个 CustomView 可以是任何你想渲染的视图
  }

  override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
    super.onViewCreated(view, savedInstanceState)
    // 执行任何应在 `onCreate` 方法中发生的逻辑，例如：
    // customView.onCreate(savedInstanceState);
  }

  override fun onPause() {
    super.onPause()
    // 执行任何应在 `onPause` 方法中发生的逻辑
    // 例如：customView.onPause();
  }

  override fun onResume() {
    super.onResume()
    // 执行任何应在 `onResume` 方法中发生的逻辑
    // 例如：customView.onResume();
  }

  override fun onDestroy() {
    super.onDestroy()
    // 执行任何应在 `onDestroy` 方法中发生的逻辑
    // 例如：customView.onDestroy();
  }
}
```

</TabItem>
<TabItem value="java">

```java title="MyFragment.java"
// 用你的包名替换
package com.mypackage;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import androidx.fragment.app.Fragment;

// 用你的视图导入替换
import com.mypackage.CustomView;

public class MyFragment extends Fragment {
    CustomView customView;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup parent, Bundle savedInstanceState) {
        super.onCreateView(inflater, parent, savedInstanceState);
        customView = new CustomView(this.getContext());
        return customView; // 这个 CustomView 可以是任何你想渲染的视图
    }

    @Override
    public void onViewCreated(View view, Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        // 执行任何应在 `onCreate` 方法中发生的逻辑，例如：
        // customView.onCreate(savedInstanceState);
    }

    @Override
    public void onPause() {
        super.onPause();
        // 执行任何应在 `onPause` 方法中发生的逻辑
        // 例如：customView.onPause();
    }

    @Override
    public void onResume() {
        super.onResume();
       // 执行任何应在 `onResume` 方法中发生的逻辑
       // 例如：customView.onResume();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        // 执行任何应在 `onDestroy` 方法中发生的逻辑
        // 例如：customView.onDestroy();
    }
}
```

</TabItem>
</Tabs>

### 3. 创建 `ViewManager` 子类

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="kotlin">

```kotlin title="MyViewManager.kt"
// 用你的包名替换
package com.mypackage

import android.view.Choreographer
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import androidx.fragment.app.FragmentActivity
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager
import com.facebook.react.uimanager.annotations.ReactPropGroup

class MyViewManager(
    private val reactContext: ReactApplicationContext
) : ViewGroupManager<FrameLayout>() {
  private var propWidth: Int? = null
  private var propHeight: Int? = null

  override fun getName() = REACT_CLASS

  /**
   * 返回一个 FrameLayout，稍后它将承载 Fragment
   */
  override fun createViewInstance(reactContext: ThemedReactContext) =
      FrameLayout(reactContext)

  /**
   * 将 "create" 命令映射为一个整数
   */
  override fun getCommandsMap() = mapOf("create" to COMMAND_CREATE)

  /**
   * 处理 "create" 命令（由 JS 调用）并调用 createFragment 方法
   */
  override fun receiveCommand(
      root: FrameLayout,
      commandId: String,
      args: ReadableArray?
  ) {
    super.receiveCommand(root, commandId, args)
    val reactNativeViewId = requireNotNull(args).getInt(0)

    when (commandId.toInt()) {
      COMMAND_CREATE -> createFragment(root, reactNativeViewId)
    }
  }

  @ReactPropGroup(names = ["width", "height"], customType = "Style")
  fun setStyle(view: FrameLayout, index: Int, value: Int) {
    if (index == 0) propWidth = value
    if (index == 1) propHeight = value
  }

  /**
   * 用自定义 Fragment 替换你的 React Native 视图
   */
  fun createFragment(root: FrameLayout, reactNativeViewId: Int) {
    val parentView = root.findViewById<ViewGroup>(reactNativeViewId)
    setupLayout(parentView)

    val myFragment = MyFragment()
    val activity = reactContext.currentActivity as FragmentActivity
    activity.supportFragmentManager
        .beginTransaction()
        .replace(reactNativeViewId, myFragment, reactNativeViewId.toString())
        .commit()
  }

  fun setupLayout(view: View) {
    Choreographer.getInstance().postFrameCallback(object: Choreographer.FrameCallback {
      override fun doFrame(frameTimeNanos: Long) {
        manuallyLayoutChildren(view)
        view.viewTreeObserver.dispatchOnGlobalLayout()
        Choreographer.getInstance().postFrameCallback(this)
      }
    })
  }

  /**
   * 正确地布局所有子视图
   */
  private fun manuallyLayoutChildren(view: View) {
    // 来自 react-native props 的 propWidth 和 propHeight
    val width = requireNotNull(propWidth)
    val height = requireNotNull(propHeight)

    view.measure(
        View.MeasureSpec.makeMeasureSpec(width, View.MeasureSpec.EXACTLY),
        View.MeasureSpec.makeMeasureSpec(height, View.MeasureSpec.EXACTLY))

    view.layout(0, 0, width, height)
  }

  companion object {
    private const val REACT_CLASS = "MyViewManager"
    private const val COMMAND_CREATE = 1
  }
}
```

</TabItem>
<TabItem value="java">

```java title="MyViewManager.java"
// 用你的包名替换
package com.mypackage;

import android.view.Choreographer;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.FragmentActivity;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.annotations.ReactPropGroup;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.ThemedReactContext;

import java.util.Map;

public class MyViewManager extends ViewGroupManager<FrameLayout> {

  public static final String REACT_CLASS = "MyViewManager";
  public final int COMMAND_CREATE = 1;
  private int propWidth;
  private int propHeight;

  ReactApplicationContext reactContext;

  public MyViewManager(ReactApplicationContext reactContext) {
    this.reactContext = reactContext;
  }

  @Override
  public String getName() {
    return REACT_CLASS;
  }

  /**
   * 返回一个 FrameLayout，稍后它将承载 Fragment
   */
  @Override
  public FrameLayout createViewInstance(ThemedReactContext reactContext) {
    return new FrameLayout(reactContext);
  }

  /**
   * 将 "create" 命令映射为一个整数
   */
  @Nullable
  @Override
  public Map<String, Integer> getCommandsMap() {
    return MapBuilder.of("create", COMMAND_CREATE);
  }

  /**
   * 处理 "create" 命令（由 JS 调用）并调用 createFragment 方法
   */
  @Override
  public void receiveCommand(
    @NonNull FrameLayout root,
    String commandId,
    @Nullable ReadableArray args
  ) {
    super.receiveCommand(root, commandId, args);
    int reactNativeViewId = args.getInt(0);
    int commandIdInt = Integer.parseInt(commandId);

    switch (commandIdInt) {
      case COMMAND_CREATE:
        createFragment(root, reactNativeViewId);
        break;
      default: {}
    }
  }

  @ReactPropGroup(names = {"width", "height"}, customType = "Style")
  public void setStyle(FrameLayout view, int index, Integer value) {
    if (index == 0) {
      propWidth = value;
    }

    if (index == 1) {
      propHeight = value;
    }
  }

  /**
   * 用自定义 Fragment 替换你的 React Native 视图
   */
  public void createFragment(FrameLayout root, int reactNativeViewId) {
    ViewGroup parentView = (ViewGroup) root.findViewById(reactNativeViewId);
    setupLayout(parentView);

    final MyFragment myFragment = new MyFragment();
    FragmentActivity activity = (FragmentActivity) reactContext.getCurrentActivity();
    activity.getSupportFragmentManager()
            .beginTransaction()
            .replace(reactNativeViewId, myFragment, String.valueOf(reactNativeViewId))
            .commit();
  }

  public void setupLayout(View view) {
    Choreographer.getInstance().postFrameCallback(new Choreographer.FrameCallback() {
      @Override
      public void doFrame(long frameTimeNanos) {
        manuallyLayoutChildren(view);
        view.getViewTreeObserver().dispatchOnGlobalLayout();
        Choreographer.getInstance().postFrameCallback(this);
      }
    });
  }

  /**
   * 正确地布局所有子视图
   */
  public void manuallyLayoutChildren(View view) {
      // 来自 react-native props 的 propWidth 和 propHeight
      int width = propWidth;
      int height = propHeight;

      view.measure(
              View.MeasureSpec.makeMeasureSpec(width, View.MeasureSpec.EXACTLY),
              View.MeasureSpec.makeMeasureSpec(height, View.MeasureSpec.EXACTLY));

      view.layout(0, 0, width, height);
  }
}
```

</TabItem>
</Tabs>

### 4. 注册 `ViewManager`

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="kotlin">

```kotlin title="MyPackage.kt"
// 用你的包名替换
package com.mypackage

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class MyPackage : ReactPackage {
  ...
  override fun createViewManagers(
      reactContext: ReactApplicationContext
  ) = listOf(MyViewManager(reactContext))
}
```

</TabItem>
<TabItem value="java">

```java title="MyPackage.java"
// 用你的包名替换
package com.mypackage;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.Arrays;
import java.util.List;

public class MyPackage implements ReactPackage {

   @Override
   public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
       return Arrays.<ViewManager>asList(
            new MyViewManager(reactContext)
       );
   }

}
```

</TabItem>
</Tabs>

### 5. 注册 `Package`

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="kotlin">

```kotlin title="MainApplication.kt"
override fun getPackages(): List<ReactPackage> =
    PackageList(this).packages.apply {
        // 暂时无法自动链接的包可以在这里手动添加，例如：
        // add(MyReactNativePackage())
        add(MyAppPackage())
    }
```

</TabItem>
<TabItem value="java">

```java title="MainApplication.java"
@Override
protected List<ReactPackage> getPackages() {
    List<ReactPackage> packages = new PackageList(this).getPackages();
    // 暂时无法自动链接的包可以在这里手动添加，例如：
    // packages.add(new MyReactNativePackage());
    packages.add(new MyAppPackage());
    return packages;
}
```

</TabItem>
</Tabs>

### 6. 实现 JavaScript 模块

I. 从自定义 View manager 开始：

```tsx title="MyViewManager.tsx"
import {requireNativeComponent} from 'react-native';

export const MyViewManager =
  requireNativeComponent('MyViewManager');
```

II. 然后实现调用 `create` 方法的自定义 View：

```tsx title="MyView.tsx"
import {useEffect, useRef} from 'react';
import {
  PixelRatio,
  UIManager,
  findNodeHandle,
} from 'react-native';

import {MyViewManager} from './my-view-manager';

const createFragment = viewId =>
  UIManager.dispatchViewManagerCommand(
    viewId,
    // 我们正在调用 'create' 命令
    UIManager.MyViewManager.Commands.create.toString(),
    [viewId],
  );

export const MyView = () => {
  const ref = useRef(null);

  useEffect(() => {
    const viewId = findNodeHandle(ref.current);
    createFragment(viewId);
  }, []);

  return (
    <MyViewManager
      style={{
        // 将 dpi 转换为 px，提供所需高度
        height: PixelRatio.getPixelSizeForLayoutSize(200),
        // 将 dpi 转换为 px，提供所需宽度
        width: PixelRatio.getPixelSizeForLayoutSize(200),
      }}
      ref={ref}
    />
  );
};
```

如果你想使用 `@ReactProp`（或 `@ReactPropGroup`）注解暴露属性设置器，请参见上面的 [ImageView 示例](#imageview-example)。
