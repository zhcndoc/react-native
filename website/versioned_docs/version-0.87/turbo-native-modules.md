---
id: turbo-native-modules-introduction
title: '原生模块：简介'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import constants from '@site/core/TabsConstants';
import CodeBlock from '@theme/CodeBlock';
import {getCurrentVersion} from '@site/src/getCurrentVersion';
import {TurboNativeModulesAndroid, TurboNativeModulesIOS} from './\_turbo-native-modules-components';

# Native Modules

您的 React Native 应用代码可能需要与 React Native 或现有库未提供的原生平台 API 进行交互。您可以使用 **Turbo Native Module** 自行编写集成代码。本指南将向您展示如何编写一个 Turbo Native Module。

基本步骤如下：

1. 使用最流行的 JavaScript 类型注解语言之一——Flow 或 TypeScript——**定义类型化的 JavaScript 规范**；
2. **配置依赖管理系统以运行 Codegen**，将规范转换为原生语言接口；
3. 使用您的规范**编写应用代码**；以及
4. **使用生成的接口编写原生平台代码**，将您的原生代码编写并接入 React Native 运行时环境。

让我们通过构建一个示例 Turbo Native Module 来逐步了解这些步骤。本指南的其余部分假设您已经使用以下命令创建了应用：

<CodeBlock language="bash" title="shell">
{`npx @react-native-community/cli@latest init TurboModuleExample --version ${getCurrentVersion()}`}
</CodeBlock>

## Native Persistent Storage

