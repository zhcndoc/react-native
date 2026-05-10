# 附录

## I. 术语

- **Spec** - 描述 Turbo Native Module 或 Fabric Native 组件 API 的 TypeScript 或 Flow 代码。由 **Codegen** 用于生成样板代码。

- **Native Modules** - 没有面向用户的用户界面（UI）的原生库。例如持久化存储、通知、网络事件。这些可作为函数和对象供你的 JavaScript 应用代码访问。
- **Native Component** - 可通过 React 组件供你的应用 JavaScript 代码使用的原生平台视图。

- **Legacy Native Components** - 运行在旧版 React Native 架构上的组件。
- **Legacy Native Modules** - 运行在旧版 React Native 架构上的模块。

## II. Codegen 类型

你可以将以下表格作为参考，了解支持哪些类型，以及它们在各个平台上的映射方式：

| Flow                                                                       | TypeScript                                          | Flow Nullable 支持                                   | TypeScript Nullable 支持                          | Android (Java)                       | iOS (ObjC)                                                     |
| -------------------------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------- | ---------------------------------------------------- | ------------------------------------ | -------------------------------------------------------------- |
| `string`                                                                   | `string`                                            | `?string`                                               | <code>string &#124; null</code>                      | `string`                             | `NSString`                                                     |
| `boolean`                                                                  | `boolean`                                           | `?boolean`                                              | <code>boolean &#124; null</code>                     | `Boolean`                            | `NSNumber`                                                     |
| Object Literal<br /><code>&#123;&#124; foo: string, ...&#124;&#125;</code> | <code>&#123; foo: string, ...&#125; as const</code> | <code>?&#123;&#124; foo: string, ...&#124;&#125;</code> | <code>?&#123; foo: string, ...&#125; as const</code> | \-                                   | \-                                                             |
| Object [[1](#notes)]                                                       | Object [[1](#notes)]                                | `?Object`                                               | <code>Object &#124; null</code>                      | `ReadableMap`                        | `@`（未类型化字典）                                       |
| <code>Array&lt;T&gt;</code>                                                | <code>Array&lt;T&gt;</code>                         | <code>?Array&lt;T&gt;</code>                            | <code>Array&lt;T&gt; &#124; null</code>              | `ReadableArray`                      | `NSArray`（或在对象内部使用时为 `RCTConvertVecToArray`） |
| `Function`                                                                 | `Function`                                          | `?Function`                                             | <code>Function &#124; null</code>                    | \-                                   | \-                                                             |
| <code>Promise&lt;T&gt;</code>                                              | <code>Promise&lt;T&gt;</code>                       | <code>?Promise&lt;T&gt;</code>                          | <code>Promise&lt;T&gt; &#124; null</code>            | `com.facebook.react.bridge.Promise`  | `RCTPromiseResolve` 和 `RCTPromiseRejectBlock`                |
| Type Unions<br /><code>'SUCCESS'&#124;'FAIL'</code>                        | Type Unions<br /><code>'SUCCESS'&#124;'FAIL'</code> | 仅可作为回调使用                                       |                                                      | \-                                   | \-                                                             |
| Callbacks<br />`() =>`                                                     | Callbacks<br />`() =>`                              | 是                                                     |                                                      | `com.facebook.react.bridge.Callback` | `RCTResponseSenderBlock`                                       |
| `number`                                                                   | `number`                                            | 否                                                      |                                                      | `double`                             | `NSNumber`                                                     |

### 注：

<b>[1]</b> 我们强烈建议使用 Object literals，而不是 Objects。

:::info
你也可能会发现参考 React Native 中核心模块的 JavaScript 规范很有用。这些规范位于 React Native 仓库中的 `Libraries/` 目录内。
:::
