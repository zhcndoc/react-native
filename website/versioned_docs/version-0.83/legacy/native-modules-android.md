---
id: native-modules-android
title: Android 原生模块
---

import NativeDeprecated from '../the-new-architecture/_markdown_native_deprecation.mdx'
import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

<NativeDeprecated />

欢迎使用 Android 原生模块指南。请先阅读 [原生模块介绍](native-modules-intro) 来了解什么是原生模块。

## 创建一个日历原生模块

在接下来的指南中，您将创建一个名为 `CalendarModule` 的原生模块，允许您从 JavaScript 访问 Android 的日历 API。完成后，您可以在 JavaScript 中调用 `CalendarModule.createCalendarEvent('Dinner Party', 'My House');`，该调用会触发一个 Java/Kotlin 方法，创建一个日历事件。

### 设置

首先，在 Android Studio 中打开您的 React Native 应用中的 Android 项目。Android 项目路径通常在 React Native 应用中的：

<figure>
  <img src="/docs/assets/native-modules-android-open-project.png" width="500" alt="在 Android Studio 内打开 React Native 应用中的 Android 项目示意图" />
  <figcaption>Android 项目所在位置示意图</figcaption>
</figure>

我们推荐使用 Android Studio 编写原生代码，因为它是专为 Android 开发构建的 IDE，有助于快速解决语法错误等小问题。

