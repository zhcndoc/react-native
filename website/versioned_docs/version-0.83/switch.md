---
id: switch
title: 开关
---

渲染一个布尔输入。

这是一个受控组件，需要一个 `onValueChange` 回调来更新 `value` 属性，以使组件反映用户操作。如果 `value` 属性没有被更新，组件将继续渲染提供的 `value` 属性，而不是任何用户操作的预期结果。

## 示例

```SnackPlayer name=Switch&supportedPlatforms=android,ios
import React, {useState} from 'react';
import {Switch, StyleSheet} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Switch
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
```

---

# 参考

## 属性

### [视图属性](view.md#props)

继承自 [视图属性](view.md#props)。

---

### `disabled`

如果为 true，用户将无法切换开关。

| 类型 | 默认值  |
| ---- | ------- |
| bool | `false` |

---

### `ios_backgroundColor` <div className="label ios">iOS</div>

在 iOS 上，开关背景的自定义颜色。该背景颜色可以在开关值为 `false` 或开关被禁用（并且开关半透明）时看到。

| 类型               |
| ------------------ |
| [颜色](colors.md) |

---

### `onChange`

当用户尝试更改开关的值时调用。接收变更事件作为参数。如果你只想接收新值，请改用 `onValueChange`。

| 类型     |
| -------- |
| 函数     |

---

### `onValueChange`

当用户尝试更改开关的值时调用。接收新的值作为参数。如果你想接收事件，请改用 `onChange`。

| 类型     |
| -------- |
| 函数     |

---

### `ref`

一个 ref 设置器，在挂载时将被赋值为一个 [元素节点](element-nodes)。

---

### `thumbColor`

开关手柄的前景色。如果在 iOS 上设置该颜色，开关手柄将不再有阴影。

| 类型               |
| ------------------ |
| [颜色](colors.md) |

---

### `trackColor`

开关轨道的自定义颜色。

_iOS_: 当开关值为 `false` 时，轨道会收缩成边框。如果你想更改被收缩轨道暴露的背景色，请使用 [`ios_backgroundColor`](switch.md#ios_backgroundColor)。

| 类型                                                             |
| ---------------------------------------------------------------- |
| `md 对象：{false: [颜色](colors), true: [颜色](colors)}`         |

---

### `value`

开关的值。如果为 true，开关将打开。默认值为 false。

| 类型 |
| ---- |
| bool |