---
id: testing-overview
title: 测试
author: Vojtech Novak
authorURL: 'https://twitter.com/vonovak'
description: 本指南向 React Native 开发者介绍测试背后的关键概念、如何编写优秀的测试，以及可以纳入工作流中的测试类型
---

随着代码库不断扩展，你未曾预料到的小错误和边界情况可能会逐渐导致更大的故障。Bug 会带来糟糕的用户体验，并最终造成业务损失。防止脆弱编程的一种方法，就是在将代码发布到真实环境之前对其进行测试。

在本指南中，我们将介绍不同的自动化方式，以确保你的应用按预期工作，范围从静态分析到端到端测试。

<img src="/docs/assets/diagram_testing.svg" alt="测试是一个循环：修复、测试，然后要么通过并发布，要么失败并返回测试阶段" />

## 为什么要测试

我们是人类，而人类会犯错。测试很重要，因为它能帮助你发现这些错误，并验证代码是否正常工作。也许更重要的是，当你添加新功能、重构现有功能或升级项目的主要依赖项时，测试可以确保代码在未来仍然正常工作。

测试的价值可能超出你的想象。修复代码中 Bug 的最佳方式之一，就是编写一个能够暴露该 Bug 的失败测试。然后，当你修复 Bug 并重新运行测试时，如果测试通过，就意味着 Bug 已经修复，并且不会再次被引入代码库。

测试也可以作为新加入团队成员的文档。对于以前从未见过该代码库的人来说，阅读测试可以帮助他们理解现有代码的工作方式。

最后但同样重要的是，更多的自动化测试意味着花在手动 <abbr title="质量保证">QA</abbr> 上的时间更少，从而释放宝贵的时间。

## 静态分析

提高代码质量的第一步，是开始使用静态分析工具。静态分析会在你编写代码时检查其中的错误，但不会运行这些代码。

- **代码检查器** 会分析代码，以捕获未使用的代码等常见错误并帮助避免陷阱，还会标记诸如使用制表符而不是空格（或反之，具体取决于你的配置）这类违反样式指南的行为
- **类型检查** 确保你传递给函数的构造符合该函数设计时所接受的类型，例如，防止将字符串传递给需要数字的计数函数

