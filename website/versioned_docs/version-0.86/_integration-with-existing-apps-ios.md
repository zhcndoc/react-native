import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ThemedImage from '@theme/ThemedImage';
import constants from '@site/core/TabsConstants';
import CodeBlock from '@theme/CodeBlock';
import RNTemplateRepoLink from '@site/core/RNTemplateRepoLink';
import {getTemplateBranchNameForCurrentVersion} from '@site/src/getTemplateBranchNameForCurrentVersion';

## Key Concepts

The keys to integrating React Native components into your iOS application are to:

1. Set up the correct directory structure.
2. Install the necessary NPM dependencies.
3. Adding React Native to your Podfile configuration.
4. Writing the TypeScript code for your first React Native screen.
5. Integrate React Native with your iOS code using a `RCTRootView`.
6. Testing your integration by running the bundler and seeing your app in action.

## Using the Community Template

While you follow this guide, we suggest you to use the [React Native Community Template](https://github.com/react-native-community/template/) as reference. The template contains a **minimal iOS app** and will help you understanding how to integrate React Native into an existing iOS app.

## Prerequisites

Follow the guide on [setting up your development environment](set-up-your-environment) and using [React Native without a framework](getting-started-without-a-framework) to configure your development environment for building React Native apps for iOS.
This guide also assumes you're familiar with the basics of iOS development such as creating a `UIViewController` and editing the `Podfile` file.

### 1. Set up directory structure

To ensure a smooth experience, create a new folder for your integrated React Native project, then **move your existing iOS project** to the `/ios` subfolder.

## 2. Install NPM dependencies

Go to the root directory and run the following command:

<CodeBlock language="bash" title="shell">
{`curl -O https://raw.githubusercontent.com/react-native-community/template/refs/heads/${getTemplateBranchNameForCurrentVersion()}/template/package.json`}
</CodeBlock>

This will copy the `package.json` <RNTemplateRepoLink href="template/package.json">file from the Community template</RNTemplateRepoLink> to your project.

Next, install the NPM packages by running:

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

Installation process has created a new `node_modules` folder. This folder stores all the JavaScript dependencies required to build your project.

Add `node_modules/` to your `.gitignore` file (here the <RNTemplateRepoLink href="template/_gitignore">Community default one</RNTemplateRepoLink>).

### 3. Install Development tools

### Command Line Tools for Xcode

Install the Command Line Tools. Choose **Settings... (or Preferences...)** in the Xcode menu. Go to the Locations panel and install the tools by selecting the most recent version in the Command Line Tools dropdown.

<ThemedImage
alt="Xcode Command Line Tools configuration"
sources={{
    light: '/docs/assets/GettingStartedXcodeCommandLineTools.png',
    dark: '/docs/assets/GettingStartedXcodeCommandLineToolsDark.png',
  }}
/>

### CocoaPods

[CocoaPods](https://cocoapods.org) is a package management tool for iOS and macOS development. We use it to add the actual React Native framework code locally into your current project.

We recommend installing CocoaPods using [Homebrew](https://brew.sh/):

```shell
brew install cocoapods
```

## 4. Adding React Native to your app

### Configuring CocoaPods

To configure CocoaPods, we need two files:

- A **Gemfile** that defines which Ruby dependencies we need.
- A **Podfile** that defines how to properly install our dependencies.

For the **Gemfile**, go to the root directory of your project and run this command

<CodeBlock language="bash" title="shell">
{`curl -O https://raw.githubusercontent.com/react-native-community/template/refs/heads/${getTemplateBranchNameForCurrentVersion()}/template/Gemfile`}
</CodeBlock>

This will download the Gemfile from the template.

:::note
If you created your project with Xcode 16, you need to update the Gemfile as it follows:

```diff
-gem 'cocoapods', '>= 1.13', '!= 1.15.0', '!= 1.15.1'
+gem 'cocoapods', '1.16.2'
gem 'activesupport', '>= 6.1.7.5', '!= 7.1.0'
-gem 'xcodeproj', '< 1.26.0'
+gem 'xcodeproj', '1.27.0'
```

Xcode 16 generates a project in a slightly different ways from previous versions of Xcode, and you need the latest CocoaPods and Xcodeproj gems to make it work properly.
:::

Similarly, for the **Podfile**, go to the `ios` folder of your project and run

<CodeBlock language="bash" title="shell">
{`curl -O https://raw.githubusercontent.com/react-native-community/template/refs/heads/${getTemplateBranchNameForCurrentVersion()}/template/ios/Podfile`}
</CodeBlock>

Please use the Community Template as a reference point for the <RNTemplateRepoLink href="template/Gemfile">Gemfile</RNTemplateRepoLink> and for the <RNTemplateRepoLink href="template/ios/Podfile">Podfile</RNTemplateRepoLink>.

:::note
Remember to change <RNTemplateRepoLink href="template/ios/Podfile#L17">this line</RNTemplateRepoLink>.
:::

Now, we need to run a couple of extra commands to install the Ruby gems and the Pods.
Navigate to the `ios` folder and run the following commands:

```sh
bundle install
bundle exec pod install
```

The first command will install the Ruby dependencies and the second command will actually integrate the React Native code in your application so that your iOS files can import the React Native headers.

## 5. Writing the TypeScript Code

Now we will actually modify the native iOS application to integrate React Native.

The first bit of code we will write is the actual React Native code for the new screen that will be integrated into our application.

### Create a `index.js` file

First, create an empty `index.js` file in the root of your React Native project.

`index.js` is the starting point for React Native applications, and it is always required. It can be a small file that `import`s other file that are part of your React Native component or application, or it can contain all the code that is needed for it.

Our `index.js` should look as follows (here the <RNTemplateRepoLink href="template/index.js">Community template file as reference</RNTemplateRepoLink>):

```js
import {AppRegistry} from 'react-native';
import App from './App';

AppRegistry.registerComponent('HelloWorld', () => App);
```

### Create a `App.tsx` file

Let's create an `App.tsx` file. This is a [TypeScript](https://www.typescriptlang.org/) file that can have [JSX](<https://en.wikipedia.org/wiki/JSX_(JavaScript)>) expressions. It contains the root React Native component that we will integrate into our iOS application (<RNTemplateRepoLink href="template/App.tsx">link</RNTemplateRepoLink>):

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

Here is the <RNTemplateRepoLink href="template/App.tsx">Community template file as reference</RNTemplateRepoLink>.

## 5. Integrating with your iOS code

We now need to add some native code in order to start the React Native runtime and tell it to render our React components.

### Requirements

React Native initialization is now unbound to any specific part of an iOS app.

React Native can be initialized using a class called `RCTReactNativeFactory`, that takes care of handling the React Native lifecycle for you.

Once the class is initialized, you can either start a React Native view providing a `UIWindow` object, or you can ask for the factory to generate a `UIView` that you can load in any `UIViewController.`

In the following example, we will create a ViewController that can load a React Native view as it's `view`.

#### Create the ReactViewController

Create a new file from template (<kbd>⌘</kbd>+<kbd>N</kbd>) and choose the Cocoa Touch Class template.

Make sure to select `UIViewController` as the "Subclass of" field.

<Tabs groupId="ios-language" queryString defaultValue={constants.defaultAppleLanguage} values={constants.appleLanguages}>
<TabItem value="objc">

Now open the `ReactViewController.m` file and apply the following changes

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

Now open the `ReactViewController.swift` file and apply the following changes

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

#### Presenting a React Native view in a rootViewController

Finally, we can present our React Native view. To do so, we need a new View Controller that can host a view in which we can load the JS content.
We already have the initial `ViewController`, and we can make it present the `ReactViewController`. There are several ways to do so, depending on your app. For this example, we assume that you have a button that presents React Native modally.

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

Make sure to disable the Sandbox scripting. To achieve this, in Xcode, click on your app, then on build settings. Filter for script and set the `User Script Sandboxing` to `NO`. This step is needed to properly switch between the Debug and Release version of the [Hermes engine](https://github.com/facebook/hermes/blob/main/README.md) that we ship with React Native.

![Disable Sandboxing](/docs/assets/disable-sandboxing.png)

Finally, make sure to add the `UIViewControllerBasedStatusBarAppearance` key into your `Info.plist` file, with value of `NO`.

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
