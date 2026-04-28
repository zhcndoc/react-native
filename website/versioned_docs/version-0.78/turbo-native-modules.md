---
id: turbo-native-modules-introduction
title: '原生模块：简介'
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';
import {TurboNativeModulesAndroid, TurboNativeModulesIOS} from './\_turbo-native-modules-components';

# 原生模块

您的 React Native 应用程序代码可能需要与原生平台 API 交互，而这些 API 并未由 React Native 或现有库提供。您可以使用 **Turbo 原生模块** 自行编写集成代码。本指南将向您展示如何编写一个。

基本步骤如下：

1. **定义类型化的 JavaScript 规范**，使用最流行的 JavaScript 类型注释语言之一：Flow 或 TypeScript；
2. **配置您的依赖管理系统以运行 Codegen**，它将规范转换为原生语言接口；
3. **使用您的规范编写应用程序代码**；以及
4. **使用生成的接口编写您的原生平台代码**，以编写并将您的原生代码挂钩到 React Native 运行时环境中。

让我们通过构建一个示例 Turbo 原生模块来逐步完成这些步骤。本指南的其余部分假设您已运行以下命令创建了应用：

```shell
npx @react-native-community/cli@latest init TurboModuleExample --version 0.76.0
```

## 原生持久化存储

本指南将向您展示如何编写 [Web Storage API](https://html.spec.whatwg.org/multipage/webstorage.html#dom-localstorage-dev) 的实现：`localStorage`。对于可能在您的项目中编写应用代码的 React 开发者来说，这个 API 是很熟悉的。

为了使其在移动端工作，我们需要使用 Android 和 iOS API：

- Android：[SharedPreferences](https://developer.android.com/reference/android/content/SharedPreferences)，以及
- iOS：[NSUserDefaults](https://developer.apple.com/documentation/foundation/nsuserdefaults)。

### 1. 声明类型化规范

React Native 提供了一个名为 [Codegen](/the-new-architecture/what-is-codegen.mdx) 的工具，它接收用 TypeScript 或 Flow 编写的规范，并为 Android 和 iOS 生成平台特定代码。该规范声明了将在您的原生代码与 React Native JavaScript 运行时之间来回传递的方法和数据类型。Turbo 原生模块既包括您的规范，也包括您编写的原生代码，以及从您的规范生成的 Codegen 接口。

要创建规范文件：

1. 在应用的根文件夹内，创建一个名为 `specs` 的新文件夹。
2. 创建一个名为 `NativeLocalStorage.ts` 的新文件。

:::info
您可以在 [附录](/appendix.md) 文档中查看规范中可使用的所有类型以及生成的原生类型。
:::

:::info
如果您想更改模块名称及相关规范文件名称，请确保始终使用 'Native' 作为前缀（例如 `NativeStorage` 或 `NativeUsersDefault`）。
:::

以下是 `localStorage` 规范的实现：

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

该规范由 React Native Codegen 工具使用，为我们生成特定平台的接口和样板代码。为此，Codegen 需要知道在哪里找到我们的规范以及如何处理它。更新您的 `package.json` 以包含：

```json title="package.json"
     "start": "react-native start",
     "test": "jest"
   },
   // 突出显示-添加-开始
   "codegenConfig": {
     "name": "NativeLocalStorageSpec",
     "type": "modules",
     "jsSrcsDir": "specs",
     "android": {
       "javaPackageName": "com.nativelocalstorage"
     }
   },
   // 突出显示-添加-结束
   "dependencies": {
```

一切为 Codegen 配置好后，我们需要准备原生代码以挂钩到生成的代码中。

<Tabs groupId="platforms" queryString defaultValue={constants.defaultPlatform}>
<TabItem value="android" label="Android">
Codegen 通过 `generateCodegenArtifactsFromSchema` Gradle 任务执行：

```bash
cd android
./gradlew generateCodegenArtifactsFromSchema

BUILD SUCCESSFUL in 837ms
14 actionable tasks: 3 executed, 11 up-to-date
```

这在您构建 Android 应用时会自动运行。
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
[Codegen] Searching for codegen-enabled libraries in the app.
[Codegen] Found TurboModuleExample
[Codegen] Searching for codegen-enabled libraries in the project dependencies.
[Codegen] Found react-native
...
```

</TabItem>
</Tabs>

### 3. 使用 Turbo 原生模块编写应用代码

使用 `NativeLocalStorage`，这是一个修改后的 `App.tsx`，包含了一些我们想要持久化的文本、一个输入框和一些用于更新此值的按钮。

`TurboModuleRegistry` 支持 2 种检索 Turbo 原生模块的模式：

- `get<T>(name: string): T | null`，如果 Turbo 原生模块不可用，将返回 `null`。
- `getEnforcing<T>(name: string): T`，如果 Turbo 原生模块不可用，将抛出异常。这假设模块始终可用。

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
        Current stored value is: {value ?? 'No Value'}
      </Text>
      <TextInput
        placeholder="输入您想要存储的文本"
        style={styles.textInput}
        onChangeText={setEditingValue}
      />
      <Button title="保存" onPress={saveValue} />
      <Button title="删除" onPress={deleteValue} />
      <Button title="清除" onPress={clearAll} />
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

一切准备就绪后，我们将开始编写原生平台代码。我们分 2 部分进行：

:::note
本指南向您展示如何创建仅与新架构配合使用的 Turbo 原生模块。如果您需要同时支持新架构和旧架构，请参阅我们的 [向后兼容指南](https://github.com/reactwg/react-native-new-architecture/blob/main/docs/backwards-compat.md)。
:::

<Tabs groupId="platforms" queryString defaultValue={constants.defaultPlatform}>
    <TabItem value="android" label="Android">
        <TurboNativeModulesAndroid />
    </TabItem>
    <TabItem value="ios" label="iOS">
        <TurboNativeModulesIOS/>
    </TabItem>
</Tabs>
