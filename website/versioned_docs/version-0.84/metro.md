---
id: metro
title: Metro
---

React Native 使用 [Metro](https://metrobundler.dev/) 来构建你的 JavaScript 代码和资源。

## 配置 Metro

Metro 的配置选项可以在你项目的 `metro.config.js` 文件中定制。该文件可以导出以下两种之一：

- **一个对象（推荐）**，该对象会覆盖 Metro 的内部配置默认值。
- [**一个函数**](#advanced-using-a-config-function)，该函数接收 Metro 的内部配置默认值作为参数，并应返回最终的配置对象。

:::tip
请参阅 Metro 官网的[**配置 Metro**](https://metrobundler.dev/docs/configuration)文档，了解所有可用的配置选项。
:::

在 React Native 中，你的 Metro 配置应继承自 [`@react-native/metro-config`](https://www.npmjs.com/package/@react-native/metro-config) 或 [`@expo/metro-config`](https://www.npmjs.com/package/@expo/metro-config)。这些包包含了构建和运行 React Native 应用程序所必需的重要默认配置。

下面是 React Native 模板项目中默认的 `metro.config.js` 文件示例：

<!-- prettier-ignore -->
```js
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro 配置
 * https://metrobundler.dev/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
```

你想自定义的 Metro 选项可以写在 `config` 对象内。

### 高级用法：使用配置函数

导出一个配置函数相当于你自己管理最终的配置 —— **Metro 不会应用任何内部默认值**。当你需要读取 Metro 提供的基础默认配置对象或动态设置选项时，这种方式非常有用。

:::info
**从 `@react-native/metro-config` 0.72.1 版本开始**，不再需要通过配置函数来访问完整的默认配置。请看下方的 **提示** 部分。
:::

<!-- prettier-ignore -->
```js
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

module.exports = function (baseConfig) {
  const defaultConfig = mergeConfig(baseConfig, getDefaultConfig(__dirname));
  const {resolver: {assetExts, sourceExts}} = defaultConfig;

  return mergeConfig(
    defaultConfig,
    {
      resolver: {
        assetExts: assetExts.filter(ext => ext !== 'svg'),
        sourceExts: [...sourceExts, 'svg'],
      },
    },
  );
};
```

:::tip
使用配置函数适合高级用例。一个更简单的方法，比如自定义 `sourceExts`，是直接从 `@react-native/metro-config` 读取默认值。

**替代方案**

<!-- prettier-ignore -->
```js
const defaultConfig = getDefaultConfig(__dirname);

const config = {
  resolver: {
    sourceExts: [...defaultConfig.resolver.sourceExts, 'svg'],
  },
};

module.exports = mergeConfig(defaultConfig, config);
```

**但是！** 我们推荐在覆盖这些配置值时先复制一份并编辑 —— 将配置源头放在你的配置文件中。

✅ **推荐做法**

<!-- prettier-ignore -->
```js
const config = {
  resolver: {
    sourceExts: ['js', 'ts', 'tsx', 'svg'],
  },
};
```

:::

## 了解更多关于 Metro

- [Metro 官网](https://metrobundler.dev/)
- [视频：“Metro 和 React Native 开发体验” — App.js 2023 讲座](https://www.youtube.com/watch?v=c9D4pg0y9cI)