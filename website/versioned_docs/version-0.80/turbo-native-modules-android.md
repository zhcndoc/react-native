---
id: turbo-native-modules-android
title: 'Turbo 原生模块：Android'
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

现在是时候编写一些 Android 平台代码了，以确保 `localStorage` 在应用程序关闭后依然存在。

第一步是实现生成的 `NativeLocalStorageSpec` 接口：

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="java">

```java title="android/app/src/main/java/com/nativelocalstorage/NativeLocalStorageModule.java"
package com.nativelocalstorage;

import android.content.Context;
import android.content.SharedPreferences;
import com.nativelocalstorage.NativeLocalStorageSpec;
import com.facebook.react.bridge.ReactApplicationContext;

public class NativeLocalStorageModule extends NativeLocalStorageSpec {

  public static final String NAME = "NativeLocalStorage";

  public NativeLocalStorageModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return NAME;
  }

  @Override
  public void setItem(String value, String key) {
    SharedPreferences sharedPref = getReactApplicationContext().getSharedPreferences("my_prefs", Context.MODE_PRIVATE);
    SharedPreferences.Editor editor = sharedPref.edit();
    editor.putString(key, value);
    editor.apply();
  }

  @Override
  public String getItem(String key) {
    SharedPreferences sharedPref = getReactApplicationContext().getSharedPreferences("my_prefs", Context.MODE_PRIVATE);
    String username = sharedPref.getString(key, null);
    return username;
  }

  @Override
  public void removeItem(String key) {
    SharedPreferences sharedPref = getReactApplicationContext().getSharedPreferences("my_prefs", Context.MODE_PRIVATE);
    sharedPref.edit().remove(key).apply();
  }

  @Override
  public void clear() {
    SharedPreferences sharedPref = getReactApplicationContext().getSharedPreferences("my_prefs", Context.MODE_PRIVATE);
    sharedPref.edit().clear().apply();
  }
}
```

</TabItem>
<TabItem value="kotlin">

```kotlin title="android/app/src/main/java/com/nativelocalstorage/NativeLocalStorageModule.kt"
package com.nativelocalstorage

import android.content.Context
import android.content.SharedPreferences
import com.nativelocalstorage.NativeLocalStorageSpec
import com.facebook.react.bridge.ReactApplicationContext

class NativeLocalStorageModule(reactContext: ReactApplicationContext) : NativeLocalStorageSpec(reactContext) {

  override fun getName() = NAME

  override fun setItem(value: String, key: String) {
    val sharedPref = getReactApplicationContext().getSharedPreferences("my_prefs", Context.MODE_PRIVATE)
    val editor = sharedPref.edit()
    editor.putString(key, value)
    editor.apply()
  }

  override fun getItem(key: String): String? {
    val sharedPref = getReactApplicationContext().getSharedPreferences("my_prefs", Context.MODE_PRIVATE)
    val username = sharedPref.getString(key, null)
    return username.toString()
  }

  override fun removeItem(key: String) {
    val sharedPref = getReactApplicationContext().getSharedPreferences("my_prefs", Context.MODE_PRIVATE)
    val editor = sharedPref.edit()
    editor.remove(key)
    editor.apply()
  }

  override fun clear() {
    val sharedPref = getReactApplicationContext().getSharedPreferences("my_prefs", Context.MODE_PRIVATE)
    val editor = sharedPref.edit()
    editor.clear()
    editor.apply()
  }

  companion object {
    const val NAME = "NativeLocalStorage"
  }
}
```

</TabItem>
</Tabs>

接下来我们需要创建 `NativeLocalStoragePackage`。它通过将我们的模块包装为基础原生包（Base Native Package），提供一个对象以便在 React Native 运行时中注册我们的模块：

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="java">

```java title="android/app/src/main/java/com/nativelocalstorage/NativeLocalStoragePackage.java"
package com.nativelocalstorage;

import com.facebook.react.BaseReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;

import java.util.HashMap;
import java.util.Map;

public class NativeLocalStoragePackage extends BaseReactPackage {

  @Override
  public NativeModule getModule(String name, ReactApplicationContext reactContext) {
    if (name.equals(NativeLocalStorageModule.NAME)) {
      return new NativeLocalStorageModule(reactContext);
    } else {
      return null;
    }
  }

  @Override
  public ReactModuleInfoProvider getReactModuleInfoProvider() {
    return new ReactModuleInfoProvider() {
      @Override
      public Map<String, ReactModuleInfo> getReactModuleInfos() {
        Map<String, ReactModuleInfo> map = new HashMap<>();
        map.put(NativeLocalStorageModule.NAME, new ReactModuleInfo(
          NativeLocalStorageModule.NAME,       // 名称
          NativeLocalStorageModule.NAME,       // 类名
          false, // 是否可以覆盖现有模块
          false, // 是否需要急切初始化
          false, // 是否是 CXX 模块
          true   // 是否是 Turbo 模块
        ));
        return map;
      }
    };
  }
}
```

