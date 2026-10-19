---
id: viewtoken
title: ViewToken Object Type
---

`ViewToken` object is returned as one of the properties in the `onViewableItemsChanged` callback (for example, in the [FlatList](flatlist) component). It is exported by [`ViewabilityHelper.js`](https://github.com/react/react-native/blob/main/packages/react-native/Libraries/Lists/ViewabilityHelper.js).

## Example

```js
{
  item: {key: "key-12"},
  key: "key-12",
  index: 11,
  isViewable: true
}
```

## Keys and values

### `index`

Unique numeric identifier assigned to the data element.

当可视元素不是数据数组中的数据项时，此属性可能为 `null\)，例如 [`SectionList`](sectionlist) 的分区标题或分区页脚进入可视区域时。

| Type   | Optional |
| ------ | -------- |
| number | Yes      |

### `isViewable`

Specifies if at least some part of list element is visible in the viewport.

| Type    | Optional |
| ------- | -------- |
| boolean | No       |

### `item`

Item data

| Type | Optional |
| ---- | -------- |
| any  | No       |

### `key`

Key identifier assigned to the data element extracted to the top level.

| Type   | Optional |
| ------ | -------- |
| string | No       |

### `section`

Item section data when used with `SectionList`.

| Type | Optional |
| ---- | -------- |
| any  | Yes      |

## Used by

- [`FlatList`](flatlist)
- [`SectionList`](sectionlist)
- [`VirtualizedList`](virtualizedlist)
