---
id: native-components-android
title: Android 原生 UI 组件
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';
import NativeDeprecated from '../the-new-architecture/_markdown_native_deprecation.mdx'

<NativeDeprecated />

现在有大量的原生 UI 控件可以用在最新的应用中——它们有的属于平台自带组件，有的作为第三方库提供，还有的可能就是你自己之前某个项目里用过的。React Native 已经封装了几个最关键的平台组件，比如 `ScrollView` 和 `TextInput`，但并不是所有的原生组件都内置，也不包括你之前写过的自定义组件。幸运的是，我们可以将这些现有组件包装起来，实现与 React Native 应用的无缝集成。

和原生模块指南类似，本指南也是为有一定 Android SDK 编程经验的开发者准备的进阶内容。本文将带你一步步实现一个原生 UI 组件，过程中会演示如何实现 React Native 核心库中已有的 `ImageView` 组件的一个子集。

:::info
你也可以使用一条命令快速搭建包含原生组件的本地库。详细信息请参阅 [本地库搭建指南](local-library-setup)。
:::

## ImageView 示例

本示例将演示实现允许在 JavaScript 中使用 ImageView 所需的步骤。

原生视图通过继承 `ViewManager`，或者更常见的 `SimpleViewManager` 来创建和操控。`SimpleViewManager` 在这里很方便，因为它会自动处理常见属性，比如背景色、透明度以及 Flexbox 布局。

这些子类本质上都是单例——桥接层只会创建每个类的一个实例。它们负责将原生视图发送给 `NativeViewHierarchyManager`，后者在需要时委托它们设置和更新视图的属性。`ViewManager` 通常也是视图的委托，通过桥接将事件回传给 JavaScript。

要发送一个视图：

1. 创建 `ViewManager` 子类。
2. 实现 `createViewInstance` 方法。
3. 使用 `@ReactProp`（或 `@ReactPropGroup`）注解暴露视图属性的 setter。
4. 在应用包的 `createViewManagers` 中注册管理器。
5. 实现 JavaScript 模块。

### 1. 创建 `ViewManager` 子类

本例中，我们创建了视图管理器类 `ReactImageManager`，它继承自泛型类型为 `ReactImageView` 的 `SimpleViewManager`。`ReactImageView` 是该管理器管理的对象类型，即自定义的原生视图。`getName` 返回的名称用于在 JavaScript 中引用该原生视图类型。

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

视图在 `createViewInstance` 方法中创建，视图应初始化为默认状态，任何属性都会通过随后调用 `updateView` 设置。

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

### 3. 使用 `@ReactProp`（或 `@ReactPropGroup`）注解暴露视图属性的 setter

需要在 JavaScript 中反映的属性必须以带有 `@ReactProp`（或 `@ReactPropGroup`）注解的 setter 方法暴露。setter 方法的第一个参数是要更新的视图对象（对应当前视图类型），第二个参数是属性值。setter 必须是 public，并且没有返回值（Java 中返回类型为 `void`，Kotlin 中为 `Unit`）。属性类型会根据 setter 的参数类型自动确定。Java 目前支持的类型包括：`boolean`，`int`，`float`，`double`，`String`，`Boolean`，`Integer`，`ReadableArray`，`ReadableMap`。对应 Kotlin 类型为：`Boolean`，`Int`，`Float`，`Double`，`String`，`ReadableArray`，`ReadableMap`。

`@ReactProp` 注解必须带一个类型为 `String` 的必填参数 `name`，它指定该 setter 方法对应 JS 端的属性名。

除了 `name` 以外，`@ReactProp` 还可以带以下可选参数：`defaultBoolean`，`defaultInt`，`defaultFloat`。这几个参数应该分别是对应类型（Java 为 `boolean`，`int`，`float`；Kotlin 为 `Boolean`，`Int`，`Float`），且在对应属性被移除时，setter 会被传入这些默认值。注意，默认值只适用于基本类型，若 setter 参数是复杂类型，属性被移除时该属性值会传 `null`。

`@ReactPropGroup` 注解的 setter 方法声明要求与 `@ReactProp` 不同，详情请参考 `@ReactPropGroup` 注解类文档。**重要！** ReactJS 中更新属性值会导致调用对应的 setter 方法。其中一种更新组件的方式是移除已设置的属性，在这种情况下，也会调用 setter，传入默认值（基本类型默认值由 `@ReactProp` 的相关参数指定，复杂类型传入 `null`）。

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

