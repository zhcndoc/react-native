---
id: native-modules-android
title: Android 原生模块
---

import NativeDeprecated from '../the-new-architecture/\_markdown_native_deprecation.mdx'
import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

<NativeDeprecated />

欢迎阅读 Android 原生模块。请先阅读 [Native Modules Intro](native-modules-intro)，了解原生模块是什么。

## 创建 Calendar 原生模块

在以下指南中，你将创建一个原生模块 `CalendarModule`，通过它可以从 JavaScript 访问 Android 的日历 API。完成后，你将能够从 JavaScript 调用 `CalendarModule.createCalendarEvent('Dinner Party', 'My House');`，从而调用创建日历事件的 Java/Kotlin 方法。

### 设置

首先，在 Android Studio 中打开 React Native 应用中的 Android 项目。在 React Native 应用中，你可以在这里找到 Android 项目：

<figure>
  <img src="/docs/assets/native-modules-android-open-project.png" width="500" alt="在 Android Studio 中打开 React Native 应用内 Android 项面的图像。" />
  <figcaption>查找 Android 项目的位置</figcaption>
</figure>

我们建议使用 Android Studio 编写原生代码。Android Studio 是一个为 Android 开发而构建的 IDE，使用它可以帮助你快速解决代码语法错误等小问题。

