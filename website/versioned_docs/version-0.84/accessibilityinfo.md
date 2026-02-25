---
id: accessibilityinfo
title: AccessibilityInfo（辅助功能信息）
---

有时候，了解设备当前是否启用了屏幕阅读器是很有用的。`AccessibilityInfo` API 就是为此设计的。您可以使用它查询屏幕阅读器的当前状态，以及注册监听屏幕阅读器状态变化的通知。

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
          减少动画功能当前{reduceMotionEnabled ? '已启用' : '已禁用'}。
        </Text>
        <Text style={styles.status}>
          屏幕阅读器当前{screenReaderEnabled ? '已启用' : '已禁用'}。
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

| 事件名                                                                                  | 描述                                                                                                                                                                                                                                                                                                  |
| ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `accessibilityServiceChanged`<br/><div className="label two-lines android">Android</div> | 当某些服务（如 TalkBack、其他 Android 辅助技术以及第三方辅助服务）启用时触发。传递给事件处理程序的参数是布尔值。当某些辅助服务启用时，该布尔值为 `true`，否则为 `false`。                                                                                                                        |
| `announcementFinished`<br/><div className="label two-lines ios">iOS</div>                | 当屏幕阅读器完成一次播报时触发。传递给事件处理程序的参数是一个包含以下键的字典：<ul><li>`announcement`：屏幕阅读器播报的字符串。</li><li>`success`：一个表示播报是否成功的布尔值。</li></ul>                                                                                                         |
| `boldTextChanged`<br/><div className="label two-lines ios">iOS</div>                     | 当粗体文本开关的状态变化时触发。传递给事件处理程序的参数是布尔值。开启粗体文本时为 `true`，关闭时为 `false`。                                                                                                                                                                                        |
| `grayscaleChanged`<br/><div className="label two-lines ios">iOS</div>                    | 当灰度开关的状态变化时触发。传递给事件处理程序的参数是布尔值。开启灰度时为 `true`，关闭时为 `false`。                                                                                                                                                                                              |
| `invertColorsChanged`<br/><div className="label two-lines ios">iOS</div>                 | 当颜色反转开关的状态变化时触发。传递给事件处理程序的参数是布尔值。开启颜色反转时为 `true`，关闭时为 `false`。                                                                                                                                                                                        |
| `reduceMotionChanged`                                                                    | 当减少动画开关状态变化时触发。传递给事件处理程序的参数是布尔值。开启减少动画时（或者“开发者选项”中的“过渡动画比例”被设置为“动画关闭”）为 `true`，否则为 `false`。                                                                                                                               |
| `reduceTransparencyChanged`<br/><div className="label two-lines ios">iOS</div>           | 当减少透明度开关状态变化时触发。传递给事件处理程序的参数是布尔值。开启减少透明度时为 `true`，关闭时为 `false`。                                                                                                                                                                                        |
| `screenReaderChanged`                                                                    | 当屏幕阅读器的状态变化时触发。传递给事件处理程序的参数是布尔值。开启屏幕阅读器时为 `true`，关闭时为 `false`。                                                                                                                                                                                        |

---

### `announceForAccessibility()`

```tsx
static announceForAccessibility(announcement: string);
```

发布一个字符串，由屏幕阅读器进行播报。

---

### `announceForAccessibilityWithOptions()`

```tsx
static announceForAccessibilityWithOptions(
  announcement: string,
  options: {queue?: boolean},
);
```

发布一个字符串，由屏幕阅读器播报，并可带有修改选项。默认情况下，新的播报将打断当前的播报；但在 iOS 上，通过设置 `options` 对象中的 `queue` 为 `true`，可将播报排队在现有播报之后。

**参数:**

| 名称                                                              | 类型    | 描述                                                                                       |
| ----------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------ |
| announcement <div className="label basic required">必填</div>       | string  | 要播报的字符串                                                                             |
| options <div className="label basic required">必填</div>            | object  | `queue` - 将播报排队在现有语音播报之后 <div className="label ios">iOS</div>                |

---

### `getRecommendedTimeoutMillis()` <div className="label android">Android</div>

```tsx
static getRecommendedTimeoutMillis(originalTimeout: number): Promise<number>;
```

获取用户所需的超时毫秒数。
该值是在“辅助功能”设置中的“采取行动的时间（辅助功能超时）”中设置的。

**参数：**