最后一步是在应用中注册这个 ViewManager，方式和 [原生模块](native-modules-android.md) 一样，通过应用包的成员函数 `createViewManagers` 完成。

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

最后就是创建 JavaScript 模块，用于定义 Java/Kotlin 与 JavaScript 之间的接口层。建议使用 TypeScript、Flow 或 JavaScript 注释对组件接口进行文档说明。

```tsx title="ImageView.tsx"
import {requireNativeComponent} from 'react-native';

/**
 * 封装 `View`。
 *
 * - src: Array<{url: string}>
 * - borderRadius: number
 * - resizeMode: 'cover' | 'contain' | 'stretch'
 */
export default requireNativeComponent('RCTImageView');
```

`requireNativeComponent` 方法的参数是原生视图名称。注意，如果你的组件需要更复杂的功能，比如自定义事件处理，建议用另一个 React 组件包裹这个原生组件。下面的 `MyCustomView` 示例中就体现了这一点。

## 事件

现在我们知道如何暴露可以在 JS 中自由控制的原生视图组件，但如何处理用户的事件呢，比如双指缩放或平移？当原生事件发生时，原生代码应该向 JavaScript 层视图发送事件，这两个视图通过 `getId()` 返回的值关联起来。

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

为了将事件名称 `topChange` 映射到 JavaScript 中的回调属性 `onChange`，需要在你的 `ViewManager` 中重写 `getExportedCustomBubblingEventTypeConstants` 方法进行注册：

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

这个回调会携带原始事件，我们通常在包装组件中处理它，简化接口：

```tsx {8-11,13-17} title="MyCustomView.tsx"
import {useCallback} from 'react';
import {requireNativeComponent} from 'react-native';

const RCTMyCustomView = requireNativeComponent('RCTMyCustomView');

export default function MyCustomView(props: {
  // ...
  /**
   * 用户拖动地图时持续调用的回调。
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

## 与 Android Fragment 集成示例

为了将已有的原生 UI 元素集成到 React Native 应用中，你可能需要使用 Android Fragment，这样比从 `ViewManager` 返回一个 `View` 能获得更细粒度的原生组件控制。如果想依赖 [生命周期方法](https://developer.android.com/guide/fragments/lifecycle)（如 `onViewCreated`、`onPause`、`onResume`）加入自定义逻辑，就需要这样做。以下步骤详细说明了如何实现：

### 1. 创建一个示例自定义视图

创建一个继承自 `FrameLayout` 的 `CustomView` 类（该视图里的内容可以是任何你希望显示的视图）

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="kotlin">

```kotlin title="CustomView.kt"
// 替换为你的包名
package com.mypackage

import android.content.Context
import android.graphics.Color
import android.widget.FrameLayout
import android.widget.TextView

class CustomView(context: Context) : FrameLayout(context) {
  init {
    // 设置内边距和背景色
    setPadding(16,16,16,16)
    setBackgroundColor(Color.parseColor("#5FD3F3"))

    // 添加默认文本视图
    addView(TextView(context).apply {
      text = "欢迎使用基于 React Native 的 Android Fragment。"
    })
  }
}
```

</TabItem>
<TabItem value="java">

```java title="CustomView.java"
// 替换为你的包名
package com.mypackage;

import android.content.Context;
import android.graphics.Color;
import android.widget.FrameLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;

public class CustomView extends FrameLayout {
  public CustomView(@NonNull Context context) {
    super(context);
    // 设置内边距和背景色
    this.setPadding(16,16,16,16);
    this.setBackgroundColor(Color.parseColor("#5FD3F3"));

    // 添加默认文本视图
    TextView text = new TextView(context);
    text.setText("欢迎使用基于 React Native 的 Android Fragment。");
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
// 替换为你的包名
package com.mypackage

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment

// 替换为你的视图导入
import com.mypackage.CustomView

class MyFragment : Fragment() {
  private lateinit var customView: CustomView

  override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
    super.onCreateView(inflater, container, savedInstanceState)
    customView = CustomView(requireNotNull(context))
    return customView // 这个 CustomView 可以是你想要渲染的任何视图
  }

  override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
    super.onViewCreated(view, savedInstanceState)
    // 在 `onCreate` 中需要执行的逻辑，比如：
    // customView.onCreate(savedInstanceState);
  }

  override fun onPause() {
    super.onPause()
    // 在 `onPause` 中需要执行的逻辑，比如：
    // customView.onPause();
  }

  override fun onResume() {
    super.onResume()
    // 在 `onResume` 中需要执行的逻辑，比如：
    // customView.onResume();
  }

