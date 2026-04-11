---
id: testing-overview
title: 测试
author: Vojtech Novak
authorURL: 'https://twitter.com/vonovak'
description: 本指南向 React Native 开发者介绍测试背后的关键概念、如何编写良好的测试，以及可以将哪些类型的测试纳入工作流。
---

随着代码库的扩展，你不期望的小错误和边缘情况可能会级联成更大的故障。Bug 会导致糟糕的用户体验，并最终导致业务损失。防止脆弱编程的一种方法是在将代码发布到野外之前对其进行测试。

在本指南中，我们将介绍不同的自动化方法以确保你的应用按预期工作，范围从静态分析到端到端测试。

<img src="/docs/assets/diagram_testing.svg" alt="测试是一个修复、测试的循环，要么通过发布，要么失败返回测试。" />

## 为什么要测试

我们是人类，而人类会犯错。测试很重要，因为它可以帮助你发现这些错误并验证你的代码是否正常工作。也许更重要的是，测试确保你的代码在未来当你添加新功能、重构现有功能或升级项目的主要依赖项时继续工作。

测试的价值比你意识到的要多。修复代码中 Bug 的最佳方法之一是编写一个暴露它的失败测试。然后当你修复了 Bug 并重新运行测试时，如果它通过了，意味着 Bug 已修复，永远不会重新引入到代码库中。

测试还可以作为新加入团队的成员的文档。对于从未见过代码库的人来说，阅读测试可以帮助他们理解现有代码的工作原理。

最后但同样重要的是，更多的自动化测试意味着花费在手动 <abbr title="质量保证">QA</abbr> 上的时间更少，从而腾出宝贵的时间。

## 静态分析

提高代码质量的第一步是开始使用静态分析工具。静态分析在你编写代码时检查错误，但不需要运行任何代码。

- **Linters** 分析代码以捕获常见错误，例如未使用的代码，并帮助避免陷阱，标记风格指南中的禁忌，例如使用制表符而不是空格（或反之，取决于你的配置）。
- **类型检查** 确保你传递给函数的构造与函数设计接受的内容匹配，例如防止将字符串传递给期望数字的计数函数。

