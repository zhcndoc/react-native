import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

# 在原生模块中发出事件

在某些情况下，你可能希望拥有一个原生模块，监听平台层的一些事件，然后将它们发出到 JavaScript 层，让你的应用程序对这些原生事件做出反应。在其他情况下，你可能有一些长时间运行的操作，可以发出事件以便在这些操作发生时更新 UI。

这两种情况都是从原生模块发出事件的良好用例。在本指南中，你将学习如何做到这一点。

## 当新键添加到存储时发出事件

在本示例中，你将学习如何在将新键添加到存储时发出事件。更改键的值不会发出事件，但添加新键会。

本指南从 [原生模块](/docs/next/turbo-native-modules-introduction) 指南开始。
在深入本指南之前，请确保熟悉该指南，潜在地实现指南中的示例。

## 步骤 1：更新 NativeLocalStorage 的规范

第一步是更新 `NativeLocalStorage` 规范，让 React Native 知道该模块可以发出事件。

<Tabs groupId="language" queryString defaultValue={constants.defaultJavaScriptSpecLanguage} values={constants.javaScriptSpecLanguages}>
<TabItem value="typescript">

打开 `NativeLocalStorage.ts` 文件并按如下方式更新：

```diff title="NativeLocalStorage.ts"
import type {TurboModule} from 'react-native';
import {TurboModuleRegistry} from 'react-native';
+import type {EventEmitter} from 'react-native/Libraries/Types/CodegenTypes';

+export type KeyValuePair = {
+  key: string,
+  value: string,
+}

export interface Spec extends TurboModule {
  setItem(value: string, key: string): void;
  getItem(key: string): string | null;
  removeItem(key: string): void;
  clear(): void;

+ readonly onKeyAdded: EventEmitter<KeyValuePair>;
}

export default TurboModuleRegistry.getEnforcing<Spec>(
  'NativeLocalStorage',
);
```

</TabItem>
<TabItem value="flow">

打开 `NativeLocalStorage.js` 文件并按如下方式更新：

```diff title="NativeLocalStorage.js"

// @flow
import type {TurboModule} from 'react-native';
import {TurboModule, TurboModuleRegistry} from 'react-native';
+import type {EventEmitter} from 'react-native/Libraries/Types/CodegenTypes';

+export type KeyValuePair = {
+  key: string,
+  value: string,
+}

export interface Spec extends TurboModule {
  setItem(value: string, key: string): void;
  getItem(key: string): ?string;
  removeItem(key: string): void;
  clear(): void;
+ onKeyAdded: EventEmitter<KeyValuePair>
}
export default (TurboModuleRegistry.get<Spec>(
  'NativeLocalStorage'
): ?Spec);
```

</TabItem>
</Tabs>

通过 `import type` 语句，你导入了 `EventEmitter` 类型，这是随后添加 `onKeyAdded` 属性所必需的。

当事件发出时，你期望它接收一个 `KeyValuePair` 类型的参数。

## 步骤 2：生成 Codegen

鉴于你已更新了原生模块的规范，你现在必须重新运行 Codegen 以在原生代码中生成工件。

这与原生模块指南中介绍的过程相同。

<Tabs groupId="platforms" queryString defaultValue={constants.defaultPlatform}>
<TabItem value="android" label="Android">
Codegen 通过 `generateCodegenArtifactsFromSchema` Gradle 任务执行：

```bash
cd android
./gradlew generateCodegenArtifactsFromSchema

BUILD SUCCESSFUL in 837ms
14 actionable tasks: 3 executed, 11 up-to-date
```

当你构建 Android 应用程序时，这会自动运行。
</TabItem>
<TabItem value="ios" label="iOS">
Codegen 作为脚本阶段的一部分运行，该阶段会自动添加到由 CocoaPods 生成的项目中。

```bash
cd ios
bundle install
bundle exec pod install
```

输出将如下所示：

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

## 步骤 3：更新 App 代码

现在，是时候更新 App 的代码以处理新事件了。

打开 `App.tsx` 文件并按如下方式修改：

