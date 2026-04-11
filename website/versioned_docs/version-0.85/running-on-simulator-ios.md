---
id: running-on-simulator-ios
title: 在模拟器上运行
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem'; import constants from '@site/core/TabsConstants';

## 启动模拟器

一旦初始化了 React Native 项目，你可以在新创建的项目目录内运行以下命令。

<Tabs groupId="package-manager" queryString defaultValue={constants.defaultPackageManager} values={constants.packageManagers}>
<TabItem value="npm">

```shell
npm run ios
```

</TabItem>
<TabItem value="yarn">

```shell
yarn ios
```

</TabItem>
</Tabs>

如果一切设置正确，你应该很快就能看到新应用在 iOS 模拟器中运行。

## 指定设备

你可以使用 `--simulator` 标志指定模拟器应运行的设备，后跟作为字符串的设备名称。默认值是 `"iPhone 14"`。如果你希望在 iPhone SE（第 3 代）上运行应用，请运行以下命令：

<Tabs groupId="package-manager" queryString defaultValue={constants.defaultPackageManager} values={constants.packageManagers}>
<TabItem value="npm">

```shell
npm run ios -- --simulator="iPhone SE (3rd generation)"
```

</TabItem>
<TabItem value="yarn">

```shell
yarn ios --simulator "iPhone SE (3rd generation)"
```

</TabItem>
</Tabs>

设备名称对应于 Xcode 中可用设备列表。你可以通过在控制台运行 `xcrun simctl list devices` 来检查可用设备。

### 指定设备版本

如果你安装了多个 iOS 版本，还需要指定相应的版本。例如，要在 iPhone 14 Pro (16.0) 上运行应用，请运行以下命令：

<Tabs groupId="package-manager" queryString defaultValue={constants.defaultPackageManager} values={constants.packageManagers}>
<TabItem value="npm">

```shell
npm run ios -- --simulator="iPhone 14 Pro (16.0)"
```

</TabItem>
<TabItem value="yarn">

```shell
yarn ios --simulator "iPhone 14 Pro (16.0)"
```

</TabItem>
</Tabs>

## 指定 UDID

你可以指定 `xcrun simctl list devices` 命令返回的设备 UDID。例如，要使用 UDID `AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA` 运行应用，请运行以下命令：

<Tabs groupId="package-manager" queryString defaultValue={constants.defaultPackageManager} values={constants.packageManagers}>
<TabItem value="npm">

```shell
npm run ios -- --udid="AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA"
```

</TabItem>
<TabItem value="yarn">

```shell
yarn ios --udid "AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA"
```

</TabItem>
</Tabs>
