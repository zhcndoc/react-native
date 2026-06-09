---
id: using-a-listview
title: 使用列表视图
---

React Native 提供了一套用于展示数据列表的组件。通常，你会想使用 [FlatList](flatlist.md) 或 [SectionList](sectionlist.md) 之一。

`FlatList` 组件用于显示一个可滚动的、结构相似但数据可能变化的列表。`FlatList` 非常适合用来显示长数据列表，且列表项数量可能随时间变化。与更通用的 [`ScrollView`](using-a-scrollview.md) 不同，`FlatList` 只渲染当前屏幕上显示的元素，而不是一次性渲染所有元素。

`FlatList` 组件需要两个属性：`data` 和 `renderItem`。`data` 是列表数据的来源。`renderItem` 接收数据源中的一个项目并返回一个格式化组件以渲染该项目。

下面的例子创建了一个使用硬编码数据的基础 `FlatList`。`data` 属性中的每个项目都渲染成一个 `Text` 组件。`FlatListBasics` 组件渲染了 `FlatList` 以及所有的 `Text` 组件。

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

如果你想渲染一组分成逻辑分区的数据，可能还带有分区头部，类似于 iOS 上的 `UITableView`，那么使用 [SectionList](sectionlist.md) 会更合适。

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

列表视图最常见的用例之一是显示从服务器获取的数据。要实现这一点，你需要 [学习 React Native 中的网络相关知识](network.md)。