# 附录

## I. 术语

- **Spec** - 描述 Turbo 原生模块或 Fabric 原生组件 API 的 TypeScript 或 Flow 代码。由 **Codegen** 用于生成样板代码。

- **原生模块** - 没有用户界面 (UI) 的原生库。例如持久存储、通知、网络事件。这些可以作为函数和对象被你的 JavaScript 应用程序代码访问。
- **原生组件** - 通过 React 组件可供应用程序 JavaScript 代码使用的原生平台视图。

- **旧版原生组件** - 运行在旧 React Native 架构上的组件。
- **旧版原生模块** - 运行在旧 React Native 架构上的模块。

## II. Codegen 类型

你可以使用下表作为参考，了解支持哪些类型以及它们在每个平台上的映射：

| Flow                                                                       | TypeScript                                          | Flow 可空支持                                   | TypeScript 可空支持                          | Android (Java)                       | iOS (ObjC)                                                     |
| -------------------------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------- | ---------------------------------------------------- | ------------------------------------ | -------------------------------------------------------------- |
| `string`                                                                   | `string`                                            | `?string`                                               | <code>string &#124; null</code>                      | `string`                             | `NSString`                                                     |
| `boolean`                                                                  | `boolean`                                           | `?boolean`                                              | <code>boolean &#124; null</code>                     | `Boolean`                            | `NSNumber`                                                     |
| 对象字面量<br /><code>&#123;&#124; foo: string, ...&#124;&#125;</code> | <code>&#123; foo: string, ...&#125; as const</code> | <code>?&#123;&#124; foo: string, ...&#124;&#125;</code> | <code>?&#123; foo: string, ...&#125; as const</code> | \-                                   | \-                                                             |
| 对象 [[1](#notes)]                                                       | 对象 [[1](#notes)]                                | `?Object`                                               | <code>Object &#124; null</code>                      | `ReadableMap`                        | `@` (未类型化的字典)                                       |
| <code>Array&lt;T&gt;</code>                                                | <code>Array&lt;T&gt;</code>                         | <code>?Array&lt;T&gt;</code>                            | <code>Array&lt;T&gt; &#124; null</code>              | `ReadableArray`                      | `NSArray` (或在对象内部使用时为 `RCTConvertVecToArray`) |
| `Function`                                                                 | `Function`                                          | `?Function`                                             | <code>Function &#124; null</code>                    | \-                                   | \-                                                             |
| <code>Promise&lt;T&gt;</code>                                              | <code>Promise&lt;T&gt;</code>                       | <code>?Promise&lt;T&gt;</code>                          | <code>Promise&lt;T&gt; &#124; null</code>            | `com.facebook.react.bridge.Promise`  | `RCTPromiseResolve` 和 `RCTPromiseRejectBlock`                |
| 类型联合<br /><code>'SUCCESS'&#124;'FAIL'</code>                        | 类型联合<br /><code>'SUCCESS'&#124;'FAIL'</code> | 仅作为回调                                       |                                                      | \-                                   | \-                                                             |
| 回调<br />`() =>`                                                     | 回调<br />`() =>`                              | 是                                                     |                                                      | `com.facebook.react.bridge.Callback` | `RCTResponseSenderBlock`                                       |
| `number`                                                                   | `number`                                            | 否                                                      |                                                      | `double`                             | `NSNumber`                                                     |

### 备注：

<b>[1]</b> 我们强烈建议使用对象字面量而不是对象。

:::info
你可能还会发现参考 React Native 中核心模块的 JavaScript 规范很有用。这些位于 React Native 仓库中的 `Libraries/` 目录内。
:::
