---
id: signed-apk-android
title: 发布到 Google Play 商店
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

Android 要求所有应用在安装前必须使用证书进行数字签名。为了通过 [Google Play 商店](https://play.google.com/store) 分发您的 Android 应用，必须使用发布密钥进行签名，且该密钥需要用于所有后续更新。自 2017 年起，Google Play 可以通过 [Google Play 应用签名](https://developer.android.com/studio/publish/app-signing#app-signing-google-play) 功能自动管理发布签名。不过，在将应用二进制上传至 Google Play 之前，必须使用上传密钥对其进行签名。Android 开发者文档中的 [为应用签名](https://developer.android.com/tools/publishing/app-signing.html) 页面对此进行了详细说明。本指南简要介绍该过程，同时列出了打包 JavaScript bundle 所需的步骤。

:::info
如果您使用 Expo，请阅读 Expo 指南 [部署到应用商店](https://docs.expo.dev/distribution/app-stores/)，以构建和提交您的应用到 Google Play 商店。本指南适用于任何 React Native 应用，实现自动化部署流程。
:::

## 生成上传密钥

您可以使用 `keytool` 生成私有签名密钥。

### Windows

在 Windows 上，需以管理员身份从 `C:\Program Files\Java\jdkx.x.x_x\bin` 目录运行 `keytool`。

```shell
keytool -genkeypair -v -storetype PKCS12 -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

该命令会提示您输入密钥库和密钥的密码以及密钥的专有名称等字段。随后，它会生成名为 `my-upload-key.keystore` 的密钥库文件。

该密钥库包含一个有效期为 10000 天的密钥。alias 是稍后用于签名应用的名称，请务必记住该别名。

### macOS

在 macOS 上，如果不确定 JDK 的 bin 文件夹位置，请运行以下命令以查找：

```shell
/usr/libexec/java_home
```

输出将显示类似如下的 JDK 目录：

```shell
/Library/Java/JavaVirtualMachines/jdkX.X.X_XXX.jdk/Contents/Home
```

使用命令 `cd /your/jdk/path` 进入该目录，然后使用 sudo 权限运行以下 keytool 命令：

```shell
sudo keytool -genkey -v -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

:::caution
请务必妥善保管密钥库文件。如丢失上传密钥或密钥被泄露，应 [参照此说明](https://support.google.com/googleplay/android-developer/answer/7384423#reset) 进行处理。
:::

## 配置 Gradle 变量

1. 将 `my-upload-key.keystore` 文件放置在项目目录中的 `android/app` 文件夹下。
2. 编辑 `~/.gradle/gradle.properties` 或 `android/gradle.properties` 文件，添加以下内容（将 `*****` 替换为正确的密钥库密码、别名和密钥密码）：

```
MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore
MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
MYAPP_UPLOAD_STORE_PASSWORD=*****
MYAPP_UPLOAD_KEY_PASSWORD=*****
```

这些将成为全局的 Gradle 变量，稍后我们可以在 Gradle 配置中使用它们为应用签名。

:::note[关于使用 git]
将上述 Gradle 变量保存在 `~/.gradle/gradle.properties` 中，而不是 `android/gradle.properties` 中，可以防止它们被提交到 git。您可能需要先在用户主目录中创建 `~/.gradle/gradle.properties` 文件，然后才能添加这些变量。
:::

:::note[关于安全性]
如果您不想以明文形式存储密码，并且正在使用 macOS，也可以将您的凭据存储在 Keychain Access 应用中](https://pilloxa.gitlab.io/posts/safer-passwords-in-gradle/)。这样，您就可以跳过 `~/.gradle/gradle.properties` 中最后两行。
:::

## 将签名配置添加至应用的 Gradle 配置

最后一个配置步骤是设置发布构建时使用上传密钥签名。编辑项目中的 `android/app/build.gradle` 文件，添加签名配置：

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

## 生成发布版 AAB

在终端运行以下命令：

```shell
npx react-native build-android --mode=release
```

此命令底层调用 Gradle 的 `bundleRelease`，将运行应用所需的所有 JavaScript 打包进 AAB（[Android 应用包](https://developer.android.com/guide/app-bundle)）。如果您需要更改 JavaScript 包和/或 drawable 资源的打包方式（例如修改了默认文件/文件夹名称或项目的整体结构），请查看 `android/app/build.gradle`，了解如何进行相应更新。

:::note
确保 `gradle.properties` 文件未包含 `org.gradle.configureondemand=true`，该配置会导致发布构建时跳过将 JS 及资源打包到应用二进制文件中。
:::

生成的 AAB 文件位于 `android/app/build/outputs/bundle/release/app-release.aab`，即可上传至 Google Play。

为了让 Google Play 接受 AAB 格式，您的应用需在 Google Play 控制台配置 Google Play 应用签名。如果是更新一个未使用 Google Play 应用签名的已有应用，请查看我们的 [迁移章节](#migrating-old-android-react-native-apps-to-use-app-signing-by-google-play)，学习如何执行该配置更改。

## 测试发布版应用

在上传发布版到 Play 商店前，请务必彻底测试。先卸载设备中已有的旧版本应用。在项目根目录下运行：

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

请注意，`--mode release` 仅在您已经按上述步骤配置签名后可用。

您可以停止所有运行中的打包器实例，因为所有框架和 JavaScript 代码已被打包进 APK 的资源中。

## 发布到其他应用商店

默认情况下，生成的 APK 包含针对 `x86`、`x86_64`、`ARMv7a` 和 `ARM64-v8a` 四种 CPU 架构的原生代码，方便在几乎所有 Android 设备上运行。但这也意味着会有部分架构无用代码，导致 APK 体积不必要地增大。

您可以通过在 `android/app/build.gradle` 文件中添加以下配置，为每个 CPU 架构生成单独的 APK：

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

将这些文件上传到支持设备筛选的商店（如 [Amazon AppStore](https://developer.amazon.com/docs/app-submission/device-filtering-and-compatibility.html) 或 [F-Droid](https://f-droid.org/en/)），用户即可自动下载对应设备的 APK。如果想上传到不支持多个 APK 的市场（如 [APKFiles](https://www.apkfiles.com/)），请将 `universalApk false` 改为 `true`，生成包含所有架构的通用 APK。

请注意，您还需配置不同的版本号，详见官方 Android 文档中 [关于配置 APK 拆分及版本号](https://developer.android.com/studio/build/configure-apk-splits#configure-APK-versions) 的说明。

## 启用 Proguard 来减小 APK 大小（可选）

Proguard 是一个可稍微减少 APK 大小的工具，它通过剔除 React Native Java 字节码及其依赖中未使用的部分来做到这一点。

:::caution[重要]
如果您启用了 Proguard，请务必彻底测试您的应用。Proguard 通常需要针对您使用的每个原生库进行特定配置。请参阅 `app/proguard-rules.pro`。
:::

启用 Proguard，请编辑 `android/app/build.gradle`：

```groovy
/**
 * 在发布构建中启用 Proguard 以压缩 Java 字节码。
 */
def enableProguardInReleaseBuilds = true
```

## 迁移旧版 Android React Native 应用以使用 Google Play 应用签名

如果您从旧版 React Native 迁移，您的应用很可能未使用 Google Play 应用签名功能。我们建议开启该功能，以利用自动拆分等优势。迁移时，先 [生成新的上传密钥](#generating-an-upload-key)，然后在 `android/app/build.gradle` 中将发布签名配置替换为使用上传密钥（详见 [添加签名配置到 Gradle](#adding-signing-config-to-your-apps-gradle-config) 部分）。完成后，请按 [Google Play 帮助网站](https://support.google.com/googleplay/android-developer/answer/7384423) 指南，将您原有的发布密钥发送给 Google Play。

## 默认权限

默认情况下，`INTERNET` 权限会自动添加到您的 Android 应用，因为几乎所有应用都需要它。`SYSTEM_ALERT_WINDOW` 权限仅在调试模式下添加，生产环境中会被移除。