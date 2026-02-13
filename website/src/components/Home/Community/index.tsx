/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import Section from '../Section';
import SectionTitle from '../SectionTitle';

import styles from './styles.module.css';

function Community() {
  const {siteConfig} = useDocusaurusContext();
  const apps = Object.values(siteConfig.customFields.users)
    .flat()
    .filter(app => app.pinned);

  return (
    <Section>
      <SectionTitle title="Meta 支持，社区驱动" />
      <div className={styles.featureContainer}>
        <div>
          <p>Meta 在 2015 年发布了 React Native，并一直在维护它。</p>
          <p>
            在 2018 年，React Native 是 GitHub
            上拥有第二多贡献者的代码库。如今，React Native
            得到了来自全球个人和公司（包括 Callstack、Expo、Infinite
            Red、Microsoft 和 Software Mansion）的贡献和支持。
          </p>
          <p>
            我们的社区一直在推出令人兴奋的新项目，并通过诸如 React Native
            Windows、React Native macOS 和 React Native Web 等代码库，探索超越
            Android 和 iOS 的平台。
          </p>
        </div>
        <div>
          <p>
            React Native
            已被成千上万的应用程序使用，但你很可能已经在以下这些应用中用过它：
          </p>
          <ul className="AppList">
            {apps.map((app, i) => {
              const imgSource = !app.icon.startsWith('http')
                ? useBaseUrl('img/showcase/' + app.icon)
                : app.icon;
              return (
                <li key={i} className="item">
                  {app.infoLink ? (
                    <a href={app.infoLink}>
                      <img src={imgSource} alt={app.name} />
                    </a>
                  ) : (
                    <img src={imgSource} alt={app.name} />
                  )}
                </li>
              );
            })}
          </ul>
          {/* <p>
            and <a href={useBaseUrl(`showcase`)}>many more</a>.
          </p> */}
        </div>
      </div>
    </Section>
  );
}

export default Community;
