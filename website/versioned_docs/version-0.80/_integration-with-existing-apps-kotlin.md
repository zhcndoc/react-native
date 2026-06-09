import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

## 关键概念

将 React Native 组件集成到 Android 应用中的关键在于：

1. 设置正确的目录结构。
2. 安装必要的 NPM 依赖。
3. 将 React Native 添加到你的 Gradle 配置中。
4. 为你的第一个 React Native 屏幕编写 TypeScript 代码。
5. 使用 `ReactActivity` 将 React Native 与你的 Android 代码集成。
6. 运行 bundler 并看到应用实际运行，以测试你的集成。

## 使用社区模板

在你遵循本指南时，我们建议你将 [React Native Community Template](https://github.com/react-native-community/template/) 作为参考。该模板包含一个**最小化的 Android 应用**，并将帮助你理解如何将 React Native 集成到现有的 Android 应用中。

## 前置条件

请先阅读 [设置开发环境](set-up-your-environment) 以及使用 [不依赖框架的 React Native](getting-started-without-a-framework) 的指南，以配置用于构建 Android React Native 应用的开发环境。
本指南还假设你已经熟悉 Android 开发的基础知识，例如创建 Activity 和编辑 `AndroidManifest.xml` 文件。

## 1. 设置目录结构

为了确保顺利体验，请为你的集成 React Native 项目创建一个新文件夹，然后将你现有的 Android 项目**移动到** `/android` 子文件夹中。

## 2. 安装 NPM 依赖

进入根目录并运行以下命令：

```shell
curl -O https://raw.githubusercontent.com/react-native-community/template/refs/heads/0.75-stable/template/package.json
```

这会将 [社区模板中的 `package.json`](https://github.com/react-native-community/template/blob/0.75-stable/template/package.json) 文件复制到你的项目中。

接下来，运行以下命令安装 NPM 包：

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

安装过程会创建一个新的 `node_modules` 文件夹。该文件夹存储构建项目所需的所有 JavaScript 依赖项。

将 `node_modules/` 添加到你的 `.gitignore` 文件中（这里可参考[社区默认版本](https://github.com/react-native-community/template/blob/0.75-stable/template/_gitignore)）。

## 3. 将 React Native 添加到你的应用中

### 配置 Gradle

React Native 使用 React Native Gradle Plugin 来配置你的依赖项和项目设置。

首先，编辑你的 `settings.gradle` 文件，添加以下内容（如[社区模板](https://github.com/react-native-community/template/blob/0.77-stable/template/android/settings.gradle)所建议）：

```groovy
// 配置用于自动链接的 React Native Gradle Settings 插件
pluginManagement { includeBuild("../node_modules/@react-native/gradle-plugin") }
plugins { id("com.facebook.react.settings") }
extensions.configure(com.facebook.react.ReactSettingsExtension){ ex -> ex.autolinkLibrariesFromCommand() }
// 如果使用 .gradle.kts 文件：
// extensions.configure<com.facebook.react.ReactSettingsExtension> { autolinkLibrariesFromCommand() }
includeBuild("../node_modules/@react-native/gradle-plugin")

// 在这里包含你现有的 Gradle 模块。
// include(":app")
```

然后，你需要打开顶层 `build.gradle` 并加入这一行（如[社区模板](https://github.com/react-native-community/template/blob/0.77-stable/template/android/build.gradle)所建议）：

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

这可以确保 React Native Gradle Plugin（RNGP）在你的项目中可用。
最后，在你应用的 `build.gradle` 文件中加入以下内容（这是另一个通常位于 `app` 文件夹中的 `build.gradle` 文件——你可以将[社区模板文件作为参考](https://github.com/react-native-community/template/blob/0.77-stable/template/android/app/build.gradle)）：

```diff
apply plugin: "com.android.application"
+apply plugin: "com.facebook.react"

repositories {
    mavenCentral()
}

dependencies {
    // 这里是其他依赖
+   // 注意：我们故意不在这里指定版本号，因为 RNGP 会负责处理。
+   // 如果你不使用 RNGP，就必须手动指定版本。
+   implementation("com.facebook.react:react-android")
+   implementation("com.facebook.react:hermes-android")
}

+react {
+   // 启用 Autolinking 所需 - https://github.com/react-native-community/cli/blob/master/docs/autolinking.md
+   autolinkLibrariesWithApp()
+}
```

最后，打开你的应用的 `gradle.properties` 文件并添加以下行（这里可参考[社区模板文件](https://github.com/react-native-community/template/blob/0.77-stable/template/android/gradle.properties)）：

```diff
+reactNativeArchitectures=armeabi-v7a,arm64-v8a,x86,x86_64
+newArchEnabled=true
+hermesEnabled=true
```

### 配置清单文件

首先，确保你的 `AndroidManifest.xml` 中包含 Internet 权限：

```diff
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

+   <uses-permission android:name="android.permission.INTERNET" />

    <application
      android:name=".MainApplication">
    </application>
</manifest>
```

然后，你需要在 **debug** 版 `AndroidManifest.xml` 中启用[明文流量](https://developer.android.com/training/articles/security-config#CleartextTrafficPermitted)：

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

同样，这里提供社区模板中的 AndroidManifest.xml 文件供参考：[main](https://github.com/react-native-community/template/blob/0.77-stable/template/android/app/src/main/AndroidManifest.xml) 和 [debug](https://github.com/react-native-community/template/blob/0.77-stable/template/android/app/src/debug/AndroidManifest.xml)

这是必要的，因为你的应用将通过 HTTP 与本地 bundler [Metro](https://metrobundler.dev/) 通信。

请确保只将其添加到你的 **debug** 清单文件中。

## 4. 编写 TypeScript 代码

现在我们将真正修改原生 Android 应用，以集成 React Native。

我们首先要编写的代码是新的屏幕对应的实际 React Native 代码，它将集成到我们的应用中。

### 创建 `index.js` 文件

首先，在你的 React Native 项目根目录中创建一个空的 `index.js` 文件。

`index.js` 是 React Native 应用的入口点，而且始终是必需的。它可以是一个小文件，用来 `import` 其他属于你的 React Native 组件或应用的文件；也可以包含所需的全部代码。

我们的 `index.js` 应如下所示（这里可参考[社区模板文件](https://github.com/react-native-community/template/blob/0.77-stable/template/index.js)）：

```js
import {AppRegistry} from 'react-native';
import App from './App';

AppRegistry.registerComponent('HelloWorld', () => App);
```

### 创建 `App.tsx` 文件

让我们创建一个 `App.tsx` 文件。这是一个 [TypeScript](https://www.typescriptlang.org/) 文件，可以包含 [JSX](<https://en.wikipedia.org/wiki/JSX_(JavaScript)>) 表达式。它包含我们将集成到 Android 应用中的 React Native 根组件（[链接](https://github.com/react-native-community/template/blob/0.77-stable/template/App.tsx)）：

```tsx
import {type JSX} from 'react';
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

function App(): JSX.Element {
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
          <Text style={styles.title}>步骤一</Text>
          <Text>
            编辑 <Text style={styles.bold}>App.tsx</Text>，以更改此屏幕并查看你的修改。
          </Text>
          <Text style={styles.title}>查看你的更改</Text>
          <ReloadInstructions />
          <Text style={styles.title}>调试</Text>
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

这里可参考[社区模板文件](https://github.com/react-native-community/template/blob/0.77-stable/template/App.tsx)

## 5. 将 React Native 与你的 Android 代码集成

我们现在需要添加一些原生代码，以启动 React Native 运行时并告诉它渲染我们的 React 组件。

### 更新你的 Application 类

首先，我们需要按如下方式更新你的 `Application` 类，以正确初始化 React Native：

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
// package <your-package-here>

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

同样，这里可参考[社区模板的 MainApplication.kt 文件](https://github.com/react-native-community/template/blob/0.77-stable/template/android/app/src/main/java/com/helloworld/MainApplication.kt)

#### 创建一个 `ReactActivity`

最后，我们需要创建一个新的 `Activity`，它将继承 `ReactActivity` 并承载 React Native 代码。这个 activity 将负责启动 React Native 运行时并渲染 React 组件。

<Tabs groupId="android-language" queryString defaultValue={constants.defaultAndroidLanguage} values={constants.androidLanguages}>

<TabItem value="java">

```java
// package <your-package-here>;

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
// package <your-package-here>

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

同样，这里可参考[社区模板的 MainActivity.kt 文件](https://github.com/react-native-community/template/blob/0.77-stable/template/android/app/src/main/java/com/helloworld/MainApplication.kt)

每当你创建一个新的 Activity 时，都需要将其添加到你的 `AndroidManifest.xml` 文件中。你还需要将 `MyReactActivity` 的主题设置为 `Theme.AppCompat.Light.NoActionBar`（或者任何不带 ActionBar 的主题），否则你的应用会在 React Native 屏幕顶部渲染一个 ActionBar：

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

你已经完成了将 React Native 与你的应用程序集成所需的所有基本步骤。现在我们将启动 [Metro bundler](https://metrobundler.dev/)，把你的 TypeScript 应用代码构建成一个 bundle。Metro 的 HTTP 服务器会将你开发环境中 `localhost` 上的 bundle 分享到模拟器或设备上。这支持 [热重载](https://reactnative.dev/blog/2016/03/24/introducing-hot-reloading)。

首先，你需要在项目根目录下创建一个 `metro.config.js` 文件，如下所示：

```js
const {getDefaultConfig} = require('@react-native/metro-config');
module.exports = getDefaultConfig(__dirname);
```

你可以参考社区模板中的 [metro.config.js 文件](https://github.com/react-native-community/template/blob/0.77-stable/template/metro.config.js)。

配置文件准备好之后，就可以运行 bundler 了。在项目根目录下运行以下命令：

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

现在像平常一样构建并运行你的 Android 应用。

当你进入应用中由 React 驱动的 Activity 后，它应该会从开发服务器加载 JavaScript 代码并显示：

<center><img src="/docs/assets/EmbeddedAppAndroidVideo.gif" width="300" /></center>

### 在 Android Studio 中创建发布版本

你也可以使用 Android Studio 来创建发布版本！这和为你之前已有的原生 Android 应用创建发布版本一样快。

React Native Gradle Plugin 会负责将 JS 代码打包进你的 APK/App Bundle 中。

如果你没有使用 Android Studio，也可以通过以下方式创建发布版本：

```
cd android
# 发布 APK
./gradlew :app:assembleRelease
# 发布 AAB
./gradlew :app:bundleRelease
```

### 接下来做什么？

到这里，你可以继续像往常一样开发你的应用。请参阅我们的 [调试](debugging) 和 [部署](running-on-device) 文档，了解更多关于使用 React Native 的内容。
