---
id: appregistry
title: AppRegistry
---

<div className="banner-native-code-required">
  <h3>需要原生代码的项目</h3>
  <p>如果你使用的是托管式 Expo 工作流，那么始终只会注册一个进入组件到 <code>AppRegistry</code>，并且它会被自动处理（或通过 <a href="https://docs.expo.dev/versions/latest/sdk/register-root-component/">registerRootComponent</a>）。你不需要使用此 API。</p>
</div>

`AppRegistry` 是运行所有 React Native 应用的 JS 入口点。应用根组件应通过 `AppRegistry.registerComponent` 自行注册，然后原生系统就可以为应用加载 bundle，并在准备就绪时通过调用 `AppRegistry.runApplication` 实际运行应用。

```tsx
import {Text, AppRegistry} from 'react-native';

const App = () => (
  <View>
    <Text>App1</Text>
  </View>
);

AppRegistry.registerComponent('Appname', () => App);
```

当某个视图应该被销毁时，要“停止”一个应用，请使用传入 `runApplication` 的标签调用 `AppRegistry.unmountApplicationComponentAtRootTag`。这两个方法应始终成对使用。

应尽早在 `require` 序列中引入 `AppRegistry`，以确保在要求加载其他模块之前，JS 执行环境已经完成设置。

---

# 参考

## 方法

### `getAppKeys()`

```tsx
static getAppKeys(): string[];
```

返回一个字符串数组。

---

### `getRegistry()`

```tsx
static getRegistry(): {sections: string[]; runnables: Runnable[]};
```

