---
title: '为 React Native 构建 <InputAccessoryView>'
author: Peter Argany
authorTitle: Facebook 软件工程师
authorURL: 'https://github.com/PeteTheHeat'
authorImageURL: 'https://avatars3.githubusercontent.com/u/6011080?s=400&u=028e28081107d0ab16a5cb22baca43c080f5fa50&v=4'
authorTwitter: peterargany
tags: [engineering]
---

## 动机

三年前，有人在 GitHub 上提出了一个 issue，要求 React Native 支持输入辅助视图（input accessory view）。

<img src="/blog/assets/input-accessory-1.png" />

在随后的几年中，这个 issue 收到了无数的“+1”、各种解决方案，但 React Native 本身却没有做出任何实质性的改变——直到今天。我们从 iOS 开始，新提供了一个用于访问原生输入辅助视图的 API（[详细文档](/docs/inputaccessoryview)），并且很兴奋与大家分享我们的构建过程。

## 背景

输入辅助视图到底是什么？根据 [Apple 的开发文档](https://developer.apple.com/documentation/uikit/uiresponder/1621119-inputaccessoryview?language=objc)，它是一个自定义视图，当一个响应者（receiver）成为第一响应者时，可以锚定在系统键盘的顶部。任何继承自 `UIResponder` 的对象都可以重新声明 `.inputAccessoryView` 属性为可读写，并管理这里的自定义视图。响应者架构负责挂载该视图，并保持其与系统键盘的同步。像拖拽或点击这些会关闭键盘的手势，会在框架层级应用到输入辅助视图上。这使我们可以构建具有交互式键盘关闭功能的内容，这是顶级消息应用（如 iMessage 和 WhatsApp）中的一个重要特性。

在键盘顶部锚定视图有两个常见应用场景。第一个是创建键盘工具栏，比如 Facebook 创作器中的背景选择器。

<img src="/blog/assets/input-accessory-2.gif" style={{float: 'left', paddingRight: 70, paddingTop: 20}} />

在此场景中，键盘聚焦于一个文本输入框，输入辅助视图用于提供额外的键盘功能。该功能与输入框的类型相关。在地图应用中，可能是地址建议；在文本编辑器中，可能是富文本格式化工具。

<hr style={{clear: 'both', marginBottom: 20}} />

拥有 `<InputAccessoryView>` 的 Objective-C UIResponder 应该很明确。`<TextInput>` 变成了第一响应者，其底层实际上是一个 `UITextView` 或 `UITextField` 实例。

第二个常见场景是“粘性”文本输入框：

<img src="/blog/assets/input-accessory-3.gif" style={{float: 'left', paddingRight: 70, paddingTop: 20}} />

这里，文本输入框实际上是输入辅助视图本身的子视图。这在消息应用中很常见，用户可以在滚动浏览之前的消息线程时撰写消息。

<hr style={{clear: 'both', marginBottom: 20}} />

在这个例子中，谁拥有 `<InputAccessoryView>`？还能是 `UITextView` 或 `UITextField` 吗？文本输入框 _位于_ 输入辅助视图内部，这听起来像是循环依赖。单独解决这个问题就足够写成一篇 [博客文章](https://derpturkey.com/uitextfield-docked-like-ios-messenger/)。剧透一句：拥有者是一个通用的 `UIView` 子类，我们手动让它 [becomeFirstResponder](https://developer.apple.com/documentation/uikit/uiresponder/1621113-becomefirstresponder?language=objc)。

## API 设计

我们现在知道 `<InputAccessoryView>` 是什么，也知道它的使用方式。下一步是设计一个既符合这两个用例，又能很好地与现有 React Native 组件（如 `<TextInput>`）配合使用的 API。

对于键盘工具栏，我们需要考虑以下几点：

1. 我们希望能够将任何通用的 React Native 视图层级“提升”至 `<InputAccessoryView>` 中。
2. 我们希望这个通用且独立的视图层级能接受触摸事件，并能操作应用状态。
3. 我们希望能将一个 `<InputAccessoryView>` 关联到特定的 `<TextInput>`。
4. 我们希望能在多个文本输入框之间共享一个 `<InputAccessoryView>`，而无需复制任何代码。

我们可以用类似 [React 门户（portals）](https://reactjs.org/docs/portals.html) 的概念来实现第 1 点。在此设计中，我们将 React Native 视图“门户”到一个由响应者架构管理的 `UIView` 层级。因为 React Native 视图本质上是 UIViews，所以做起来相当简单——我们只需要重写：

`- (void)insertReactSubview:(UIView *)subview atIndex:(NSInteger)atIndex`

将所有子视图导入一个新的 UIView 层级即可。第 2 点上，我们为 `<InputAccessoryView>` 设置了一个新的 [RCTTouchHandler](https://github.com/facebook/react-native/blob/master/React/Base/RCTTouchHandler.h)。状态更新通过常规事件回调完成。第 3 和第 4 点，我们通过 [nativeID](https://github.com/facebook/react-native/blob/master/React/Views/UIView%2BReact.h#L28) 字段，在创建 `<TextInput>` 组件时，通过原生代码定位辅助视图的 UIView 层级。相关函数使用了底层的原生文本输入的 `.inputAccessoryView` 属性，从而实现了在 ObjC 层面的 `<InputAccessoryView>` 与 `<TextInput>` 关联。

支持粘性文本输入（场景 2）则有更多约束。因为该设计中，输入辅助视图有一个文本输入作为子视图，无法通过 nativeID 关联。相反，我们将一个通用的、位于屏幕外的 `UIView` 的 `.inputAccessoryView` 设置为我们的原生 `<InputAccessoryView>` 层级，通过手动让这个通用 `UIView` 变成第一响应者，响应者架构将会挂载该层级。这个概念在前文提到的博客文章中有详细解释。

## 陷阱

当然，构建这个 API 并非一帆风顺。以下是我们遇到的一些坑及其解决方案。

最初搭建这个 API 的想法是监听 `NSNotificationCenter` 的 UIKeyboardWill(Show/Hide/ChangeFrame) 事件。这种模式在一些开源库和 Facebook App 的部分内部代码中都有使用。不幸的是，`UIKeyboardDidChangeFrame` 事件在手势滑动时无法及时调用以更新 `<InputAccessoryView>` 的 frame。此外，键盘高度的变化也未被这些事件捕获。这就导致了如图所示的那类界面异常：

<img src="/blog/assets/input-accessory-4.gif" style={{float: 'left', paddingRight: 70, paddingTop: 20}} />

对于 iPhone X，文本键盘和表情键盘高度不同。大多数依靠键盘事件来调整文本输入框的应用都必须修复上述 bug。我们的解决方案是改用 `.inputAccessoryView` 属性，这样响应者架构会处理 frame 的更新。

<hr style={{clear: 'both', marginBottom: 20}} />

另一个棘手的 bug 是避免遮挡 iPhone X 的 Home Pill（底部指示条）。你可能会想，“Apple 为此专门开发了 [safeAreaLayoutGuide](https://developer.apple.com/documentation/uikit/uiview/2891102-safearealayoutguide?language=objc)，这不简单吗？”。我们也曾天真这样想。第一个问题是，原生 `<InputAccessoryView>` 实现直到即将显示时才有 window 可供锚定。没关系，我们可以重写 `-(BOOL)becomeFirstResponder` 方法，在那里强制执行布局约束。遵循这些约束会将输入辅助视图上移，但出现了另一个 bug：<img src="/blog/assets/input-accessory-5.gif" style={{float: 'left', paddingRight: 70, paddingTop: 20}} />

输入辅助视图成功避开了 Home Pill，但不安全区域背后的内容会显示出来。解决方案见这个 [Radar](https://www.openradar.me/34411433)。我用一个不遵守 `safeAreaLayoutGuide` 约束的容器包裹了原生 `<InputAccessoryView>` 层级。原生容器覆盖了不安全区域的内容，而 `<InputAccessoryView>` 保持在安全区边界以内。

<hr style={{clear: 'both', marginBottom: 20}} />

## 使用示例

下面是一个构建键盘工具栏按钮以重置 `<TextInput>` 状态的示例。

```jsx
class TextInputAccessoryViewExample extends React.Component<
  {},
  *,
> {
  constructor(props) {
    super(props);
    this.state = {text: 'Placeholder Text'};
  }

  render() {
    const inputAccessoryViewID = 'inputAccessoryView1';
    return (
      <View>
        <TextInput
          style={styles.default}
          inputAccessoryViewID={inputAccessoryViewID}
          onChangeText={text => this.setState({text})}
          value={this.state.text}
        />
        <InputAccessoryView nativeID={inputAccessoryViewID}>
          <View style={{backgroundColor: 'white'}}>
            <Button
              onPress={() =>
                this.setState({text: 'Placeholder Text'})
              }
              title="Reset Text"
            />
          </View>
        </InputAccessoryView>
      </View>
    );
  }
}
```

另一个关于 [粘性文本输入的示例可以在仓库中找到](https://github.com/facebook/react-native/blob/84ef7bc372ad870127b3e1fb8c13399fe09ecd4d/RNTester/js/InputAccessoryViewExample.js)。

## 什么时候可以使用？

该功能的完整提交记录在 [这里](https://github.com/facebook/react-native/commit/38197c8230657d567170cdaf8ff4bbb4aee732b8)。[`<InputAccessoryView>`](/docs/next/inputaccessoryview) 将在即将发布的 v0.55.0 版本中提供。

祝你输入顺畅 :)