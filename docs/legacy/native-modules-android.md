---
id: native-modules-android
title: Android 原生模块
---

import NativeDeprecated from '../the-new-architecture/\_markdown_native_deprecation.mdx'
import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

<NativeDeprecated />

欢迎使用 Android 原生模块。请先阅读 [原生模块简介](native-modules-intro)，了解原生模块是什么。

## 创建一个日历原生模块

在下面的指南中，你将创建一个原生模块 `CalendarModule`，它将允许你从 JavaScript 中访问 Android 的日历 API。完成后，你将能够从 JavaScript 中调用 `CalendarModule.createCalendarEvent('Dinner Party', 'My House');`，从而调用一个创建日历事件的 Java/Kotlin 方法。

### 设置

首先，在 Android Studio 中打开你的 React Native 应用里的 Android 项目。你可以在一个 React Native 应用中这样找到你的 Android 项目：

<figure>
  <img src="/docs/assets/native-modules-android-open-project.png" width="500" alt="在 Android Studio 中打开 React Native 应用内的 Android 项目的图片。" />
  <figcaption>你可以在这里找到你的 Android 项目的图片</figcaption>
</figure>

我们建议使用 Android Studio 来编写原生代码。Android Studio 是专为 Android 开发而构建的 IDE，使用它可以帮助你快速解决诸如代码语法错误之类的小问题。