返回一个 [Registry](appregistry#registry) 对象。

---

### `getRunnable()`

```tsx
static getRunnable(appKey: string): : Runnable | undefined;
```

返回一个 [Runnable](appregistry#runnable) 对象。

**参数：**

| 名称                                                        | 类型   |
| ----------------------------------------------------------- | ------ |
| appKey <div className="label basic required">必需</div> | string |

---

### `getSectionKeys()`

```tsx
static getSectionKeys(): string[];
```

返回一个字符串数组。

---

### `getSections()`

```tsx
static getSections(): Record<string, Runnable>;
```

返回一个 [Runnables](appregistry#runnables) 对象。

---

### `registerCancellableHeadlessTask()`

```tsx
static registerCancellableHeadlessTask(
  taskKey: string,
  taskProvider: TaskProvider,
  taskCancelProvider: TaskCancelProvider,
);
```

注册一个可取消的无界面任务。无界面任务是一段在没有 UI 的情况下运行的代码。

**参数：**

| 名称                                                                                  | 类型                                                 | 描述                                                                                                                                                                                                                         |
| ------------------------------------------------------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| taskKey<br/><div className="label basic required two-lines">必需</div>            | string                                               | 该任务实例的原生 id，在调用 startHeadlessTask 时使用。                                                                                                                                               |
| taskProvider<br/><div className="label basic required two-lines">必需</div>       | [TaskProvider](appregistry#taskprovider)             | 一个返回 promise 的函数，它接受从原生端传入的一些数据作为唯一参数。当 promise 被解析或拒绝时，原生端会收到该事件通知，并且它可能决定销毁 JS 上下文。 |
| taskCancelProvider<br/><div className="label basic required two-lines">必需</div> | [TaskCancelProvider](appregistry#taskcancelprovider) | 一个返回 void 的函数，不接受任何参数；当请求取消时，taskProvider 正在执行的函数应尽快结束并返回。                                                                    |

---

### `registerComponent()`

```tsx
static registerComponent(
  appKey: string,
  getComponentFunc: ComponentProvider,
  section?: boolean,
): string;
```

**参数：**

| 名称                                                                   | 类型              |
| ---------------------------------------------------------------------- | ----------------- |
| appKey <div className="label basic required">必需</div>            | string            |
| componentProvider <div className="label basic required">必需</div> | ComponentProvider |
| section                                                                | boolean           |

---

### `registerConfig()`

```tsx
static registerConfig(config: AppConfig[]);
```

**参数：**

| 名称                                                        | 类型                                 |
| ----------------------------------------------------------- | ------------------------------------ |
| config <div className="label basic required">必需</div> | [AppConfig](appregistry#appconfig)[] |

---

### `registerHeadlessTask()`

```tsx
static registerHeadlessTask(
  taskKey: string,
  taskProvider: TaskProvider,
);
```

注册一个无界面任务。无界面任务是一段在没有 UI 的情况下运行的代码。

这是一种在应用处于后台时用 JavaScript 运行任务的方法。例如，它可用于同步新数据、处理推送通知或播放音乐。

**参数：**

| 名称                                                                        | 类型                                     | 描述                                                                                                                                                                                                                         |
| --------------------------------------------------------------------------- | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| taskKey <div className="label basic required two-lines">必需</div>      | string                                   | 该任务实例的原生 id，在调用 startHeadlessTask 时使用。                                                                                                                                               |
| taskProvider <div className="label basic required two-lines">必需</div> | [TaskProvider](appregistry#taskprovider) | 一个返回 promise 的函数，它接受从原生端传入的一些数据作为唯一参数。当 promise 被解析或拒绝时，原生端会收到该事件通知，并且它可能决定销毁 JS 上下文。 |

---

### `registerRunnable()`

```tsx
static registerRunnable(appKey: string, func: Runnable): string;
```

**参数：**

| 名称                                                        | 类型     |
| ----------------------------------------------------------- | -------- |
| appKey <div className="label basic required">必需</div> | string   |
| run <div className="label basic required">必需</div>    | function |

---

### `registerSection()`

```tsx
static registerSection(
  appKey: string,
  component: ComponentProvider,
);
```

**参数：**

| 名称                                                           | 类型              |
| -------------------------------------------------------------- | ----------------- |
| appKey <div className="label basic required">必需</div>    | string            |
| component <div className="label basic required">必需</div> | ComponentProvider |

---

### `runApplication()`

```tsx
static runApplication(appKey: string, appParameters: any): void;
```

加载 JavaScript bundle 并运行应用。

**参数：**

| 名称                                                               | 类型   |
| ------------------------------------------------------------------ | ------ |
| appKey <div className="label basic required">必需</div>        | string |
| appParameters <div className="label basic required">必需</div> | any    |

---

### `setComponentProviderInstrumentationHook()`

```tsx
static setComponentProviderInstrumentationHook(
  hook: ComponentProviderInstrumentationHook,
);
```

**参数：**

| 名称                                                      | 类型     |
| --------------------------------------------------------- | -------- |
| hook <div className="label basic required">必需</div> | function |

一个有效的 `hook` 函数接受以下参数：

| 名称                                                                         | 类型               |
| ---------------------------------------------------------------------------- | ------------------ |
| component <div className="label basic required">必需</div>               | ComponentProvider  |
| scopedPerformanceLogger <div className="label basic required">必需</div> | IPerformanceLogger |

该函数还必须返回一个 React 组件。

---

### `setWrapperComponentProvider()`

```tsx
static setWrapperComponentProvider(
  provider: WrapperComponentProvider,
);
```

**参数：**

| 名称                                                          | 类型              |
| ------------------------------------------------------------- | ----------------- |
| provider <div className="label basic required">必需</div> | ComponentProvider |

---

### `startHeadlessTask()`

```tsx
static startHeadlessTask(
  taskId: number,
  taskKey: string,
  data: any,
);
```

仅由原生代码调用。启动一个无界面任务。

**参数：**

| 名称                                                         | 类型   | 描述                                                          |
| ------------------------------------------------------------ | ------ | -------------------------------------------------------------------- |
| taskId <div className="label basic required">必需</div>  | number | 该任务实例的原生 id，用于跟踪其执行。 |
| taskKey <div className="label basic required">必需</div> | string | 要启动的任务键。                                       |
| data <div className="label basic required">必需</div>    | any    | 要传递给任务的数据。                                        |

---

### `unmountApplicationComponentAtRootTag()`

```tsx
static unmountApplicationComponentAtRootTag(rootTag: number);
```

当某个视图应该被销毁时，停止一个应用。

**参数：**

| 名称                                                         | 类型   |
| ------------------------------------------------------------ | ------ |
| rootTag <div className="label basic required">必需</div> | number |

## 类型定义

### AppConfig

`registerConfig` 方法的应用配置。

| Type   |
| ------ |
| object |

**属性：**

| Name                                                        | Type              |
| ----------------------------------------------------------- | ----------------- |
| appKey <div className="label basic required">必填</div> | string            |
| component                                                   | ComponentProvider |
| run                                                         | function          |
| section                                                     | boolean           |

:::note
每个配置都应设置 `component` 或 `run` 函数。
:::

### Registry

| Type   |
| ------ |
| object |

**属性：**

| Name      | Type                                       |
| --------- | ------------------------------------------ |
| runnables | array of [Runnables](appregistry#runnable) |
| sections  | array of strings                           |

### Runnable

| Type   |
| ------ | ----------------- |
| object |

**属性：**

| Name      | Type              |
| --------- | ----------------- |
| component | ComponentProvider |
| run       | function          |

### Runnables

一个以 `appKey` 为键、以 [`Runnable`](appregistry#runnable) 类型为值的对象。

| Type   |
| ------ |
| object |

### Task

`Task` 是一个函数，它接受任意数据作为参数，并返回一个解析为 `undefined` 的 Promise。

| Type     |
| -------- |
| function |

### TaskCanceller

`TaskCanceller` 是一个不接受参数并返回 void 的函数。

| Type     |
| -------- |
| function |

### TaskCancelProvider

有效的 `TaskCancelProvider` 是一个返回 [`TaskCanceller`](appregistry#taskcanceller) 的函数。

| Type     |
| -------- |
| function |

### TaskProvider

有效的 `TaskProvider` 是一个返回 [`Task`](appregistry#task) 的函数。

| Type     |
| -------- |
| function |