```diff title="App.tsx"
import React from 'react';
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

有一些相关的更改需要注意：

1. 你需要从 `react-native` 导入 `EventSubscription` 类型以处理 `EventSubscription`
2. 你需要使用 `useRef` 来跟踪 `EventSubscription` 引用
3. 你使用 `useEffect` hook 注册监听器。`onKeyAdded` 函数接受一个回调，该回调以 `KeyValuePair` 类型的对象作为函数参数。
4. 添加到 `onKeyAdded` 的回调每次事件从原生发出到 JS 时都会执行。
5. 在 `useEffect` 清理函数中，你 `remove` 事件订阅并将 ref 设置为 `null`。

其余的更改是常规的 React 更改，以改进此新功能的 App。

## 步骤 4：编写原生代码

一切准备就绪，让我们开始编写原生平台代码。

<Tabs groupId="platforms" queryString defaultValue={constants.defaultPlatform}>
<TabItem value="android" label="Android">

假设你遵循了 [原生模块指南](/docs/turbo-native-modules-introduction?platforms=android&language=typescript#3-write-application-code-using-the-turbo-native-module) 中描述的 Android 指南，剩下要做的是将发出事件的代码插入到你的应用中。

为此，你必须：

1. 打开 `NativeLocalStorage.kt` 文件
2. 按如下方式修改它：

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

首先，你需要导入一些类型，你需要使用它们来创建需要从原生发送到 JS 的 eventData。这些导入是：

- `import com.facebook.react.bridge.Arguments`
- `import com.facebook.react.bridge.WritableMap`

其次，你需要实现实际将事件发出到 JS 的逻辑。对于复杂类型，如规范中定义的 `KeyValuePair`，Codegen 将生成一个期望 `ReadableMap` 作为参数的函数。你可以使用 `Arguments.createMap()` 工厂方法创建 `ReadableMap`，并使用 `apply` 函数填充 map。你有责任确保你在 map 中使用的键与 JS 中规范类型中定义的属性相同。

</TabItem>
<TabItem value="ios" label="iOS">

假设你遵循了 [原生模块指南](/docs/turbo-native-modules-introduction?platforms=ios&language=typescript#3-write-application-code-using-the-turbo-native-module) 中描述的 iOS 指南，剩下要做的是将发出事件的代码插入到你的应用中。

为此，你必须：

1. 打开 `RCTNativeLocalStorage.h` 文件。
2. 将基类从 `NSObject` 更改为 `NativeLocalStorageSpecBase`

```diff title="RCTNativeLocalStorage.h"
#import <Foundation/Foundation.h>
#import <NativeLocalStorageSpec/NativeLocalStorageSpec.h>

NS_ASSUME_NONNULL_BEGIN

-@interface RCTNativeLocalStorage : NSObject <NativeLocalStorageSpec>
+@interface RCTNativeLocalStorage : NativeLocalStorageSpecBase <NativeLocalStorageSpec>

@end

NS_ASSUME_NONNULL_END
```

3. 打开 `RCTNativeLocalStorage.mm` 文件。
4. 修改它以在需要时发出事件，例如：

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

`NativeLocalStorageSpecBase` 是一个基类，提供了 `emitOnKeyAdded` 方法及其基本实现和样板代码。多亏了这个类，你不必处理将事件发送到 JS 所需的 Objective-C 和 JSI 之间的所有转换。

对于复杂类型，如规范中定义的 `KeyValuePair`，Codegen 将生成一个通用字典，你可以在原生端填充它。你有责任确保你在字典中使用的键与 JS 中规范类型中定义的属性相同。

</TabItem>
</Tabs>

## 步骤 5：运行你的应用

如果你现在尝试运行你的应用，应该会看到此行为。

| <center>Android</center>                                                                                    | <center>iOS</center>                                                                                    |
| ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| <center><img src="/docs/assets/turbo-native-modules-events-android.gif" width="75%" height="75%"/></center> | <center><img src="/docs/assets/turbo-native-modules-events-ios.gif" width="75%" height="75%"/></center> |
