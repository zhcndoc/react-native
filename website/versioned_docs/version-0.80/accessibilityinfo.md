---
id: accessibilityinfo
title: AccessibilityInfo
---

有时知道设备是否当前激活了屏幕阅读器是很有用的。`AccessibilityInfo` API 就是为此设计的。你可以使用它来查询屏幕阅读器的当前状态，以及注册监听器以便在屏幕阅读器状态变化时收到通知。

## 示例

```SnackPlayer name=AccessibilityInfo%20Example&supportedPlatforms=android,ios
import React, {useState, useEffect} from 'react';
import {AccessibilityInfo, Text, StyleSheet} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => {
  const [reduceMotionEnabled, setReduceMotionEnabled] = useState(false);
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);

  useEffect(() => {
    const reduceMotionChangedSubscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      isReduceMotionEnabled => {
        setReduceMotionEnabled(isReduceMotionEnabled);
      },
    );
    const screenReaderChangedSubscription = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      isScreenReaderEnabled => {
        setScreenReaderEnabled(isScreenReaderEnabled);
      },
    );

    AccessibilityInfo.isReduceMotionEnabled().then(isReduceMotionEnabled => {
      setReduceMotionEnabled(isReduceMotionEnabled);
    });
    AccessibilityInfo.isScreenReaderEnabled().then(isScreenReaderEnabled => {
      setScreenReaderEnabled(isScreenReaderEnabled);
    });

    return () => {
      reduceMotionChangedSubscription.remove();
      screenReaderChangedSubscription.remove();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.status}>
          The reduce motion is {reduceMotionEnabled ? 'enabled' : 'disabled'}.
        </Text>
        <Text style={styles.status}>
          The screen reader is {screenReaderEnabled ? 'enabled' : 'disabled'}.
        </Text>
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
  status: {
    margin: 30,
  },
});

export default App;
```

---

# 参考

## 方法

### `addEventListener()`

```tsx
static addEventListener(
  eventName: AccessibilityChangeEventName | AccessibilityAnnouncementEventName,
  handler: (
    event: AccessibilityChangeEvent | AccessibilityAnnouncementFinishedEvent,
  ) => void,
): EmitterSubscription;
```

添加事件处理程序。支持的事件：

| 事件名称                                                                                 | 描述                                                                                                                                                                                                                                                                                              |
| ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `accessibilityServiceChanged`<br/><div className="label two-lines android">安卓</div> | 当某些服务（如 TalkBack、其他安卓辅助技术和第三方无障碍服务）启用时触发。事件处理程序的参数是一个布尔值。当某些无障碍服务启用时布尔值为 `true`，否则为 `false`。                          |
| `announcementFinished`<br/><div className="label two-lines ios">iOS</div>                | 当屏幕阅读器完成公告时触发。事件处理程序的参数是一个包含以下键的字典：<ul><li>`announcement`：屏幕阅读器公告的字符串。</li><li>`success`：一个布尔值，指示公告是否成功制作。</li></ul> |
| `boldTextChanged`<br/><div className="label two-lines ios">iOS</div>                     | 当粗文本切换状态变化时触发。事件处理程序的参数是一个布尔值。当启用粗文本时布尔值为 `true`，否则为 `false`。                                                                                                                             |
| `grayscaleChanged`<br/><div className="label two-lines ios">iOS</div>                    | 当灰度切换状态变化时触发。事件处理程序的参数是一个布尔值。当启用灰度时布尔值为 `true`，否则为 `false`。                                                                                                                         |
| `invertColorsChanged`<br/><div className="label two-lines ios">iOS</div>                 | 当反色切换状态变化时触发。事件处理程序的参数是一个布尔值。当启用反色时布尔值为 `true`，否则为 `false`。                                                                                                                     |
| `reduceMotionChanged`                                                                    | 当减少运动切换状态变化时触发。事件处理程序的参数是一个布尔值。当启用减少运动时（或当“开发者选项”中的“过渡动画缩放”为“动画关闭”时）布尔值为 `true`，否则为 `false`。                                  |
| `reduceTransparencyChanged`<br/><div className="label two-lines ios">iOS</div>           | 当减少透明度切换状态变化时触发。事件处理程序的参数是一个布尔值。当启用减少透明度时布尔值为 `true`，否则为 `false`。                                                                                                         |
| `screenReaderChanged`                                                                    | 当屏幕阅读器状态变化时触发。事件处理程序的参数是一个布尔值。当启用屏幕阅读器时布尔值为 `true`，否则为 `false`。                                                                                                                          |

---

### `announceForAccessibility()`

```tsx
static announceForAccessibility(announcement: string);
```

发布一个字符串供屏幕阅读器朗读。

---

### `announceForAccessibilityWithOptions()`

```tsx
static announceForAccessibilityWithOptions(
  announcement: string,
  options: {queue?: boolean},
);
```

发布一个字符串供屏幕阅读器朗读，并带有修改选项。默认情况下，公告会中断任何现有的语音，但在 iOS 上，可以通过在选项对象中将 `queue` 设置为 `true` 将它们排队在现有语音之后。

**参数：**

| 名称                                                              | 类型   | 描述                                                                                  |
| ----------------------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------- |
| announcement <div className="label basic required">必需</div> | string | 要公告的字符串                                                                   |
| options <div className="label basic required">必需</div>      | object | `queue` - 将公告排队在现有语音之后 <div className="label ios">iOS</div> |

