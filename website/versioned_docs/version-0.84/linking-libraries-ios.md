---
id: linking-libraries-ios
title: 关联库
---

并非每个应用都会使用所有的原生功能，包含支持所有这些功能的代码会影响二进制文件的大小……但我们仍然希望在你需要时支持添加这些功能。

考虑到这一点，我们将许多功能作为独立的静态库暴露出来。

对于大多数库，操作起来就像拖拽两个文件一样简单，有时可能还需第三步，但不会超过这个步骤。

:::note
我们随 React Native 一起提供的所有库都存放在仓库根目录的 `Libraries` 文件夹中。其中一些纯粹是 JavaScript，你只需通过 `require` 引入。
其他库还依赖一些原生代码，在这种情况下，你必须将这些文件添加到你的应用中，否则一旦你尝试使用该库，应用就会抛出错误。
:::

## 以下是关联包含原生代码库的几个步骤

### 自动关联

安装带有原生依赖的库：

```shell
npm install <library-with-native-dependencies> --save
```

:::info
`--save` 或 `--save-dev` 标志对这一步非常重要。React Native 会根据你 `package.json` 文件中的 `dependencies` 和 `devDependencies` 来关联你的库。
:::

就这些！下一次构建你的应用时，原生代码将通过 [自动关联](https://github.com/react-native-community/cli/blob/main/docs/autolinking.md) 机制自动链接。

### 手动关联

#### 第一步

如果库包含原生代码，其文件夹内必须有一个 `.xcodeproj` 文件。将此文件拖入你的 Xcode 项目中（通常放在 Xcode 的 `Libraries` 组下）；

![](/docs/assets/AddToLibraries.png)

#### 第二步

点击你的主项目文件（即 `.xcodeproj` 文件所在的），选择 `Build Phases`，然后将你导入库中的静态库（位于 `Products` 文件夹内）拖入 `Link Binary With Libraries`

![](/docs/assets/AddToBuildPhases.png)

#### 第三步

不是每个库都需要这一步，你需要考虑的是：

_我是否需要在编译时知道库的内容？_

这意味着，你是仅在 JavaScript 端使用该库，还是也在原生端调用？如果仅在 JavaScript 端使用，那就无需多虑！

如果你确实需要从原生端调用，那么我们必须知道该库的头文件。为此，你需要进入你的项目文件，选择 `Build Settings` 并搜索 `Header Search Paths`。在那里你应该包含你的库所在的路径。（此文档之前建议使用递归搜索，但现在不推荐这样做，因为它可能导致细微的构建失败，尤其是使用 CocoaPods 时。）

![](/docs/assets/AddToSearchPaths.png)