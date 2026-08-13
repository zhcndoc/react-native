import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ThemedImage from '@theme/ThemedImage';
import constants from '@site/core/TabsConstants';
import CodeBlock from '@theme/CodeBlock';
import RNTemplateRepoLink from '@site/core/RNTemplateRepoLink';
import {getTemplateBranchNameForCurrentVersion} from '@site/src/getTemplateBranchNameForCurrentVersion';

## 核心概念

将 React Native 组件集成到 iOS 应用中的关键步骤是：

1. 设置正确的目录结构
2. 安装必要的 NPM 依赖
3. 将 React Native 添加到 Podfile 配置中
4. 为第一个 React Native 屏幕编写 TypeScript 代码
5. 使用 `RCTRootView` 将 React Native 与 iOS 代码集成
6. 通过运行 bundler 并查看应用运行效果来测试集成

## 使用 Community Template

在遵循本指南的过程中，我们建议你参考 [React Native Community Template](https://github.com/react-native-community/template/)。该模板包含一个**最小化的 iOS 应用**，可以帮助你了解如何将 React Native 集成到现有的 iOS 应用中。

## 前置条件

请按照[设置开发环境](set-up-your-environment)以及使用[不带框架的 React Native](getting-started-without-a-framework)指南，配置用于构建 iOS React Native 应用的开发环境  
本指南还假设你熟悉 iOS 开发基础知识，例如创建 `UIViewController` 和编辑 `Podfile` 文件

### 1．设置目录结构

为了确保顺利进行，请为集成的 React Native 项目创建一个新文件夹，然后将**现有的 iOS 项目移动**到 `/ios` 子文件夹中

## 2．安装 NPM 依赖

进入根目录并运行以下命令：

<CodeBlock language="bash" title="shell">
{`curl -O https://raw.githubusercontent.com/react-native-community/template/refs/heads/${getTemplateBranchNameForCurrentVersion()}/template/package.json`}
</CodeBlock>

这会将 Community template 中的 `package.json` <RNTemplateRepoLink href="template/package.json">文件复制</RNTemplateRepoLink>到你的项目中

接下来，运行以下命令安装 NPM 软件包：

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

安装过程创建了一个新的 `node_modules` 文件夹。此文件夹存储构建项目所需的所有 JavaScript 依赖

将 `node_modules/` 添加到你的 `.gitignore` 文件中（这里提供了 <RNTemplateRepoLink href="template/_gitignore">Community 的默认文件</RNTemplateRepoLink>）

### 3．安装开发工具

### Xcode 的 Command Line Tools

安装 Command Line Tools。在 Xcode 菜单中选择 **Settings...（或 Preferences...）**。进入 Locations 面板，并在 Command Line Tools 下拉菜单中选择最新版本来安装工具

<ThemedImage
alt="Xcode Command Line Tools 配置"
sources={{
    light: '/docs/assets/GettingStartedXcodeCommandLineTools.png',
    dark: '/docs/assets/GettingStartedXcodeCommandLineToolsDark.png',
  }}
/>

### CocoaPods

[CocoaPods](https://cocoapods.org) 是用于 iOS 和 macOS 开发的软件包管理工具。我们使用它将实际的 React Native 框架代码添加到当前项目的本地环境中

我们建议使用 [Homebrew](https://brew.sh/) 安装 CocoaPods：

```shell
brew install cocoapods
```

## 4．将 React Native 添加到你的应用中

### 配置 CocoaPods

要配置 CocoaPods，我们需要两个文件：

- 一个定义所需 Ruby 依赖的 **Gemfile**
- 一个定义如何正确安装依赖的 **Podfile**

对于 **Gemfile**，进入项目根目录并运行此命令

<CodeBlock language="bash" title="shell">
{`curl -O https://raw.githubusercontent.com/react-native-community/template/refs/heads/${getTemplateBranchNameForCurrentVersion()}/template/Gemfile`}
</CodeBlock>

这会从模板下载 Gemfile

:::note
如果你使用 Xcode 16 创建了项目，则需要按如下方式更新 Gemfile：

```diff
-gem 'cocoapods', '>= 1.13', '!= 1.15.0', '!= 1.15.1'
+gem 'cocoapods', '1.16.2'
gem 'activesupport', '>= 6.1.7.5', '!= 7.1.0'
-gem 'xcodeproj', '< 1.26.0'
+gem 'xcodeproj', '1.27.0'
```

Xcode 16 生成项目的方式与之前版本的 Xcode 略有不同，你需要最新的 CocoaPods 和 Xcodeproj gems 才能使其正常工作
:::

同样，对于 **Podfile**，进入项目的 `ios` 文件夹并运行

<CodeBlock language="bash" title="shell">
{`curl -O https://raw.githubusercontent.com/react-native-community/template/refs/heads/${getTemplateBranchNameForCurrentVersion()}/template/ios/Podfile`}
</CodeBlock>

请将 Community Template 作为 <RNTemplateRepoLink href="template/Gemfile">Gemfile</RNTemplateRepoLink> 和 <RNTemplateRepoLink href="template/ios/Podfile">Podfile</RNTemplateRepoLink> 的参考

:::note
请记得更改<RNTemplateRepoLink href="template/ios/Podfile#L17">此行</RNTemplateRepoLink>
:::

现在，我们需要再运行几个命令来安装 Ruby gems 和 Pods  
进入 `ios` 文件夹并运行以下命令：

```sh
bundle install
bundle exec pod install
```

第一个命令会安装 Ruby 依赖，第二个命令会实际将 React Native 代码集成到你的应用中，以便 iOS 文件可以导入 React Native 头文件

## 5．编写 TypeScript 代码

现在，我们将实际修改原生 iOS 应用以集成 React Native

我们要编写的第一段代码，就是将要集成到应用中的新屏幕所对应的实际 React Native 代码

### 创建 `index.js` 文件

首先，在 React Native 项目的根目录中创建一个空的 `index.js` 文件

`index.js` 是 React Native 应用的起始点，并且始终是必需的。它可以是一个导入 React Native 组件或应用中其他文件的简短文件，也可以包含所需的全部代码

我们的 `index.js` 应如下所示（这里以 <RNTemplateRepoLink href="template/index.js">Community 模板文件作为参考</RNTemplateRepoLink>）：

```js
import {AppRegistry} from 'react-native';
import App from './App';

AppRegistry.registerComponent('HelloWorld', () => App);
```

### 创建 `App.tsx` 文件

让我们创建一个 `App.tsx` 文件。这是一个可以包含 [JSX](<https://en.wikipedia.org/wiki/JSX_(JavaScript)>) 表达式的 [TypeScript](https://www.typescriptlang.org/) 文件。它包含我们将集成到 iOS 应用中的根 React Native 组件（<RNTemplateRepoLink href="template/App.tsx">链接</RNTemplateRepoLink>）：

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

这里是 <RNTemplateRepoLink href="template/App.tsx">Community 模板文件参考</RNTemplateRepoLink>

## 5．与 iOS 代码集成

现在，我们需要添加一些原生代码，以便启动 React Native 运行时，并告诉它渲染我们的 React 组件

### 要求

React Native 的初始化现在不再绑定到 iOS 应用的任何特定部分

可以使用名为 `RCTReactNativeFactory` 的类初始化 React Native，该类负责处理 React Native 的生命周期

初始化该类后，你可以提供一个 `UIWindow` 对象来启动 React Native 视图，也可以让 factory 生成一个 `UIView`，然后在任意 `UIViewController` 中加载它

在下面的示例中，我们将创建一个可以将 React Native 视图作为其 `view` 加载的 ViewController

#### 创建 ReactViewController

从模板创建一个新文件（<kbd>⌘</kbd>＋<kbd>N</kbd>），并选择 Cocoa Touch Class 模板

请确保在 “Subclass of” 字段中选择 `UIViewController`

<Tabs groupId="ios-language" queryString defaultValue={constants.defaultAppleLanguage} values={constants.appleLanguages}>
<TabItem value="objc">

现在打开 `ReactViewController.m` 文件并应用以下更改

```diff title="ReactViewController.m"
#import "ReactViewController.h"
+#import <React/RCTBundleURLProvider.h>
+#import <RCTReactNativeFactory.h>
+#import <RCTDefaultReactNativeFactoryDelegate.h>
+#import <RCTAppDependencyProvider.h>


@interface ReactViewController ()

@end

+@interface ReactNativeFactoryDelegate: RCTDefaultReactNativeFactoryDelegate
+@end

-@implementation ReactViewController
+@implementation ReactViewController {
+  RCTReactNativeFactory *_factory;
+  id<RCTReactNativeFactoryDelegate> _factoryDelegate;
+}

 - (void)viewDidLoad {
     [super viewDidLoad];
     // Do any additional setup after loading the view.
+    _factoryDelegate = [ReactNativeFactoryDelegate new];
+    _factoryDelegate.dependencyProvider = [RCTAppDependencyProvider new];
+    _factory = [[RCTReactNativeFactory alloc] initWithDelegate:_factoryDelegate];
+    self.view = [_factory.rootViewFactory viewWithModuleName:@"HelloWorld"];
 }

@end

+@implementation ReactNativeFactoryDelegate
+
+- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
+{
+  return [self bundleURL];
+}
+
+- (NSURL *)bundleURL
+{
+#if DEBUG
+  return [RCTBundleURLProvider.sharedSettings jsBundleURLForBundleRoot:@"index"];
+#else
+  return [NSBundle.mainBundle URLForResource:@"main" withExtension:@"jsbundle"];
+#endif
+}

@end

```

</TabItem>
<TabItem value="swift">

现在打开 `ReactViewController.swift` 文件并应用以下更改

```diff title="ReactViewController.swift"
import UIKit
+import React
+import React_RCTAppDelegate
+import ReactAppDependencyProvider

class ReactViewController: UIViewController {
+  var reactNativeFactory: RCTReactNativeFactory?
+  var reactNativeFactoryDelegate: RCTReactNativeFactoryDelegate?

  override func viewDidLoad() {
    super.viewDidLoad()
+    reactNativeFactoryDelegate = ReactNativeDelegate()
+    reactNativeFactoryDelegate!.dependencyProvider = RCTAppDependencyProvider()
+    reactNativeFactory = RCTReactNativeFactory(delegate: reactNativeFactoryDelegate!)
+    view = reactNativeFactory!.rootViewFactory.view(withModuleName: "HelloWorld")

  }
}

+class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
+    override func sourceURL(for bridge: RCTBridge) -> URL? {
+      self.bundleURL()
+    }
+
+    override func bundleURL() -> URL? {
+      #if DEBUG
+      RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
+      #else
+      Bundle.main.url(forResource: "main", withExtension: "jsbundle")
+      #endif
+    }
+
+}
```

</TabItem>
</Tabs>

#### 在 rootViewController 中展示 React Native 视图

最后，我们可以展示 React Native 视图。为此，我们需要一个新的 View Controller，它可以承载一个能够加载 JS 内容的视图  
我们已经有了初始的 `ViewController`，可以让它展示 `ReactViewController`。根据你的应用不同，实现方式有多种。在本例中，我们假设你有一个可以以模态方式展示 React Native 的按钮

<Tabs groupId="ios-language" queryString defaultValue={constants.defaultAppleLanguage} values={constants.appleLanguages}>
<TabItem value="objc">

```diff title="ViewController.m"
#import "ViewController.h"
+#import "ReactViewController.h"

@interface ViewController ()

@end

- @implementation ViewController
+@implementation ViewController {
+  ReactViewController *reactViewController;
+}

 - (void)viewDidLoad {
   [super viewDidLoad];
   // Do any additional setup after loading the view.
   self.view.backgroundColor = UIColor.systemBackgroundColor;
+  UIButton *button = [UIButton new];
+  [button setTitle:@"Open React Native" forState:UIControlStateNormal];
+  [button setTitleColor:UIColor.systemBlueColor forState:UIControlStateNormal];
+  [button setTitleColor:UIColor.blueColor forState:UIControlStateHighlighted];
+  [button addTarget:self action:@selector(presentReactNative) forControlEvents:UIControlEventTouchUpInside];
+  [self.view addSubview:button];

+  button.translatesAutoresizingMaskIntoConstraints = NO;
+  [NSLayoutConstraint activateConstraints:@[
+    [button.leadingAnchor constraintEqualToAnchor:self.view.leadingAnchor],
+    [button.trailingAnchor constraintEqualToAnchor:self.view.trailingAnchor],
+    [button.centerYAnchor constraintEqualToAnchor:self.view.centerYAnchor],
+    [button.centerXAnchor constraintEqualToAnchor:self.view.centerXAnchor],
+  ]];
 }

+- (void)presentReactNative
+{
+  if (reactViewController == NULL) {
+    reactViewController = [ReactViewController new];
+  }
+  [self presentViewController:reactViewController animated:YES];
+}

@end
```

</TabItem>
<TabItem value="swift">

```diff title="ViewController.swift"
import UIKit

class ViewController: UIViewController {

+  var reactViewController: ReactViewController?

  override func viewDidLoad() {
    super.viewDidLoad()
    // Do any additional setup after loading the view.
    self.view.backgroundColor = .systemBackground

+    let button = UIButton()
+    button.setTitle("Open React Native", for: .normal)
+    button.setTitleColor(.systemBlue, for: .normal)
+    button.setTitleColor(.blue, for: .highlighted)
+    button.addAction(UIAction { [weak self] _ in
+      guard let self else { return }
+      if reactViewController == nil {
+       reactViewController = ReactViewController()
+      }
+      present(reactViewController!, animated: true)
+    }, for: .touchUpInside)
+    self.view.addSubview(button)
+
+    button.translatesAutoresizingMaskIntoConstraints = false
+    NSLayoutConstraint.activate([
+      button.leadingAnchor.constraint(equalTo: self.view.leadingAnchor),
+      button.trailingAnchor.constraint(equalTo: self.view.trailingAnchor),
+      button.centerXAnchor.constraint(equalTo: self.view.centerXAnchor),
+      button.centerYAnchor.constraint(equalTo: self.view.centerYAnchor),
+    ])
  }
}
```

</TabItem>
</Tabs>

请确保禁用 Sandbox scripting。要实现这一点，请在 Xcode 中点击你的应用，然后进入构建设置。筛选 script，并将 `User Script Sandboxing` 设置为 `NO`。为了在 React Native 随附的 [Hermes engine](https://github.com/facebook/hermes/blob/main/README.md) 的 Debug 和 Release 版本之间正确切换，需要执行此步骤

![禁用 Sandboxing](/docs/assets/disable-sandboxing.png)

最后，请确保将 `UIViewControllerBasedStatusBarAppearance` 键添加到 `Info.plist` 文件中，并将值设置为 `NO`

![禁用 UIViewControllerBasedStatusBarAppearance](/docs/assets/disable-UIViewControllerBasedStatusBarAppearance.png)

## 6．测试集成

你已经完成了将 React Native 集成到应用中的所有基本步骤。现在，我们将启动 [Metro bundler](https://metrobundler.dev/)，将 TypeScript 应用代码构建为 bundle。Metro 的 HTTP 服务器会将开发环境中 `localhost` 上的 bundle 共享给模拟器或设备。这使得应用支持[热重载](https://reactnative.dev/blog/2016/03/24/introducing-hot-reloading)

首先，你需要在项目根目录中创建一个 `metro.config.js` 文件，内容如下：

```js
const {getDefaultConfig} = require('@react-native/metro-config');
module.exports = getDefaultConfig(__dirname);
```

你可以从 Community template 中查看 <RNTemplateRepoLink href="template/metro.config.js">`metro.config.js` 文件</RNTemplateRepoLink>，以此作为参考

然后，你需要在项目根目录中创建一个 `.watchmanconfig` 文件。该文件必须包含一个空的 json 对象：

```sh
echo {} > .watchmanconfig
```

配置文件准备就绪后，就可以运行 bundler。在项目根目录中运行以下命令：

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

现在，像平常一样构建并运行 iOS 应用

当你在应用中进入由 React 驱动的 Activity 后，它应该会从开发服务器加载 JavaScript 代码并显示：

<center><img src="/docs/assets/EmbeddedAppIOS078.gif" width="300" /></center>

### 在 Xcode 中创建 Release 构建

你也可以使用 Xcode 创建 Release 构建！唯一的额外步骤是添加一个在应用构建时执行的脚本，将 JS 和图像打包到 iOS 应用中

1. 在 Xcode 中选择你的应用
2. 点击 `Build Phases`
3. 点击左上角的 `+`，然后选择 `New Run Script Phase`
4. 点击 `Run Script` 行，并将脚本重命名为 `Bundle React Native code and images`
5. 将以下脚本粘贴到文本框中

```sh title="Build React Native code and image"
set -e

WITH_ENVIRONMENT="$REACT_NATIVE_PATH/scripts/xcode/with-environment.sh"
REACT_NATIVE_XCODE="$REACT_NATIVE_PATH/scripts/react-native-xcode.sh"

/bin/sh -c "$WITH_ENVIRONMENT $REACT_NATIVE_XCODE"
```

6. 将脚本拖放到名为 `[CP] Embed Pods Frameworks` 的脚本之前

现在，如果你为 Release 构建应用，它就会按预期运行

## 7．向 React Native 视图传递初始 props

在某些情况下，你可能希望将一些信息从 Native 应用传递给 JavaScript。例如，你可能希望将当前登录用户的用户 ID，以及可用于从数据库检索信息的令牌传递给 React Native

这可以通过使用 `RCTReactNativeFactory` 类的 `view(withModuleName:initialProperty)` 重载中的 `initialProperties` 参数来实现。以下步骤将说明如何执行此操作

### 更新 App.tsx 文件以读取初始属性

打开 `App.tsx` 文件并添加以下代码：

```diff title="App.tsx"
import {
  Colors,
  DebugInstructions,
  Header,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

-function App(): React.JSX.Element {
+function App(props): React.JSX.Element {
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
-       <View
-         style={{
-           backgroundColor: isDarkMode
-             ? Colors.black
-             : Colors.white,
-           padding: 24,
-         }}>
-         <Text style={styles.title}>Step One</Text>
-         <Text>
-           Edit <Text style={styles.bold}>App.tsx</Text> to
-           change this screen and see your edits.
-         </Text>
-         <Text style={styles.title}>See your changes</Text>
-         <ReloadInstructions />
-         <Text style={styles.title}>Debug</Text>
-         <DebugInstructions />
+         <Text style={styles.title}>UserID: {props.userID}</Text>
+         <Text style={styles.title}>Token: {props.token}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '600',
+   marginLeft: 20,
  },
  bold: {
    fontWeight: '700',
  },
});

export default App;
```

这些更改会告诉 React Native，你的 App 组件现在可以接收一些属性。`RCTreactNativeFactory` 会负责在组件渲染时将这些属性传递给它

### 更新 Native 代码，将初始属性传递给 JavaScript

<Tabs groupId="ios-language" queryString defaultValue={constants.defaultAppleLanguage} values={constants.appleLanguages}>
<TabItem value="objc">

修改 `ReactViewController.mm`，将初始属性传递给 JavaScript

```diff title="ReactViewController.mm"
 - (void)viewDidLoad {
   [super viewDidLoad];
   // Do any additional setup after loading the view.

   _factoryDelegate = [ReactNativeFactoryDelegate new];
   _factoryDelegate.dependencyProvider = [RCTAppDependencyProvider new];
   _factory = [[RCTReactNativeFactory alloc] initWithDelegate:_factoryDelegate];
-  self.view = [_factory.rootViewFactory viewWithModuleName:@"HelloWorld"];
+  self.view = [_factory.rootViewFactory viewWithModuleName:@"HelloWorld" initialProperties:@{
+    @"userID": @"12345678",
+    @"token": @"secretToken"
+  }];
}
```

</TabItem>
<TabItem value="swift">

修改 `ReactViewController.swift`，将初始属性传递给 React Native 视图

```diff title="ReactViewController.swift"
  override func viewDidLoad() {
    super.viewDidLoad()
    reactNativeFactoryDelegate = ReactNativeDelegate()
    reactNativeFactoryDelegate!.dependencyProvider = RCTAppDependencyProvider()
    reactNativeFactory = RCTReactNativeFactory(delegate: reactNativeFactoryDelegate!)
-   view = reactNativeFactory!.rootViewFactory.view(withModuleName: "HelloWorld")
+   view = reactNativeFactory!.rootViewFactory.view(withModuleName: "HelloWorld" initialProperties: [
+     "userID": "12345678",
+     "token": "secretToken"
+])

  }
}
```

</TabItem>
</Tabs>

3. 再次运行你的应用。在展示 `ReactViewController` 后，你应该会看到以下屏幕：

<center>
  <img src="/docs/assets/brownfield-with-initial-props.png" width="30%" height="30%"/>
</center>

## 接下来做什么？

现在，你可以继续像平常一样开发应用。请参考我们的 [debugging](debugging) 和 [deployment](running-on-device) 文档，进一步了解如何使用 React Native。
