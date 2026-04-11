---
id: signed-apk-android
title: 发布到 Google Play 商店
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

Android 要求所有应用在安装前都必须使用证书进行数字签名。为了通过 [Google Play 商店](https://play.google.com/store) 分发您的 Android 应用，它需要使用发布密钥进行签名，并且该密钥需要用于所有未来的更新。自 2017 年以来，得益于 [Google Play 应用签名](https://developer.android.com/studio/publish/app-signing#app-signing-google-play) 功能，Google Play 可以自动管理签名发布。但是，在您的应用二进制文件上传到 Google Play 之前，它需要使用上传密钥进行签名。Android 开发者文档上的 [签名您的应用](https://developer.android.com/tools/publishing/app-signing.html) 页面详细描述了该主题。本指南简要介绍了该过程，并列出了打包 JavaScript bundle 所需的步骤。

:::info
如果您使用的是 Expo，请阅读 Expo 指南 [部署到应用商店](https://docs.expo.dev/distribution/app-stores/) 以构建并提交您的应用到 Google Play 商店。本指南适用于任何 React Native 应用以自动化部署过程。
:::

## 生成上传密钥

您可以使用 `keytool` 生成私有签名密钥。

### Windows

在 Windows 上，`keytool` 必须作为管理员从 `C:\Program Files\Java\jdkx.x.x_x\bin` 运行。

```shell
keytool -genkeypair -v -storetype PKCS12 -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

此命令会提示您输入密钥库和密钥的密码以及密钥的区分名称字段。然后它会生成一个名为 `my-upload-key.keystore` 的文件作为密钥库。

密钥库包含单个密钥，有效期为 10000 天。别名是您在稍后签名应用时将使用的名称，因此请记住记下该别名。

### macOS

在 macOS 上，如果您不确定 JDK bin 文件夹的位置，则执行以下命令来查找它：

```shell
/usr/libexec/java_home
```

它将输出 JDK 的目录，看起来像这样：

```shell
/Library/Java/JavaVirtualMachines/jdkX.X.X_XXX.jdk/Contents/Home
```

使用命令 `cd /your/jdk/path` 导航到该目录，并使用 sudo 权限如下所示使用 keytool 命令。

```shell
sudo keytool -genkey -v -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

:::caution
请记住保持密钥库文件私密。如果您丢失了上传密钥或它已被泄露，您应该 [遵循这些说明](https://support.google.com/googleplay/android-developer/answer/7384423#reset)。
:::

## 设置 Gradle 变量

1. 将 `my-upload-key.keystore` 文件放置在项目文件夹下的 `android/app` 目录中。
2. 编辑文件 `~/.gradle/gradle.properties` 或 `android/gradle.properties`，并添加以下内容（将 `*****` 替换为正确的密钥库密码、别名和密钥密码），

```
MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore
MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
MYAPP_UPLOAD_STORE_PASSWORD=*****
MYAPP_UPLOAD_KEY_PASSWORD=*****
```

这些将是全局 Gradle 变量，我们稍后可以在 Gradle 配置中使用它们来签名我们的应用。

:::note 关于使用 git 的说明
将上述 Gradle 变量保存在 `~/.gradle/gradle.properties` 中而不是 `android/gradle.properties` 中可以防止它们被检入 git。在添加变量之前，您可能需要在用户的主目录中创建 `~/.gradle/gradle.properties` 文件。
:::

:::note 关于安全性的说明
如果您不愿意以明文形式存储密码，并且您运行的是 macOS，您也可以 [将凭据存储在钥匙串访问应用中](https://pilloxa.gitlab.io/posts/safer-passwords-in-gradle/)。然后您可以跳过 `~/.gradle/gradle.properties` 中的最后两行。
:::

## 将签名配置添加到应用的 Gradle 配置中

需要完成的最后配置步骤是设置使用上传密钥签名 release 构建。编辑项目文件夹中的 `android/app/build.gradle` 文件，并添加签名配置，

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

## 生成 release AAB

在终端中运行以下命令：

```shell
npx react-native build-android --mode=release
```

此命令在底层使用 Gradle 的 `bundleRelease`，它将运行您的应用所需的所有 JavaScript 打包到 AAB ([Android App Bundle](https://developer.android.com/guide/app-bundle)) 中。如果您需要更改 JavaScript bundle 和/或可绘制资源打包的方式（例如，如果您更改了默认文件/文件夹名称或项目的一般结构），请查看 `android/app/build.gradle` 以了解如何更新它以反映这些更改。

:::note
确保 `gradle.properties` 不包含 `org.gradle.configureondemand=true`，因为这将使发布构建跳过将 JS 和资源打包到应用二进制文件中。
:::

生成的 AAB 可以在 `android/app/build/outputs/bundle/release/app-release.aab` 找到，并准备好上传到 Google Play。

为了让 Google Play 接受 AAB 格式，需要在 Google Play Console 上为您的应用配置 Google Play 应用签名。如果您正在更新不使用 Google Play 应用签名的现有应用，请查看我们的 [迁移部分](#migrating-old-android-react-native-apps-to-use-app-signing-by-google-play) 以了解如何执行该配置更改。

## 测试应用的 release 构建版本

在将发布构建上传到 Play 商店之前，请确保彻底测试它。首先卸载已安装的任何旧版本应用。使用项目根目录中的以下命令将其安装在设备上：

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

请注意，只有按上述方式设置了签名，`--mode release` 才可用。

您可以终止任何正在运行的 bundler 实例，因为您的所有框架和 JavaScript 代码都打包在 APK 的资源中。

## 发布到其他商店

默认情况下，生成的 APK 包含 `x86`、`x86_64`、`ARMv7a` 和 `ARM64-v8a` CPU 架构的本机代码。这使得共享几乎在所有 Android 设备上运行的 APK 变得更加容易。然而，这也有缺点，即任何设备上都有一些未使用的本机代码，导致 APK 不必要地变大。

您可以通过在 `android/app/build.gradle` 文件中添加以下行来为每个 CPU 创建 APK：

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

将这些文件上传到支持设备定位的市场，例如 [Amazon AppStore](https://developer.amazon.com/docs/app-submission/device-filtering-and-compatibility.html) 或 [F-Droid](https://f-droid.org/en/)，用户将自动获得合适的 APK。如果您想上传到其他市场，例如 [APKFiles](https://www.apkfiles.com/)，它们不支持单个应用的多个 APK，请将 `universalApk false` 行更改为 `true` 以创建包含两个 CPU 二进制文件的默认通用 APK。

请注意，您还必须配置不同的版本代码，如官方 Android 文档 [此页面建议](https://developer.android.com/studio/build/configure-apk-splits#configure-APK-versions)。

## 启用 Proguard 以减小 APK 大小（可选）

Proguard 是一个可以略微减小 APK 大小的工具。它通过剥离您的应用未使用的 React Native Java 字节码（及其依赖项）部分来实现这一点。

:::caution 重要
如果您启用了 Proguard，请确保彻底测试您的应用。Proguard 通常需要针对您使用的每个本机库进行配置。参见 `app/proguard-rules.pro`。
:::

要启用 Proguard，编辑 `android/app/build.gradle`：

```groovy
/**
 * 运行 Proguard 以在 release 构建中缩小 Java 字节码。
 */
def enableProguardInReleaseBuilds = true
```

## 迁移旧的 Android React Native 应用以使用 Google Play 应用签名

如果您是从旧版本的 React Native 迁移， chances are 您的应用不使用 Google Play 应用签名功能。我们建议您启用该功能以便利用自动应用拆分等优势。为了从旧的签名方式迁移，您需要首先 [生成新的上传密钥](#generating-an-upload-key)，然后替换 `android/app/build.gradle` 中的 release 签名配置以使用上传密钥而不是发布密钥（参见有关 [将签名配置添加到 gradle](#adding-signing-config-to-your-apps-gradle-config) 的部分）。完成后，您应该遵循 [Google Play 帮助网站的说明](https://support.google.com/googleplay/android-developer/answer/7384423) 以便将原始发布密钥发送给 Google Play。

## 默认权限

默认情况下，`INTERNET` 权限被添加到您的 Android 应用中，因为几乎所有应用都使用它。`SYSTEM_ALERT_WINDOW` 权限在调试模式下被添加到您的 Android APK 中，但在生产模式下会被移除。