React Native 开箱即用地配置了两个这样的工具：[ESLint](https://eslint.org/) 用于代码检查，[TypeScript](typescript) 用于类型检查。

## 编写可测试的代码

要开始测试，你首先需要编写可测试的代码。想想飞机制造过程——在任何型号的飞机首次起飞、展示其所有复杂系统能够良好协同工作之前，都会对各个部件进行测试，以确保它们安全且运行正常。例如，机翼会通过在极端负载下弯曲来进行测试；发动机部件会测试其耐久性；挡风玻璃会通过模拟鸟类撞击进行测试。

软件也是类似的。你不会把整个程序写在一个包含大量代码行的巨大文件中，而是会将代码写入多个小型模块中，这样相比测试组装完成的整体，可以对它们进行更全面的测试。通过这种方式，编写可测试的代码与编写简洁、模块化的代码密不可分。

为了让你的应用更易于测试，首先要将应用的视图部分——即 React 组件——与业务逻辑和应用状态分离（无论你使用 Redux、MobX 还是其他解决方案）。这样一来，你就可以让业务逻辑测试独立于组件本身，而业务逻辑测试不应该依赖 React 组件；组件的主要职责则是渲染应用的 UI！

理论上，你甚至可以将所有逻辑和数据获取都移出组件。这样，你的组件就只负责渲染。状态将完全独立于组件。即使完全没有任何 React 组件，你的应用逻辑也可以运行！

:::tip
我们鼓励你通过其他学习资源进一步探索可测试代码这一主题
:::

## 编写测试

编写好可测试的代码后，就该编写一些真正的测试了！React Native 的默认模板附带 [Jest](https://jestjs.io) 测试框架。它包含针对该环境定制的预设，因此你无需立即调整配置和模拟对象就能开始高效工作——稍后会介绍[更多关于模拟对象的内容](#mocking)。你可以使用 Jest 编写本指南中介绍的所有类型的测试。

:::note
如果你采用测试驱动开发，实际上会先编写测试！这样一来，代码的可测试性就有了保障
:::

### 组织测试

你的测试应该简短，理想情况下每个测试只测试一件事。先来看一个使用 Jest 编写的单元测试示例：

```js
it('given a date in the past, colorForDueDate() returns red', () => {
  expect(colorForDueDate('2000-10-20')).toBe('red');
});
```

测试由传递给 [`it`](https://jestjs.io/docs/en/api#testname-fn-timeout) 函数的字符串描述。请认真编写描述，确保能清楚地说明测试的内容。尽力覆盖以下内容：

1. **给定** —— 某个前置条件
2. **当** —— 被测试函数执行了某个操作
3. **那么** —— 预期结果

这也称为 AAA（Arrange、Act、Assert）。

Jest 提供了 [`describe`](https://jestjs.io/docs/en/api#describename-fn) 函数来帮助组织测试。使用 `describe` 将属于同一功能的所有测试分组。如果有需要，可以嵌套使用 `describe`。你还会经常使用 [`beforeEach`](https://jestjs.io/docs/en/api#beforeeachfn-timeout) 或 [`beforeAll`](https://jestjs.io/docs/en/api#beforeallfn-timeout)，以便设置要测试的对象。更多信息请阅读 [Jest API 参考](https://jestjs.io/docs/en/api)。

如果你的测试包含许多步骤或许多预期结果，那么你可能需要将其拆分成多个更小的测试。此外，还要确保测试彼此完全独立。测试套件中的每个测试都必须能够单独执行，而无需先运行其他测试。反过来说，当你一起运行所有测试时，第一个测试也不能影响第二个测试的输出。

最后，作为开发者，我们喜欢代码运行良好且不会崩溃。但对于测试来说，情况通常恰恰相反。把失败的测试看作一件*好事！*当测试失败时，通常意味着某些地方不正确。这让你有机会在问题影响用户之前将其修复。

## 单元测试

单元测试覆盖代码中最小的部分，例如单个函数或类。

当被测试的对象存在依赖项时，你通常需要将它们模拟出来，下一段会对此进行介绍。

单元测试的优点在于编写和运行都很快。因此，在工作过程中，你可以快速获知测试是否通过。Jest 甚至提供了持续运行与你正在编辑的代码相关测试的选项：[监视模式](https://jestjs.io/docs/en/cli#watch)。

<img src="/docs/assets/p_tests-unit.svg" alt=" " />

### 模拟

有时，当被测试的对象具有外部依赖项时，你会希望“将它们模拟出来”。“模拟”是指使用你自己的实现替换代码中的某个依赖项。

:::info
通常，在测试中使用真实对象比使用模拟对象更好，但在某些情况下这是不可能的。例如：当你的 JS 单元测试依赖于使用 Java 或 Objective-C 编写的原生模块时
:::

假设你正在编写一个显示所在城市当前天气的应用，并且使用某个外部服务或其他依赖项为你提供天气信息。如果该服务告诉你正在下雨，你就希望显示一张带有雨云的图片。你不希望在测试中调用该服务，因为：

- 它可能会使测试变慢且不稳定（因为涉及网络请求）
- 该服务每次运行测试时都可能返回不同的数据
- 第三方服务可能会在你真正需要运行测试时离线！

因此，你可以为该服务提供一个模拟实现，从而有效替代数千行代码和一些连接互联网的温度计！

:::note
Jest 提供了从函数级别到模块级别的[模拟支持](https://jestjs.io/docs/en/mock-functions#mocking-modules)
:::

## 集成测试

在编写较大的软件系统时，其中的各个部分需要相互交互。在单元测试中，如果某个单元依赖于另一个单元，你有时会最终模拟该依赖项，用一个伪造的依赖项替代它。

在集成测试中，会将真实的独立单元组合起来（与你的应用中相同），并一起进行测试，以确保它们能够按预期协同工作。这并不是说这里不会进行模拟：你仍然需要模拟对象（例如，模拟与天气服务的通信），但与单元测试相比，你对它们的需求会少得多。

:::info
请注意，关于集成测试含义的术语并不总是一致。此外，单元测试与集成测试之间的界限也不总是清晰。对于本指南，如果你的测试符合以下任一条件，就属于“集成测试”：

- 组合了如上所述的应用中的多个模块
- 使用了外部系统
- 向其他应用发起网络调用（例如天气服务 API）
- 执行了任何形式的文件或数据库 <abbr title="输入/输出">I/O</abbr>
  :::

<img src="/docs/assets/p_tests-integration.svg" alt=" " />

## 组件测试

React 组件负责渲染你的应用，用户会直接与其输出进行交互。即使你的应用业务逻辑具有很高的测试覆盖率且运行正确，如果没有组件测试，你仍然可能将损坏的 UI 交付给用户。组件测试可能同时属于单元测试和集成测试，但由于它们是 React Native 的核心部分，我们将单独介绍它们。

在测试 React 组件时，你可能需要测试以下两点：

- 交互：确保用户与组件交互时，组件的行为正确（例如，用户按下按钮时）
- 渲染：确保 React 使用的组件渲染输出正确（例如，按钮在 UI 中的外观和位置）

例如，如果你有一个带有 `onPress` 监听器的按钮，就需要测试按钮是否正确显示，以及组件是否正确处理按钮点击。

有多个库可以帮助你进行这些测试：

- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/) 构建于 React 的测试渲染器之上，并添加了下一段中介绍的 `fireEvent` 和 `query` API
- [已弃用] React 的 [Test Renderer](https://react.dev/blog/2024/04/25/react-19-upgrade-guide#deprecated-react-test-renderer) 与其核心功能一同开发，提供了一个可用于将 React 组件渲染为纯 JavaScript 对象的 React 渲染器，而不依赖 DOM 或原生移动环境

:::warning
组件测试只是运行在 Node.js 环境中的 JavaScript 测试。它们*不会*考虑支撑 React Native 组件的任何 iOS、Android 或其他平台代码。因此，它们无法让你百分之百确信一切对用户都能正常工作。如果 iOS 或 Android 代码中存在 Bug，它们将无法发现
:::

<img src="/docs/assets/p_tests-component.svg" alt=" " />

### 测试用户交互

除了渲染一些 UI 外，你的组件还会处理诸如 `TextInput` 的 `onChangeText` 或 `Button` 的 `onPress` 等事件。它们还可能包含其他函数和事件回调。请考虑以下示例：

```tsx
function GroceryShoppingList() {
  const [groceryItem, setGroceryItem] = useState('');
  const [items, setItems] = useState<string[]>([]);

  const addNewItemToShoppingList = useCallback(() => {
    setItems([groceryItem, ...items]);
    setGroceryItem('');
  }, [groceryItem, items]);

  return (
    <>
      <TextInput
        value={groceryItem}
        placeholder="Enter grocery item"
        onChangeText={text => setGroceryItem(text)}
      />
      <Button
        title="Add the item to list"
        onPress={addNewItemToShoppingList}
      />
      {items.map(item => (
        <Text key={item}>{item}</Text>
      ))}
    </>
  );
}
```

测试用户交互时，要从用户视角测试组件——页面上有什么？交互后发生了什么变化？

根据经验，优先使用用户可以看到或听到的内容：

- 使用渲染的文本或[辅助功能辅助工具](https://reactnative.dev/docs/accessibility#accessibility-properties)进行断言

相反，你应该避免：

- 对组件 props 或 state 进行断言
- 使用 testID 查询

避免测试 props 或 state 等实现细节——虽然这类测试可以运行，但它们并不关注用户将如何与组件交互，并且往往会因重构而失效（例如，当你想重命名某些内容，或使用 Hooks 重写类组件时）。

:::info
React 类组件尤其容易让人测试其实现细节，例如内部 state、props 或事件处理器。为了避免测试实现细节，最好使用带有 Hooks 的函数组件，因为它们让依赖组件内部实现变得*更加困难*
:::

[React Native Testing Library](https://callstack.github.io/react-native-testing-library/) 等组件测试库通过谨慎选择所提供的 API，帮助编写以用户为中心的测试。下面的示例使用 `fireEvent` 的 `changeText` 和 `press` 方法来模拟用户与组件的交互，并使用查询函数 `getAllByText` 查找渲染输出中匹配的 `Text` 节点。

```tsx
test('given empty GroceryShoppingList, user can add an item to it', () => {
  const {getByPlaceholderText, getByText, getAllByText} = render(
    <GroceryShoppingList />,
  );

  fireEvent.changeText(
    getByPlaceholderText('Enter grocery item'),
    'banana',
  );
  fireEvent.press(getByText('Add the item to list'));

  const bananaElements = getAllByText('banana');
  expect(bananaElements).toHaveLength(1); // expect 'banana' to be on the list
});
```

这个示例并不是在测试调用函数时某个 state 如何变化，而是在测试用户更改 `TextInput` 中的文本并按下 `Button` 时会发生什么！

### 测试渲染输出

[快照测试](https://jestjs.io/docs/en/snapshot-testing) 是 Jest 支持的一种高级测试类型。它是一个非常强大且底层的工具，因此使用时需要格外谨慎。

“组件快照”是由 Jest 内置的自定义 React 序列化器创建的、类似 JSX 的字符串。该序列化器让 Jest 能够将 React 组件树转换为人类可读的字符串。换句话说，组件快照是测试运行期间*生成*的组件渲染输出的文本表示。它可能如下所示：

```tsx
<Text
  style={
    Object {
      "fontSize": 20,
      "textAlign": "center",
    }
  }>
  Welcome to React Native!
</Text>
```

使用快照测试时，通常会先实现组件，然后运行快照测试。快照测试随后会创建快照，并将其保存到代码库中的文件里，作为参考快照。**该文件随后会被提交，并在代码审查期间进行检查**。组件渲染输出的任何未来更改都会改变其快照，从而导致测试失败。此时你需要更新存储的参考快照，测试才能通过。这个更改同样需要提交并进行审查。

快照存在几个缺点：

- 对于开发者或审查者来说，很难判断快照中的更改是有意的，还是 Bug 的证据。尤其是大型快照很快就会变得难以理解，其附加价值也会降低
- 快照创建时，它会被视为正确的——即使渲染输出实际上是错误的
- 快照失败时，人们很容易使用 `--updateSnapshot` jest 选项更新快照，而不认真调查该更改是否符合预期。因此需要开发者具备一定的自律性

快照本身无法确保组件渲染逻辑正确，它们只是擅长防止意外更改，以及检查被测 React 树中的组件是否接收到了预期的 props（样式等）。

我们建议你只使用小型快照（请参阅 [`no-large-snapshots` 规则](https://github.com/jest-community/eslint-plugin-jest/blob/main/docs/rules/no-large-snapshots.md)）。如果你想测试两个 React 组件状态之间的*变化*，请使用 [`snapshot-diff`](https://github.com/jest-community/snapshot-diff)。如有疑问，优先使用上一段所述的明确预期。

<img src="/docs/assets/p_tests-snapshot.svg" alt=" " />

## 端到端测试

在端到端（E2E）测试中，你会从用户视角验证应用在设备（或模拟器／仿真器）上是否按预期工作。

具体做法是使用发布配置构建应用，并针对该应用运行测试。在 E2E 测试中，你不再考虑 React 组件、React Native API、Redux 存储或任何业务逻辑。这不是 E2E 测试的目的，而且在 E2E 测试期间你甚至无法访问这些内容。

相反，E2E 测试库允许你查找并控制应用屏幕上的元素：例如，你可以像真实用户一样*实际*点击按钮，或在 `TextInput` 中输入文本。然后，你可以断言应用屏幕中是否存在某个元素、该元素是否可见、其中包含什么文本，等等。

E2E 测试让你最大程度确信应用的某一部分能够正常工作。其代价包括：

- 编写它们比其他类型的测试更耗时
- 运行速度更慢
- 更容易出现不稳定性（“不稳定”测试是指在代码没有任何更改的情况下随机通过和失败的测试）

尝试使用 E2E 测试覆盖应用的重要部分：身份验证流程、核心功能、支付等。对于应用中不重要的部分，使用更快的 JS 测试。添加的测试越多，你的信心就越高，但维护和运行测试所花费的时间也越多。考虑这些取舍，并决定什么最适合你。

目前有多种 E2E 测试工具可用：在 React Native 社区中，[Detox](https://github.com/wix/detox/) 是一个很受欢迎的框架，因为它专为 React Native 应用定制。iOS 和 Android 应用领域的另一个热门库是 [Appium](https://appium.io/) 或 [Maestro](https://maestro.mobile.dev/)。

<img src="/docs/assets/p_tests-e2e.svg" alt=" " />

## 总结

希望你喜欢阅读本指南，并从中有所收获。测试应用有很多方法。刚开始时，可能很难决定使用哪种方法。不过，我们相信，一旦你开始为出色的 React Native 应用添加测试，一切都会变得清晰。那么你还在等什么？提高你的覆盖率吧！

### 链接

- [React 测试概览](https://react.dev/reference/react/act)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Jest 文档](https://jestjs.io/docs/en/tutorial-react-native)
- [Detox](https://github.com/wix/detox/)
- [Appium](https://appium.io/)
- [Maestro](https://maestro.mobile.dev/)

---

_本指南最初由 [Vojtech Novak](https://twitter.com/vonovak) 完整撰写并贡献。_
