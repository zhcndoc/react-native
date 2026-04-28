---
id: signed-apk-android
title: 发布到 Google Play 商店
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

Android 要求所有应用在安装之前都必须使用证书进行数字签名。为了通过 [Google Play 商店](https://play.google.com/store) 分发你的 Android 应用，它需要使用发布密钥进行签名，并且此后所有更新都必须使用同一个密钥。自 2017 年起，得益于 [Google Play 应用签名](https://developer.android.com/studio/publish/app-signing#app-signing-google-play) 功能，Google Play 可以自动管理发布签名。不过，在应用二进制文件上传到 Google Play 之前，它仍需要使用上传密钥进行签名。Android Developers 文档中的 [为你的应用签名](https://developer.android.com/tools/publishing/app-signing.html) 页面详细描述了这一主题。本指南简要介绍了整个过程，并列出了打包 JavaScript bundle 所需的步骤。

:::info
如果你使用的是 Expo，请阅读 Expo 的 [发布到应用商店](https://docs.expo.dev/distribution/app-stores/) 指南，以构建并提交你的应用到 Google Play 商店。本指南适用于任何 React Native 应用，以自动化部署流程。
:::

## 生成上传密钥

你可以使用 `keytool` 生成一个私有签名密钥。

### Windows

在 Windows 上，`keytool` 必须以管理员身份从 `C:\Program Files\Java\jdkx.x.x_x\bin` 目录运行。

```shell
keytool -genkeypair -v -storetype PKCS12 -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

此命令会提示你输入 keystore 和密钥的密码，以及该密钥的专有名称（Distinguished Name）字段。随后它会生成一个名为 `my-upload-key.keystore` 的 keystore 文件。

该 keystore 包含一个密钥，有效期为 10000 天。alias 是你之后在签名应用时会用到的名称，因此请记得记下这个 alias。

### macOS

在 macOS 上，如果你不确定 JDK 的 bin 文件夹在哪里，可以运行以下命令来查找：

```shell
/usr/libexec/java_home
```

它会输出 JDK 所在目录，类似如下：

```shell
/Library/Java/JavaVirtualMachines/jdkX.X.X_XXX.jdk/Contents/Home
```

使用命令 `cd /your/jdk/path` 进入该目录，并使用带有 sudo 权限的 keytool 命令，如下所示。

```shell
sudo keytool -genkey -v -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

:::caution
请记得将 keystore 文件妥善保密。如果你丢失了上传密钥，或者密钥已被泄露，你应该 [按照这些说明操作](https://support.google.com/googleplay/android-developer/answer/7384423#reset)。
:::

## 设置 Gradle 变量

1. 将 `my-upload-key.keystore` 文件放到项目文件夹下的 `android/app` 目录中。
2. 编辑 `~/.gradle/gradle.properties` 或 `android/gradle.properties` 文件，并添加以下内容（将 `*****` 替换为正确的 keystore 密码、alias 和密钥密码）：

```
MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore
MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
MYAPP_UPLOAD_STORE_PASSWORD=*****
MYAPP_UPLOAD_KEY_PASSWORD=*****
```

这些将成为全局 Gradle 变量，我们之后可以在 Gradle 配置中使用它们来为应用签名。

:::note[关于使用 git 的说明]
将上述 Gradle 变量保存到 `~/.gradle/gradle.properties` 而不是 `android/gradle.properties`，可以避免它们被提交到 git。你可能需要先在用户主目录中创建 `~/.gradle/gradle.properties` 文件，然后才能添加这些变量。
:::

:::note[关于安全性的说明]
如果你不想以明文形式存储密码，并且你正在使用 macOS，你也可以 [将凭据存储在 Keychain Access 应用中](https://pilloxa.gitlab.io/posts/safer-passwords-in-gradle/)。然后你就可以跳过 `~/.gradle/gradle.properties` 中最后两行。
:::

## 将签名配置添加到应用的 Gradle 配置中

最后需要完成的配置步骤是设置 release 构建使用上传密钥进行签名。编辑项目文件夹中的 `android/app/build.gradle` 文件，并添加签名配置：

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

此命令在底层使用了 Gradle 的 `bundleRelease`，它会将运行应用所需的所有 JavaScript 打包进 AAB ([Android App Bundle](https://developer.android.com/guide/app-bundle)) 中。如果你需要更改 JavaScript bundle 和/或 drawable 资源的打包方式（例如，你修改了默认的文件/文件夹名称或项目的整体结构），请查看 `android/app/build.gradle`，了解如何更新它以反映这些更改。

:::note
请确保 `gradle.properties` 中不包含 `org.gradle.configureondemand=true`，因为这会导致 release 构建跳过将 JS 和资源打包进应用二进制文件。
:::

生成的 AAB 可以在 `android/app/build/outputs/bundle/release/app-release.aab` 找到，并且已经可以上传到 Google Play。

为了让 Google Play 接受 AAB 格式，需要先在 Google Play Console 中为你的应用配置 Google Play 应用签名。如果你正在更新一个不使用 Google Play 应用签名的现有应用，请查看我们的 [迁移部分](#migrating-old-android-react-native-apps-to-use-app-signing-by-google-play)，了解如何执行该配置更改。

## 测试应用的 release 构建

在上传 release 构建到 Play 商店之前，请确保对其进行充分测试。首先卸载你已经安装的任何旧版本应用。在项目根目录下使用以下命令将其安装到设备上：

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

请注意，`--mode release` 只有在你已经按照上述说明完成签名配置后才可用。

你可以终止任何正在运行的 bundler 实例，因为你的所有框架和 JavaScript 代码都已经被打包进 APK 的资源中。

## 发布到其他商店

默认情况下，生成的 APK 包含 `x86`、`x86_64`、`ARMv7a` 和 `ARM64-v8a` CPU 架构的原生代码。这使得分享几乎可在所有 Android 设备上运行的 APK 更加容易。不过，这样做的缺点是任何设备上都会包含一些未使用的原生代码，从而导致 APK 体积不必要地增大。

你可以在 `android/app/build.gradle` 文件中添加以下行，为每种 CPU 分别创建一个 APK：

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

将这些文件上传到支持设备定向的市场，例如 [Amazon AppStore](https://developer.amazon.com/docs/app-submission/device-filtering-and-compatibility.html) 或 [F-Droid](https://f-droid.org/en/)，用户就会自动获得相应的 APK。如果你想上传到其他市场，例如 [APKFiles](https://www.apkfiles.com/)，这些市场不支持同一个应用的多个 APK，那么请将 `universalApk false` 改为 `true`，以创建默认的通用 APK，其中包含两种 CPU 的二进制文件。

请注意，你还需要配置不同的版本号，正如官方 Android 文档中的 [该页面建议的那样](https://developer.android.com/studio/build/configure-apk-splits#configure-APK-versions)。

## 启用 Proguard 以减小 APK 体积（可选）

Proguard 是一个可以略微减小 APK 体积的工具。它通过移除应用未使用的 React Native Java 字节码（及其依赖项）来实现这一点。

:::caution[重要]
如果你启用了 Proguard，请务必彻底测试你的应用。Proguard 通常需要针对你所使用的每个原生库进行特定配置。请参见 `app/proguard-rules.pro`。
:::

要启用 Proguard，请编辑 `android/app/build.gradle`：

```groovy
/**
 * 在 release 构建中运行 Proguard 以缩小 Java 字节码。
 */
def enableProguardInReleaseBuilds = true
```

## 将旧版 Android React Native 应用迁移为使用 Google Play 应用签名

如果你是从旧版本的 React Native 迁移过来的，那么你的应用很可能还没有使用 Google Play 应用签名功能。我们建议你启用它，以便利用自动应用拆分等功能。为了从旧的签名方式迁移，你需要先 [生成新的上传密钥](#generating-an-upload-key)，然后将 `android/app/build.gradle` 中的 release 签名配置替换为使用上传密钥而不是 release 密钥（请参见关于 [将签名配置添加到 gradle](#adding-signing-config-to-your-apps-gradle-config) 的部分）。完成后，你应该按照 [Google Play 帮助网站中的说明](https://support.google.com/googleplay/android-developer/answer/7384423) 将原始 release 密钥发送给 Google Play。

## 默认权限

默认情况下，`INTERNET` 权限会被添加到你的 Android 应用中，因为几乎所有应用都会使用它。`SYSTEM_ALERT_WINDOW` 权限会在调试模式下被添加到你的 Android APK 中，但在正式发布时会被移除。
