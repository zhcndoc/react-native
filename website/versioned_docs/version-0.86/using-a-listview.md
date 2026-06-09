---
id: using-a-listview
title: 使用列表视图
---

React Native 提供了一组用于展示数据列表的组件。通常，你会想使用 [FlatList](flatlist.md) 或 [SectionList](sectionlist.md)。

`FlatList` 组件会显示一个可滚动的列表，其中数据会变化，但结构相似。`FlatList` 很适合长列表数据，因为项目数量可能会随着时间变化。不同于更通用的 [`ScrollView`](using-a-scrollview.md)，`FlatList` 只会渲染当前显示在屏幕上的元素，而不是一次性渲染所有元素。

`FlatList` 组件需要两个属性：`data` 和 `renderItem`。`data` 是列表的信息来源。`renderItem` 从来源中取出一个项目，并返回一个格式化后的组件进行渲染。

这个示例创建了一个使用硬编码数据的基础 `FlatList`。`data` 属性中的每一项都会被渲染为一个 `Text` 组件。然后 `FlatListBasics` 组件会渲染 `FlatList` 和所有 `Text` 组件。

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

如果你想将一组数据按逻辑分组并渲染出来，可能还带有分组标题，类似于 iOS 上的 `UITableView`，那么 [SectionList](sectionlist.md) 就是合适的选择。

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

列表视图最常见的用途之一是显示你从服务器获取的数据。为此，你需要先[了解 React Native 中的网络请求](network.md)。
