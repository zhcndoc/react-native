---
id: reactnativeversion
title: ReactNativeVersion
---

```tsx
import {ReactNativeVersion} from 'react-native';
```

`ReactNativeVersion` API 用于获取 JS 端解析到的 `react-native` 包版本。应用和库可以用它检查兼容性，或启用特定版本的行为。

:::note

此外，公共 API 中已经提供了 [`Platform.constants.reactNativeVersion`](platform#constants)。**不过**，它返回的是各个平台上由原生端报告的 React Native 版本。

:::

## 示例

```tsx
import {ReactNativeVersion} from 'react-native';

const version = ReactNativeVersion.getVersionString(); // 0.88.1
const {major, minor, patch, prerelease} = ReactNativeVersion;
major; // 0
minor; // 88
patch; // 1
prerelease; // null
```

---

# 参考

## 属性

### `major`

```tsx
static major: number;
```

解析到的 `react-native` 包的主版本号。

---

### `minor`

```tsx
static minor: number;
```

解析到的 `react-native` 包的次版本号。

---

### `patch`

```tsx
static patch: number;
```

解析到的 `react-native` 包的修订版本号。

---

### `prerelease`

```tsx
static prerelease: string | null;
```

解析到的 `react-native` 包的预发布标签；稳定版返回 `null`。

## 方法

### `getVersionString()`

```tsx
static getVersionString(): string;
```

返回完整版本字符串，格式为 `major.minor.patch` 或 `major.minor.patch-prerelease`。
