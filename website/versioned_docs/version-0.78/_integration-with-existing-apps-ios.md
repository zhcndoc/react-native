import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

## 核心概念

将 React Native 组件集成到 iOS 应用程序中的关键在于：

1. 设置正确的目录结构。
2. 安装必要的 NPM 依赖。
3. 将 React Native 添加到您的 Podfile 配置中。
4. 为您的第一个 React Native 屏幕编写 TypeScript 代码。
5. 使用 `RCTRootView` 将 React Native 与您的 iOS 代码集成。
6. 通过运行 bundler 并查看您的应用实际运行来测试您的集成。

## 使用社区模板

在遵循本指南时，我们建议您使用 [React Native 社区模板](https://github.com/react-native-community/template/) 作为参考。该模板包含一个 **最小化的 iOS 应用**，将帮助您理解如何将 React Native 集成到现有的 iOS 应用中。

## 前提条件

遵循 [设置开发环境](set-up-your-environment) 的指南，并使用 [不使用框架的 React Native](getting-started-without-a-framework) 来配置您的开发环境以构建 iOS 的 React Native 应用。
本指南还假设您熟悉 iOS 开发的基础知识，例如创建 `UIViewController` 和编辑 `Podfile` 文件。

### 1. 设置目录结构

为了确保顺畅的体验，为您的集成 React Native 项目创建一个新文件夹，然后 **将您现有的 iOS 项目移动** 到 `/ios` 子文件夹。

## 2. 安装 NPM 依赖

进入根目录并运行以下命令：

```shell
curl -O https://raw.githubusercontent.com/react-native-community/template/refs/heads/0.78-stable/template/package.json
```

这会将 [社区模板中的 `package.json` 文件](https://github.com/react-native-community/template/blob/0.78-stable/template/package.json) 复制到您的项目。

接下来，通过运行以下命令安装 NPM 包：

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

安装过程创建了一个新的 `node_modules` 文件夹。该文件夹存储构建项目所需的所有 JavaScript 依赖。

将 `node_modules/` 添加到您的 `.gitignore` 文件中（这里是 [社区默认文件](https://github.com/react-native-community/template/blob/0.78-stable/template/_gitignore)）。

### 3. 安装开发工具

### Xcode 命令行工具

安装命令行工具。在 Xcode 菜单中选择 **设置...（或偏好设置...）**。转到位置面板，通过在命令行工具下拉菜单中选择最新版本来安装工具。

![Xcode 命令行工具](/docs/assets/GettingStartedXcodeCommandLineTools.png)

### CocoaPods

[CocoaPods](https://cocoapods.org) 是一个用于 iOS 和 macOS 开发的包管理工具。我们使用它将实际的 React Native 框架代码本地添加到您当前的项目中。

我们建议使用 [Homebrew](https://brew.sh/) 安装 CocoaPods：

```shell
brew install cocoapods
```

## 4. 将 React Native 添加到您的应用

### 配置 CocoaPods

要配置 CocoaPods，我们需要两个文件：

- 一个 **Gemfile**，定义我们需要哪些 Ruby 依赖。
- 一个 **Podfile**，定义如何正确安装我们的依赖。

对于 **Gemfile**，进入项目的根目录并运行此命令

```sh
curl -O https://raw.githubusercontent.com/react-native-community/template/refs/heads/0.78-stable/template/Gemfile
```

这将从模板下载 Gemfile。

:::note
如果您使用 Xcode 16 创建了项目，则需要按如下方式更新 Gemfile：

```diff
-gem 'cocoapods', '>= 1.13', '!= 1.15.0', '!= 1.15.1'
+gem 'cocoapods', '1.16.2'
gem 'activesupport', '>= 6.1.7.5', '!= 7.1.0'
-gem 'xcodeproj', '< 1.26.0'
+gem 'xcodeproj', '1.27.0'
```

Xcode 16 生成项目的方式与以前版本的 Xcode 略有不同，您需要最新的 CocoaPods 和 Xcodeproj gems 才能使其正常工作。
:::

类似地，对于 **Podfile**，进入项目的 `ios` 文件夹并运行

```sh
curl -O https://raw.githubusercontent.com/react-native-community/template/refs/heads/0.78-stable/template/ios/Podfile
```

请使用社区模板作为 [Gemfile](https://github.com/react-native-community/template/blob/0.78-stable/template/Gemfile) 和 [Podfile](https://github.com/react-native-community/template/blob/0.78-stable/template/ios/Podfile) 的参考点。

:::note
记得更改 [此行](https://github.com/react-native-community/template/blob/0.78-stable/template/ios/Podfile#L17)。
:::

现在，我们需要运行一些额外的命令来安装 Ruby gems 和 Pods。
导航到 `ios` 文件夹并运行以下命令：

```sh
bundle install
bundle exec pod install
```

第一个命令将安装 Ruby 依赖，第二个命令将实际把 React Native 代码集成到您的应用中，以便您的 iOS 文件可以导入 React Native 头文件。

## 5. 编写 TypeScript 代码

现在我们将实际修改原生 iOS 应用程序以集成 React Native。

我们将编写的第一段代码是实际将集成到我们应用中的新屏幕的 React Native 代码。

### 创建 `index.js` 文件

首先，在 React Native 项目的根目录中创建一个空的 `index.js` 文件。

`index.js` 是 React Native 应用程序的起点，并且始终是必需的。它可以是一个 `import` 其他文件的小文件，这些文件是您 React Native 组件或应用程序的一部分，或者它可以包含所需的所有代码。

我们的 `index.js` 应如下所示（此处参考 [社区模板文件](https://github.com/react-native-community/template/blob/0.78-stable/template/index.js)）：

```js
import {AppRegistry} from 'react-native';
import App from './App';

AppRegistry.registerComponent('HelloWorld', () => App);
```

### 创建 `App.tsx` 文件

让我们创建一个 `App.tsx` 文件。这是一个可以包含 [JSX](<https://en.wikipedia.org/wiki/JSX_(JavaScript)>) 表达式的 [TypeScript](https://www.typescriptlang.org/) 文件。它包含我们将集成到 iOS 应用程序中的根 React Native 组件（[链接](https://github.com/react-native-community/template/blob/0.78-stable/template/App.tsx)）：

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

此处参考 [社区模板文件](https://github.com/react-native-community/template/blob/0.78-stable/template/App.tsx)

## 5. 与您的 iOS 代码集成

我们现在需要添加一些原生代码，以便启动 React Native 运行时并告诉它渲染我们的 React 组件。

### 要求

React Native 初始化现在不绑定到 iOS 应用的任何特定部分。

可以使用名为 `RCTReactNativeFactory` 的类初始化 React Native，该类负责为您处理 React Native 生命周期。

一旦该类初始化，您可以提供 `UIWindow` 对象启动 React Native 视图，或者可以让工厂生成一个 `UIView`，您可以将其加载到任何 `UIViewController` 中。

在以下示例中，我们将创建一个 ViewController，它可以加载 React Native 视图作为其 `view`。

#### 创建 ReactViewController

从模板创建新文件 (<kbd>⌘</kbd>+<kbd>N</kbd>) 并选择 Cocoa Touch Class 模板。

确保选择 `UIViewController` 作为“子类”字段。

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
-    // Do any additional setup after loading the view.
+    // 加载视图后执行任何额外的设置。
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

class ReactViewController: UIViewController {
+  var reactNativeFactory: RCTReactNativeFactory?
+  var reactNativeFactoryDelegate: RCTReactNativeFactoryDelegate?

  override func viewDidLoad() {
    super.viewDidLoad()
+    // 加载视图后执行任何额外的设置。
+    reactNativeFactoryDelegate = ReactNativeDelegate()
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

最后，我们可以呈现我们的 React Native 视图。为此，我们需要一个新的视图控制器，它可以托管一个我们可以加载 JS 内容的视图。
我们已经有了初始的 `ViewController`，我们可以让它呈现 `ReactViewController`。有多种方法可以做到这一点，具体取决于您的应用。对于本示例，我们假设您有一个按钮可以模态呈现 React Native。

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
-  // Do any additional setup after loading the view.
+  // 加载视图后执行任何额外的设置。
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
-    // Do any additional setup after loading the view.
+    // 加载视图后执行任何额外的设置。
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

确保禁用 Sandbox 脚本。要实现这一点，在 Xcode 中，点击您的应用，然后点击构建设置。过滤脚本并将 `User Script Sandboxing` 设置为 `NO`。需要此步骤才能在随 React Native 提供的 [Hermes 引擎](https://github.com/facebook/hermes/blob/main/README.md) 的 Debug 和 Release 版本之间正确切换。

![禁用 Sandboxing](/docs/assets/disable-sandboxing.png)

最后，确保在 `Info.plist` 文件中添加 `UIViewControllerBasedStatusBarAppearance` 键，值为 `NO`。

![禁用 UIViewControllerBasedStatusBarAppearance](/docs/assets/disable-UIViewControllerBasedStatusBarAppearance.png)

## 6. 测试你的集成

你已经完成了将 React Native 集成到应用程序中的所有基本步骤。现在我们将启动 [Metro 打包器](https://metrobundler.dev/) 将你的 TypeScript 应用程序代码构建为一个 bundle。Metro 的 HTTP 服务器将开发者环境上 `localhost` 的 bundle 共享给模拟器或设备。这允许 [热重载](https://reactnative.dev/blog/2016/03/24/introducing-hot-reloading)。

首先，你需要在项目的根目录创建一个 `metro.config.js` 文件，如下所示：

```js
const {getDefaultConfig} = require('@react-native/metro-config');
module.exports = getDefaultConfig(__dirname);
```

你可以查看社区模板文件中的 [metro.config.js 文件](https://github.com/react-native-community/template/blob/0.78-stable/template/metro.config.js) 作为参考。

然后，你需要在项目的根目录创建一个 `.watchmanconfig` 文件。该文件必须包含一个空的 json 对象：

```sh
echo {} > .watchmanconfig
```

一旦配置文件就位，你就可以运行 bundler 了。在项目根目录运行以下命令：

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

现在像往常一样构建并运行你的 iOS 应用。

一旦你进入应用内由 React 驱动的 Activity，它应该会从开发服务器加载 JavaScript 代码并显示：

<center><img src="/docs/assets/EmbeddedAppIOS078.gif" width="300" /></center>

### 在 Xcode 中创建发布构建

你也可以使用 Xcode 来创建发布构建！唯一额外的步骤是添加一个脚本，该脚本在应用构建时执行，将你的 JS 和图片打包到 iOS 应用程序中。

1. 在 Xcode 中，选择你的应用程序
2. 点击 `Build Phases`
3. 点击左上角的 `+` 并选择 `New Run Script Phase`
4. 点击 `Run Script` 行并将脚本重命名为 `Bundle React Native code and images`
5. 在文本框中粘贴以下脚本

```sh title="构建 React Native 代码和图片"
set -e

WITH_ENVIRONMENT="$REACT_NATIVE_PATH/scripts/xcode/with-environment.sh"
REACT_NATIVE_XCODE="$REACT_NATIVE_PATH/scripts/react-native-xcode.sh"

/bin/sh -c "$WITH_ENVIRONMENT $REACT_NATIVE_XCODE"
```

6. 将该脚本拖放到名为 `[CP] Embed Pods Frameworks` 的脚本之前。

现在，如果你为 Release 构建你的应用，它将按预期工作。

### 接下来做什么？

此时你可以像往常一样继续开发你的应用。参考我们的 [调试](debugging) 和 [部署](running-on-device) 文档以了解更多关于使用 React Native 工作的信息。
