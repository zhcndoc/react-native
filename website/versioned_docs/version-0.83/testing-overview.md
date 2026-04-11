---
id: testing-overview
title: 测试
author: Vojtech Novak
authorURL: 'https://twitter.com/vonovak'
description: 本指南向 React Native 开发者介绍测试背后的关键概念，如何编写良好的测试，以及你可以将哪些类型的测试整合到工作流程中。
---

随着代码库的扩展，你意想不到的小错误和边缘情况可能会累积成更大的故障。bug 会导致糟糕的用户体验，最终造成业务损失。防止脆弱编程的一种方法是在代码发布到生产之前先对其进行测试。

在本指南中，我们将涵盖确保你的应用按预期工作的不同自动化方法，从静态分析到端到端测试。

<img src="/docs/assets/diagram_testing.svg" alt="测试是修复、测试，再通过发布或失败回归测试的循环过程。" />

## 为什么测试

我们是人，人会犯错。测试很重要，因为它帮助你发现这些错误，并验证代码是否正常工作。也许更重要的是，测试确保了当你添加新功能、重构现有代码或升级项目的主要依赖时，代码仍然能够正常运行。

测试的价值可能比你想象的还要大。修复代码中 bug 的最佳方法之一是先编写一个失败的测试用例来暴露该 bug。当你修复 bug 并重新运行测试，如果测试通过，就意味着 bug 已被修复，并且不会重新引入代码库。

测试也可以作为新成员加入团队时的文档。对于从未见过该代码库的人，阅读测试可以帮助他们理解现有代码的工作方式。

最后，更多的自动化测试意味着更少的人工 <abbr title="Quality Assurance">质量保证</abbr> 时间，从而释放出宝贵的时间。

## 静态分析

提升代码质量的第一步是开始使用静态分析工具。静态分析在你编写代码时检查错误，但不会执行代码。

- **Lint 工具** 分析代码以捕获常见错误，如未使用的代码，帮助避免陷阱，标记不符合样式规范的情况，例如使用制表符代替空格（或根据配置相反）。
- **类型检查** 确保你传给函数的构造符合该函数设计接受的类型，比如防止将字符串传给预期数字参数的计数函数。

