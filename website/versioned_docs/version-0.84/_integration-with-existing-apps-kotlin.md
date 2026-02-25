import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import constants from '@site/core/TabsConstants';
import CodeBlock from '@theme/CodeBlock';
import RNTemplateRepoLink from '@site/core/RNTemplateRepoLink';
import {getTemplateBranchNameForCurrentVersion} from '@site/src/getTemplateBranchNameForCurrentVersion';

## 关键概念

将 React Native 组件集成到您的 Android 应用中的关键是：

1. 设置正确的目录结构。
2. 安装必要的 NPM 依赖。
3. 将 React Native 添加到您的 Gradle 配置中。
4. 编写第一个 React Native 界面的 TypeScript 代码。
5. 通过 ReactActivity 将 React Native 与您的 Android 代码集成。
6. 运行打包器测试集成，并查看应用运行效果。

## 使用社区模板

在您按照本指南操作时，建议参考 [React Native 社区模板](https://github.com/react-native-community/template/)。该模板包含一个**最小化的 Android 应用**，有助于您理解如何将 React Native 集成到现有的 Android 应用中。

## 前置条件

请参照 [设置开发环境](set-up-your-environment) 和 [无框架使用 React Native 入门](getting-started-without-a-framework) 指南，配置您的开发环境以构建适用于 Android 的 React Native 应用。
本指南假设您已经熟悉 Android 开发的基础知识，比如创建 Activities 和编辑 `AndroidManifest.xml` 文件。

## 1. 设置目录结构

为了确保顺畅体验，创建一个新的文件夹用于您的集成 React Native 项目，然后**将现有的 Android 项目移动到 `/android` 子文件夹中**。

## 2. 安装 NPM 依赖

进入根目录，运行以下命令：

<CodeBlock language="bash" title="shell">
{`curl -O https://raw.githubusercontent.com/react-native-community/template/refs/heads/${getTemplateBranchNameForCurrentVersion()}/template/package.json`}
</CodeBlock>

这将从社区模板<RNTemplateRepoLink href="template/package.json">复制 `package.json` 文件</RNTemplateRepoLink>到您的项目中。

接着，运行以下命令安装 NPM 包：

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

安装过程会创建一个新的 `node_modules` 文件夹。该文件夹存储所有构建项目所需的 JavaScript 依赖。

请在 `.gitignore` 文件中添加 `node_modules/`（这里有一份<RNTemplateRepoLink href="template/_gitignore">社区默认示例</RNTemplateRepoLink>）。

## 3. 将 React Native 添加到您的应用中

### 配置 Gradle

React Native 使用 React Native Gradle 插件来配置依赖项和项目设置。

首先，编辑您的 `settings.gradle` 文件，添加以下内容（参考<RNTemplateRepoLink href="template/android/settings.gradle">社区模板</RNTemplateRepoLink>）：

```groovy
// 配置 React Native Gradle 设置插件以支持自动链接
pluginManagement { includeBuild("../node_modules/@react-native/gradle-plugin") }
plugins { id("com.facebook.react.settings") }
extensions.configure(com.facebook.react.ReactSettingsExtension){ ex -> ex.autolinkLibrariesFromCommand() }
// 如果使用 .gradle.kts 文件：
// extensions.configure<com.facebook.react.ReactSettingsExtension> { autolinkLibrariesFromCommand() }
includeBuild("../node_modules/@react-native/gradle-plugin")

// 在此包含您现有的 Gradle 模块。
// include(":app")
```

然后打开您的顶层 `build.gradle` 文件，添加以下行（参考<RNTemplateRepoLink href="template/android/build.gradle">社区模板</RNTemplateRepoLink>）：

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

这确保了 React Native Gradle 插件 (RNGP) 在项目中可用。

最后，在应用模块的 `build.gradle` 文件中添加以下配置（应用模块的 `build.gradle` 通常在 `app` 文件夹中，参考<RNTemplateRepoLink href="template/android/build.gradle">社区模板文件</RNTemplateRepoLink>）：

```diff
apply plugin: "com.android.application"
+apply plugin: "com.facebook.react"

repositories {
    mavenCentral()
}

dependencies {
    // 其他依赖项
+   // 注意：这里故意不指定版本号，RNGP 会自动处理。
+   // 如果不使用 RNGP，需要手动指定版本。
+   implementation("com.facebook.react:react-android")
+   implementation("com.facebook.react:hermes-android")
}

+react {
+   // 需要启用自动链接 - https://github.com/react-native-community/cli/blob/master/docs/autolinking.md
+   autolinkLibrariesWithApp()
+}
```

最后，打开应用的 `gradle.properties` 文件，添加以下内容（参考<RNTemplateRepoLink href="template/android/gradle.properties">社区模板</RNTemplateRepoLink>）：

```diff
+reactNativeArchitectures=armeabi-v7a,arm64-v8a,x86,x86_64
+newArchEnabled=true
+hermesEnabled=true
```

### 配置清单文件

首先，确保您的 `AndroidManifest.xml` 文件中有 Internet 权限：

```diff
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

+   <uses-permission android:name="android.permission.INTERNET" />

    <application
      android:name=".MainApplication">
    </application>
</manifest>
```

然后，在**debug** 版本的 `AndroidManifest.xml` 中启用[明文流量](https://developer.android.com/training/articles/security-config#CleartextTrafficPermitted)：

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

这里是社区模板中用于参考的 AndroidManifest.xml 文件：<RNTemplateRepoLink href="template/android/app/src/main/AndroidManifest.xml">main</RNTemplateRepoLink> 和 <RNTemplateRepoLink href="template/android/app/src/debug/AndroidManifest.xml">debug</RNTemplateRepoLink>。

这是必需的，因为您的应用需要通过 HTTP 与本机打包服务器 [Metro](https://metrobundler.dev/) 通信。

请确保只在**debug** 版本的清单文件中添加此配置。

## 4. 编写 TypeScript 代码

现在开始修改本机 Android 应用以集成 React Native。

首先编写的是新界面的 React Native 代码，这将被集成到应用中。

### 创建 `index.js` 文件

首先，在您的 React Native 项目根目录下创建一个空的 `index.js` 文件。

`index.js` 是 React Native 应用的入口文件，且始终必需。它可以是一个简单文件，`import` 其它 React Native 组件或应用的文件，也可以包含所有代码。

我们的 `index.js` 如下所示（参考<RNTemplateRepoLink href="template/index.js">社区模板</RNTemplateRepoLink>）：

```js
import {AppRegistry} from 'react-native';
import App from './App';

AppRegistry.registerComponent('HelloWorld', () => App);
```

### 创建 `App.tsx` 文件

接下来创建 `App.tsx`，这是一个支持 [TypeScript](https://www.typescriptlang.org/) 和 [JSX](<https://en.wikipedia.org/wiki/JSX_(JavaScript)>) 语法的文件。它包含我们将集成到 Android 应用中的根 React Native 组件（参考<RNTemplateRepoLink href="template/App.tsx">链接</RNTemplateRepoLink>）：

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
          <Text style={styles.title}>第一步</Text>
          <Text>
            编辑 <Text style={styles.bold}>App.tsx</Text> 来更改此页面内容，查看更改效果。
          </Text>
          <Text style={styles.title}>查看您的更改</Text>
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

这里是<RNTemplateRepoLink href="template/App.tsx">社区模板文件</RNTemplateRepoLink>供参考。

## 5. 与您的 Android 代码集成

现在需要添加一些本机代码来启动 React Native 运行时并告诉它渲染哪些 React 组件。

### 更新 Application 类

首先，更新您的 `Application` 类，以正确初始化 React Native，如下所示：

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

这里是社区模板中 <RNTemplateRepoLink href="template/android/app/src/main/java/com/helloworld/MainApplication.kt">`MainApplication.kt` 文件</RNTemplateRepoLink> 以供参考。

#### 创建 `ReactActivity`

最后，创建一个继承自 `ReactActivity` 的新 `Activity`，用以承载 React Native 代码。该 Activity 负责启动 React Native 运行时并渲染 React 组件。

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

这里是社区模板中 <RNTemplateRepoLink href="template/android/app/src/main/java/com/helloworld/MainActivity.kt">`MainActivity.kt` 文件</RNTemplateRepoLink> 以供参考。

当您创建新的 Activity 时，需在 `AndroidManifest.xml` 文件中添加它。同时将 `MyReactActivity` 的主题设置为 `Theme.AppCompat.Light.NoActionBar`（或任意非 ActionBar 主题），否则应用界面顶部会渲染一个 ActionBar，影响 React Native 界面显示：

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

现在，您的 Activity 已准备好运行 JavaScript 代码。

## 6. 测试集成效果

您已经完成了所有基本步骤，将 React Native 集成到应用中。现在启动 [Metro bundler](https://metrobundler.dev/) 来构建您的 TypeScript 应用代码并打包。Metro 在开发环境的 `localhost` 通过 HTTP 向模拟器或设备共享 bundle，从而支持[热重载](https://reactnative.dev/blog/2016/03/24/introducing-hot-reloading)。

首先，在项目根目录创建一个 `metro.config.js` 文件，内容如下：

```js
const {getDefaultConfig} = require('@react-native/metro-config');
module.exports = getDefaultConfig(__dirname);
```

您可以参考社区模板中的 <RNTemplateRepoLink href="template/metro.config.js">`metro.config.js` 文件</RNTemplateRepoLink>。

配置完成后，在项目根目录运行以下命令启动打包器：

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

接下来像平时一样构建并运行您的 Android 应用。

当您进入 React Native 控制的 Activity 时，它会从开发服务器加载 JavaScript 代码并显示如下界面：

<center><img src="/docs/assets/EmbeddedAppAndroidVideo.gif" width="300" /></center>

### 使用 Android Studio 创建发布版本

您也可以使用 Android Studio 创建发布版本，流程与您之前创建原生 Android 应用的发布版本一样简单。

React Native Gradle 插件会自动将 JS 代码打包进 APK 或 App Bundle。

如果不使用 Android Studio，可以在命令行用以下命令创建发布版本：

```
cd android
# 创建 Release APK
./gradlew :app:assembleRelease
# 创建 Release AAB
./gradlew :app:bundleRelease
```

### 接下来做什么？

此时，您可以照常继续开发应用。请参考我们的[调试](debugging)和[部署](running-on-device)文档，了解更多 React Native 的使用方法。
