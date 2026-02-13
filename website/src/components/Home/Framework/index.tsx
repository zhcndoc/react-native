/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import useBaseUrl from '@docusaurus/useBaseUrl';
import ThemedImage from '@theme/ThemedImage';

import Section from '../Section';
import SectionTitle from '../SectionTitle';

import styles from './styles.module.css';

function Framework() {
  return (
    <Section>
      <SectionTitle
        title="使用框架快速入门"
        description={
          <>
            React Native 将 React 编程范式带到了 Android 和 iOS
            等平台。它并不规定如何进行路由，或如何访问众多平台 API。要使用 React
            Native 构建新应用，我们推荐使用像{' '}
            <a href="https://expo.dev">Expo</a> 这样的框架。
          </>
        }
      />
      <div className={styles.cardContainer}>
        <div className={styles.card}>
          <ThemedImage
            sources={{
              light: '/img/homepage/file-based-routing.png',
              dark: '/img/homepage/file-based-routing-dark.png',
            }}
            className={styles.cardImage}
            alt="File system with folders and files representing screens and navigation"
          />
          <div className={styles.cardContent}>
            <h4 className={styles.cardTitle}>基于文件的路由</h4>
            <p className={styles.cardDescription}>
              使用文件系统创建堆栈、模态、抽屉和标签屏幕，最小化样板代码。
            </p>
          </div>
        </div>
        <div className={styles.card}>
          <ThemedImage
            sources={{
              light: useBaseUrl('/img/homepage/libraries.png'),
              dark: useBaseUrl('/img/homepage/libraries-dark.png'),
            }}
            alt="Grid of icons representing libraries, SDKs, and native code"
            className={styles.cardImage}
          />
          <div className={styles.cardContent}>
            <h4 className={styles.cardTitle}>使用任何 SDK 或原生代码</h4>
            <p className={styles.cardDescription}>
              生成原生更改或编写自己的原生代码。使用超过 50
              个模块来创建您的应用。
            </p>
          </div>
        </div>
        <div className={styles.card}>
          <ThemedImage
            sources={{
              light: useBaseUrl('/img/homepage/tools.png'),
              dark: useBaseUrl('/img/homepage/tools-dark.png'),
            }}
            className={styles.cardImage}
            alt="List of developer tool toggles for debugging, performance, and more"
          />
          <div className={styles.cardContent}>
            <h4 className={styles.cardTitle}>开发者工具</h4>
            <p className={styles.cardDescription}>
              使用 Expo Go 快速入门，然后继续使用 expo-dev-client：一个将 Expo
              工具添加到需要原生更改的应用中的模块。
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}

export default Framework;
