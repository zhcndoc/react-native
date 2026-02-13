---
title: 可访问性 API 更新
author: 陈子琪
authorTitle: 加州大学伯克利分校学生
authorURL: 'https://ziqichen.com/'
authorImageURL: 'https://avatars2.githubusercontent.com/u/13990087?s=400&u=5841da1b6064341d52ecab70a586b6701d9f6978&v=4'
tags: [工程]
---

## 动机

随着技术的进步和移动应用在日常生活中的重要性日益增加，创建可访问应用的必要性也同样变得更加重要。

React Native 限制较多的可访问性 API 一直是开发者的痛点，因此我们对可访问性 API 进行了一些更新，以便更容易创建包容性的移动应用。

## 现有 API 存在的问题

### 问题一：两个完全不同但又相似的属性——accessibilityComponentType（Android）和 accessibilityTraits（iOS）

`accessibilityComponentType` 和 `accessibilityTraits` 是两个用来告知 Android 上的 TalkBack 和 iOS 上的 VoiceOver 用户正在交互的 UI 元素类型的属性。这两个属性存在的最大问题是：

1. **它们是两个不同的属性，使用方法不同，但目的相同。** 在旧 API 中，这两个属性是分开的（分别针对不同平台），这不仅不方便，也令许多开发者困惑。iOS 上的 `accessibilityTraits` 允许 17 个不同的取值，而 Android 上的 `accessibilityComponentType` 只允许 4 个取值。更重要的是，这两个属性大部分取值之间没有重叠。甚至这两个属性的输入类型也不同。`accessibilityTraits` 允许传入数组或单个特征，而 `accessibilityComponentType` 只允许传入单个值。
2. **Android 上功能非常有限。** 使用旧属性时，TalkBack 只能识别 “button”、“radiobutton_checked” 和 “radiobutton_unchecked” 这几种 UI 元素。

### 问题二：缺乏可访问性提示（Accessibility Hints）

可访问性提示帮助使用 TalkBack 或 VoiceOver 的用户理解在交互某个无障碍元素时会发生什么，这些信息无法仅通过无障碍标签传达。这些提示可以在设置面板中开启或关闭。而之前 React Native 的 API 完全不支持可访问性提示。

### 问题三：忽视了反转颜色设置

一些视力障碍用户在手机上使用反转颜色以提升屏幕对比度。苹果为 iOS 提供了一个 API，允许开发者忽略特定视图上的反转颜色设置，这样图像和视频使用反转颜色时不会失真。React Native 目前尚不支持该 API。

## 新 API 设计

### 解决方案一：合并 accessibilityComponentType（Android）和 accessibilityTraits（iOS）

为了解决 `accessibilityComponentType` 和 `accessibilityTraits` 之间的混淆，我们决定将它们合并为一个属性。这是合理的，因为两者技术上功能相同，合并后开发者无需再担心平台差异细节即可构建无障碍功能。

**背景**

在 iOS 中，`UIAccessibilityTraits` 是一个可以设置在任何 NSObject 上的属性。javascript 端传入的 17 个特征值分别映射到 Objective-C 中的 `UIAccessibilityTraits` 元素。每个特征用一个长整型表示，所有设置的特征会使用按位或（OR）运算合并。

而在 Android 上，`AccessibilityComponentType` 是 React Native 提出的概念，并不直接映射到 Android 的任何属性。Android 通过无障碍代理（accessibility delegate）处理无障碍，每个视图默认有一个无障碍代理。若需定制无障碍行为，开发者必须创建新的无障碍代理，重写特定方法，并将该视图的无障碍代理替换成新代理。当开发者设置 `AccessibilityComponentType` 时，原生代码会基于传入的组件创建一个新的无障碍代理，并设为该视图的代理。

**所做的更改**

我们希望新属性能成为两个现有属性的超集。我们决定让新属性主要参考已有的 `accessibilityTraits`，因为 `accessibilityTraits` 有更多取值。Android 方面的特征功能则通过修改无障碍代理进行 polyfill。

iOS 上的 `accessibilityTraits` 有 17 个取值，但我们没把所有都包含进新属性，因为部分特征的使用效果未知且很少用到。

这些特征一般有两种用途：描述 UI 元素的角色，或描述其状态。观察既有用法后，大多组合了一个角色值和“state selected”或“state disabled”，或两者皆有。于是，我们决定创建两个新属性：`accessibilityRole` 和 `accessibilityState`。

**`accessibilityRole`**

新属性 `accessibilityRole` 用于告知 TalkBack 或 VoiceOver UI 元素扮演的角色。它可取以下值之一：

- `none`
- `button`
- `link`
- `search`
- `image`
- `keyboardkey`
- `text`
- `adjustable`
- `header`
- `summary`
- `imagebutton`

该属性只允许传入一个值，因为 UI 元素通常不会同时扮演多个角色。例外是图像和按钮，故新增合成角色 `imagebutton`。

**`accessibilityStates`**

新属性 `accessibilityStates` 用于告知 TalkBack 或 VoiceOver UI 元素当前的状态。它接受包含以下一个或两个值的数组：

- `selected`
- `disabled`

### 解决方案二：添加可访问性提示（Accessibility Hints）

为此，我们新增了 `accessibilityHint` 属性。设置该属性后，TalkBack 或 VoiceOver 会朗读提示信息。

**`accessibilityHint`**

该属性接受一个字符串形式的可访问性提示。

iOS 上，设置该属性会将对应的原生属性 AccessibilityHint 赋值给视图。若 iPhone 里开启了可访问性提示，VoiceOver 会朗读该提示。

Android 上，设置该属性则会将提示值附加到可访问标签后面。此实现方式优点是模拟了 iOS 上提示的行为，但缺点是在 Android 设置中无法像 iOS 那样关闭提示。

我们在 Android 这样设计的原因是，提示通常对应特定操作（例如点击），我们希望平台间行为一致。

### 解决方案三

**`accessibilityIgnoresInvertColors`**

我们将苹果的 `AccessibilityIgnoresInvertColors` API 暴露给 JavaScript，现在当你不希望某个视图颜色被反转（比如图片）时，可以将这个属性设为 true，其颜色就不会被反转。

## 新用法

这些新属性将在 React Native 0.57 版本中可用。

### 升级指南

如果你目前使用 `accessibilityComponentType` 和 `accessibilityTraits`，可以按以下步骤升级到新属性。

#### 1. 使用 jscodeshift

最简单的用例可以通过运行 jscodeshift 脚本替换。

这个 [脚本](https://gist.github.com/ziqichen6/246e5778617224d2b4aff198dab0305d) 会替换以下示例：

```
accessibilityTraits=“trait”
accessibilityTraits={[“trait”]}
```

为

```
accessibilityRole=“trait”
```

此脚本还会删除 `AccessibilityComponentType` 的实例（假设你设置 `AccessibilityComponentType` 时也会设置 `AccessibilityTraits`）。

#### 2. 手动重构

对于没有对应 `AccessibilityRole` 值的 `AccessibilityTraits` 用法，以及传入多个特征的用法，则需手动重构。

通常，

```tsx
accessibilityTraits= {[“button”, “selected”]}
```

手动改为

```tsx
accessibilityRole=“button”
accessibilityStates={[“selected”]}
```

这些属性已经在 Facebook 的代码库中使用。Facebook 的重构过程非常简单，jscodeshift 脚本解决了半数实例，其余的手动调整，整个过程耗时甚至不到几小时。

希望你会觉得更新后的 API 很有用！请大家继续努力让应用更具可访问性！#包容性