import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import constants from '@site/core/TabsConstants';
import CodeBlock from '@theme/CodeBlock';
import RNTemplateRepoLink from '@site/core/RNTemplateRepoLink';
import {getTemplateBranchNameForCurrentVersion} from '@site/src/getTemplateBranchNameForCurrentVersion';

## 核心概念

将 React Native 组件集成到你的 iOS 应用中的关键步骤是：

1. 设置正确的目录结构。
2. 安装必要的 NPM 依赖。
3. 将 React Native 添加到你的 Podfile 配置中。
4. 为你的第一个 React Native 屏幕编写 TypeScript 代码。
5. 使用 `RCTRootView` 将 React Native 集成到你的 iOS 代码中。
6. 通过运行打包器并查看应用运行效果来测试集成。

## 使用社区模板

在遵循本指南时，我们建议你将 [React Native 社区模板](https://github.com/react-native-community/template/) 作为参考。该模板包含一个**最小化的 iOS 应用**，并且会帮助你理解如何将 React Native 集成到现有的 iOS 应用中。

## 前置条件

请先按照 [配置开发环境](set-up-your-environment) 和 [不使用框架的 React Native](getting-started-without-a-framework) 中的指南配置用于构建 iOS React Native 应用的开发环境。
本指南还假设你已经熟悉 iOS 开发基础，例如创建 `UIViewController` 和编辑 `Podfile` 文件。

### 1. 设置目录结构

为了确保顺利使用，请为集成 React Native 的项目创建一个新文件夹，然后将你现有的 iOS 项目**移动到 `/ios` 子文件夹**中。

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

安装过程会创建一个新的 `node_modules` 文件夹。这个文件夹会存储构建项目所需的所有 JavaScript 依赖。

将 `node_modules/` 添加到你的 `.gitignore` 文件中（这里使用的是 <RNTemplateRepoLink href="template/_gitignore">社区默认版本</RNTemplateRepoLink>）。

### 3. 安装开发工具

### Xcode 命令行工具

安装命令行工具。在 Xcode 菜单中选择 **Settings...（或 Preferences...）**。进入 Locations 面板，并在 Command Line Tools 下拉菜单中选择最新版本以安装工具。

![Xcode 命令行工具](/docs/assets/GettingStartedXcodeCommandLineTools.png)

### CocoaPods

[CocoaPods](https://cocoapods.org) 是一个用于 iOS 和 macOS 开发的包管理工具。我们使用它将实际的 React Native 框架代码本地添加到当前项目中。

我们建议使用 [Homebrew](https://brew.sh/) 安装 CocoaPods：

```shell
brew install cocoapods
```

## 4. 将 React Native 添加到你的应用中

### 配置 CocoaPods

为了配置 CocoaPods，我们需要两个文件：

- 一个定义所需 Ruby 依赖的 **Gemfile**。
- 一个定义如何正确安装依赖的 **Podfile**。

对于 **Gemfile**，进入项目根目录并运行此命令

<CodeBlock language="bash" title="shell">
{`curl -O https://raw.githubusercontent.com/react-native-community/template/refs/heads/${getTemplateBranchNameForCurrentVersion()}/template/Gemfile`}
</CodeBlock>

这会从模板中下载 Gemfile。

:::note
如果你使用 Xcode 16 创建了项目，需要按如下方式更新 Gemfile：

```diff
-gem 'cocoapods', '>= 1.13', '!= 1.15.0', '!= 1.15.1'
+gem 'cocoapods', '1.16.2'
gem 'activesupport', '>= 6.1.7.5', '!= 7.1.0'
-gem 'xcodeproj', '< 1.26.0'
+gem 'xcodeproj', '1.27.0'
```

Xcode 16 生成项目的方式与之前版本的 Xcode 略有不同，因此你需要使用最新的 CocoaPods 和 Xcodeproj gem 才能正常工作。
:::

同样地，对于 **Podfile**，进入项目的 `ios` 文件夹并运行

<CodeBlock language="bash" title="shell">
{`curl -O https://raw.githubusercontent.com/react-native-community/template/refs/heads/${getTemplateBranchNameForCurrentVersion()}/template/ios/Podfile`}
</CodeBlock>

请将社区模板作为 <RNTemplateRepoLink href="template/Gemfile">Gemfile</RNTemplateRepoLink> 和 <RNTemplateRepoLink href="template/ios/Podfile">Podfile</RNTemplateRepoLink> 的参考。

:::note
记得修改 <RNTemplateRepoLink href="template/ios/Podfile#L17">这一行</RNTemplateRepoLink>。
:::

现在，我们需要再运行几个额外命令来安装 Ruby gems 和 Pods。
进入 `ios` 文件夹并运行以下命令：

```sh
bundle install
bundle exec pod install
```

第一个命令会安装 Ruby 依赖，第二个命令会真正将 React Native 代码集成到你的应用中，这样你的 iOS 文件就可以导入 React Native 头文件。

## 5. 编写 TypeScript 代码

现在我们将真正修改原生 iOS 应用，以集成 React Native。

我们首先要编写的代码，是用于将要集成到应用中的新屏幕的实际 React Native 代码。

### 创建 `index.js` 文件

首先，在你的 React Native 项目根目录中创建一个空的 `index.js` 文件。

`index.js` 是 React Native 应用的入口点，并且始终是必需的。它可以是一个较小的文件，用来 `import` 其他属于你的 React Native 组件或应用的文件；也可以包含所需的全部代码。

我们的 `index.js` 应如下所示（这里以 <RNTemplateRepoLink href="template/index.js">社区模板文件作为参考</RNTemplateRepoLink>）：

```js
import {AppRegistry} from 'react-native';
import App from './App';

AppRegistry.registerComponent('HelloWorld', () => App);
```

### 创建 `App.tsx` 文件

让我们创建一个 `App.tsx` 文件。这是一个可以包含 [JSX](<https://en.wikipedia.org/wiki/JSX_(JavaScript)>) 表达式的 [TypeScript](https://www.typescriptlang.org/) 文件。它包含我们将集成到 iOS 应用中的 React Native 根组件（<RNTemplateRepoLink href="template/App.tsx">链接</RNTemplateRepoLink>）：

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
            更改此屏幕并查看你的修改。
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

## 5. 将其与你的 iOS 代码集成

我们现在需要添加一些原生代码，以启动 React Native 运行时并告诉它渲染我们的 React 组件。

### 要求

React Native 的初始化现在不再绑定到 iOS 应用中的任何特定部分。

React Native 可以使用一个名为 `RCTReactNativeFactory` 的类来初始化，它会为你负责处理 React Native 的生命周期。

一旦该类初始化完成，你就可以通过提供一个 `UIWindow` 对象来启动 React Native 视图，或者让工厂生成一个可加载到任意 `UIViewController` 中的 `UIView`。

在以下示例中，我们将创建一个能够将 React Native 视图作为其 `view` 加载的 ViewController。

#### 创建 `ReactViewController`

通过模板创建一个新文件（<kbd>⌘</kbd>+<kbd>N</kbd>），并选择 Cocoa Touch Class 模板。

确保在 “Subclass of” 字段中选择 `UIViewController`。

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
+
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

#### 在 rootViewController 中呈现 React Native 视图

最后，我们可以展示我们的 React Native 视图。为此，我们需要一个新的 View Controller，用来承载可以加载 JS 内容的视图。
我们已经有了初始的 `ViewController`，可以让它呈现 `ReactViewController`。具体做法有很多种，取决于你的应用。这个示例中，我们假设你有一个按钮来以模态方式呈现 React Native。

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

确保禁用 Sandbox scripting。为此，在 Xcode 中点击你的应用，然后进入 build settings。筛选 script，并将 `User Script Sandboxing` 设置为 `NO`。这一步是正确切换我们随 React Native 一起提供的 [Hermes 引擎](https://github.com/facebook/hermes/blob/main/README.md) 的 Debug 与 Release 版本所必需的。

![Disable Sandboxing](/docs/assets/disable-sandboxing.png)

最后，确保在你的 `Info.plist` 文件中添加 `UIViewControllerBasedStatusBarAppearance` 键，并将其值设为 `NO`。

![Disable UIViewControllerBasedStatusBarAppearance](/docs/assets/disable-UIViewControllerBasedStatusBarAppearance.png)

## 6. 测试你的集成

你已经完成了将 React Native 与应用程序集成的所有基础步骤。现在我们将启动 [Metro bundler](https://metrobundler.dev/)，把你的 TypeScript 应用代码构建成一个 bundle。Metro 的 HTTP 服务器会将开发环境中 `localhost` 上的 bundle 共享到模拟器或设备。这支持 [热重载](https://reactnative.dev/blog/2016/03/24/introducing-hot-reloading)。

首先，你需要在项目根目录中创建一个 `metro.config.js` 文件，如下所示：

```js
const {getDefaultConfig} = require('@react-native/metro-config');
module.exports = getDefaultConfig(__dirname);
```

你可以从 Community 模板文件中查看 <RNTemplateRepoLink href="template/metro.config.js">`metro.config.js` 文件</RNTemplateRepoLink> 作为参考。

然后，你需要在项目根目录中创建一个 `.watchmanconfig` 文件。该文件必须包含一个空的 json 对象：

```sh
echo {} > .watchmanconfig
```

配置文件就绪后，你就可以运行 bundler 了。在项目根目录中执行以下命令：

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

现在照常构建并运行你的 iOS 应用。

当你进入应用中的 React 驱动 Activity 后，它应该会从开发服务器加载 JavaScript 代码并显示：

<center><img src="/docs/assets/EmbeddedAppIOS078.gif" width="300" /></center>

### 在 Xcode 中创建发布构建

你也可以使用 Xcode 来创建发布构建！唯一额外的步骤是添加一个在应用构建时执行的脚本，以将你的 JS 和图片打包到 iOS 应用中。

1. 在 Xcode 中选择你的应用程序
2. 点击 `Build Phases`
3. 点击左上角的 `+`，然后选择 `New Run Script Phase`
4. 点击 `Run Script` 这一行，并将脚本重命名为 `Bundle React Native code and images`
5. 在文本框中粘贴以下脚本

```sh title="Build React Native code and image"
set -e

WITH_ENVIRONMENT="$REACT_NATIVE_PATH/scripts/xcode/with-environment.sh"
REACT_NATIVE_XCODE="$REACT_NATIVE_PATH/scripts/react-native-xcode.sh"

/bin/sh -c "$WITH_ENVIRONMENT $REACT_NATIVE_XCODE"
```

6. 将该脚本拖放到 `[CP] Embed Pods Frameworks` 之前。

现在，如果你构建 Release 版本的应用，它将按预期工作。

## 7. 向 React Native 视图传递初始属性

在某些情况下，你可能希望从原生应用向 JavaScript 传递一些信息。例如，你可能想把当前登录用户的用户 ID，以及一个可用于从数据库检索信息的 token，一起传递给 React Native。

这可以通过 `RCTReactNativeFactory` 类的 `view(withModuleName:initialProperty)` 重载中的 `initialProperties` 参数来实现。以下步骤将向你展示如何操作。

### 更新 `App.tsx` 文件以读取初始属性。

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
-           编辑 <Text style={styles.bold}>App.tsx</Text> 以
-           更改此屏幕并查看你的修改。
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

这些更改会告诉 React Native，你的 App 组件现在会接收一些属性。`RCTreactNativeFactory` 会在组件渲染时负责将这些属性传递给它。

### 更新原生代码，将初始属性传递给 JavaScript。

<Tabs groupId="ios-language" queryString defaultValue={constants.defaultAppleLanguage} values={constants.appleLanguages}>
<TabItem value="objc">

修改 `ReactViewController.mm`，将初始属性传递给 JavaScript。

```diff title="ReactViewController.mm"
 - (void)viewDidLoad {
   [super viewDidLoad];
   // 在视图加载时执行任何额外设置。

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

修改 `ReactViewController.swift`，将初始属性传递给 React Native 视图。

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

3. 再次运行你的应用。在你展示 `ReactViewController` 之后，你应该会看到以下界面：

<center>
  <img src="/docs/assets/brownfield-with-initial-props.png" width="30%" height="30%"/>
</center>

## 接下来做什么？

此时，你可以像平常一样继续开发你的应用。请参阅我们的 [调试](debugging) 和 [部署](running-on-device) 文档，了解更多关于使用 React Native 的信息。
