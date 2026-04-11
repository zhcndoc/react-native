---
id: headless-js-android
title: Headless JS
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';
import constants from '@site/core/TabsConstants';

Headless JS 是一种在应用处于后台时运行 JavaScript 任务的方法。例如，它可以用于同步最新数据、处理推送通知或播放音乐。

## JS API

任务是一个你在 `AppRegistry` 上注册的异步函数，类似于注册 React 应用：

```tsx
import {AppRegistry} from 'react-native';
AppRegistry.registerHeadlessTask('SomeTaskName', () =>
  require('SomeTaskName'),
);
```

然后，在 `SomeTaskName.js` 中：

```tsx
module.exports = async taskData => {
  // 做一些事情
};
```

你可以在任务中做任何事情，例如网络请求、定时器等，只要不涉及 UI。一旦任务完成（即 promise 已完成），React Native 将进入“暂停”模式（除非有其他任务正在运行，或者有一个前台应用）。

## 平台 API

是的，这仍然需要一些原生代码，但非常少。你需要扩展 `HeadlessJsTaskService` 并重写 `getTaskConfig`，例如：

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="java">

```java
package com.your_application_name;

import android.content.Intent;
import android.os.Bundle;
import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;
import javax.annotation.Nullable;

public class MyTaskService extends HeadlessJsTaskService {

  @Override
  protected @Nullable HeadlessJsTaskConfig getTaskConfig(Intent intent) {
    Bundle extras = intent.getExtras();
    if (extras != null) {
      return new HeadlessJsTaskConfig(
          "SomeTaskName",
          Arguments.fromBundle(extras),
          5000, // 任务超时时间（毫秒）
          false // 可选：定义是否允许在前台运行该任务。默认为 false
        );
    }
    return null;
  }
}
```

</TabItem>
<TabItem value="kotlin">

```kotlin
package com.your_application_name;

import android.content.Intent
import com.facebook.react.HeadlessJsTaskService
import com.facebook.react.bridge.Arguments
import com.facebook.react.jstasks.HeadlessJsTaskConfig

class MyTaskService : HeadlessJsTaskService() {
    override fun getTaskConfig(intent: Intent?): HeadlessJsTaskConfig? {
        return intent.extras?.let {
            HeadlessJsTaskConfig(
                "SomeTaskName",
                Arguments.fromBundle(it),
                5000, // 任务超时时间
                false // 可选：定义是否允许在前台运行该任务。
                // 默认为 false
            )
        }
    }
}

```

</TabItem>
</Tabs>

然后将服务添加到 `AndroidManifest.xml` 文件中的 `application` 标签内：

```xml
<service android:name="com.example.MyTaskService" />
```

现在，每当你 [启动你的服务][0] 时，例如作为定期任务或响应某些系统事件/广播，JS 将启动，运行你的任务，然后关闭。

示例：

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="java">

```java
Intent service = new Intent(getApplicationContext(), MyTaskService.class);
Bundle bundle = new Bundle();

bundle.putString("foo", "bar");
service.putExtras(bundle);

getApplicationContext().startForegroundService(service);
```

</TabItem>
<TabItem value="kotlin">

```kotlin
val service = Intent(applicationContext, MyTaskService::class.java)
val bundle = Bundle()

bundle.putString("foo", "bar")

service.putExtras(bundle)

applicationContext.startForegroundService(service)
```

</TabItem>
</Tabs>

## 重试

默认情况下，Headless JS 任务不会执行任何重试。为了做到这一点，你需要创建一个 `HeadlessJsRetryPolicy` 并抛出一个特定的 `Error`。

`LinearCountingRetryPolicy` 是 `HeadlessJsRetryPolicy` 的一个实现，它允许你指定最大重试次数以及每次尝试之间的固定延迟。如果这不符合你的需求，你可以实现自己的 `HeadlessJsRetryPolicy`。这些策略可以作为额外参数传递给 `HeadlessJsTaskConfig` 构造函数，例如：

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="java">

```java
HeadlessJsRetryPolicy retryPolicy = new LinearCountingRetryPolicy(
  3, // 最大重试次数
  1000 // 每次重试尝试之间的延迟
);

return new HeadlessJsTaskConfig(
  'SomeTaskName',
  Arguments.fromBundle(extras),
  5000,
  false,
  retryPolicy
);
```

</TabItem>
<TabItem value="kotlin">

```kotlin
val retryPolicy: HeadlessJsTaskRetryPolicy =
    LinearCountingRetryPolicy(
        3, // 最大重试次数
        1000 // 每次重试尝试之间的延迟
    )

return HeadlessJsTaskConfig("SomeTaskName", Arguments.fromBundle(extras), 5000, false, retryPolicy)
```

</TabItem>
</Tabs>

只有在抛出特定的 `Error` 时才会进行重试尝试。在 Headless JS 任务内部，你可以导入该错误并在需要重试尝试时抛出它。

示例：

```tsx
import {HeadlessJsTaskError} from 'HeadlessJsTask';

module.exports = async taskData => {
  const condition = ...;
  if (!condition) {
    throw new HeadlessJsTaskError();
  }
};
```

如果你希望所有错误都导致重试尝试，你需要捕获它们并抛出上述错误。

## 注意事项

- 默认情况下，如果你尝试在应用处于前台时运行任务，应用将会崩溃。这是为了防止开发者因在任务中执行大量工作而拖慢 UI 从而犯错。你可以传递第四个 `boolean` 参数来控制此行为。
- 如果你从 `BroadcastReceiver` 启动服务，请确保在从 `onReceive()` 返回之前调用 `HeadlessJsTaskService.acquireWakeLockNow()`。

## 示例用法