我们还建议启用 [Gradle Daemon](https://docs.gradle.org/2.9/userguide/gradle_daemon.html)，以便在迭代 Java/Kotlin 代码时加快构建速度。

### 创建自定义原生模块文件

第一步是在 `android/app/src/main/java/com/your-app-name/` 文件夹内创建 (`CalendarModule.java` 或 `CalendarModule.kt`) Java/Kotlin 文件（Kotlin 和 Java 使用相同的文件夹）。此 Java/Kotlin 文件将包含你的原生模块 Java/Kotlin 类。

<figure>
  <img src="/docs/assets/native-modules-android-add-class.png" width="700" alt="在 Android Studio 中添加名为 CalendarModule.java 的类的图像。" />
  <figcaption>如何添加 CalendarModuleClass</figcaption>
</figure>

然后添加以下内容：

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="java">

```java
package com.your-apps-package-name; // replace your-apps-package-name with your app’s package name
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
package com.your-apps-package-name; // replace your-apps-package-name with your app’s package name
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class CalendarModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {...}
```

</TabItem>
</Tabs>

如你所见，`CalendarModule` 类继承了 `ReactContextBaseJavaModule` 类。对于 Android，Java/Kotlin 原生模块以继承 `ReactContextBaseJavaModule` 的类形式编写，并实现 JavaScript 所需的功能。

:::note
值得注意的是，从技术上讲，Java/Kotlin 类只需要继承 `BaseJavaModule` 类或实现 `NativeModule` 接口，就会被 React Native 视为原生模块。

不过，我们建议你使用上面所示的 `ReactContextBaseJavaModule`。`ReactContextBaseJavaModule` 可以访问 `ReactApplicationContext`（RAC），这对于需要接入 activity 生命周期方法的原生模块很有用。使用 `ReactContextBaseJavaModule` 也会让你在未来更容易使原生模块具备类型安全性。对于即将在未来版本中推出的原生模块类型安全功能，React Native 会检查每个原生模块的 JavaScript 规范，并生成一个继承 `ReactContextBaseJavaModule` 的抽象基类。
:::

### 模块名称

Android 中的所有 Java/Kotlin 原生模块都需要实现 `getName()` 方法。此方法返回一个字符串，用于表示原生模块的名称。之后可以在 JavaScript 中使用该名称访问原生模块。例如，在下面的代码片段中，`getName()` 返回 `"CalendarModule"`。

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="java">

```java
// add to CalendarModule.java
@Override
public String getName() {
   return "CalendarModule";
}
```

</TabItem>
<TabItem value="kotlin">

```kotlin
// add to CalendarModule.kt
override fun getName() = "CalendarModule"
```

</TabItem>
</Tabs>

之后可以像这样在 JS 中访问原生模块：

```tsx
const {CalendarModule} = ReactNative.NativeModules;
```

### 将原生方法导出到 JavaScript

接下来，你需要向原生模块添加一个用于创建日历事件、并且可以在 JavaScript 中调用的方法。所有计划从 JavaScript 调用的原生模块方法都必须使用 `@ReactMethod` 注解。

为 `CalendarModule` 设置一个 `createCalendarEvent()` 方法，使其可以通过 `CalendarModule.createCalendarEvent()` 在 JS 中调用。目前，该方法将接收名称和位置两个字符串参数。稍后将介绍参数类型选项。

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

在方法中添加调试日志，以便在应用中调用它时确认方法已被调用。下面是如何从 Android util 软件包导入并使用 [Log](https://developer.android.com/reference/android/util/Log) 类的示例：

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

完成原生模块的实现并在 JavaScript 中连接它之后，你可以按照[这些步骤](https://developer.android.com/studio/debug/am-logcat.html)查看应用中的日志。

### 同步方法

你可以向原生方法传递 `isBlockingSynchronousMethod = true`，将其标记为同步方法。

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

目前我们不建议这样做，因为同步调用方法可能会造成严重的性能损失，并为原生模块引入与线程相关的错误。另外请注意，如果选择启用 `isBlockingSynchronousMethod`，应用将无法再使用 Google Chrome 调试器。这是因为同步方法要求 JS VM 与应用共享内存。对于 Google Chrome 调试器，React Native 在 Google Chrome 的 JS VM 中运行，并通过 WebSockets 与移动设备进行异步通信。

### 注册模块（Android 专属）

编写原生模块后，需要将其注册到 React Native。为此，你需要将原生模块添加到 `ReactPackage`，并将 `ReactPackage` 注册到 React Native。在初始化期间，React Native 会遍历所有软件包，并为每个 `ReactPackage` 注册其中的每个原生模块。

React Native 会调用 `ReactPackage` 上的 `createNativeModules()` 方法，以获取要注册的原生模块列表。对于 Android，如果模块没有在 `createNativeModules` 中实例化并返回，它将无法从 JavaScript 使用。

要将原生模块添加到 `ReactPackage`，首先在 `android/app/src/main/java/com/your-app-name/` 文件夹内创建一个名为 (`MyAppPackage.java` 或 `MyAppPackage.kt`) 的新 Java/Kotlin 类，并实现 `ReactPackage`：

然后添加以下内容：

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="java">

```java
package com.your-app-name; // replace your-app-name with your app’s name
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
package com.your-app-name // replace your-app-name with your app’s name

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

此文件导入了你创建的原生模块 `CalendarModule`。然后它在 `createNativeModules()` 函数中实例化 `CalendarModule`，并将其作为要注册的 `NativeModules` 列表返回。如果之后添加更多原生模块，也可以在这里实例化它们并将其添加到返回的列表中。

:::note
值得注意的是，这种注册原生模块的方式会在应用启动时急切初始化所有原生模块，从而增加应用的启动时间。你可以使用 [TurboReactPackage](https://github.com/facebook/react-native/blob/main/packages/react-native/ReactAndroid/src/main/java/com/facebook/react/TurboReactPackage.kt) 作为替代方案。`TurboReactPackage` 不使用返回已实例化原生模块对象列表的 `createNativeModules`，而是实现 `getModule(String name, ReactApplicationContext rac)` 方法，并在需要时创建原生模块对象。目前实现 TurboReactPackage 稍微复杂一些。除了实现 `getModule()` 方法之外，你还必须实现 `getReactModuleInfoProvider()` 方法，该方法会返回此软件包可以实例化的所有原生模块，以及用于实例化这些模块的函数，示例见[此处](https://github.com/facebook/react-native/blob/8ac467c51b94c82d81930b4802b2978c85539925/ReactAndroid/src/main/java/com/facebook/react/CoreModulesPackage.java#L86-L165)。再次强调，使用 TurboReactPackage 可以让应用启动更快，但目前编写起来略显繁琐。因此，如果选择使用 TurboReactPackages，请谨慎操作。
:::

要注册 `CalendarModule` 软件包，必须将 `MyAppPackage` 添加到 ReactNativeHost 的 `getPackages()` 方法所返回的软件包列表中。打开 `MainApplication.java` 或 `MainApplication.kt` 文件，该文件位于以下路径：`android/app/src/main/java/com/your-app-name/`。

找到 ReactNativeHost 的 `getPackages()` 方法，并将你的软件包添加到 `getPackages()` 返回的软件包列表中：

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="java">

```java
@Override
protected List<ReactPackage> getPackages() {
    List<ReactPackage> packages = new PackageList(this).getPackages();
    // Packages that cannot be autolinked yet can be added manually here, for example:
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
        // Packages that cannot be autolinked yet can be added manually here, for example:
        // add(MyReactNativePackage())
        add(MyAppPackage())
    }
```

</TabItem>
</Tabs>

现在，你已经成功为 Android 注册了原生模块！

### 测试构建的内容

此时，你已经在 Android 中为原生模块设置好了基本框架。通过访问原生模块并在 JavaScript 中调用其导出的方法来进行测试。

在应用中找到你希望添加原生模块 `createCalendarEvent()` 方法调用的位置。下面是一个组件示例，你可以将 `NewModuleButton` 添加到应用中。你可以在 `NewModuleButton` 的 `onPress()` 函数中调用原生模块。

```tsx
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

要从 JavaScript 访问原生模块，首先需要从 React Native 导入 `NativeModules`：

```tsx
import {NativeModules} from 'react-native';
```

然后可以从 `NativeModules` 中访问 `CalendarModule` 原生模块。

```tsx
const {CalendarModule} = NativeModules;
```

现在 `CalendarModule` 原生模块已经可用，你可以调用原生方法 `createCalendarEvent()`。下面将其添加到 `NewModuleButton` 中的 `onPress()` 方法：

```tsx
const onPress = () => {
  CalendarModule.createCalendarEvent('testName', 'testLocation');
};
```

最后一步是重新构建 React Native 应用，以便可以使用最新的原生代码（包括你的新原生模块）。在 React Native 应用所在的命令行目录中，运行以下命令：

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

在学习这些指南并迭代原生模块时，你需要对应用进行原生重建，才能从 JavaScript 访问最新的更改。这是因为你编写的代码位于应用的原生部分。React Native 的 metro bundler 可以监视 JavaScript 中的更改并为你即时重新构建，但不会对原生代码执行相同操作。因此，如果想测试最新的原生更改，就需要使用上面的命令重新构建。

### 回顾✨

现在，你应该能够在应用中调用原生模块的 `createCalendarEvent()` 方法。在我们的示例中，这是通过按下 `NewModuleButton` 实现的。你可以查看在 `createCalendarEvent()` 方法中设置的日志来确认这一点。你可以按照[这些步骤](https://developer.android.com/studio/debug/am-logcat.html)在应用中查看 ADB 日志。然后搜索你的 `Log.d` 消息（在我们的示例中为“Create event called with name: testName and location: testLocation”），每次调用原生模块方法时都可以看到该消息被记录。

<figure>
  <img src="/docs/assets/native-modules-android-logs.png" width="1000" alt="日志图像。" />
  <figcaption>Android Studio 中的 ADB 日志图像</figcaption>
</figure>

此时，你已经创建了一个 Android 原生模块，并在 React Native 应用中从 JavaScript 调用了它的原生方法。你可以继续阅读，进一步了解原生模块方法可用的参数类型，以及如何设置回调和 promise。

## 超越 Calendar 原生模块

### 更好的原生模块导出方式

像上面那样从 `NativeModules` 中取出原生模块来导入，使用起来有些繁琐。

为了避免原生模块的使用者每次想访问原生模块时都需要这样做，你可以为该模块创建一个 JavaScript 封装器。创建一个名为 `CalendarModule.js` 的新 JavaScript 文件，并添加以下内容：

```tsx
/**
* This exposes the native CalendarModule module as a JS module. This has a
* function 'createCalendarEvent' which takes the following parameters:

* 1. String name: A string representing the name of the event
* 2. String location: A string representing the location of the event
*/
import {NativeModules} from 'react-native';
const {CalendarModule} = NativeModules;
export default CalendarModule;
```

这个 JavaScript 文件也是添加 JavaScript 端功能的理想位置。例如，如果使用 TypeScript 这样的类型系统，可以在这里为原生模块添加类型注解。虽然 React Native 目前尚不支持 Native 到 JS 的类型安全，但你的所有 JS 代码都将具备类型安全性。这样做也会让你之后更容易切换到具备类型安全的原生模块。下面是为 CalendarModule 添加类型安全的示例：

```tsx
/**
 * This exposes the native CalendarModule module as a JS module. This has a
 * function 'createCalendarEvent' which takes the following parameters:
 *
 * 1. String name: A string representing the name of the event
 * 2. String location: A string representing the location of the event
 */
import {NativeModules} from 'react-native';
const {CalendarModule} = NativeModules;
interface CalendarInterface {
  createCalendarEvent(name: string, location: string): void;
}
export default CalendarModule as CalendarInterface;
```

在其他 JavaScript 文件中，你可以像这样访问原生模块并调用其方法：

```tsx
import CalendarModule from './CalendarModule';
CalendarModule.createCalendarEvent('foo', 'bar');
```

:::note
这假设你导入 `CalendarModule` 的位置与 `CalendarModule.js` 位于同一层级。请根据需要更新相对导入路径。
:::

### 参数类型

在 JavaScript 中调用原生模块方法时，React Native 会将参数从 JS 对象转换为对应的 Java/Kotlin 对象。例如，如果 Java 原生模块方法接受一个 double，那么在 JS 中需要使用一个 number 调用该方法。React Native 会为你处理转换。下面列出了原生模块方法支持的参数类型，以及它们对应的 JavaScript 类型。

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
以下类型目前受支持，但将不会在 TurboModules 中受支持。请避免使用它们：

- Integer Java/Kotlin -> ?number
- Float Java/Kotlin -> ?number
- int Java -> number
- float Java -> number
  :::

对于上面未列出的参数类型，你需要自行处理转换。例如，在 Android 中，`Date` 转换默认不受支持。你可以在原生方法中自行将其转换为 `Date` 类型，如下所示：

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

原生模块可以通过实现原生方法 `getConstants()` 来导出常量，该方法可在 JS 中使用。下面将实现 `getConstants()` 并返回一个包含 `DEFAULT_EVENT_NAME` 常量的 Map，你可以在 JavaScript 中访问该常量：

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

之后可以通过在 JS 中对原生模块调用 `getConstants` 来访问该常量：

```tsx
const {DEFAULT_EVENT_NAME} = CalendarModule.getConstants();
console.log(DEFAULT_EVENT_NAME);
```

从技术上讲，可以直接从原生模块对象访问 `getConstants()` 导出的常量。TurboModules 将不再支持这种方式，因此我们鼓励社区采用上面的方法，以避免之后进行不必要的迁移。

:::note
目前，常量只会在初始化时导出，因此如果在运行时更改 `getConstants` 的值，不会影响 JavaScript 环境。这一点将在 Turbomodules 中发生变化。在 Turbomodules 中，`getConstants()` 将成为一个普通的原生模块方法，每次调用都会访问原生端。
:::

### 回调

原生模块还支持一种特殊的参数：回调。回调用于在异步方法中将数据从 Java/Kotlin 传递到 JavaScript。它们也可以用于从原生端异步执行 JavaScript。

要创建带回调的原生模块方法，首先导入 `Callback` 接口，然后向原生模块方法添加一个类型为 `Callback` 的新参数。回调参数有一些细节会在 TurboModules 中得到改进。首先，函数参数中最多只能有两个回调，即 successCallback 和 failureCallback。此外，如果原生模块方法调用的最后一个参数是函数，则会将其视为 successCallback；如果倒数第二个参数是函数，则会将其视为 failure callback。

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

你可以在 Java/Kotlin 方法中调用回调，并提供想要传递给 JavaScript 的任何数据。请注意，只能将可序列化的数据从原生代码传递到 JavaScript。如果需要传回原生对象，可以使用 `WriteableMaps`；如果需要使用集合，则可以使用 `WritableArrays`。还需要特别指出，回调不会在原生函数完成后立即调用。下面将之前调用中创建的事件 ID 传递给回调。

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

之后可以在 JavaScript 中像这样访问此方法：

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

另一个需要注意的重要细节是，一个原生模块方法只能调用一个回调一次。这意味着你可以调用成功回调或失败回调，但不能两者都调用，并且每个回调最多只能调用一次。不过，原生模块可以保存回调并在之后调用它。

使用回调处理错误有两种方式。第一种是遵循 Node 的约定，将传递给回调的第一个参数视为错误对象。

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

在 JavaScript 中，你可以检查第一个参数，确认是否传递了错误：

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

然后在 JavaScript 中，你可以为错误响应和成功响应分别添加回调：

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

原生模块也可以兑现一个 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)，这可以简化 JavaScript，尤其是在使用 ES2016 的 [async/await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) 语法时。当原生模块 Java/Kotlin 方法的最后一个参数是 Promise 时，对应的 JS 方法将返回一个 JS Promise 对象。

将上面的代码重构为使用 promise 而不是回调，如下所示：

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
与回调类似，原生模块方法可以拒绝或解决一个 promise（但不能同时进行），并且最多只能执行一次。这意味着你可以调用成功回调或失败回调，但不能两者都调用，并且每个回调最多只能调用一次。不过，原生模块可以保存回调并在之后调用它。
:::

此方法对应的 JavaScript 方法会返回一个 Promise。这意味着你可以在异步函数中使用 `await` 关键字调用它并等待结果：

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

reject 方法可以接收以下参数的不同组合：

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

有关更多详细信息，请参阅[此处](https://github.com/facebook/react-native/blob/main/packages/react-native/ReactAndroid/src/main/java/com/facebook/react/bridge/Promise.kt)的 `Promise.java` 接口。如果未提供 `userInfo`，ReactNative 会将其设置为 null。对于其余参数，React Native 将使用默认值。`message` 参数提供错误调用堆栈顶部显示的错误 `message`。下面是 JavaScript 中显示的错误消息示例，该消息来自以下 Java/Kotlin reject 调用。

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

Promise 被拒绝时 React Native App 中的错误消息：

<figure>
  <img src="/docs/assets/native-modules-android-errorscreen.png" width="200" alt="React Native 应用中错误消息的图像。" />
  <figcaption>错误消息图像</figcaption>
</figure>

### 向 JavaScript 发送事件

原生模块可以在未被直接调用的情况下向 JavaScript 发送事件。例如，你可能希望向 JavaScript 发送提醒，告知 Android 原生日历应用中的日历事件即将发生。最简单的方式是使用 `RCTDeviceEventEmitter`，它可以从 `ReactContext` 中获取，如下面的代码片段所示。

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
    // Set up any upstream listeners or background tasks as necessary
  }

  listenerCount += 1;
}

@ReactMethod
public void removeListeners(Integer count) {
  listenerCount -= count;
  if (listenerCount == 0) {
    // Remove upstream listeners, stop unnecessary background tasks
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
    // Set up any upstream listeners or background tasks as necessary
  }

  listenerCount += 1
}

@ReactMethod
fun removeListeners(count: Int) {
  listenerCount -= count
  if (listenerCount == 0) {
    // Remove upstream listeners, stop unnecessary background tasks
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

然后，JavaScript 模块可以通过在 [NativeEventEmitter](https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/EventEmitter/NativeEventEmitter.js) 类上调用 `addListener` 来注册接收事件。

```tsx
import {NativeEventEmitter, NativeModules} from 'react-native';
...
useEffect(() => {
    const eventEmitter = new NativeEventEmitter(NativeModules.ToastExample);
    let eventListener = eventEmitter.addListener('EventReminder', event => {
      console.log(event.eventProperty) // "someValue"
    });

    // Removes the listener once unmounted
    return () => {
      eventListener.remove();
    };
  }, []);
```

### 从 startActivityForResult 获取 Activity 结果

如果想获取通过 `startActivityForResult` 启动的 activity 的结果，就需要监听 `onActivityResult`。为此，你必须继承 `BaseActivityEventListener` 或实现 `ActivityEventListener`。前者对 API 更改的适应性更强，因此更受推荐。然后，需要像这样在模块的构造函数中注册监听器：

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

现在可以通过实现以下方法来监听 `onActivityResult`：

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="java">

```java
@Override
public void onActivityResult(
 final Activity activity,
 final int requestCode,
 final int resultCode,
 final Intent intent) {
 // Your logic here
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
    // Your logic here
}
```

</TabItem>
</Tabs>

下面通过实现一个基本的图片选择器来演示。图片选择器会向 JavaScript 暴露 `pickImage` 方法，调用该方法时会返回图片的路径。

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

    // Add the listener for `onActivityResult`
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

    // Store the promise to resolve/reject when picker returns data
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

监听 activity 的生命周期事件（例如 `onResume`、`onPause` 等）与实现 `ActivityEventListener` 的方式非常相似。模块必须实现 `LifecycleEventListener`。然后，需要像这样在模块的构造函数中注册监听器：

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

现在可以通过实现以下方法来监听 activity 的生命周期事件：

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

### 线程处理

截至目前，在 Android 上，所有原生模块异步方法都在同一个线程上执行。原生模块不应假设它们会在哪个线程上被调用，因为当前的线程分配方案将来可能会发生变化。如果需要阻塞调用，应将繁重的工作分派到内部管理的工作线程，并从该线程分发所有回调。
