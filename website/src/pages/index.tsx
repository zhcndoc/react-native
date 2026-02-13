/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import Head from '@docusaurus/Head';
import Layout from '@theme/Layout';

import Home from '../components/Home';

const Index = () => {
  return (
    <Layout
      description="一个使用 React 构建 Android、iOS 等原生应用的框架"
      wrapperClassName="homepage">
      <Head>
        <title>
          React Native 中文文档 - 使用 React 构建 Android、iOS 等原生应用
        </title>
        <meta
          property="og:title"
          content="React Native 中文文档 - 使用 React 构建 Android、iOS 等原生应用"
        />
        <meta
          property="twitter:title"
          content="React Native 中文文档 - 使用 React 构建 Android、iOS 等原生应用"
        />
      </Head>
      <Home />
    </Layout>
  );
};

export default Index;
