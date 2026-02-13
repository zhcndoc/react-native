---
title: React Native 中更好的列表视图
author: Spencer Ahrens
authorTitle: Facebook 软件工程师
authorURL: 'https://github.com/sahrens'
authorImageURL: 'https://avatars1.githubusercontent.com/u/1509831'
authorTwitter: sahrens2012
tags: [engineering]
---

很多人已经开始尝试我们的新列表组件了，这要归功于我们之前在[社区群组中的预告公告](https://www.facebook.com/groups/react.native.community/permalink/921378591331053)，今天我们正式发布它们！不再需要 `ListView` 或 `DataSource`，告别死板的行、被忽略的 Bug 和过度的内存消耗 —— 使用最新的 React Native 2017 年 3 月发布候选版（`0.43-rc.1`），你可以从新推出的一系列组件中选择最符合你使用场景的，开箱即用，性能和功能兼备：

### [`<FlatList>`](/docs/flatlist)

这是用于简单且高性能列表的主力组件。只需提供一个数据数组和一个 `renderItem` 函数即可：

```
<FlatList
  data={[{title: '标题文本', key: 'item1'}, ...]}
  renderItem={({item}) => <ListItem title={item.title} />}
/>
```

### [`<SectionList>`](/docs/sectionlist)

如果你想渲染一组按逻辑分段的数据，带有分区头部（例如按字母排序的通讯录），或者数据和渲染异构（例如一个配置文件视图，包含一些按钮、接着是一个编写器、然后是图片网格、好友网格，最后是故事列表），这就是你要用的组件。

```
<SectionList
  renderItem={({item}) => <ListItem title={item.title} />}
  renderSectionHeader={({section}) => <H1 title={section.key} />}
  sections={[ // 各分区渲染均匀
    {data: [...], key: ...},
    {data: [...], key: ...},
    {data: [...], key: ...},
  ]}
/>

<SectionList
  sections={[ // 各分区渲染异构
    {data: [...], key: ..., renderItem: ...},
    {data: [...], key: ..., renderItem: ...},
    {data: [...], key: ..., renderItem: ...},
  ]}
/>
```

### [`<VirtualizedList>`](/docs/virtualizedlist)

这是后台实现的组件，提供了更灵活的 API。尤其适合你的数据不是普通数组的情况（例如不可变列表）。

## 功能

列表在许多场景中都会用到，因此我们给新组件添加了丰富的功能以覆盖大多数使用案例：

- 滚动加载（`onEndReached`）。
- 下拉刷新（`onRefresh` / `refreshing`）。
- [可配置的](https://github.com/facebook/react-native/blob/master/Libraries/CustomComponents/Lists/ViewabilityHelper.js) 可视回调（VPV）（`onViewableItemsChanged` / `viewabilityConfig`）。
- 横向模式（`horizontal`）。
- 智能的行与分区分割线。
- 多列支持（`numColumns`）。
- `scrollToEnd`，`scrollToIndex`，和 `scrollToItem`。
- 更完善的 Flow 类型支持。

### 一些注意事项

- 当内容滚动出渲染窗口时，项目子树的内部状态不会被保留。请确保所有数据都被包含在项目数据中，或存储在 Flux、Redux、Relay 等外部存储中。

- 这些组件基于 `PureComponent`，意味着如果 `props` 浅比较相等，不会重新渲染。确保你的 `renderItem` 函数直接依赖的所有内容，都作为非 `===` 相等的 prop 传递，否则 UI 可能不会实时更新。这包括 `data` 属性和父组件的状态。例如：

  ```jsx
  <FlatList
    data={this.state.data}
    renderItem={({item}) => (
      <MyItem
        item={item}
        onPress={() =>
          this.setState(oldState => ({
            selected: {
              // 新实例打破了 `===`
              ...oldState.selected, // 复制旧数据
              [item.key]: !oldState.selected[item.key], // 切换选中状态
            },
          }))
        }
        selected={
          !!this.state.selected[item.key] // renderItem 依赖于state
        }
      />
    )}
    selected={
      // 可以是任何不冲突的 prop
      this.state.selected // selected 变化应触发 FlatList 重新渲染
    }
  />
  ```

- 为限制内存并支持流畅滚动，内容是异步离屏渲染的。这意味着可能会滚动速度快于填充速度，短暂看到空白内容。这是一个折中，可以根据应用需求调整，我们也在后台持续改进。

- 默认情况下，这些新列表会查找每个项目上的 `key` 属性作为 React key。你也可以提供自定义的 `keyExtractor` 属性。

## 性能

除了简化 API，新列表组件还带来了显著的性能提升，最主要的是对任意行数几乎保持恒定的内存使用。实现方式是对渲染窗口外的元素进行“虚拟化”，即将它们完全从组件树卸载，回收 React 组件的 JS 内存，以及 Shadow 树和 UI 视图的原生内存。但这意味着组件内部状态不会被保留，因此**请确保你把重要状态存储在组件外部，比如 Relay、Redux 或 Flux 存储。**

限制渲染窗口还减少了 React 和原生层需要处理的工作量，例如视图遍历。即使是在渲染数百万元素的末尾，也无需遍历所有元素。你甚至可以用 `scrollToIndex` 直接跳转到列表中间，无需额外渲染。

我们还对调度做了改进，提升应用响应速度。渲染窗口边缘的项目会在任何活动的手势、动画或其它交互完成后，以较低优先级和较少频率渲染。

## 高级用法

与 `ListView` 不同，渲染窗口中的所有项目只要任何 prop 变化都会重新渲染。通常这没问题，因为窗口大小限制了项目数量，但如果你的项目非常复杂，应遵循 React 性能优化最佳实践，使用 `React.PureComponent` 和/或 `shouldComponentUpdate` 来限制递归子树的重渲染。

如果你能在不渲染的情况下计算行高，可以通过提供 `getItemLayout` 属性来提升用户体验。这使得用 `scrollToIndex` 等方法滚动到指定项目更平滑，也能提升滚动条 UI，因为内容高度不用渲染就能确定。

如果你使用其他类型数据，比如不可变列表，`<VirtualizedList>` 是更好的选择。它接受一个 `getItem` 属性，可返回任意索引的项目数据，Flow 类型也更宽松。

对于特殊需求，还可以调整多个参数，例如用 `windowSize` 在内存使用和用户体验之间权衡，`maxToRenderPerBatch` 调整填充率和响应速度，`onEndReachedThreshold` 控制滚动加载触发门槛等。

## 未来工作

- 迁移现有界面（最终废弃 `ListView`）。
- 根据反馈添加更多功能（欢迎告诉我们！）。
- 支持固定分区头。
- 更多性能优化。
- 支持带状态的函数式项目组件。