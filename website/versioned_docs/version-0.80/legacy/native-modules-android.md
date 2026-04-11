---
id: native-modules-android
title: Android 原生模块
---

import NativeDeprecated from '../the-new-architecture/\_markdown_native_deprecation.mdx'
import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

<NativeDeprecated />

欢迎使用 Android 原生模块。请先阅读 [原生模块简介](native-modules-intro) 以了解什么是原生模块。

## 创建日历原生模块

在以下指南中，你将创建一个名为 `CalendarModule` 的原生模块，它将允许你从 JavaScript 访问 Android 的日历 API。最后，你将能够从 JavaScript 调用 `CalendarModule.createCalendarEvent('Dinner Party', 'My House');`，从而调用一个创建日历事件的 Java/Kotlin 方法。

### 设置

首先，在 Android Studio 中打开你的 React Native 应用内的 Android 项目。你可以在 React Native 应用中的以下位置找到你的 Android 项目：

<figure>
  <img src="/docs/assets/native-modules-android-open-project.png" width="500" alt="在 Android Studio 中打开 React Native 应用内 Android 项目的图片。" />
  <figcaption>图中展示了在哪里可以找到你的 Android 项目</figcaption>
</figure>

我们建议使用 Android Studio 编写你的原生代码。Android Studio 是为 Android 开发构建的 IDE，使用它将帮助你快速解决诸如代码语法错误之类的小问题。

