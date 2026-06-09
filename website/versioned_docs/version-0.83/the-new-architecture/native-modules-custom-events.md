import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

# 在原生模块中发送事件

在某些情况下，您可能希望一个原生模块监听平台层的一些事件，然后将它们发送到 JavaScript 层，以便让您的应用程序对这些原生事件作出响应。在其他情况下，您可能有长时间运行的操作，它们可以发送事件，以便在事件发生时更新 UI。

这两种情况都是从原生模块发送事件的良好用例。在本指南中，您将学习如何做到这一点。

## 当向存储添加新键时发送事件

在本例中，您将学习如何在向存储添加新键时发送事件。更改键的值不会发送事件，但添加新键会。

本指南基于 [原生模块](/docs/next/turbo-native-modules-introduction) 指南开始。
在深入本指南之前，请确保熟悉该指南，并可能已经实现了其中的示例。

## 步骤 1：更新 NativeLocalStorage 的规范

第一步是更新 `NativeLocalStorage` 的规范，以让 React Native 知道该模块可以发送事件。

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
  removeItem(key: string): string | null;
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

通过 `import type` 语句，您从 `react-native` 中导入了 `CodegenTypes`，其中包含了 `EventEmitter` 类型。这使您能够使用 `CodegenTypes.EventEmitter<KeyValuePair>` 定义 `onKeyAdded` 属性，指定该事件将发送类型为 `KeyValuePair` 的负载。

当事件被发送时，您期望它接收一个类型为 `KeyValuePair` 的参数。

## 步骤 2：生成 Codegen

既然您已经更新了原生模块的规范，现在需要重新运行 Codegen 以生成本地代码的工件。

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

这将在您构建 Android 应用时自动运行。
</TabItem>
<TabItem value="ios" label="iOS">
Codegen 作为脚本阶段的一部分自动添加到使用 CocoaPods 生成的项目中。

```bash
cd ios
bundle install
bundle exec pod install
```

输出如下所示：

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

现在是时候更新 App 的代码来处理新的事件了。

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
+   listenerSubscription.current = NativeLocalStorage?.onKeyAdded((pair) => Alert.alert(`新键已添加：${pair.key}，值为：${pair.value}`));

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
+     Alert.alert('请输入键');
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
+     Alert.alert('请输入键');
+     return;
+   }
    NativeLocalStorage?.removeItem(key);
    setValue('');
  }

+ function retrieveValue() {
+   if (key == null) {
+     Alert.alert('请输入键');
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
+     <Text>键：</Text>
+      <TextInput
+       placeholder="输入您想存储的键"
+       style={styles.textInput}
+       onChangeText={setKey}
+     />
+     <Text>值：</Text>
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

这里有几个重要的更改：

1. 您需要从 `react-native` 导入 `EventSubscription` 类型以处理事件订阅；
2. 您需要使用 `useRef` 来跟踪 `EventSubscription` 引用；
3. 使用 `useEffect` 钩子注册监听器。`onKeyAdded` 函数接收一个回调，该回调的参数是 `KeyValuePair` 类型的对象；
4. 添加到 `onKeyAdded` 的回调在每次从原生向 JS 发送事件时执行；
5. 在 `useEffect` 的清理函数中，您调用 `remove` 移除事件订阅，并将引用设为 `null`。

其余更改是常规的 React 修改，以提升 App 对新功能的支持。

## 步骤 4：编写您的原生代码

一切准备就绪后，开始编写原生平台代码。

<Tabs groupId="platforms" queryString defaultValue={constants.defaultPlatform}>
<TabItem value="android" label="Android">

假设您已经按照 [原生模块指南](/docs/turbo-native-modules-introduction?platforms=android&language=typescript#3-write-application-code-using-the-turbo-native-module) 进行了 Android 指南中的步骤，剩下要做的就是将发送事件的代码接入您的应用。

操作步骤如下：

1. 打开 `NativeLocalStorage.kt` 文件；
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

首先，您需要导入几个类型，用来创建从原生到 JS 发送的事件数据：

- `import com.facebook.react.bridge.Arguments`
- `import com.facebook.react.bridge.WritableMap`

其次，您需要实现实际发送事件到 JS 的逻辑。对于复杂类型，比如规范中定义的 `KeyValuePair`，Codegen 会生成一个期望 `ReadableMap` 作为参数的函数。您可以使用 `Arguments.createMap()` 工厂方法创建 `ReadableMap`，然后使用 `apply` 函数填充映射。您有责任确保地图中使用的键与 JS 中规范类型定义的属性相同。

</TabItem>
<TabItem value="ios" label="iOS">

假设您已经按照 [原生模块指南](/docs/turbo-native-modules-introduction?platforms=ios&language=typescript#3-write-application-code-using-the-turbo-native-module) 进行了 iOS 指南中的步骤，剩余工作就是加入发送事件的代码。

操作步骤如下：

1. 打开 `RCTNativeLocalStorage.h` 文件；
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

3. 打开 `RCTNativeLocalStorage.mm` 文件；
4. 修改它，在需要的时候发送事件，例如：

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

`NativeLocalStorageSpecBase` 是一个基类，提供了 `emitOnKeyAdded` 方法及其基础实现和样板代码。得益于该类，您无需处理发送事件到 JS 所需的 Objective-C 与 JSI 的全部转换。

对于像规范中定义的 `KeyValuePair` 这样复杂的类型，Codegen 会生成一个原生侧可以填充的通用字典。您有责任确保字典中使用的键与 JS 中规范类型定义的属性相同。

</TabItem>
</Tabs>

## 步骤 5：运行您的应用

如果您现在尝试运行应用，应该看到以下表现。

| <center>Android</center>                                                                                    | <center>iOS</center>                                                                                    |
| ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| <center><img src="/docs/assets/turbo-native-modules-events-android.gif" width="75%" height="75%"/></center> | <center><img src="/docs/assets/turbo-native-modules-events-ios.gif" width="75%" height="75%"/></center> |