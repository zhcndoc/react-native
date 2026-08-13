import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

# 在 Native Modules 中发送事件

在某些情况下，你可能希望拥有一个能够监听平台层中的某些事件，然后将这些事件发送到 JavaScript 层的 Native Module，从而让你的应用能够响应这些原生事件。在其他情况下，你可能会有一些长时间运行的操作，这些操作可以发送事件，以便 UI 在事件发生时进行更新。

这两种情况都是从 Native Modules 发送事件的良好使用场景。在本指南中，你将学习如何实现这一点。

## 在向存储中添加新键时发送事件

在本示例中，你将学习如何在向存储中添加新键时发送事件。更改键的值不会发送事件，但添加新键会发送事件。

本指南从 [Native Module](/docs/next/turbo-native-modules-introduction) 指南开始  
在阅读本指南之前，请确保你熟悉该指南，并可以先实现该指南中的示例。

## 第 1 步：更新 NativeLocalStorage 的 Specs

第一步是更新 `NativeLocalStorage` 的 specs，让 React Native 知道该模块可以发送事件。

<Tabs groupId="language" queryString defaultValue={constants.defaultJavaScriptSpecLanguage} values={constants.javaScriptSpecLanguages}>
<TabItem value="typescript">

打开 `NativeLocalStorage.ts` 文件，并按如下方式更新：

```diff title="NativeLocalStorage.ts"
+import type {TurboModule, CodegenTypes} from 'react-native';
import {TurboModuleRegistry} from 'react-native';

+export type KeyValuePair = {
+  key: string,
+  value: string,
+}

export interface Spec extends TurboModule {
  setItem(value: string, key: string): void;
  getItem(key: string): string | null;
  removeItem(key: string): void;
  clear(): void;

+ readonly onKeyAdded: CodegenTypes.EventEmitter<KeyValuePair>;
}

export default TurboModuleRegistry.getEnforcing<Spec>(
  'NativeLocalStorage',
);
```

</TabItem>
<TabItem value="flow">

打开 `NativeLocalStorage.js` 文件，并按如下方式更新：

```diff title="NativeLocalStorage.js"

// @flow
+import type {TurboModule, CodegenTypes} from 'react-native';
import {TurboModule, TurboModuleRegistry} from 'react-native';

+export type KeyValuePair = {
+  key: string,
+  value: string,
+}

export interface Spec extends TurboModule {
  setItem(value: string, key: string): void;
  getItem(key: string): ?string;
  removeItem(key: string): void;
  clear(): void;
+ onKeyAdded: CodegenTypes.EventEmitter<KeyValuePair>
}
export default (TurboModuleRegistry.get<Spec>(
  'NativeLocalStorage'
): ?Spec);
```

</TabItem>
</Tabs>

通过 `import type` 语句，你可以从 `react-native` 导入包含 `EventEmitter` 类型的 `CodegenTypes`。这样，你就可以使用 `CodegenTypes.EventEmitter<KeyValuePair>` 定义 `onKeyAdded` 属性，并指定事件将发送 `KeyValuePair` 类型的负载。

事件发送时，你希望它接收一个 `KeyValuePair` 类型的参数。

## 第 2 步：生成 Codegen

由于你已经更新了 Native Module 的 specs，现在需要重新运行 Codegen，以便在原生代码中生成相关产物。

这与 Native Modules 指南中介绍的过程相同。

<Tabs groupId="platforms" queryString defaultValue={constants.defaultPlatform}>
<TabItem value="android" label="Android">
Codegen 通过 `generateCodegenArtifactsFromSchema` Gradle 任务执行：

```bash
cd android
./gradlew generateCodegenArtifactsFromSchema

BUILD SUCCESSFUL in 837ms
14 actionable tasks: 3 executed, 11 up-to-date
```

构建 Android 应用时会自动运行此任务  
</TabItem>
<TabItem value="ios" label="iOS">
Codegen 会作为脚本阶段的一部分运行，该脚本阶段会自动添加到 CocoaPods 生成的项目中。

```bash
cd ios
bundle install
bundle exec pod install
```

输出内容如下：

```shell
...
Framework build type is static library
[Codegen] Adding script_phases to ReactCodegen.
[Codegen] Generating ./build/generated/ios/ReactCodegen.podspec.json
[Codegen] Analyzing /Users/me/src/TurboModuleExample/package.json
[Codegen] Searching for Codegen-enabled libraries in the app.
[Codegen] Found TurboModuleExample
[Codegen] Searching for Codegen-enabled libraries in the project dependencies.
[Codegen] Found react-native
...
```

