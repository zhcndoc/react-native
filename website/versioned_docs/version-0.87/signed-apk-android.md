---
id: signed-apk-android
title: 发布到 Google Play Store
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

Android 要求所有应用在安装前都必须使用证书进行数字签名。为了通过 [Google Play 商店](https://play.google.com/store) 分发 Android 应用，需要使用发布密钥对其进行签名，并且该密钥需要用于所有后续更新。自 2017 年起，借助 [App Signing by Google Play](https://developer.android.com/studio/publish/app-signing#app-signing-google-play) 功能，Google Play 可以自动管理发布签名。不过，在将应用二进制文件上传到 Google Play 之前，需要先使用上传密钥对其进行签名。Android Developers 文档中的 [Signing Your Applications](https://developer.android.com/tools/publishing/app-signing.html) 页面详细介绍了相关主题。本指南将简要介绍该过程，并列出打包 JavaScript bundle 所需的步骤。

:::info
如果你使用的是 Expo，请阅读 Expo 的 [Deploying to App Stores](https://docs.expo.dev/distribution/app-stores/) 指南，以构建应用并将其提交到 Google Play 商店。本指南适用于任何 React Native 应用，可用于自动化部署流程。
:::

## 生成上传密钥

你可以使用 `keytool` 生成私有签名密钥。

### Windows

在 Windows 上，必须以管理员身份从 `C:\Program Files\Java\jdkx.x.x_x\bin` 运行 `keytool`。

```shell
keytool -genkeypair -v -storetype PKCS12 -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

此命令会提示你输入密钥库和密钥的密码，以及密钥的 Distinguished Name 字段。随后，它会生成一个名为 `my-upload-key.keystore` 的密钥库文件。

该密钥库包含一个有效期为 10000 天的密钥。别名是你稍后签名应用时要使用的名称，因此请务必记下该别名。

### macOS

在 macOS 上，如果你不确定 JDK bin 文件夹的位置，请执行以下命令来查找：

```shell
/usr/libexec/java_home
```

它会输出 JDK 的目录，格式类似于：

```shell
/Library/Java/JavaVirtualMachines/jdkX.X.X_XXX.jdk/Contents/Home
```

使用命令 `cd /your/jdk/path` 导航到该目录，然后使用如下所示的 sudo 权限运行 keytool 命令。

```shell
sudo keytool -genkey -v -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

:::caution
请务必妥善保管密钥库文件。如果上传密钥丢失或遭到泄露，请[按照这些说明操作](https://support.google.com/googleplay/android-developer/answer/7384423#reset)。
:::

## 设置 Gradle 变量

1. 将 `my-upload-key.keystore` 文件放置在项目文件夹中的 `android/app` 目录下。
2. 编辑文件 `~/.gradle/gradle.properties` 或 `android/gradle.properties`，并添加以下内容（将 `*****` 替换为正确的密钥库密码、别名和密钥密码）：

```
MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore
MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
MYAPP_UPLOAD_STORE_PASSWORD=*****
MYAPP_UPLOAD_KEY_PASSWORD=*****
```

这些将成为全局 Gradle 变量，之后我们可以在 Gradle 配置中使用它们来签名应用。

:::note[关于使用 git 的说明]
将上述 Gradle 变量保存到 `~/.gradle/gradle.properties` 而不是 `android/gradle.properties`，可以避免将它们提交到 git。你可能需要先在用户的主目录中创建 `~/.gradle/gradle.properties` 文件，然后才能添加这些变量。
:::

:::note[关于安全性的说明]
如果你不希望以明文形式存储密码，并且使用的是 macOS，也可以[将凭据存储在 Keychain Access 应用中](https://pilloxa.gitlab.io/posts/safer-passwords-in-gradle/)。这样就可以跳过 `~/.gradle/gradle.properties` 中最后两行。
:::

## 向应用的 Gradle 配置添加签名配置

需要完成的最后一项配置是设置使用上传密钥对发布构建进行签名。编辑项目文件夹中的 `android/app/build.gradle` 文件，并添加签名配置：

```groovy
...
android {
    ...
    defaultConfig { ... }
    signingConfigs {
        release {
            if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {
                storeFile file(MYAPP_UPLOAD_STORE_FILE)
                storePassword MYAPP_UPLOAD_STORE_PASSWORD
                keyAlias MYAPP_UPLOAD_KEY_ALIAS
                keyPassword MYAPP_UPLOAD_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            ...
            signingConfig signingConfigs.release
        }
    }
}
...
```

## 生成发布 AAB

在终端中运行以下命令：

```shell
npx react-native build-android --mode=release
```

此命令在底层使用 Gradle 的 `bundleRelease`，将运行应用所需的所有 JavaScript 打包到 AAB（[Android App Bundle](https://developer.android.com/guide/app-bundle)）中。如果需要更改 JavaScript bundle 和／或 drawable 资源的打包方式（例如，如果更改了默认文件／文件夹名称或项目的整体结构），请查看 `android/app/build.gradle`，了解如何更新它以反映这些更改。

:::note
确保 `gradle.properties` 不包含 `org.gradle.configureondemand=true`，因为这会使发布构建跳过将 JS 和资源打包到应用二进制文件中的步骤。
:::

生成的 AAB 位于 `android/app/build/outputs/bundle/release/app-release.aab`，可以上传到 Google Play。

为了让 Google Play 接受 AAB 格式，需要在 Google Play Console 中为应用配置 App Signing by Google Play。如果你要更新的现有应用尚未使用 App Signing by Google Play，请查看我们的[迁移部分](#migrating-old-android-react-native-apps-to-use-app-signing-by-google-play)，了解如何执行此配置更改。

## 测试应用的发布构建

在将发布构建上传到 Play 商店之前，请务必对其进行全面测试。首先卸载设备上已经安装的应用的任何旧版本。在项目根目录中使用以下命令将其安装到设备上：

<Tabs groupId="package-manager" queryString defaultValue={constants.defaultPackageManager} values={constants.packageManagers}>
<TabItem value="npm">

```shell
npm run android -- --mode="release"
```

</TabItem>
<TabItem value="yarn">

```shell
yarn android --mode release
```

</TabItem>
</Tabs>

请注意，只有按照上述说明设置了签名后，`--mode release` 才可用。

你可以终止任何正在运行的 bundler 实例，因为所有 framework 和 JavaScript 代码都已打包到 APK 的资源中。

## 发布到其他商店

默认情况下，生成的 APK 包含适用于 `x86`、`x86_64`、`ARMv7a` 和 `ARM64-v8a` CPU 架构的原生代码。这样可以更轻松地分享能够在几乎所有 Android 设备上运行的 APK。不过，这样做的缺点是任何设备上都会存在一些未使用的原生代码，导致 APK 不必要地变大。

你可以通过在 `android/app/build.gradle` 文件中添加以下代码，为每种 CPU 创建一个 APK：

```diff
android {

    splits {
        abi {
            reset()
            enable true
            universalApk false
            include "armeabi-v7a", "arm64-v8a", "x86", "x86_64"
        }
    }

}
```

将这些文件上传到支持设备定向的市场，例如 [Amazon AppStore](https://developer.amazon.com/docs/app-submission/device-filtering-and-compatibility.html) 或 [F-Droid](https://f-droid.org/en/)，用户将自动获得适用的 APK。如果你想上传到其他市场，例如不支持单个应用使用多个 APK 的 [APKFiles](https://www.apkfiles.com/)，请将 `universalApk false` 行改为 `true`，以创建包含两种 CPU 架构二进制文件的默认通用 APK。

请注意，你还必须配置不同的版本代码，正如官方 Android 文档[此页面](https://developer.android.com/studio/build/configure-apk-splits#configure-APK-versions)中所建议的那样。

## 启用 Proguard 以减小 APK 大小（可选）

Proguard 是一个可以略微减小 APK 大小的工具。它通过移除应用未使用的 React Native Java 字节码（及其依赖项）来实现这一点。

:::caution[重要]
如果启用了 Proguard，请务必对应用进行全面测试。Proguard 通常需要针对所使用的每个原生库进行特定配置。请参阅 `app/proguard-rules.pro`。
:::

要启用 Proguard，请编辑 `android/app/build.gradle`：

```groovy
/**
 * Run Proguard to shrink the Java bytecode in release builds.
 */
def enableProguardInReleaseBuilds = true
```

## 将旧版 Android React Native 应用迁移为使用 App Signing by Google Play

如果你是从早期版本的 React Native 迁移而来，那么你的应用很可能尚未使用 App Signing by Google Play 功能。我们建议启用该功能，以便享受自动应用拆分等功能带来的优势。要从旧的签名方式迁移，首先需要[生成新的上传密钥](#generating-an-upload-key)，然后将 `android/app/build.gradle` 中的发布签名配置替换为使用上传密钥，而不是发布密钥（请参阅[向 Gradle 添加签名配置](#adding-signing-config-to-your-apps-gradle-config)部分）。完成后，你应按照 [Google Play Help 网站上的说明](https://support.google.com/googleplay/android-developer/answer/7384423)操作，以便将原始发布密钥发送给 Google Play。

## 默认权限

默认情况下，`INTERNET` 权限会添加到 Android 应用中，因为几乎所有应用都会使用它。`SYSTEM_ALERT_WINDOW` 权限会在 debug 模式下添加到 Android APK 中，但会在生产环境中移除。
