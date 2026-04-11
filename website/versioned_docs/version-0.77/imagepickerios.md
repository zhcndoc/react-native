---
id: imagepickerios
title: '❌ ImagePickerIOS'
---

> **已移除。** 请改用 [社区包](https://reactnative.directory/?search=image+picker) 之一。

---

# 参考

## 方法

### `canRecordVideos()`

```jsx
static canRecordVideos(callback)
```

---

### `canUseCamera()`

```jsx
static canUseCamera(callback)
```

---

### `openCameraDialog()`

```jsx
static openCameraDialog(config, successCallback, cancelCallback)
```

**参数：**

| 名称            | 类型     | 是否必填 | 描述        |
| --------------- | -------- | -------- | ----------- |
| config          | object   | 否       | 见下文。    |
| successCallback | function | 否       | 见下文。    |
| cancelCallback  | function | 否       | 见下文。    |

`config` 是一个包含以下内容的对象：

- `videoMode`：一个可选的布尔值，默认为 false。

`successCallback` 是一个可选的回调函数，当选择对话框成功打开时调用。它将包含以下数据：

- `[string, number, number]`

`cancelCallback` 是一个可选的回调函数，当相机对话框被取消时调用。

---

### `openSelectDialog()`

```jsx
static openSelectDialog(config, successCallback, cancelCallback)
```

**参数：**

| 名称            | 类型     | 是否必填 | 描述        |
| --------------- | -------- | -------- | ----------- |
| config          | object   | 否       | 见下文。    |
| successCallback | function | 否       | 见下文。    |
| cancelCallback  | function | 否       | 见下文。    |

`config` 是一个包含以下内容的对象：

- `showImages`：一个可选的布尔值，默认为 false。
- `showVideos`：一个可选的布尔值，默认为 false。

`successCallback` 是一个可选的回调函数，当选择对话框成功打开时调用。它将包含以下数据：

- `[string, number, number]`

`cancelCallback` 是一个可选的回调函数，当选择对话框被取消时调用。