</TabItem>
</Tabs>

## 第 3 步：更新 App 代码

现在，是时候更新 App 的代码来处理新事件了。

打开 `App.tsx` 文件，并按如下方式修改：

```diff title="App.tsx"
import {
+ Alert,
+ EventSubscription,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  Button,
} from 'react-native';

import NativeLocalStorage from './specs/NativeLocalStorage';

const EMPTY = '<empty>';

function App(): React.JSX.Element {
  const [value, setValue] = React.useState<string | null>(null);
+ const [key, setKey] = React.useState<string | null>(null);
+ const listenerSubscription = React.useRef<null | EventSubscription>(null);

+ React.useEffect(() => {
+   listenerSubscription.current = NativeLocalStorage?.onKeyAdded((pair) => Alert.alert(`New key added: ${pair.key} with value: ${pair.value}`));

+   return  () => {
+     listenerSubscription.current?.remove();
+     listenerSubscription.current = null;
+   }
+ }, [])

  const [editingValue, setEditingValue] = React.useState<
    string | null
  >(null);

- React.useEffect(() => {
-   const storedValue = NativeLocalStorage?.getItem('myKey');
-   setValue(storedValue ?? '');
- }, []);

  function saveValue() {
+   if (key == null) {
+     Alert.alert('Please enter a key');
+     return;
+   }
    NativeLocalStorage?.setItem(editingValue ?? EMPTY, key);
    setValue(editingValue);
  }

  function clearAll() {
    NativeLocalStorage?.clear();
    setValue('');
  }

  function deleteValue() {
+   if (key == null) {
+     Alert.alert('Please enter a key');
+     return;
+   }
    NativeLocalStorage?.removeItem(key);
    setValue('');
  }

+ function retrieveValue() {
+   if (key == null) {
+     Alert.alert('Please enter a key');
+     return;
+   }
+   const val = NativeLocalStorage?.getItem(key);
+   setValue(val);
+ }

  return (
    <SafeAreaView style={{flex: 1}}>
      <Text style={styles.text}>
        Current stored value is: {value ?? 'No Value'}
      </Text>
+     <Text>Key:</Text>
+      <TextInput
+       placeholder="Enter the key you want to store"
+       style={styles.textInput}
+       onChangeText={setKey}
+     />
+     <Text>Value:</Text>
      <TextInput
        placeholder="Enter the text you want to store"
        style={styles.textInput}
        onChangeText={setEditingValue}
      />
      <Button title="Save" onPress={saveValue} />
+     <Button title="Retrieve" onPress={retrieveValue} />
      <Button title="Delete" onPress={deleteValue} />
      <Button title="Clear" onPress={clearAll} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  text: {
    margin: 10,
    fontSize: 20,
  },
  textInput: {
    margin: 10,
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 5,
  },
});

export default App;
```

以下是一些需要关注的相关更改：

1. 你需要从 `react-native` 导入 `EventSubscription` 类型，以处理 `EventSubscription`
2. 你需要使用 `useRef` 来跟踪 `EventSubscription` 引用
3. 你需要使用 `useEffect` hook 注册监听器。`onKeyAdded` 函数接收一个回调，该回调以一个 `KeyValuePair` 类型的对象作为函数参数
4. 每当事件从 Native 发送到 JS 时，添加到 `onKeyAdded` 的回调都会执行
5. 在 `useEffect` 的清理函数中，你需要 `remove` 事件订阅，并将 ref 设置为 `null`

其余更改是常规的 React 更改，用于改进 App 以支持此新功能。

## 第 4 步：编写 Native 代码

一切准备就绪后，让我们开始编写原生平台代码。

<Tabs groupId="platforms" queryString defaultValue={constants.defaultPlatform}>
<TabItem value="android" label="Android">