React Native 默认配置了两种此类工具：[ESLint](https://eslint.org/) 用于代码风格检查，[TypeScript](typescript) 用于类型检查。

## 编写可测试的代码

想要开始测试，首先要编写可测试的代码。想象飞机制造流程——在任何型号首次起飞以展示所有复杂系统良好协作之前，会先测试各个部件以保证它们的安全性和功能性。例如，通过极限弯曲测试机翼；测试发动机部件的耐久性；通过模拟鸟撞击测试挡风玻璃。

软件也类似。不是把整个程序写在一个庞大的文件里，而是将代码拆分成多个小模块，你可以更充分地测试这些模块，相较于测试整合后的整体。这样，编写可测试的代码就和编写干净、模块化的代码紧密相连。

为了让应用更容易测试，先从将应用的视图部分——即 React 组件——与业务逻辑和应用状态分离开始（无论你使用 Redux、MobX 还是其他方案）。这样，可以保持业务逻辑的测试独立于依赖 React 组件的渲染部分，后者主要负责渲染 UI。

理论上，你可以将所有逻辑和数据抓取代码移出组件，使组件仅专注于渲染，状态完全独立于组件。这样，应用逻辑可以在没有任何 React 组件的情况下工作！

:::tip
我们鼓励你在其他学习资源中进一步探索可测试代码的相关主题。
:::

## 编写测试

编写了可测试的代码后，就可以编写实际的测试了！React Native 的默认模板自带 [Jest](https://jestjs.io) 测试框架，其中包括针对该环境定制的预设配置，让你无需立即调试配置和 Mock 就能高效开发——稍后会详细介绍 [模拟 Mock](#mocking)。你可以用 Jest 来编写本指南所涉及的所有类型的测试。

:::note
如果你采用测试驱动开发（TDD），实际上是先编写测试！这样会自然而然地保证代码的可测试性。
:::

### 测试结构

测试应简短且理想情况下只测试一件事。以下是用 Jest 编写的示例单元测试：

```js
it('给定一个过去的日期，colorForDueDate() 返回红色', () => {
  expect(colorForDueDate('2000-10-20')).toBe('red');
});
```

测试由传给 [`it`](https://jestjs.io/docs/en/api#testname-fn-timeout) 函数的字符串描述。务必写清楚测试内容，尽可能涵盖以下三部分：

1. **Given** - 前置条件
2. **When** - 被测试函数执行的动作
3. **Then** - 预期结果

这也称为 AAA（Arrange，Act，Assert）。

Jest 提供 [`describe`](https://jestjs.io/docs/en/api#describename-fn) 函数帮助组织测试。用 `describe` 将属于同一功能的测试分组。`describe` 可以嵌套。你常用的还有 [`beforeEach`](https://jestjs.io/docs/en/api#beforeeachfn-timeout) 和 [`beforeAll`](https://jestjs.io/docs/en/api#beforeallfn-timeout) 用于准备被测试的对象。详情请参阅 [Jest API 参考](https://jestjs.io/docs/en/api)。

测试步骤或断言过多时，建议拆分成多个小测试。确保测试之间完全独立。测试套件中的每个测试都必须能单独执行，无需依赖其他测试。反之，同时执行所有测试时，第一个测试的结果不应影响第二个测试。

最后，作为开发者，我们喜欢代码稳定，不出错。测试中情况往往相反。失败的测试是【好事】！测试失败往往意味着存在问题，这给你机会在用户受影响前修复。

## 单元测试

单元测试覆盖最小代码单位，如函数或类。

当被测试对象有依赖，会经常用到模拟（Mock），详情见下一段。

单元测试的优点是编写和运行速度快。这样你能快速得到测试是否通过的反馈。Jest 甚至支持只持续运行与你编辑代码相关的测试：[监听模式](https://jestjs.io/docs/en/cli#watch)。

<img src="/docs/assets/p_tests-unit.svg" alt=" " />

### 模拟 Mock

有时被测对象依赖外部资源，这时想“模拟”它们。“模拟”指用你自定义的代码替代依赖对象。

:::info
通常来说，测试中使用真实对象优于 Mock，但有些情况不得不使用，比如 JS 单元测试依赖 Java 或 Objective-C 的原生模块。
:::

假设你写了一个显示当前城市天气的应用，并依赖某第三方服务获取天气数据。如果服务返回“下雨”，你会显示带雨滴的云朵图片。你不希望测试时调用该服务，因为：

- 调用服务会导致测试慢且不稳定（网络请求问题）
- 服务每次返回数据可能不同
- 第三方服务可能宕机，而你急需运行测试！

所以，可使用一个模拟实现，替代成千上万行代码和联网设备！

:::note
Jest 支持从函数级别到模块级别的 [丰富模拟功能](https://jestjs.io/docs/en/mock-functions#mocking-modules)。
:::

## 集成测试

构建大型软件系统时，组件间需要交互。单元测试中依赖项经常被 Mock 成假的。

集成测试则是将真实单元结合（就像在应用中一样）一起测试，确保它们配合正常。这里也会用到模拟（比如模拟天气服务的通信），但比单元测试用得少。

:::info
需要指出的是，集成测试在定义上并不总是完全一致。单元测试与集成测试的界线也不总是很明确。本指南中，符合以下条件的测试属于“集成测试”：

- 如上文描述，将多个应用模块组合测试
- 使用外部系统
- 向其他应用（如天气服务 API）发起网络请求
- 做任何文件或数据库 <abbr title="Input/Output">输入/输出</abbr> 操作
  :::

<img src="/docs/assets/p_tests-integration.svg" alt=" " />

## 组件测试

React 组件负责渲染应用，用户直接与其输出交互。即使业务逻辑测试覆盖率高且正确，没有组件测试依然可能让用户见到坏的 UI。组件测试既可算作单元测试，也可算作集成测试，但因其在 React Native 中核心地位，我们单独讲。

测试 React 组件时，你可能想测试两件事：

- 交互：确认组件用户交互（比如点击按钮）时表现正确
- 渲染：确认组件渲染输出（React 使用的）正确，比如按钮的样式与位置

例如，你有个带 `onPress` 监听器的按钮，你想测试按钮的正确展示及点击后被正确处理。

以下几个库有助于此类测试：

- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/) 基于 React 测试渲染器并增加了 `fireEvent` 和 `query` API（下一段会描述）
- [已弃用] React 官方的 [Test Renderer](https://react.dev/blog/2024/04/25/react-19-upgrade-guide#deprecated-react-test-renderer)，可将组件渲染成纯 JavaScript 对象，无需依赖 DOM 或原生环境

:::warning
组件测试仅在 Node.js 中运行的 JavaScript 测试，不考虑支撑 React Native 组件的 iOS、Android 或其他平台代码。因此它不能为你提供 100% 的信心。如果 iOS 或 Android 代码有缺陷，组件测试不会发现。
:::

<img src="/docs/assets/p_tests-component.svg" alt=" " />

### 测试用户交互

除了渲染 UI，组件还处理事件，比如 `TextInput` 的 `onChangeText` 或 `Button` 的 `onPress`，还可能包含其他函数和事件回调。例如：

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

测试交互时，从用户角度出发——页面上有什么？交互后哪些变化？

经验法则是，优先使用用户能看到或听到的内容：

- 使用渲染文本或 [无障碍辅助工具](https://reactnative.dev/docs/accessibility#accessibility-properties) 做断言

不推荐：

- 针对组件 props 或 state 做断言
- 使用 testID 查询

避免测试实现细节，如 props 或 state —— 这类测试虽可用，但不反映用户交互方式，且重构时易破坏（比如重命名或用 Hook 改写类组件）。

:::info
React 类组件尤其容易测试内部实现细节，如内部状态、props 或事件处理器。为避免测试实现细节，建议优先使用带 Hooks 的函数组件，使得依赖组件内部更难。
:::

组件测试库如 [React Native Testing Library](https://callstack.github.io/react-native-testing-library/) 通过精心设计的 API 促进编写面向用户的测试。以下示例使用 `fireEvent` 的 `changeText` 和 `press` 方法模拟用户交互，并使用查询方法 `getAllByText` 在渲染输出中查找匹配的 `Text` 节点。

```tsx
test('给定空的 GroceryShoppingList，用户可添加项目', () => {
  const {getByPlaceholderText, getByText, getAllByText} = render(
    <GroceryShoppingList />,
  );

  fireEvent.changeText(
    getByPlaceholderText('Enter grocery item'),
    'banana',
  );
  fireEvent.press(getByText('Add the item to list'));

  const bananaElements = getAllByText('banana');
  expect(bananaElements).toHaveLength(1); // 期望列表中有"banana"
});
```

该示例不是测试调用函数后状态变化，而是测试用户在 `TextInput` 输入文本并点击 `Button` 后发生什么！

### 测试渲染输出

[快照测试](https://jestjs.io/docs/en/snapshot-testing) 是 Jest 提供的一种高级测试手段。它非常强大但底层，使用时需格外小心。

“组件快照”是由 Jest 内置的 React 序列化器生成的类似 JSX 的字符串。该序列化器将 React 组件树转换为易读字符串。换句话说，组件快照是测试运行时生成的组件渲染输出文本表示。示例：

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

通常，你先完成组件实现，再运行快照测试。快照测试会创建快照并保存到代码仓库的文件中作为参考快照。**该文件会提交并在代码审查时检查**。以后组件渲染输出的任何改变都会导致快照更新，测试失败，你需要更新参考快照使测试通过。该更新也需提交并审查。

快照有若干缺陷：

- 你或审查者难判断快照变化是预期还是 bug。特别是快照很大时，难以理解且价值下降。
- 快照被创建时即视为正确，哪怕实际输出有误。
- 快照失败时，容易不加调查就用 `--updateSnapshot` 参数更新，需开发者自律。

快照不能保证组件渲染逻辑正确，仅能防止意外变化，检查组件树中子组件获得的 props（样式等）是否如预期。

建议只用小型快照（见 [`no-large-snapshots` 规则](https://github.com/jest-community/eslint-plugin-jest/blob/main/docs/rules/no-large-snapshots.md)）。如果想测试两个组件状态间的**变化**，使用 [`snapshot-diff`](https://github.com/jest-community/snapshot-diff)。不确定时，优先用上面提到的显式断言。

<img src="/docs/assets/p_tests-snapshot.svg" alt=" " />

## 端到端测试

端到端（E2E）测试验证你的应用从用户角度在设备（或模拟器/仿真器）上运行是否正常。

这通过构建发布版本的应用并针对它运行测试完成。在 E2E 测试中，你不再关心 React 组件、React Native API、Redux 状态或业务逻辑。这些既不是 E2E 测试目的，也无法访问。

反而，E2E 测试库允许你查找并控制应用界面元素，例如**实际点击**按钮或在 `TextInput` 输入文本，仿真真实用户行为。然后你可以断言某元素是否存在、是否可见、包含什么文本等等。

E2E 测试提供最高的应用功能运行保证。缺点是：

- 编写耗时，较其他测试更费力
- 运行速度慢
- 容易出现“易变”测试（测试结果随机通过或失败，无代码变动）

建议用 E2E 测试覆盖应用关键部分：认证流程、核心功能、支付等。对非关键部分用速度更快的 JS 测试。测试越多信心越强，但维护和执行时间也越长。权衡利弊，选择适合你的方案。

React Native 社区有多个 E2E 工具，其中 [Detox](https://github.com/wix/detox/) 因针对 React Native 设计而流行。其他 iOS/Android 端常用的有 [Appium](https://appium.io/) 和 [Maestro](https://maestro.mobile.dev/)。

<img src="/docs/assets/p_tests-e2e.svg" alt=" " />

## 总结

希望你喜欢阅读本指南并有所收获。测试你应用的方法多样，刚开始可能难以抉择。但相信随着给你出色的 React Native 应用添加测试，一切都会变得明朗。还等什么？赶快提升你的测试覆盖率吧！

### 链接

- [React 测试概览](https://react.dev/reference/react/act)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Jest 文档](https://jestjs.io/docs/en/tutorial-react-native)
- [Detox](https://github.com/wix/detox/)
- [Appium](https://appium.io/)
- [Maestro](https://maestro.mobile.dev/)

---

_本指南最初由 [Vojtech Novak](https://twitter.com/vonovak) 全权撰写和贡献。_