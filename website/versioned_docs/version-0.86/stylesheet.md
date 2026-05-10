---
id: stylesheet
title: StyleSheet
---

StyleSheet 是一种类似于 CSS StyleSheets 的抽象。

```SnackPlayer name=StyleSheet
import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => (
  <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>React Native</Text>
    </SafeAreaView>
  </SafeAreaProvider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#eaeaea',
  },
  title: {
    marginTop: 16,
    paddingVertical: 8,
    borderWidth: 4,
    borderColor: '#20232a',
    borderRadius: 6,
    backgroundColor: '#61dafb',
    color: '#20232a',
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
  },
});

export default App;
```

代码质量提示：

- 将样式从 render 函数中移出，可以让代码更易于理解。
- 为样式命名是给 render 函数中的底层组件增加语义、并鼓励复用的好方法。
- 在大多数 IDE 中，使用 `StyleSheet.create()` 会提供静态类型检查和建议，帮助你编写有效的样式。

---

# 参考

## 方法

### `compose()`

```tsx
static compose(style1: Object, style2: Object): Object | Object[];
```

将两个样式组合在一起，使得 `style2` 会覆盖 `style1` 中的任何样式。如果任一样式为假值，则会直接返回另一个样式，而不会分配数组，从而节省分配并为 PureComponent 检查保持引用相等。

```SnackPlayer name=Compose
import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => (
  <SafeAreaProvider>
    <SafeAreaView style={container}>
      <Text style={text}>React Native</Text>
    </SafeAreaView>
  </SafeAreaProvider>
);

const page = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 30,
    color: '#000',
  },
});

const lists = StyleSheet.create({
  listContainer: {
    flex: 1,
    backgroundColor: '#61dafb',
  },
  listItem: {
    fontWeight: 'bold',
  },
});

const container = StyleSheet.compose(page.container, lists.listContainer);
const text = StyleSheet.compose(page.text, lists.listItem);

export default App;
```

---

### `create()`

```tsx
static create(styles: Object extends Record<string, ViewStyle | ImageStyle | TextStyle>): Object;
```

用于创建样式的恒等函数。将样式创建在 `StyleSheet.create()` 中的主要实际好处是可以针对原生样式属性进行静态类型检查。

---

### `flatten()`

```tsx
static flatten(style: Array<Object extends Record<string, ViewStyle | ImageStyle | TextStyle>>): Object;
```

将样式对象数组展平成一个聚合的样式对象。

```SnackPlayer name=Flatten
import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => (
  <SafeAreaProvider>
    <SafeAreaView style={page.container}>
      <Text style={flattenStyle}>React Native</Text>
      <Text>Flatten Style</Text>
      <Text style={page.code}>{JSON.stringify(flattenStyle, null, 2)}</Text>
    </SafeAreaView>
  </SafeAreaProvider>
);

const page = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  text: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  code: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    color: '#666',
    backgroundColor: '#eaeaea',
  },
});

const typography = StyleSheet.create({
  header: {
    color: '#61dafb',
    fontSize: 30,
    marginBottom: 36,
  },
});

const flattenStyle = StyleSheet.flatten([page.text, typography.header]);

export default App;
```

---

### `setStyleAttributePreprocessor()`

:::warning Experimental
重大变更很可能会经常发生，而且不会可靠地提前通知。整个功能也许会被删除，谁知道呢？请自行承担风险使用。
:::

```tsx
static setStyleAttributePreprocessor(
  property: string,
  process: (propValue: any) => any,
);
```

设置一个函数，用于预处理样式属性值。这在内部用于处理颜色和变换值。除非你非常清楚自己在做什么，并且已经穷尽了其他选项，否则不应使用它。

## 属性

---

### `absoluteFill`

一种非常常见的模式是使用绝对定位和零定位来创建覆盖层（`position: 'absolute', left: 0, right: 0, top: 0, bottom: 0`），因此可以使用 `absoluteFill` 来方便地减少这些重复样式的冗余。如果你愿意，absoluteFill 可以用于在 StyleSheet 中创建一个自定义条目，例如：

```SnackPlayer name=absoluteFill
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => (
  <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
      <View style={styles.box1}>
        <Text style={styles.text}>1</Text>
      </View>
      <View style={[styles.box2, StyleSheet.absoluteFill]}>
        <Text style={styles.text}>2</Text>
      </View>
      <View style={styles.box3}>
        <Text style={styles.text}>3</Text>
      </View>
    </SafeAreaView>
  </SafeAreaProvider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box1: {
    position: 'absolute',
    top: 40,
    left: 40,
    width: 100,
    height: 100,
    backgroundColor: 'red',
  },
  box2: {
    width: 100,
    height: 100,
    backgroundColor: 'blue',
  },
  box3: {
    position: 'absolute',
    top: 120,
    left: 120,
    width: 100,
    height: 100,
    backgroundColor: 'green',
  },
  text: {
    color: '#FFF',
    fontSize: 80,
  },
});

export default App;
```

---

### `absoluteFillObject`

有时你可能想要 `absoluteFill`，但再做一些小调整——`absoluteFillObject` 可用于在 `StyleSheet` 中创建一个自定义条目，例如：

```SnackPlayer name=absoluteFillObject
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const App = () => (
  <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
      <View style={styles.box1}>
        <Text style={styles.text}>1</Text>
      </View>
      <View style={styles.box2}>
        <Text style={styles.text}>2</Text>
      </View>
      <View style={styles.box3}>
        <Text style={styles.text}>3</Text>
      </View>
    </SafeAreaView>
  </SafeAreaProvider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box1: {
    position: 'absolute',
    top: 40,
    left: 40,
    width: 100,
    height: 100,
    backgroundColor: 'red',
  },
  box2: {
    ...StyleSheet.absoluteFillObject,
    top: 120,
    left: 50,
    width: 100,
    height: 100,
    backgroundColor: 'blue',
  },
  box3: {
    ...StyleSheet.absoluteFillObject,
    top: 120,
    left: 120,
    width: 100,
    height: 100,
    backgroundColor: 'green',
  },
  text: {
    color: '#FFF',
    fontSize: 80,
  },
});

export default App;
```

---

### `hairlineWidth`

这被定义为平台上一条细线的宽度。它可以用作边框的厚度，或用于分隔两个元素。示例：

```SnackPlayer name=hairlineWidth
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const App = () => (
  <View style={styles.container}>
    <Text style={styles.row}>React</Text>
    <Text style={styles.row}>Native</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  row: {
    padding: 4,
    borderBottomColor: 'red',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

export default App;
```

这个常量始终会是一个整数像素值（因此由它定义的线条看起来会更清晰），并且会尽量匹配底层平台上一条细线的标准宽度。不过，你不应依赖它始终保持恒定大小，因为在不同平台和屏幕密度下，它的值可能会以不同方式计算。

如果你的模拟器被缩小显示，细线宽度的线条可能不会可见。
