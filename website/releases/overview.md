---
title: 发布版本概览
sidebar_label: 概览
---

import ReleasesTable from '@site/src/components/releases/ReleasesTable';

## 发布计划

以下是近期和即将发布的 React Native 版本的发布计划及当前状态：

<div className="releases-schedule-table">
  <ReleasesTable />
</div>

### 对稳定性的承诺

为了支持用户升级 React Native 版本，我们承诺维护**最新的 3 个次要版本系列**（例如，当 0.78 是最新版本时，维护 0.78.x、0.77.x 和 0.76.x）。

对于这些版本，我们将定期发布更新和错误修复。

你可以在 [react-native-releases 工作组](https://github.com/reactwg/react-native-releases/blob/main/docs/support.md)中详细了解我们的支持政策。

如需了解有关版本控制以及我们认定的破坏性变更的更多信息，请参阅我们的[版本控制政策](/releases/versioning-policy)。

### 支持级别定义

表格中所示的不同支持级别定义如下：

- **未来版本**
  - 新版本分支创建后，创建新的候选发布版本（Release Candidate），让社区能够测试即将发布的版本非常重要。新的 RC 版本会在可行后尽快以较高频率发布。
- **积极支持**
  - 处于积极支持阶段的稳定版本会频繁获得更新。最新的稳定版本拥有最高优先级；在其稳定周期开始时（即 .0 版本发布后），我们会尽快发布多个补丁，以稳定版本并确保社区获得良好的升级体验。
- **周期末期**
  - 处于此支持阶段的版本将获得较少的补丁，除非需要修复某些重要的回归问题。一旦下一个版本成为新的最新稳定版本，在处于周期末期（EoC）的版本转为不受支持之前，我们会再发布一个补丁，其中包含最新收到的挑选请求。
- **不受支持**
  - 当一个版本处于不受支持阶段时，预计不会再有新的发布版本。只有非常重要的回归问题可能会例外；建议使用不受支持版本的代码库尽快升级。

## 发布渠道

React Native 发布到 [npm](https://www.npmjs.com/package/react-native) 时使用三个发布渠道，每个渠道由 npm [dist-tag](https://docs.npmjs.com/cli/v10/commands/npm-dist-tag) 标识。它们在稳定性和你接收新变更的及时性之间进行权衡。

| 渠道      | 安装                   | 稳定性          | 适用场景                   |
| --------- | ---------------------- | --------------- | -------------------------- |
| `latest`  | `react-native@latest`  | 稳定            | 生产应用                   |
| `next`    | `react-native@next`    | ⚠️ 发布候选版本 | 测试即将发布的版本         |
| `nightly` | `react-native@nightly` | ⚠️ 不稳定       | 跟踪 `main` 以尽早提供反馈 |

:::note

**发布候选版本和 nightly 版本不适用于生产环境。** 本节内容与从事框架、库或开发者工具开发的开发者最为相关。主要使用 React Native 构建面向用户的应用的开发者通常无需关注 `latest` 以外的发布渠道。

:::

- **发布候选版本**
  - 每个稳定版本发布前都会以 `next` 标签发布，从 `rc.0` 开始（版本格式类似于 `0.79.0-rc.0`）。
- **Nightly 版本**
  - 每天从 [`react/react-native`](https://github.com/react/react-native) 的 `main` 分支发布，版本格式类似于 `0.80.0-nightly-<DATE>-<SHA>`（`<DATE>` 是构建日期，`<SHA>` 是源代码提交记录）。
