---
id: linking-libraries-ios
title: 链接库
---

并非每个应用都会使用所有原生功能，而包含支持所有这些功能的代码会影响二进制文件大小……但我们仍然希望能够在你需要时支持添加这些功能

基于这一点，我们将许多此类功能作为独立的静态库提供

对于大多数库来说，只需拖动两个文件即可完成，有时需要第三步，但不会更多

:::note
我们随 React Native 一起发布的所有库都位于仓库根目录下的 `Libraries` 文件夹中。其中一些是纯 JavaScript，你只需要 `require` 它
其他库还依赖一些原生代码，在这种情况下，你必须将这些文件添加到你的应用中，否则应用一旦尝试使用该库就会抛出错误
:::

## 以下是链接包含原生代码的库所需的几个步骤

### 自动链接

安装包含原生依赖的库：

```shell
npm install <library-with-native-dependencies> --save
```

:::info
`--save` 或 `--save-dev` 标志对于此步骤非常重要。React Native 将根据 `package.json` 文件中的 `dependencies` 和 `devDependencies` 链接你的库
:::

就是这样！下次构建应用时，原生代码将通过 [autolinking](https://github.com/react-native-community/cli/blob/main/docs/autolinking.md) 机制完成链接

### 手动链接

#### 第 1 步

如果库包含原生代码，那么其文件夹中必须有一个 `.xcodeproj` 文件。将此文件拖到 Xcode 中的项目中（通常位于 Xcode 的 `Libraries` 组下）；

![](/docs/assets/AddToLibraries.png)

#### 第 2 步

点击你的主项目文件（代表 `.xcodeproj` 的文件），选择 `Build Phases`，然后将你要导入的库中 `Products` 文件夹里的静态库拖到 `Link Binary With Libraries`

![](/docs/assets/AddToBuildPhases.png)

#### 第 3 步

并非每个库都需要此步骤，你需要考虑的是：

_我是否需要在编译时了解该库的内容？_

这意味着，你是在原生端使用这个库，还是只在 JavaScript 中使用？如果你只在 JavaScript 中使用它，那么就可以了！

如果你确实需要从原生端调用它，那么我们需要知道该库的头文件。为此，你必须进入项目文件，选择 `Build Settings`，然后搜索 `Header Search Paths`。在那里，你应该添加库的路径。（本文档过去曾建议使用 `recursive`，但现在不再推荐这样做，因为它可能导致难以察觉的构建失败，尤其是在使用 CocoaPods 时。）

![](/docs/assets/AddToSearchPaths.png)