服务可以通过 Java API 启动。首先你需要决定何时应该启动服务并相应地实现你的解决方案。这是一个响应网络连接变化的示例。

以下几行展示了用于注册广播接收器的 Android manifest 文件的一部分。

```xml
<receiver android:name=".NetworkChangeReceiver" >
  <intent-filter>
    <action android:name="android.net.conn.CONNECTIVITY_CHANGE" />
  </intent-filter>
</receiver>
```

广播接收器随后处理在 onReceive 函数中广播的 intent。这是检查应用是否处于前台的好时机。如果应用不在前台，我们可以准备要启动的 intent，不带信息或使用 `putExtra` 捆绑额外信息（请记住 bundle 只能处理可序列化的值 (parcelable)）。最后服务被启动并且获取唤醒锁。

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="java">

```java
import android.app.ActivityManager;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.net.NetworkInfo;
import android.os.Build;

import com.facebook.react.HeadlessJsTaskService;

public class NetworkChangeReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(final Context context, final Intent intent) {
        /**
         这部分每次网络连接改变时都会被调用
         例如：已连接 -> 未连接
         **/
        if (!isAppOnForeground((context))) {
            /**
             我们将启动我们的服务并发送关于
             网络连接的额外信息
             **/
            boolean hasInternet = isNetworkAvailable(context);
            Intent serviceIntent = new Intent(context, MyTaskService.class);
            serviceIntent.putExtra("hasInternet", hasInternet);
            context.startForegroundService(serviceIntent);
            HeadlessJsTaskService.acquireWakeLockNow(context);
        }
    }

    private boolean isAppOnForeground(Context context) {
        /**
         我们需要检查应用是否在前台，否则应用会崩溃。
         https://stackoverflow.com/questions/8489993/check-android-application-is-in-foreground-or-not
         **/
        ActivityManager activityManager = (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
        List<ActivityManager.RunningAppProcessInfo> appProcesses =
                activityManager.getRunningAppProcesses();
        if (appProcesses == null) {
            return false;
        }
        final String packageName = context.getPackageName();
        for (ActivityManager.RunningAppProcessInfo appProcess : appProcesses) {
            if (appProcess.importance ==
                    ActivityManager.RunningAppProcessInfo.IMPORTANCE_FOREGROUND &&
                    appProcess.processName.equals(packageName)) {
                return true;
            }
        }
        return false;
    }

    public static boolean isNetworkAvailable(Context context) {
        ConnectivityManager cm = (ConnectivityManager)
                context.getSystemService(Context.CONNECTIVITY_SERVICE);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            Network networkCapabilities = cm.getActiveNetwork();

            if(networkCapabilities == null) {
                return false;
            }

            NetworkCapabilities actNw = cm.getNetworkCapabilities(networkCapabilities);

            if(actNw == null) {
                return false;
            }

            if(actNw.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) || actNw.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR) || actNw.hasTransport(NetworkCapabilities.TRANSPORT_ETHERNET)) {
                return true;
            }

            return false;
        }

        // 在 API 级别 29 中已弃用
        NetworkInfo netInfo = cm.getActiveNetworkInfo();
        return (netInfo != null && netInfo.isConnected());
    }
}
```

</TabItem>
<TabItem value="kotlin">

```kotlin
import android.app.ActivityManager
import android.app.ActivityManager.RunningAppProcessInfo
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import android.os.Build
import com.facebook.react.HeadlessJsTaskService

class NetworkChangeReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent?) {
        /**
         * 这部分每次网络连接改变时都会被调用，例如：已连接 -> 未
         * 连接
         */
        if (!isAppOnForeground(context)) {
            /** 我们将启动我们的服务并发送关于网络连接的额外信息 */
            val hasInternet = isNetworkAvailable(context)
            val serviceIntent = Intent(context, MyTaskService::class.java)
            serviceIntent.putExtra("hasInternet", hasInternet)
            context.startForegroundService(serviceIntent)
            HeadlessJsTaskService.acquireWakeLockNow(context)
        }
    }

    private fun isAppOnForeground(context: Context): Boolean {
        /**
         * 我们需要检查应用是否在前台，否则应用会崩溃。
         * https://stackoverflow.com/questions/8489993/check-android-application-is-in-foreground-or-not
         */
        val activityManager = context.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
        val appProcesses = activityManager.runningAppProcesses ?: return false
        val packageName: String = context.getPackageName()
        for (appProcess in appProcesses) {
            if (appProcess.importance == RunningAppProcessInfo.IMPORTANCE_FOREGROUND &&
                    appProcess.processName == packageName
            ) {
                return true;
            }
        }
        return false
    }

    companion object {
        fun isNetworkAvailable(context: Context): Boolean {
            val cm = context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
            var result = false

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                val networkCapabilities = cm.activeNetwork ?: return false

                val actNw = cm.getNetworkCapabilities(networkCapabilities) ?: return false

                result =
                    when {
                        actNw.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) -> true
                        actNw.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR) -> true
                        actNw.hasTransport(NetworkCapabilities.TRANSPORT_ETHERNET) -> true
                        else -> false
                    }

                return result
            } else {
                cm.run {
                    // 在 API 级别 29 中已弃用
                    cm.activeNetworkInfo?.run {
                        result =
                            when (type) {
                                ConnectivityManager.TYPE_WIFI -> true
                                ConnectivityManager.TYPE_MOBILE -> true
                                ConnectivityManager.TYPE_ETHERNET -> true
                                else -> false
                            }
                    }
                }
            }
            return result
        }
    }
}

```

</TabItem>
</Tabs>

[0]: https://developer.android.com/reference/android/content/Context.html#startService(android.content.Intent)
