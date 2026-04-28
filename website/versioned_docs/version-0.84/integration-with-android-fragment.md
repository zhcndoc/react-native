---
id: integration-with-android-fragment
title: 与 Android Fragment 集成
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

[与现有应用集成](/docs/integration-with-existing-apps) 指南详细介绍了如何将全屏 React Native 应用作为 **Activity** 集成到现有 Android 应用中。

要在现有应用中的 **Fragments** 内使用 React Native 组件，则需要一些额外配置。

### 1. 将 React Native 添加到你的应用中

请按照 [与现有应用集成](/docs/integration-with-existing-apps) 的指南一直执行到最后，确保你能在全屏 Activity 中安全运行你的 React Native 应用。

### 2. 为 React Native Fragment 添加 FrameLayout

在这个示例中，我们将使用 `FrameLayout` 将 React Native Fragment 添加到 Activity 中。此方法足够灵活，也可以适配在其它布局中使用 React Native，比如底部弹出层（Bottom Sheets）或标签布局（Tab Layouts）。

首先，在你的 Activity 布局中（例如 `res/layouts` 文件夹下的 `main_activity.xml`）添加一个带有 id、宽度和高度的 `<FrameLayout>`。这个布局将用于渲染你的 React Native Fragment。

```xml
<FrameLayout
    android:id="@+id/react_native_fragment"
    android:layout_width="match_parent"
    android:layout_height="match_parent" />
```

### 3. 让宿主 Activity 实现 `DefaultHardwareBackBtnHandler`

由于你的宿主 Activity 不是 `ReactActivity`，你需要实现 `DefaultHardwareBackBtnHandler` 接口来处理返回键事件。
React Native 需要这样来处理返回键事件。

进入你的宿主 Activity，确保它实现了 `DefaultHardwareBackBtnHandler` 接口：

:::warning[Deprecated]
`Activity.onBackPressed()` has been [deprecated](<https://developer.android.com/reference/android/app/Activity#onBackPressed()>) since API level 33. Android 16 devices with apps targeting API level 36 this will [no longer be called](https://developer.android.com/about/versions/16/behavior-changes-16#predictive-back) and [OnBackPressedDispatcher](https://developer.android.com/reference/androidx/activity/OnBackPressedDispatcher) should be used instead.
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
            // 处理按钮点击事件
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
            // 处理按钮点击事件
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

### 4. 向 FrameLayout 添加 React Native Fragment

最后，我们可以更新 Activity，向 FrameLayout 添加 React Native Fragment。
在这个具体示例中，假设你的 Activity 有一个 id 为 `sample_button` 的按钮，点击它时会在 FrameLayout 中渲染 React Native Fragment。

将 Activity 的 `onCreate` 方法更新如下：

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

我们来看看上面的代码。

`ReactFragment.Builder()` 用于创建一个新的 `ReactFragment`，然后我们使用 `supportFragmentManager` 将该 Fragment 添加到 `FrameLayout` 中。

在构造器中可以自定义 Fragment 的创建方式：

- `setComponentName` 是你要渲染的组件名称，它是你在 `index.js` 中调用 `registerComponent` 时指定的相同字符串。
- `setLaunchOptions` 是一个可选方法，用于向组件传递初始属性。这个是可选的，如果不需要可以删除。

### 5. 测试你的集成

确保你运行了 `yarn start` 启动打包服务，然后在 Android Studio 中运行你的 Android 应用。应用应能从开发服务器加载 JavaScript/TypeScript 代码，并在 Activity 的 React Native Fragment 中显示它。

你的应用应该看起来像这样：

![截图](/docs/assets/EmbeddedAppAndroidFragmentVideo.gif)