</TabItem>
<TabItem value="kotlin">

```kotlin title="android/app/src/main/java/com/nativelocalstorage/NativeLocalStoragePackage.kt"
package com.nativelocalstorage

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

class NativeLocalStoragePackage : BaseReactPackage() {

  override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? =
    if (name == NativeLocalStorageModule.NAME) {
      NativeLocalStorageModule(reactContext)
    } else {
      null
    }

  override fun getReactModuleInfoProvider() = ReactModuleInfoProvider {
    mapOf(
      NativeLocalStorageModule.NAME to ReactModuleInfo(
        name = NativeLocalStorageModule.NAME,
        className = NativeLocalStorageModule.NAME,
        canOverrideExistingModule = false,
        needsEagerInit = false,
        isCxxModule = false,
        isTurboModule = true
      )
    )
  }
}
```

</TabItem>
</Tabs>

最后，我们需要告诉主应用程序中的 React Native 如何找到这个 `Package`。我们称之为在 React Native 中“注册”该包。

在这种情况下，你将其添加到 [getPackages](https://github.com/facebook/react-native/blob/8d8b8c343e62115a5509e1aed62047053c2f6e39/packages/react-native/ReactAndroid/src/main/java/com/facebook/react/ReactNativeHost.java#L233) 方法的返回值中。

:::info
稍后你将学习如何将原生模块作为 [npm 包](the-new-architecture/create-module-library.md#publish-the-library-on-npm) 分发，我们的构建工具会为你自动链接它们。
:::

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>
<TabItem value="java">

```java title="android/app/src/main/java/com/turobmoduleexample/MainApplication.java"
package com.inappmodule;

import android.app.Application;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactHost;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactHost;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.soloader.SoLoader;
// highlight-add-next-line
import com.nativelocalstorage.NativeLocalStoragePackage;

import java.util.ArrayList;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost reactNativeHost = new DefaultReactNativeHost(this) {
    @Override
    public List<ReactPackage> getPackages() {
      List<ReactPackage> packages = new PackageList(this).getPackages();
      // 尚未支持自动链接的包可以手动添加到这里，例如：
      // packages.add(new MyReactNativePackage());
      // highlight-add-next-line
      packages.add(new NativeLocalStoragePackage());
      return packages;
    }

    @Override
    public String getJSMainModuleName() {
      return "index";
    }

    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    public boolean isNewArchEnabled() {
      return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
    }

    @Override
    public boolean isHermesEnabled() {
      return BuildConfig.IS_HERMES_ENABLED;
    }
  };

  @Override
  public ReactHost getReactHost() {
    return DefaultReactHost.getDefaultReactHost(getApplicationContext(), reactNativeHost);
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, false);
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // 如果你选择了新架构，我们会为此应用加载原生入口点。
      DefaultNewArchitectureEntryPoint.load();
    }
  }
}
```

</TabItem>
<TabItem value="kotlin">

```kotlin title="android/app/src/main/java/com/turobmoduleexample/MainApplication.kt"
package com.inappmodule

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.soloader.SoLoader
// highlight-add-next-line
import com.nativelocalstorage.NativeLocalStoragePackage

class MainApplication : Application(), ReactApplication {

  override val reactNativeHost: ReactNativeHost =
      object : DefaultReactNativeHost(this) {
        override fun getPackages(): List<ReactPackage> =
            PackageList(this).packages.apply {
              // 尚未支持自动链接的包可以手动添加到这里，例如：
              // add(MyReactNativePackage())
              // highlight-add-next-line
              add(NativeLocalStoragePackage())
            }

        override fun getJSMainModuleName(): String = "index"

        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

        override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
      }

  override val reactHost: ReactHost
    get() = getDefaultReactHost(applicationContext, reactNativeHost)

  override fun onCreate() {
    super.onCreate()
    SoLoader.init(this, false)
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // 如果你选择了新架构，我们会为此应用加载原生入口点。
      load()
    }
  }
}
```

</TabItem>
</Tabs>

你现在可以在模拟器上构建并运行你的代码：

<Tabs groupId="package-manager" queryString defaultValue={constants.defaultPackageManager} values={constants.packageManagers}>
<TabItem value="npm">
```bash
npm run android
```
</TabItem>
<TabItem value="yarn">
```bash
yarn run android
```
</TabItem>
</Tabs>

<video width="30%" height="30%" playsinline="true" autoplay="true" muted="true" loop="true">
    <source src="/docs/assets/turbo-native-modules/turbo-native-modules-android.webm" type="video/webm" />
    <source src="/docs/assets/turbo-native-modules/turbo-native-modules-android.mp4" type="video/mp4" />
</video>
