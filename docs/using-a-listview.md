---
id: using-a-listview
title: 使用列表视图
---

React Native 提供了一系列用于展示数据列表的组件。通常，你会想使用 [FlatList](flatlist.md) 或 [SectionList](sectionlist.md)。

`FlatList` 组件用于显示一个可滚动的列表，列表中的数据会变化，但结构相似。`FlatList` 非常适合长列表数据，其中项目数量可能会随时间变化。与更通用的 [`ScrollView`](using-a-scrollview.md) 不同，`FlatList` 只会渲染当前屏幕上显示的元素，而不是一次性渲染所有元素。

`FlatList` 组件需要两个属性：`data` 和 `renderItem`。`data` 是列表的信息来源。`renderItem` 会从数据源中取出一个项目，并返回一个用于渲染的格式化组件。

这个示例创建了一个基础的 `FlatList`，数据是硬编码的。`data` 属性中的每一项都会渲染为一个 `Text` 组件。然后，`FlatListBasics` 组件会渲染 `FlatList` 和所有 `Text` 组件。

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

如果你想渲染一组按逻辑分组的数据，可能还带有分组标题，类似于 iOS 上的 `UITableView`，那么就应该使用 [SectionList](sectionlist.md)。

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

列表视图最常见的用途之一，是显示从服务器获取的数据。为此，你需要[了解 React Native 中的网络请求](network.md)。