React Native 开箱即用地配置了两个这样的工具：[ESLint](https://eslint.org/) 用于 lint 检查，[TypeScript](typescript) 用于类型检查。

## 编写可测试的代码

要开始测试，你首先需要编写可测试的代码。考虑飞机制造过程——在任何模型首次起飞展示其所有复杂系统良好协作之前，各个部件都经过测试以保证它们安全且功能正确。例如，机翼通过在极端负载下弯曲进行测试；发动机部件测试其耐用性；挡风玻璃针对模拟鸟类撞击进行测试。

软件是相似的。你不是将整个程序写在一个包含许多行代码的巨大文件中，而是将代码写在多个小模块中，你可以比测试组装好的整体更彻底地测试这些模块。这样，编写可测试的代码与编写干净、模块化的代码交织在一起。

为了使你的应用更易于测试，首先将应用的视图部分（你的 React 组件）与业务逻辑和应用状态分离（无论你是否使用 Redux、MobX 或其他解决方案）。这样，你可以保持业务逻辑测试（不应依赖你的 React 组件）独立于组件本身，组件的主要工作是渲染应用的 UI！

理论上，你可以更进一步，将所有逻辑和数据获取移出组件。这样你的组件将专门致力于渲染。你的状态将完全独立于你的组件。你的应用逻辑将在没有任何 React 组件的情况下工作！

> 我们鼓励你在其他学习资源中进一步探索可测试代码的主题。

## 编写测试

编写了可测试的代码后，是时候编写一些实际的测试了！React Native 的默认模板附带了 [Jest](https://jestjs.io) 测试框架。它包含一个针对此环境定制的预设，因此你可以立即开始工作而无需调整配置和模拟——稍后会有[更多关于模拟](#mocking) 的内容。你可以使用 Jest 编写本指南中介绍的所有类型的测试。

> 如果你进行测试驱动开发，你实际上会先编写测试！这样，代码的可测试性就得到了保证。

### 构建测试结构

你的测试应该简短，并且理想情况下只测试一件事。让我们从一个用 Jest 编写的单元测试示例开始：

```js
it('given a date in the past, colorForDueDate() returns red', () => {
  expect(colorForDueDate('2000-10-20')).toBe('red');
});
```

测试由传递给 [`it`](https://jestjs.io/docs/en/api#testname-fn-timeout) 函数的字符串描述。 careful 编写描述，以便清楚正在测试什么。尽力涵盖以下内容：

1. **Given** - 某些前置条件
2. **When** - 你正在测试的函数执行的某些操作
3. **Then** - 预期的结果

这也称为 AAA（Arrange, Act, Assert）。

Jest 提供 [`describe`](https://jestjs.io/docs/en/api#describename-fn) 函数来帮助构建测试结构。使用 `describe` 将属于一个功能的所有测试分组在一起。如果需要，Describe 可以嵌套。你还将常用的其他函数是 [`beforeEach`](https://jestjs.io/docs/en/api#beforeeachfn-timeout) 或 [`beforeAll`](https://jestjs.io/docs/en/api#beforeallfn-timeout)，你可以使用它们来设置你正在测试的对象。在 [Jest api 参考](https://jestjs.io/docs/en/api) 中阅读更多内容。

如果你的测试有很多步骤或很多期望，你可能想将其拆分为多个较小的测试。此外，确保你的测试完全相互独立。套件中的每个测试必须能够独立执行，而无需先运行其他测试。相反，如果你一起运行所有测试，第一个测试绝不能影响第二个测试的输出。

最后，作为开发者，我们喜欢我们的代码工作良好且不崩溃。对于测试，这通常相反。将失败的测试视为_好事！_ 当测试失败时，通常意味着某些地方不对劲。这给了你在问题影响用户之前修复问题的机会。

## 单元测试

单元测试涵盖最小的代码部分，如单个函数或类。

当被测试的对象有任何依赖项时，你通常需要像下一段所述那样模拟它们。

单元测试的好处在于它们编写和运行速度快。因此，当你工作时，你可以快速获得测试是否通过的反馈。Jest 甚至有一个选项可以连续运行与你正在编辑的代码相关的测试：[监视模式](https://jestjs.io/docs/en/cli#watch)。

<img src="/docs/assets/p_tests-unit.svg" alt=" " />

### 模拟

有时，当你的测试对象具有外部依赖项时，你会想要“模拟它们”。“模拟”是指用你自己的实现替换代码的某些依赖项。

> 通常，在测试中使用真实对象比使用模拟更好，但在某些情况下这是不可能的。例如：当你的 JS 单元测试依赖于用 Java 或 Objective-C 编写的原生模块时。

想象你正在编写一个显示你城市当前天气的应用，你正在使用某些外部服务或其他依赖项为你提供天气信息。如果服务告诉你正在下雨，你想显示一张带有雨云的图片。你不想在测试中调用该服务，因为：

- 它可能会使测试变慢且不稳定（因为涉及网络请求）
- 服务可能每次运行测试时返回不同的数据
- 当你真正需要运行测试时，第三方服务可能会离线！

因此，你可以提供服务的模拟实现，有效地替换数千行代码和一些连接互联网的温度计！

> Jest 自带[对模拟的支持](https://jestjs.io/docs/en/mock-functions#mocking-modules)，从函数级到模块级模拟。

## 集成测试

在编写大型软件系统时，其各个部分需要相互交互。在单元测试中，如果你的单元依赖于另一个单元，你有时最终会模拟该依赖项，用假单元替换它。

在集成测试中，真实的独立单元被组合在一起（与在你的应用中一样）并一起测试，以确保它们的协作按预期工作。这并不是说这里不会发生模拟：你仍然需要模拟（例如，模拟与天气服务的通信），但你需要它们的次数比单元测试少得多。

> 请注意，关于集成测试含义的术语并不总是一致的。此外，单元测试和集成测试之间的界限可能并不总是清晰的。对于本指南，如果你的测试符合以下条件，则属于“集成测试”：
>
> - 如上所述组合了应用的多个模块
> - 使用外部系统
> - 向其他应用程序发出网络调用（例如天气服务 API）
> - 执行任何类型的文件或数据库 <abbr title="输入/输出">I/O</abbr>

<img src="/docs/assets/p_tests-integration.svg" alt=" " />

## 组件测试

React 组件负责渲染你的应用，用户将直接与它们的输出交互。即使你的应用业务逻辑具有高测试覆盖率且正确，如果没有组件测试，你仍然可能向用户交付损坏的 UI。组件测试可能属于单元测试和集成测试，但因为它们是 React Native 的核心部分，我们将单独介绍它们。

对于测试 React 组件，你可能想要测试两件事：

- 交互：确保组件在与用户交互时行为正确（例如，当用户按下按钮时）
- 渲染：确保组件渲染输出被 React 正确使用（例如，按钮在 UI 中的外观和位置）

例如，如果你有一个具有 `onPress` 监听器的按钮，你想测试按钮是否正确显示，以及点击按钮是否被组件正确处理。

有几个库可以帮助你测试这些：

- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/) 构建在 React 的测试渲染器之上，并添加了下一段中描述的 `fireEvent` 和 `query` API。
- [已弃用] React 的 [Test Renderer](https://react.dev/blog/2024/04/25/react-19-upgrade-guide#deprecated-react-test-renderer)，与其核心一起开发，提供了一个 React 渲染器，可用于将 React 组件渲染为纯 JavaScript 对象，而不依赖于 DOM 或原生移动环境。

> 组件测试只是在 Node.js 环境中运行的 JavaScript 测试。它们_不_ 考虑支持 React Native 组件的任何 iOS、Android 或其他平台代码。因此，它们不能给你 100% 的信心认为一切对用户都有效。如果 iOS 或 Android 代码中有 Bug，它们不会发现。

<img src="/docs/assets/p_tests-component.svg" alt=" " />

### 测试用户交互

除了渲染一些 UI 之外，你的组件还处理事件，如 `TextInput` 的 `onChangeText` 或 `Button` 的 `onPress`。它们还可能包含其他函数和事件回调。考虑以下示例：

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

在测试用户交互时，从用户角度测试组件——页面上有什么？交互时发生了什么变化？

作为经验法则，优先使用用户可以看到或听到的内容：

- 使用渲染的文本或 [辅助功能助手](https://reactnative.dev/docs/accessibility#accessibility-properties) 进行断言

相反，你应该避免：

- 对组件 props 或状态进行断言
- testID 查询

避免测试实现细节，如 props 或状态——虽然这样的测试有效，但它们不面向用户如何与组件交互，并且倾向于因重构而破坏（例如，当你想重命名某些内容或使用 Hooks 重写类组件时）。

> React 类组件特别容易测试其实现细节，如内部状态、props 或事件处理程序。为了避免测试实现细节，优先使用带有 Hooks 的函数组件，这使得依赖组件内部变得_更困难_。

组件测试库，如 [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)，通过仔细选择提供的 API 来促进编写以用户为中心的测试。以下示例使用 `fireEvent` 方法 `changeText` 和 `press` 模拟用户与组件交互，以及查询函数 `getAllByText` 在渲染输出中查找匹配的 `Text` 节点。

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
  expect(bananaElements).toHaveLength(1); // 期望 'banana' 在列表中
});
```

此示例不是测试当你调用函数时某些状态如何变化。它测试当用户在 `TextInput` 中更改文本并按下 `Button` 时会发生什么！

### 测试渲染输出

[快照测试](https://jestjs.io/docs/en/snapshot-testing) 是 Jest 启用的一种高级测试。它是一个非常强大且底层的工具，因此使用时建议格外注意。

“组件快照”是由 Jest 内置的自定义 React 序列化程序创建的类 JSX 字符串。此序列化程序让 Jest 将 React 组件树转换为人类可读的字符串。换句话说：组件快照是测试运行期间_生成_ 的组件渲染输出的文本表示。它可能看起来像这样：

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

使用快照测试，你通常首先实现组件，然后运行快照测试。快照测试然后创建快照并将其作为参考快照保存到仓库中的文件。**然后提交文件并在代码审查期间检查**。组件渲染输出的任何未来更改都将更改其快照，这将导致测试失败。然后你需要更新存储的参考快照才能使测试通过。该更改再次需要提交和审查。

快照有几个弱点：

- 对于你作为开发者或审查者来说，很难判断快照中的更改是预期的还是它是 Bug 的证据。尤其是大型快照可能很快变得难以理解，其附加价值变得很低。
- 当创建快照时，在那一刻它被认为是正确的——即使渲染输出实际上是错误的。
- 当快照失败时，人们倾向于使用 `--updateSnapshot` jest 选项更新它，而没有适当注意调查更改是否预期。因此需要一定的开发者纪律。

快照本身并不能确保你的组件渲染逻辑正确，它们只是擅长防止意外更改并检查测试下的 React 树中的组件是否收到预期的 props（样式等）。

我们建议你只使用小快照（参见 [`no-large-snapshots` 规则](https://github.com/jest-community/eslint-plugin-jest/blob/master/docs/rules/no-large-snapshots.md)）。如果你想测试两个 React 组件状态之间的_更改_，使用 [`snapshot-diff`](https://github.com/jest-community/snapshot-diff)。如有疑问，优先使用上一段中描述的显式期望。

<img src="/docs/assets/p_tests-snapshot.svg" alt=" " />

## 端到端测试

在端到端 (E2E) 测试中，你从用户的角度验证你的应用在设备（或模拟器 / 仿真器）上是否按预期工作。

这是通过以发布配置构建你的应用并针对它运行测试来完成的。在 E2E 测试中，你不再需要考虑 React 组件、React Native API、Redux 存储或任何业务逻辑。那不是 E2E 测试的目的，而且在 E2E 测试期间甚至无法访问这些内容。

相反，E2E 测试库允许你查找和控制应用屏幕中的元素：例如，你可以_实际_点击按钮或将文本插入到 `TextInputs` 中，就像真实用户一样。然后你可以断言某个元素是否存在于应用屏幕中，是否可见，包含什么文本，等等。

E2E 测试为你提供最高程度的信心，表明你的应用部分正在工作。权衡包括：

- 与其他类型的测试相比，编写它们更耗时
- 运行速度较慢
- 它们更容易出现不稳定（“不稳定”的测试是指在代码没有任何更改的情况下随机通过和失败的测试）

尝试用 E2E 测试覆盖应用的关键部分：认证流程、核心功能、支付等。对于应用的非关键部分，使用更快的 JS 测试。你添加的测试越多，你的信心就越高，但同时，你花在维护和运行它们上的时间也越多。考虑权衡并决定什么最适合你。

有几个 E2E 测试工具可用：在 React Native 社区中，[Detox](https://github.com/wix/detox/) 是一个流行的框架，因为它是专为 React Native 应用量身定制的。iOS 和 Android 应用领域的另一个流行库是 [Appium](https://appium.io/) 或 [Maestro](https://maestro.mobile.dev/)。

<img src="/docs/assets/p_tests-e2e.svg" alt=" " />

## 总结

我们希望你喜欢阅读并从本指南中学到了一些东西。有很多方法可以测试你的应用。起初可能很难决定使用什么。然而，我们相信一旦你开始为你出色的 React Native 应用添加测试，一切都会变得有意义。那么你还在等什么？提高你的覆盖率！

### 链接

- [React 测试概述](https://react.dev/reference/react/act)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Jest 文档](https://jestjs.io/docs/en/tutorial-react-native)
- [Detox](https://github.com/wix/detox/)
- [Appium](https://appium.io/)
- [Maestro](https://maestro.mobile.dev/)

---

_本指南最初由 [Vojtech Novak](https://twitter.com/vonovak) 完全撰写和贡献。_
