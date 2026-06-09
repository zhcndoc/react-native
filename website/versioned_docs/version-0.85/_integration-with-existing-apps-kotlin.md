import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import constants from '@site/core/TabsConstants';
import CodeBlock from '@theme/CodeBlock';
import RNTemplateRepoLink from '@site/core/RNTemplateRepoLink';
import {getTemplateBranchNameForCurrentVersion} from '@site/src/getTemplateBranchNameForCurrentVersion';

## 核心概念

将 React Native 组件集成到 Android 应用中的关键步骤如下：

1. 设置正确的目录结构。
2. 安装必要的 NPM 依赖。
3. 将 React Native 添加到你的 Gradle 配置中。
4. 为你的第一个 React Native 屏幕编写 TypeScript 代码。
5. 使用 `ReactActivity` 将 React Native 集成到你的 Android 代码中。
6. 通过运行打包器并查看应用运行效果来测试你的集成。

## 使用社区模板

在阅读本指南时，我们建议你将 [React Native Community Template](https://github.com/react-native-community/template/) 作为参考。该模板包含一个 **最小化的 Android 应用**，并将帮助你理解如何将 React Native 集成到现有的 Android 应用中。

## 前置条件

请先阅读 [设置开发环境](set-up-your-environment) 和 [不使用框架的 React Native](getting-started-without-a-framework) 指南，以便配置用于构建 Android 版 React Native 应用的开发环境。
本指南还默认你已熟悉 Android 开发基础，例如创建 Activity 以及编辑 `AndroidManifest.xml` 文件。

## 1. 设置目录结构

为了确保顺利体验，请为集成 React Native 的项目创建一个新文件夹，然后将你现有的 Android 项目 **移动到** `/android` 子文件夹中。

## 2. 安装 NPM 依赖

进入根目录并运行以下命令：

<CodeBlock language="bash" title="shell">
{`curl -O https://raw.githubusercontent.com/react-native-community/template/refs/heads/${getTemplateBranchNameForCurrentVersion()}/template/package.json`}
</CodeBlock>

这会将社区模板中的 `package.json` <RNTemplateRepoLink href="template/package.json">文件复制到你的项目中</RNTemplateRepoLink>。

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

安装过程会创建一个新的 `node_modules` 文件夹。这个文件夹会存放构建项目所需的所有 JavaScript 依赖。

将 `node_modules/` 添加到你的 `.gitignore` 文件中（这里使用 <RNTemplateRepoLink href="template/_gitignore">社区默认版本</RNTemplateRepoLink>）。

## 3. 将 React Native 添加到你的应用中

### 配置 Gradle

React Native 使用 React Native Gradle Plugin 来配置你的依赖和项目设置。

首先，编辑你的 `settings.gradle` 文件，添加以下内容（如 <RNTemplateRepoLink href="template/android/settings.gradle">社区模板</RNTemplateRepoLink> 所建议）：

```groovy
// 配置 React Native Gradle Settings 插件，用于自动链接
pluginManagement { includeBuild("../node_modules/@react-native/gradle-plugin") }
plugins { id("com.facebook.react.settings") }
extensions.configure(com.facebook.react.ReactSettingsExtension){ ex -> ex.autolinkLibrariesFromCommand() }
// 如果使用 .gradle.kts 文件：
// extensions.configure<com.facebook.react.ReactSettingsExtension> { autolinkLibrariesFromCommand() }
includeBuild("../node_modules/@react-native/gradle-plugin")

// 在这里包含你现有的 Gradle 模块。
// include(":app")
```

然后你需要打开顶层的 `build.gradle`，并加入这一行（如 <RNTemplateRepoLink href="template/android/build.gradle">社区模板</RNTemplateRepoLink> 所建议）：

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

这可确保 React Native Gradle Plugin（RNGP）在你的项目中可用。
最后，在你的应用 `build.gradle` 文件中添加这些行（它是另一个不同的 `build.gradle` 文件，通常位于你的 `app` 文件夹中——你可以将 <RNTemplateRepoLink href="template/android/build.gradle">社区模板文件作为参考</RNTemplateRepoLink>）：

```diff
apply plugin: "com.android.application"
+apply plugin: "com.facebook.react"

repositories {
    mavenCentral()
}

dependencies {
    // Other dependencies here
+   // 注意：这里我们故意不指定版本号，因为 RNGP 会负责处理。
+   // 如果你不使用 RNGP，就必须手动指定版本。
+   implementation("com.facebook.react:react-android")
+   implementation("com.facebook.react:hermes-android")
}

+react {
+   // 启用自动链接所需 - https://github.com/react-native-community/cli/blob/master/docs/autolinking.md
+   autolinkLibrariesWithApp()
+}
```

最后，打开你的应用 `gradle.properties` 文件并添加以下行（这里使用 <RNTemplateRepoLink href="template/android/gradle.properties">社区模板文件作为参考</RNTemplateRepoLink>）：

```diff
+reactNativeArchitectures=armeabi-v7a,arm64-v8a,x86,x86_64
+newArchEnabled=true
+hermesEnabled=true
```

### 配置你的清单文件

首先，确保你的 `AndroidManifest.xml` 中有互联网权限：

```diff
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

+   <uses-permission android:name="android.permission.INTERNET" />

    <application
      android:name=".MainApplication">
    </application>
</manifest>
```

然后你需要在 **调试** 用的 `AndroidManifest.xml` 中启用 [明文流量](https://developer.android.com/training/articles/security-config#CleartextTrafficPermitted)：

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

照例，这里提供社区模板中的 AndroidManifest.xml 文件供参考：<RNTemplateRepoLink href="template/android/app/src/main/AndroidManifest.xml">主文件</RNTemplateRepoLink> 和 <RNTemplateRepoLink href="template/android/app/src/debug/AndroidManifest.xml">调试文件</RNTemplateRepoLink>。

这样做是必要的，因为你的应用将通过 HTTP 与本地打包器 [Metro](https://metrobundler.dev/) 通信。

请务必只将其添加到你的 **调试** 清单文件中。

## 4. 编写 TypeScript 代码

现在我们将实际修改原生 Android 应用，以集成 React Native。

我们要编写的第一部分代码，是用于要集成到应用中的新屏幕的 React Native 代码本身。

### 创建一个 `index.js` 文件

首先，在你的 React Native 项目根目录中创建一个空的 `index.js` 文件。

`index.js` 是 React Native 应用的入口点，而且始终是必需的。它可以是一个很小的文件，用于 `import` 其他属于你的 React Native 组件或应用的文件；也可以包含所需的全部代码。

我们的 `index.js` 应如下所示（这里使用 <RNTemplateRepoLink href="template/index.js">社区模板文件作为参考</RNTemplateRepoLink>）：

```js
import {AppRegistry} from 'react-native';
import App from './App';

AppRegistry.registerComponent('HelloWorld', () => App);
```

### 创建一个 `App.tsx` 文件

让我们创建一个 `App.tsx` 文件。这是一个可以包含 [JSX](<https://en.wikipedia.org/wiki/JSX_(JavaScript)>) 表达式的 [TypeScript](https://www.typescriptlang.org/) 文件。它包含我们将集成到 Android 应用中的 React Native 根组件（<RNTemplateRepoLink href="template/App.tsx">链接</RNTemplateRepoLink>）：

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
          <Text style={styles.title}>第一步</Text>
          <Text>
            编辑 <Text style={styles.bold}>App.tsx</Text> 以
            更改这个屏幕并查看你的修改。
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

这里是 <RNTemplateRepoLink href="template/App.tsx">社区模板文件作为参考</RNTemplateRepoLink>。

## 5. 与你的 Android 代码集成

现在我们需要添加一些原生代码，以便启动 React Native 运行时并告诉它渲染我们的 React 组件。

### 更新你的 `Application` 类

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

一如既往，这里以 <RNTemplateRepoLink href="template/android/app/src/main/java/com/helloworld/MainApplication.kt">`MainApplication.kt` Community 模板文件</RNTemplateRepoLink> 作为参考。

#### 创建一个 `ReactActivity`

最后，我们需要创建一个新的 `Activity`，它将继承 `ReactActivity` 并承载 React Native 代码。这个 Activity 将负责启动 React Native 运行时并渲染 React 组件。

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

一如既往，这里以 <RNTemplateRepoLink href="template/android/app/src/main/java/com/helloworld/MainActivity.kt">`MainActivity.kt` Community 模板文件</RNTemplateRepoLink> 作为参考。

每当你创建一个新的 Activity，都需要将其添加到你的 `AndroidManifest.xml` 文件中。你还需要将 `MyReactActivity` 的主题设置为 `Theme.AppCompat.Light.NoActionBar`（或者任何非 ActionBar 主题），否则你的应用会在 React Native 屏幕顶部渲染一个 ActionBar：

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

你已经完成了将 React Native 集成到应用中的所有基础步骤。现在我们将启动 [Metro bundler](https://metrobundler.dev/)，把你的 TypeScript 应用代码打包成一个 bundle。Metro 的 HTTP 服务器会将位于开发环境 `localhost` 上的 bundle 分享到模拟器或设备。这支持 [热重载](https://reactnative.dev/blog/2016/03/24/introducing-hot-reloading)。

首先，你需要在项目根目录下创建一个 `metro.config.js` 文件，如下所示：

```js
const {getDefaultConfig} = require('@react-native/metro-config');
module.exports = getDefaultConfig(__dirname);
```

你可以参考社区模板中的 <RNTemplateRepoLink href="template/metro.config.js">`metro.config.js` 文件</RNTemplateRepoLink>。

配置文件就绪后，你就可以运行 bundler 了。在项目根目录下运行以下命令：

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

现在照常构建并运行你的 Android 应用。

当你在应用中进入由 React 驱动的 Activity 后，它应该会从开发服务器加载 JavaScript 代码并显示：

<center><img src="/docs/assets/EmbeddedAppAndroidVideo.gif" width="300" /></center>

### 在 Android Studio 中创建发布构建

你也可以使用 Android Studio 创建发布构建！这和为你之前已有的原生 Android 应用创建发布构建一样快捷。

React Native Gradle Plugin 会负责将 JS 代码打包进你的 APK/App Bundle 中。

如果你不使用 Android Studio，也可以使用以下命令创建发布构建：

```
cd android
# 生成 Release APK
./gradlew :app:assembleRelease
# 生成 Release AAB
./gradlew :app:bundleRelease
```

### 接下来呢？

此时你可以像往常一样继续开发你的应用。请参阅我们的 [调试](debugging) 和 [部署](running-on-device) 文档，了解更多关于使用 React Native 的信息。
