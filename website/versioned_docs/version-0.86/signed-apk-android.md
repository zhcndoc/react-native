---
id: signed-apk-android
title: 发布到 Google Play 商店
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

Android 要求所有应用在安装之前都必须使用证书进行数字签名。为了通过 [Google Play 商店](https://play.google.com/store) 分发你的 Android 应用，它需要使用一个发布密钥进行签名，并且之后所有的更新也必须使用同一个密钥。自 2017 年起，借助 [Google Play 应用签名](https://developer.android.com/studio/publish/app-signing#app-signing-google-play) 功能，Google Play 可以自动管理发布签名。不过，在你的应用二进制文件上传到 Google Play 之前，它仍然需要使用上传密钥进行签名。Android Developers 文档中的 [签署你的应用](https://developer.android.com/tools/publishing/app-signing.html) 页面对此有详细说明。本指南简要介绍这一过程，并列出打包 JavaScript bundle 所需的步骤。

:::info
如果你使用 Expo，请阅读 Expo 的 [部署到应用商店](https://docs.expo.dev/distribution/app-stores/) 指南，以构建并提交你的应用到 Google Play 商店。本指南适用于任何 React Native 应用，可帮助自动化部署流程。
:::

## 生成上传密钥

你可以使用 `keytool` 生成私有签名密钥。

### Windows

在 Windows 上，`keytool` 必须以管理员身份从 `C:\Program Files\Java\jdkx.x.x_x\bin` 目录运行。

```shell
keytool -genkeypair -v -storetype PKCS12 -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

该命令会提示你输入 keystore 和密钥的密码，以及该密钥的专有名称（Distinguished Name）字段。随后它会生成一个名为 `my-upload-key.keystore` 的 keystore 文件。

这个 keystore 包含一个有效期为 10000 天的单个密钥。alias 是你之后在签名应用时会用到的名称，所以请务必记下这个 alias。

### macOS

在 macOS 上，如果你不确定 JDK 的 bin 文件夹在哪里，可以运行以下命令来查找：

```shell
/usr/libexec/java_home
```

它会输出 JDK 的目录，看起来大概像这样：

```shell
/Library/Java/JavaVirtualMachines/jdkX.X.X_XXX.jdk/Contents/Home
```

使用命令 `cd /your/jdk/path` 进入该目录，并按如下所示使用带有 sudo 权限的 keytool 命令。

```shell
sudo keytool -genkey -v -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

:::caution
请务必妥善保管 keystore 文件，不要泄露。如果你丢失了上传密钥，或者它已被泄露，你应该[按照这些说明操作](https://support.google.com/googleplay/android-developer/answer/7384423#reset)。
:::

## 设置 Gradle 变量

1. 将 `my-upload-key.keystore` 文件放到项目目录下的 `android/app` 目录中。
2. 编辑 `~/.gradle/gradle.properties` 或 `android/gradle.properties` 文件，并添加以下内容（将 `*****` 替换为正确的 keystore 密码、alias 和 key 密码），

```
MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore
MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
MYAPP_UPLOAD_STORE_PASSWORD=*****
MYAPP_UPLOAD_KEY_PASSWORD=*****
```

这些将作为全局 Gradle 变量，之后我们可以在 Gradle 配置中使用它们来对应用进行签名。

:::note[关于使用 git 的说明]
将上述 Gradle 变量保存到 `~/.gradle/gradle.properties` 而不是 `android/gradle.properties` 中，可以避免它们被提交到 git。你可能需要先在用户主目录中创建 `~/.gradle/gradle.properties` 文件，然后才能添加这些变量。
:::

:::note[关于安全性的说明]
如果你不想以明文形式存储密码，并且你使用的是 macOS，你也可以[将凭据存储在 Keychain Access 应用中](https://pilloxa.gitlab.io/posts/safer-passwords-in-gradle/)。这样你就可以跳过 `~/.gradle/gradle.properties` 中最后两行内容。
:::

## 将签名配置添加到应用的 Gradle 配置中

最后需要完成的配置步骤是设置发布构建使用上传密钥进行签名。编辑项目目录中的 `android/app/build.gradle` 文件，并添加签名配置，

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

在终端中运行以下命令：

```shell
npx react-native build-android --mode=release
```

该命令在底层使用了 Gradle 的 `bundleRelease`，会将运行应用所需的所有 JavaScript 打包到 AAB（[Android App Bundle](https://developer.android.com/guide/app-bundle)）中。如果你需要更改 JavaScript bundle 和/或 drawable 资源的打包方式（例如你更改了默认的文件/文件夹名称或项目的整体结构），请查看 `android/app/build.gradle`，了解如何更新它以反映这些变化。

:::note
请确保 `gradle.properties` 中不要包含 `org.gradle.configureondemand=true`，否则发布构建会跳过将 JS 和资源打包进应用二进制文件。
:::

生成的 AAB 可以在 `android/app/build/outputs/bundle/release/app-release.aab` 找到，并可直接上传到 Google Play。

为了让 Google Play 接受 AAB 格式，需要在 Google Play Console 中为你的应用配置 Google Play 应用签名。如果你正在更新一个不使用 Google Play 应用签名的现有应用，请查看我们的[迁移部分](#migrating-old-android-react-native-apps-to-use-app-signing-by-google-play)，了解如何进行该配置更改。

## 测试应用的发布构建

在将发布构建上传到 Play 商店之前，请务必充分测试。首先卸载你已安装的任何旧版本应用。然后在项目根目录下使用以下命令将其安装到设备上：

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

注意，`--mode release` 只有在你已经按照上述说明完成签名配置后才可用。

你可以终止任何正在运行的 bundler 实例，因为你的所有框架和 JavaScript 代码都已经打包进 APK 的资源中。

## 发布到其他商店

默认情况下，生成的 APK 包含 `x86`、`x86_64`、`ARMv7a` 和 `ARM64-v8a` CPU 架构的原生代码。这使得共享几乎可在所有 Android 设备上运行的 APK 更加容易。不过，这样做的缺点是任何设备上都会包含一些未使用的原生代码，从而导致 APK 体积不必要地变大。

你可以在 `android/app/build.gradle` 文件中添加以下内容，为每种 CPU 生成一个 APK：

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

将这些文件上传到支持设备定向的市场，例如 [Amazon AppStore](https://developer.amazon.com/docs/app-submission/device-filtering-and-compatibility.html) 或 [F-Droid](https://f-droid.org/en/)，用户将自动获得相应的 APK。如果你想上传到其他不支持单个应用多个 APK 的市场，例如 [APKFiles](https://www.apkfiles.com/)，请将 `universalApk false` 这一行改为 `true`，以创建同时包含这两种 CPU 二进制文件的默认通用 APK。

请注意，你还必须配置不同的 version code，正如官方 Android 文档中的[此页面所建议的](https://developer.android.com/studio/build/configure-apk-splits#configure-APK-versions)。

## 启用 Proguard 以减小 APK 大小（可选）

Proguard 是一个可以略微减小 APK 体积的工具。它通过移除应用未使用的 React Native Java 字节码（及其依赖）来实现这一点。

:::caution[重要]
如果你启用了 Proguard，请务必彻底测试你的应用。Proguard 通常需要针对你所使用的每个原生库进行特定配置。请参见 `app/proguard-rules.pro`。
:::

要启用 Proguard，请编辑 `android/app/build.gradle`：

```groovy
/**
 * 运行 Proguard 以缩小发布构建中的 Java 字节码。
 */
def enableProguardInReleaseBuilds = true
```

## 将旧的 Android React Native 应用迁移为使用 Google Play 应用签名

如果你是从旧版本的 React Native 迁移而来，你的应用很可能没有使用 Google Play 应用签名功能。我们建议你启用它，以便利用自动应用拆分等功能。要从旧的签名方式迁移，你需要先[生成新的上传密钥](#generating-an-upload-key)，然后修改 `android/app/build.gradle` 中的发布签名配置，使其使用上传密钥而不是发布密钥（参见[向 gradle 添加签名配置](#adding-signing-config-to-your-apps-gradle-config)这一节）。完成之后，你应该按照 [Google Play 帮助网站中的说明](https://support.google.com/googleplay/android-developer/answer/7384423) 将原始发布密钥发送给 Google Play。

## 默认权限

默认情况下，`INTERNET` 权限会被添加到你的 Android 应用中，因为几乎所有应用都会用到它。`SYSTEM_ALERT_WINDOW` 权限会在调试模式下被添加到你的 Android APK 中，但在生产环境中会被移除。
