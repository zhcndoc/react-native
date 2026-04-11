import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

## 关键概念

将 React Native 组件集成到你的 Android 应用程序中的关键在于：

1. 设置正确的目录结构。
2. 安装必要的 NPM 依赖。
3. 将 React Native 添加到你的 Gradle 配置中。
4. 为你的第一个 React Native 屏幕编写 TypeScript 代码。
5. 使用 ReactActivity 将 React Native 与你的 Android 代码集成。
6. 通过运行 bundler 并查看你的应用实际操作来测试你的集成。

## 使用社区模板

在你遵循本指南时，我们建议你使用 [React Native 社区模板](https://github.com/react-native-community/template/) 作为参考。该模板包含一个 **最小化的 Android 应用**，并将帮助你理解如何将 React Native 集成到现有的 Android 应用中。

## 前提条件

请遵循 [设置开发环境](set-up-your-environment) 的指南，并使用 [不使用框架的 React Native](getting-started-without-a-framework) 来配置你的开发环境，以便为 Android 构建 React Native 应用。
本指南还假设你熟悉 Android 开发的基础知识，例如创建 Activity 和编辑 `AndroidManifest.xml` 文件。

## 1. 设置目录结构

为了确保顺畅的体验，为你的集成 React Native 项目创建一个新文件夹，然后 **移动你现有的 Android 项目** 到 `/android` 子文件夹。

## 2. 安装 NPM 依赖

进入根目录并运行以下命令：

```shell
curl -O https://raw.githubusercontent.com/react-native-community/template/refs/heads/0.75-stable/template/package.json
```

这将把 `package.json` [文件从社区模板复制](https://github.com/react-native-community/template/blob/0.75-stable/template/package.json) 到你的项目。

接下来，通过运行以下命令安装 NPM 包：

<Tabs groupId="package-manager" queryString defaultValue={constants.defaultPackageManager} values={constants.packageManagers}>
<TabItem value="npm">

```shell
npm install
```

</TabItem>
<TabItem value="yarn">

```shell
yarn install
```

</TabItem>
</Tabs>

安装过程创建了一个新的 `node_modules` 文件夹。该文件夹存储构建项目所需的所有 JavaScript 依赖。

将 `node_modules/` 添加到你的 `.gitignore` 文件中（这里是 [社区默认文件](https://github.com/react-native-community/template/blob/0.75-stable/template/_gitignore)）。

## 3. 将 React Native 添加到你的应用

### 配置 Gradle

React Native 使用 React Native Gradle 插件来配置你的依赖和项目设置。

首先，让我们通过添加这些行来编辑你的 `settings.gradle` 文件（如 [社区模板](https://github.com/react-native-community/template/blob/0.77-stable/template/android/settings.gradle) 所建议）：

```groovy
// 配置用于自动链接的 React Native Gradle Settings 插件
pluginManagement { includeBuild("../node_modules/@react-native/gradle-plugin") }
plugins { id("com.facebook.react.settings") }
extensions.configure(com.facebook.react.ReactSettingsExtension){ ex -> ex.autolinkLibrariesFromCommand() }
// 如果使用 .gradle.kts 文件：
// extensions.configure<com.facebook.react.ReactSettingsExtension> { autolinkLibrariesFromCommand() }
includeBuild("../node_modules/@react-native/gradle-plugin")

// 在此处包含你现有的 Gradle 模块。
// include(":app")
```

然后你需要打开你的顶层 `build.gradle` 并包含这一行（如 [社区模板](https://github.com/react-native-community/template/blob/0.77-stable/template/android/build.gradle) 所建议）：

```diff
buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath("com.android.tools.build:gradle:7.3.1")
+       classpath("com.facebook.react:react-native-gradle-plugin")
    }
}
```

这确保 React Native Gradle 插件 (RNGP) 在你的项目中可用。
最后，将这些行添加到你的 Application 的 `build.gradle` 文件中（这是一个不同的 `build.gradle` 文件，通常位于你的 `app` 文件夹内 - 你可以使用 [社区模板文件作为参考](https://github.com/react-native-community/template/blob/0.77-stable/template/android/app/build.gradle)）：

```diff
apply plugin: "com.android.application"
+apply plugin: "com.facebook.react"

repositories {
    mavenCentral()
}

dependencies {
    // 其他依赖在此处
+   // 注意：我们故意在这里不指定版本号，因为 RNGP 会处理它。
+   // 如果你不使用 RNGP，你将不得不手动指定版本。
+   implementation("com.facebook.react:react-android")
+   implementation("com.facebook.react:hermes-android")
}

+react {
+   // 需要启用自动链接 - https://github.com/react-native-community/cli/blob/master/docs/autolinking.md
+   autolinkLibrariesWithApp()
+}
```

最后，打开你的应用程序 `gradle.properties` 文件并添加以下行（此处 [社区模板文件作为参考](https://github.com/react-native-community/template/blob/0.77-stable/template/android/gradle.properties)）：

```diff
+reactNativeArchitectures=armeabi-v7a,arm64-v8a,x86,x86_64
+newArchEnabled=true
+hermesEnabled=true
```

### 配置你的 manifest

首先，确保你在 `AndroidManifest.xml` 中有 Internet 权限：

```diff
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

+   <uses-permission android:name="android.permission.INTERNET" />

    <application
      android:name=".MainApplication">
    </application>
</manifest>
```

然后你需要在 **debug** `AndroidManifest.xml` 中启用 [cleartext traffic](https://developer.android.com/training/articles/security-config#CleartextTrafficPermitted)：

```diff
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <application
+       android:usesCleartextTraffic="true"
+       tools:targetApi="28"
    />
</manifest>
```

通常，这里是社区模板中的 AndroidManifest.xml 文件以供参考：[main](https://github.com/react-native-community/template/blob/0.77-stable/template/android/app/src/main/AndroidManifest.xml) 和 [debug](https://github.com/react-native-community/template/blob/0.77-stable/template/android/app/src/debug/AndroidManifest.xml)

这是必需的，因为你的应用程序将通过 HTTP 与你的本地 bundler [Metro](https://metrobundler.dev/) 通信。

确保你只将此添加到你的 **调试** manifest 中。

## 4. 编写 TypeScript 代码

现在我们将实际修改原生 Android 应用程序以集成 React Native。

我们将编写的第一段代码是实际将集成到我们应用程序中的新屏幕的 React Native 代码。

### 创建 `index.js` 文件

首先，在你的 React Native 项目的根目录中创建一个空的 `index.js` 文件。

`index.js` 是 React Native 应用程序的起点，并且始终是必需的。它可以是一个 `import` 属于你 React Native 组件或应用程序一部分的其他文件的小文件，或者它可以包含所需的所有代码。

我们的 index.js 应该如下所示（此处 [社区模板文件作为参考](https://github.com/react-native-community/template/blob/0.77-stable/template/index.js)）：

```js
import {AppRegistry} from 'react-native';
import App from './App';

AppRegistry.registerComponent('HelloWorld', () => App);
```

### 创建 `App.tsx` 文件

让我们创建一个 `App.tsx` 文件。这是一个 [TypeScript](https://www.typescriptlang.org/) 文件，可以拥有 [JSX](<https://en.wikipedia.org/wiki/JSX_(JavaScript)>) 表达式。它包含我们将集成到 Android 应用程序中的根 React Native 组件（[链接](https://github.com/react-native-community/template/blob/0.77-stable/template/App.tsx)）：

```tsx
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode
              ? Colors.black
              : Colors.white,
            padding: 24,
          }}>
          <Text style={styles.title}>Step One</Text>
          <Text>
            Edit <Text style={styles.bold}>App.tsx</Text> to
            change this screen and see your edits.
          </Text>
          <Text style={styles.title}>See your changes</Text>
          <ReloadInstructions />
          <Text style={styles.title}>Debug</Text>
          <DebugInstructions />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
  bold: {
    fontWeight: '700',
  },
});

export default App;
```

此处 [社区模板文件作为参考](https://github.com/react-native-community/template/blob/0.77-stable/template/App.tsx)

## 5. 与你的 Android 代码集成

我们现在需要添加一些原生代码以便启动 React Native 运行时并告诉它渲染我们的 React 组件。

### 更新你的 Application 类

首先，我们需要更新你的 `Application` 类以正确初始化 React Native，如下所示：

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>

<TabItem value="java">

```diff
package <your-package-here>;

import android.app.Application;
+import com.facebook.react.PackageList;
+import com.facebook.react.ReactApplication;
+import com.facebook.react.ReactHost;
+import com.facebook.react.ReactNativeHost;
+import com.facebook.react.ReactPackage;
+import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
+import com.facebook.react.defaults.DefaultReactHost;
+import com.facebook.react.defaults.DefaultReactNativeHost;
+import com.facebook.soloader.SoLoader;
+import com.facebook.react.soloader.OpenSourceMergedSoMapping
+import java.util.List;

-class MainApplication extends Application {
+class MainApplication extends Application implements ReactApplication {
+ @Override
+ public ReactNativeHost getReactNativeHost() {
+   return new DefaultReactNativeHost(this) {
+     @Override
+     protected List<ReactPackage> getPackages() { return new PackageList(this).getPackages(); }
+     @Override
+     protected String getJSMainModuleName() { return "index"; }
+     @Override
+     public boolean getUseDeveloperSupport() { return BuildConfig.DEBUG; }
+     @Override
+     protected boolean isNewArchEnabled() { return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED; }
+     @Override
+     protected Boolean isHermesEnabled() { return BuildConfig.IS_HERMES_ENABLED; }
+   };
+ }

+ @Override
+ public ReactHost getReactHost() {
+   return DefaultReactHost.getDefaultReactHost(getApplicationContext(), getReactNativeHost());
+ }

  @Override
  public void onCreate() {
    super.onCreate();
+   SoLoader.init(this, OpenSourceMergedSoMapping);
+   if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
+     DefaultNewArchitectureEntryPoint.load();
+   }
  }
}
```

</TabItem>

<TabItem value="kotlin">

```diff
// 包 <your-package-here>

import android.app.Application
+import com.facebook.react.PackageList
+import com.facebook.react.ReactApplication
+import com.facebook.react.ReactHost
+import com.facebook.react.ReactNativeHost
+import com.facebook.react.ReactPackage
+import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
+import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
+import com.facebook.react.defaults.DefaultReactNativeHost
+import com.facebook.soloader.SoLoader
+import com.facebook.react.soloader.OpenSourceMergedSoMapping

-class MainApplication : Application() {
+class MainApplication : Application(), ReactApplication {

+ override val reactNativeHost: ReactNativeHost =
+      object : DefaultReactNativeHost(this) {
+        override fun getPackages(): List<ReactPackage> = PackageList(this).packages
+        override fun getJSMainModuleName(): String = "index"
+        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG
+        override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
+        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
+      }

+ override val reactHost: ReactHost
+   get() = getDefaultReactHost(applicationContext, reactNativeHost)

  override fun onCreate() {
    super.onCreate()
+   SoLoader.init(this, OpenSourceMergedSoMapping)
+   if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
+     load()
+   }
  }
}
```

</TabItem>
</Tabs>

通常，此处 [MainApplication.kt 社区模板文件作为参考](https://github.com/react-native-community/template/blob/0.77-stable/template/android/app/src/main/java/com/helloworld/MainApplication.kt)

#### 创建 `ReactActivity`

最后，我们需要创建一个新的 `Activity`，它将扩展 `ReactActivity` 并托管 React Native 代码。此 activity 将负责启动 React Native 运行时并渲染 React 组件。

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>

<TabItem value="java">

```java
// 包 <your-package-here>;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;

public class MyReactActivity extends ReactActivity {

    @Override
    protected String getMainComponentName() {
        return "HelloWorld";
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new DefaultReactActivityDelegate(this, getMainComponentName(), DefaultNewArchitectureEntryPoint.getFabricEnabled());
    }
}
```

</TabItem>

<TabItem value="kotlin">

```kotlin
// 包 <your-package-here>

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MyReactActivity : ReactActivity() {

    override fun getMainComponentName(): String = "HelloWorld"

    override fun createReactActivityDelegate(): ReactActivityDelegate =
        DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
```

</TabItem>
</Tabs>

通常，此处 [MainActivity.kt 社区模板文件作为参考](https://github.com/react-native-community/template/blob/0.78-stable/template/android/app/src/main/java/com/helloworld/MainActivity.kt)

每当你创建一个新的 Activity 时，你需要将其添加到你的 `AndroidManifest.xml` 文件中。你还需要将 `MyReactActivity` 的主题设置为 `Theme.AppCompat.Light.NoActionBar`（或任何非 ActionBar 主题），否则你的应用程序将在你的 React Native 屏幕顶部渲染一个 ActionBar：

```diff
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.INTERNET" />

    <application
      android:name=".MainApplication">

+     <activity
+       android:name=".MyReactActivity"
+       android:label="@string/app_name"
+       android:theme="@style/Theme.AppCompat.Light.NoActionBar">
+     </activity>
    </application>
</manifest>
```

现在你的 activity 已准备好运行一些 JavaScript 代码。

## 6. 测试你的集成

你已经完成了将 React Native 集成到应用程序中的所有基本步骤。现在我们将启动 [Metro 打包器](https://metrobundler.dev/) 将你的 TypeScript 应用程序代码构建为一个包。Metro 的 HTTP 服务器将开发者环境上 `localhost` 的包共享给模拟器或设备。这允许进行 [热重载](https://reactnative.dev/blog/2016/03/24/introducing-hot-reloading)。

首先，你需要在项目的根目录创建一个 `metro.config.js` 文件，如下所示：

```js
const {getDefaultConfig} = require('@react-native/metro-config');
module.exports = getDefaultConfig(__dirname);
```

你可以查看社区模板文件中的 [metro.config.js 文件](https://github.com/react-native-community/template/blob/0.77-stable/template/metro.config.js) 作为参考。

一旦配置文件就位，你就可以运行打包器了。在你的项目根目录运行以下命令：

<Tabs groupId="package-manager" queryString defaultValue={constants.defaultPackageManager} values={constants.packageManagers}>
<TabItem value="npm">

```shell
npm start
```

</TabItem>
<TabItem value="yarn">

```shell
yarn start
```

</TabItem>
</Tabs>

现在像往常一样构建并运行你的 Android 应用。

一旦你在应用内进入由 React 驱动的 Activity，它应该会从开发服务器加载 JavaScript 代码并显示：

<center><img src="/docs/assets/EmbeddedAppAndroidVideo.gif" width="300" /></center>

### 在 Android Studio 中创建发布构建

你也可以使用 Android Studio 来创建发布构建！这就像创建你之前存在的原生 Android 应用的发布构建一样快。

React Native Gradle 插件将负责将 JS 代码打包到你的 APK/App Bundle 中。

如果你不使用 Android Studio，你可以使用以下命令创建发布构建：

```
cd android
# 对于 Release APK
./gradlew :app:assembleRelease
# 对于 Release AAB
./gradlew :app:bundleRelease
```

### 接下来是什么？

此时你可以像往常一样继续开发你的应用。参考我们的 [调试](debugging) 和 [部署](running-on-device) 文档以了解更多关于使用 React Native 工作的信息。
