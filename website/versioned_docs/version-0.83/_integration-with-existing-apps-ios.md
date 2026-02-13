import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import constants from '@site/core/TabsConstants';
import CodeBlock from '@theme/CodeBlock';
import RNTemplateRepoLink from '@site/core/RNTemplateRepoLink';
import {getTemplateBranchNameForCurrentVersion} from '@site/src/getTemplateBranchNameForCurrentVersion';

## 关键概念

将 React Native 组件集成到你的 iOS 应用中的关键步骤是：

1. 设置正确的目录结构。
2. 安装必要的 NPM 依赖。
3. 在 Podfile 配置中添加 React Native。
4. 为你的第一个 React Native 界面编写 TypeScript 代码。
5. 使用 `RCTRootView` 将 React Native 与你的 iOS 代码集成。
6. 运行打包器测试集成效果，查看应用运行情况。

## 使用社区模板

在按照本指南操作时，我们建议你参考 [React Native 社区模板](https://github.com/react-native-community/template/)。该模板包含一个 **最小化的 iOS 应用**，能帮助你理解如何将 React Native 集成到现有的 iOS 应用中。

## 前提条件

请先参照 [设置开发环境指南](set-up-your-environment) 和 [无框架使用 React Native 指南](getting-started-without-a-framework) 配置好你的开发环境，以便为 iOS 构建 React Native 应用。

本指南还假设你熟悉 iOS 开发基础，比如创建 `UIViewController` 和编辑 `Podfile` 文件。

### 1. 设置目录结构

为确保顺利开发，请为你的集成 React Native 项目创建一个新文件夹，然后将现有的 iOS 项目 **移动到** `/ios` 子文件夹中。

## 2. 安装 NPM 依赖

进入项目根目录，运行以下命令：

<CodeBlock language="bash" title="shell">
{`curl -O https://raw.githubusercontent.com/react-native-community/template/refs/heads/${getTemplateBranchNameForCurrentVersion()}/template/package.json`}
</CodeBlock>

这会将来自社区模板的 <RNTemplateRepoLink href="template/package.json">package.json 文件</RNTemplateRepoLink> 拷贝到你的项目中。

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

安装过程会创建一个新的 `node_modules` 文件夹，该文件夹存放构建项目所需的所有 JavaScript 依赖。

请将 `node_modules/` 添加到你的 `.gitignore` 文件中（这里是<RNTemplateRepoLink href="template/_gitignore">社区默认配置</RNTemplateRepoLink>）。

### 3. 安装开发工具

### Xcode 命令行工具

安装命令行工具。打开 Xcode 菜单，选择 **设置…（或偏好设置…）**，进入 Locations 面板，在 “Command Line Tools” 下拉框中选择最新版本并安装。

![Xcode 命令行工具](/docs/assets/GettingStartedXcodeCommandLineTools.png)

### CocoaPods

[CocoaPods](https://cocoapods.org) 是 iOS 和 macOS 开发的包管理工具。我们使用它将实际的 React Native 框架代码本地加入当前项目。

我们推荐通过 [Homebrew](https://brew.sh/) 安装 CocoaPods：

```shell
brew install cocoapods
```

## 4. 将 React Native 添加到你的应用

### 配置 CocoaPods

配置 CocoaPods 需要两个文件：

- 一个定义需要哪些 Ruby 依赖的 **Gemfile**。
- 一个定义如何正确安装依赖的 **Podfile**。

对于 **Gemfile**，在项目根目录下运行：

<CodeBlock language="bash" title="shell">
{`curl -O https://raw.githubusercontent.com/react-native-community/template/refs/heads/${getTemplateBranchNameForCurrentVersion()}/template/Gemfile`}
</CodeBlock>

将从模板下载 Gemfile。

:::note
如果你是用 Xcode 16 创建的项目，需要按如下方式更新 Gemfile：

```diff
-gem 'cocoapods', '>= 1.13', '!= 1.15.0', '!= 1.15.1'
+gem 'cocoapods', '1.16.2'
gem 'activesupport', '>= 6.1.7.5', '!= 7.1.0'
-gem 'xcodeproj', '< 1.26.0'
+gem 'xcodeproj', '1.27.0'
```

Xcode 16 生成项目的方式与以前版本略有不同，需要使用最新的 CocoaPods 和 Xcodeproj gem 才能正常工作。
:::

同样，对于 **Podfile**，进入项目的 `ios` 文件夹，运行：

<CodeBlock language="bash" title="shell">
{`curl -O https://raw.githubusercontent.com/react-native-community/template/refs/heads/${getTemplateBranchNameForCurrentVersion()}/template/ios/Podfile`}
</CodeBlock>

请将社区模板作为 <RNTemplateRepoLink href="template/Gemfile">Gemfile</RNTemplateRepoLink> 和 <RNTemplateRepoLink href="template/ios/Podfile">Podfile</RNTemplateRepoLink> 的参考。

:::note
记得修改 <RNTemplateRepoLink href="template/ios/Podfile#L17">此行</RNTemplateRepoLink>。
:::

接着，我们需要运行几条命令安装 Ruby gems 和 pods。
进入 `ios` 文件夹，执行：

```sh
bundle install
bundle exec pod install
```

第一个命令安装 Ruby 依赖，第二个将 React Native 代码集成到你的应用，使你的 iOS 文件可以导入 React Native 头文件。

## 5. 编写 TypeScript 代码

现在我们开始修改原生 iOS 应用，集成 React Native。

第一步编写的是将集成到应用中的新屏幕的 React Native 代码。

### 创建 `index.js` 文件

首先，在 React Native 项目根目录下创建一个空的 `index.js`。

`index.js` 是 React Native 应用的入口文件，必不可少。它可以是一个引入其他 React Native 组件文件的小文件，也可以包含所有代码。

我们的 `index.js` 应如下（此处参考<RNTemplateRepoLink href="template/index.js">社区模板文件</RNTemplateRepoLink>）：

```js
import {AppRegistry} from 'react-native';
import App from './App';

AppRegistry.registerComponent('HelloWorld', () => App);
```

### 创建 `App.tsx` 文件

接下来创建 `App.tsx` 文件。它是一个可以包含 [JSX](<https://en.wikipedia.org/wiki/JSX_(JavaScript)>) 表达式的 [TypeScript](https://www.typescriptlang.org/) 文件，包含我们将要集成到 iOS 应用的根 React Native 组件（<RNTemplateRepoLink href="template/App.tsx">链接</RNTemplateRepoLink>）：

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
            编辑 <Text style={styles.bold}>App.tsx</Text> 来修改此屏幕并查看你的修订。
          </Text>
          <Text style={styles.title}>查看修改</Text>
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

这里是 <RNTemplateRepoLink href="template/App.tsx">社区模板文件</RNTemplateRepoLink>。

## 5. 与你的 iOS 代码集成

现在需要添加一些原生代码，启动 React Native 运行时并告诉它渲染我们的 React 组件。

### 要求

React Native 初始化现在不依赖于 iOS 应用的任意具体部分。

React Native 可以通过名为 `RCTReactNativeFactory` 的类来初始化，它帮你管理 React Native 生命周期。

初始化该类后，你可以用 `UIWindow` 对象启动 React Native 视图，或请求工厂生成一个 `UIView`，再加载到任意 `UIViewController` 中。

下面的例子中，我们将创建一个 ViewController，使其使用 React Native 视图作为它的 `view`。

#### 创建 ReactViewController

新建一个文件（快捷键 <kbd>⌘</kbd>+<kbd>N</kbd>），选择 Cocoa Touch Class 模板。

确保 “Subclass of” 字段选择 `UIViewController`。

<Tabs groupId="ios-language" queryString defaultValue={constants.defaultAppleLanguage} values={constants.appleLanguages}>
<TabItem value="objc">

打开 `ReactViewController.m` 文件，作如下修改：

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

打开 `ReactViewController.swift` 文件，作如下修改：

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

#### 在 rootViewController 中呈现 React Native 视图

最后，我们可以呈现 React Native 视图。为此需要一个能承载视图的新 View Controller，我们可以在这个视图中加载 JS 内容。
我们已有初始的 `ViewController`，可以让它弹出 `ReactViewController`。这可以通过多种方式实现，示例中假设你有一个按钮用于模态呈现 React Native 视图。

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

确保禁用 Sandbox 脚本。方法是在 Xcode 中点击你的应用，进入构建设置，搜索 script，将 “User Script Sandboxing” 设置为 `NO`。此步骤是为了正确切换我们与 React Native 一起发布的 [Hermes 引擎](https://github.com/facebook/hermes/blob/main/README.md) 的调试和发布版本。

![禁用 Sandbox](/docs/assets/disable-sandboxing.png)

最后，确保在你的 `Info.plist` 文件中添加 `UIViewControllerBasedStatusBarAppearance` 键，并将其值设为 `NO`。

![禁用 UIViewControllerBasedStatusBarAppearance](/docs/assets/disable-UIViewControllerBasedStatusBarAppearance.png)

## 6. 测试你的集成

你已完成将 React Native 集成到应用的基本步骤。现在我们启动 [Metro 打包器](https://metrobundler.dev/) 将你的 TypeScript 代码打包成 bundle。Metro 的 HTTP 服务器会将 bundle 从开发环境的 `localhost` 共享到模拟器或设备，实现[热更新](https://reactnative.dev/blog/2016/03/24/introducing-hot-reloading)。

首先，你需要在项目根目录创建一个 `metro.config.js` 文件，内容如下：

```js
const {getDefaultConfig} = require('@react-native/metro-config');
module.exports = getDefaultConfig(__dirname);
```

你可以参考社区模板的 <RNTemplateRepoLink href="template/metro.config.js">`metro.config.js` 文件</RNTemplateRepoLink>。

然后，在项目根目录创建一个 `.watchmanconfig` 文件，内容是个空的 JSON 对象：

```sh
echo {} > .watchmanconfig
```

配置文件到位后，在项目根目录运行打包器：

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

然后像往常一样构建并运行你的 iOS 应用。

进入 React 驱动的页面时，应用会从开发服务器加载 JavaScript 代码并显示：

<center><img src="/docs/assets/EmbeddedAppIOS078.gif" width="300" /></center>

### 在 Xcode 中创建发布版本

你也可以用 Xcode 创建发布版本！唯一额外步骤是在应用构建时添加一个脚本，负责打包 JS 和图片进 iOS 应用。

1. 在 Xcode 选择你的应用
2. 点击 `Build Phases`
3. 左上角点击 `+`，选择 `New Run Script Phase`
4. 点击新建脚本行，将其重命名为 `Bundle React Native code and images`
5. 粘贴以下脚本

```sh title="Build React Native code and image"
set -e

WITH_ENVIRONMENT="$REACT_NATIVE_PATH/scripts/xcode/with-environment.sh"
REACT_NATIVE_XCODE="$REACT_NATIVE_PATH/scripts/react-native-xcode.sh"

/bin/sh -c "$WITH_ENVIRONMENT $REACT_NATIVE_XCODE"
```

6. 将该脚本拖动到名为 `[CP] Embed Pods Frameworks` 的脚本之前。

现在，如果你构建发布版本，应用能正常工作。

## 7. 向 React Native 视图传递初始属性

有时你想从原生应用向 JavaScript 传递信息。例如，你可能想将当前登录用户的 user id 和一个可用于数据库的 token 传给 React Native。

这可以通过 `RCTReactNativeFactory` 的 `view(withModuleName:initialProperty)` 重载版本的 `initialProperties` 参数实现。以下步骤演示如何操作。

### 更新 `App.tsx` 文件读取初始属性

打开 `App.tsx` 文件，加入如下代码：

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

这些修改告诉 React Native，你的 App 组件现在接收一些属性。`RCTReactNativeFactory` 会负责渲染时传递它们。

### 修改原生代码，将初始属性传递给 JavaScript

<Tabs groupId="ios-language" queryString defaultValue={constants.defaultAppleLanguage} values={constants.appleLanguages}>
<TabItem value="objc">

修改 `ReactViewController.mm`，向 JavaScript 传递初始属性：

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

修改 `ReactViewController.swift`，向 React Native 视图传递初始属性：

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

3. 再次运行你的应用。弹出 `ReactViewController` 后，应该看到如下界面：

<center>
  <img src="/docs/assets/brownfield-with-initial-props.png" width="30%" height="30%"/>
</center>

## 接下来做什么？

此时，你可以照常继续开发你的应用。请参考我们的 [调试](debugging) 和 [部署](running-on-device) 文档，了解更多关于 React Native 的使用。
