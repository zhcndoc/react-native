---
id: turbo-native-modules-introduction
title: 'Native 模块：介绍'
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import constants from '@site/core/TabsConstants';
import CodeBlock from '@theme/CodeBlock';
import {getCurrentVersion} from '@site/src/getCurrentVersion';
import {TurboNativeModulesAndroid, TurboNativeModulesIOS} from './\_turbo-native-modules-components';

# Native 模块

您的 React Native 应用代码可能需要与 React Native 或现有库未提供的原生平台 API 交互。您可以使用 **Turbo Native 模块** 自行编写集成代码。本指南将向您展示如何编写一个。

基本步骤为：

1. 使用最流行的 JavaScript 类型注解语言之一：Flow 或 TypeScript **定义一个带类型的 JavaScript 规范**；
2. **配置您的依赖管理系统以运行 Codegen**，该工具将规范转换为原生语言接口；
3. **使用您的规范编写应用程序代码**；以及
4. **使用生成的接口编写您的原生平台代码**，将原生代码编写并挂载到 React Native 运行时环境中。

让我们通过构建一个示例 Turbo Native 模块来逐步完成每个步骤。本指南的其余部分假设您已经运行以下命令创建了您的应用：

<CodeBlock language="bash" title="shell">
{`npx @react-native-community/cli@latest init TurboModuleExample --version ${getCurrentVersion()}`}
</CodeBlock>

## 原生持久存储

本指南将向您展示如何实现 [Web Storage API](https://html.spec.whatwg.org/multipage/webstorage.html#dom-localstorage-dev)：`localStorage`。此 API 对于可能在您的项目中编写应用代码的 React 开发者来说非常熟悉。

为了让它在移动端工作，我们需要使用 Android 和 iOS 的 API：

- Android: [SharedPreferences](https://developer.android.com/reference/android/content/SharedPreferences)，以及
- iOS: [NSUserDefaults](https://developer.apple.com/documentation/foundation/nsuserdefaults)。

### 1. 声明带类型的规范

React Native 提供了一个名为 [Codegen](/docs/the-new-architecture/what-is-codegen) 的工具，它接收用 TypeScript 或 Flow 编写的规范，并为 Android 和 iOS 生成特定平台代码。规范声明了将在您的原生代码和 React Native JavaScript 运行时之间传递的方法和数据类型。Turbo Native 模块既是您的规范，也是您编写的原生代码，以及从规范生成的 Codegen 接口。

要创建规范文件：

1. 在您的应用根文件夹中，创建一个名为 `specs` 的新文件夹。
2. 创建一个名为 `NativeLocalStorage.ts` 的新文件。

:::info
您可以在 [附录](/docs/appendix) 文档中查看所有可在规范中使用的类型及生成的原生类型。
:::

:::info
如果您想更改模块名称及相关的规范文件，请确保始终使用 "Native" 作为前缀（例如 `NativeStorage` 或 `NativeUsersDefault`）。
:::

以下是 `localStorage` 规范的一个实现：

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

规范被 React Native Codegen 工具使用，用以为我们生成特定平台的接口和样板代码。为此，Codegen 需要知道从哪里获取规范以及如何处理它。请更新您的 `package.json`，添加以下内容：

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

Codegen 配置好后，我们需要准备原生代码，以挂载到生成的代码上。

<Tabs groupId="platforms" queryString defaultValue={constants.defaultPlatform}>
<TabItem value="android" label="Android">
Codegen 是通过 `generateCodegenArtifactsFromSchema` 这个 Gradle 任务执行的：

```bash
cd android
./gradlew generateCodegenArtifactsFromSchema

BUILD SUCCESSFUL in 837ms
14 actionable tasks: 3 executed, 11 up-to-date
```

当您构建 Android 应用时，这个过程会自动执行。
</TabItem>
<TabItem value="ios" label="iOS">
Codegen 作为 CocoaPods 生成的项目自动添加的脚本阶段的一部分运行。

```bash
cd ios
bundle install
bundle exec pod install
```

输出类似如下：

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

### 3. 使用 Turbo Native 模块编写应用代码

使用 `NativeLocalStorage`，下面是一个修改过的 `App.tsx`，其中包含一些我们希望持久化的文本、一个输入框以及若干个按钮，用来更新这个值。

`TurboModuleRegistry` 支持两种检索 Turbo Native 模块的方式：

- `get<T>(name: string): T | null`，如果 Turbo Native 模块不可用则返回 `null`。
- `getEnforcing<T>(name: string): T`，如果 Turbo Native 模块不可用则抛出异常。此方法假定模块始终可用。

```tsx title="App.tsx"
import React from 'react';
import {
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

  const [editingValue, setEditingValue] = React.useState<
    string | null
  >(null);

  React.useEffect(() => {
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
        当前存储的值是：{value ?? '无值'}
      </Text>
      <TextInput
        placeholder="输入您想存储的文本"
        style={styles.textInput}
        onChangeText={setEditingValue}
      />
      <Button title="保存" onPress={saveValue} />
      <Button title="删除" onPress={deleteValue} />
      <Button title="清空" onPress={clearAll} />
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

### 4. 编写您的原生平台代码

准备就绪后，我们开始编写原生平台代码。这里分两部分进行：

:::note
本指南展示如何创建仅适用于新架构（New Architecture）的 Turbo Native 模块。如果您需要同时支持新架构和旧架构（Legacy Architecture），请参考我们的[向后兼容指南](https://github.com/reactwg/react-native-new-architecture/blob/main/docs/backwards-compat.md)。
:::

<Tabs groupId="platforms" queryString defaultValue={constants.defaultPlatform}>
    <TabItem value="android" label="Android">
        <TurboNativeModulesAndroid />
    </TabItem>
    <TabItem value="ios" label="iOS">
        <TurboNativeModulesIOS/>
    </TabItem>
</Tabs>