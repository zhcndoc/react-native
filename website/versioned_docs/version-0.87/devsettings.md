---
id: devsettings
title: DevSettings
---

`DevSettings` 模块提供了用于在开发环境中自定义开发者设置的方法。

---

# 参考

## 方法

### `addMenuItem()`

```tsx
static addMenuItem(title: string, handler: () => any);
```

向 Dev Menu 添加自定义菜单项。

**参数：**

| 名称                                                     | 类型     |
| -------------------------------------------------------- | -------- |
| title <div className="label basic required">必填</div>   | string   |
| handler <div className="label basic required">必填</div> | function |

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

重新加载应用。可以直接调用，也可以在用户交互时调用。

**示例：**

```tsx
<Button title="Reload" onPress={() => DevSettings.reload()} />
```
