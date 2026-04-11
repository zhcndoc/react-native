---
id: linking-libraries-ios
title: 链接库
---

并非每个应用都会使用所有的原生能力，如果包含支持所有这些功能的代码会影响二进制文件的大小……但我们仍然希望在需要时能够添加这些功能。

考虑到这一点，我们将许多这些功能作为独立的静态库暴露出来。

对于大多数库来说，只需拖拽两个文件即可，有时需要第三步，但不会超过这一步。

:::note
我们随 React Native 提供的所有库都位于仓库根目录的 `Libraries` 文件夹中。其中一些是纯 JavaScript 的，你只需要 `require` 它。
其他库也依赖一些原生代码，在这种情况下，你必须将这些文件添加到你的应用中，否则一旦你尝试使用该库，应用就会抛出错误。
:::

## 以下是链接包含原生代码的库的几个步骤

### 自动链接

安装带有原生依赖的库：

```shell
npm install <library-with-native-dependencies> --save
```

:::info
此步骤中 `--save` 或 `--save-dev` 标志非常重要。React Native 将根据 `package.json` 文件中的 `dependencies` 和 `devDependencies` 来链接你的库。
:::

就是这样！下次构建应用时，得益于 [autolinking](https://github.com/react-native-community/cli/blob/main/docs/autolinking.md) 机制，原生代码将被链接。

### 手动链接

#### 步骤 1

如果库包含原生代码，其文件夹内必须有一个 `.xcodeproj` 文件。将此文件拖拽到 Xcode 中的项目里（通常在 Xcode 的 `Libraries` 组下）；

![](/docs/assets/AddToLibraries.png)

#### 步骤 2

点击你的主项目文件（代表 `.xcodeproj` 的那个），选择 `Build Phases`，然后将你正在导入的库内部 `Products` 文件夹中的静态库拖拽到 `Link Binary With Libraries`

![](/docs/assets/AddToBuildPhases.png)

#### 步骤 3

并非每个库都需要这一步，你需要考虑的是：

_我需要在编译时知道库的内容吗？_

这意味着，你是在原生侧使用这个库还是仅在 JavaScript 中使用？如果你仅在 JavaScript 中使用它，那就没问题了！

如果你确实需要从原生侧调用它，那么我们需要知道库的头文件。为此，你必须进入项目文件，选择 `Build Settings` 并搜索 `Header Search Paths`。在那里你应该包含库的路径。（此文档过去建议使用 `recursive`，但不再推荐这样做，因为它可能导致细微的构建失败，尤其是使用 CocoaPods 时。）

![](/docs/assets/AddToSearchPaths.png)
