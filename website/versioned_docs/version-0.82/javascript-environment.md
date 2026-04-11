---
id: javascript-environment
title: JavaScript 环境
---

import TableRow from '@site/core/TableRowWithCodeBlock';

## JavaScript 运行时

使用 React Native 时，你将在最多三个环境中运行 JavaScript 代码：

- 在大多数情况下，React Native 将使用 [Hermes](hermes)，这是一个为 React Native 优化的开源 JavaScript 引擎。
- 如果 Hermes 被禁用，React Native 将使用 [JavaScriptCore](https://trac.webkit.org/wiki/JavaScriptCore)，这是为 Safari 提供动力的 JavaScript 引擎。请注意，在 iOS 上，由于 iOS 应用中缺少可写可执行内存，JavaScriptCore 不使用 JIT。
- 使用 Chrome 调试时，所有 JavaScript 代码都在 Chrome 本身内运行，通过 WebSockets 与原生代码通信。Chrome 使用 [V8](https://v8.dev/) 作为其 JavaScript 引擎。

虽然这些环境非常相似，但你可能会遇到一些不一致之处。最好不要依赖任何运行时的具体特性。

## JavaScript 语法转换器

语法转换器通过允许你使用新的 JavaScript 语法而无需等待所有解释器的支持，使编写代码更加愉快。

React Native 附带了 [Babel JavaScript 编译器](https://babeljs.io)。查看 [Babel 文档](https://babeljs.io/docs/plugins/#transform-plugins) 以了解其支持的转换的更多细节。

React Native 启用的转换的完整列表可以在 [@react-native/babel-preset](https://github.com/facebook/react-native/tree/main/packages/react-native-babel-preset) 中找到。

<table>
<thead>
  <tr><th>转换</th><th>代码</th></tr>
</thead>
<tbody>
  <tr><td className="table-heading" colSpan="2">ECMAScript 5</td></tr>
  <TableRow name="保留字" code="promise.catch(function() {...});" />
  <tr><td className="table-heading" colSpan="2">ECMAScript 2015 (ES6)</td></tr>
  <TableRow name="箭头函数" code="<C onPress={() => this.setState({pressed: true})} />" url="https://babeljs.io/docs/learn-es2015/#arrows" />
  <TableRow name="块级作用域" code="let greeting = 'hi';" url="https://babeljs.io/docs/learn-es2015/#let-const" />
  <TableRow name="调用扩展" code="Math.max(...array);" url="https://babeljs.io/docs/learn-es2015/#default-rest-spread" />
  <TableRow name="类" code="class C extends React.Component {render() { return <View />; }}" url="https://babeljs.io/docs/learn-es2015/#classes" />
  <TableRow name="计算属性" code="const key = 'abc'; const obj = {[key]: 10};" url="https://babeljs.io/docs/learn-es2015/#enhanced-object-literals" />
  <TableRow name="常量" code="const answer = 42;" url="https://babeljs.io/docs/learn-es2015/#let-const" />
  <TableRow name="解构" code="const {isActive, style} = this.props;" url="https://babeljs.io/docs/learn-es2015/#destructuring" />
  <TableRow name="for…of" code="for (var num of [1, 2, 3]) {...};" url="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of" />
  <TableRow name="函数名" code="let number = x => x;" url="https://babeljs.io/docs/en/babel-plugin-transform-function-name" />
  <TableRow name="字面量" code="const b = 0b11; const o = 0o7; const u = 'Hello\u{000A}\u{0009}!';" url="https://babeljs.io/docs/en/babel-plugin-transform-literals" />
  <TableRow name="模块" code="import React, {Component} from 'react';" url="https://babeljs.io/docs/learn-es2015/#modules" />
  <TableRow name="对象简写方法" code="const obj = {method() { return 10; }};" url="https://babeljs.io/docs/learn-es2015/#enhanced-object-literals" />
  <TableRow name="属性简写" code="const name = 'vjeux'; const obj = {name};" url="https://babeljs.io/docs/learn-es2015/#enhanced-object-literals" />
  <TableRow name="参数" code="function test(x = 'hello', {a, b}, ...args) {}" url="https://babeljs.io/docs/en/babel-plugin-transform-parameters" />
  <TableRow name="剩余参数" code="function(type, ...args) {};" url="https://github.com/sebmarkbage/ecmascript-rest-spread" />
  <TableRow name="简写属性" code="const o = {a, b, c};" url="https://babeljs.io/docs/en/babel-plugin-transform-shorthand-properties" />
  <TableRow name="粘性正则" code="const a = /o+/y;" url="https://babeljs.io/docs/en/babel-plugin-transform-sticky-regex" />
  <TableRow name="模板字面量" code="const who = 'world'; const str = `Hello ${who}`;" url="https://babeljs.io/docs/learn-es2015/#template-strings" />
  <TableRow name="Unicode 正则" code="const string = 'foo💩bar'; const match = string.match(/foo(.)bar/u);" url="https://babeljs.io/docs/en/babel-plugin-transform-unicode-regex" />
  <tr><td className="table-heading" colSpan="2">ECMAScript 2016 (ES7)</td></tr>
  <TableRow name="指数运算符" code="let x = 10 ** 2;" url="https://babeljs.io/docs/en/babel-plugin-transform-exponentiation-operator" />
  <tr><td className="table-heading" colSpan="2">ECMAScript 2017 (ES8)</td></tr>
  <TableRow name="异步函数" code="async function doStuffAsync() {const foo = await doOtherStuffAsync();};" url="https://github.com/tc39/ecmascript-asyncawait" />
  <TableRow name="函数尾随逗号" code="function f(a, b, c,) {};" url="https://github.com/jeffmo/es-trailing-function-commas" />
  <tr><td className="table-heading" colSpan="2">ECMAScript 2018 (ES9)</td></tr>
  <TableRow name="对象扩展" code="const extended = {...obj, a: 10};" url="https://github.com/tc39/proposal-object-rest-spread" />
  <tr><td className="table-heading" colSpan="2">ECMAScript 2019 (ES10)</td></tr>
  <TableRow name="可选 Catch 绑定" code="try {throw 0; } catch { doSomethingWhichDoesNotCareAboutTheValueThrown();}" url="https://babeljs.io/docs/en/babel-plugin-proposal-optional-catch-binding" />
  <tr><td className="table-heading" colSpan="2">ECMAScript 2020 (ES11)</td></tr>
  <TableRow name="动态导入" code="const package = await import('package'); package.function()" url="https://babeljs.io/docs/en/babel-plugin-syntax-dynamic-import" />
  <TableRow name="空值合并运算符" code="const foo = object.foo ?? 'default';" url="https://babeljs.io/docs/en/babel-plugin-proposal-nullish-coalescing-operator" />
  <TableRow name="可选链" code="const name = obj.user?.name;" url="https://github.com/tc39/proposal-optional-chaining" />
  <tr><td className="table-heading" colSpan="2">ECMAScript 2022 (ES13)</td></tr>
  <TableRow name="类字段" code="class Bork {static a = 'foo'; static b; x = 'bar'; y;}" url="https://babeljs.io/docs/en/babel-plugin-proposal-class-properties" />
  <tr><td className="table-heading" colSpan="2">阶段 1 提案</td></tr>
  <TableRow name="默认导出从" code="export v from 'mod';" url="https://babeljs.io/docs/en/babel-plugin-proposal-export-default-from" />
  <tr><td className="table-heading" colSpan="2">杂项</td></tr>
  <TableRow name="Babel 模板" code="template(`const %%importName%% = require(%%source%%);`);" url="https://babeljs.io/docs/en/babel-template" />
  <TableRow name="Flow" code="function foo(x: ?number): string {};" url="https://flowtype.org/" />
  <TableRow name="ESM 到 CJS" code="export default 42;" url="https://babeljs.io/docs/en/babel-plugin-transform-modules-commonjs" />
  <TableRow name="JSX" code="<View style={{color: 'red'}} />" url="https://react.dev/learn/writing-markup-with-jsx" />
  <TableRow name="对象赋值" code="Object.assign(a, b);" url="https://babeljs.io/docs/en/babel-plugin-transform-object-assign" />
  <TableRow name="React 显示名称" code="const bar = createReactClass({});" url="https://babeljs.io/docs/en/babel-plugin-transform-react-display-name" />
  <TableRow name="TypeScript" code="function foo(x: {hello: true, target: 'react native!'}): string {};" url="https://www.typescriptlang.org/" />
</tbody>
</table>

## 填充

许多标准函数在所有支持的 JavaScript 运行时上也可用。

#### 浏览器

- [CommonJS `require`](https://nodejs.org/docs/latest/api/modules.html)
- md [console.{log, warn, error, info, debug, trace, table, group, groupCollapsed, groupEnd}](https://developer.chrome.com/devtools/docs/console-api)
- [`XMLHttpRequest`, `fetch`](network.md#content)
- [`{set, clear}{Timeout, Interval, Immediate}, {request, cancel}AnimationFrame`](timers.md#content)

#### ECMAScript 2015 (ES6)

- [`Array.from`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from)
- `md Array.prototype.{[find](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find), [findIndex](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex)}`
- [`Object.assign`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
- `md String.prototype.{[startsWith](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith), [endsWith](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith), [repeat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/repeat), [includes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes)}`

#### ECMAScript 2016 (ES7)

- `md Array.prototype.[includes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes)`

#### ECMAScript 2017 (ES8)

- `md Object.{[entries](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries), [values](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/values)}`

#### 特定

- `__DEV__`
