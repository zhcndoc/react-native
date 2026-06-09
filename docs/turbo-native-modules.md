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

# 原生模块

你的 React Native 应用代码可能需要与 React Native 或现有库未提供的原生平台 API 交互。你可以使用 **Turbo Native Module** 自行编写集成代码。本指南将向你展示如何编写一个。

基本步骤如下：

1. 使用最流行的 JavaScript 类型注解语言之一：Flow 或 TypeScript，**定义一个带类型的 JavaScript 规范**；
2. **配置你的依赖管理系统以运行 Codegen**，它会将规范转换为原生语言接口；
3. **使用你的规范编写应用代码**；以及
4. **使用生成的接口编写你的原生平台代码**，将原生代码编写并接入 React Native 运行时环境。

我们将通过构建一个示例 Turbo Native Module 来逐步完成这些步骤。本指南其余部分假设你已通过以下命令创建了应用：

<CodeBlock language="bash" title="shell">
{`npx @react-native-community/cli@latest init TurboModuleExample --version ${getCurrentVersion()}`}
</CodeBlock>

## 原生持久化存储

本指南将向你展示如何实现 [Web Storage API](https://html.spec.whatwg.org/multipage/webstorage.html#dom-localstorage-dev) 的一个实现：`localStorage`。这个 API 对可能正在你项目中编写应用代码的 React 开发者来说很熟悉。

要在移动端实现这一点，我们需要使用 Android 和 iOS API：

- Android：[SharedPreferences](https://developer.android.com/reference/android/content/SharedPreferences)，以及
- iOS：[NSUserDefaults](https://developer.apple.com/documentation/foundation/nsuserdefaults)。

### 1. 声明带类型的规范

React Native 提供了一个名为 [Codegen](/docs/the-new-architecture/what-is-codegen) 的工具，它会读取用 TypeScript 或 Flow 编写的规范，并为 Android 和 iOS 生成平台特定代码。该规范声明了将在你的原生代码与 React Native JavaScript 运行时之间来回传递的方法和数据类型。Turbo Native Module 既包括你的规范、你编写的原生代码，也包括根据你的规范生成的 Codegen 接口。

要创建一个 specs 文件：

1. 在应用的根目录中，创建一个名为 `specs` 的新文件夹。
2. 创建一个名为 `NativeLocalStorage.ts` 的新文件。

:::info
你可以在 [附录](/docs/appendix) 文档中查看你的规范中可以使用的所有类型，以及生成的原生类型。
:::

:::info
如果你想更改模块名称以及相关 specs 文件，请务必始终使用 `Native` 作为前缀（例如 `NativeStorage` 或 `NativeUsersDefault`）。
:::

下面是 `localStorage` 规范的一个实现：

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

该规范会被 React Native Codegen 工具用于为我们生成平台特定的接口和样板代码。为此，Codegen 需要知道在哪里找到我们的规范，以及如何处理它。将你的 `package.json` 更新为包含以下内容：

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

在 Codegen 全部接入后，我们需要准备原生代码以接入生成的代码。

<Tabs groupId="platforms" queryString defaultValue={constants.defaultPlatform}>
<TabItem value="android" label="Android">
Codegen 通过 `generateCodegenArtifactsFromSchema` Gradle 任务执行：

```bash
cd android
./gradlew generateCodegenArtifactsFromSchema

BUILD SUCCESSFUL in 837ms
14 actionable tasks: 3 executed, 11 up-to-date
```

这会在你构建 Android 应用时自动运行。
</TabItem>
<TabItem value="ios" label="iOS">
Codegen 作为 CocoaPods 自动添加到项目中的脚本阶段的一部分运行。

```bash
cd ios
bundle install
bundle exec pod install
```

输出会类似于：

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

使用 `NativeLocalStorage`，这里是一个修改后的 `App.tsx`，其中包含我们想要持久化的一些文本、一个输入框以及一些用于更新该值的按钮。

`TurboModuleRegistry` 支持两种获取 Turbo Native Module 的模式：

- `get<T>(name: string): T | null`：如果 Turbo Native Module 不可用，则返回 `null`。
- `getEnforcing<T>(name: string): T`：如果 Turbo Native Module 不可用，则抛出异常。此方式假设该模块始终可用。

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
        当前保存的值是：{value ?? '没有值'}
      </Text>
      <TextInput
        placeholder="输入你想要存储的文本"
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

### 4. 编写你的原生平台代码

在一切准备就绪后，我们将开始编写原生平台代码。我们分为两部分来完成：

:::note
本指南展示了如何创建一个仅适用于新架构的 Turbo Native Module。如果你需要同时支持新架构和旧架构，请参阅我们的[向后兼容指南](https://github.com/reactwg/react-native-new-architecture/blob/main/docs/backwards-compat.md)。
:::

<Tabs groupId="platforms" queryString defaultValue={constants.defaultPlatform}>
    <TabItem value="android" label="Android">
        <TurboNativeModulesAndroid />
    </TabItem>
    <TabItem value="ios" label="iOS">
        <TurboNativeModulesIOS/>
    </TabItem>
</Tabs>
