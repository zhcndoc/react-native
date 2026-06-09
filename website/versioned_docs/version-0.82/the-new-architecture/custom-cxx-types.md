import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

# 高级：自定义 C++ 类型

:::note
本指南假设您熟悉 [**纯 C++ Turbo 原生模块**](pure-cxx-modules.md) 指南。本文将在此基础上进行构建。
:::

C++ Turbo 原生模块支持大多数 `std::` 标准类型的 [桥接功能](https://github.com/facebook/react-native/tree/main/packages/react-native/ReactCommon/react/bridging)。您可以在模块中使用大多数这些类型，而无需任何额外的代码。

如果您想在应用或库中添加对新自定义类型的支持，则需要提供必要的 `bridging` 头文件。

## 添加新的自定义类型：Int64

C++ Turbo 原生模块尚不支持 `int64_t` 数字——因为 JavaScript 不支持大于 2^53 的数字。为了表示大于 2^53 的数字，我们可以在 JS 中使用 `string` 类型，并在 C++ 中自动将其转换为 `int64_t`。

### 1. 创建桥接头文件

支持新自定义类型的第一步是定义桥接头文件，该文件负责将类型 **从** JS 表示转换为 C++ 表示，以及 **从** C++ 表示转换为 JS 表示。

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
        throw std::invalid_argument("Invalid number"); // 不支持字母数字字符串
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

自定义桥接头文件的关键组件包括：

- 为您的自定义类型显式特化 `Bridging` 结构体。在这种情况下，模板指定了 `int64_t` 类型。
- 一个 `fromJs` 函数，用于从 JS 表示转换为 C++ 表示
- 一个 `toJs` 函数，用于从 C++ 表示转换为 JS 表示

:::note
在 iOS 上，记得将 `Int64.h` 文件添加到 Xcode 项目中。
:::

### 2. 修改 JS 规范

现在，我们可以修改 JS 规范以添加使用新类型的方法。通常，我们可以为规范使用 Flow 或 TypeScript。

1. 打开 `specs/NativeSampleTurbomodule`
2. 按如下方式修改规范：

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

在这些文件中，我们正在定义需要在 C++ 中实现的函数。

### 3. 实现原生代码

现在，我们需要实现在 JS 规范中声明的函数。

1. 打开 `specs/NativeSampleModule.h` 文件并应用以下更改：

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

2. 打开 `specs/NativeSampleModule.cpp` 文件并应用实现新函数：

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

该实现导入 `<cmath>` C++ 库以执行数学运算，然后使用 `<cmath>` 模块中的 `cbrt` 原语实现 `cubicRoot` 函数。

### 4. 在您的应用中测试代码

现在，我们可以在应用中测试代码。

首先，我们需要更新 `App.tsx` 文件以使用 TurboModule 中的新方法。然后，我们可以构建 Android 和 iOS 应用。

1. 打开 `App.tsx` 代码并应用以下更改：

```diff title="App.tsx"
// ...
+ const [cubicSource, setCubicSource] = useState('')
+ const [cubicRoot, setCubicRoot] = useState(0)
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
+        <Text>对于要计算立方根的数字，您想输入什么？</Text>
+        <TextInput
+          style={styles.textInput}
+          placeholder="在此输入您的文本"
+          onChangeText={setCubicSource}
+          value={cubicSource}
+        />
+        <Button title="获取立方根" onPress={() => setCubicRoot(SampleTurboModule.cubicRoot(cubicSource))} />
+        <Text>立方根为：{cubicRoot}</Text>
      </View>
    </SafeAreaView>
  );
}
//...
```

2. 要在 Android 上测试应用，从项目的根文件夹运行 `yarn android`。
3. 要在 iOS 上测试应用，从项目的根文件夹运行 `yarn ios`。

## 添加新的结构化自定义类型：Address

上述方法可以推广到任何类型的类型。对于结构化类型，React Native 提供了一些辅助函数，使它们更容易在 JS 和 C++ 之间进行桥接。

假设我们想要桥接一个具有以下属性的自定义 `Address` 类型：

```ts
interface Address {
  street: string;
  num: number;
  isInUS: boolean;
}
```

### 1. 在规范中定义类型

第一步，让我们在 JS 规范中定义新的自定义类型，以便 Codegen 可以输出所有支持代码。这样，我们就不必手动编写代码。

1. 打开 `specs/NativeSampleModule` 文件并添加以下更改。

<Tabs groupId="custom-int64" queryString defaultValue={constants.defaultJavaScriptSpecLanguages} values={constants.javaScriptSpecLanguages}>
<TabItem value="typescript">

```diff title="NativeSampleModule (添加 Address 类型和 validateAddress 函数)"
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

```diff title="NativeSampleModule (添加 Address 类型和 validateAddress 函数)"

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

此代码定义了新的 `Address` 类型，并为 Turbo 原生模块定义了一个新的 `validateAddress` 函数。请注意，`validateFunction` 需要一个 `Address` 对象作为参数。

也可以拥有返回自定义类型的函数。

### 2. 定义桥接代码

根据规范中定义的 `Address` 类型，Codegen 将生成两个辅助类型：`NativeSampleModuleAddress` 和 `NativeSampleModuleAddressBridging`。

第一个类型是 `Address` 的定义。第二个类型包含将所有自定义类型从 JS 桥接到 C++ 以及反之亦然的基础设施。我们需要添加的唯一额外步骤是定义扩展 `NativeSampleModuleAddressBridging` 类型的 `Bridging` 结构体。

1. 打开 `shared/NativeSampleModule.h` 文件
2. 在文件中添加以下代码：

```diff title="NativeSampleModule.h (桥接 Address 类型)"
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

此代码为泛型类型 `NativeSampleModuleAddress` 定义了 `Address` 类型别名。**泛型的顺序很重要**：第一个模板参数引用结构的第一个数据类型，第二个引用第二个，依此类推。

然后，代码通过扩展由 Codegen 生成的 `NativeSampleModuleAddressBridging` 为新 `Address` 类型添加了 `Bridging` 特化。

:::note
生成这些类型遵循一个约定：

- 名称的第一部分始终是模块的类型。在本示例中为 `NativeSampleModule`。
- 名称的第二部分始终是在规范中定义的 JS 类型的名称。在本示例中为 `Address`。
  :::

### 3. 实现原生代码

现在，我们需要在 C++ 中实现 `validateAddress` 函数。首先，我们需要将函数声明添加到 `.h` 文件中，然后我们可以在 `.cpp` 文件中实现它。

1. 打开 `shared/NativeSampleModule.h` 文件并添加函数定义

```diff title="NativeSampleModule.h (validateAddress 函数原型)"
  std::string reverseString(jsi::Runtime& rt, std::string input);

+  bool validateAddress(jsi::Runtime &rt, jsi::Object input);
};

} // namespace facebook::react
```

2. 打开 `shared/NativeSampleModule.cpp` 文件并添加函数实现

```cpp title="NativeSampleModule.cpp (validateAddress 实现)"
bool NativeSampleModule::validateAddress(jsi::Runtime &rt, jsi::Object input) {
  std::string street = input.getProperty(rt, "street").asString(rt).utf8(rt);
  int32_t number = input.getProperty(rt, "num").asNumber();

  return !street.empty() && number > 0;
}
```

在实现中，代表 `Address` 的对象是一个 `jsi::Object`。要从该对象中提取值，我们需要使用 `JSI` 提供的访问器：

- `getProperty()` 按名称从对象检索属性。
- `asString()` 将属性转换为 `jsi::String`。
- `utf8()` 将 `jsi::String` 转换为 `std::string`。
- `asNumber()` 将属性转换为 `double`。

一旦我们手动解析了对象，就可以实现所需的逻辑。

:::note
如果您想了解更多关于 `JSI` 及其工作原理的信息，请查看 App.JS 2024 的这场 [精彩演讲](https://youtu.be/oLmGInjKU2U?feature=shared)
:::

### 4. 在应用中测试代码

要在应用中测试代码，我们必须修改 `App.tsx` 文件。

1. 打开 `App.tsx` 文件。删除 `App()` 函数的内容。
2. 将 `App()` 函数的主体替换为以下代码：

```tsx title="App.tsx (App function body replacement)"
const [street, setStreet] = useState('');
const [num, setNum] = useState('');
const [isValidAddress, setIsValidAddress] = useState<
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

您已成功桥接了第一个从 JS 到 C++ 的类型。