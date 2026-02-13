---
id: appregistry
title: AppRegistry
---

<div className="banner-native-code-required">
  <h3>需要原生代码的项目</h3>
  <p>如果您使用托管的 Expo 工作流，则 <code>AppRegistry</code> 中注册的入口组件始终只有一个，并且由系统自动处理（或通过 <a href="https://docs.expo.dev/versions/latest/sdk/register-root-component/">registerRootComponent</a>）。您无需使用此 API。</p>
</div>

`AppRegistry` 是运行所有 React Native 应用的 JS 入口点。应用根组件应通过 `AppRegistry.registerComponent` 注册自己，然后原生系统可以加载该应用的 bundle 并在准备好后通过调用 `AppRegistry.runApplication` 来实际运行应用。

```tsx
import {Text, AppRegistry} from 'react-native';

const App = () => (
  <View>
    <Text>App1</Text>
  </View>
);

AppRegistry.registerComponent('Appname', () => App);
```

当视图应被销毁时，要“停止”一个应用，请使用传入 `runApplication` 的 tag 调用 `AppRegistry.unmountApplicationComponentAtRootTag`。这两个方法应总是成对使用。

`AppRegistry` 应该在 `require` 顺序中尽早被引入，以确保 JS 执行环境在加载其他模块前被设置好。

---

# 参考

## 方法

### `getAppKeys()`

```tsx
static getAppKeys(): string[];
```

返回字符串数组。

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

| 名称                                                         | 类型     |
| ------------------------------------------------------------ | -------- |
| appKey <div className="label basic required">必需</div>      | string   |

---

### `getSectionKeys()`

```tsx
static getSectionKeys(): string[];
```

返回字符串数组。

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

注册一个可取消的无界面任务。无界面任务是指无需 UI 进行运行的代码。

**参数：**

