---
id: share
title: 分享
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

## 示例

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer name=Example&supportedPlatforms=ios,android&ext=js
import {Alert, Share, Button} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const ShareExample = () => {
  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          'React Native | 一个使用 React 构建原生应用的框架',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // 已通过 result.activityType 活动类型分享
        } else {
          // 已分享
        }
      } else if (result.action === Share.dismissedAction) {
        // 已取消
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };
  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <Button onPress={onShare} title="分享" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default ShareExample;
```

</TabItem>
<TabItem value="typescript">

```SnackPlayer name=Example&supportedPlatforms=ios,android&ext=tsx
import {Alert, Share, Button} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const ShareExample = () => {
  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          'React Native | 一个使用 React 构建原生应用的框架',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // 已通过 result.activityType 活动类型分享
        } else {
          // 已分享
        }
      } else if (result.action === Share.dismissedAction) {
        // 已取消
      }
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };
  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <Button onPress={onShare} title="分享" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default ShareExample;
```

</TabItem>
</Tabs>

# 参考

## 方法

### `share()`

```tsx
static share(content: ShareContent, options?: ShareOptions);
```

打开一个对话框以分享文本内容。

在 iOS 上，返回一个 Promise，该 Promise 会被调用并返回包含 `action` 和 `activityType` 的对象。如果用户关闭了对话框，Promise 仍将以 action 为 `Share.dismissedAction` 并且其他所有键值为 undefined 的对象解析。请注意，在 iOS 模拟器上，某些分享选项可能不会出现或不起作用。

在 Android 上，返回一个 Promise，始终以 action 为 `Share.sharedAction` 的值解析。

**属性:**

| 名称                                                         | 类型   | 描述                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ------------------------------------------------------------ | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| content <div className="label basic required">必填</div>    | object | `message` - 要分享的信息<br/>`url` - 要分享的网址 <div className="label ios">iOS</div><br/>`title` - 信息的标题 <div className="label android">Android</div><hr/>`url` 和 `message` 至少填写一个。                                                                                                                                                                                                                                                        |
| options                                                      | object | `dialogTitle` <div className="label android">Android</div><br/>`excludedActivityTypes` <div className="label ios">iOS</div><br/>`subject` - 用于通过邮件分享的主题 <div className="label ios">iOS</div><br/>`tintColor` <div className="label ios">iOS</div><br/>`anchor` - 用于定位动作表的节点（用于 iPad） <div className="label ios">iOS</div> |

---

## 属性

### `sharedAction`

```tsx
static sharedAction: 'sharedAction';
```

内容已成功分享。

---

### `dismissedAction` <div className="label ios">iOS</div>

```tsx
static dismissedAction: 'dismissedAction';
```

对话框已被关闭。
