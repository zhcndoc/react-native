---
id: using-a-listview
title: 使用列表视图
---

React Native 提供了一套用于展示数据列表的组件。通常，你会想要使用 [FlatList](flatlist.md) 或 [SectionList](sectionlist.md)。

`FlatList` 组件显示一个滚动列表，其中的数据是变化的，但结构相似。`FlatList` 适用于长数据列表，其中项目数量可能会随时间变化。与更通用的 [`ScrollView`](using-a-scrollview.md) 不同，`FlatList` 只渲染当前显示在屏幕上的元素，而不是一次性渲染所有元素。

`FlatList` 组件需要两个 props：`data` 和 `renderItem`。`data` 是列表的信息来源。`renderItem` 从来源中获取一个项目，并返回一个格式化后的组件进行渲染。

此示例创建了一个包含硬编码数据的基本 `FlatList`。`data` props 中的每个项目都渲染为 `Text` 组件。然后 `FlatListBasics` 组件渲染 `FlatList` 和所有 `Text` 组件。

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

如果你想渲染一组被划分为逻辑部分的数据，可能带有部分标题，类似于 iOS 上的 `UITableView`，那么 [SectionList](sectionlist.md) 是最佳选择。

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

列表视图最常见的用途之一是显示从服务器获取的数据。要做到这一点，你需要 [了解 React Native 中的网络知识](network.md)。
