---
id: linking-libraries-ios
title: 连接库
---

并非每个应用都会使用所有原生能力，而包含支持这些功能的代码会影响二进制文件大小……但我们仍然希望在你需要时能够添加这些功能。

基于这一点，我们将其中许多功能作为独立的静态库暴露出来。

对于大多数库来说，这就像拖拽两个文件一样简单，有时还需要第三步，但不会更多了。

:::note
我们随 React Native 一起发布的所有库都位于仓库根目录下的 `Libraries` 文件夹中。其中一些是纯 JavaScript，你只需要 `require` 它们。
其他库还依赖一些原生代码，在这种情况下，你必须将这些文件添加到你的应用中，否则一旦你尝试使用该库，应用就会立刻报错。
:::

## 以下是连接包含原生代码的库所需的几个步骤

### 自动链接

安装一个带有原生依赖的库：

```shell
npm install <library-with-native-dependencies> --save
```

:::info
`--save` 或 `--save-dev` 标志在这一步非常重要。React Native 会根据你 `package.json` 文件中的 `dependencies` 和 `devDependencies` 来链接你的库。
:::

就这样！下次你构建应用时，借助 [autolinking](https://github.com/react-native-community/cli/blob/main/docs/autolinking.md) 机制，原生代码就会被自动链接。

### 手动链接

#### 第 1 步

如果该库有原生代码，那么它的文件夹中必须有一个 `.xcodeproj` 文件。将这个文件拖到 Xcode 中你的项目里（通常位于 Xcode 的 `Libraries` 分组下）；

![](/docs/assets/AddToLibraries.png)

#### 第 2 步

点击你的主项目文件（即表示 `.xcodeproj` 的那个文件），选择 `Build Phases`，然后将你导入的库中 `Products` 文件夹里的静态库拖到 `Link Binary With Libraries`

![](/docs/assets/AddToBuildPhases.png)

#### 第 3 步

并非每个库都需要这一步，你需要考虑的是：

_我是否需要在编译时知道这个库的内容？_

这意味着，你是在原生端使用这个库，还是只在 JavaScript 中使用？如果你只在 JavaScript 中使用，那就没问题！

如果你确实需要从原生代码中调用它，那么我们就需要知道这个库的头文件。为此，你需要打开项目文件，选择 `Build Settings`，并搜索 `Header Search Paths`。在那里你应该添加该库的路径。（这份文档过去曾建议使用 `recursive`，但现在不再推荐，因为它可能导致一些隐蔽的构建失败，尤其是在 CocoaPods 中。）

![](/docs/assets/AddToSearchPaths.png)
