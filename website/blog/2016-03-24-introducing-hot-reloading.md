---
title: 介绍热重载
author: Martín Bigio
authorTitle: Instagram 软件工程师
authorURL: 'https://twitter.com/martinbigio'
authorImageURL: 'https://avatars3.githubusercontent.com/u/535661?v=3&s=128'
authorTwitter: martinbigio
tags: [engineering]
---

React Native 的目标是为你提供最佳的开发者体验。重要的一部分是从你保存文件到能够看到更改之间所花费的时间。我们的目标是把这个反馈循环控制在 1 秒以内，即使你的应用日益庞大。

我们通过三个主要特性接近了这个理想：

- 使用 JavaScript 作为语言，它没有漫长的编译周期。
- 实现了一个名为 Packager 的工具，将 es6/flow/jsx 文件转换成虚拟机可以理解的普通 JavaScript。它设计成一个服务器，在内存中保持中间状态以实现快速的增量更改，并利用多核 CPU。
- 构建了一个叫做 Live Reload 的功能，在保存时重新加载应用。

此时，开发者的瓶颈不再是应用加载时间，而是丢失应用状态。一个常见场景是你正在开发一个多屏幕外的功能。每次重载，你都必须反复点击同一路径返回功能界面，使得循环花费数秒。

## 热重载

热重载的理念是在保持应用运行的同时，在运行时注入你编辑的文件的新版本。这样你就不会丢失任何状态，特别适合调整 UI 时使用。

一张图胜千言。看看 Live Reload（当前）和 Hot Reload（新）的区别。

<iframe
  width="100%"
  height="315"
  src="https://www.youtube.com/embed/2uQzVi-KFuc"
  frameborder="0"
  allowfullscreen></iframe>

仔细看，你会发现它可以从红色错误界面恢复，也可以开始导入之前不存在的模块，无需完整重载。

**警告：** 由于 JavaScript 是一个高度状态化的语言，热重载无法完美实现。实际上，我们发现当前的方案已能较好地应对大多数常用场景，且如若发生错误总可以进行完整重载。

热重载自 0.22 版本起可用，你可以这样开启：

- 打开开发者菜单
- 点击“Enable Hot Reloading”

## 实现简述

了解了为什么要用以及如何使用后，趣味部分来了：它实际上是如何工作的。

