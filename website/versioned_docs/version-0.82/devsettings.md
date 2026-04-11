---
id: devsettings
title: DevSettings
---

`DevSettings` 模块暴露了一些方法，用于在开发过程中为开发者自定义设置。

---

# 参考

## 方法

### `addMenuItem()`

```tsx
static addMenuItem(title: string, handler: () => any);
```

向开发菜单添加自定义菜单项。

**参数：**

| 名称                                                         | 类型     |
| ------------------------------------------------------------ | -------- |
| title <div className="label basic required">必需</div>   | string   |
| handler <div className="label basic required">必需</div> | function |

**示例：**

```tsx
DevSettings.addMenuItem('Show Secret Dev Screen', () => {
  Alert.alert('Showing secret dev screen!');
});
```

---

### `reload()`

```tsx
static reload(reason?: string): void;
```

重新加载应用程序。可以直接调用或在用户交互时调用。

**示例：**

```tsx
<Button title="Reload" onPress={() => DevSettings.reload()} />
```
