---
id: accessibilityinfo
title: AccessibilityInfo
---

有时，了解设备是否有当前处于活动状态的屏幕阅读器很有用。`AccessibilityInfo` API 就是为此目的而设计的。你可以使用它查询屏幕阅读器的当前状态，也可以注册监听器，以便在屏幕阅读器状态发生变化时收到通知。

## 示例

```SnackPlayer name=AccessibilityInfo%20Example&supportedPlatforms=android,ios
import {useState, useEffect} from 'react';
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

添加事件处理器。支持的事件：

| 事件名称                                                                                 | 描述                                                                                                                                                                                        |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `accessibilityServiceChanged`<br/><div className="label two-lines android">Android</div> | 当 TalkBack、其他 Android 辅助技术和第三方辅助功能服务等某些服务启用时触发。传递给事件处理器的参数是一个布尔值。当某个辅助功能服务启用时，该布尔值为 `true`，否则为 `false`。               |
| `announcementFinished`<br/><div className="label two-lines ios">iOS</div>                | 当屏幕阅读器完成播报时触发。传递给事件处理器的参数是一个包含以下键的字典：<ul><li>`announcement`：屏幕阅读器播报的字符串。</li><li>`success`：一个布尔值，表示播报是否成功。</li></ul>      |
| `boldTextChanged`<br/><div className="label two-lines ios">iOS</div>                     | 当粗体文本开关的状态发生变化时触发。传递给事件处理器的参数是一个布尔值。当粗体文本启用时，该布尔值为 `true`，否则为 `false`。                                                               |
| `grayscaleChanged`<br/><div className="label two-lines ios">iOS</div>                    | 当灰度开关的状态发生变化时触发。传递给事件处理器的参数是一个布尔值。当灰度启用时，该布尔值为 `true`，否则为 `false`。                                                                       |
| `invertColorsChanged`<br/><div className="label two-lines ios">iOS</div>                 | 当反转颜色开关的状态发生变化时触发。传递给事件处理器的参数是一个布尔值。当反转颜色启用时，该布尔值为 `true`，否则为 `false`。                                                               |
| `reduceMotionChanged`                                                                    | 当减少动态效果开关的状态发生变化时触发。传递给事件处理器的参数是一个布尔值。当减少动态效果启用时（或“开发者选项”中的“过渡动画缩放”设置为“动画关闭”时），该布尔值为 `true`，否则为 `false`。 |
| `reduceTransparencyChanged`<br/><div className="label two-lines ios">iOS</div>           | 当降低透明度开关的状态发生变化时触发。传递给事件处理器的参数是一个布尔值。当降低透明度启用时，该布尔值为 `true`，否则为 `false`。                                                           |
| `screenReaderChanged`                                                                    | 当屏幕阅读器的状态发生变化时触发。传递给事件处理器的参数是一个布尔值。当屏幕阅读器启用时，该布尔值为 `true`，否则为 `false`。                                                               |

---

### `announceForAccessibility()`

```tsx
static announceForAccessibility(announcement: string);
```

发布一段由屏幕阅读器播报的字符串。

---

### `announceForAccessibilityWithOptions()`

```tsx
static announceForAccessibilityWithOptions(
  announcement: string,
  options: {queue?: boolean},
);
```

发布一段由屏幕阅读器播报的字符串，并指定修改选项。默认情况下，播报会中断任何现有语音，但在 iOS 上，可以在选项对象中将 `queue` 设置为 `true`，使其排在现有语音之后。

**参数：**

| 名称                                                              | 类型   | 描述                                                                 |
| ----------------------------------------------------------------- | ------ | -------------------------------------------------------------------- |
| announcement <div className="label basic required">Required</div> | string | 要播报的字符串                                                       |
| options <div className="label basic required">Required</div>      | object | `queue`——将播报排在现有语音之后 <div className="label ios">iOS</div> |

---

### `getRecommendedTimeoutMillis()` <div className="label android">Android</div>

```tsx
static getRecommendedTimeoutMillis(originalTimeout: number): Promise<number>;
```

获取用户所需的超时时间（以毫秒为单位）。
此值在“辅助功能”设置中的“操作时间（辅助功能超时）”中设置。

**参数：**

| 名称                                                                 | 类型   | 描述                                                             |
| -------------------------------------------------------------------- | ------ | ---------------------------------------------------------------- |
| originalTimeout <div className="label basic required">Required</div> | number | 如果未设置“辅助功能超时”，则返回的超时时间。请以毫秒为单位指定。 |

---

### `isAccessibilityServiceEnabled()` <div className="label android">Android</div>

```tsx
static isAccessibilityServiceEnabled(): Promise<boolean>;
```

检查是否启用了任何辅助功能服务。这包括 TalkBack，也包括可能已安装的任何第三方辅助功能应用。若只想检查 TalkBack 是否启用，请使用 [isScreenReaderEnabled](#isscreenreaderenabled)。返回一个解析为布尔值的 promise。当某个辅助功能服务启用时，结果为 `true`，否则为 `false`。

:::note
如果只想检查 TalkBack 的状态，请使用 [`isScreenReaderEnabled`](#isscreenreaderenabled)。
:::

---

### `isBoldTextEnabled()` <div className="label ios">iOS</div>

```tsx
static isBoldTextEnabled(): Promise<boolean>:
```

查询粗体文本当前是否启用。返回一个解析为布尔值的 promise。当粗体文本启用时，结果为 `true`，否则为 `false`。

---

### `isGrayscaleEnabled()` <div className="label ios">iOS</div>

```tsx
static isGrayscaleEnabled(): Promise<boolean>;
```

查询灰度当前是否启用。返回一个解析为布尔值的 promise。当灰度启用时，结果为 `true`，否则为 `false`。

---

### `isInvertColorsEnabled()` <div className="label ios">iOS</div>

```tsx
static isInvertColorsEnabled(): Promise<boolean>;
```

查询反转颜色当前是否启用。返回一个解析为布尔值的 promise。当反转颜色启用时，结果为 `true`，否则为 `false`。

---

### `isReduceMotionEnabled()`

```tsx
static isReduceMotionEnabled(): Promise<boolean>;
```

查询减少动态效果当前是否启用。返回一个解析为布尔值的 promise。当减少动态效果启用时，结果为 `true`，否则为 `false`。

---

### `isReduceTransparencyEnabled()` <div className="label ios">iOS</div>

```tsx
static isReduceTransparencyEnabled(): Promise<boolean>;
```

查询降低透明度当前是否启用。返回一个解析为布尔值的 promise。当降低透明度启用时，结果为 `true`，否则为 `false`。

---

### `isScreenReaderEnabled()`

```tsx
static isScreenReaderEnabled(): Promise<boolean>;
```

查询屏幕阅读器当前是否启用。返回一个解析为布尔值的 promise。当屏幕阅读器启用时，结果为 `true`，否则为 `false`。

---

### `isHighTextContrastEnabled()` <div className="label android">Android</div>

```tsx
static isHighTextContrastEnabled(): Promise<boolean>
```

查询高文本对比度当前是否启用。返回一个解析为布尔值的 promise。当高文本对比度启用时，结果为 `true`，否则为 `false`。

---

### `isDarkerSystemColorsEnabled()` <div className="label ios">iOS</div>

```tsx
static isDarkerSystemColorsEnabled(): Promise<boolean>
```

查询深色系统颜色当前是否启用。返回一个解析为布尔值的 promise。当深色系统颜色启用时，结果为 `true`，否则为 `false`。

---

### `prefersCrossFadeTransitions()` <div className="label ios">iOS</div>

```tsx
static prefersCrossFadeTransitions(): Promise<boolean>;
```

查询减少动态效果和偏好交叉淡化过渡设置当前是否启用。返回一个解析为布尔值的 promise。当偏好交叉淡化过渡启用时，结果为 `true`，否则为 `false`。

---

### 🗑️ `setAccessibilityFocus()`

:::warning[Deprecated]
建议改用带有 eventType `focus` 的 `sendAccessibilityEvent`。
:::

```tsx
static setAccessibilityFocus(reactTag: number);
```

将辅助功能焦点设置到 React 组件。

在 Android 上，此方法会使用传入的 `reactTag` 和 `UIManager.AccessibilityEventTypes.typeViewFocused` 参数调用 `UIManager.sendAccessibilityEvent` 方法。

:::note
请确保你希望接收辅助功能焦点的任何 `View` 都设置了 `accessible={true}`。
:::

---

### `sendAccessibilityEvent()`

```tsx
static sendAccessibilityEvent(host: HostInstance, eventType: AccessibilityEventTypes);
```

命令式地触发 React 组件上的辅助功能事件，例如更改屏幕阅读器的焦点元素。

:::note
请确保你希望接收辅助功能焦点的任何 `View` 都设置了 `accessible={true}`。
:::

| 名称                                                           | 类型                    | 描述                                                                                                                 |
| -------------------------------------------------------------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------- |
| host <div className="label basic required">Required</div>      | HostInstance            | 用于发送事件的组件 ref。                                                                                             |
| eventType <div className="label basic required">Required</div> | AccessibilityEventTypes | `'click'`（仅限 Android）、`'focus'`、`'viewHoverEnter'`（仅限 Android）或 `'windowStateChange'`（仅限 Android）之一 |
