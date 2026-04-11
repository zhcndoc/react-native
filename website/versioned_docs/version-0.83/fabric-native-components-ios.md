---
id: fabric-native-components-ios
title: 'Fabric 原生组件：iOS'
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

现在是时候编写一些 iOS 平台代码以渲染 Web 视图了。你需要遵循以下步骤：

- 运行 Codegen。
- 编写 `RCTWebView` 的代码。
- 在程序中注册 `RCTWebView`。

### 1. 运行 Codegen

你可以 [手动运行](the-new-architecture/codegen-cli) Codegen，但更简单的方法是使用你打算演示组件的应用程序来帮你运行。

```bash
cd ios
bundle install
bundle exec pod install
```

重要的是你会看到 Codegen 的日志输出，我们稍后会在 Xcode 中使用它来构建我们的 WebView 原生组件。

:::warning
你在提交生成代码到仓库时需要小心。生成代码是针对每个 React Native 版本特有的。请使用 npm 的 [peerDependencies](https://nodejs.org/en/blog/npm/peer-dependencies) 来限制与 React Native 版本的兼容性。
:::

### 3. 编写 `RCTWebView`

我们需要通过完成以下 **5 个步骤** 使用 Xcode 准备你的 iOS 项目：

1. 打开 CocoaPods 生成的 Xcode Workspace：

```bash
cd ios
open Demo.xcworkspace
```

<img className="half-size" alt="打开 Xcode Workspace" src="/docs/assets/fabric-native-components/1.webp" />

2. 右击 app，然后选择 <code>New Group</code>，将新组命名为 `WebView`。

<img className="half-size" alt="右击 app 并选择 New Group" src="/docs/assets/fabric-native-components/2.webp" />

3. 在 `WebView` 组内，创建 <code>New</code>→<code>File from Template</code>。

<img className="half-size" alt="使用 Cocoa Touch Class 模板创建新文件" src="/docs/assets/fabric-native-components/3.webp" />

4. 选择 <code>Objective-C File</code> 模板，并命名为 <code>RCTWebView</code>。

<img className="half-size" alt="创建 Objective-C RCTWebView 类" src="/docs/assets/fabric-native-components/4.webp" />

5. 重复步骤 4，创建一个名为 `RCTWebView.h` 的头文件。

6. 将 <code>RCTWebView.m</code> 重命名为 <code>RCTWebView.mm</code>，使其成为 Objective-C++ 文件。

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

创建完头文件和实现文件后，即可开始编写实现代码。

下面是 `RCTWebView.h` 文件的代码，声明了组件接口。

```objc title="Demo/RCTWebView/RCTWebView.h"
#import <React/RCTViewComponentView.h>
#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface RCTWebView : RCTViewComponentView

// 这里声明你希望从视图访问的原生方法

@end

NS_ASSUME_NONNULL_END
```

该类定义了一个继承自 `RCTViewComponentView` 的 `RCTWebView`。`RCTViewComponentView` 是所有原生组件的基类，由 React Native 提供。

以下是实现文件 (`RCTWebView.mm`) 的代码：

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

  // 在这里处理你的属性
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

// 事件触发器便捷方法
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

这段代码使用 Objective-C++ 编写，包含多个细节：

- `@interface` 实现了两个协议：
  - 由 Codegen 生成的 `RCTCustomWebViewViewProtocol`；
  - 由 WebKit 框架提供的 `WKNavigationDelegate`，用于处理 WebView 导航事件；
- `init` 方法实例化 `WKWebView`，添加为子视图并设置 `navigationDelegate`；
- `updateProps` 方法由 React Native 在组件属性变化时调用；
- `layoutSubviews` 方法描述自定义视图的布局方式；
- `webView:didFinishNavigation:` 方法处理 `WKWebView` 页面加载完成时的操作；
- `urlIsValid:(std::string)propString` 方法检查传入属性的 URL 是否有效；
- `eventEmitter` 方法用于获取强类型的事件触发器实例；
- `componentDescriptorProvider` 返回由 Codegen 生成的 `ComponentDescriptor`；

#### 添加 WebKit 框架

:::note
这一步只有在我们创建 Web 视图时需要。iOS 上的 Web 组件需要链接 Apple 提供的 WebKit 框架。如果你的组件不需要访问特定 Web 功能，可以跳过此步骤。
:::

Web 视图需要访问 Apple 通过 Xcode 和设备带来的框架之一 —— WebKit。你可以在原生代码中看到引入了 `<WebKit/WebKit.h>`。

要在你的应用中链接 WebKit 框架，请按下列步骤操作：

1. 在 Xcode 中点击你的项目。
2. 选择应用目标（app target）。
3. 选择 General 选项卡。
4. 向下滚动，找到 _"Frameworks, Libraries, and Embedded Contents"_ 区域，然后点击 `+` 按钮。

<img className="half-size" alt="给你的应用添加 WebKit 框架 1" src="/docs/assets/AddWebKitFramework1.png" />

5. 在搜索栏中输入 WebKit 进行筛选。
6. 选择 WebKit 框架。
7. 点击添加。

<img className="half-size" alt="给你的应用添加 WebKit 框架 2" src="/docs/assets/AddWebKitFramework2.png" />