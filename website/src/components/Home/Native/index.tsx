/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import ThemedImage from '@theme/ThemedImage';

import Section from '../Section';
import SectionTitle from '../SectionTitle';

import styles from './styles.module.css';

function Native() {
  return (
    <Section>
      <SectionTitle
        title="为每个人提供原生开发"
        description={
          <>
            React Native
            让你能够创建真正的原生应用，并且不会影响用户体验。它提供了一组核心的、与平台无关的原生组件，比如{' '}
            <code>View</code>、<code>Text</code> 和 <code>Image</code>
            ，这些组件可以直接映射到平台的原生 UI 构建模块。
          </>
        }
      />
      <ThemedImage
        sources={{
          light: '/img/homepage/dissection.png',
          dark: '/img/homepage/dissection-dark.png',
        }}
        className={styles.flyoutIllustration}
        alt="A React Native UI pointing out native elements like Views, ScrollViews, and more"
      />
    </Section>
  );
}

export default Native;
