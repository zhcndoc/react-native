---
id: testing-overview
title: 测试
author: Vojtech Novak
authorURL: 'https://twitter.com/vonovak'
description: 本指南向 React Native 开发者介绍测试背后的关键概念、如何编写优秀的测试，以及你可以在工作流程中纳入哪些类型的测试。
---

随着代码库不断扩展，你意想不到的小错误和边缘情况可能会级联成更大的故障。Bug 会导致糟糕的用户体验，并最终造成业务损失。防止脆弱编程的一种方法，是在将代码发布到实际环境之前先对其进行测试。

在本指南中，我们将介绍多种自动化方式，以确保你的应用按预期运行，范围从静态分析到端到端测试。

<img src="/docs/assets/diagram_testing.svg" alt="测试是一个修复、测试，然后要么通过并发布，要么失败并回到测试中的循环。" />

## 为什么要测试

我们都是人，而人都会犯错。测试很重要，因为它能帮助你发现这些错误，并验证你的代码是否正常工作。也许更重要的是，随着你添加新功能、重构现有功能或升级项目的主要依赖项，测试还能确保你的代码在未来继续正常工作。

测试的价值比你想象的还要大。修复代码中一个 bug 的最佳方法之一，就是编写一个会失败的测试来暴露它。然后当你修复 bug 并重新运行测试时，如果测试通过，就意味着 bug 已被修复，并且不会再被重新引入代码库。

测试也可以作为团队中新成员的文档。对于从未见过某个代码库的人来说，阅读测试可以帮助他们理解现有代码是如何工作的。

最后但同样重要的是，更多的自动化测试意味着花在手动 <abbr title="Quality Assurance">QA</abbr> 上的时间更少，从而释放宝贵时间。

## 静态分析

提升代码质量的第一步是开始使用静态分析工具。静态分析会在你编写代码时检查其中的错误，但不会运行任何代码。

- **Lint 工具**会分析代码，以发现常见错误，例如未使用的代码，并帮助避免陷阱，同时标记风格指南中的禁忌，例如使用制表符而不是空格（或反之，取决于你的配置）。
- **类型检查**可确保你传递给函数的构造与该函数原本设计要接受的内容相匹配，例如防止把字符串传给一个期望数字的计数函数。

