---
id: integration-with-android-fragment
title: 与 Android Fragment 集成
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

[与现有应用集成](https://reactnative.dev/docs/integration-with-existing-apps) 指南详细介绍了如何将全屏 React Native 应用作为 **Activity** 集成到现有的 Android 应用中。

要在现有应用的 **Fragment** 中使用 React Native 组件，需要进行一些额外的设置。

### 1. 将 React Native 添加到你的应用

遵循 [与现有应用集成](https://reactnative.dev/docs/integration-with-existing-apps) 指南直到结束，确保你可以安全地在全屏 Activity 中运行你的 React Native 应用。

### 2. 为 React Native Fragment 添加一个 FrameLayout

在这个例子中，我们将使用 `FrameLayout` 将 React Native Fragment 添加到 Activity。这种方法足够灵活，可以适应在其他布局中使用 React Native，例如 Bottom Sheets 或 Tab Layouts。

首先在你的 Activity 布局中添加一个带有 id、宽度和高度的 `<FrameLayout>`（例如 `res/layouts` 文件夹中的 `main_activity.xml`）。这是你将用来渲染 React Native Fragment 的布局。

```xml
<FrameLayout
    android:id="@+id/react_native_fragment"
    android:layout_width="match_parent"
    android:layout_height="match_parent" />
```

### 3. 让你的宿主 Activity 实现 `DefaultHardwareBackBtnHandler`

由于你的宿主 activity 不是 `ReactActivity`，你需要实现 `DefaultHardwareBackBtnHandler` 接口来处理返回按钮按下事件。
React Native 需要此接口来处理返回按钮按下事件。

进入你的宿主 activity 并确保它实现了 `DefaultHardwareBackBtnHandler` 接口：

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="kotlin">

```diff
package <your-package-here>

import android.os.Bundle
androidx.appcompat.app.AppCompatActivity
+import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler

+class MainActivity : AppCompatActivity() {
+class MainActivity : AppCompatActivity(), DefaultHardwareBackBtnHandler {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.main_activity)

        findViewById<Button>(R.id.sample_button).setOnClickListener {
            // 处理按钮点击
        }
    }

+   override fun invokeDefaultOnBackPressed() {
+       super.onBackPressed()
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
            // 处理按钮点击
        });
    }

+   @Override
+   public void invokeDefaultOnBackPressed() {
+       super.onBackPressed();
+   }
}
```

</TabItem>
</Tabs>

### 4. 将 React Native Fragment 添加到 FrameLayout

最后，我们可以更新 Activity 以将 React Native Fragment 添加到 FrameLayout。
在这个特定例子中，我们将假设你的 Activity 有一个 id 为 `sample_button` 的按钮，点击该按钮将在 FrameLayout 中渲染一个 React Native Fragment。

按如下方式更新你的 Activity 的 `onCreate` 方法：

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="kotlin">

```diff
package <your-package-here>

import android.os.Bundle
androidx.appcompat.app.AppCompatActivity
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

让我们看看上面的代码。

`ReactFragment.Builder()` 用于创建一个新的 `ReactFragment`，然后我们使用 `supportFragmentManager` 将该 Fragment 添加到 `FrameLayout`。

在 builder 内部，你可以自定义 fragment 的创建方式：

- `setComponentName` 是你想要渲染的组件名称。它与你在 `index.js` 的 `registerComponent` 方法中指定的字符串相同。
- `setLaunchOptions` 是一个可选方法，用于传递初始 props 给你的组件。这是可选的，如果你不使用它可以移除它。

### 5. 测试你的集成

确保你运行 `yarn start` 来启动 bundler，然后在 Android Studio 中运行你的 android 应用。该应用应从开发服务器加载 JavaScript/TypeScript 代码，并将其显示在 Activity 中的 React Native Fragment 中。

你的应用应该看起来像这样：

![截图](/docs/assets/EmbeddedAppAndroidFragmentVideo.gif)
