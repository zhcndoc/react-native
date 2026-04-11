---
id: share
title: 分享
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

## 示例

<Tabs groupId="language" queryString defaultValue={constants.defaultSnackLanguage} values={constants.snackLanguages}>
<TabItem value="javascript">

```SnackPlayer name=Example&supportedPlatforms=ios,android&ext=js
import React from 'react';
import {Alert, Share, Button} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const ShareExample = () => {
  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          'React Native | A framework for building native apps using React',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // 已分享，活动类型为 result.activityType
        } else {
          // 已分享
        }
      } else if (result.action === Share.dismissedAction) {
        // 已关闭
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };
  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <Button onPress={onShare} title="Share" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default ShareExample;
```

</TabItem>
<TabItem value="typescript">

```SnackPlayer name=Example&supportedPlatforms=ios,android&ext=tsx
import React from 'react';
import {Alert, Share, Button} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const ShareExample = () => {
  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          'React Native | A framework for building native apps using React',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // 已分享，活动类型为 result.activityType
        } else {
          // 已分享
        }
      } else if (result.action === Share.dismissedAction) {
        // 已关闭
      }
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };
  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <Button onPress={onShare} title="Share" />
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

在 iOS 上，返回一个 Promise，该 Promise 将通过一个包含 `action` 和 `activityType` 的对象来调用。如果用户关闭了对话框，Promise 仍会被解析，action 为 `Share.dismissedAction`，所有其他键为 undefined。请注意，某些分享选项可能不会在 iOS 模拟器上出现或工作。

在 Android 上，返回一个 Promise，该 Promise 将始终被解析，action 为 `Share.sharedAction`。

**属性：**

| 名称                                                         | 类型   | 描述                                                                                                                                                                                                                                                                                                                                                                                  |
| ------------------------------------------------------------ | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| content <div className="label basic required">必需</div> | object | `message` - 要分享的消息<br/>`url` - 要分享的 URL <div className="label ios">iOS</div><br/>`title` - 消息的标题 <div className="label android">Android</div><hr/>`url` 和 `message` 中至少需要提供一个。                                                                                                                                                          |
| options                                                      | object | `dialogTitle` <div className="label android">Android</div><br/>`excludedActivityTypes` <div className="label ios">iOS</div><br/>`subject` - 通过电子邮件分享的主题 <div className="label ios">iOS</div><br/>`tintColor` <div className="label ios">iOS</div><br/>`anchor` - 操作表应锚定到的节点（用于 iPad）<div className="label ios">iOS</div> |

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

对话框已关闭。
