---
id: devsettings
title: 开发设置（DevSettings）
---

`DevSettings` 模块提供了用于在开发过程中为开发者自定义设置的方法。

---

# 参考

## 方法

### `addMenuItem()`

```tsx
static addMenuItem(title: string, handler: () => any);
```

向开发者菜单添加一个自定义菜单项。

**参数：**

| 名称                                                         | 类型     |
| ------------------------------------------------------------ | -------- |
| title <div className="label basic required">必填</div>       | string   |
| handler <div className="label basic required">必填</div>     | function |

**示例：**

```tsx
DevSettings.addMenuItem('显示秘密开发屏幕', () => {
  Alert.alert('显示秘密开发屏幕！');
});
```

---

### `reload()`

```tsx
static reload(reason?: string): void;
```

重新加载应用。可以直接调用或在用户交互时调用。

**示例：**

```tsx
<Button title="重新加载" onPress={() => DevSettings.reload()} />
```