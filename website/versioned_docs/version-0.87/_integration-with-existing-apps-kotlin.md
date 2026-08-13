import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import constants from '@site/core/TabsConstants';
import CodeBlock from '@theme/CodeBlock';
import RNTemplateRepoLink from '@site/core/RNTemplateRepoLink';
import {getTemplateBranchNameForCurrentVersion} from '@site/src/getTemplateBranchNameForCurrentVersion';

## 核心概念

将 React Native 组件集成到 Android 应用中的关键步骤包括：

1. 设置正确的目录结构
2. 安装必要的 NPM 依赖
3. 将 React Native 添加到 Gradle 配置中
4. 为第一个 React Native 屏幕编写 TypeScript 代码
5. 使用 ReactActivity 将 React Native 与 Android 代码集成
6. 运行 bundler 并查看应用运行效果，以测试集成

## 使用 Community Template

在遵循本指南的过程中，我们建议你参考 [React Native Community Template](https://github.com/react-native-community/template/)。该模板包含一个**最小化的 Android 应用**，可以帮助你了解如何将 React Native 集成到现有的 Android 应用中。

## 先决条件

遵循[设置开发环境](set-up-your-environment)以及使用[不带框架的 React Native](getting-started-without-a-framework)指南，为构建 Android React Native 应用配置开发环境。  
本指南还假设你熟悉 Android 开发基础知识，例如创建 Activity 和编辑 `AndroidManifest.xml` 文件。

## 1. 设置目录结构

为确保顺利完成操作，请为集成 React Native 的项目创建一个新文件夹，然后将**现有的 Android 项目**移动到 `/android` 子文件夹中。

## 2. 安装 NPM 依赖

进入根目录并运行以下命令：

<CodeBlock language="bash" title="shell">
{`curl -O https://raw.githubusercontent.com/react-native-community/template/refs/heads/${getTemplateBranchNameForCurrentVersion()}/template/package.json`}
</CodeBlock>

这会将 Community template 中的 `package.json` <RNTemplateRepoLink href="template/package.json">文件</RNTemplateRepoLink>复制到你的项目中。

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

安装过程会创建一个新的 `node_modules` 文件夹。该文件夹存储构建项目所需的所有 JavaScript 依赖。

将 `node_modules/` 添加到你的 `.gitignore` 文件中（此处为 <RNTemplateRepoLink href="template/_gitignore">Community 默认文件</RNTemplateRepoLink>）。

## 3. 将 React Native 添加到你的应用中

### 配置 Gradle

React Native 使用 React Native Gradle Plugin 来配置依赖和项目设置。

首先，按照以下方式编辑 `settings.gradle` 文件，添加这些代码行（如 <RNTemplateRepoLink href="template/android/settings.gradle">Community template</RNTemplateRepoLink> 中所示）：

```groovy
// Configures the React Native Gradle Settings plugin used for autolinking
pluginManagement { includeBuild("../node_modules/@react-native/gradle-plugin") }
plugins { id("com.facebook.react.settings") }
extensions.configure(com.facebook.react.ReactSettingsExtension){ ex -> ex.autolinkLibrariesFromCommand() }
// If using .gradle.kts files:
// extensions.configure<com.facebook.react.ReactSettingsExtension> { autolinkLibrariesFromCommand() }
includeBuild("../node_modules/@react-native/gradle-plugin")

// Include your existing Gradle modules here.
// include(":app")
```

然后打开顶层的 `build.gradle`，并添加以下代码行（如 <RNTemplateRepoLink href="template/android/build.gradle">Community template</RNTemplateRepoLink> 中所示）：

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

这样可以确保 React Native Gradle Plugin（RNGP）在项目中可用。  
最后，在应用的 `build.gradle` 文件中添加以下代码行（这是另一个不同的 `build.gradle` 文件，通常位于你的 `app` 文件夹中——你可以参考 <RNTemplateRepoLink href="template/android/build.gradle">Community template 文件</RNTemplateRepoLink>）：

```diff
apply plugin: "com.android.application"
+apply plugin: "com.facebook.react"

repositories {
    mavenCentral()
}

dependencies {
    // Other dependencies here
+   // Note: we intentionally don't specify the version number here as RNGP will take care of it.
+   // If you don't use the RNGP, you'll have to specify version manually.
+   implementation("com.facebook.react:react-android")
+   implementation("com.facebook.react:hermes-android")
}

+react {
+   // Needed to enable Autolinking - https://github.com/react-native-community/cli/blob/master/docs/autolinking.md
+   autolinkLibrariesWithApp()
+}
```

最后，打开应用的 `gradle.properties` 文件，并添加以下代码行（此处可参考 <RNTemplateRepoLink href="template/android/gradle.properties">Community template 文件</RNTemplateRepoLink>）：

```diff
+reactNativeArchitectures=armeabi-v7a,arm64-v8a,x86,x86_64
+newArchEnabled=true
+hermesEnabled=true
```

### 配置 manifest

首先，确保你的 `AndroidManifest.xml` 中具有 Internet 权限：

```diff
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

+   <uses-permission android:name="android.permission.INTERNET" />

    <application
      android:name=".MainApplication">
    </application>
</manifest>
```

然后，需要在**调试** `AndroidManifest.xml` 中启用[明文流量](https://developer.android.com/training/articles/security-config#CleartextTrafficPermitted)：

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

和往常一样，以下是 Community template 中的 AndroidManifest.xml 文件，可供参考：<RNTemplateRepoLink href="template/android/app/src/main/AndroidManifest.xml">main</RNTemplateRepoLink> 和 <RNTemplateRepoLink href="template/android/app/src/debug/AndroidManifest.xml">debug</RNTemplateRepoLink>。

这是必需的，因为你的应用将通过 HTTP 与本地 bundler [Metro](https://metrobundler.dev/) 通信。

请确保只将其添加到你的**调试** manifest 中。

## 4. 编写 TypeScript 代码

现在，我们将实际修改原生 Android 应用，以集成 React Native。

我们要编写的第一段代码，是将要集成到应用中的新屏幕对应的 React Native 代码。

### 创建 `index.js` 文件

首先，在 React Native 项目的根目录中创建一个空的 `index.js` 文件。

`index.js` 是 React Native 应用的入口点，并且始终是必需的。它可以是一个用于 `import` React Native 组件或应用中其他文件的小文件，也可以包含运行该组件或应用所需的全部代码。

我们的 index.js 应如下所示（此处可参考 <RNTemplateRepoLink href="template/index.js">Community template 文件</RNTemplateRepoLink>）：

```js
import {AppRegistry} from 'react-native';
import App from './App';

AppRegistry.registerComponent('HelloWorld', () => App);
```

### 创建 `App.tsx` 文件

让我们创建一个 `App.tsx` 文件。这是一个可以包含 [JSX](<https://en.wikipedia.org/wiki/JSX_(JavaScript)>) 表达式的 [TypeScript](https://www.typescriptlang.org/) 文件。它包含我们将集成到 Android 应用中的根 React Native 组件（<RNTemplateRepoLink href="template/App.tsx">链接</RNTemplateRepoLink>）：

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

以下是 <RNTemplateRepoLink href="template/App.tsx">Community template 文件，可供参考</RNTemplateRepoLink>。

## 5. 与 Android 代码集成

现在，我们需要添加一些原生代码，以便启动 React Native 运行时并让它渲染我们的 React 组件。

### 更新 Application 类

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

和往常一样，以下是 Community template 中的 <RNTemplateRepoLink href="template/android/app/src/main/java/com/helloworld/MainApplication.kt">`MainApplication.kt` 文件，可供参考</RNTemplateRepoLink>。

#### 创建一个 `ReactActivity`

最后，我们需要创建一个继承 `ReactActivity` 并承载 React Native 代码的新 `Activity`。该 Activity 将负责启动 React Native 运行时并渲染 React 组件。

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

和往常一样，以下是 Community template 中的 <RNTemplateRepoLink href="template/android/app/src/main/java/com/helloworld/MainActivity.kt">`MainActivity.kt` 文件，可供参考</RNTemplateRepoLink>。

每当你创建一个新的 Activity 时，都需要将其添加到 `AndroidManifest.xml` 文件中。你还需要将 `MyReactActivity` 的主题设置为 `Theme.AppCompat.Light.NoActionBar`（或任何不带 ActionBar 的主题），否则你的应用将在 React Native 屏幕顶部渲染一个 ActionBar：

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

现在，你的 Activity 已准备好运行 JavaScript 代码。

## 6. 测试集成

你已经完成了将 React Native 集成到应用中的所有基本步骤。现在，我们将启动 [Metro bundler](https://metrobundler.dev/)，将 TypeScript 应用代码构建为 bundle。Metro 的 HTTP 服务器会将开发环境中 `localhost` 上的 bundle 共享给模拟器或设备。这可以实现[热重载](https://reactnative.dev/blog/2016/03/24/introducing-hot-reloading)。

首先，需要在项目根目录中创建一个 `metro.config.js` 文件，内容如下：

```js
const {getDefaultConfig} = require('@react-native/metro-config');
module.exports = getDefaultConfig(__dirname);
```

你可以从 Community template 中查看 <RNTemplateRepoLink href="template/metro.config.js">`metro.config.js` 文件</RNTemplateRepoLink>，以供参考。

准备好配置文件后，就可以运行 bundler 了。在项目根目录中运行以下命令：

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

现在，像平常一样构建并运行你的 Android 应用。

当你在应用中进入由 React 驱动的 Activity 后，它应从开发服务器加载 JavaScript 代码并显示：

<center><img src="/docs/assets/EmbeddedAppAndroidVideo.gif" width="300" /></center>

### 在 Android Studio 中创建 release 构建

你也可以使用 Android Studio 创建 release 构建！这与为之前已有的原生 Android 应用创建 release 构建一样快捷。

React Native Gradle Plugin 会负责将 JS 代码打包到你的 APK/App Bundle 中。

如果你不使用 Android Studio，可以通过以下方式创建 release 构建：

```
cd android
# For a Release APK
./gradlew :app:assembleRelease
# For a Release AAB
./gradlew :app:bundleRelease
```

### 接下来做什么？

此时，你可以像往常一样继续开发应用。请参考我们的[调试](debugging)和[部署](running-on-device)文档，详细了解如何使用 React Native。
