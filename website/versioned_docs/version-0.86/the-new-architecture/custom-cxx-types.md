import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

# 高级：自定义 C++ 类型

:::note
本指南假设你已经熟悉 [**Pure C++ Turbo Native Modules**](pure-cxx-modules.md) 指南。本指南将在其基础上展开。
:::

C++ Turbo Native Modules 支持大多数 `std::` 标准类型的 [桥接功能](https://github.com/facebook/react-native/tree/main/packages/react-native/ReactCommon/react/bridging)。你可以在模块中直接使用这些类型，而无需额外代码。

如果你想为应用或库添加对新自定义类型的支持，则需要提供必要的 `bridging` 头文件。

## 添加一个新的自定义类型：Int64

C++ Turbo Native Modules 目前还不支持 `int64_t` 数字——因为 JavaScript 不支持大于 2^53 的数字。要表示大于 2^53 的数字，我们可以在 JS 中使用 `string` 类型，并在 C++ 中自动将其转换为 `int64_t`。

### 1. 创建 Bridging Header 文件

支持新的自定义类型的第一步，是定义 bridging header，它负责将类型 **从** JS 表示转换为 C++ 表示，以及从 C++ 表示 **到** JS 表示。

1. 在 `shared` 文件夹中，添加一个名为 `Int64.h` 的新文件
2. 将以下代码添加到该文件中：

```cpp title="Int64.h"
#pragma once

#include <react/bridging/Bridging.h>

namespace facebook::react {

template <>
struct Bridging<int64_t> {
  // 从 JS 表示转换为 C++ 表示
  static int64_t fromJs(jsi::Runtime &rt, const jsi::String &value) {
    try {
      size_t pos;
      auto str = value.utf8(rt);
      auto num = std::stoll(str, &pos);
      if (pos != str.size()) {
        throw std::invalid_argument("Invalid number"); // 不支持字母数字混合字符串
      }
      return num;
    } catch (const std::logic_error &e) {
      throw jsi::JSError(rt, e.what());
    }
  }

  // 从 C++ 表示转换为 JS 表示
  static jsi::String toJs(jsi::Runtime &rt, int64_t value) {
    return bridging::toJs(rt, std::to_string(value));
  }
};

}
```

自定义 bridging header 的关键组成部分如下：

- 为你的自定义类型显式特化 `Bridging` 结构体。在这里，模板指定的是 `int64_t` 类型。
- 一个 `fromJs` 函数，用于将 JS 表示转换为 C++ 表示
- 一个 `toJs` 函数，用于将 C++ 表示转换为 JS 表示

:::note
在 iOS 上，请记得将 `Int64.h` 文件添加到 Xcode 项目中。
:::

### 2. 修改 JS Spec

现在，我们可以修改 JS spec，添加一个使用新类型的方法。和往常一样，我们可以为 spec 使用 Flow 或 TypeScript。

1. 打开 `specs/NativeSampleTurbomodule`
2. 按如下方式修改 spec：

<Tabs groupId="custom-int64" queryString defaultValue={constants.defaultJavaScriptSpecLanguages} values={constants.javaScriptSpecLanguages}>
<TabItem value="typescript">

```diff title="NativeSampleModule.ts"
import {TurboModule, TurboModuleRegistry} from 'react-native';

export interface Spec extends TurboModule {
  readonly reverseString: (input: string) => string;
+  readonly cubicRoot: (input: string) => number;
}

export default TurboModuleRegistry.getEnforcing<Spec>(
  'NativeSampleModule',
);
```

</TabItem>
<TabItem value="flow">

```diff title="NativeSampleModule.js"
// @flow
import type {TurboModule} from 'react-native';
import { TurboModuleRegistry } from "react-native";

export interface Spec extends TurboModule {
  +reverseString: (input: string) => string;
+  +cubicRoot: (input: string) => number;
}

export default (TurboModuleRegistry.getEnforcing<Spec>(
  "NativeSampleModule"
): Spec);
```

</TabItem>
</Tabs>

在这个文件中，我们定义了需要在 C++ 中实现的函数。

### 3. 实现 Native 代码

现在，我们需要实现我们在 JS 规范中声明的函数。

1. 打开 `specs/NativeSampleModule.h` 文件，并应用以下更改：

```diff title="NativeSampleModule.h"
#pragma once

#include <AppSpecsJSI.h>
#include <memory>
#include <string>

+ #include "Int64.h"

namespace facebook::react {

class NativeSampleModule : public NativeSampleModuleCxxSpec<NativeSampleModule> {
public:
  NativeSampleModule(std::shared_ptr<CallInvoker> jsInvoker);

  std::string reverseString(jsi::Runtime& rt, std::string input);
+ int32_t cubicRoot(jsi::Runtime& rt, int64_t input);
};

} // namespace facebook::react

```

2. 打开 `specs/NativeSampleModule.cpp` 文件，并添加新函数的实现：

```diff title="NativeSampleModule.cpp"
#include "NativeSampleModule.h"
+ #include <cmath>

namespace facebook::react {

NativeSampleModule::NativeSampleModule(std::shared_ptr<CallInvoker> jsInvoker)
    : NativeSampleModuleCxxSpec(std::move(jsInvoker)) {}

std::string NativeSampleModule::reverseString(jsi::Runtime& rt, std::string input) {
  return std::string(input.rbegin(), input.rend());
}

+int32_t NativeSampleModule::cubicRoot(jsi::Runtime& rt, int64_t input) {
+    return std::cbrt(input);
+}

} // namespace facebook::react
```

该实现导入 `<cmath>` C++ 库以执行数学运算，然后使用 `<cmath>` 模块中的 `cbrt` 原语来实现 `cubicRoot` 函数。

### 4. 在你的应用中测试代码

现在，我们可以在应用中测试代码。

首先，我们需要更新 `App.tsx` 文件，以使用 TurboModule 中的新方法。然后，我们就可以构建 Android 和 iOS 应用了。

1. 打开 `App.tsx` 代码并应用以下更改：

```diff title="App.tsx"
// ...
+ const [cubicSource, setCubicSource] = React.useState('')
+ const [cubicRoot, setCubicRoot] = React.useState(0)
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>
          Welcome to C++ Turbo Native Module Example
        </Text>
        <Text>Write down here the text you want to revert</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Write your text here"
          onChangeText={setValue}
          value={value}
        />
        <Button title="Reverse" onPress={onPress} />
        <Text>Reversed text: {reversedValue}</Text>
+        <Text>For which number do you want to compute the Cubic Root?</Text>
+        <TextInput
+          style={styles.textInput}
+          placeholder="Write your text here"
+          onChangeText={setCubicSource}
+          value={cubicSource}
+        />
+        <Button title="Get Cubic Root" onPress={() => setCubicRoot(SampleTurboModule.cubicRoot(cubicSource))} />
+        <Text>The cubic root is: {cubicRoot}</Text>
      </View>
    </SafeAreaView>
  );
}
//...
```

2. 要在 Android 上测试应用，请在项目根目录运行 `yarn android`。
3. 要在 iOS 上测试应用，请在项目根目录运行 `yarn ios`。

## 添加一种新的结构化自定义类型：Address

上面的做法可以推广到任何类型。对于结构化类型，React Native 提供了一些辅助函数，使其更容易在 JS 与 C++ 之间双向桥接。

假设我们想桥接一个自定义 `Address` 类型，它具有以下属性：

```ts
interface Address {
  street: string;
  num: number;
  isInUS: boolean;
}
```

### 1. 在 specs 中定义类型

第一步，先在 JS specs 中定义新的自定义类型，这样 Codegen 就可以输出所有支持代码。这样一来，我们就不必手动编写这些代码。

1. 打开 `specs/NativeSampleModule` 文件，并添加以下更改。

<Tabs groupId="custom-int64" queryString defaultValue={constants.defaultJavaScriptSpecLanguages} values={constants.javaScriptSpecLanguages}>
<TabItem value="typescript">

```diff title="NativeSampleModule (Add Address type and validateAddress function)"
import {TurboModule, TurboModuleRegistry} from 'react-native';

+export type Address = {
+  street: string,
+  num: number,
+  isInUS: boolean,
+};

export interface Spec extends TurboModule {
  readonly reverseString: (input: string) => string;
+ readonly validateAddress: (input: Address) => boolean;
}

export default TurboModuleRegistry.getEnforcing<Spec>(
  'NativeSampleModule',
);
```

</TabItem>
<TabItem value="flow">

```diff title="NativeSampleModule (Add Address type and validateAddress function)"

// @flow
import type {TurboModule} from 'react-native';
import { TurboModuleRegistry } from "react-native";

+export type Address = {
+  street: string,
+  num: number,
+  isInUS: boolean,
+};


export interface Spec extends TurboModule {
  +reverseString: (input: string) => string;
+ +validateAddress: (input: Address) => boolean;
}

export default (TurboModuleRegistry.getEnforcing<Spec>(
  "NativeSampleModule"
): Spec);
```

</TabItem>
</Tabs>

这段代码定义了新的 `Address` 类型，并为 Turbo Native Module 定义了一个新的 `validateAddress` 函数。请注意，`validateFunction` 需要一个 `Address` 对象作为参数。

函数也可以返回自定义类型。

### 2. 定义桥接代码

根据 specs 中定义的 `Address` 类型，Codegen 会生成两个辅助类型：`NativeSampleModuleAddress` 和 `NativeSampleModuleAddressBridging`。

第一个类型是 `Address` 的定义。第二个类型包含将该自定义类型在 JS 与 C++ 之间双向桥接的全部基础设施。我们只需要额外添加的一步，是定义扩展 `NativeSampleModuleAddressBridging` 类型的 `Bridging` 结构体。

1. 打开 `shared/NativeSampleModule.h` 文件
2. 将以下代码添加到文件中：

```diff title="NativeSampleModule.h (Bridging the Address type)"
#include "Int64.h"
#include <memory>
#include <string>

namespace facebook::react {
+  using Address = NativeSampleModuleAddress<std::string, int32_t, bool>;

+  template <>
+  struct Bridging<Address>
+      : NativeSampleModuleAddressBridging<Address> {};
  // ...
}
```

这段代码为泛型类型 `NativeSampleModuleAddress` 定义了一个 `Address` 类型别名。**泛型参数的顺序很重要**：第一个模板参数对应结构体中的第一个数据类型，第二个对应第二个，以此类推。

然后，代码通过扩展 Codegen 生成的 `NativeSampleModuleAddressBridging`，为新的 `Address` 类型添加了 `Bridging` 特化。

:::note
生成这些类型时遵循以下命名约定：

- 名称的第一部分始终是模块的类型。在这个示例中是 `NativeSampleModule`。
- 名称的第二部分始终是 specs 中定义的 JS 类型名。在这个示例中是 `Address`。
  :::

### 3. 实现 Native 代码

现在，我们需要在 C++ 中实现 `validateAddress` 函数。首先，需要在 `.h` 文件中添加函数声明，然后才能在 `.cpp` 文件中实现它。

1. 打开 `shared/NativeSampleModule.h` 文件并添加函数定义

```diff title="NativeSampleModule.h (validateAddress function prototype)"
  std::string reverseString(jsi::Runtime& rt, std::string input);

+  bool validateAddress(jsi::Runtime &rt, jsi::Object input);
};

} // namespace facebook::react
```

2. 打开 `shared/NativeSampleModule.cpp` 文件并添加函数实现

```cpp title="NativeSampleModule.cpp (validateAddress implementation)"
bool NativeSampleModule::validateAddress(jsi::Runtime &rt, jsi::Object input) {
  std::string street = input.getProperty(rt, "street").asString(rt).utf8(rt);
  int32_t number = input.getProperty(rt, "num").asNumber();

  return !street.empty() && number > 0;
}
```

在实现中，表示 `Address` 的对象是一个 `jsi::Object`。要从该对象中提取值，我们需要使用 `JSI` 提供的访问器：

- `getProperty()` 通过名称从对象中获取属性。
- `asString()` 将属性转换为 `jsi::String`。
- `utf8()` 将 `jsi::String` 转换为 `std::string`。
- `asNumber()` 将属性转换为 `double`。

一旦我们手动解析了对象，就可以实现所需的逻辑。

:::note
如果你想进一步了解 `JSI` 以及它的工作原理，可以看看 App.JS 2024 上的这场 [精彩演讲](https://youtu.be/oLmGInjKU2U?feature=shared)
:::

### 4. 在应用中测试代码

要在应用中测试代码，我们需要修改 `App.tsx` 文件。

1. 打开 `App.tsx` 文件。删除 `App()` 函数中的内容。
2. 用以下代码替换 `App()` 函数的主体：

```tsx title="App.tsx (App function body replacement)"
const [street, setStreet] = React.useState('');
const [num, setNum] = React.useState('');
const [isValidAddress, setIsValidAddress] = React.useState<
  boolean | null
>(null);

const onPress = () => {
  let houseNum = parseInt(num, 10);
  if (isNaN(houseNum)) {
    houseNum = -1;
  }
  const address = {
    street,
    num: houseNum,
    isInUS: false,
  };
  const result = SampleTurboModule.validateAddress(address);
  setIsValidAddress(result);
};

return (
  <SafeAreaView style={styles.container}>
    <View>
      <Text style={styles.title}>
        Welcome to C Turbo Native Module Example
      </Text>
      <Text>Address:</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Write your address here"
        onChangeText={setStreet}
        value={street}
      />
      <Text>Number:</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Write your address here"
        onChangeText={setNum}
        value={num}
      />
      <Button title="Validate" onPress={onPress} />
      {isValidAddress != null && (
        <Text>
          Your address is {isValidAddress ? 'valid' : 'not valid'}
        </Text>
      )}
    </View>
  </SafeAreaView>
);
```

恭喜！🎉

你已经成功将你的第一个类型从 JS 桥接到了 C++。