  override fun onDestroy() {
    super.onDestroy()
    // 在 `onDestroy` 中需要执行的逻辑，比如：
    // customView.onDestroy();
  }
}
```

</TabItem>
<TabItem value="java">

```java title="MyFragment.java"
// 替换为你的包名
package com.mypackage;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import androidx.fragment.app.Fragment;

// 替换为你的视图导入
import com.mypackage.CustomView;

public class MyFragment extends Fragment {
    CustomView customView;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup parent, Bundle savedInstanceState) {
        super.onCreateView(inflater, parent, savedInstanceState);
        customView = new CustomView(this.getContext());
        return customView; // 这个 CustomView 可以是你想渲染的任何视图
    }

    @Override
    public void onViewCreated(View view, Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);
        // 在 `onCreate` 中需要执行的逻辑，比如：
        // customView.onCreate(savedInstanceState);
    }

    @Override
    public void onPause() {
        super.onPause();
        // 在 `onPause` 中需要执行的逻辑，比如：
        // customView.onPause();
    }

    @Override
    public void onResume() {
        super.onResume();
       // 在 `onResume` 中需要执行的逻辑，比如：
       // customView.onResume();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        // 在 `onDestroy` 中需要执行的逻辑，比如：
        // customView.onDestroy();
    }
}
```

</TabItem>
</Tabs>

### 3. 创建 `ViewManager` 子类

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="kotlin">

```kotlin title="MyViewManager.kt"
// 替换为你的包名
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
   * 返回一个稍后将承载 Fragment 的 FrameLayout
   */
  override fun createViewInstance(reactContext: ThemedReactContext) =
      FrameLayout(reactContext)

  /**
   * 将 "create" 命令映射为整数
   */
  override fun getCommandsMap() = mapOf("create" to COMMAND_CREATE)

  /**
   * 处理 JS 调用的 "create" 命令，调用 createFragment 方法
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
   * 用自定义的 Fragment 替换 React Native 视图
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
   * 手动布局所有子视图
   */
  private fun manuallyLayoutChildren(view: View) {
    // propWidth 和 propHeight 来自于 react-native 的属性
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
// 替换为你的包名
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
   * 返回一个稍后将承载 Fragment 的 FrameLayout
   */
  @Override
  public FrameLayout createViewInstance(ThemedReactContext reactContext) {
    return new FrameLayout(reactContext);
  }

  /**
   * 将 "create" 命令映射为整数
   */
  @Nullable
  @Override
  public Map<String, Integer> getCommandsMap() {
    return MapBuilder.of("create", COMMAND_CREATE);
  }

  /**
   * 处理 JS 调用的 "create" 命令，调用 createFragment 方法
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
   * 用自定义的 Fragment 替换 React Native 视图
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
   * 手动布局所有子视图
   */
  public void manuallyLayoutChildren(View view) {
      // propWidth 和 propHeight 来自于 react-native 的属性
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
// 替换为你的包名
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
// 替换为你的包名
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

### 5. 注册 Package

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="kotlin">

```kotlin title="MainApplication.kt"
override fun getPackages(): List<ReactPackage> =
    PackageList(this).packages.apply {
        // 无法自动链接的包可在此手动添加，例如：
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
    // 无法自动链接的包可在此手动添加，例如：
    // packages.add(new MyReactNativePackage());
    packages.add(new MyAppPackage());
    return packages;
}
```

</TabItem>
</Tabs>

### 6. 实现 JavaScript 模块

I. 先创建自定义 ViewManager：

```tsx title="MyViewManager.tsx"
import {requireNativeComponent} from 'react-native';

export const MyViewManager =
  requireNativeComponent('MyViewManager');
```

II. 然后实现调用 `create` 命令的自定义 View：

```tsx title="MyView.tsx"
import React, {useEffect, useRef} from 'react';
import {
  PixelRatio,
  UIManager,
  findNodeHandle,
} from 'react-native';

import {MyViewManager} from './my-view-manager';

const createFragment = viewId =>
  UIManager.dispatchViewManagerCommand(
    viewId,
    // 我们调用的是 'create' 命令
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
        // dpi 转 px，设置需要的高度
        height: PixelRatio.getPixelSizeForLayoutSize(200),
        // dpi 转 px，设置需要的宽度
        width: PixelRatio.getPixelSizeForLayoutSize(200),
      }}
      ref={ref}
    />
  );
};
```

如果你想通过 `@ReactProp`（或 `@ReactPropGroup`）注解暴露属性 setter，请参考上面的 [ImageView 示例](#imageview-example)。