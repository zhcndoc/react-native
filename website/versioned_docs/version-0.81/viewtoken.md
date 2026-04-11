---
id: viewtoken
title: ViewToken 对象类型
---

`ViewToken` 对象作为 `onViewableItemsChanged` 回调中的属性之一返回（例如，在 [FlatList](flatlist) 组件中）。它由 [`ViewabilityHelper.js`](https://github.com/facebook/react-native/blob/main/packages/react-native/Libraries/Lists/ViewabilityHelper.js) 导出。

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

| 类型   | 可选 |
| ------ | -------- |
| number | 是      |

### `isViewable`

指定列表元素的至少一部分是否在视口中可见。

| 类型    | 可选 |
| ------- | -------- |
| boolean | 否       |

### `item`

项数据

| 类型 | 可选 |
| ---- | -------- |
| any  | 否       |

### `key`

分配给数据元素并提取到顶层的键标识符。

| 类型   | 可选 |
| ------ | -------- |
| string | 否       |

### `section`

与 `SectionList` 一起使用时的项部分数据。

| 类型 | 可选 |
| ---- | -------- |
| any  | 是      |

## 被以下组件使用

- [`FlatList`](flatlist)
- [`SectionList`](sectionlist)
- [`VirtualizedList`](virtualizedlist)
