---
id: permissionsandroid
title: PermissionsAndroid
---

<div className="banner-native-code-required">
  <h3>需要原生代码的项目</h3>
  <p>以下内容仅适用于暴露原生代码的项目。如果您使用的是托管的 Expo 工作流，请参阅 Expo 文档中关于 <a href="https://docs.expo.dev/guides/permissions/">权限</a> 的指南，获取适用的替代方案。</p>
</div>

`PermissionsAndroid` 提供了对 Android M 新权限模型的访问。所谓的“普通”权限只要出现在 `AndroidManifest.xml` 中，安装应用时默认就会被授予。然而，“危险”权限则需要弹出对话框提示。您应当使用此模块来处理这些权限。

在 SDK 23 版本之前的设备上，只要权限出现在清单文件中，系统会自动授予权限，因此 `check` 应始终返回 `true`，而 `request` 应始终返回 `PermissionsAndroid.RESULTS.GRANTED`。

如果用户之前关闭了您请求的权限，操作系统会建议您的应用显示申请权限的原因。可选的 `rationale` 参数会在必要时显示对话框提示 —— 否则会显示普通的权限请求对话框。

### 示例

```SnackPlayer name=PermissionsAndroid%20Example&supportedPlatforms=android
import {
  Button,
  PermissionsAndroid,
  StatusBar,
  StyleSheet,
  Text,
} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const requestCameraPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: '酷炫拍照应用的相机权限',
        message:
          '酷炫拍照应用需要访问您的相机，' +
          '以便您能够拍摄精彩的照片。',
        buttonNeutral: '稍后询问我',
        buttonNegative: '取消',
        buttonPositive: '确定',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('您可以使用相机');
    } else {
      console.log('相机权限被拒绝');
    }
  } catch (err) {
    console.warn(err);
  }
};

const App = () => (
  <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
      <Text style={styles.item}>尝试权限请求</Text>
      <Button title="请求权限" onPress={requestCameraPermission} />
    </SafeAreaView>
  </SafeAreaProvider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: StatusBar.currentHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  item: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default App;
```

### 需要提示用户的权限

常量位于 `PermissionsAndroid.PERMISSIONS` 下：

- `READ_CALENDAR`: 'android.permission.READ_CALENDAR'
- `WRITE_CALENDAR`: 'android.permission.WRITE_CALENDAR'
- `CAMERA`: 'android.permission.CAMERA'
- `READ_CONTACTS`: 'android.permission.READ_CONTACTS'
- `WRITE_CONTACTS`: 'android.permission.WRITE_CONTACTS'
- `GET_ACCOUNTS`: 'android.permission.GET_ACCOUNTS'
- `ACCESS_FINE_LOCATION`: 'android.permission.ACCESS_FINE_LOCATION'
- `ACCESS_COARSE_LOCATION`: 'android.permission.ACCESS_COARSE_LOCATION'
- `ACCESS_BACKGROUND_LOCATION`: 'android.permission.ACCESS_BACKGROUND_LOCATION'
- `RECORD_AUDIO`: 'android.permission.RECORD_AUDIO'
- `READ_PHONE_STATE`: 'android.permission.READ_PHONE_STATE'
- `CALL_PHONE`: 'android.permission.CALL_PHONE'
- `READ_CALL_LOG`: 'android.permission.READ_CALL_LOG'
- `WRITE_CALL_LOG`: 'android.permission.WRITE_CALL_LOG'
- `ADD_VOICEMAIL`: 'com.android.voicemail.permission.ADD_VOICEMAIL'
- `USE_SIP`: 'android.permission.USE_SIP'
- `PROCESS_OUTGOING_CALLS`: 'android.permission.PROCESS_OUTGOING_CALLS'
- `BODY_SENSORS`: 'android.permission.BODY_SENSORS'
- `SEND_SMS`: 'android.permission.SEND_SMS'
- `RECEIVE_SMS`: 'android.permission.RECEIVE_SMS'
- `READ_SMS`: 'android.permission.READ_SMS'
- `RECEIVE_WAP_PUSH`: 'android.permission.RECEIVE_WAP_PUSH'
- `RECEIVE_MMS`: 'android.permission.RECEIVE_MMS'
- `READ_EXTERNAL_STORAGE`: 'android.permission.READ_EXTERNAL_STORAGE'
- `WRITE_EXTERNAL_STORAGE`: 'android.permission.WRITE_EXTERNAL_STORAGE'
- `BLUETOOTH_CONNECT`: 'android.permission.BLUETOOTH_CONNECT'
- `BLUETOOTH_SCAN`: 'android.permission.BLUETOOTH_SCAN'
- `BLUETOOTH_ADVERTISE`: 'android.permission.BLUETOOTH_ADVERTISE'
- `ACCESS_MEDIA_LOCATION`: 'android.permission.ACCESS_MEDIA_LOCATION'
- `ACCEPT_HANDOVER`: 'android.permission.ACCEPT_HANDOVER'
- `ACTIVITY_RECOGNITION`: 'android.permission.ACTIVITY_RECOGNITION'
- `ANSWER_PHONE_CALLS`: 'android.permission.ANSWER_PHONE_CALLS'
- `READ_PHONE_NUMBERS`: 'android.permission.READ_PHONE_NUMBERS'
- `UWB_RANGING`: 'android.permission.UWB_RANGING'
- `BODY_SENSORS_BACKGROUND`: 'android.permission.BODY_SENSORS_BACKGROUND'
- `READ_MEDIA_IMAGES`: 'android.permission.READ_MEDIA_IMAGES'
- `READ_MEDIA_VIDEO`: 'android.permission.READ_MEDIA_VIDEO'
- `READ_MEDIA_AUDIO`: 'android.permission.READ_MEDIA_AUDIO'
- `POST_NOTIFICATIONS`: 'android.permission.POST_NOTIFICATIONS'
- `NEARBY_WIFI_DEVICES`: 'android.permission.NEARBY_WIFI_DEVICES'
- `READ_VOICEMAIL`: 'com.android.voicemail.permission.READ_VOICEMAIL',
- `WRITE_VOICEMAIL`: 'com.android.voicemail.permission.WRITE_VOICEMAIL',