我们还建议启用 [Gradle Daemon](https://docs.gradle.org/2.9/userguide/gradle_daemon.html) 以在迭代 Java/Kotlin 代码时加快构建速度。

### 创建自定义原生模块文件

第一步是在 `android/app/src/main/java/com/your-app-name/` 文件夹内创建 (`CalendarModule.java` 或 `CalendarModule.kt`) Java/Kotlin 文件（Kotlin 和 Java 的文件夹相同）。此 Java/Kotlin 文件将包含你的原生模块 Java/Kotlin 类。

<figure>
  <img src="/docs/assets/native-modules-android-add-class.png" width="700" alt="在 Android Studio 中添加名为 CalendarModule.java 的类的图片。" />
  <figcaption>图中展示了如何添加 CalendarModuleClass</figcaption>
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

如你所见，你的 `CalendarModule` 类扩展了 `ReactContextBaseJavaModule` 类。对于 Android，Java/Kotlin 原生模块被编写为扩展 `ReactContextBaseJavaModule` 并实现 JavaScript 所需功能的类。

> 值得注意的是，从技术上讲，Java/Kotlin 类只需要扩展 `BaseJavaModule` 类或实现 `NativeModule` 接口即可被 React Native 视为原生模块。

> 但是我们建议你使用 `ReactContextBaseJavaModule`，如上所示。`ReactContextBaseJavaModule` 提供了对 `ReactApplicationContext` (RAC) 的访问，这对于需要挂钩活动生命周期方法的原生模块很有用。使用 `ReactContextBaseJavaModule` 还将使将来更容易使你的原生模块类型安全。对于原生模块类型安全（将在未来的版本中推出），React Native 会查看每个原生模块的 JavaScript 规范，并生成一个扩展 `ReactContextBaseJavaModule` 的抽象基类。

### 模块名称

Android 中的所有 Java/Kotlin 原生模块都需要实现 `getName()` 方法。此方法返回一个字符串，代表原生模块的名称。然后可以在 JavaScript 中通过其名称访问该原生模块。例如，在下面的代码片段中，`getName()` 返回 `"CalendarModule"`。

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

然后可以像在 JS 中这样访问原生模块：

```tsx
const {CalendarModule} = ReactNative.NativeModules;
```

### 向 JavaScript 导出原生方法

接下来，你需要向原生模块添加一个将创建日历事件的方法，并可以在 JavaScript 中调用该方法。所有打算从 JavaScript 调用的原生模块方法都必须用 `@ReactMethod` 注解。

为 `CalendarModule` 设置一个方法 `createCalendarEvent()`，该方法可以通过 `CalendarModule.createCalendarEvent()` 在 JS 中调用。目前，该方法将接收名称和位置作为字符串。参数类型选项将在稍后介绍。

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

在方法中添加调试日志以确认当你从应用调用它时它已被调用。下面是如何导入和使用 Android util 包中的 [Log](https://developer.android.com/reference/android/util/Log) 类的示例：

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="java">

```java
import android.util.Log;

@ReactMethod
public void createCalendarEvent(String name, String location) {
   Log.d("CalendarModule", "Create event called with name: " + name
   + " and location: " + location);
}
```

</TabItem>
<TabItem value="kotlin">

```kotlin
import android.util.Log

@ReactMethod
fun createCalendarEvent(name: String, location: String) {
    Log.d("CalendarModule", "Create event called with name: $name and location: $location")
}
```

</TabItem>
</Tabs>

完成原生模块的实现并在 JavaScript 中连接后，你可以按照 [这些步骤](https://developer.android.com/studio/debug/am-logcat.html) 查看应用中的日志。

### 同步方法

你可以将 `isBlockingSynchronousMethod = true` 传递给原生方法，将其标记为同步方法。

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

目前，我们不推荐这样做，因为同步调用方法可能会带来严重的性能惩罚，并向你的原生模块引入与线程相关的 bug。此外，请注意，如果你选择启用 `isBlockingSynchronousMethod`，你的应用将无法再使用 Google Chrome 调试器。这是因为同步方法需要 JS VM 与应用共享内存。对于 Google Chrome 调试器，React Native 在 Google Chrome 的 JS VM 中运行，并通过 WebSockets 与移动设备异步通信。

### 注册模块（Android 特定）

编写完原生模块后，需要向 React Native 注册。为此，你需要将你的原生模块添加到 `ReactPackage` 并向 React Native 注册 `ReactPackage`。在初始化期间，React Native 将遍历所有包，并为每个 `ReactPackage` 注册其中的每个原生模块。

React Native 调用 `ReactPackage` 上的 `createNativeModules()` 方法以获取要注册的原生模块列表。对于 Android，如果模块未在 createNativeModules 中实例化并返回，则无法从 JavaScript 访问。

要将你的原生模块添加到 `ReactPackage`，首先在 `android/app/src/main/java/com/your-app-name/` 文件夹内创建一个名为 (`MyAppPackage.java` 或 `MyAppPackage.kt`) 的新 Java/Kotlin 类，该类实现 `ReactPackage`：

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

此文件导入你创建的原生模块 `CalendarModule`。然后在 `createNativeModules()` 函数中实例化 `CalendarModule` 并将其作为 `NativeModules` 列表返回以进行注册。如果你以后添加更多原生模块，也可以实例化它们并将它们添加到此处返回的列表中。

> 值得注意的是，这种注册原生模块的方式会在应用启动时急切地初始化所有原生模块，这会增加应用的启动时间。你可以使用 [TurboReactPackage](https://github.com/facebook/react-native/blob/main/packages/react-native/ReactAndroid/src/main/java/com/facebook/react/TurboReactPackage.java) 作为替代方案。TurboReactPackage 不实现返回实例化原生模块对象列表的 `createNativeModules`，而是实现 `getModule(String name, ReactApplicationContext rac)` 方法，该方法在需要时创建原生模块对象。目前 TurboReactPackage 实现起来有点复杂。除了实现 `getModule()` 方法外，你还必须实现 `getReactModuleInfoProvider()` 方法，该方法返回包可以实例化的所有原生模块的列表以及实例化它们的函数，示例 [在此处](https://github.com/facebook/react-native/blob/8ac467c51b94c82d81930b4802b2978c85539925/ReactAndroid/src/main/java/com/facebook/react/CoreModulesPackage.java#L86-L165)。同样，使用 TurboReactPackage 将使你的应用具有更快的启动时间，但目前编写起来有点麻烦。因此，如果你选择使用 TurboReactPackages，请谨慎行事。

要注册 `CalendarModule` 包，你必须将 `MyAppPackage` 添加到 ReactNativeHost 的 `getPackages()` 方法返回的包列表中。打开你的 `MainApplication.java` 或 `MainApplication.kt` 文件，该文件可以在以下路径找到：`android/app/src/main/java/com/your-app-name/`。

找到 ReactNativeHost 的 `getPackages()` 方法，并将你的包添加到 `getPackages()` 返回的包列表中：

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="java">

```java
@Override
protected List<ReactPackage> getPackages() {
    List<ReactPackage> packages = new PackageList(this).getPackages();
    // 尚未自动链接的包可以手动添加到这里，例如：
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
        // 尚未自动链接的包可以手动添加到这里，例如：
        // add(MyReactNativePackage())
        add(MyAppPackage())
    }
```

</TabItem>
</Tabs>

你现在已成功为 Android 注册了原生模块！

### 测试你的构建成果

此时，你已在 Android 中为原生模块设置了基本脚手架。通过在 JavaScript 中访问原生模块并调用其导出的方法来测试它。

在应用中找到一个你想要添加对原生模块 `createCalendarEvent()` 方法调用的地方。下面是你可以在应用中添加的组件 `NewModuleButton` 的示例。你可以在 `NewModuleButton` 的 `onPress()` 函数中调用原生模块。

```tsx
import React from 'react';
import {NativeModules, Button} from 'react-native';

const NewModuleButton = () => {
  const onPress = () => {
    console.log('We will invoke the native module here!');
  };

  return (
    <Button
      title="Click to invoke your native module!"
      color="#841584"
      onPress={onPress}
    />
  );
};

export default NewModuleButton;
```

为了从 JavaScript 访问你的原生模块，你需要首先从 React Native 导入 `NativeModules`：

```tsx
import {NativeModules} from 'react-native';
```

然后你可以从 `NativeModules` 访问 `CalendarModule` 原生模块。

```tsx
const {CalendarModule} = NativeModules;
```

现在你有了可用的 CalendarModule 原生模块，你可以调用你的原生方法 `createCalendarEvent()`。下面将其添加到 `NewModuleButton` 中的 `onPress()` 方法：

```tsx
const onPress = () => {
  CalendarModule.createCalendarEvent('testName', 'testLocation');
};
```

最后一步是重新构建 React Native 应用，以便你可以使用最新的原生代码（包含你的新原生模块！）。在命令行中，在 react native 应用所在的位置，运行以下命令：

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

### 迭代构建

当你通过这些指南并迭代你的原生模块时，你需要对应用进行原生重建，以便从 JavaScript 访问你的最新更改。这是因为你编写的代码位于应用的原生部分。虽然 React Native 的 metro bundler 可以监视 JavaScript 中的更改并为你即时重建，但它不会为原生代码这样做。因此，如果你想测试最新的原生更改，你需要使用上述命令进行重建。

### 回顾✨

你现在应该能够在应用中调用原生模块上的 `createCalendarEvent()` 方法。在我们的示例中，这是通过按下 `NewModuleButton` 发生的。你可以通过查看你在 `createCalendarEvent()` 方法中设置的日志来确认这一点。你可以按照 [这些步骤](https://developer.android.com/studio/debug/am-logcat.html) 查看应用中的 ADB 日志。然后你应该能够搜索你的 `Log.d` 消息（在我们的示例中为"Create event called with name: testName and location: testLocation"），并看到每次调用原生模块方法时记录的消息。

<figure>
  <img src="/docs/assets/native-modules-android-logs.png" width="1000" alt="日志图片。" />
  <figcaption>Android Studio 中 ADB 日志的图片</figcaption>
</figure>

此时，你已创建一个 Android 原生模块，并在你的 React Native 应用中从 JavaScript 调用了其原生方法。你可以继续阅读以了解有关原生模块方法可用的参数类型以及如何设置回调和 promises 的更多信息。

## 超越日历原生模块

### 更好的原生模块导出

像上面那样通过从 `NativeModules` 中提取来导入你的原生模块有点笨拙。

为了节省你的原生模块使用者每次访问原生模块时都需要这样做的麻烦，你可以为该模块创建一个 JavaScript 包装器。创建一个名为 `CalendarModule.js` 的新 JavaScript 文件，内容如下：

```tsx
/**
* 这将原生 CalendarModule 模块暴露为 JS 模块。它有一个
* 函数 'createCalendarEvent'，它接受以下参数：

* 1. String name：一个代表事件名称的字符串
* 2. String location：一个代表事件位置的字符串
*/
import {NativeModules} from 'react-native';
const {CalendarModule} = NativeModules;
export default CalendarModule;
```

这个 JavaScript 文件也成为你添加任何 JavaScript 端功能的好地方。例如，如果你使用像 TypeScript 这样的类型系统，你可以在此处为你的原生模块添加类型注解。虽然 React Native 尚未支持原生到 JS 的类型安全，但你所有的 JS 代码将是类型安全的。这样做也将使你更容易在未来切换到类型安全的原生模块。下面是为 CalendarModule 添加类型安全的示例：

```tsx
/**
 * 这将原生 CalendarModule 模块暴露为 JS 模块。它有一个
 * 函数 'createCalendarEvent'，它接受以下参数：
 *
 * 1. String name：一个代表事件名称的字符串
 * 2. String location：一个代表事件位置的字符串
 */
import {NativeModules} from 'react-native';
const {CalendarModule} = NativeModules;
interface CalendarInterface {
  createCalendarEvent(name: string, location: string): void;
}
export default CalendarModule as CalendarInterface;
```

在你的其他 JavaScript 文件中，你可以访问原生模块并调用其方法，如下所示：

```tsx
import CalendarModule from './CalendarModule';
CalendarModule.createCalendarEvent('foo', 'bar');
```

> 这假设你导入 `CalendarModule` 的位置与 `CalendarModule.js` 处于相同的层级结构中。请根据需要更新相对导入。

### 参数类型

当在 JavaScript 中调用原生模块方法时，React Native 会将参数从 JS 对象转换为其 Java/Kotlin 对象对应物。例如，如果你的 Java 原生模块方法接受一个 double，在 JS 中你需要用数字调用该方法。React Native 将为你处理转换。下面是原生模块方法支持的参数类型列表及其映射的 JavaScript 等效类型。

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

> 以下类型目前受支持，但在 TurboModules 中将不再受支持。请避免使用它们：
>
> - Integer Java/Kotlin -> ?number
> - Float Java/Kotlin -> ?number
> - int Java -> number
> - float Java -> number

对于上面未列出的参数类型，你需要自己处理转换。例如，在 Android 中，`Date` 转换不支持开箱即用。你可以像这样在原生的方法内自己处理到 `Date` 类型的转换：

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

原生模块可以通过实现原生方法 `getConstants()` 来导出常量，该方法在 JS 中可用。下面你将实现 `getConstants()` 并返回一个包含 `DEFAULT_EVENT_NAME` 常量的 Map，你可以在 JavaScript 中访问它：

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

然后可以通过在 JS 中的原生模块上调用 `getConstants` 来访问常量：

```tsx
const {DEFAULT_EVENT_NAME} = CalendarModule.getConstants();
console.log(DEFAULT_EVENT_NAME);
```

从技术上讲，可以直接从原生模块对象访问 `getConstants()` 中导出的常量。这在 TurboModules 中将不再受支持，所以我们鼓励社区切换到上述方法，以避免将来必要的迁移。

> 目前常量仅在初始化时导出，因此如果你在运行时更改 getConstants 值，它不会影响 JavaScript 环境。这将随着 Turbomodules 而改变。在 Turbomodules 中，`getConstants()` 将成为一个常规的原生模块方法，每次调用都会触及原生端。

### 回调

原生模块还支持一种独特的参数：回调。回调用于异步方法从 Java/Kotlin 传递数据到 JavaScript。它们也可用于从原生端异步执行 JavaScript。

为了创建一个带回调的原生模块方法，首先导入 `Callback` 接口，然后在你的原生模块方法中添加一个类型为 `Callback` 的新参数。回调参数有一些细微差别，这些很快会随着 TurboModules 被消除。首先，你的函数参数中只能有两个回调——一个 successCallback 和一个 failureCallback。此外，原生模块方法调用的最后一个参数，如果是函数，则被视为 successCallback，而原生模块方法调用的倒数第二个参数，如果是函数，则被视为 failure callback。

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

你可以在你的 Java/Kotlin 方法中调用回调，提供你想传递给 JavaScript 的任何数据。请注意，你只能从原生代码传递可序列化数据到 JavaScript。如果你需要传回一个原生对象，你可以使用 `WriteableMaps`，如果你需要使用集合，使用 `WritableArrays`。同样重要的是要强调，回调不会在原生函数完成后立即调用。下面是一个在早期调用中创建的事件 ID 被传递给回调的例子。

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

然后可以在 JavaScript 中使用以下方式访问此方法：

```tsx
const onPress = () => {
  CalendarModule.createCalendarEvent(
    'Party',
    'My House',
    eventId => {
      console.log(`Created a new event with id ${eventId}`);
    },
  );
};
```

另一个需要注意的重要细节是，原生模块方法只能调用一个回调，一次。这意味着你可以调用成功回调或失败回调，但不能两者都调用，并且每个回调最多只能调用一次。然而，原生模块可以存储回调并在以后调用它。

使用回调进行错误处理有两种方法。第一种是遵循 Node 的约定，将传递给回调的第一个参数视为错误对象。

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

在 JavaScript 中，你可以检查第一个参数以查看是否传递了错误：

```tsx
const onPress = () => {
  CalendarModule.createCalendarEvent(
    'testName',
    'testLocation',
    (error, eventId) => {
      if (error) {
        console.error(`Error found! ${error}`);
      }
      console.log(`event id ${eventId} returned`);
    },
  );
};
```

另一个选项是使用 onSuccess 和 onFailure 回调：

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

然后在 JavaScript 中，你可以为错误和成功响应添加单独的回调：

```tsx
const onPress = () => {
  CalendarModule.createCalendarEvent(
    'testName',
    'testLocation',
    error => {
      console.error(`Error found! ${error}`);
    },
    eventId => {
      console.log(`event id ${eventId} returned`);
    },
  );
};
```

### Promise

原生模块也可以实现一个 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)，这可以简化你的 JavaScript，特别是当使用 ES2016 的 [async/await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) 语法时。当原生模块 Java/Kotlin 方法的最后一个参数是 Promise 时，其对应的 JS 方法将返回一个 JS Promise 对象。

将上述代码重构为使用 promise 而不是回调如下所示：

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

> 与回调类似，原生模块方法可以拒绝或解决一个 promise（但不能两者都做），并且最多只能这样做一次。这意味着你可以调用成功回调或失败回调，但不能两者都调用，并且每个回调最多只能调用一次。然而，原生模块可以存储回调并在以后调用它。

此方法的 JavaScript 对应部分返回一个 Promise。这意味着你可以在 async 函数中使用 `await` 关键字来调用它并等待其结果：

```tsx
const onSubmit = async () => {
  try {
    const eventId = await CalendarModule.createCalendarEvent(
      'Party',
      'My House',
    );
    console.log(`Created a new event with id ${eventId}`);
  } catch (e) {
    console.error(e);
  }
};
```

reject 方法接受以下参数的不同组合：

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

有关更多详细信息，你可以 [这里](https://github.com/facebook/react-native/blob/main/packages/react-native/ReactAndroid/src/main/java/com/facebook/react/bridge/Promise.java) 找到 `Promise.java` 接口。如果未提供 `userInfo`，ReactNative 将其设置为 null。对于其余参数，React Native 将使用默认值。`message` 参数提供显示在错误调用堆栈顶部的错误 `message`。下面是 Java/Kotlin 中以下 reject 调用在 JavaScript 中显示的错误消息示例。

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

当 promise 被拒绝时 React Native App 中的错误消息：

<figure>
  <img src="/docs/assets/native-modules-android-errorscreen.png" width="200" alt="React Native 应用中错误消息的图片。" />
  <figcaption>错误消息图片</figcaption>
</figure>

### 向 JavaScript 发送事件

原生模块可以在不被直接调用的情况下向 JavaScript 发送事件信号。例如，你可能想要向 JavaScript 发送信号提醒来自原生 Android 日历应用的日历事件即将发生。最简单的方法是使用 `RCTDeviceEventEmitter`，它可以像下面代码片段中那样从 `ReactContext` 获得。

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

然后 JavaScript 模块可以通过 [NativeEventEmitter](https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/EventEmitter/NativeEventEmitter.js) 类上的 `addListener` 注册接收事件。

```tsx
import {NativeEventEmitter, NativeModules} from 'react-native';
...
useEffect(() => {
    const eventEmitter = new NativeEventEmitter(NativeModules.ToastExample);
    let eventListener = eventEmitter.addListener('EventReminder', event => {
      console.log(event.eventProperty) // "someValue"
    });

    // 卸载后移除监听器
    return () => {
      eventListener.remove();
    };
  }, []);
```

### 从 startActivityForResult 获取 Activity 结果

如果你想从使用 `startActivityForResult` 启动的 activity 获取结果，你需要监听 `onActivityResult`。为此，你必须扩展 `BaseActivityEventListener` 或实现 `ActivityEventListener`。前者更受推荐，因为它对 API 更改更具弹性。然后，你需要在模块的构造函数中注册监听器，如下所示：

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

现在你可以通过实现以下方法来监听 `onActivityResult`：

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="java">

```java
@Override
public void onActivityResult(
 final Activity activity,
 final int requestCode,
 final int resultCode,
 final Intent intent) {
 // 你的逻辑在这里
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
    // 你的逻辑在这里
}
```

</TabItem>
</Tabs>

让我们实现一个基本的图像选择器来演示这一点。图像选择器将向 JavaScript 暴露 `pickImage` 方法，调用时将返回图像路径。

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
            mPickerPromise.reject(E_PICKER_CANCELLED, "Image picker was cancelled");
          } else if (resultCode == Activity.RESULT_OK) {
            Uri uri = intent.getData();

            if (uri == null) {
              mPickerPromise.reject(E_NO_IMAGE_DATA_FOUND, "No image data found");
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

    // 添加 `onActivityResult` 的监听器
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

    // 存储 promise 以便在选择器返回数据时解决/拒绝
    mPickerPromise = promise;

    try {
      final Intent galleryIntent = new Intent(Intent.ACTION_PICK);

      galleryIntent.setType("image/*");

      final Intent chooserIntent = Intent.createChooser(galleryIntent, "Pick an image");

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
                                promise.reject(E_PICKER_CANCELLED, "Image picker was cancelled")
                            Activity.RESULT_OK -> {
                                val uri = intent?.data

                                uri?.let { promise.resolve(uri.toString())}
                                    ?: promise.reject(E_NO_IMAGE_DATA_FOUND, "No image data found")
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

            val chooserIntent = Intent.createChooser(galleryIntent, "Pick an image")

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

监听 activity 的生命周期事件（如 `onResume`, `onPause` 等）与实现 `ActivityEventListener` 非常相似。模块必须实现 `LifecycleEventListener`。然后，你需要在模块的构造函数中注册监听器，如下所示：

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

迄今为止，在 Android 上，所有原生模块异步方法都在一个线程上执行。原生模块不应对其被调用的线程有任何假设，因为当前的分配在未来可能会发生变化。如果需要阻塞调用，繁重的工作应分派到内部管理的工作线程，并从那里分发任何回调。
