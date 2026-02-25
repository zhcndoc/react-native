# 附录

## I. 术语

- **Spec** - 用于描述 Turbo Native 模块或 Fabric 原生组件 API 的 TypeScript 或 Flow 代码。由 **Codegen** 用来生成样板代码。

- **Native Modules** - 没有用户界面 (UI) 的本地库。例如持久存储、通知、网络事件等。这些作为函数和对象，可以被你的 JavaScript 应用代码访问。
- **Native Component** - 通过 React 组件可供应用 JavaScript 代码使用的本地平台视图。

- **Legacy Native Components** - 运行在旧 React Native 架构上的组件。
- **Legacy Native Modules** - 运行在旧 React Native 架构上的模块。

## II. Codegen 类型定义

你可以参照下表了解支持的类型及其在各平台上的对应类型：

| Flow                                                                       | TypeScript                                          | Flow 可空支持                                          | TypeScript 可空支持                                   | Android (Java)                       | iOS (ObjC)                                                     |
| -------------------------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------- | ---------------------------------------------------- | ------------------------------------ | -------------------------------------------------------------- |
| `string`                                                                   | `string`                                            | `?string`                                               | <code>string &#124; null</code>                      | `string`                             | `NSString`                                                     |
| `boolean`                                                                  | `boolean`                                           | `?boolean`                                              | <code>boolean &#124; null</code>                     | `Boolean`                            | `NSNumber`                                                     |
| 对象字面量<br /><code>&#123;&#124; foo: string, ...&#124;&#125;</code>       | <code>&#123; foo: string, ...&#125; as const</code> | <code>?&#123;&#124; foo: string, ...&#124;&#125;</code> | <code>?&#123; foo: string, ...&#125; as const</code> | \-                                   | \-                                                             |
| 对象 [[1](#notes)]                                                         | 对象 [[1](#notes)]                                  | `?Object`                                               | <code>Object &#124; null</code>                      | `ReadableMap`                        | `@`（无类型字典）                                              |
| <code>Array&lt;T&gt;</code>                                                | <code>Array&lt;T&gt;</code>                         | <code>?Array&lt;T&gt;</code>                            | <code>Array&lt;T&gt; &#124; null</code>              | `ReadableArray`                      | `NSArray`（当用于对象内时使用 `RCTConvertVecToArray`）        |
| `Function`                                                                 | `Function`                                          | `?Function`                                             | <code>Function &#124; null</code>                    | \-                                   | \-                                                             |
| <code>Promise&lt;T&gt;</code>                                              | <code>Promise&lt;T&gt;</code>                       | <code>?Promise&lt;T&gt;</code>                          | <code>Promise&lt;T&gt; &#124; null</code>            | `com.facebook.react.bridge.Promise`  | `RCTPromiseResolve` 和 `RCTPromiseRejectBlock`                 |
| 类型联合<br /><code>'SUCCESS'&#124;'FAIL'</code>                          | 类型联合<br /><code>'SUCCESS'&#124;'FAIL'</code>    | 仅作为回调函数                                          |                                                      | \-                                   | \-                                                             |
| 回调<br />`() =>`                                                         | 回调<br />`() =>`                                   | 支持                                                    |                                                      | `com.facebook.react.bridge.Callback` | `RCTResponseSenderBlock`                                       |
| `number`                                                                   | `number`                                            | 不支持                                                  |                                                      | `double`                             | `NSNumber`                                                     |

### 备注：

**[1]** 我们强烈建议使用对象字面量替代对象。

:::info
你也可以参考 React Native 仓库中 `Libraries/` 目录内核心模块的 JavaScript 规范说明。
:::