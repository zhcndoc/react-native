---
id: integration-with-existing-apps
title: 与现有应用集成
hide_table_of_contents: true
---

import Tabs from '@theme/Tabs'; import TabItem from '@theme/TabItem';

import IntegrationApple from './\_integration-with-existing-apps-ios.md'; import
IntegrationKotlin from './\_integration-with-existing-apps-kotlin.md';

当你从头开始开发新的移动应用时，React Native 非常出色。然而，它也非常适用于向现有的原生应用程序添加单个视图或用户流程。只需几步，你就可以添加基于 React Native 的新功能、屏幕、视图等。

具体步骤取决于你目标平台的不同。

<Tabs groupId="language" queryString defaultValue="kotlin" values={[ {label: 'Android (Java 和 Kotlin)', value: 'kotlin'}, {label: 'iOS (Objective-C 和 Swift)', value: 'apple'}, ]}>

<TabItem value="kotlin">

<IntegrationKotlin />

</TabItem>
<TabItem value="apple">

<IntegrationApple />

</TabItem>
</Tabs>
