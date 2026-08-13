---
id: integration-with-android-fragment
title: 与 Android Fragment 集成
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

[与现有应用集成](/docs/integration-with-existing-apps)指南详细介绍了如何将全屏 React Native 应用作为 **Activity** 集成到现有 Android 应用中。

要在现有应用的 **Fragments** 中使用 React Native 组件，还需要进行一些额外设置。

### 1. 将 React Native 添加到你的应用

按照[与现有应用集成](/docs/integration-with-existing-apps)指南操作直至结束，以确保你可以在全屏 Activity 中安全地运行 React Native 应用。

### 2. 为 React Native Fragment 添加 FrameLayout

在本示例中，我们将使用 `FrameLayout` 将 React Native Fragment 添加到 Activity 中。这种方式足够灵活，也可以调整为在其他布局中使用 React Native，例如底部抽屉或标签布局。

首先，在 Activity 的布局中添加一个带有 id、宽度和高度的 `<FrameLayout>`（例如 `res/layouts` 文件夹中的 `main_activity.xml`）。这是用于渲染 React Native Fragment 的布局。

```xml
<FrameLayout
    android:id="@+id/react_native_fragment"
    android:layout_width="match_parent"
    android:layout_height="match_parent" />
```

### 3. 让宿主 Activity 实现 `DefaultHardwareBackBtnHandler`

由于你的宿主 Activity 不是 `ReactActivity`，因此你需要实现 `DefaultHardwareBackBtnHandler` 接口来处理返回按钮按下事件。
React Native 需要这样做才能处理返回按钮按下事件。

进入你的宿主 Activity，并确保它实现了 `DefaultHardwareBackBtnHandler` 接口：

:::warning[已弃用]
自 API 级别 33 起，`Activity.onBackPressed()` 已被[弃用](<https://developer.android.com/reference/android/app/Activity#onBackPressed()>)。对于以 API 级别 36 为目标版本的应用，在 Android 16 设备上将[不再调用此方法](https://developer.android.com/about/versions/16/behavior-changes-16#predictive-back)，应改用 [OnBackPressedDispatcher](https://developer.android.com/reference/androidx/activity/OnBackPressedDispatcher)。
:::

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="kotlin">

```diff
package <your-package-here>

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
+import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler

+class MainActivity : AppCompatActivity() {
+class MainActivity : AppCompatActivity(), DefaultHardwareBackBtnHandler {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.main_activity)

        findViewById<Button>(R.id.sample_button).setOnClickListener {
            // Handle button click
        }
    }

+   override fun invokeDefaultOnBackPressed() {
+       onBackPressedDispatcher.onBackPressed()
+   }
}
```

</TabItem>
<TabItem value="java">

```diff
package <your-package-here>;

import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
+import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler;

-class MainActivity extends AppCompatActivity {
+class MainActivity extends AppCompatActivity implements DefaultHardwareBackBtnHandler {

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main_activity);

        findViewById(R.id.button_appcompose).setOnClickListener(button -> {
            // Handle button click
        });
    }

+   @Override
+   public void invokeDefaultOnBackPressed() {
+       getOnBackPressedDispatcher().onBackPressed();
+   }
}
```

</TabItem>
</Tabs>

### 4. 将 React Native Fragment 添加到 FrameLayout

最后，我们可以更新 Activity，将 React Native Fragment 添加到 FrameLayout 中。
在这个具体示例中，我们假设你的 Activity 有一个 id 为 `sample_button` 的按钮，点击该按钮时会将 React Native Fragment 渲染到 FrameLayout 中。

按如下方式更新 Activity 的 `onCreate` 方法：

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="kotlin">

```diff
package <your-package-here>

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
+import com.facebook.react.ReactFragment
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler

public class MainActivity : AppCompatActivity(), DefaultHardwareBackBtnHandler {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.main_activity)

        findViewById<Button>(R.id.sample_button).setOnClickListener {
+           val reactNativeFragment = ReactFragment.Builder()
+               .setComponentName("HelloWorld")
+               .setLaunchOptions(Bundle().apply { putString("message", "my value") })
+               .build()
+           supportFragmentManager
+               .beginTransaction()
+               .add(R.id.react_native_fragment, reactNativeFragment)
+               .commit()
        }
    }

   override fun invokeDefaultOnBackPressed() {
       super.onBackPressed()
   }
}
```

</TabItem>
<TabItem value="java">

```diff
package <your-package-here>;

import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;
+import com.facebook.react.ReactFragment;
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler;

public class MainActivity extends AppCompatActivity implements DefaultHardwareBackBtnHandler {

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main_activity);

        findViewById(R.id.button_appcompose).setOnClickListener(button -> {
+           Bundle launchOptions = new Bundle();
+           launchOptions.putString("message", "my value");
+
+           ReactFragment fragment = new ReactFragment.Builder()
+                   .setComponentName("HelloWorld")
+                   .setLaunchOptions(launchOptions)
+                   .build();
+           getSupportFragmentManager()
+                   .beginTransaction()
+                   .add(R.id.react_native_fragment, fragment)
+                   .commit();
        });
    }

    @Override
    public void invokeDefaultOnBackPressed() {
        super.onBackPressed();
    }
}
```

</TabItem>
</Tabs>

让我们来看看上面的代码。

`ReactFragment.Builder()` 用于创建新的 `ReactFragment`，然后我们使用 `supportFragmentManager` 将该 Fragment 添加到 `FrameLayout` 中。

在构建器中，你可以自定义 Fragment 的创建方式：

- `setComponentName` 是你想要渲染的组件名称。它与 `index.js` 中 `registerComponent` 方法内指定的字符串相同
- `setLaunchOptions` 是一个可选方法，用于向组件传递初始 props。此方法是可选的，如果你不使用它，可以将其移除

### 5. 测试集成

确保运行 `yarn start` 来运行 bundler，然后在 Android Studio 中运行你的 Android 应用。应用应从开发服务器加载 JavaScript/TypeScript 代码，并将其显示在 Activity 中的 React Native Fragment 内。

你的应用应如下所示：

![截图](/docs/assets/EmbeddedAppAndroidFragmentVideo.gif)