我们还建议启用 [Gradle Daemon](https://docs.gradle.org/2.9/userguide/gradle_daemon.html) 来加快你在迭代 Java/Kotlin 代码时的构建速度。

### 创建自定义原生模块文件

第一步是在 `android/app/src/main/java/com/your-app-name/` 文件夹中创建（`CalendarModule.java` 或 `CalendarModule.kt`）Java/Kotlin 文件（该文件夹对 Kotlin 和 Java 都相同）。这个 Java/Kotlin 文件将包含你的原生模块 Java/Kotlin 类。

<figure>
  <img src="/docs/assets/native-modules-android-add-class.png" width="700" alt="在 Android Studio 中添加名为 CalendarModule.java 的类的图片。" />
  <figcaption>如何添加 CalendarModuleClass 的图片</figcaption>
</figure>

然后添加以下内容：

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="java">

```java
package com.your-apps-package-name; // 将 your-apps-package-name 替换为你应用的包名
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.util.Map;
import java.util.HashMap;

public class CalendarModule extends ReactContextBaseJavaModule {
   CalendarModule(ReactApplicationContext context) {
       super(context);
   }
}
```

</TabItem>
<TabItem value="kotlin">

```kotlin
package com.your-apps-package-name; // 将 your-apps-package-name 替换为你应用的包名
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class CalendarModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {...}
```

</TabItem>
</Tabs>

如你所见，你的 `CalendarModule` 类继承了 `ReactContextBaseJavaModule` 类。对于 Android，Java/Kotlin 原生模块是以类的形式编写的，这些类继承 `ReactContextBaseJavaModule` 并实现 JavaScript 所需的功能。

:::note
值得注意的是，从技术上讲，Java/Kotlin 类只需要继承 `BaseJavaModule` 类或实现 `NativeModule` 接口，就会被 React Native 视为原生模块。

不过我们建议你使用上面所示的 `ReactContextBaseJavaModule`。`ReactContextBaseJavaModule` 可访问 `ReactApplicationContext`（RAC），这对于需要挂钩到 Activity 生命周期方法的原生模块很有用。使用 `ReactContextBaseJavaModule` 也会让你将来更容易让原生模块具备类型安全。关于即将在未来版本中推出的原生模块类型安全，React Native 会查看每个原生模块的 JavaScript 规范，并生成一个继承自 `ReactContextBaseJavaModule` 的抽象基类。
:::

### 模块名称

Android 中所有 Java/Kotlin 原生模块都需要实现 `getName()` 方法。此方法返回一个字符串，表示原生模块的名称。随后可以在 JavaScript 中使用该名称访问该原生模块。例如，在下面的代码片段中，`getName()` 返回 `"CalendarModule"`。

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="java">

```java
// 添加到 CalendarModule.java
@Override
public String getName() {
   return "CalendarModule";
}
```

</TabItem>
<TabItem value="kotlin">

```kotlin
// 添加到 CalendarModule.kt
override fun getName() = "CalendarModule"
```

</TabItem>
</Tabs>

然后可以在 JS 中这样访问该原生模块：

```tsx
const {CalendarModule} = ReactNative.NativeModules;
```

### 将原生方法导出到 JavaScript

接下来，你需要向原生模块中添加一个方法，用于创建日历事件，并且可以在 JavaScript 中被调用。所有打算从 JavaScript 调用的原生模块方法都必须使用 `@ReactMethod` 注解。

为 `CalendarModule` 设置一个 `createCalendarEvent()` 方法，以便通过 `CalendarModule.createCalendarEvent()` 在 JS 中调用。目前，该方法将接收一个名称和一个位置字符串。参数类型选项稍后会介绍。

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="java">

```java
@ReactMethod
public void createCalendarEvent(String name, String location) {
}
```

</TabItem>
<TabItem value="kotlin">

```kotlin
@ReactMethod fun createCalendarEvent(name: String, location: String) {}
```

</TabItem>
</Tabs>

在方法中添加一条调试日志，以确认你从应用中调用它时该方法已被执行。下面是一个示例，展示如何从 Android util 包中导入并使用 [Log](https://developer.android.com/reference/android/util/Log) 类：

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="java">

```java
import android.util.Log;

@ReactMethod
public void createCalendarEvent(String name, String location) {
   Log.d("CalendarModule", "通过以下名称调用创建事件：" + name
   + "，位置：" + location);
}
```

</TabItem>
<TabItem value="kotlin">

```kotlin
import android.util.Log

@ReactMethod
fun createCalendarEvent(name: String, location: String) {
    Log.d("CalendarModule", "通过以下名称调用创建事件：$name，位置：$location")
}
```

</TabItem>
</Tabs>

在完成原生模块的实现并将其接入 JavaScript 之后，你可以按照 [这些步骤](https://developer.android.com/studio/debug/am-logcat.html) 查看应用中的日志。

### 同步方法

你可以向原生方法传递 `isBlockingSynchronousMethod = true`，以将其标记为同步方法。

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="java">

```java
@ReactMethod(isBlockingSynchronousMethod = true)
```

</TabItem>
<TabItem value="kotlin">

```kotlin
@ReactMethod(isBlockingSynchronousMethod = true)
```

</TabItem>
</Tabs>

目前我们不建议这样做，因为同步调用方法可能会带来严重的性能损耗，并为你的原生模块引入与线程相关的 bug。此外，请注意，如果你选择启用 `isBlockingSynchronousMethod`，你的应用将不能再使用 Google Chrome 调试器。这是因为同步方法要求 JS VM 与应用共享内存。对于 Google Chrome 调试器，React Native 运行在 Google Chrome 中的 JS VM 里，并通过 WebSockets 与移动设备异步通信。

### 注册模块（Android 特定）

一旦编写好原生模块，就需要将其注册到 React Native。为此，你需要把你的原生模块添加到一个 `ReactPackage` 中，并将该 `ReactPackage` 注册到 React Native。在初始化期间，React Native 会遍历所有包，并为每个 `ReactPackage` 注册其中的每个原生模块。

React Native 会在一个 `ReactPackage` 上调用 `createNativeModules()` 方法，以获取要注册的原生模块列表。对于 Android，如果某个模块没有在 `createNativeModules` 中实例化并返回，那么它将无法从 JavaScript 中使用。

要将你的原生模块添加到 `ReactPackage`，首先在 `android/app/src/main/java/com/your-app-name/` 文件夹中创建一个名为（`MyAppPackage.java` 或 `MyAppPackage.kt`）并实现 `ReactPackage` 的新的 Java/Kotlin 类：

然后添加以下内容：

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="java">

```java
package com.your-app-name; // 将 your-app-name 替换为你应用的名称
import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class MyAppPackage implements ReactPackage {

   @Override
   public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
       return Collections.emptyList();
   }

   @Override
   public List<NativeModule> createNativeModules(
           ReactApplicationContext reactContext) {
       List<NativeModule> modules = new ArrayList<>();

       modules.add(new CalendarModule(reactContext));

       return modules;
   }

}
```

</TabItem>
<TabItem value="kotlin">

```kotlin
package com.your-app-name // 将 your-app-name 替换为你应用的名称

import android.view.View
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ReactShadowNode
import com.facebook.react.uimanager.ViewManager

class MyAppPackage : ReactPackage {

    override fun createViewManagers(
        reactContext: ReactApplicationContext
    ): MutableList<ViewManager<View, ReactShadowNode<*>>> = mutableListOf()

    override fun createNativeModules(
        reactContext: ReactApplicationContext
    ): MutableList<NativeModule> = listOf(CalendarModule(reactContext)).toMutableList()
}
```

</TabItem>
</Tabs>

这个文件导入了你创建的原生模块 `CalendarModule`。然后它会在 `createNativeModules()` 函数中实例化 `CalendarModule`，并将其作为 `NativeModules` 列表返回以便注册。如果你之后添加更多原生模块，也可以在这里实例化它们并添加到返回的列表中。

:::note
值得注意的是，这种注册原生模块的方式会在应用启动时急切地初始化所有原生模块，这会增加应用的启动时间。你可以使用 [TurboReactPackage](https://github.com/facebook/react-native/blob/main/packages/react-native/ReactAndroid/src/main/java/com/facebook/react/TurboReactPackage.kt) 作为替代方案。与返回已实例化原生模块对象列表的 `createNativeModules` 不同，TurboReactPackage 实现了一个 `getModule(String name, ReactApplicationContext rac)` 方法，在需要时创建原生模块对象。TurboReactPackage 目前的实现要复杂一些。除了实现 `getModule()` 方法外，你还必须实现 `getReactModuleInfoProvider()` 方法，它会返回该包可以实例化的所有原生模块列表，以及用于实例化它们的函数，示例见 [这里](https://github.com/facebook/react-native/blob/8ac467c51b94c82d81930b4802b2978c85539925/ReactAndroid/src/main/java/com/facebook/react/CoreModulesPackage.java#L86-L165)。再次说明，使用 TurboReactPackage 可以让你的应用拥有更快的启动时间，但目前编写起来有些繁琐。因此，如果你选择使用 TurboReactPackages，请谨慎行事。
:::

要注册 `CalendarModule` 包，你必须将 `MyAppPackage` 添加到 ReactNativeHost 的 `getPackages()` 方法返回的包列表中。打开你的 `MainApplication.java` 或 `MainApplication.kt` 文件，它位于以下路径：`android/app/src/main/java/com/your-app-name/`。

找到 ReactNativeHost 的 `getPackages()` 方法，并将你的包添加到 `getPackages()` 返回的包列表中：

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="java">

```java
@Override
protected List<ReactPackage> getPackages() {
    List<ReactPackage> packages = new PackageList(this).getPackages();
    // 不能自动链接的包可以手动添加在这里，例如：
    // packages.add(new MyReactNativePackage());
    packages.add(new MyAppPackage());
    return packages;
}
```

</TabItem>
<TabItem value="kotlin">

```kotlin
override fun getPackages(): List<ReactPackage> =
    PackageList(this).packages.apply {
        // 不能自动链接的包可以手动添加在这里，例如：
        // add(MyReactNativePackage())
        add(MyAppPackage())
    }
```

</TabItem>
</Tabs>

你现在已经成功为 Android 注册了你的原生模块！

### 测试你所构建的内容

到目前为止，你已经在 Android 中为原生模块设置好了基本框架。通过在 JavaScript 中访问原生模块并调用其导出的方法来测试它。

在你的应用中找到一个地方，想要添加对原生模块 `createCalendarEvent()` 方法的调用。下面是一个组件示例，`NewModuleButton`，你可以把它添加到应用中。你可以在 `NewModuleButton` 的 `onPress()` 函数中调用原生模块。

```tsx
import {NativeModules, Button} from 'react-native';

const NewModuleButton = () => {
  const onPress = () => {
    console.log('我们将在这里调用原生模块！');
  };

  return (
    <Button
      title="点击调用你的原生模块！"
      color="#841584"
      onPress={onPress}
    />
  );
};

export default NewModuleButton;
```

要从 JavaScript 访问你的原生模块，你需要先从 React Native 导入 `NativeModules`：

```tsx
import {NativeModules} from 'react-native';
```

然后你就可以从 `NativeModules` 中访问 `CalendarModule` 原生模块。

```tsx
const {CalendarModule} = NativeModules;
```

既然你已经可以使用 `CalendarModule` 原生模块，就可以调用你的原生方法 `createCalendarEvent()` 了。下面将其添加到 `NewModuleButton` 的 `onPress()` 方法中：

```tsx
const onPress = () => {
  CalendarModule.createCalendarEvent('testName', 'testLocation');
};
```

最后一步是重建 React Native 应用，这样你就可以获得最新的原生代码（包括你的新原生模块！）。在你的命令行中，也就是 React Native 应用所在的位置，运行以下命令：

<Tabs groupId="package-manager" queryString defaultValue={constants.defaultPackageManager} values={constants.packageManagers}>
<TabItem value="npm">

```shell
npm run android
```

</TabItem>
<TabItem value="yarn">

```shell
yarn android
```

</TabItem>
</Tabs>

### 迭代过程中的构建

当你按照这些指南进行开发并迭代你的原生模块时，你需要对应用进行原生重建，才能从 JavaScript 中访问你最近的更改。这是因为你编写的代码位于应用的原生部分。虽然 React Native 的 metro bundler 可以监视 JavaScript 的变化并为你即时重新构建，但它不会对原生代码这样做。因此，如果你想测试最新的原生更改，就需要使用上面的命令重新构建。

### 总结✨

现在你应该可以在应用中调用原生模块上的 `createCalendarEvent()` 方法了。在我们的示例中，这是通过按下 `NewModuleButton` 来完成的。你可以通过查看在 `createCalendarEvent()` 方法中设置的日志来确认这一点。你可以按照 [这些步骤](https://developer.android.com/studio/debug/am-logcat.html) 在你的应用中查看 ADB 日志。然后你应该能够搜索你的 `Log.d` 消息（在我们的示例中是“通过以下名称调用创建事件：testName，位置：testLocation”），并看到每次调用原生模块方法时都会记录该消息。

<figure>
  <img src="/docs/assets/native-modules-android-logs.png" width="1000" alt="日志图片。" />
  <figcaption>Android Studio 中的 ADB 日志图片</figcaption>
</figure>

到目前为止，你已经创建了一个 Android 原生模块，并在你的 React Native 应用中从 JavaScript 调用了它的原生方法。你可以继续阅读，了解更多有关原生模块方法可用参数类型以及如何设置回调和 promise 的内容。

## 超越日历原生模块

### 更好的原生模块导出

像上面那样通过从 `NativeModules` 中取出并导入你的原生模块，方式有点笨拙。

为了避免你的原生模块使用者每次访问它时都需要这样做，你可以为该模块创建一个 JavaScript 包装器。创建一个名为 `CalendarModule.js` 的新 JavaScript 文件，内容如下：

```tsx
/**
* 这会将原生的 `CalendarModule` 模块暴露为一个 JS 模块。它有一个
* `createCalendarEvent` 函数，接收以下参数：

* 1. 字符串 `name`：表示事件名称的字符串
* 2. 字符串 `location`：表示事件地点的字符串
*/
import {NativeModules} from 'react-native';
const {CalendarModule} = NativeModules;
export default CalendarModule;
```

这个 JavaScript 文件也会成为你添加任何 JavaScript 侧功能的好位置。例如，如果你使用像 TypeScript 这样的类型系统，你可以在这里为你的原生模块添加类型注解。虽然 React Native 目前还不支持 Native 到 JS 的类型安全，但你所有的 JS 代码都会是类型安全的。这样做也会让你在以后切换到类型安全的原生模块时更容易。下面是为 `CalendarModule` 添加类型安全的示例：

```tsx
/**
 * 这会将原生的 `CalendarModule` 模块暴露为一个 JS 模块。它有一个
 * `createCalendarEvent` 函数，接收以下参数：
 *
 * 1. 字符串 `name`：表示事件名称的字符串
 * 2. 字符串 `location`：表示事件地点的字符串
 */
import {NativeModules} from 'react-native';
const {CalendarModule} = NativeModules;
interface CalendarInterface {
  createCalendarEvent(name: string, location: string): void;
}
export default CalendarModule as CalendarInterface;
```

在你的其他 JavaScript 文件中，你可以像这样访问原生模块并调用它的方法：

```tsx
import CalendarModule from './CalendarModule';
CalendarModule.createCalendarEvent('foo', 'bar');
```

:::note
这里假设你导入 `CalendarModule` 的位置与 `CalendarModule.js` 处于同一层级结构中。请根据需要更新相对导入路径。
:::

### 参数类型

当在 JavaScript 中调用原生模块方法时，React Native 会把参数从 JS 对象转换为它们对应的 Java/Kotlin 对象。比如，如果你的 Java 原生模块方法接受一个 double，那么在 JS 中你需要用 number 来调用这个方法。React Native 会帮你完成转换。下面列出了原生模块方法支持的参数类型，以及它们对应的 JavaScript 类型。

| Java          | Kotlin        | JavaScript |
| ------------- | ------------- | ---------- |
| Boolean       | Boolean       | ?boolean   |
| boolean       |               | boolean    |
| Double        | Double        | ?number    |
| double        |               | number     |
| String        | String        | string     |
| Callback      | Callback      | Function   |
| Promise       | Promise       | Promise    |
| ReadableMap   | ReadableMap   | Object     |
| ReadableArray | ReadableArray | Array      |

:::info
以下类型当前受支持，但在 TurboModules 中将不再受支持。请避免使用它们：

- Integer Java/Kotlin -> ?number
- Float Java/Kotlin -> ?number
- int Java -> number
- float Java -> number
  :::

对于上面未列出的参数类型，你需要自己处理转换。例如，在 Android 中，`Date` 转换默认不受支持。你可以在原生方法内部自己把值转换为 `Date` 类型，如下所示：

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="java">

```java
    String dateFormat = "yyyy-MM-dd";
    SimpleDateFormat sdf = new SimpleDateFormat(dateFormat);
    Calendar eStartDate = Calendar.getInstance();
    try {
        eStartDate.setTime(sdf.parse(startDate));
    }

```

</TabItem>
<TabItem value="kotlin">

```kotlin
    val dateFormat = "yyyy-MM-dd"
    val sdf = SimpleDateFormat(dateFormat, Locale.US)
    val eStartDate = Calendar.getInstance()
    try {
        sdf.parse(startDate)?.let {
            eStartDate.time = it
        }
    }
```

</TabItem>
</Tabs>

### 导出常量

原生模块可以通过实现原生方法 `getConstants()` 来导出常量，这些常量可在 JS 中使用。下面你将实现 `getConstants()`，并返回一个包含 `DEFAULT_EVENT_NAME` 常量的 Map，你可以在 JavaScript 中访问它：

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="java">

```java
@Override
public Map<String, Object> getConstants() {
   final Map<String, Object> constants = new HashMap<>();
   constants.put("DEFAULT_EVENT_NAME", "New Event");
   return constants;
}
```

</TabItem>
<TabItem value="kotlin">

```kotlin
override fun getConstants(): MutableMap<String, Any> =
    hashMapOf("DEFAULT_EVENT_NAME" to "New Event")
```

</TabItem>
</Tabs>

然后可以通过在 JS 中对原生模块调用 `getConstants` 来访问该常量：

```tsx
const {DEFAULT_EVENT_NAME} = CalendarModule.getConstants();
console.log(DEFAULT_EVENT_NAME);
```

从技术上讲，可以直接从原生模块对象上访问在 `getConstants()` 中导出的常量。不过这在 TurboModules 中将不再受支持，因此我们鼓励社区改用上面的方式，以避免后续迁移的需要。

:::note
目前常量只会在初始化时导出，所以如果你在运行时修改 `getConstants` 的值，不会影响 JavaScript 环境。TurboModules 会改变这一点。使用 TurboModules 时，`getConstants()` 将变成一个普通的原生模块方法，每次调用都会进入原生侧。
:::

### 回调

原生模块还支持一种特殊类型的参数：回调。回调用于把数据从 Java/Kotlin 传递给 JavaScript，适用于异步方法。它们也可以用于从原生侧异步执行 JavaScript。

要创建一个带回调的原生模块方法，首先导入 `Callback` 接口，然后为你的原生模块方法添加一个类型为 `Callback` 的新参数。关于回调参数有一些细节，TurboModules 很快会消除这些限制。首先，你的函数参数里只能有两个回调：一个 successCallback 和一个 failureCallback。另外，原生模块方法调用中的最后一个参数如果是函数，会被当作 successCallback；倒数第二个参数如果是函数，会被当作 failure callback。

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="java">

```java
import com.facebook.react.bridge.Callback;

@ReactMethod
public void createCalendarEvent(String name, String location, Callback callBack) {
}
```

</TabItem>
<TabItem value="kotlin">

```kotlin
import com.facebook.react.bridge.Callback

@ReactMethod fun createCalendarEvent(name: String, location: String, callback: Callback) {}
```

</TabItem>
</Tabs>

你可以在 Java/Kotlin 方法中调用回调，并传入你想传给 JavaScript 的任意数据。请注意，你只能从原生代码向 JavaScript 传递可序列化数据。如果你需要返回一个原生对象，可以使用 `WriteableMaps`；如果你需要使用集合，可以使用 `WritableArrays`。还要注意的是，回调并不会在原生函数完成后立刻被调用。下面把在前一次调用中创建的事件 ID 传给回调。

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="java">

```java
  @ReactMethod
   public void createCalendarEvent(String name, String location, Callback callBack) {
       Integer eventId = ...
       callBack.invoke(eventId);
   }
```

</TabItem>
<TabItem value="kotlin">

```kotlin
  @ReactMethod
  fun createCalendarEvent(name: String, location: String, callback: Callback) {
      val eventId = ...
      callback.invoke(eventId)
  }
```

</TabItem>
</Tabs>

然后可以在 JavaScript 中这样访问这个方法：

```tsx
const onPress = () => {
  CalendarModule.createCalendarEvent(
    'Party',
    'My House',
    eventId => {
      console.log(`使用 id ${eventId} 创建了一个新事件`);
    },
  );
};
```

另一个需要注意的重要细节是，原生模块方法一次只能调用一个回调一次。这意味着你可以调用成功回调或失败回调，但不能同时调用两者，而且每个回调最多只能被调用一次。不过，原生模块可以保存回调并在稍后再调用。

回调的错误处理有两种方式。第一种是遵循 Node 的约定，把传给回调的第一个参数当作错误对象。

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="java">

```java
  @ReactMethod
   public void createCalendarEvent(String name, String location, Callback callBack) {
       Integer eventId = ...
       callBack.invoke(null, eventId);
   }
```

</TabItem>
<TabItem value="kotlin">

```kotlin
  @ReactMethod
  fun createCalendarEvent(name: String, location: String, callback: Callback) {
      val eventId = ...
      callback.invoke(null, eventId)
  }
```

</TabItem>
</Tabs>

在 JavaScript 中，你就可以检查第一个参数，看看是否传入了错误：

```tsx
const onPress = () => {
  CalendarModule.createCalendarEvent(
    'testName',
    'testLocation',
    (error, eventId) => {
      if (error) {
        console.error(`发现错误！${error}`);
      }
      console.log(`返回的事件 id ${eventId}`);
    },
  );
};
```

另一种方式是使用 onSuccess 和 onFailure 回调：

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="java">

```java
@ReactMethod
public void createCalendarEvent(String name, String location, Callback myFailureCallback, Callback mySuccessCallback) {
}
```

</TabItem>
<TabItem value="kotlin">

```kotlin
@ReactMethod
  fun createCalendarEvent(
      name: String,
      location: String,
      myFailureCallback: Callback,
      mySuccessCallback: Callback
  ) {}
```

</TabItem>
</Tabs>

然后在 JavaScript 中，你可以为错误和成功响应分别添加一个独立回调：

```tsx
const onPress = () => {
  CalendarModule.createCalendarEvent(
    'testName',
    'testLocation',
    error => {
      console.error(`发现错误！${error}`);
    },
    eventId => {
      console.log(`返回的事件 id ${eventId}`);
    },
  );
};
```

### Promise

原生模块也可以返回一个 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)，这可以简化你的 JavaScript，尤其是在使用 ES2016 的 [async/await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) 语法时。当原生模块 Java/Kotlin 方法的最后一个参数是 Promise 时，对应的 JS 方法会返回一个 JS Promise 对象。

把上面的代码重构为使用 promise 而不是回调，看起来是这样的：

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="java">

```java
import com.facebook.react.bridge.Promise;

@ReactMethod
public void createCalendarEvent(String name, String location, Promise promise) {
    try {
        Integer eventId = ...
        promise.resolve(eventId);
    } catch(Exception e) {
        promise.reject("Create Event Error", e);
    }
}
```

</TabItem>
<TabItem value="kotlin">

```kotlin
import com.facebook.react.bridge.Promise

@ReactMethod
fun createCalendarEvent(name: String, location: String, promise: Promise) {
    try {
        val eventId = ...
        promise.resolve(eventId)
    } catch (e: Throwable) {
        promise.reject("Create Event Error", e)
    }
}
```

</TabItem>
</Tabs>

:::note
与回调类似，原生模块方法一次只能拒绝或解决一个 promise，而且最多只能做一次。这意味着你可以调用成功回调或失败回调，但不能同时调用两者，而且每个回调最多只能被调用一次。不过，原生模块可以保存回调并在稍后再调用。
:::

这个方法在 JavaScript 中的对应返回的是一个 Promise。这意味着你可以在 async 函数中使用 `await` 关键字来调用它并等待结果：

```tsx
const onSubmit = async () => {
  try {
    const eventId = await CalendarModule.createCalendarEvent(
      'Party',
      'My House',
    );
    console.log(`使用 id ${eventId} 创建了一个新事件`);
  } catch (e) {
    console.error(e);
  }
};
```

reject 方法可以接受下面这些参数的不同组合：

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="java">

```java
String code, String message, WritableMap userInfo, Throwable throwable
```

</TabItem>
<TabItem value="kotlin">

```kotlin
code: String, message: String, userInfo: WritableMap, throwable: Throwable
```

</TabItem>
</Tabs>

更多细节可以在这里找到 `Promise.java` 接口 [这里](https://github.com/facebook/react-native/blob/main/packages/react-native/ReactAndroid/src/main/java/com/facebook/react/bridge/Promise.kt)。如果未提供 `userInfo`，ReactNative 会将其设为 null。其余参数 React Native 会使用默认值。`message` 参数提供错误 `message`，会显示在错误调用栈顶部。下面是 Java/Kotlin 中以下 reject 调用在 JavaScript 里显示的错误信息示例。

Java/Kotlin reject 调用：

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="java">

```java
promise.reject("Create Event error", "Error parsing date", e);
```

</TabItem>
<TabItem value="kotlin">

```kotlin
promise.reject("Create Event error", "Error parsing date", e)
```

</TabItem>
</Tabs>

Promise 被拒绝时，React Native App 中显示的错误信息：

<figure>
  <img src="/docs/assets/native-modules-android-errorscreen.png" width="200" alt="React Native 应用中的错误信息图像。" />
  <figcaption>错误信息图像</figcaption>
</figure>

### 向 JavaScript 发送事件

原生模块可以在不被直接调用的情况下向 JavaScript 发出事件。比如，你可能想向 JavaScript 提示一个来自原生 Android 日历应用的日历事件即将发生。最简单的方法是使用 `RCTDeviceEventEmitter`，可以像下面的代码片段那样从 `ReactContext` 中获取它。

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="java">

```java
...
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
...
private void sendEvent(ReactContext reactContext,
                      String eventName,
                      @Nullable WritableMap params) {
 reactContext
     .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
     .emit(eventName, params);
}

private int listenerCount = 0;

@ReactMethod
public void addListener(String eventName) {
  if (listenerCount == 0) {
    // 根据需要设置任何上游监听器或后台任务
  }

  listenerCount += 1;
}

@ReactMethod
public void removeListeners(Integer count) {
  listenerCount -= count;
  if (listenerCount == 0) {
    // 移除上游监听器，停止不必要的后台任务
  }
}
...
WritableMap params = Arguments.createMap();
params.putString("eventProperty", "someValue");
...
sendEvent(reactContext, "EventReminder", params);
```

</TabItem>
<TabItem value="kotlin">

```kotlin
...
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Arguments
import com.facebook.react.modules.core.DeviceEventManagerModule
...

private fun sendEvent(reactContext: ReactContext, eventName: String, params: WritableMap?) {
    reactContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
      .emit(eventName, params)
}

private var listenerCount = 0

@ReactMethod
fun addListener(eventName: String) {
  if (listenerCount == 0) {
    // 根据需要设置任何上游监听器或后台任务
  }

  listenerCount += 1
}

@ReactMethod
fun removeListeners(count: Int) {
  listenerCount -= count
  if (listenerCount == 0) {
    // 移除上游监听器，停止不必要的后台任务
  }
}
...
val params = Arguments.createMap().apply {
    putString("eventProperty", "someValue")
}
...
sendEvent(reactContext, "EventReminder", params)
```

</TabItem>
</Tabs>

JavaScript 模块随后可以通过 `NativeEventEmitter` 类上的 `addListener` 来注册接收事件。

```tsx
import {NativeEventEmitter, NativeModules} from 'react-native';
...
useEffect(() => {
    const eventEmitter = new NativeEventEmitter(NativeModules.ToastExample);
    let eventListener = eventEmitter.addListener('EventReminder', event => {
      console.log(event.eventProperty) // "someValue"
    });

    // 组件卸载时移除监听器
    return () => {
      eventListener.remove();
    };
  }, []);
```

### 从 startActivityForResult 获取 Activity 结果

如果你想获取通过 `startActivityForResult` 启动的 activity 的结果，就需要监听 `onActivityResult`。为此，你必须扩展 `BaseActivityEventListener` 或实现 `ActivityEventListener`。前者更推荐，因为它对 API 变更更有弹性。然后，你需要像这样在模块的构造函数中注册监听器：

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="java">

```java
reactContext.addActivityEventListener(mActivityResultListener);
```

</TabItem>
<TabItem value="kotlin">

```kotlin
reactContext.addActivityEventListener(mActivityResultListener);
```

</TabItem>
</Tabs>

现在你可以通过实现下面的方法来监听 `onActivityResult`：

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="java">

```java
@Override
public void onActivityResult(
 final Activity activity,
 final int requestCode,
 final int resultCode,
 final Intent intent) {
 // 你的逻辑写在这里
}
```

</TabItem>
<TabItem value="kotlin">

```kotlin
override fun onActivityResult(
    activity: Activity?,
    requestCode: Int,
    resultCode: Int,
    intent: Intent?
) {
    // 你的逻辑写在这里
}
```

</TabItem>
</Tabs>

我们来实现一个基础的图片选择器来演示这一点。这个图片选择器会向 JavaScript 暴露 `pickImage` 方法，调用后会返回图片的路径。

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="java">

```kotlin
public class ImagePickerModule extends ReactContextBaseJavaModule {

  private static final int IMAGE_PICKER_REQUEST = 1;
  private static final String E_ACTIVITY_DOES_NOT_EXIST = "E_ACTIVITY_DOES_NOT_EXIST";
  private static final String E_PICKER_CANCELLED = "E_PICKER_CANCELLED";
  private static final String E_FAILED_TO_SHOW_PICKER = "E_FAILED_TO_SHOW_PICKER";
  private static final String E_NO_IMAGE_DATA_FOUND = "E_NO_IMAGE_DATA_FOUND";

  private Promise mPickerPromise;

  private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener() {

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent intent) {
      if (requestCode == IMAGE_PICKER_REQUEST) {
        if (mPickerPromise != null) {
          if (resultCode == Activity.RESULT_CANCELED) {
            mPickerPromise.reject(E_PICKER_CANCELLED, "图片选择器已取消");
          } else if (resultCode == Activity.RESULT_OK) {
            Uri uri = intent.getData();

            if (uri == null) {
              mPickerPromise.reject(E_NO_IMAGE_DATA_FOUND, "未找到图片数据");
            } else {
              mPickerPromise.resolve(uri.toString());
            }
          }

          mPickerPromise = null;
        }
      }
    }
  };

  ImagePickerModule(ReactApplicationContext reactContext) {
    super(reactContext);

    // 为 `onActivityResult` 添加监听器
    reactContext.addActivityEventListener(mActivityEventListener);
  }

  @Override
  public String getName() {
    return "ImagePickerModule";
  }

  @ReactMethod
  public void pickImage(final Promise promise) {
    Activity currentActivity = getCurrentActivity();

    if (currentActivity == null) {
      promise.reject(E_ACTIVITY_DOES_NOT_EXIST, "Activity doesn't exist");
      return;
    }

    // 保存 promise，以便在选择器返回数据时 resolve/reject
    mPickerPromise = promise;

    try {
      final Intent galleryIntent = new Intent(Intent.ACTION_PICK);

      galleryIntent.setType("image/*");

      final Intent chooserIntent = Intent.createChooser(galleryIntent, "选择一张图片");

      currentActivity.startActivityForResult(chooserIntent, IMAGE_PICKER_REQUEST);
    } catch (Exception e) {
      mPickerPromise.reject(E_FAILED_TO_SHOW_PICKER, e);
      mPickerPromise = null;
    }
  }
}
```

</TabItem>
<TabItem value="kotlin">

```kotlin
class ImagePickerModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private var pickerPromise: Promise? = null

    private val activityEventListener =
        object : BaseActivityEventListener() {
            override fun onActivityResult(
                activity: Activity?,
                requestCode: Int,
                resultCode: Int,
                intent: Intent?
            ) {
                if (requestCode == IMAGE_PICKER_REQUEST) {
                    pickerPromise?.let { promise ->
                        when (resultCode) {
                            Activity.RESULT_CANCELED ->
                                promise.reject(E_PICKER_CANCELLED, "图片选择器已取消")
                            Activity.RESULT_OK -> {
                                val uri = intent?.data

                                uri?.let { promise.resolve(uri.toString())}
                                    ?: promise.reject(E_NO_IMAGE_DATA_FOUND, "未找到图片数据")
                            }
                        }

                        pickerPromise = null
                    }
                }
            }
        }

    init {
        reactContext.addActivityEventListener(activityEventListener)
    }

    override fun getName() = "ImagePickerModule"

    @ReactMethod
    fun pickImage(promise: Promise) {
        val activity = currentActivity

        if (activity == null) {
            promise.reject(E_ACTIVITY_DOES_NOT_EXIST, "Activity doesn't exist")
            return
        }

        pickerPromise = promise

        try {
            val galleryIntent = Intent(Intent.ACTION_PICK).apply { type = "image\/*" }

            val chooserIntent = Intent.createChooser(galleryIntent, "选择一张图片")

            activity.startActivityForResult(chooserIntent, IMAGE_PICKER_REQUEST)
        } catch (t: Throwable) {
            pickerPromise?.reject(E_FAILED_TO_SHOW_PICKER, t)
            pickerPromise = null
        }
    }

    companion object {
        const val IMAGE_PICKER_REQUEST = 1
        const val E_ACTIVITY_DOES_NOT_EXIST = "E_ACTIVITY_DOES_NOT_EXIST"
        const val E_PICKER_CANCELLED = "E_PICKER_CANCELLED"
        const val E_FAILED_TO_SHOW_PICKER = "E_FAILED_TO_SHOW_PICKER"
        const val E_NO_IMAGE_DATA_FOUND = "E_NO_IMAGE_DATA_FOUND"
    }
}
```

</TabItem>
</Tabs>

### 监听生命周期事件

监听 activity 的生命周期事件，例如 `onResume`、`onPause` 等，与实现 `ActivityEventListener` 非常类似。模块必须实现 `LifecycleEventListener`。然后，你需要像这样在模块的构造函数中注册一个监听器：

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="java">

```java
reactContext.addLifecycleEventListener(this);
```

</TabItem>
<TabItem value="kotlin">

```kotlin
reactContext.addLifecycleEventListener(this)
```

</TabItem>
</Tabs>

现在你可以通过实现以下方法来监听 activity 的生命周期事件：

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="java">

```java
@Override
public void onHostResume() {
   // Activity `onResume`
}
@Override
public void onHostPause() {
   // Activity `onPause`
}
@Override
public void onHostDestroy() {
   // Activity `onDestroy`
}
```

</TabItem>
<TabItem value="kotlin">

```kotlin
override fun onHostResume() {
    // Activity `onResume`
}

override fun onHostPause() {
    // Activity `onPause`
}

override fun onHostDestroy() {
    // Activity `onDestroy`
}
```

</TabItem>
</Tabs>

### 线程

截至目前，在 Android 上，所有原生模块的异步方法都在同一个线程上执行。原生模块不应对它们运行在哪个线程上作任何假设，因为当前的分配方式未来可能会改变。如果需要阻塞调用，重负载工作应该被派发到内部管理的工作线程，并从那里分发任何回调。