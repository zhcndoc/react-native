---
id: permissionsandroid
title: PermissionsAndroid
---

<div className="banner-native-code-required">
  <h3>需要原生代码的项目</h3>
  <p>以下部分仅适用于暴露了原生代码的项目。如果你使用的是托管的 Expo 工作流，请参阅 Expo 文档中的 <a href="https://docs.expo.dev/guides/permissions/">Permissions</a> 指南，以了解合适的替代方案。</p>
</div>

`PermissionsAndroid` 提供对 Android M 新权限模型的访问。所谓的“普通”权限会在应用安装时默认授予，只要它们出现在 `AndroidManifest.xml` 中即可。然而，“危险”权限需要弹窗提示。你应该为这些权限使用此模块。

在 SDK 版本 23 之前的设备上，如果权限出现在 manifest 中，则会自动授予，因此 `check` 的结果应始终为 `true`，而 `request` 应始终解析为 `PermissionsAndroid.RESULTS.GRANTED`。

如果用户之前关闭了你请求的某项权限，操作系统会建议你的应用显示一段解释为何需要该权限的说明。可选的 `rationale` 参数仅在必要时显示弹窗提示——否则会显示正常的权限请求提示。

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
        title: 'Cool Photo App 相机权限',
        message:
          'Cool Photo App 需要访问你的相机 ' +
          '这样你就可以拍摄很棒的照片。',
        buttonNeutral: '稍后询问我',
        buttonNegative: '取消',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('你可以使用相机');
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
      <Text style={styles.item}>尝试权限</Text>
      <Button title="request permissions" onPress={requestCameraPermission} />
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

### 需要向用户请求的权限

可作为 `PermissionsAndroid.PERMISSIONS` 下的常量使用：

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

### 请求权限的结果字符串

可作为 `PermissionsAndroid.RESULTS` 下的常量使用：

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

返回一个 Promise，解析为布尔值，用于表示指定权限是否已被授予。

**参数：**

| 名称       | 类型   | 必需 | 描述               |
| ---------- | ------ | ---- | ------------------ |
| permission | string | 是   | 要检查的权限。 |

---

### `request()`

```tsx
static request(
  permission: Permission,
  rationale?: Rationale,
): Promise<PermissionStatus>;
```

提示用户启用某项权限，并返回一个 Promise，解析为字符串值（见上方结果字符串），表示用户是否允许或拒绝了请求，或者是否不想再次被询问。

如果提供了 `rationale`，此函数会先向操作系统检查是否需要显示一个解释为何需要该权限的对话框（https://developer.android.com/training/permissions/requesting.html#explain），然后再显示系统权限对话框。

**参数：**

| 名称       | 类型   | 必需 | 描述                   |
| ---------- | ------ | ---- | ---------------------- |
| permission | string | 是   | 要请求的权限。 |
| rationale  | object | 否   | 见下方 `rationale`。     |

**Rationale：**

| 名称           | 类型   | 必需 | 描述                     |
| -------------- | ------ | ---- | ------------------------ |
| title          | string | 是   | 对话框标题。         |
| message        | string | 是   | 对话框消息。       |
| buttonPositive | string | 是   | 正向按钮文本。 |
| buttonNegative | string | 否   | 负向按钮文本。 |
| buttonNeutral  | string | 否   | 中立按钮文本。  |

---

### `requestMultiple()`

```tsx
static requestMultiple(
  permissions: Permission[],
): Promise<{[key in Permission]: PermissionStatus}>;
```

在同一个对话框中提示用户启用多个权限，并返回一个对象，其中权限作为键、字符串作为值（见上方结果字符串），表示用户是否允许或拒绝了请求，或者是否不想再次被询问。

**参数：**

| 名称        | 类型  | 必需 | 描述                         |
| ----------- | ----- | ---- | ---------------------------- |
| permissions | array | 是   | 要请求的权限数组。 |
