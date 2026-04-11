---
id: asyncstorage
title: '❌ AsyncStorage'
---

> **已移除。** 请使用 [社区包](https://reactnative.directory/?search=storage) 之一代替。

`AsyncStorage` 是一个未加密的、异步的、持久的、键值存储系统，它对全局应用可见。它应该被用来代替 LocalStorage。

建议您在 `AsyncStorage` 之上使用抽象层，而不是直接使用 `AsyncStorage` 来处理任何超出轻度使用的场景，因为它是在全局范围内运行的。

在 iOS 上，`AsyncStorage` 由原生代码支持，将小值存储在序列化字典中，将大值存储在单独的文件中。在 Android 上，`AsyncStorage` 将根据可用情况使用 [RocksDB](https://rocksdb.org/) 或 SQLite。

`AsyncStorage` JavaScript 代码是一个门面，提供清晰的 JavaScript API、真实的 `Error` 对象和非多重函数。API 中的每个方法都返回一个 `Promise` 对象。

导入 `AsyncStorage` 库：

```jsx
import {AsyncStorage} from 'react-native';
```

持久化数据：

```jsx
_storeData = async () => {
  try {
    await AsyncStorage.setItem(
      '@MySuperStore:key',
      'I like to save it.',
    );
  } catch (error) {
    // 保存数据错误
  }
};
```

获取数据：

```jsx
_retrieveData = async () => {
  try {
    const value = await AsyncStorage.getItem('TASKS');
    if (value !== null) {
      // 我们有数据！！
      console.log(value);
    }
  } catch (error) {
    // 获取数据错误
  }
};
```

---

# 参考

## 方法

### `getItem()`

```jsx
static getItem(key: string, [callback]: ?(error: ?Error, result: ?string) => void)
```

获取一个 `key` 的项并在完成后调用回调。返回一个 `Promise` 对象。

**参数：**

| 名称     | 类型                                        | 必填 | 描述                                                       |
| -------- | ------------------------------------------- | -------- | ----------------------------------------------------------------- |
| key      | string                                      | 是      | 要获取的项的键。                                         |
| callback | `?(error: ?Error, result: ?string) => void` | 否       | 如果找到结果或任何错误，将使用该结果调用的函数。 |

---

### `setItem()`

```jsx
static setItem(key: string, value: string, [callback]: ?(error: ?Error) => void)
```

设置一个 `key` 的值并在完成后调用回调。返回一个 `Promise` 对象。

**参数：**

| 名称     | 类型                       | 必填 | 描述                                  |
| -------- | -------------------------- | -------- | -------------------------------------------- |
| key      | string                     | 是      | 要设置的项的键。                      |
| value    | string                     | 是      | 为 `key` 设置的值。                  |
| callback | `?(error: ?Error) => void` | 否       | 如果有任何错误，将调用的函数。 |

---

### `removeItem()`

```jsx
static removeItem(key: string, [callback]: ?(error: ?Error) => void)
```

移除一个 `key` 的项并在完成后调用回调。返回一个 `Promise` 对象。

**参数：**

| 名称     | 类型                       | 必填 | 描述                                  |
| -------- | -------------------------- | -------- | -------------------------------------------- |
| key      | string                     | 是      | 要移除的项的键。                   |
| callback | `?(error: ?Error) => void` | 否       | 如果有任何错误，将调用的函数。 |

---

### `mergeItem()`

```jsx
static mergeItem(key: string, value: string, [callback]: ?(error: ?Error) => void)
```

合并现有的 `key` 值与输入值，假设两个值都是字符串化的 JSON。返回一个 `Promise` 对象。

**注意：** 并非所有原生实现都支持此功能。

**参数：**

| 名称     | 类型                       | 必填 | 描述                                  |
| -------- | -------------------------- | -------- | -------------------------------------------- |
| key      | string                     | 是      | 要修改的项的键。                   |
| value    | string                     | 是      | 为 `key` 合并的新值。            |
| callback | `?(error: ?Error) => void` | 否       | 如果有任何错误，将调用的函数。 |

示例：

```jsx
let UID123_object = {
  name: 'Chris',
  age: 30,
  traits: {hair: 'brown', eyes: 'brown'},
};
// 您只需要定义将要添加或更新的内容
let UID123_delta = {
  age: 31,
  traits: {eyes: 'blue', shoe_size: 10},
};

AsyncStorage.setItem(
  'UID123',
  JSON.stringify(UID123_object),
  () => {
    AsyncStorage.mergeItem(
      'UID123',
      JSON.stringify(UID123_delta),
      () => {
        AsyncStorage.getItem('UID123', (err, result) => {
          console.log(result);
        });
      },
    );
  },
);

// 控制台日志结果：
// => {'name':'Chris','age':31,'traits':
//    {'shoe_size':10,'hair':'brown','eyes':'blue'}}
```

---

### `clear()`

```jsx
static clear([callback]: ?(error: ?Error) => void)
```

擦除 _所有_ 客户端、库等的 `AsyncStorage`。您可能不想调用这个；使用 `removeItem` 或 `multiRemove` 仅清除您应用的键。返回一个 `Promise` 对象。

**参数：**

| 名称     | 类型                       | 必填 | 描述                                  |
| -------- | -------------------------- | -------- | -------------------------------------------- |
| callback | `?(error: ?Error) => void` | 否       | 如果有任何错误，将调用的函数。 |

---

### `getAllKeys()`

```jsx
static getAllKeys([callback]: ?(error: ?Error, keys: ?Array<string>) => void)
```

获取您的应用已知的所有 _键_；适用于所有调用者、库等。返回一个 `Promise` 对象。

**参数：**

| 名称     | 类型                                             | 必填 | 描述                                                     |
| -------- | ------------------------------------------------ | -------- | --------------------------------------------------------------- |
| callback | `?(error: ?Error, keys: ?Array<string>) => void` | 否       | 将使用找到的所有键和任何错误调用的函数。 |

---

### `flushGetRequests()`

```jsx
static flushGetRequests(): [object Object]
```

使用单个批量调用刷新任何挂起的请求以获取数据。

---

### `multiGet()`

```jsx
static multiGet(keys: Array<string>, [callback]: ?(errors: ?Array<Error>, result: ?Array<Array<string>>) => void)
```

这允许您批量获取给定 `key` 输入数组的项。您的回调将被调用，并带有找到的相应键值对数组：

```
multiGet(['k1', 'k2'], cb) -> cb([['k1', 'val1'], ['k2', 'val2']])
```

该方法返回一个 `Promise` 对象。

**参数：**

| 名称     | 类型                                                              | 必填 | 描述                                                                                                         |
| -------- | ----------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------- |
| keys     | `Array<string>`                                                   | 是      | 要获取的项的键数组。                                                                                  |
| callback | `?(errors: ?Array<Error>, result: ?Array<Array<string>>) => void` | 否       | 将使用结果的键值数组以及找到的任何特定于键的错误数组调用的函数。 |

示例：

```jsx
AsyncStorage.getAllKeys((err, keys) => {
  AsyncStorage.multiGet(keys, (err, stores) => {
    stores.map((result, i, store) => {
      // 获取每个存储的键/值以便您可以使用它
      let key = store[i][0];
      let value = store[i][1];
    });
  });
});
```

---

### `multiSet()`

```jsx
static multiSet(keyValuePairs: Array<Array<string>>, [callback]: ?(errors: ?Array<Error>) => void)
```

将此用作存储多个键值对的批量操作。当操作完成时，您将获得一个包含任何错误的单个回调：

```
multiSet([['k1', 'val1'], ['k2', 'val2']], cb);
```

该方法返回一个 `Promise` 对象。

**参数：**

| 名称          | 类型                               | 必填 | 描述                                                                  |
| ------------- | ---------------------------------- | -------- | ---------------------------------------------------------------------------- |
| keyValuePairs | `Array<Array<string>>`             | 是      | 要设置的项的键值数组数组。                               |
| callback      | `?(errors: ?Array<Error>) => void` | 否       | 将使用找到的任何特定于键的错误数组调用的函数。 |

---

### `multiRemove()`

```jsx
static multiRemove(keys: Array<string>, [callback]: ?(errors: ?Array<Error>) => void)
```

调用此方法以批量删除 `keys` 数组中的所有键。返回一个 `Promise` 对象。

**参数：**

| 名称     | 类型                               | 必填 | 描述                                                             |
| -------- | ---------------------------------- | -------- | ----------------------------------------------------------------------- |
| keys     | `Array<string>`                    | 是      | 要删除的项的键数组。                                   |
| callback | `?(errors: ?Array<Error>) => void` | 否       | 将使用找到的任何特定于键的错误数组调用的函数。 |

示例：

```jsx
let keys = ['k1', 'k2'];
AsyncStorage.multiRemove(keys, err => {
  // 键 k1 和 k2 已移除，如果它们存在的话
  // 在移除后做大部分事情（如果您想的话）
});
```

---

### `multiMerge()`

```jsx
static multiMerge(keyValuePairs: Array<Array<string>>, [callback]: ?(errors: ?Array<Error>) => void)
```

批量操作，为给定的一组键合并现有值和新值。这假设值是字符串化的 JSON。返回一个 `Promise` 对象。

**注意**：并非所有原生实现都支持此功能。

**参数：**

| 名称          | 类型                               | 必填 | 描述                                                                  |
| ------------- | ---------------------------------- | -------- | ---------------------------------------------------------------------------- |
| keyValuePairs | `Array<Array<string>>`             | 是      | 要合并的项的键值数组数组。                             |
| callback      | `?(errors: ?Array<Error>) => void` | 否       | 将使用找到的任何特定于键的错误数组调用的函数。 |

示例：

```jsx
// 第一个用户，初始值
let UID234_object = {
  name: 'Chris',
  age: 30,
  traits: {hair: 'brown', eyes: 'brown'},
};

// 第一个用户，增量值
let UID234_delta = {
  age: 31,
  traits: {eyes: 'blue', shoe_size: 10},
};

// 第二个用户，初始值
let UID345_object = {
  name: 'Marge',
  age: 25,
  traits: {hair: 'blonde', eyes: 'blue'},
};

// 第二个用户，增量值
let UID345_delta = {
  age: 26,
  traits: {eyes: 'green', shoe_size: 6},
};

let multi_set_pairs = [
  ['UID234', JSON.stringify(UID234_object)],
  ['UID345', JSON.stringify(UID345_object)],
];
let multi_merge_pairs = [
  ['UID234', JSON.stringify(UID234_delta)],
  ['UID345', JSON.stringify(UID345_delta)],
];

AsyncStorage.multiSet(multi_set_pairs, err => {
  AsyncStorage.multiMerge(multi_merge_pairs, err => {
    AsyncStorage.multiGet(['UID234', 'UID345'], (err, stores) => {
      stores.map((result, i, store) => {
        let key = store[i][0];
        let val = store[i][1];
        console.log(key, val);
      });
    });
  });
});

// 控制台日志结果：
// => UID234 {"name":"Chris","age":31,"traits":{"shoe_size":10,"hair":"brown","eyes":"blue"}}
// => UID345 {"name":"Marge","age":26,"traits":{"shoe_size":6,"hair":"blonde","eyes":"green"}}
```
