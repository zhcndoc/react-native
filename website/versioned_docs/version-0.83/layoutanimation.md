---
id: layoutanimation
title: LayoutAnimation
---

当下一次布局发生时，会自动将视图动画到新位置。

在函数组件中，使用此 API 的常见方式是在更新 state hook 之前调用它；在类组件中，则是在调用 `setState` 之前调用它。

请注意，要让它在 **Android** 上生效，你需要通过 `UIManager` 设置以下标志：

```js
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}
```

## 示例

```SnackPlayer name=LayoutAnimation%20Example&supportedPlatforms=android,ios
import {useState} from 'react';
import {
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
const App = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={style.container}>
        <TouchableOpacity
          onPress={() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
            setExpanded(!expanded);
          }}>
          <Text>按我 {expanded ? '收起' : '展开'}！</Text>
        </TouchableOpacity>
        {expanded && (
          <View style={style.tile}>
            <Text>我有时会消失！</Text>
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  tile: {
    backgroundColor: 'lightgrey',
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    padding: 4,
  },
});

export default App;
```

---

# 参考

## 方法

### `configureNext()`

```tsx
static configureNext(
  config: LayoutAnimationConfig,
  onAnimationDidEnd?: () => void,
  onAnimationDidFail?: () => void,
);
```

安排一个动画在下一次布局时发生。

#### 参数：

| 名称                | 类型     | 必需 | 描述                           |
| ------------------- | -------- | ---- | ------------------------------ |
| config              | object   | 是   | 见下方的配置说明。             |
| onAnimationDidEnd   | function | 否   | 动画完成时调用。               |
| onAnimationDidFail  | function | 否   | 动画失败时调用。               |

`config` 参数是一个包含以下键的对象。[`create`](layoutanimation.md#create) 会返回一个适用于 `config` 的有效对象，[`Presets`](layoutanimation.md#presets) 对象也都可以作为 `config` 传入。

- `duration`，以毫秒为单位
- `create`，用于为新视图添加动画的可选配置
- `update`，用于为已更新视图添加动画的可选配置
- `delete`，用于为移除视图添加动画的可选配置

传递给 `create`、`update` 或 `delete` 的配置包含以下键：

- `type`，要使用的[动画类型](layoutanimation.md#types)
- `property`，要动画化的[布局属性](layoutanimation.md#properties)（可选，但建议在 `create` 和 `delete` 中使用）
- `springDamping`（数字，可选，且仅用于 `type: Type.spring`）
- `initialVelocity`（数字，可选）
- `delay`（数字，可选）
- `duration`（数字，可选）

---

### `create()`

```tsx
static create(duration, type, creationProp)
```

帮助函数，用于创建一个对象（包含 `create`、`update` 和 `delete` 字段），传入 [`configureNext`](layoutanimation.md#configurenext)。`type` 参数是一个[动画类型](layoutanimation.md#types)，`creationProp` 参数是一个[布局属性](layoutanimation.md#properties)。

**示例：**

```SnackPlayer name=LayoutAnimation&supportedPlatforms=android,ios
import {useState} from 'react';
import {
  View,
  Platform,
  UIManager,
  LayoutAnimation,
  StyleSheet,
  Button,
} from 'react-native';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const App = () => {
  const [boxPosition, setBoxPosition] = useState('left');

  const toggleBox = () => {
    LayoutAnimation.configureNext({
      duration: 500,
      create: {type: 'linear', property: 'opacity'},
      update: {type: 'spring', springDamping: 0.4},
      delete: {type: 'linear', property: 'opacity'},
    });
    setBoxPosition(boxPosition === 'left' ? 'right' : 'left');
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button title="切换布局" onPress={toggleBox} />
      </View>
      <View
        style={[styles.box, boxPosition === 'left' ? null : styles.moveRight]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  box: {
    height: 100,
    width: 100,
    borderRadius: 5,
    margin: 8,
    backgroundColor: 'blue',
  },
  moveRight: {
    alignSelf: 'flex-end',
    height: 200,
    width: 200,
  },
  buttonContainer: {
    alignSelf: 'center',
  },
});

export default App;
```

## 属性

### 类型

可用于 [`create`](layoutanimation.md#create) 方法，或用于 [`configureNext`](layoutanimation.md#configurenext) 的 `create`/`update`/`delete` 配置中的动画类型枚举。（示例用法：`LayoutAnimation.Types.easeIn`）

| Types         |
| ------------- |
| spring        |
| linear        |
| easeInEaseOut |
| easeIn        |
| easeOut       |
| keyboard      |

---

### 属性

可用于 [`create`](layoutanimation.md#create) 方法，或用于 [`configureNext`](layoutanimation.md#configurenext) 的 `create`/`update`/`delete` 配置中的布局属性枚举。（示例用法：`LayoutAnimation.Properties.opacity`）

| Properties |
| ---------- |
| opacity    |
| scaleX     |
| scaleY     |
| scaleXY    |

---

### 预设

一组预定义的动画配置，可传入 [`configureNext`](layoutanimation.md#configurenext)。

| Presets       | Value                                                                                                                                                          |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| easeInEaseOut | `create(300, 'easeInEaseOut', 'opacity')`                                                                                                                      |
| linear        | `create(500, 'linear', 'opacity')`                                                                                                                             |
| spring        | `{duration: 700, create: {type: 'linear', property: 'opacity'}, update: {type: 'spring', springDamping: 0.4}, delete: {type: 'linear', property: 'opacity'} }` |

---

### `easeInEaseOut`

使用 `Presets.easeInEaseOut` 调用 `configureNext()`。

---

### `linear`

使用 `Presets.linear` 调用 `configureNext()`。

---

### `spring`

使用 `Presets.spring` 调用 `configureNext()`。

**示例：**

```SnackPlayer name=LayoutAnimation&supportedPlatforms=android,ios
import {useState} from 'react';
import {
  View,
  Platform,
  UIManager,
  LayoutAnimation,
  StyleSheet,
  Button,
} from 'react-native';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const App = () => {
  const [firstBoxPosition, setFirstBoxPosition] = useState('left');
  const [secondBoxPosition, setSecondBoxPosition] = useState('left');
  const [thirdBoxPosition, setThirdBoxPosition] = useState('left');

  const toggleFirstBox = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setFirstBoxPosition(firstBoxPosition === 'left' ? 'right' : 'left');
  };

  const toggleSecondBox = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
    setSecondBoxPosition(secondBoxPosition === 'left' ? 'right' : 'left');
  };

  const toggleThirdBox = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    setThirdBoxPosition(thirdBoxPosition === 'left' ? 'right' : 'left');
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button title="EaseInEaseOut" onPress={toggleFirstBox} />
      </View>
      <View
        style={[
          styles.box,
          firstBoxPosition === 'left' ? null : styles.moveRight,
        ]}
      />
      <View style={styles.buttonContainer}>
        <Button title="Linear" onPress={toggleSecondBox} />
      </View>
      <View
        style={[
          styles.box,
          secondBoxPosition === 'left' ? null : styles.moveRight,
        ]}
      />
      <View style={styles.buttonContainer}>
        <Button title="Spring" onPress={toggleThirdBox} />
      </View>
      <View
        style={[
          styles.box,
          thirdBoxPosition === 'left' ? null : styles.moveRight,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  box: {
    height: 100,
    width: 100,
    borderRadius: 5,
    margin: 8,
    backgroundColor: 'blue',
  },
  moveRight: {
    alignSelf: 'flex-end',
  },
  buttonContainer: {
    alignSelf: 'center',
  },
});

export default App;
```