### 请求权限的返回结果字符串

常量位于 `PermissionsAndroid.RESULTS` 下：

- `GRANTED`: 'granted'
- `DENIED`: 'denied'
- `NEVER_ASK_AGAIN`: 'never_ask_again'

---

# 参考

## 方法

### `check()`

```tsx
static check(permission: Permission): Promise<boolean>;
```

返回一个 Promise，该 Promise 解析为布尔值，表示指定的权限是否已被授予。

**参数：**

| 名称       | 类型   | 必填   | 说明                       |
| ---------- | ------ | ------ | -------------------------- |
| permission | string | 是     | 要检查的权限。             |

---

### `request()`

```tsx
static request(
  permission: Permission,
  rationale?: Rationale,
): Promise<PermissionStatus>;
```

提示用户启用某个权限，并返回一个 Promise，解析为字符串值（见上方返回结果字符串），表示用户是否允许请求，拒绝请求，或选择不再询问。

如果提供了 `rationale`，此函数会先询问操作系统是否有必要显示解释为何需要权限的对话框（https://developer.android.com/training/permissions/requesting.html#explain），然后显示系统权限请求对话框。

**参数：**

| 名称       | 类型   | 必填   | 说明                   |
| ---------- | ------ | ------ | ----------------------- |
| permission | string | 是     | 要请求的权限。         |
| rationale  | object | 否     | 详见下方 `rationale`。 |

**Rationale 结构：**

| 名称           | 类型   | 必填   | 说明                         |
| -------------- | ------ | ------ | ---------------------------- |
| title          | string | 是     | 对话框标题                   |
| message        | string | 是     | 对话框消息                   |
| buttonPositive | string | 是     | 正面按钮文本                 |
| buttonNegative | string | 否     | 反面按钮文本                 |
| buttonNeutral  | string | 否     | 中立按钮文本                 |

---

### `requestMultiple()`

```tsx
static requestMultiple(
  permissions: Permission[],
): Promise<{[key in Permission]: PermissionStatus}>;
```

提示用户一次授权多个权限，并返回一个对象，键为权限名称，值为字符串（见上方返回结果字符串），表示用户是否允许请求，拒绝请求，或选择不再询问。

**参数：**

| 名称        | 类型   | 必填   | 说明                       |
| ----------- | ------ | ------ | -------------------------- |
| permissions | array  | 是     | 要请求的权限数组。         |
