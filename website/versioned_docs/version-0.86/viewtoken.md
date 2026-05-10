---
id: viewtoken
title: ViewToken 对象类型
---

`ViewToken` 对象会作为 `onViewableItemsChanged` 回调中的一个属性返回（例如，在 [FlatList](flatlist) 组件中）。它由 [`ViewabilityHelper.js`](https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/Lists/ViewabilityHelper.js) 导出。

## 示例

```js
{
  item: {key: "key-12"},
  key: "key-12",
  index: 11,
  isViewable: true
}
```

## 键和值

### `index`

分配给数据元素的唯一数字标识符。

| Type   | Optional |
| ------ | -------- |
| number | Yes      |

### `isViewable`

指定列表元素是否至少有一部分在视口中可见。

| Type    | Optional |
| ------- | -------- |
| boolean | No       |

### `item`

项目数据

| Type | Optional |
| ---- | -------- |
| any  | No       |

### `key`

提取到顶层后分配给数据元素的键标识符。

| Type   | Optional |
| ------ | -------- |
| string | No       |

### `section`

与 `SectionList` 一起使用时的项目分区数据。

| Type | Optional |
| ---- | -------- |
| any  | Yes      |

## 由以下组件使用

- [`FlatList`](flatlist)
- [`SectionList`](sectionlist)
- [`VirtualizedList`](virtualizedlist)