假设你已经按照 [Native Modules 指南](/docs/turbo-native-modules-introduction?platforms=android&language=typescript#3-write-application-code-using-the-turbo-native-module) 中介绍的 Android 指南完成了操作，那么剩下的工作就是将发送事件的代码接入你的应用。

为此，你需要：

1. 打开 `NativeLocalStorage.kt` 文件
2. 按如下方式修改：

```diff title="NativeLocalStorage"
package com.nativelocalstorage

import android.content.Context
import android.content.SharedPreferences
import com.nativelocalstorage.NativeLocalStorageSpec
+import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
+import com.facebook.react.bridge.WritableMap

class NativeLocalStorageModule(reactContext: ReactApplicationContext) : NativeLocalStorageSpec(reactContext) {

  override fun getName() = NAME

  override fun setItem(value: String, key: String) {
+   var shouldEmit = false
+   if (getItem(key) != null) {
+       shouldEmit = true
+   }
    val sharedPref = getReactApplicationContext().getSharedPreferences("my_prefs", Context.MODE_PRIVATE)
    val editor = sharedPref.edit()
    editor.putString(key, value)
    editor.apply()

+   if (shouldEmit == true) {
+       val eventData = Arguments.createMap().apply {
+           putString("key", key)
+           putString("value", value)
+       }
+       emitOnKeyAdded(eventData)
+   }
  }

  override fun getItem(key: String): String? {
    val sharedPref = getReactApplicationContext().getSharedPreferences("my_prefs", Context.MODE_PRIVATE)
    val username = sharedPref.getString(key, null)
    return username.toString()
  }
```

首先，你需要导入几个用于创建 `eventData` 的类型，`eventData` 需要从 Native 发送到 JS。这些导入内容是：

- `import com.facebook.react.bridge.Arguments`
- `import com.facebook.react.bridge.WritableMap`

其次，你需要实现实际向 JS 发送事件的逻辑。对于 specs 中定义的 `KeyValuePair` 这类复杂类型，Codegen 会生成一个需要 `ReadableMap` 作为参数的函数。你可以使用 `Arguments.createMap()` 工厂方法创建 `ReadableMap`，并使用 `apply` 函数填充该映射。你需要负责确保映射中使用的键与 JS 中 spec 类型所定义的属性相同

</TabItem>
<TabItem value="ios" label="iOS">

假设你已经按照 [Native Modules 指南](/docs/turbo-native-modules-introduction?platforms=ios&language=typescript#3-write-application-code-using-the-turbo-native-module) 中介绍的 iOS 指南完成了操作，那么剩下的工作就是将发送事件的代码接入你的应用。

为此，你需要：

1. 打开 `RCTNativeLocalStorage.h` 文件
2. 将基类从 `NSObject` 改为 `NativeLocalStorageSpecBase`

```diff title="RCTNativeLocalStorage.h"
#import <Foundation/Foundation.h>
#import <NativeLocalStorageSpec/NativeLocalStorageSpec.h>

NS_ASSUME_NONNULL_BEGIN

-@interface RCTNativeLocalStorage : NSObject <NativeLocalStorageSpec>
+@interface RCTNativeLocalStorage : NativeLocalStorageSpecBase <NativeLocalStorageSpec>

@end

NS_ASSUME_NONNULL_END
```

3. 打开 `RCTNativeLocalStorage.mm` 文件
4. 修改该文件，使其在需要时发送事件，例如：

```diff title="RCTNativeLocalStorage.mm"
 - (void)setItem:(NSString *)value key:(NSString *)key {
+  BOOL shouldEmitEvent = NO;
+  if (![self getItem:key]) {
+    shouldEmitEvent = YES;
+  }
   [self.localStorage setObject:value forKey:key];

+  if (shouldEmitEvent) {
+    [self emitOnKeyAdded:@{@"key": key, @"value": value}];
+  }
}
```

`NativeLocalStorageSpecBase` 是一个基类，它提供了 `emitOnKeyAdded` 方法及其基本实现和样板代码。借助此类，你无需处理将事件发送到 JS 所需的 Objective-C 与 JSI 之间的全部转换

对于 specs 中定义的 `KeyValuePair` 这类复杂类型，Codegen 会生成一个通用字典，你可以在原生端填充该字典。你需要负责确保字典中使用的键与 JS 中 spec 类型所定义的属性相同

</TabItem>
</Tabs>

## 第 5 步：运行你的 App

现在，如果你尝试运行 App，应该会看到以下行为。

| <center>Android</center>                                                                                    | <center>iOS</center>                                                                                    |
| ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| <center><img src="/docs/assets/turbo-native-modules-events-android.gif" width="75%" height="75%"/></center> | <center><img src="/docs/assets/turbo-native-modules-events-ios.gif" width="75%" height="75%"/></center> |
