---
id: appregistry
title: AppRegistry
---

<div className="banner-native-code-required">
  <h3>需要原生代码的项目</h3>
  <p>如果您使用的是托管的 Expo 工作流，则只有一个入口组件注册到 <code>AppRegistry</code>，并且它是自动处理的（或通过 <a href="https://docs.expo.dev/versions/latest/sdk/register-root-component/">registerRootComponent</a>）。您不需要使用此 API。</p>
</div>

`AppRegistry` 是运行所有 React Native 应用的 JS 入口点。应用根组件应该通过 `AppRegistry.registerComponent` 注册自己，然后原生系统可以加载应用的 bundle，并在准备就绪时通过调用 `AppRegistry.runApplication` 实际运行应用。

```tsx
import {Text, AppRegistry} from 'react-native';

const App = () => (
  <View>
    <Text>App1</Text>
  </View>
);

AppRegistry.registerComponent('Appname', () => App);
```

要在视图应该被销毁时“停止”应用，请使用传递给 `runApplication` 的 tag 调用 `AppRegistry.unmountApplicationComponentAtRootTag`。这两个应该总是成对使用。

`AppRegistry` 应该在 `require` 序列的早期被引入，以确保在其他模块被引入之前设置好 JS 执行环境。

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

注册一个可以取消的无头任务。无头任务是一段在没有 UI 的情况下运行的代码。

**参数：**

| 名称                                                                                  | 类型                                                 | 描述                                                                                                                                                                                                                         |
| ------------------------------------------------------------------------------------- | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| taskKey<br/><div className="label basic required two-lines">必需</div>            | string                                               | 调用 startHeadlessTask 时使用的此任务实例的原生 id。                                                                                                                                               |
| taskProvider<br/><div className="label basic required two-lines">必需</div>       | [TaskProvider](appregistry#taskprovider)             | 一个返回 promise 的函数，它将从原生侧传递的一些数据作为唯一参数。当 promise 被 resolve 或 reject 时，原生侧会收到此事件通知，并可能决定销毁 JS 上下文。 |
| taskCancelProvider<br/><div className="label basic required two-lines">必需</div> | [TaskCancelProvider](appregistry#taskcancelprovider) | 一个返回 void 的函数，不接受参数；当请求取消时，taskProvider 执行的函数应该收拾好并尽快返回。                                                                    |

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

注册一个无头任务。无头任务是一段在没有 UI 的情况下运行的代码。

这是一种当应用处于后台时在 JavaScript 中运行任务的方法。例如，它可以用于同步新数据、处理推送通知或播放音乐。

**参数：**

| 名称                                                                        | 类型                                     | 描述                                                                                                                                                                                                                         |
| --------------------------------------------------------------------------- | ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| taskKey <div className="label basic required two-lines">必需</div>      | string                                   | 调用 startHeadlessTask 时使用的此任务实例的原生 id。                                                                                                                                               |
| taskProvider <div className="label basic required two-lines">必需</div> | [TaskProvider](appregistry#taskprovider) | 一个返回 promise 的函数，它将从原生侧传递的一些数据作为唯一参数。当 promise 被 resolve 或 reject 时，原生侧会收到此事件通知，并可能决定销毁 JS 上下文。 |

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

有效的 `hook` 函数接受以下内容作为参数：

| 名称                                                                         | 类型               |
| ---------------------------------------------------------------------------- | ------------------ |
| component <div className="label basic required">必需</div>               | ComponentProvider  |
| scopedPerformanceLogger <div className="label basic required">必需</div> | IPerformanceLogger |

该函数还必须返回一个 React Component。

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

仅从原生代码调用。启动一个无头任务。

**参数：**

| 名称                                                         | 类型   | 描述                                                          |
| ------------------------------------------------------------ | ------ | -------------------------------------------------------------------- |
| taskId <div className="label basic required">必需</div>  | number | 此任务实例的原生 id，用于跟踪其执行。 |
| taskKey <div className="label basic required">必需</div> | string | 要启动的任务的 key。                                       |
| data <div className="label basic required">必需</div>    | any    | 传递给任务的数据。                                        |

---

### `unmountApplicationComponentAtRootTag()`

```tsx
static unmountApplicationComponentAtRootTag(rootTag: number);
```

当视图应该被销毁时停止应用。

**参数：**

| 名称                                                         | 类型   |
| ------------------------------------------------------------ | ------ |
| rootTag <div className="label basic required">必需</div> | number |

## 类型定义

### AppConfig

用于 `registerConfig` 方法的应用配置。

| 类型   |
| ------ |
| 对象 |

**属性:**

| 名称                                                        | 类型              |
| ----------------------------------------------------------- | ----------------- |
| appKey <div className="label basic required">必需</div> | 字符串            |
| component                                                   | ComponentProvider |
| run                                                         | 函数          |
| section                                                     | 布尔值           |

> **注意:** 每个配置都应设置 `component` 或 `run` 函数。

### Registry

| 类型   |
| ------ |
| 对象 |

**属性:**

| 名称      | 类型                                       |
| --------- | ------------------------------------------ |
| runnables | [Runnables](appregistry#runnable) 数组 |
| sections  | 字符串数组                           |

### Runnable

| 类型   |
| ------ |
| 对象 |

**属性:**

| 名称      | 类型              |
| --------- | ----------------- |
| component | ComponentProvider |
| run       | 函数          |

### Runnables

一个对象，其键为 `appKey`，值为 [`Runnable`](appregistry#runnable) 类型。

| 类型   |
| ------ |
| 对象 |

### Task

`Task` 是一个函数，接受任意数据作为参数，并返回一个解析为 `undefined` 的 Promise。

| 类型     |
| -------- |
| 函数 |

### TaskCanceller

`TaskCanceller` 是一个不接受参数且返回 void 的函数。

| 类型     |
| -------- |
| 函数 |

### TaskCancelProvider

有效的 `TaskCancelProvider` 是一个返回 [`TaskCanceller`](appregistry#taskcanceller) 的函数。

| 类型     |
| -------- |
| 函数 |

### TaskProvider

有效的 `TaskProvider` 是一个返回 [`Task`](appregistry#task) 的函数。

| 类型     |
| -------- |
| 函数 |
