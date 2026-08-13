# 附录

## I. 术语

- **Spec** - 描述 Turbo Native Module 或 Fabric Native component API 的 TypeScript 或 Flow 代码。由 **Codegen** 用于生成样板代码

- **原生模块** - 不为用户提供用户界面（UI）的原生库。例如持久化存储、通知、网络事件。这些原生模块可作为函数和对象供 JavaScript 应用代码访问
- **原生组件** - 可通过 React Components 供应用 JavaScript 代码使用的原生平台视图

- **旧版原生组件** - 运行在旧版 React Native 架构上的组件
- **旧版原生模块** - 运行在旧版 React Native 架构上的模块

## II. Codegen 类型

你可以使用下表作为参考，了解支持哪些类型，以及它们在各个平台上的映射：

| Flow                                                                   | TypeScript                                          | Flow 可空支持                                           | TypeScript 可空支持                                  | Android（Java）                      | iOS（ObjC）                                              |
| ---------------------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------- | ---------------------------------------------------- | ------------------------------------ | -------------------------------------------------------- |
| `string`                                                               | `string`                                            | `?string`                                               | <code>string &#124; null</code>                      | `string`                             | `NSString`                                               |
| `boolean`                                                              | `boolean`                                           | `?boolean`                                              | <code>boolean &#124; null</code>                     | `Boolean`                            | `NSNumber`                                               |
| 对象字面量<br /><code>&#123;&#124; foo: string, ...&#124;&#125;</code> | <code>&#123; foo: string, ...&#125; as const</code> | <code>?&#123;&#124; foo: string, ...&#124;&#125;</code> | <code>?&#123; foo: string, ...&#125; as const</code> | \-                                   | \-                                                       |
| Object [[1](#notes)]                                                   | Object [[1](#notes)]                                | `?Object`                                               | <code>Object &#124; null</code>                      | `ReadableMap`                        | `@`（无类型字典）                                        |
| <code>Array&lt;T&gt;</code>                                            | <code>Array&lt;T&gt;</code>                         | <code>?Array&lt;T&gt;</code>                            | <code>Array&lt;T&gt; &#124; null</code>              | `ReadableArray`                      | `NSArray`（或在对象内部使用时的 `RCTConvertVecToArray`） |
| `Function`                                                             | `Function`                                          | `?Function`                                             | <code>Function &#124; null</code>                    | \-                                   | \-                                                       |
| <code>Promise&lt;T&gt;</code>                                          | <code>Promise&lt;T&gt;</code>                       | <code>?Promise&lt;T&gt;</code>                          | <code>Promise&lt;T&gt; &#124; null</code>            | `com.facebook.react.bridge.Promise`  | `RCTPromiseResolve` 和 `RCTPromiseRejectBlock`           |
| 类型联合<br /><code>'SUCCESS'&#124;'FAIL'</code>                       | 类型联合<br /><code>'SUCCESS'&#124;'FAIL'</code>    | 仅可用作回调                                            |                                                      | \-                                   | \-                                                       |
| 回调<br />`() =>`                                                      | 回调<br />`() =>`                                   | 是                                                      |                                                      | `com.facebook.react.bridge.Callback` | `RCTResponseSenderBlock`                                 |
| `number`                                                               | `number`                                            | 否                                                      |                                                      | `double`                             | `NSNumber`                                               |

### 注释：

<b>[1]</b> 我们强烈建议使用对象字面量，而不是 Object。

:::info
你也可以参考 React Native 中核心模块的 JavaScript 规范。这些规范位于 React Native 仓库中的 `Libraries/` 目录内。
:::