本指南将向您展示如何实现 Web Storage API 中的 [localStorage](https://html.spec.whatwg.org/multipage/webstorage.html#dom-localstorage-dev)。对于可能正在您的项目中编写应用代码的 React 开发者来说，这个 API 很容易理解。

为了让它在移动设备上正常工作，我们需要使用 Android 和 iOS API：

- Android：[SharedPreferences](https://developer.android.com/reference/android/content/SharedPreferences)，以及
- iOS：[NSUserDefaults](https://developer.apple.com/documentation/foundation/nsuserdefaults)。

### 1. 声明类型化规范

React Native 提供了一个名为 [Codegen](/docs/the-new-architecture/what-is-codegen) 的工具，它接受使用 TypeScript 或 Flow 编写的规范，并为 Android 和 iOS 生成特定于平台的代码。规范声明了将在原生代码与 React Native JavaScript 运行时之间来回传递的方法和数据类型。Turbo Native Module 包含您的规范、您编写的原生代码，以及根据您的规范生成的 Codegen 接口。

要创建 specs 文件：

1. 在应用的根文件夹内，创建一个名为 `specs` 的新文件夹。
2. 创建一个名为 `NativeLocalStorage.ts` 的新文件。

:::info
您可以在 [附录](/docs/appendix) 文档中查看规范中可以使用的所有类型，以及所生成的原生类型。
:::

:::info
如果您想更改模块名称和相关的 specs 文件名称，请确保始终使用“Native”作为前缀（例如 `NativeStorage` 或 `NativeUsersDefault`）。
:::

以下是 `localStorage` 规范的一种实现：

<Tabs groupId="language" queryString defaultValue={constants.defaultJavaScriptSpecLanguage} values={constants.javaScriptSpecLanguages}>
<TabItem value="typescript">

```typescript title="specs/NativeLocalStorage.ts"
import type {TurboModule} from 'react-native';
import {TurboModuleRegistry} from 'react-native';

export interface Spec extends TurboModule {
  setItem(value: string, key: string): void;
  getItem(key: string): string | null;
  removeItem(key: string): void;
  clear(): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>(
  'NativeLocalStorage',
);
```

</TabItem>
<TabItem value="flow">

```flow title="NativeLocalStorage.js"
import type {TurboModule} from 'react-native';
import {TurboModule, TurboModuleRegistry} from 'react-native';

export interface Spec extends TurboModule {
  setItem(value: string, key: string): void;
  getItem(key: string): ?string;
  removeItem(key: string): void;
  clear(): void;
}
```

</TabItem>
</Tabs>

### 2. 配置 Codegen 运行

React Native Codegen 工具会使用该规范为我们生成特定于平台的接口和样板代码。为此，Codegen 需要知道在哪里找到我们的规范，以及要对其执行什么操作。更新您的 `package.json`，使其包含：

```json title="package.json"
     "start": "react-native start",
     "test": "jest"
   },
   // highlight-add-start
   "codegenConfig": {
     "name": "NativeLocalStorageSpec",
     "type": "modules",
     "jsSrcsDir": "specs",
     "android": {
       "javaPackageName": "com.nativelocalstorage"
     }
   },
   // highlight-add-end
   "dependencies": {
```

Codegen 的所有内容都连接完成后，我们需要准备原生代码，以便接入生成的代码。

<Tabs groupId="platforms" queryString defaultValue={constants.defaultPlatform}>
<TabItem value="android" label="Android">
Codegen 通过 `generateCodegenArtifactsFromSchema` Gradle 任务执行：

```bash
cd android
./gradlew generateCodegenArtifactsFromSchema

BUILD SUCCESSFUL in 837ms
14 actionable tasks: 3 executed, 11 up-to-date
```

构建 Android 应用时会自动运行此任务。
</TabItem>
<TabItem value="ios" label="iOS">
Codegen 会作为脚本阶段的一部分运行，该脚本阶段会被自动添加到 CocoaPods 生成的项目中。

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
[Codegen] Searching for codegen-enabled libraries in the app.
[Codegen] Found TurboModuleExample
[Codegen] Searching for codegen-enabled libraries in the project dependencies.
[Codegen] Found react-native
...
```

</TabItem>
</Tabs>

### 3. 使用 Turbo Native Module 编写应用代码

使用 `NativeLocalStorage`，下面是修改后的 `App.tsx`，其中包含我们希望持久化的一些文本、一个输入框，以及一些用于更新此值的按钮。

`TurboModuleRegistry` 支持两种获取 Turbo Native Module 的模式：

- `get<T>(name: string): T | null`：如果 Turbo Native Module 不可用，则返回 `null`。
- `getEnforcing<T>(name: string): T`：如果 Turbo Native Module 不可用，则抛出异常。这假设该模块始终可用。

```tsx title="App.tsx"
import {useEffect, useState, type JSX} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  Button,
} from 'react-native';

import NativeLocalStorage from './specs/NativeLocalStorage';

const EMPTY = '<empty>';

function App(): JSX.Element {
  const [value, setValue] = useState<string | null>(null);

  const [editingValue, setEditingValue] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const storedValue = NativeLocalStorage?.getItem('myKey');
    setValue(storedValue ?? '');
  }, []);

  function saveValue() {
    NativeLocalStorage?.setItem(editingValue ?? EMPTY, 'myKey');
    setValue(editingValue);
  }

  function clearAll() {
    NativeLocalStorage?.clear();
    setValue('');
  }

  function deleteValue() {
    NativeLocalStorage?.removeItem('myKey');
    setValue('');
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <Text style={styles.text}>
        Current stored value is: {value ?? 'No Value'}
      </Text>
      <TextInput
        placeholder="Enter the text you want to store"
        style={styles.textInput}
        onChangeText={setEditingValue}
      />
      <Button title="Save" onPress={saveValue} />
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

### 4. 编写原生平台代码

一切准备就绪后，我们将开始编写原生平台代码。我们分两部分进行：

:::note
本指南将向您展示如何创建一个仅适用于新架构的 Turbo Native Module。如果您需要同时支持新架构和旧架构，请参阅我们的[向后兼容指南](https://github.com/reactwg/react-native-new-architecture/blob/main/docs/backwards-compat.md)。
:::

<Tabs groupId="platforms" queryString defaultValue={constants.defaultPlatform}>
    <TabItem value="android" label="Android">
        <TurboNativeModulesAndroid />
    </TabItem>
    <TabItem value="ios" label="iOS">
        <TurboNativeModulesIOS/>
    </TabItem>
</Tabs>