React Native 开箱即带有两个此类工具：[ESLint](https://eslint.org/) 用于 lint 检查，以及 [TypeScript](typescript) 用于类型检查。

## 编写可测试的代码

要开始写测试，你首先需要编写可测试的代码。设想一个飞机制造过程——在任何型号首次起飞、证明其所有复杂系统能够协同工作之前，独立部件都会经过测试，以确保它们安全且功能正确。例如，机翼会在极限载荷下进行弯折测试；发动机部件会测试其耐久性；挡风玻璃会测试模拟鸟击。

软件也是类似的。与其把整个程序写在一个包含大量代码行的巨大文件中，不如将代码写成多个小模块，这样你可以比测试整个组装体时更彻底地测试它们。这样一来，编写可测试的代码就与编写干净、模块化的代码密不可分。

要让你的应用更易于测试，首先应将应用中的视图部分——React 组件——与业务逻辑和应用状态分离（无论你使用的是 Redux、MobX 还是其他方案）。这样，你就可以让业务逻辑测试——它不应依赖 React 组件——独立于组件本身，而组件的主要职责是渲染应用的 UI！

理论上，你甚至可以把所有逻辑和数据获取都移出组件。这样你的组件就只负责渲染。你的状态将完全独立于组件。你的应用逻辑甚至可以在完全没有任何 React 组件的情况下工作！

:::tip
我们鼓励你在其他学习资源中进一步探索可测试代码这一主题。
:::

## 编写测试

在写完可测试的代码之后，就该编写真正的测试了！React Native 默认模板自带 [Jest](https://jestjs.io) 测试框架。它包含一个专为此环境定制的预设，因此你无需立刻调整配置和 mocks 就能开始高效工作——稍后会更多介绍 [mocks](#mocking)。你可以使用 Jest 编写本指南中涉及的所有类型的测试。

:::note
如果你采用测试驱动开发，你实际上是先写测试！这样一来，代码的可测试性就已经被考虑进去了。
:::

### 测试结构

你的测试应该简短，并且理想情况下只测试一件事。让我们从一个使用 Jest 编写的单元测试示例开始：

```js
it('given a date in the past, colorForDueDate() returns red', () => {
  expect(colorForDueDate('2000-10-20')).toBe('red');
});
```

这个测试由传给 [`it`](https://jestjs.io/docs/en/api#testname-fn-timeout) 函数的字符串来描述。请认真编写描述，使其清楚说明正在测试什么。尽量涵盖以下内容：

1. **Given** - 某个前置条件
2. **When** - 你正在测试的函数执行的某个动作
3. **Then** - 预期结果

这也被称为 AAA（Arrange, Act, Assert）。

Jest 提供了 [`describe`](https://jestjs.io/docs/en/api#describename-fn) 函数来帮助组织测试。使用 `describe` 将属于同一功能的所有测试分组在一起。如果需要，`describe` 还可以嵌套。你常用的其他函数有 [`beforeEach`](https://jestjs.io/docs/en/api#beforeeachfn-timeout) 或 [`beforeAll`](https://jestjs.io/docs/en/api#beforeallfn-timeout)，可用于设置你正在测试的对象。更多内容请阅读 [Jest API 参考](https://jestjs.io/docs/en/api)。

如果你的测试有很多步骤或很多断言，你大概应该把它拆分成多个更小的测试。另外，确保你的测试彼此完全独立。测试套件中的每个测试都必须能够独立执行，而无需先运行其他测试。反过来，如果你把所有测试一起运行，第一个测试也不能影响第二个测试的输出。

最后，作为开发者，我们喜欢代码运行良好且不会崩溃。但在测试中，情况常常正好相反。把失败的测试看作一件 _好事！_ 当测试失败时，通常意味着某些地方不对。这让你有机会在问题影响用户之前修复它。

## 单元测试

单元测试覆盖代码中最小的部分，例如单个函数或类。

当被测试对象存在任何依赖时，你通常需要将它们 mock 掉，如下一段所述。

单元测试的好处在于它们编写和运行都很快。因此，在你开发时，可以快速获得测试是否通过的反馈。Jest 甚至提供了一个选项，可以持续运行与你正在编辑的代码相关的测试：[Watch mode](https://jestjs.io/docs/en/cli#watch)。

<img src="/docs/assets/p_tests-unit.svg" alt=" " />

### Mocking

有时，当你测试的对象有外部依赖时，你会想要“mock 掉”它们。“Mocking”就是用你自己的实现替换代码中的某个依赖。

:::info
通常，在测试中使用真实对象比使用 mocks 更好，但有些情况下这是不可能的。例如：当你的 JS 单元测试依赖于用 Java 或 Objective-C 编写的原生模块时。
:::

设想你正在编写一个显示你所在城市当前天气的应用，并且你使用了某个外部服务或其他依赖来提供天气信息。如果该服务告诉你正在下雨，你就希望显示一张下雨云朵的图片。你不希望在测试中调用那个服务，因为：

- 它可能会让测试变慢且不稳定（因为涉及网络请求）
- 该服务每次运行测试时都可能返回不同的数据
- 当你真的需要运行测试时，第三方服务可能会离线！

因此，你可以提供该服务的 mock 实现，实际上相当于用几千行代码和一些联网温度计来替换它！

:::note
Jest 从函数级别一直到模块级别都支持 [mocking](https://jestjs.io/docs/en/mock-functions#mocking-modules)。
:::

## 集成测试

在编写更大型的软件系统时，其中的各个部分需要彼此交互。在单元测试中，如果你的单元依赖另一个单元，你有时会把该依赖 mock 掉，用一个假的替代它。

在集成测试中，真实的独立单元会被组合在一起（就像在你的应用中一样）并一起测试，以确保它们的协作按预期工作。这并不是说这里不会使用 mock：你仍然需要 mocks（例如，mock 与天气服务的通信），但与单元测试相比，你需要它们的频率要低得多。

:::info
请注意，关于“集成测试”具体指什么的术语并不总是一致。此外，单元测试和集成测试之间的界限也未必总是清晰的。对于本指南来说，如果你的测试满足以下任一条件，就属于“集成测试”：

- 按上述方式组合了应用的多个模块
- 使用了外部系统
- 向其他应用发起网络请求（例如天气服务 API）
- 进行了任何类型的文件或数据库 <abbr title="Input/Output">I/O</abbr>
  :::

<img src="/docs/assets/p_tests-integration.svg" alt=" " />

## 组件测试

React 组件负责渲染你的应用，而用户会直接与其输出交互。即使你的应用业务逻辑测试覆盖率很高且正确，如果没有组件测试，你仍然可能向用户交付一个有问题的 UI。组件测试既可能属于单元测试，也可能属于集成测试，但由于它们是 React Native 的核心部分之一，我们会单独介绍。

对于测试 React 组件，你可能想测试两件事：

- 交互：确保组件在用户交互时行为正确（例如，用户按下按钮时）
- 渲染：确保 React 使用的组件渲染输出是正确的（例如，按钮在 UI 中的外观和位置）

例如，如果你有一个带有 `onPress` 监听器的按钮，你会希望测试该按钮是否正确显示，以及点击按钮是否被组件正确处理。

有几种库可以帮助你测试这些内容：

- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/) 构建于 React 的 test renderer 之上，并添加了下一段所述的 `fireEvent` 和 `query` API。
- [已弃用] React 的 [Test Renderer](https://react.dev/blog/2024/04/25/react-19-upgrade-guide#deprecated-react-test-renderer)，与其核心一起开发，提供了一个 React renderer，可用于将 React 组件渲染为纯 JavaScript 对象，而不依赖 DOM 或原生移动环境。

:::warning
组件测试只是运行在 Node.js 环境中的 JavaScript 测试。它们不会考虑支撑 React Native 组件的任何 iOS、Android 或其他平台代码。因此，它们无法让你 100% 确认一切对用户都正常工作。如果 iOS 或 Android 代码中存在 bug，它们不会发现。
:::

<img src="/docs/assets/p_tests-component.svg" alt=" " />

### 测试用户交互

除了渲染一些 UI 之外，你的组件还会处理诸如 `TextInput` 的 `onChangeText` 或 `Button` 的 `onPress` 之类的事件。它们还可能包含其他函数和事件回调。请考虑以下示例：

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
        placeholder="输入杂货条目"
        onChangeText={text => setGroceryItem(text)}
      />
      <Button
        title="将条目添加到列表"
        onPress={addNewItemToShoppingList}
      />
      {items.map(item => (
        <Text key={item}>{item}</Text>
      ))}
    </>
  );
}
```

在测试用户交互时，请从用户的角度测试组件——页面上有什么？交互后会发生什么变化？

通常来说，优先使用用户能看到或听到的内容：

- 使用渲染后的文本或 [可访问性辅助功能](https://reactnative.dev/docs/accessibility#accessibility-properties) 来编写断言

相反，你应该避免：

- 对组件 props 或 state 进行断言
- testID 查询

避免测试实现细节，比如 props 或 state——虽然这样的测试能工作，但它们并不面向用户如何与组件交互的方式，而且往往在重构时容易失效（例如当你想重命名某些内容，或者用 hooks 重写类组件时）。

:::info
React 类组件尤其容易测试其实现细节，例如内部状态、props 或事件处理器。为了避免测试实现细节，优先使用带 Hooks 的函数组件，这会让依赖组件内部实现变得 _更难_。
:::

像 [React Native Testing Library](https://callstack.github.io/react-native-testing-library/) 这样的组件测试库，通过精心选择所提供的 API，促进编写以用户为中心的测试。下面的示例使用了 `fireEvent` 的 `changeText` 和 `press` 方法，模拟用户与组件交互，并使用查询函数 `getAllByText` 来查找渲染输出中匹配的 `Text` 节点。

```tsx
test('given empty GroceryShoppingList, user can add an item to it', () => {
  const {getByPlaceholderText, getByText, getAllByText} = render(
    <GroceryShoppingList />,
  );

  fireEvent.changeText(
    getByPlaceholderText('输入杂货条目'),
    'banana',
  );
  fireEvent.press(getByText('将条目添加到列表'));

  const bananaElements = getAllByText('banana');
  expect(bananaElements).toHaveLength(1); // 期望列表中有 'banana'
});
```

这个示例测试的不是调用某个函数时状态如何变化。它测试的是当用户在 `TextInput` 中更改文本并按下 `Button` 时会发生什么！

### 测试渲染输出

[快照测试](https://jestjs.io/docs/en/snapshot-testing) 是 Jest 支持的一种高级测试方式。它是一个非常强大且底层的工具，因此使用时要格外注意。

“组件快照”是由 Jest 内置的自定义 React 序列化器创建的类 JSX 字符串。这个序列化器让 Jest 可以将 React 组件树转换为人类可读的字符串。换句话说：组件快照是组件渲染输出在测试运行期间 _生成_ 的文本表示。它可能看起来像这样：

```tsx
<Text
  style={
    Object {
      "fontSize": 20,
      "textAlign": "center",
    }
  }>
  欢迎来到 React Native！
</Text>
```

使用快照测试时，你通常先实现组件，然后运行快照测试。快照测试随后会创建一个快照，并将其保存到仓库中的一个文件里，作为参考快照。**然后该文件会被提交，并在代码审查期间检查**。组件渲染输出的任何未来变化都会改变其快照，从而导致测试失败。随后你需要更新存储的参考快照，测试才能通过。这个变更同样需要被提交和审查。

快照有几个弱点：

- 对于开发者或审阅者来说，很难判断快照中的变化是预期内的，还是 bug 的证据。尤其是大型快照，很快会变得难以理解，其附加价值也会变低。
- 当快照创建时，在那一刻它会被视为正确——即使渲染输出实际上是错误的。
- 当快照失败时，很容易想直接使用 `--updateSnapshot` jest 选项来更新它，而不认真调查该变化是否符合预期。因此，需要一定的开发纪律。

快照本身并不能保证你的组件渲染逻辑正确；它们主要擅长防止意外变化，并检查被测 React 树中的组件是否收到了预期的 props（样式等）。

我们建议你只使用小快照（参见 [`no-large-snapshots` 规则](https://github.com/jest-community/eslint-plugin-jest/blob/main/docs/rules/no-large-snapshots.md)）。如果你想测试两个 React 组件状态之间的 _变化_，请使用 [`snapshot-diff`](https://github.com/jest-community/snapshot-diff)。如有疑问，请优先采用上一段所述的显式断言。

<img src="/docs/assets/p_tests-snapshot.svg" alt=" " />

## 端到端测试

在端到端（E2E）测试中，你从用户的角度验证应用在设备（或模拟器/仿真器）上是否按预期运行。

这通常通过以发布配置构建应用并对其运行测试来完成。在 E2E 测试中，你不再考虑 React 组件、React Native API、Redux store 或任何业务逻辑。那不是 E2E 测试的目的，而且在 E2E 测试期间这些内容甚至都无法供你直接访问。

相反，E2E 测试库允许你查找并控制应用屏幕上的元素：例如，你可以像真实用户一样 _真正地_ 点击按钮，或向 `TextInput` 中输入文本。然后你可以断言应用屏幕上是否存在某个元素、它是否可见、其中包含什么文本，等等。

E2E 测试能为你的应用某个部分正在正常工作提供最高程度的信心。其代价包括：

- 与其他类型的测试相比，编写起来更耗时
- 运行速度更慢
- 更容易出现不稳定性（“flaky” 测试是指在代码没有任何变化的情况下随机通过或失败的测试）

尽量使用 E2E 测试覆盖应用的关键部分：认证流程、核心功能、支付等。对非关键部分使用更快的 JS 测试。你添加的测试越多，信心就越高，但你花在维护和运行它们上的时间也会越多。请权衡这些取舍并决定什么最适合你。

目前有若干 E2E 测试工具可用：在 React Native 社区中，[Detox](https://github.com/wix/detox/) 是一个流行的框架，因为它专为 React Native 应用量身定制。iOS 和 Android 应用领域另一个流行的库是 [Appium](https://appium.io/) 或 [Maestro](https://maestro.mobile.dev/)。

<img src="/docs/assets/p_tests-e2e.svg" alt=" " />

## 总结

希望你喜欢这篇指南，并有所收获。测试应用的方法有很多种。起初，决定使用哪一种可能会很难。不过，我们相信一旦你开始为你出色的 React Native 应用添加测试，一切都会变得清晰。那么你还在等什么？把你的覆盖率提上去吧！

### 链接

- [React testing overview](https://react.dev/reference/react/act)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Jest docs](https://jestjs.io/docs/en/tutorial-react-native)
- [Detox](https://github.com/wix/detox/)
- [Appium](https://appium.io/)
- [Maestro](https://maestro.mobile.dev/)

---

_本指南最初由 [Vojtech Novak](https://twitter.com/vonovak) 全文撰写并贡献。_