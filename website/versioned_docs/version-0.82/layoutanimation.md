---
id: layoutanimation
title: LayoutAnimation
---

当下一次布局发生时，自动将视图动画化到它们的新位置。

使用此 API 的常见方法是在函数组件中更新状态钩子之前调用它，以及在类组件中调用 `setState` 之前调用它。

注意，为了让它在 **Android** 上工作，你需要通过 `UIManager` 设置以下标志：

```js
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}
```

## 示例

```SnackPlayer name=LayoutAnimation%20Example&supportedPlatforms=android,ios
import React, {useState} from 'react';
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
          <Text>Press me to {expanded ? 'collapse' : 'expand'}!</Text>
        </TouchableOpacity>
        {expanded && (
          <View style={style.tile}>
            <Text>I disappear sometimes!</Text>
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

| 名称               | 类型     | 必填 | 描述                                |
| ------------------ | -------- | ---- | ----------------------------------- |
| config             | object   | 是   | 参见下方的配置描述。                |
| onAnimationDidEnd  | function | 否   | 当动画完成时调用。                  |
| onAnimationDidFail | function | 否   | 当动画失败时调用。                  |

`config` 参数是一个对象，包含以下键。[`create`](layoutanimation.md#create) 返回一个有效的 `config` 对象，并且 [`Presets`](layoutanimation.md#presets) 对象也都可以作为 `config` 传递。

- `duration`，毫秒数
- `create`，用于动画化新视图的可选配置
- `update`，用于动画化已更新视图的可选配置
- `delete`，用于动画化被移除视图的可选配置

传递给 `create`、`update` 或 `delete` 的配置具有以下键：

- `type`，要使用的 [动画类型](layoutanimation.md#types)
- `property`，要动画化的 [布局属性](layoutanimation.md#properties)（可选，但建议用于 `create` 和 `delete`）
- `springDamping`（数字，可选，仅与 `type: Type.spring` 一起使用）
- `initialVelocity`（数字，可选）
- `delay`（数字，可选）
- `duration`（数字，可选）

---

### `create()`

```tsx
static create(duration, type, creationProp)
```

辅助函数，创建一个对象（带有 `create`、`update` 和 `delete` 字段）以传递给 [`configureNext`](layoutanimation.md#configurenext)。`type` 参数是一个 [动画类型](layoutanimation.md#types)，`creationProp` 参数是一个 [布局属性](layoutanimation.md#properties)。

**示例：**

```SnackPlayer name=LayoutAnimation&supportedPlatforms=android,ios
import React, {useState} from 'react';
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
        <Button title="Toggle Layout" onPress={toggleBox} />
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

要在 [`create`](layoutanimation.md#create) 方法中使用的动画类型枚举，或在 [`configureNext`](layoutanimation.md#configurenext) 的 `create`/`update`/`delete` 配置中使用。（示例用法：`LayoutAnimation.Types.easeIn`）

| 类型          |
| ------------- |
| spring        |
| linear        |
| easeInEaseOut |
| easeIn        |
| easeOut       |
| keyboard      |

---

### 属性

要在 [`create`](layoutanimation.md#create) 方法中使用的布局属性枚举，或在 [`configureNext`](layoutanimation.md#configurenext) 的 `create`/`update`/`delete` 配置中使用。（示例用法：`LayoutAnimation.Properties.opacity`）

| 属性     |
| -------- |
| opacity  |
| scaleX   |
| scaleY   |
| scaleXY  |

---

### 预设

一组预定义的动画配置，传递给 [`configureNext`](layoutanimation.md#configurenext)。

| 预设          | 值                                                                                                                                                             |
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
import React, {useState} from 'react';
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