| 名称                                                                                  | 类型                                                 | 说明                                                                                                                                                                                                                           |
| ------------------------------------------------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| taskKey<br/><div className="label basic required two-lines">必需</div>                 | string                                               | 此任务实例的原生 ID，在调用 startHeadlessTask 时使用。                                                                                                                                                                        |
| taskProvider<br/><div className="label basic required two-lines">必需</div>            | [TaskProvider](appregistry#taskprovider)             | 一个返回 Promise 的函数，该函数接受来自原生端传递的数据作为唯一参数。当 Promise 解析或拒绝时，原生端将接收到该事件通知，可能决定销毁 JS 上下文。                                                                       |
| taskCancelProvider<br/><div className="label basic required two-lines">必需</div>      | [TaskCancelProvider](appregistry#taskcancelprovider) | 一个无参数且无返回值的函数；当请求取消时，正在执行的 taskProvider 中的函数应尽快结束并返回。                                                                                                                                |

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

| 名称                                                                 | 类型              |
| -------------------------------------------------------------------- | ----------------- |
| appKey <div className="label basic required">必需</div>              | string            |
| componentProvider <div className="label basic required">必需</div>   | ComponentProvider |
| section                                                              | boolean           |

---

### `registerConfig()`

```tsx
static registerConfig(config: AppConfig[]);
```

**参数：**

| 名称                                                                   | 类型                                   |
| ---------------------------------------------------------------------- | ------------------------------------ |
| config <div className="label basic required">必需</div>                | [AppConfig](appregistry#appconfig)[] |

---

### `registerHeadlessTask()`

```tsx
static registerHeadlessTask(
  taskKey: string,
  taskProvider: TaskProvider,
);
```

注册一个无界面任务。无界面任务是无需 UI 即可运行的代码。

这是一种在应用处于后台时运行 JavaScript 任务的方法。例如可以用来同步最新数据、处理推送通知或播放音乐。

**参数：**

| 名称                                                                                  | 类型                                                 | 说明                                                                                                                                                                                                                           |
| ------------------------------------------------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| taskKey<br/><div className="label basic required two-lines">必需</div>                 | string                                               | 此任务实例的原生 ID，在调用 startHeadlessTask 时使用。                                                                                                                                                                        |
| taskProvider<br/><div className="label basic required two-lines">必需</div>            | [TaskProvider](appregistry#taskprovider)             | 一个返回 Promise 的函数，该函数接受来自原生端传递的数据作为唯一参数。当 Promise 解析或拒绝时，原生端将接收到该事件通知，可能决定销毁 JS 上下文。                                                                       |

---

### `registerRunnable()`

```tsx
static registerRunnable(appKey: string, func: Runnable): string;
```

**参数：**

| 名称                                                         | 类型     |
| ------------------------------------------------------------ | -------- |
| appKey <div className="label basic required">必需</div>      | string   |
| run <div className="label basic required">必需</div>         | function |

---

### `registerSection()`

```tsx
static registerSection(
  appKey: string,
  component: ComponentProvider,
);
```

**参数：**

| 名称                                                        | 类型              |
| ----------------------------------------------------------- | ----------------- |
| appKey <div className="label basic required">必需</div>     | string            |
| component <div className="label basic required">必需</div>  | ComponentProvider |

---

### `runApplication()`

```tsx
static runApplication(appKey: string, appParameters: any): void;
```

加载 JavaScript bundle 并运行应用。

**参数：**

| 名称                                                          | 类型   |
| ------------------------------------------------------------- | ------ |
| appKey <div className="label basic required">必需</div>       | string |
| appParameters <div className="label basic required">必需</div> | any    |

---

### `setComponentProviderInstrumentationHook()`

```tsx
static setComponentProviderInstrumentationHook(
  hook: ComponentProviderInstrumentationHook,
);
```

**参数：**

| 名称                                                       | 类型     |
| ---------------------------------------------------------- | -------- |
| hook <div className="label basic required">必需</div>      | function |

一个有效的 `hook` 函数应接受以下参数：

| 名称                                                               | 类型               |
| ------------------------------------------------------------------ | ------------------ |
| component <div className="label basic required">必需</div>        | ComponentProvider  |
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
| provider <div className="label basic required">必需</div>     | ComponentProvider |

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

| 名称                                                           | 类型     | 说明                                           |
| -------------------------------------------------------------- | -------- | ---------------------------------------------- |
| taskId <div className="label basic required">必需</div>        | number   | 用于跟踪该任务执行的原生实例 ID。              |
| taskKey <div className="label basic required">必需</div>       | string   | 要启动的任务的键名。                            |
| data <div className="label basic required">必需</div>          | any      | 传递给任务的数据。                              |

---

### `unmountApplicationComponentAtRootTag()`

```tsx
static unmountApplicationComponentAtRootTag(rootTag: number);
```

当视图需要销毁时停止应用。

**参数：**

| 名称                                                           | 类型     |
| -------------------------------------------------------------- | -------- |
| rootTag <div className="label basic required">必需</div>       | number   |

## 类型定义

### AppConfig

`registerConfig` 方法所使用的应用配置。

| 类型   |
| ------ |
| object |

**属性：**

| 名称                                                         | 类型              |
| ------------------------------------------------------------ | ----------------- |
| appKey <div className="label basic required">必需</div>      | string            |
| component                                                   | ComponentProvider |
| run                                                         | function          |
| section                                                     | boolean           |

:::note
每个配置都应设置 `component` 或 `run` 函数中的一个。
:::

### Registry

| 类型   |
| ------ |
| object |

**属性：**

| 名称       | 类型                                        |
| ---------- | ------------------------------------------- |
| runnables  | [Runnable](appregistry#runnable) 数组       |
| sections   | 字符串数组                                 |

### Runnable

| 类型   |
| ------ |
| object |

**属性：**

| 名称        | 类型              |
| ----------- | ----------------- |
| component   | ComponentProvider |
| run         | function          |

### Runnables

一个键名为 `appKey`，键值类型为 [`Runnable`](appregistry#runnable) 的对象。

| 类型   |
| ------ |
| object |

### Task

一个函数，接受任意数据作为参数，返回 Promise 并最终解析为 `undefined`。

| 类型     |
| -------- |
| function |

### TaskCanceller

一个无参数、无返回值的函数。

| 类型     |
| -------- |
| function |

### TaskCancelProvider

一个函数，返回一个 [`TaskCanceller`](appregistry#taskcanceller)。

| 类型     |
| -------- |
| function |

### TaskProvider

一个函数，返回一个 [`Task`](appregistry#task)。

| 类型     |
| -------- |
| function |