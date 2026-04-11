---
id: fabric-native-components-ios
title: 'Fabric 原生组件：iOS'
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

现在是时候编写一些 iOS 平台代码以便能够渲染 web 视图了。你需要遵循的步骤如下：

- 运行 Codegen。
- 编写 `RCTWebView` 的代码
- 在应用程序中注册 `RCTWebView`

### 1. 运行 Codegen

你可以 [手动运行](the-new-architecture/codegen-cli) Codegen，然而更简单的方法是使用你将要演示该组件的应用程序来为你完成此操作。

```bash
cd ios
bundle install
bundle exec pod install
```

重要的是，你将看到来自 Codegen 的日志输出，我们将在 Xcode 中使用它来构建我们的 WebView 原生组件。

:::warning
你应该小心地将生成的代码提交到你的仓库。生成的代码特定于每个版本的 React Native。使用 npm [peerDependencies](https://nodejs.org/en/blog/npm/peer-dependencies) 来限制与 React Native 版本的兼容性。
:::

### 3. 编写 `RCTWebView`

我们需要通过使用 Xcode 完成以下 **5 个步骤** 来准备你的 iOS 项目：

1. 打开 CocoaPods 生成的 Xcode Workspace：

```bash
cd ios
open Demo.xcworkspace
```

<img className="half-size" alt="打开 Xcode Workspace" src="/docs/assets/fabric-native-components/1.webp" />

2. 右键点击 app 并选择 <code>新建组</code>，将新组命名为 `WebView`。

<img className="half-size" alt="右键点击 app 并选择新建组" src="/docs/assets/fabric-native-components/2.webp" />

3. 在 `WebView` 组中，创建 <code>新建</code>→<code>来自模板的文件</code>。

<img className="half-size" alt="使用 Cocoa Touch Class 模板创建新文件" src="/docs/assets/fabric-native-components/3.webp" />

4. 使用 <code>Objective-C 文件</code> 模板，并将其命名为 <code>RCTWebView</code>。

<img className="half-size" alt="创建 Objective-C RCTWebView 类" src="/docs/assets/fabric-native-components/4.webp" />

5. 重复步骤 4 并创建一个名为 `RCTWebView.h` 的头文件。

6. 重命名 <code>RCTWebView.m</code> → <code>RCTWebView.mm</code> 使其成为 Objective-C++ 文件。

```text title="Demo/ios"
Podfile
...
Demo
├── AppDelegate.swift
...
// highlight-start
├── RCTWebView.h
└── RCTWebView.mm
// highlight-end
```

创建头文件和实现文件后，你可以开始实现它们。

这是 `RCTWebView.h` 文件的代码，它声明了组件接口。

```objc title="Demo/RCTWebView/RCTWebView.h"
#import <React/RCTViewComponentView.h>
#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface RCTWebView : RCTViewComponentView

// 你将在此处声明想要从视图访问的原生方法

@end

NS_ASSUME_NONNULL_END
```

此类定义了一个 `RCTWebView`，它扩展了 `RCTViewComponentView` 类。这是所有原生组件的基类，由 React Native 提供。

实现文件 (`RCTWebView.mm`) 的代码如下：

```objc title="Demo/RCTWebView/RCTWebView.mm"
#import "RCTWebView.h"

#import <react/renderer/components/AppSpec/ComponentDescriptors.h>
#import <react/renderer/components/AppSpec/EventEmitters.h>
#import <react/renderer/components/AppSpec/Props.h>
#import <react/renderer/components/AppSpec/RCTComponentViewHelpers.h>
// highlight-next-line
#import <WebKit/WebKit.h>

using namespace facebook::react;

@interface RCTWebView () <RCTCustomWebViewViewProtocol, WKNavigationDelegate>
@end

@implementation RCTWebView {
  NSURL * _sourceURL;
  WKWebView * _webView;
}

-(instancetype)init
{
  if(self = [super init]) {
    // highlight-start
    _webView = [WKWebView new];
    _webView.navigationDelegate = self;
    [self addSubview:_webView];
    // highlight-end
  }
  return self;
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &oldViewProps = *std::static_pointer_cast<CustomWebViewProps const>(_props);
  const auto &newViewProps = *std::static_pointer_cast<CustomWebViewProps const>(props);

  // 在此处处理你的 props
  if (oldViewProps.sourceURL != newViewProps.sourceURL) {
    NSString *urlString = [NSString stringWithCString:newViewProps.sourceURL.c_str() encoding:NSUTF8StringEncoding];
    _sourceURL = [NSURL URLWithString:urlString];
    // highlight-start
    if ([self urlIsValid:newViewProps.sourceURL]) {
      [_webView loadRequest:[NSURLRequest requestWithURL:_sourceURL]];
    }
    // highlight-end
  }

  [super updateProps:props oldProps:oldProps];
}

-(void)layoutSubviews
{
  [super layoutSubviews];
  _webView.frame = self.bounds;

}

#pragma mark - WKNavigationDelegate

// highlight-start
-(void)webView:(WKWebView *)webView didFinishNavigation:(WKNavigation *)navigation
{
  CustomWebViewEventEmitter::OnScriptLoaded result = CustomWebViewEventEmitter::OnScriptLoaded{CustomWebViewEventEmitter::OnScriptLoadedResult::Success};
  self.eventEmitter.onScriptLoaded(result);
}

- (BOOL)urlIsValid:(std::string)propString
{
  if (propString.length() > 0 && !_sourceURL) {
    CustomWebViewEventEmitter::OnScriptLoaded result = CustomWebViewEventEmitter::OnScriptLoaded{CustomWebViewEventEmitter::OnScriptLoadedResult::Error};

    self.eventEmitter.onScriptLoaded(result);
    return NO;
  }
  return YES;
}

// 事件发射器便捷方法
- (const CustomWebViewEventEmitter &)eventEmitter
{
  return static_cast<const CustomWebViewEventEmitter &>(*_eventEmitter);
}
// highlight-end

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<CustomWebViewComponentDescriptor>();
}

@end
```

这段代码是用 Objective-C++ 编写的，包含各种细节：

- `@interface` 实现了两个协议：
  - `RCTCustomWebViewViewProtocol`，由 Codegen 生成；
  - `WKNavigationDelegate`，由 WebKit 框架提供，用于处理 web 视图导航事件；
- `init` 方法，实例化 `WKWebView`，将其添加到子视图并设置 `navigationDelegate`；
- `updateProps` 方法，当组件的 props 更改时由 React Native 调用；
- `layoutSubviews` 方法，描述自定义视图需要如何布局；
- `webView:didFinishNavigation:` 方法，让你处理 `WKWebView` 完成页面加载后的操作；
- `urlIsValid:(std::string)propString` 方法，检查作为 prop 接收的 URL 是否有效；
- `eventEmitter` 方法，这是一个用于检索强类型 `eventEmitter` 实例的工具
- `componentDescriptorProvider`，返回由 Codegen 生成的 `ComponentDescriptor`；

#### 添加 WebKit 框架

:::note
此步骤仅因为我们要创建 Web 视图才需要。iOS 上的 Web 组件需要链接到 Apple 提供的 WebKit 框架。如果你的组件不需要访问 Web 特定功能，你可以跳过此步骤。
:::

Web 视图需要访问 Apple 通过随 Xcode 和设备一起提供的框架之一提供的某些功能：WebKit。
你可以在原生代码中看到它，即在 `RCTWebView.mm` 中添加的 `#import <WebKit/WebKit.h>` 行。

要在你的应用中链接 WebKit 框架，请遵循以下步骤：

1. 在 Xcode 中，点击你的项目
2. 选择 app target
3. 选择 General 标签页
4. 向下滚动直到找到 _"Frameworks, Libraries, and Embedded Contents"_ 部分，然后点击 `+` 按钮

<img className="half-size" alt="将 webkit 框架添加到你的应用 1" src="/docs/assets/AddWebKitFramework1.png" />

5. 在搜索栏中，过滤 WebKit
6. 选择 WebKit 框架
7. 点击 Add。

<img className="half-size" alt="将 webkit 框架添加到你的应用 2" src="/docs/assets/AddWebKitFramework2.png" />
