---
id: switch
title: 开关
---

渲染一个布尔输入。

这是一个受控组件，需要一个 `onValueChange` 回调来更新 `value` 属性，以便组件反映用户操作。如果 `value` 属性未更新，组件将继续渲染所提供的 `value` 属性，而不是任何用户操作的预期结果。

## 示例

```SnackPlayer name=Switch&supportedPlatforms=android,ios
import {useState} from 'react';
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

### [View Props](view.md#props)

继承 [View Props](view.md#props)。

---

### `disabled`

如果为 true，用户将无法切换开关。

| Type | Default |
| ---- | ------- |
| bool | `false` |

---

### `ios_backgroundColor` <div className="label ios">iOS</div>

在 iOS 上，背景的自定义颜色。当开关值为 `false` 时，或者当开关被禁用（且开关是半透明的）时，都可以看到此背景色。

| Type               |
| ------------------ |
| [color](colors.md) |

---

### `onChange`

当用户尝试更改开关值时调用。接收更改事件作为参数。如果你只想接收新值，请改用 `onValueChange`。

| Type     |
| -------- |
| function |

---

### `onValueChange`

当用户尝试更改开关值时调用。接收新值作为参数。如果你想改为接收事件，请使用 `onChange`。

| Type     |
| -------- |
| function |

---

### `ref`

挂载时会被赋值为 [element node](element-nodes) 的 ref 设置器。

---

### `thumbColor`

前景开关滑块的颜色。如果在 iOS 上设置此项，开关滑块将失去其投影。

| Type               |
| ------------------ |
| [color](colors.md) |

---

### `trackColor`

开关轨道的自定义颜色。

_iOS_：当开关值为 `false` 时，轨道会缩进到边框中。如果你想更改收缩后的轨道露出的背景颜色，请使用 [`ios_backgroundColor`](switch.md#ios_backgroundColor)。

| Type                                                         |
| ------------------------------------------------------------ |
| `md object: {false: [color](colors), true: [color](colors)}` |

---

### `value`

开关的值。如果为 true，开关将处于开启状态。默认值为 false。

| Type |
| ---- |
| bool |
