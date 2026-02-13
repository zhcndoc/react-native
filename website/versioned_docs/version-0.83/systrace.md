---
id: systrace
title: Systrace（系统跟踪）
---

`Systrace` 是一个标准的 Android 基于标记的性能分析工具（安装 Android platform-tools 包时会一并安装）。被分析的代码块被起止标记包围，随后以彩色图表格式进行可视化。Android SDK 和 React Native 框架均提供了可以可视化的标准标记。

## 示例

`Systrace` 允许你用标签和整数值标记 JavaScript (JS) 事件。在 EasyProfiler 中捕获非定时（non-Timed）的 JS 事件。

```SnackPlayer name=Systrace%20Example
import React from 'react';
import {Button, Text, View, StyleSheet, Systrace} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  const enableProfiling = () => {
    Systrace.setEnabled(true); // 调用 setEnabled 来开启性能分析。
    Systrace.beginEvent('event_label');
    Systrace.counterEvent('event_label', 10);
  };

  const stopProfiling = () => {
    Systrace.endEvent();
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={[styles.header, styles.paragraph]}>
          React Native Systrace API
        </Text>
        <View style={styles.buttonsColumn}>
          <Button
            title="在 EasyProfiler 中捕获非定时的 JS 事件"
            onPress={() => enableProfiling()}
          />
          <Button
            title="停止捕获"
            onPress={() => stopProfiling()}
            color="#FF0000"
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    gap: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  paragraph: {
    fontSize: 25,
    textAlign: 'center',
  },
  buttonsColumn: {
    gap: 16,
  },
});

export default App;
```

---

# 参考

## 方法

### `isEnabled()`

```tsx
static isEnabled(): boolean;
```

---

### `beginEvent()`

```tsx
static beginEvent(eventName: string | (() => string), args?: EventArgs);
```

beginEvent / endEvent 用于在同一调用栈帧内开始并结束一次性能分析。

---

### `endEvent()`

```tsx
static endEvent(args?: EventArgs);
```

---

### `beginAsyncEvent()`

```tsx
static beginAsyncEvent(
  eventName: string | (() => string),
  args?: EventArgs,
): number;
```

beginAsyncEvent / endAsyncEvent 用于开始并结束一次性能分析，结束操作可以发生在线程之外或当前栈帧外，例如 await。返回的 cookie 变量应作为参数传递给 endAsyncEvent 来结束性能分析。

---

### `endAsyncEvent()`

```tsx
static endAsyncEvent(
  eventName: EventName,
  cookie: number,
  args?: EventArgs,
);
```

---

### `counterEvent()`

```tsx
static counterEvent(eventName: string | (() => string), value: number);
```

向 systrace 时间线上的 profileName 注册该值。