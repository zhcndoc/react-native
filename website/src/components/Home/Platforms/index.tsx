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
import FoxFact from './FoxFact';

import styles from './styles.module.css';

function Platforms() {
  return (
    <Section>
      <SectionTitle
        title="使用 React 为 Android、iOS 等平台创建原生应用"
        description={
          <>
            React Native将使用React进行开发的最佳部分带到原生开发中。
            <br />
            这是一个用于构建用户界面的顶级 JavaScript 库。
          </>
        }
      />
      <div className={styles.platformsContainer}>
        <div className={styles.featureContainer}>
          <div className={styles.codeEditor}>
            <div className={styles.codeEditorTitleContainer}>index.js</div>
            <div className={styles.codeEditorContentContainer}>
              <pre>
                <span style={{color: 'var(--home-code-red)'}}>function</span>{' '}
                <span style={{color: 'var(--home-code-purple'}}>
                  HomeScreen
                </span>
                {`()`}
                {` {`} <br />
                <span
                  style={{color: 'var(--home-code-red)'}}>{`  return `}</span>
                {`(`} <br />
                {`    <`}
                <span style={{color: 'var(--home-code-green)'}}>View</span>
                {`>`} <br />
                {`      <`}
                <span style={{color: 'var(--home-code-green)'}}>{`Text`}</span>
                {`>`} Hello World 👋 🌍!{`</`}
                <span style={{color: 'var(--home-code-green)'}}>{`Text`}</span>
                {`>`}
                <br />
                {`    </`}
                <span style={{color: 'var(--home-code-green)'}}>View</span>
                {`>`} <br />
                {`  );`} <br />
                {`}`}
              </pre>
            </div>
          </div>
          <div className={styles.deviceContainer}>
            <ThemedImage
              sources={{
                light: useBaseUrl('/img/homepage/devices.png'),
                dark: useBaseUrl('/img/homepage/devices-dark.png'),
              }}
              className={styles.devices}
              alt="Android device and iOS device"
            />
          </div>
        </div>
      </div>
      <div className={styles.foxFactContainer}>
        <FoxFact className={styles.fox} />
        <p>
          <strong>用 JavaScript 编写，以原生代码渲染。</strong> React
          原语渲染为原生平台 UI，这意味着你的应用程序使用
          与其他应用程序相同的原生平台 API。
        </p>
      </div>
    </Section>
  );
}

export default Platforms;