| 名称                                                                | 类型     | 描述                                                                         |
| ------------------------------------------------------------------- | -------- | ---------------------------------------------------------------------------- |
| originalTimeout <div className="label basic required">必填</div>      | number   | 如果“辅助功能超时”未设置，返回的超时时间，以毫秒为单位。                     |

---

### `isAccessibilityServiceEnabled()` <div className="label android">Android</div>

```tsx
static isAccessibilityServiceEnabled(): Promise<boolean>;
```

检查是否启用了任何辅助功能服务。这包括 TalkBack 以及任何已安装的第三方辅助应用。若只想检查 TalkBack 是否启用，请使用 [isScreenReaderEnabled](#isscreenreaderenabled)。返回一个 Promise，解析为布尔值。若启用了某些辅助服务，结果为 `true`，否则为 `false`。

:::note
如果您只想检查 TalkBack 状态，请使用 [`isScreenReaderEnabled`](#isscreenreaderenabled)。
:::

---

### `isBoldTextEnabled()` <div className="label ios">iOS</div>

```tsx
static isBoldTextEnabled(): Promise<boolean>;
```

查询当前是否启用了粗体文本。返回一个 Promise，解析为布尔值。启用粗体文本时结果为 `true`，否则为 `false`。

---

### `isGrayscaleEnabled()` <div className="label ios">iOS</div>

```tsx
static isGrayscaleEnabled(): Promise<boolean>;
```

查询当前是否启用了灰度模式。返回一个 Promise，解析为布尔值。启用灰度时结果为 `true`，否则为 `false`。

---

### `isInvertColorsEnabled()` <div className="label ios">iOS</div>

```tsx
static isInvertColorsEnabled(): Promise<boolean>;
```

查询当前是否启用了颜色反转。返回一个 Promise，解析为布尔值。启用颜色反转时结果为 `true`，否则为 `false`。

---

### `isReduceMotionEnabled()`

```tsx
static isReduceMotionEnabled(): Promise<boolean>;
```

查询当前是否启用了减少动画。返回一个 Promise，解析为布尔值。启用减少动画时结果为 `true`，否则为 `false`。

---

### `isReduceTransparencyEnabled()` <div className="label ios">iOS</div>

```tsx
static isReduceTransparencyEnabled(): Promise<boolean>;
```

查询当前是否启用了减少透明度。返回一个 Promise，解析为布尔值。启用减少透明度时结果为 `true`，否则为 `false`。

---

### `isScreenReaderEnabled()`

```tsx
static isScreenReaderEnabled(): Promise<boolean>;
```

查询当前是否启用了屏幕阅读器。返回一个 Promise，解析为布尔值。启用屏幕阅读器时结果为 `true`，否则为 `false`。

---

### `prefersCrossFadeTransitions()` <div className="label ios">iOS</div>

```tsx
static prefersCrossFadeTransitions(): Promise<boolean>;
```

查询减少动画和偏好交叉淡入淡出转场设置是否启用。返回一个 Promise，解析为布尔值。启用偏好交叉淡入淡出转场时结果为 `true`，否则为 `false`。

---

### 🗑️ `setAccessibilityFocus()`

:::warning 已废弃
推荐使用事件类型为 `focus` 的 `sendAccessibilityEvent` 代替。
:::

```tsx
static setAccessibilityFocus(reactTag: number);
```

将无障碍焦点设置到某个 React 组件上。

在 Android 上，此方法调用 `UIManager.sendAccessibilityEvent`，传入指定的 `reactTag` 以及 `UIManager.AccessibilityEventTypes.typeViewFocused`。

:::note
确保任何你希望接收辅助焦点的 `View` 具有属性 `accessible={true}`。
:::

---

### `sendAccessibilityEvent()`

```tsx
static sendAccessibilityEvent(host: HostInstance, eventType: AccessibilityEventTypes);
```

对某个 React 组件主动触发辅助功能事件，比如更改屏幕阅读器的焦点元素。

:::note
确保任何你希望接收辅助焦点的 `View` 具有属性 `accessible={true}`。
:::

| 名称                                                              | 类型                         | 描述                                                                                      |
| ----------------------------------------------------------------- | ---------------------------- | ----------------------------------------------------------------------------------------- |
| host <div className="label basic required">必填</div>              | HostInstance                 | 发送事件的组件引用                                                                        |
| eventType <div className="label basic required">必填</div>         | AccessibilityEventTypes      | 事件类型之一，`'click'`（仅 Android），`'focus'`，`'viewHoverEnter'`（仅 Android），或`'windowStateChange'`（仅 Android） |