建议启用 [Gradle Daemon](https://docs.gradle.org/2.9/userguide/gradle_daemon.html) 以加快您多次迭代 Java/Kotlin 代码时的构建速度。

### 创建自定义原生模块文件

第一步是在 `android/app/src/main/java/com/your-app-name/` 目录下创建一个名为 `CalendarModule.java` 或 `CalendarModule.kt` 的 Java/Kotlin 文件（两个语言共用此文件夹）。该文件中将包含您的原生模块 Java/Kotlin 类。

<figure>
  <img src="/docs/assets/native-modules-android-add-class.png" width="700" alt="在 Android Studio 中添加名为 CalendarModule.java 的类的示意图" />
  <figcaption>添加 CalendarModule 类示意</figcaption>
</figure>

然后添加如下内容：

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="java">

```java
package com.your-apps-package-name; // 将 your-apps-package-name 替换为您的应用包名
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
package com.your-apps-package-name // 将 your-apps-package-name 替换为您的应用包名
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class CalendarModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {...}
```

</TabItem>
</Tabs>

如您所见，您的 `CalendarModule` 类继承了 `ReactContextBaseJavaModule`。在 Android 中，Java/Kotlin 的原生模块通过继承 `ReactContextBaseJavaModule` 类实现，并实现被 JavaScript 调用所需的功能。

:::note
实际上，Java/Kotlin 类只需继承 `BaseJavaModule` 类或实现 `NativeModule` 接口即可被视为 React Native 原生模块。

但建议您如上所示使用 `ReactContextBaseJavaModule`，该类提供对 `ReactApplicationContext`（RAC）的访问，对于需要监听 Activity 生命周期方法的原生模块非常有用。未来如果原生模块支持类型安全，React Native 将查看每个原生模块的 JavaScript 规格，并生成继承自 `ReactContextBaseJavaModule` 的抽象基类，从而更易实现类型安全。
:::

### 模块名称

所有 Android 上的 Java/Kotlin 原生模块都必须实现 `getName()` 方法。该方法返回字符串，代表模块名，JavaScript 端便可用该名称访问相应模块。例如下文 `getName()` 返回 `"CalendarModule"`：

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

JavaScript 中可这样访问该模块：

```tsx
const {CalendarModule} = ReactNative.NativeModules;
```

### 导出原生方法给 JavaScript 调用

接下来需要为原生模块新增一个方法，用于创建日历事件并可被 JavaScript 调用。所有可被 JavaScript 调用的原生模块方法必须标注 `@ReactMethod`。

请为 `CalendarModule` 设置一个 `createCalendarEvent()` 方法，可通过 `CalendarModule.createCalendarEvent()` 在 JS 端调用。现阶段，方法接受两个字符串参数，分别是活动名称和地点。参数类型后文会详细介绍。

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

在方法内添加调试日志，确认调用已生效。以下展示如何导入并使用 Android util 包中的 [Log](https://developer.android.com/reference/android/util/Log) 类：

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

完成实现并在 JavaScript 中连接后，可以参考[此步骤](https://developer.android.com/studio/debug/am-logcat.html) 查看应用日志。

### 同步方法

可以在原生方法上添加 `isBlockingSynchronousMethod = true`，将其标记为同步方法。

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

目前不推荐这样做，因为同步调用可能会带来较大的性能开销及线程相关的错误。此外启用同步方法时，应用将无法使用 Google Chrome 调试器，因为同步方法要求 JS VM 与应用共享内存，而 Chrome 调试器中的 React Native 运行在 Chrome 的 JS VM 中，通过 WebSocket 异步通信。

### 注册模块（仅 Android）

编写原生模块后，需将其注册到 React Native。为此，须将模块添加至 `ReactPackage` 并在 React Native 中注册该包。初始化时，React Native 会遍历所有包，并对每个 `ReactPackage` 注册其中的原生模块。

React Native 调用 `ReactPackage` 的 `createNativeModules()` 方法以获取待注册原生模块列表。Android 中若模块未在 `createNativeModules` 中实例化并返回，则无法在 JavaScript 中访问。

首先创建一个新的 Java/Kotlin 类（`MyAppPackage.java` 或 `MyAppPackage.kt`），实现 `ReactPackage`，放在 `android/app/src/main/java/com/your-app-name/` 目录：

添加以下内容：

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="java">

```java
package com.your-app-name; // 将 your-app-name 替换为应用名
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
package com.your-app-name // 将 your-app-name 替换为应用名

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

该文件导入您创建的原生模块 `CalendarModule`，然后在 `createNativeModules()` 中进行实例化并以列表形式返回注册。如果日后添加更多模块，也可在此处实例化并添加至列表。

:::note
这种注册原生模块的方式会在应用启动时立即初始化所有模块，可能增加启动时间。可考虑使用 [TurboReactPackage](https://github.com/facebook/react-native/blob/main/packages/react-native/ReactAndroid/src/main/java/com/facebook/react/TurboReactPackage.kt) 替代。TurboReactPackage 通过实现 `getModule(String name, ReactApplicationContext rac)` 方法按需实例化模块，从而加快启动速度。不过目前实现略复杂，还需实现 `getReactModuleInfoProvider()` 方法，返回包含所有可实例化原生模块及其构造函数的列表，示例参见 [这里](https://github.com/facebook/react-native/blob/8ac467c51b94c82d81930b4802b2978c85539925/ReactAndroid/src/main/java/com/facebook/react/CoreModulesPackage.java#L86-L165)。若选择该方式，请谨慎操作。
:::

在 `MainApplication.java` 或 `MainApplication.kt`（路径为 `android/app/src/main/java/com/your-app-name/`）中找到 ReactNativeHost 的 `getPackages()` 方法，将 `MyAppPackage` 添加到返回列表：

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="java">

```java
@Override
protected List<ReactPackage> getPackages() {
    List<ReactPackage> packages = new PackageList(this).getPackages();
    // 此处可手动添加尚不支持自动链接的包，例如:
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
        // 此处可手动添加尚不支持自动链接的包，例如：
        // add(MyReactNativePackage())
        add(MyAppPackage())
    }
```

</TabItem>
</Tabs>

至此，您已成功为 Android 注册了原生模块！

### 测试您的成果

此时，您已搭建好 Android 端原生模块的基本结构。通过在 JavaScript 中访问并调用其方法，进行测试。

找一个合适位置调用原生模块的 `createCalendarEvent()` 方法。以下示例显示了一个组件 `NewModuleButton`，您可以在它的 `onPress()` 函数内部调用原生模块。

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

在 JS 中要访问原生模块，需先导入 React Native 的 `NativeModules`：

```tsx
import {NativeModules} from 'react-native';
```

然后从 `NativeModules` 中获取 `CalendarModule`：

```tsx
const {CalendarModule} = NativeModules;
```

既然有了 `CalendarModule`，即可调用其导出方法 `createCalendarEvent()`。示例中加入了该调用至 `NewModuleButton` 的 `onPress()`：

```tsx
const onPress = () => {
  CalendarModule.createCalendarEvent('testName', 'testLocation');
};
```

最后重建 React Native 应用，以确保最新原生代码（包含新模块）生效。打开命令行，切换到 React Native 项目的根目录，运行：

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

### 开发迭代中的构建

当您在开发过程中反复修改原生模块，需要执行原生重建以让最新的改动在 JS 端可用。原因在于原生代码属于应用原生部分，不同于 React Native 的 Metro bundler 会自动监听 JS 代码变更并热更新，原生代码改动必须手动构建。

### 总结✨

此时您应该可以通过点击 `NewModuleButton` 来调用原生模块的 `createCalendarEvent()` 方法，并可通过之前添加的日志确认方法是否被调用。您可以参考[此文档](https://developer.android.com/studio/debug/am-logcat.html)查看 Android Studio 中的 ADB 日志，搜索 `Log.d` 中打印的信息（示例中为 “Create event called with name: testName and location: testLocation”），确认调用成功。

<figure>
  <img src="/docs/assets/native-modules-android-logs.png" width="1000" alt="日志截图" />
  <figcaption>Android Studio 中的 ADB 日志示意</figcaption>
</figure>

至此，您已创建了一个 Android 原生模块，并在 React Native 应用中成功调用其原生方法。接下来您可以继续了解更多内容，如原生模块方法带参类型、如何设置回调和 Promise 等。

## 超越日历原生模块

### 更优雅的原生模块导出

直接从 `NativeModules` 取模块使用并不方便。

为简化模块消费者的调用，每次访问都通过 `NativeModules` 拉取很繁琐。可以为模块创建一个 JS 包装文件，例如命名为 `CalendarModule.js`，内容如下：

```tsx
/**
* 这个文件将原生的 CalendarModule 模块暴露为 JS 模块，包含一个函数 'createCalendarEvent'，参数如下：

* 1. String name: 活动名称字符串
* 2. String location: 活动地点字符串
*/
import {NativeModules} from 'react-native';
const {CalendarModule} = NativeModules;
export default CalendarModule;
```

这个 JS 文件也适合放置任何 JS 端功能。如您使用 TypeScript，可在此添加类型注解。虽然目前 React Native 尚不支持原生到 JS 的类型安全，但您写的 JS 代码会是类型安全的。这样也利于后续迁移到类型安全的原生模块。以下示例为 CalendarModule 增加类型安全：

```tsx
/**
 * 这个文件将原生的 CalendarModule 模块暴露为 JS 模块，包含一个函数 'createCalendarEvent'，参数如下：
 *
 * 1. String name: 活动名称字符串
 * 2. String location: 活动地点字符串
 */
import {NativeModules} from 'react-native';
const {CalendarModule} = NativeModules;
interface CalendarInterface {
  createCalendarEvent(name: string, location: string): void;
}
export default CalendarModule as CalendarInterface;
```

其他 JS 文件可如下导入使用：

```tsx
import CalendarModule from './CalendarModule';
CalendarModule.createCalendarEvent('foo', 'bar');
```

:::note
这里假设您导入 `CalendarModule` 的文件路径与 `CalendarModule.js` 在同一层级，需根据实际情况调整相对路径。
:::

### 参数类型

当从 JavaScript 调用原生模块方法时，React Native 会自动将 JS 对象参数转换为相应的 Java/Kotlin 对象类型。比如 Java 原生方法接收 `double`，则需在 JS 使用数字调用，调用时转换自动完成。以下为常用参数类型及其 JS 对应类型映射表：

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
以下类型当前支持，但不支持 TurboModules，请避免使用：

- Integer Java/Kotlin -> ?number
- Float Java/Kotlin -> ?number
- int Java -> number
- float Java -> number
:::

对于上述未列出的参数类型，您需要自行进行转换。例如 Android 默认不支持 `Date` 转换，您需在原生方法中手动转换：

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

原生模块可通过实现 `getConstants()` 方法导出常量供 JS 使用，示例如下，导出名为 `DEFAULT_EVENT_NAME` 的常量：

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

在 JS 中通过调用 `getConstants()` 访问：

```tsx
const {DEFAULT_EVENT_NAME} = CalendarModule.getConstants();
console.log(DEFAULT_EVENT_NAME);
```

理论上也可以直接通过 native module 对象属性访问常量，但 TurboModules 不再支持该方式，建议尽早改用前述方式以方便未来迁移。

:::note
目前 `getConstants()` 方法只在初始化时调用一次，运行时修改不会影响 JS 环境。以后 TurboModules 会将其视为普通原生方法，调用时将交互 Native 端。
:::

### 回调（Callbacks）

原生模块支持特殊的参数类型：回调，用于异步方法中 JS 和 Java/Kotlin 之间传递数据，也可在原生端异步调用 JS。

创建回调方法时需先导入 `Callback` 接口，方法参数增加一个类型为 `Callback` 的参数。当前回调函数只能有两个：一个是 successCallback，一个是 failureCallback。且方法调用时，若最后一个参数是函数，则为 successCallback，倒数第二个函数参数为 failureCallback。

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

您可以在 Java/Kotlin 方法中调用回调并传递参数，但只能传递可序列化数据；若需传递复杂对象，可使用 `WritableMap`，集合可用 `WritableArray`。需要注意，回调不会在函数执行完马上调用。例如下方示例将事件 ID 传给回调：

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

JavaScript 可这样调用：

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

原生方法只能调用一次回调，即只能调用成功或者失败回调，且仅能调用一次。但原生模块可以保存回调以后调用。

错误处理有两种方式，第一种是借鉴 Node 习惯，将回调第一个参数视为 error 对象。

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

JS 端通过第一个参数判断是否有错误：

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

另一种方式是分别设置 onSuccess 和 onFailure 回调：

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

JS 调用时分别传入两个回调：

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

原生模块还支持返回 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)，可以简化 JS 代码，特别是配合 ES2016 的 [async/await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) 使用。当原生方法最后一个参数为 Promise，调用 JS 方法时会返回 JS Promise 对象。

将上面代码重构为使用 Promise 示例：

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
与回调类似，原生方法只能调用一次 Promise 的 resolve 或 reject。意味着只能成功或失败调用一次，但可以缓存回调稍后触发。
:::

JS 端该方法返回 Promise，可用 async/await 使用：

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

reject 方法支持以下参数组合：

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

详情请查看 [Promise.java 接口](https://github.com/facebook/react-native/blob/main/packages/react-native/ReactAndroid/src/main/java/com/facebook/react/bridge/Promise.kt)。若未提供 `userInfo`，React Native 会设其为 null。`message` 字段会作为错误调用堆栈顶部的错误信息。下面是 Java/Kotlin 代码中调用 reject 的示例，和对应在 React Native 应用中显示的错误信息。

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

React Native 应用中拒绝时的错误消息：

<figure>
  <img src="/docs/assets/native-modules-android-errorscreen.png" width="200" alt="React Native 应用中的错误消息示意图" />
  <figcaption>错误消息示意</figcaption>
</figure>

### 向 JavaScript 发送事件

原生模块可在未被调用时主动向 JavaScript 发送事件，例如您可能想通知 JS 原生 Android 日历事件即将开始。最简便的做法是使用 `RCTDeviceEventEmitter`，可通过 `ReactContext` 获取，示例如下：

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
    // 需要时设置上游监听或后台任务
  }

  listenerCount += 1;
}

@ReactMethod
public void removeListeners(Integer count) {
  listenerCount -= count;
  if (listenerCount == 0) {
    // 移除上游监听，停止后台任务
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
    // 需要时设置上游监听或后台任务
  }

  listenerCount += 1
}

@ReactMethod
fun removeListeners(count: Int) {
  listenerCount -= count
  if (listenerCount == 0) {
    // 移除上游监听，停止后台任务
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

JavaScript 模块可通过 [NativeEventEmitter](https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/EventEmitter/NativeEventEmitter.js) 类的 `addListener` 注册监听事件：

```tsx
import {NativeEventEmitter, NativeModules} from 'react-native';
...
useEffect(() => {
    const eventEmitter = new NativeEventEmitter(NativeModules.ToastExample);
    let eventListener = eventEmitter.addListener('EventReminder', event => {
      console.log(event.eventProperty) // "someValue"
    });

    // 组件卸载时移除监听
    return () => {
      eventListener.remove();
    };
  }, []);
```

### 获取 startActivityForResult 返回结果

如您想获取通过 `startActivityForResult` 启动的 Activity 结果，需监听 `onActivityResult`。实现方式是继承 `BaseActivityEventListener` 或实现 `ActivityEventListener`（推荐前者，因为它对 API 变更更具适应性）。然后在模块构造函数中注册，如下：

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

通过实现下方方法，监听 `onActivityResult`：

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="java">

```java
@Override
public void onActivityResult(
 final Activity activity,
 final int requestCode,
 final int resultCode,
 final Intent intent) {
 // 您的逻辑
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
    // 您的逻辑
}
```

</TabItem>
</Tabs>

下面实现一个简单的图片选择器，用于演示。该模块向 JS 暴露 `pickImage` 方法，调用后返回图片路径。

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

    // 注册 onActivityResult 监听器
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

    // 存储 Promise 以便选择器返回数据时 resolve/reject
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

监听 Activity 的生命周期事件如 `onResume`、`onPause` 等，与实现 `ActivityEventListener` 类似。模块需实现 `LifecycleEventListener` 接口，然后在构造函数中注册监听：

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

实现以下方法监听生命周期事件：

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

截至目前，Android 上所有原生模块异步方法都在同一线程执行。原生模块不应对调用线程做假设，未来线程分配方案可能变化。若需阻塞调用，应将耗时工作分发到内部管理的工作线程，并在回调时分发结果。