---

### `getRecommendedTimeoutMillis()` <div className="label android">安卓</div>

```tsx
static getRecommendedTimeoutMillis(originalTimeout: number): Promise<number>;
```

获取用户需要的超时时间（毫秒）。
此值设置在“无障碍”设置的“采取行动时间（无障碍超时）”中。

**参数：**

| 名称                                                                 | 类型   | 描述                                                                           |
| -------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------- |
| originalTimeout <div className="label basic required">必需</div> | number | 如果未设置“无障碍超时”则返回的超时时间。以毫秒为单位指定。 |

---

### `isAccessibilityServiceEnabled()` <div className="label android">安卓</div>

```tsx
static isAccessibilityServiceEnabled(): Promise<boolean>;
```

检查是否启用了任何无障碍服务。这包括 TalkBack，也包括任何可能安装的第三方无障碍应用。如果只想检查是否启用了 TalkBack，请使用 [isScreenReaderEnabled](#isscreenreaderenabled)。返回一个解析为布尔值的 Promise。当某些无障碍服务启用时结果为 `true`，否则为 `false`。

> **注意**：如果你只想检查 TalkBack 的状态，请使用 [isScreenReaderEnabled](#isscreenreaderenabled)。

---

### `isBoldTextEnabled()` <div className="label ios">iOS</div>

```tsx
static isBoldTextEnabled(): Promise<boolean>:
```

查询当前是否启用了粗文本。返回一个解析为布尔值的 Promise。当启用粗文本时结果为 `true`，否则为 `false`。

---

### `isGrayscaleEnabled()` <div className="label ios">iOS</div>

```tsx
static isGrayscaleEnabled(): Promise<boolean>;
```

查询当前是否启用了灰度。返回一个解析为布尔值的 Promise。当启用灰度时结果为 `true`，否则为 `false`。

---

### `isInvertColorsEnabled()` <div className="label ios">iOS</div>

```tsx
static isInvertColorsEnabled(): Promise<boolean>;
```

查询当前是否启用了反色。返回一个解析为布尔值的 Promise。当启用反色时结果为 `true`，否则为 `false`。

---

### `isReduceMotionEnabled()`

```tsx
static isReduceMotionEnabled(): Promise<boolean>;
```

查询当前是否启用了减少运动。返回一个解析为布尔值的 Promise。当启用减少运动时结果为 `true`，否则为 `false`。

---

### `isReduceTransparencyEnabled()` <div className="label ios">iOS</div>

```tsx
static isReduceTransparencyEnabled(): Promise<boolean>;
```

查询当前是否启用了减少透明度。返回一个解析为布尔值的 Promise。当启用减少透明度时结果为 `true`，否则为 `false`。

---

### `isScreenReaderEnabled()`

```tsx
static isScreenReaderEnabled(): Promise<boolean>;
```

查询当前是否启用了屏幕阅读器。返回一个解析为布尔值的 Promise。当启用屏幕阅读器时结果为 `true`，否则为 `false`。

---

### `isHighTextContrastEnabled()` <div className="label android">安卓</div>

```tsx
static isHighTextContrastEnabled(): Promise<boolean>
```

查询当前是否启用了高文本对比度。返回一个解析为布尔值的 Promise。当启用高文本对比度时结果为 `true`，否则为 `false`。

---

### `isDarkerSystemColorsEnabled()` <div className="label ios">iOS</div>

```tsx
static isDarkerSystemColorsEnabled(): Promise<boolean>
```

查询当前是否启用了深色系统颜色。返回一个解析为布尔值的 Promise。当启用深色系统颜色时结果为 `true`，否则为 `false`。

---

### `prefersCrossFadeTransitions()` <div className="label ios">iOS</div>

```tsx
static prefersCrossFadeTransitions(): Promise<boolean>;
```

查询当前是否启用了减少运动和偏好交叉淡入淡出过渡设置。返回一个解析为布尔值的 Promise。当启用偏好交叉淡入淡出过渡时结果为 `true`，否则为 `false`。

---

### `setAccessibilityFocus()`

:::warning 已废弃
建议改用 `sendAccessibilityEvent` 并将 eventType 设为 `focus`。
:::

```tsx
static setAccessibilityFocus(reactTag: number);
```

将无障碍焦点设置到 React 组件。

在安卓上，这会调用 `UIManager.sendAccessibilityEvent` 方法，并传入 `reactTag` 和 `UIManager.AccessibilityEventTypes.typeViewFocused` 参数。

:::note
确保任何你想要接收无障碍焦点的 `View` 都有 `accessible={true}`。
:::

---

### `sendAccessibilityEvent()`

```tsx
static sendAccessibilityEvent(host: HostInstance, eventType: AccessibilityEventTypes);
```

命令式地在 React 组件上触发无障碍事件，例如改变屏幕阅读器的聚焦元素。

:::note
确保任何你想要接收无障碍焦点的 `View` 都有 `accessible={true}`。
:::

| 名称                                                           | 类型                    | 描述                                                                                                            |
| -------------------------------------------------------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| host <div className="label basic required">必需</div>      | HostInstance            | 要发送事件的组件 ref。                                                                                |
| eventType <div className="label basic required">必需</div> | AccessibilityEventTypes | `'click'`（仅安卓）、`'focus'`、`'viewHoverEnter'`（仅安卓）或 `'windowStateChange'`（仅安卓）之一 |
