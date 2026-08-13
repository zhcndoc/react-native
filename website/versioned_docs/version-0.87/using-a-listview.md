---
id: using-a-listview
title: 使用列表视图
---

React Native 提供了一套用于呈现数据列表的组件。通常，你会想要使用 [FlatList](flatlist.md) 或 [SectionList](sectionlist.md)。

`FlatList` 组件用于显示不断变化但结构相似的数据滚动列表。`FlatList` 非常适合较长的数据列表，因为列表项的数量可能会随着时间变化。与更通用的 [`ScrollView`](using-a-scrollview.md) 不同，`FlatList` 只会渲染当前显示在屏幕上的元素，而不是一次性渲染所有元素。

`FlatList` 组件需要两个属性：`data` 和 `renderItem`。`data` 是列表的信息来源。`renderItem` 从数据源中获取一个列表项，并返回要渲染的格式化组件。

此示例创建了一个由硬编码数据组成的基本 `FlatList`。`data` 属性中的每一项都会被渲染为一个 `Text` 组件。然后，`FlatListBasics` 组件会渲染 `FlatList` 及其所有 `Text` 组件。

```SnackPlayer name=FlatList%20Basics
import {FlatList, StyleSheet, Text, View} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});

const FlatListBasics = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={[
          {key: 'Devin'},
          {key: 'Dan'},
          {key: 'Dominic'},
          {key: 'Jackson'},
          {key: 'James'},
          {key: 'Joel'},
          {key: 'John'},
          {key: 'Jillian'},
          {key: 'Jimmy'},
          {key: 'Julie'},
        ]}
        renderItem={({item}) => <Text style={styles.item}>{item.key}</Text>}
      />
    </View>
  );
};

export default FlatListBasics;
```

如果你想要将一组数据划分为逻辑分区，也许还需要分区标题，类似于 iOS 上的 `UITableView`，那么 [SectionList](sectionlist.md) 就是合适的选择。

```SnackPlayer name=SectionList%20Basics
import {SectionList, StyleSheet, Text, View} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'rgba(247,247,247,1.0)',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});

const SectionListBasics = () => {
  return (
    <View style={styles.container}>
      <SectionList
        sections={[
          {title: 'D', data: ['Devin', 'Dan', 'Dominic']},
          {
            title: 'J',
            data: [
              'Jackson',
              'James',
              'Jillian',
              'Jimmy',
              'Joel',
              'John',
              'Julie',
            ],
          },
        ]}
        renderItem={({item}) => <Text style={styles.item}>{item}</Text>}
        renderSectionHeader={({section}) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        keyExtractor={item => `basicListEntry-${item}`}
      />
    </View>
  );
};

export default SectionListBasics;
```

列表视图最常见的用途之一，是显示从服务器获取的数据。要实现这一点，你需要[了解 React Native 中的网络](network.md)。
