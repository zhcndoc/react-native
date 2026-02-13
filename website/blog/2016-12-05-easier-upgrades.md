---
title: 借助 Git 使升级更简单
author: Nicolas Cuillery
authorTitle: Zenika 的 JavaScript 顾问与培训师
authorURL: 'https://twitter.com/ncuillery'
authorImageURL: 'https://fr.gravatar.com/userimage/78328995/184460def705a160fd8edadc04f60eaf.jpg?size=128'
authorTwitter: ncuillery
tags: [announcement]
---

升级到新版 React Native 一直很困难。你可能以前见过这样的情况：

![](/blog/assets/git-upgrade-conflict.png)

这些选项都不理想。覆盖文件的话，我们会丢失本地修改；不覆盖的话，则拿不到最新更新。

今天我很自豪地介绍一个帮助解决这个问题的新工具。该工具名为 `react-native-git-upgrade`，它在幕后使用 Git，尽可能自动解决冲突。

## 使用方法

> **要求**：Git 必须在 `PATH` 中可用。你的项目不必是用 Git 管理的。

全局安装 `react-native-git-upgrade`：

```shell
$ npm install -g react-native-git-upgrade
```

或者，使用 [Yarn](https://yarnpkg.com/)：

```shell
$ yarn global add react-native-git-upgrade
```

然后，在你的项目目录里运行它：

```shell
$ cd MyProject
$ react-native-git-upgrade 0.38.0
```

> 注意：**不要**运行 'npm install' 来安装新的 `react-native` 版本。该工具需要比较旧版本与新版本的项目模板才能正常工作。只需在你的应用文件夹里（仍在旧版本时）如上所示运行它即可。

示例输出：

![](/blog/assets/git-upgrade-output.png)

你也可以不带参数执行 `react-native-git-upgrade`，它将升级到最新版 React Native。

我们会尝试保留你对 Android 和 iOS 构建文件的修改，因此升级后你不需要运行 `react-native link`。

该实现设计得尽可能低侵入，完全基于一个临时目录下即时创建的本地 Git 仓库。它不会干扰你的项目仓库（无论你用的是 Git、SVN、Mercurial 还是无版本控制）。出现意外错误时，源码会被还原。

## 它是如何工作的？

关键步骤是生成一个 Git 补丁。该补丁包含你应用当前版本与新版本间，在 React Native 模板里的所有变更。

为了获取该补丁，我们需要用 `node_modules` 目录下 `react-native` 包中内嵌的模板生成应用（这就是 `react-native init` 使用的同样模板）。之后，在当前版本与新版本的模板分别生成原生应用后，Git 就可以生成一个适合你项目的补丁（比如包含你的应用名）：

```
[...]

diff --git a/ios/MyAwesomeApp/Info.plist b/ios/MyAwesomeApp/Info.plist
index e98ebb0..2fb6a11 100644
--- a/ios/MyAwesomeApp/Info.plist
+++ b/ios/MyAwesomeApp/Info.plist
@@ -45,7 +45,7 @@
        <dict>
            <key>localhost</key>
            <dict>
-               <key>NSTemporaryExceptionAllowsInsecureHTTPLoads</key>
+               <key>NSExceptionAllowsInsecureHTTPLoads</key>
                <true/>
            </dict>
        </dict>
[...]
```

接下来，我们只需将这个补丁应用到你的源码文件。旧的 `react-native upgrade` 会在遇到细微差异时向你询问，而 Git 则利用其三方合并算法自动合并大部分更改，并最终留下熟悉的冲突界定符：

```
    13B07F951A680F5B00A75B9A /* Release */ = {
      isa = XCBuildConfiguration;
      buildSettings = {
        ASSETCATALOG_COMPILER_APPICON_NAME = AppIcon;
<<<<<<< ours
        CODE_SIGN_IDENTITY = "iPhone Developer";
        FRAMEWORK_SEARCH_PATHS = (
          "$(inherited)",
          "$(PROJECT_DIR)/HockeySDK.embeddedframework",
          "$(PROJECT_DIR)/HockeySDK-iOS/HockeySDK.embeddedframework",
        );
=======
        CURRENT_PROJECT_VERSION = 1;
>>>>>>> theirs
        HEADER_SEARCH_PATHS = (
          "$(inherited)",
          /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/include,
          "$(SRCROOT)/../node_modules/react-native/React/**",
          "$(SRCROOT)/../node_modules/react-native-code-push/ios/CodePush/**",
        );
```

这些冲突一般很好处理。分界符 **ours** 代表“你的团队”，而 **theirs** 可视为“React Native 团队”。

## 为什么引入一个新的全局包？

React Native 自带一个全局 CLI（[react-native-cli](https://www.npmjs.com/package/react-native-cli) 包），它将命令代理给内嵌在 `node_modules/react-native/local-cli` 目录下的本地 CLI。

如前所述，流程必须从你当前的 React Native 版本启动。如果把实现嵌入本地 CLI，你无法在旧版本 React Native 中享用新功能。举例来说，如果这套新升级代码只发布于 0.38.0，那你就无法从 0.29.2 升级到 0.38.0。

基于 Git 的升级大大提升开发者体验，并且要让所有人都能用得上非常重要。通过使用独立的全局安装包 [react-native-git-upgrade](https://www.npmjs.com/package/react-native-git-upgrade)，无论你的项目用哪个版本 React Native，今天都可以使用这套新代码。

另外原因是 Martin Konicek 最近的 [Yeoman 淘汰](https://twitter.com/martinkonicek/status/800730190141857793)。我们不希望为了评估旧模板进而生成补丁，再把 Yeoman 依赖重新带回 `react-native` 包。

## 试试看并提供反馈

总结一句，尽情享用该功能，欢迎随时[提出改进建议、报告问题](https://github.com/facebook/react-native/issues)，尤其是[提交 Pull Request](https://github.com/facebook/react-native/pulls)。每种环境和每个 React Native 项目都各不相同，我们需要你的反馈，让这个工具为更多人顺利工作。

### 感谢！

特别感谢了不起的公司 [Zenika](https://www.zenika.com) 和 [M6 Web（存档）](https://web.archive.org/web/20161230163633/http://www.groupem6.fr:80/le-groupe_en/activites/diversifications/m6-web.html)，没有他们这一切都不可能实现！