热重载基于一种名为 [Hot Module Replacement](https://webpack.js.org/guides/hot-module-replacement/)（简称 HMR）的功能。这最初由 webpack 引入，我们在 React Native Packager 中实现了它。HMR 使 Packager 监听文件变更，并向应用中包含的轻量 HMR 运行时发送更新。

简言之，HMR 更新包含了修改后 JS 模块的新代码。运行时收到后，会用新代码替换旧代码：

![](/blog/assets/hmr-architecture.png)

HMR 更新不仅仅包含要更改模块的代码，因为光替换代码还不足以让运行时认知变更。问题在于模块系统可能已缓存了想要更新模块的 _exports_。举例说明，假设应用由以下两个模块组成：

```
// log.js
function log(message) {
  const time = require('./time');
  console.log(`[${time()}] ${message}`);
}

module.exports = log;
```

```
// time.js
function time() {
  return new Date().getTime();
}

module.exports = time;
```

模块 `log` 会输出一条包含当前日期（由模块 `time` 提供）的消息。

打包后，React Native 使用 `__d` 函数注册每个模块到模块系统。对于该应用，`log` 模块会有如下定义：

```
__d('log', function() {
  ... // 模块代码
});
```

该调用将每个模块代码包裹在匿名函数中，通常称之为工厂函数。模块系统运行时跟踪每个模块的工厂函数，是否已执行过，以及执行结果（exports）。当某模块被引用，模块系统会返回缓存的 exports，或者首次执行工厂函数并缓存结果。

假设启动应用并引用 `log` 模块，此时 `log` 和 `time` 的工厂函数都未执行，exports 还未缓存。之后用户修改 `time` 函数让它返回 `MM/DD` 格式的日期：

```js
// time.js
function bar() {
  const date = new Date();
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

module.exports = bar;
```

Packager 会发送 `time` 模块的新代码到运行时（步骤 1），当 `log` 模块最终被引用并执行时，会使用修改后的 `time`（步骤 2）：

![](/blog/assets/hmr-step.png)

如果 `log` 模块中的 `require('time')` 是顶级调用：

```
const time = require('./time'); // 顶级 require

// log.js
function log(message) {
  console.log(`[${time()}] ${message}`);
}

module.exports = log;
```

当 `log` 被引用时，运行时会缓存它和 `time` 的 exports（步骤 1）。之后 `time` 变更时，HMR 进程不能只替换 `time` 的代码直接结束，否则 `log` 执行时仍会使用缓存的旧 `time` 代码。

为了让 `log` 拥抱 `time` 的改变，必须清除 `log` 的缓存 exports，因为它依赖的模块被热替换了（步骤 3）。最后，下一次 `log` 被引用时，工厂函数会被重新执行，进而使用新 `time` 代码。

![](/blog/assets/hmr-log.png)

## HMR API

React Native 中的 HMR 扩展了模块系统，新增了 `hot` 对象。该 API 基于 [webpack](https://webpack.github.io/hot-module-replacement.md) 的实现。`hot` 对象暴露了 `accept` 函数，允许你定义模块被热替换时调用的回调。例如，如果我们修改 `time`，每次保存时，控制台都会输出 “time changed”：

```
// time.js
function time() {
  ... // 新代码
}

module.hot.accept(() => {
  console.log('time changed');
});

module.exports = time;
```

注意手动使用该 API 的情况很少见。热重载默认对大多数场景开箱即用。

## HMR 运行时

如前所述，仅仅接受 HMR 更新有时不够，因为使用该模块的上层模块可能已执行且导入被缓存。举例来说，假设电影示例应用的依赖树顶层有个 `MovieRouter`，其依赖 `MovieSearch` 和 `MovieScreen` 视图，这些视图又依赖前面示例中的 `log` 和 `time` 模块：

![](/blog/assets/hmr-diamond.png)

用户访问了电影搜索视图，但未访问另一个视图，除 `MovieScreen` 外，其他模块都缓存了 exports。如果修改了 `time`，运行时会清除 `log` 的缓存 exports 以反映 `time` 的变更。这个过程还会递归上溯所有父模块并尝试接受它们的更新。对于未被引用的 `MovieScreen`，会跳过；对 `MovieSearch`，清除缓存后递归处理其父级；最终对 `MovieRouter` 采用相同处理，之后结束，因为没有父模块依赖它。

运行时为进行依赖树递归，会从 Packager 那里在 HMR 更新中获得逆向依赖树。对于此例，运行时会收到了如下类型的 JSON 对象：

```
{
  modules: [
    {
      name: 'time',
      code: /* time 的新代码 */
    }
  ],

  inverseDependencies: {
    MovieRouter: [],
    MovieScreen: ['MovieRouter'],
    MovieSearch: ['MovieRouter'],
    log: ['MovieScreen', 'MovieSearch'],
    time: ['log'],
  }
}
```

## React 组件

React 组件更难支持热重载，因为不能简单替换旧代码否则会丢失组件状态。对于 React Web 应用，[Dan Abramov](https://twitter.com/dan_abramov) 实现了 babel [transform](https://gaearon.github.io/react-hot-loader/)，结合 webpack 的 HMR API 解决了这个问题。简而言之，他的方案是在 _transform 阶段_ 为每个 React 组件创建一个代理。这些代理持有组件状态，并将生命周期方法委托给实际组件，后者是被热重载的目标：

![](/blog/assets/hmr-proxy.png)

除了创建代理组件，该 transform 还定义了 `accept` 函数，代码强制 React 重新渲染组件。这样，我们就能在不丢失任何应用状态的前提下热重载渲染代码。

React Native 默认的 [transformer](https://github.com/facebook/react-native/blob/master/packager/transformer.js#L92-L95) 使用 `babel-preset-react-native`，其中 [配置](https://github.com/facebook/react-native/blob/master/babel-preset/configs/hmr.js#L24-L31) 了 `react-transform`，用法与 React Web + webpack 项目相同。

## Redux Store

要为 [Redux](https://redux.js.org/) store 启用热重载，只需像在 webpack Web 项目中一样使用 HMR API：

```
// configureStore.js
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducer from '../reducers';

export default function configureStore(initialState) {
  const store = createStore(
    reducer,
    initialState,
    applyMiddleware(thunk),
  );

  if (module.hot) {
    module.hot.accept(() => {
      const nextRootReducer = require('../reducers/index').default;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
};
```

修改 reducer 后，接受该 reducer 的代码会被发送到客户端，然后客户端会意识到 reducer 自身无法接受热替换，因此会查找引用它的所有模块并尝试接受。最终，这个流程会到达单一的 store —— `configureStore` 模块，在那里接受 HMR 更新。

## 总结

如果你有兴趣帮助改进热重载，建议阅读 [Dan Abramov 关于热重载未来的文章](https://medium.com/@dan_abramov/hot-reloading-in-react-1140438583bf#.jmivpvmz4) 并参与贡献。例如，Johny Days 正在 [实现支持多客户端连接](https://github.com/facebook/react-native/pull/6179)。我们期待大家一起维护和改进这项功能。

React Native 给了我们机会重新思考构建应用的方式，以打造极佳的开发体验。热重载只是拼图中的一片，还有哪些疯狂的黑科技，我们能让开发体验更好呢？