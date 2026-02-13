import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

# 高级技巧：自定义 C++ 类型

:::note
本指南假设你已经熟悉了 [**纯 C++ Turbo Native 模块**](pure-cxx-modules.md) 指南。本教程将在其基础上进行扩展。
:::

C++ Turbo Native 模块支持绝大多数 `std::` 标准类型的[桥接功能](https://github.com/facebook/react-native/tree/main/packages/react-native/ReactCommon/react/bridging)。你可以在模块中直接使用这些类型，无需额外编码。

如果你想在应用或库中新增支持自定义类型，你需要提供相应的 `bridging` 头文件。

## 添加新的自定义类型：Int64

C++ Turbo Native 模块尚不支持 `int64_t` 类型——因为 JavaScript 不支持大于 2^53 的数字。若需表示大于 2^53 的数字，我们可以在 JS 中使用 `string` 类型，并自动转换为 C++ 中的 `int64_t`。

### 1. 创建 Bridging 头文件

支持新自定义类型的第一步是定义 bridging 头文件，负责完成 JS 表示与 C++ 表示之间的相互转换。

1. 在 `shared` 文件夹内，新增文件 `Int64.h`
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
        throw std::invalid_argument("Invalid number"); // 不支持含字母数字的字符串
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

该桥接头文件的关键组成：

- 针对自定义类型显式特化 `Bridging` 结构体，本例中指定为 `int64_t`
- 一个 `fromJs` 函数将 JS 表示转换成 C++ 类型
- 一个 `toJs` 函数将 C++ 类型转换成 JS 表示

:::note
在 iOS 平台，记得将 `Int64.h` 文件添加到 Xcode 项目中。
:::

### 2. 修改 JS 规范

接下来，修改 JS 规范以新增使用该类型的方法。你可以使用 Flow 或 TypeScript 来编写规范。

1. 打开 `specs/NativeSampleTurbomodule`
2. 修改规范如下：

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

以上文件中，我们定义了需要在 C++ 中实现的函数。

### 3. 实现 Native 代码

现在，需实现 JS 规范中声明的函数。

1. 打开 `specs/NativeSampleModule.h` 并按以下修改：

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

2. 打开 `specs/NativeSampleModule.cpp` 并实现新函数：

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

实现中引入了 C++ `<cmath>` 库完成数学计算，并用其 `cbrt` 函数实现 `cubicRoot`。

### 4. 在 App 中测试代码

接下来在应用中测试此代码。

首先，更新 `App.tsx` 以调用 TurboModule 新方法。然后构建 Android 和 iOS 应用。

1. 打开 `App.tsx`，按以下变更：

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

2. 在项目根目录运行 `yarn android` 以测试 Android 端。
3. 在项目根目录运行 `yarn ios` 以测试 iOS 端。

## 添加新的结构化自定义类型：Address

上述方法可推广到任意类型。对于结构化类型，React Native 提供了方便的辅助函数，便于在 JS 与 C++ 间桥接。

假设我们想桥接如下自定义 `Address` 类型，包含以下属性：

```ts
interface Address {
  street: string;
  num: number;
  isInUS: boolean;
}
```

### 1. 在规格中定义类型

首先在 JS specs 中定义新类型，以便 Codegen 生成支持代码，无须手写。

1. 打开 `specs/NativeSampleModule` 文件，添加如下变更：

<Tabs groupId="custom-int64" queryString defaultValue={constants.defaultJavaScriptSpecLanguages} values={constants.javaScriptSpecLanguages}>
<TabItem value="typescript">

```diff title="NativeSampleModule (新增 Address 类型和 validateAddress 函数)"
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

```diff title="NativeSampleModule (新增 Address 类型和 validateAddress 函数)"

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

该代码定义了新的 `Address` 类型，并新增了 Turbo Native Module 函数 `validateAddress`。注意该函数参数是 `Address` 对象。

函数同样支持返回自定义类型。

### 2. 定义桥接代码

根据 specs 中的 `Address`，Codegen 会自动生成两个辅助类型：`NativeSampleModuleAddress` 和 `NativeSampleModuleAddressBridging`。

- `NativeSampleModuleAddress` 定义了 `Address` 结构。
- `NativeSampleModuleAddressBridging` 提供了 JS 与 C++ 间的桥接基础设施。

我们的额外任务是定义 `Bridging` 结构体，继承自动生成的桥接类型。

1. 打开 `shared/NativeSampleModule.h`
2. 添加如下代码：

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

此处定义了 `Address` 类型别名，指定了泛型参数的顺序——顺序很重要，第一模板参数对应结构体的第一个字段类型，依次类推。

然后定义了 `Address` 类型的 `Bridging` 特化，继承 Codegen 生成的基础桥接类型。

:::note
生成此类类型遵循如下约定：

- 名称第一部分为模块名，本例中是 `NativeSampleModule`
- 第二部分为 JS 规格中定义的类型名，本例是 `Address`
:::

### 3. 实现 Native 代码

接下来实现 C++ 中的 `validateAddress` 函数。先在 `.h` 文件中声明，然后在 `.cpp` 中实现。

1. 打开 `shared/NativeSampleModule.h`，添加函数声明：

```diff title="NativeSampleModule.h (validateAddress 函数声明)"
  std::string reverseString(jsi::Runtime& rt, std::string input);

+  bool validateAddress(jsi::Runtime &rt, jsi::Object input);
};

} // namespace facebook::react
```

2. 打开 `shared/NativeSampleModule.cpp`，添加函数实现：

```cpp title="NativeSampleModule.cpp (validateAddress 实现)"
bool NativeSampleModule::validateAddress(jsi::Runtime &rt, jsi::Object input) {
  std::string street = input.getProperty(rt, "street").asString(rt).utf8(rt);
  int32_t number = input.getProperty(rt, "num").asNumber();

  return !street.empty() && number > 0;
}
```

实现里，`Address` 对应一个 `jsi::Object`。需要用 JSI 提供的访问器按字段读取数据：

- `getProperty()`：根据属性名查找对象属性
- `asString()`：属性转换为 `jsi::String`
- `utf8()`：`jsi::String` 转换为 `std::string`
- `asNumber()`：属性转换为 `double` （此处隐式转换成 `int32_t`）

解析出字段后，即可实现逻辑。

:::note
若想深入了解 `JSI` 的工作原理，可观看这场 [精彩分享](https://youtu.be/oLmGInjKU2U?feature=shared)，是在 App.JS 2024 上的演讲。
:::

### 4. 在应用中测试代码

需要修改 `App.tsx` 来测试。

1. 打开 `App.tsx`，清空 `App()` 函数内容。
2. 用以下代码替换 `App()` 函数主体：

```tsx title="App.tsx (替换 App 函数体)"
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

你已成功实现了 JS 与 C++ 类型的桥接。