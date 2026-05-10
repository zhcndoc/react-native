---
id: javascript-environment
title: JavaScript 环境
---

import TableRow from '@site/core/TableRowWithCodeBlock';

## JavaScript 运行时

当使用 React Native 时，你的 JavaScript 代码最多会在三种环境中运行：

- 在大多数情况下，React Native 会使用 [Hermes](hermes)，这是一个为 React Native 优化的开源 JavaScript 引擎。
- 如果禁用 Hermes，React Native 将使用 [JavaScriptCore](https://trac.webkit.org/wiki/JavaScriptCore)，也就是驱动 Safari 的 JavaScript 引擎。请注意，在 iOS 上，由于 iOS 应用中缺少可写的可执行内存，JavaScriptCore 不会使用 JIT。
- 在使用 Chrome 调试时，所有 JavaScript 代码都运行在 Chrome 自身内部，并通过 WebSockets 与原生代码通信。Chrome 使用 [V8](https://v8.dev/) 作为其 JavaScript 引擎。

尽管这些环境非常相似，你仍可能遇到一些不一致之处。最好避免依赖任何运行时的特定细节。

## JavaScript 语法转换器

语法转换器通过允许你使用新的 JavaScript 语法，而无需等待所有解释器都支持它，从而让编写代码变得更愉快。

React Native 自带 [Babel JavaScript 编译器](https://babeljs.io)。有关其支持的转换，请查看 [Babel 文档](https://babeljs.io/docs/plugins/#transform-plugins) 了解更多详情。

React Native 已启用的转换完整列表可在 [@react-native/babel-preset](https://github.com/facebook/react-native/tree/main/packages/react-native-babel-preset) 中找到。

<table>
<thead>
  <tr><th>转换</th><th>代码</th></tr>
</thead>
<tbody>
  <tr><td className="table-heading" colSpan="2">ECMAScript 5</td></tr>
  <TableRow name="Reserved Words" code="promise.catch(function() {...});" />
  <tr><td className="table-heading" colSpan="2">ECMAScript 2015 (ES6)</td></tr>
  <TableRow name="Arrow functions" code="<C onPress={() => this.setState({pressed: true})} />" url="https://babeljs.io/docs/learn-es2015/#arrows" />
  <TableRow name="Block scoping" code="let greeting = 'hi';" url="https://babeljs.io/docs/learn-es2015/#let-const" />
  <TableRow name="Call spread" code="Math.max(...array);" url="https://babeljs.io/docs/learn-es2015/#default-rest-spread" />
  <TableRow name="Classes" code="class C extends React.Component {render() { return <View />; }}" url="https://babeljs.io/docs/learn-es2015/#classes" />
  <TableRow name="Computed Properties" code="const key = 'abc'; const obj = {[key]: 10};" url="https://babeljs.io/docs/learn-es2015/#enhanced-object-literals" />
  <TableRow name="Constants" code="const answer = 42;" url="https://babeljs.io/docs/learn-es2015/#let-const" />
  <TableRow name="Destructuring" code="const {isActive, style} = this.props;" url="https://babeljs.io/docs/learn-es2015/#destructuring" />
  <TableRow name="for…of" code="for (var num of [1, 2, 3]) {...};" url="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of" />
  <TableRow name="Function Name" code="let number = x => x;" url="https://babeljs.io/docs/en/babel-plugin-transform-function-name" />
  <TableRow name="Literals" code="const b = 0b11; const o = 0o7; const u = 'Hello\u{000A}\u{0009}!';" url="https://babeljs.io/docs/en/babel-plugin-transform-literals" />
  <TableRow name="Modules" code="import React, {Component} from 'react';" url="https://babeljs.io/docs/learn-es2015/#modules" />
  <TableRow name="Object Concise Method" code="const obj = {method() { return 10; }};" url="https://babeljs.io/docs/learn-es2015/#enhanced-object-literals" />
  <TableRow name="Object Short Notation" code="const name = 'vjeux'; const obj = {name};" url="https://babeljs.io/docs/learn-es2015/#enhanced-object-literals" />
  <TableRow name="Parameters" code="function test(x = 'hello', {a, b}, ...args) {}" url="https://babeljs.io/docs/en/babel-plugin-transform-parameters" />
  <TableRow name="Rest Params" code="function(type, ...args) {};" url="https://github.com/sebmarkbage/ecmascript-rest-spread" />
  <TableRow name="Shorthand Properties" code="const o = {a, b, c};" url="https://babeljs.io/docs/en/babel-plugin-transform-shorthand-properties" />
  <TableRow name="Sticky Regex" code="const a = /o+/y;" url="https://babeljs.io/docs/en/babel-plugin-transform-sticky-regex" />
  <TableRow name="Template Literals" code="const who = 'world'; const str = `Hello ${who}`;" url="https://babeljs.io/docs/learn-es2015/#template-strings" />
  <TableRow name="Unicode Regex" code="const string = 'foo💩bar'; const match = string.match(/foo(.)bar/u);" url="https://babeljs.io/docs/en/babel-plugin-transform-unicode-regex" />
  <tr><td className="table-heading" colSpan="2">ECMAScript 2016 (ES7)</td></tr>
  <TableRow name="Exponentiation Operator" code="let x = 10 ** 2;" url="https://babeljs.io/docs/en/babel-plugin-transform-exponentiation-operator" />
  <tr><td className="table-heading" colSpan="2">ECMAScript 2017 (ES8)</td></tr>
  <TableRow name="Async Functions" code="async function doStuffAsync() {const foo = await doOtherStuffAsync();};" url="https://github.com/tc39/ecmascript-asyncawait" />
  <TableRow name="Function Trailing Comma" code="function f(a, b, c,) {};" url="https://github.com/jeffmo/es-trailing-function-commas" />
  <tr><td className="table-heading" colSpan="2">ECMAScript 2018 (ES9)</td></tr>
  <TableRow name="Object Spread" code="const extended = {...obj, a: 10};" url="https://github.com/tc39/proposal-object-rest-spread" />
  <tr><td className="table-heading" colSpan="2">ECMAScript 2019 (ES10)</td></tr>
  <TableRow name="Optional Catch Binding" code="try {throw 0; } catch { doSomethingWhichDoesNotCareAboutTheValueThrown();}" url="https://babeljs.io/docs/en/babel-plugin-proposal-optional-catch-binding" />
  <tr><td className="table-heading" colSpan="2">ECMAScript 2020 (ES11)</td></tr>
  <TableRow name="Dynamic Imports" code="const package = await import('package'); package.function()" url="https://babeljs.io/docs/en/babel-plugin-syntax-dynamic-import" />
  <TableRow name="Nullish Coalescing Operator" code="const foo = object.foo ?? 'default';" url="https://babeljs.io/docs/en/babel-plugin-proposal-nullish-coalescing-operator" />
  <TableRow name="Optional Chaining" code="const name = obj.user?.name;" url="https://github.com/tc39/proposal-optional-chaining" />
  <tr><td className="table-heading" colSpan="2">ECMAScript 2022 (ES13)</td></tr>
  <TableRow name="Class Fields" code="class Bork {static a = 'foo'; static b; x = 'bar'; y;}" url="https://babeljs.io/docs/en/babel-plugin-proposal-class-properties" />
  <tr><td className="table-heading" colSpan="2">Stage 1 Proposal</td></tr>
  <TableRow name="Export Default From" code="export v from 'mod';" url="https://babeljs.io/docs/en/babel-plugin-proposal-export-default-from" />
  <tr><td className="table-heading" colSpan="2">Miscellaneous</td></tr>
  <TableRow name="Babel Template" code="template(`const %%importName%% = require(%%source%%);`);" url="https://babeljs.io/docs/en/babel-template" />
  <TableRow name="Flow" code="function foo(x: ?number): string {};" url="https://flowtype.org/" />
  <TableRow name="ESM to CJS" code="export default 42;" url="https://babeljs.io/docs/en/babel-plugin-transform-modules-commonjs" />
  <TableRow name="JSX" code="<View style={{color: 'red'}} />" url="https://react.dev/learn/writing-markup-with-jsx" />
  <TableRow name="Object Assign" code="Object.assign(a, b);" url="https://babeljs.io/docs/en/babel-plugin-transform-object-assign" />
  <TableRow name="React Display Name" code="const bar = createReactClass({});" url="https://babeljs.io/docs/en/babel-plugin-transform-react-display-name" />
  <TableRow name="TypeScript" code="function foo(x: {hello: true, target: 'react native!'}): string {};" url="https://www.typescriptlang.org/" />
</tbody>
</table>

## Polyfills

许多标准函数在所有受支持的 JavaScript 运行时中也都可用。

#### 浏览器

- [CommonJS `require`](https://nodejs.org/docs/latest/api/modules.html)
- `md [console.{log, warn, error, info, debug, trace, table, group, groupCollapsed, groupEnd}](https://developer.chrome.com/devtools/docs/console-api)`
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

#### Specific

- `__DEV__`
