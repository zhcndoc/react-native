---
id: devsettings
title: DevSettings
---

`DevSettings` 模块公开了用于在开发过程中自定义开发者设置的方法。

---

# 参考

## 方法

### `addMenuItem()`

```tsx
static addMenuItem(title: string, handler: () => any);
```

向 Dev 菜单添加一个自定义菜单项。

**参数：**

| 名称                                                         | 类型     |
| ------------------------------------------------------------ | -------- |
| title <div className="label basic required">必填</div>      | string   |
| handler <div className="label basic required">必填</div>    | function |

**示例：**

```tsx
DevSettings.addMenuItem('显示秘密开发者屏幕', () => {
  Alert.alert('正在显示秘密开发者屏幕！');
});
```

---

### `reload()`

```tsx
static reload(reason?: string): void;
```

重新加载应用程序。可直接调用，也可在用户交互时调用。

**示例：**

```tsx
<Button title="Reload" onPress={() => DevSettings.reload()} />
```
