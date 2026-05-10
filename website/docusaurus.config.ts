/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type * as PluginContentDocs from '@docusaurus/plugin-content-docs';
import type * as Preset from '@docusaurus/preset-classic';
import type {Config} from '@docusaurus/types';
import path from 'path';

import users from './showcase.json';
import versions from './versions.json';
import prismTheme from './core/PrismTheme';

import remarkSnackPlayer from '@react-native-website/remark-snackplayer';
import remarkCodeblockLanguageTitle from '@react-native-website/remark-codeblock-language-as-title';

const isProductionDeployment =
  (!!process.env.NETLIFY && process.env.CONTEXT === 'production') ||
  (!!process.env.VERCEL && process.env.VERCEL_ENV === 'production');

const lastVersion = versions[0];
const copyright = `<a target="_blank" style="text-decoration: none;" href="https://www.zhcndoc.com">简中文档</a>｜<a rel="nofollow" target="_blank" style="text-decoration: none;" href="https://beian.miit.gov.cn">沪ICP备2024070610号-3</a>`;

export type EditUrlButton = {
  label: string;
  href: string;
};

const commonDocsOptions: PluginContentDocs.Options = {
  admonitions: {keywords: ['important'], extendDefaults: true},
  breadcrumbs: false,
  showLastUpdateAuthor: false,
  showLastUpdateTime: true,
  editUrl: (options => {
    const baseUrl = 'https://github.com/zhcndoc/react-native/edit/main';
    const nextReleasePath = `docs/${options.docPath}`;
    const isNextRelease = options.version === 'current';
    const buttons: EditUrlButton[] = [
      {
        label: isNextRelease ? 'Edit this page' : 'Edit page for next release',
        href: `${baseUrl}/${nextReleasePath}`,
      },
    ];
    if (!isNextRelease) {
      const label =
        options.version === lastVersion
          ? 'Edit page for current release'
          : `Edit page for ${options.version} release`;
      const thisVersionPath = path.posix.join(
        'website',
        options.versionDocsDirPath,
        options.docPath
      );
      buttons.push({
        label,
        href: `${baseUrl}/${thisVersionPath}`,
      });
    }
    return JSON.stringify(buttons);
  }) as PluginContentDocs.EditUrlFunction,
  remarkPlugins: [remarkSnackPlayer, remarkCodeblockLanguageTitle],
};

const isDeployPreview =
  process.env.PREVIEW_DEPLOY === 'true' ||
  (!!process.env.VERCEL && process.env.VERCEL_ENV === 'preview');

const config: Config = {
  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],
  future: {
    // Turns Docusaurus v4 future flags on to make it easier to upgrade later
    v4: true,
    // Make Docusaurus build faster - enabled by default
    // See https://github.com/facebook/docusaurus/issues/10556
    // See https://github.com/facebook/react-native-website/pull/4268
    // See https://docusaurus.io/blog/releases/3.6
    faster: (process.env.DOCUSAURUS_FASTER ?? 'true') === 'true',
  },

  title: 'React Native 中文文档',
  tagline: '一个使用 React 构建 Android、iOS 等原生应用的框架',
  organizationName: 'Meta Platforms, Inc.',
  projectName: 'react-native',
  url: 'https://react-native.zhcndoc.com',
  baseUrl: '/',
  clientModules: [
    './modules/snackPlayerInitializer.ts',
    './modules/jumpToFragment.ts',
  ],
  trailingSlash: false, // because trailing slashes can break some existing relative links
  scripts: [
    {
      src: 'https://www.zhcndoc.com/js/common.js',
      async: true,
    },
    {
      src: 'https://cdn.jsdelivr.net/npm/focus-visible@5.2.0/dist/focus-visible.min.js',
      defer: true,
    },
    {
      src: 'https://widget.surveymonkey.com/collect/website/js/tRaiETqnLgj758hTBazgd8ryO5qrZo8Exadq9qmt1wtm4_2FdZGEAKHDFEt_2BBlwwM4.js',
      defer: true,
    },
    {src: 'https://snack.expo.dev/embed.js', defer: true},
    {src: 'https://platform.twitter.com/widgets.js', async: true},
  ],
  favicon: 'favicon.ico',
  titleDelimiter: '·',
  customFields: {
    users,
    facebookAppId: '1677033832619985',
  },
  i18n: {
    defaultLocale: 'zh-CN',
    locales: ['zh-CN'],
  },
  onBrokenLinks: 'warn',
  headTags: [
    {
      tagName: 'script',
      attributes: {
        type: 'application/ld+json',
      },
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org/',
        '@type': 'WebPage',
        '@id': 'https://reactnative.dev/',
        url: 'https://reactnative.dev/',
        name: 'React Native · Learn once, write anywhere',
        description:
          'A framework for building native apps for Android, iOS, and more using React',
        logo: 'https://reactnative.dev/img/pwa/manifest-icon-192.png',
        inLanguage: 'en-US',
      }),
    },
    {
      tagName: 'script',
      attributes: {
        type: 'application/ld+json',
      },
      innerHTML: JSON.stringify({
        '@type': 'WebSite',
        '@id': 'https://reactnative.dev/',
        url: 'https://reactnative.dev/',
        name: 'React Native · Learn once, write anywhere',
        description:
          'A framework for building native apps for Android, iOS, and more using React',
        publisher: 'Meta Platforms, Inc.',
        potentialAction: [
          {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: 'https://reactnative.dev/search?q={query}',
            },
            'query-input': {
              '@type': 'PropertyValueSpecification',
              valueRequired: true,
              valueName: 'query',
            },
          },
        ],
        inLanguage: 'zh-CN',
      }),
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'apple-touch-icon',
        href: '/img/pwa/apple-icon-180.png',
      },
    },
  ],
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          path: '../docs',
          sidebarPath: require.resolve('./sidebars'),
          editCurrentVersion: true,
          onlyIncludeVersions: isDeployPreview
            ? ['current', ...versions.slice(0, 2)]
            : undefined,
          versions: {
            [lastVersion]: {
              badge: false, // Do not show version badge for last RN version
            },
          },
          ...commonDocsOptions,
        },
        blog: {
          path: 'blog',
          blogSidebarCount: 'ALL',
          blogSidebarTitle: 'All Blog Posts',
          feedOptions: {
            type: 'all',
            copyright,
          },
          onInlineAuthors: 'ignore',
          // Ignore for now due to old posts
          onUntruncatedBlogPosts: 'ignore',
        },
        theme: {
          customCss: [
            require.resolve('./src/css/customTheme.scss'),
            require.resolve('./src/css/index.scss'),
            require.resolve('./src/css/showcase.scss'),
            require.resolve('./src/css/versions.scss'),
          ],
        },
        // gtag: {
        //   trackingID: 'G-58L13S6BDP',
        // },
      } satisfies Preset.Options,
    ],
  ],
  plugins: [
    'docusaurus-plugin-sass',
    function disableExpensiveBundlerOptimizationPlugin() {
      return {
        name: 'disable-expensive-bundler-optimizations',
        configureWebpack(_config, isServer) {
          // This optimization is expensive and only reduces by 3% the JS assets size
          // Let's skip it for local and deploy preview builds
          // See also https://github.com/facebook/docusaurus/discussions/11199
          return {
            optimization: {
              concatenateModules: isProductionDeployment ? !isServer : false,
            },
          };
        },
      };
    },
    [
      'content-docs',
      {
        id: 'architecture',
        path: 'architecture',
        routeBasePath: '/architecture',
        sidebarPath: require.resolve('./sidebarsArchitecture'),
        ...commonDocsOptions,
      } satisfies PluginContentDocs.Options,
    ],
    [
      'content-docs',
      {
        id: 'contributing',
        path: 'contributing',
        routeBasePath: '/contributing',
        sidebarPath: require.resolve('./sidebarsContributing'),
        ...commonDocsOptions,
      } satisfies PluginContentDocs.Options,
    ],
    [
      'content-docs',
      {
        id: 'community',
        path: 'community',
        routeBasePath: '/community',
        sidebarPath: require.resolve('./sidebarsCommunity'),
        ...commonDocsOptions,
      } satisfies PluginContentDocs.Options,
    ],
    [
      '@docusaurus/plugin-pwa',
      {
        debug: true,
        offlineModeActivationStrategies: ['appInstalled', 'queryString'],
        pwaHead: [
          {
            tagName: 'link',
            rel: 'icon',
            href: '/img/pwa/manifest-icon-512.png',
          },
          {
            tagName: 'link',
            rel: 'manifest',
            href: '/manifest.json',
          },
          {
            tagName: 'meta',
            name: 'theme-color',
            content: '#20232a',
          },
          {
            tagName: 'meta',
            name: 'mobile-web-app-capable',
            content: 'yes',
          },
          {
            tagName: 'meta',
            name: 'apple-mobile-web-app-status-bar-style',
            content: '#20232a',
          },
          {
            tagName: 'link',
            rel: 'apple-touch-icon',
            href: '/img/pwa/manifest-icon-512.png',
          },
          {
            tagName: 'link',
            rel: 'mask-icon',
            href: '/img/pwa/manifest-icon-512.png',
            color: '#06bcee',
          },
          {
            tagName: 'meta',
            name: 'msapplication-TileImage',
            href: '/img/pwa/manifest-icon-512.png',
          },
          {
            tagName: 'meta',
            name: 'msapplication-TileColor',
            content: '#20232a',
          },
        ],
      },
    ],
    [
      '@signalwire/docusaurus-plugin-llms-txt',
      {
        siteTitle: 'React Native · Learn once, write anywhere',
        siteDescription:
          'A framework for building native apps for Android, iOS, and more using React',
        depth: 3,
        includeOrder: [
          '/docs/getting-started',
          '/docs/environment-setup',
          '/docs/set-up-your-environment',
          '/docs/integration-with-existing-apps',
          '/docs/integration-with-android-fragment',
          '/docs/intro-react-native-components',
          '/docs/intro-react',
          '/docs/handling-text-input',
          '/docs/using-a-scrollview',
          '/docs/using-a-listview',
          '/docs/troubleshooting',
          '/docs/platform-specific-code',
          '/docs/building-for-tv',
          '/docs/out-of-tree-platforms',
          '/docs/more-resources',
          '/docs/**',
          '/architecture/**',
          '/community/**',
          '/showcase/**',
          '/contributing/**',
          '/versions',
          '/blog/**',
        ],
        content: {
          includeBlog: true,
          includePages: true,
          includeVersionedDocs: false,
          enableLlmsFullTxt: true,
          excludeRoutes: [
            '/blog/201*/**',
            '/blog/2020/**',
            '/blog/2021/**',
            '/blog/2022/**',
            '/blog/page/**',
            '/blog/tags/**',
            '/blog/archive',
            '/blog/authors',
            '/releases',
            '/search',
          ],
        },
      },
    ],
  ],
  themeConfig: {
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    prism: {
      defaultLanguage: 'tsx',
      theme: prismTheme,
      additionalLanguages: [
        'diff',
        'bash',
        'json',
        'java',
        'kotlin',
        'objectivec',
        'swift',
        'groovy',
        'ruby',
        'flow',
      ],
      magicComments: [
        {
          className: 'theme-code-block-highlighted-line',
          line: 'highlight-next-line',
          block: {start: 'highlight-start', end: 'highlight-end'},
        },
        {
          className: 'code-add-line',
          line: 'highlight-add-next-line',
          block: {start: 'highlight-add-start', end: 'highlight-add-end'},
        },
        {
          className: 'code-remove-line',
          line: 'highlight-remove-next-line',
          block: {
            start: 'highlight-remove-start',
            end: 'highlight-remove-end',
          },
        },
      ],
    },
    // announcementBar: {
    //   id: 'watch_keynote',
    //   content:
    //     'Re-watch the latest <a target="_blank" rel="noopener noreferrer" href="https://www.youtube.com/watch?v=NiYwlvXsBKw">React Native Keynote</a> from React Conf 2025',
    //   backgroundColor: '#20232a',
    //   textColor: '#fff',
    //   isCloseable: false,
    // },
    navbar: {
      title: 'React Native 中文文档',
      logo: {
        src: 'img/header_logo.svg',
        alt: '',
      },
      style: 'dark',
      items: [
        {
          label: '开发',
          type: 'dropdown',
          position: 'right',
          items: [
            {
              label: '指南',
              type: 'doc',
              docId: 'getting-started',
            },
            {
              label: '组件',
              type: 'doc',
              docId: 'components-and-apis',
            },
            {
              label: 'API 参考',
              type: 'doc',
              docId: 'accessibilityinfo',
            },
            {
              label: '架构',
              type: 'doc',
              docId: 'architecture-overview',
              docsPluginId: 'architecture',
            },
          ],
        },
        {
          type: 'doc',
          docId: 'overview',
          label: '贡献',
          position: 'right',
          docsPluginId: 'contributing',
        },
        {
          type: 'doc',
          docId: 'overview',
          label: '社区',
          position: 'right',
          docsPluginId: 'community',
        },
        {
          to: '/showcase',
          label: '展示',
          position: 'right',
        },
        {
          to: '/blog',
          label: '博客',
          position: 'right',
        },
        {
          type: 'docsVersionDropdown',
          position: 'left',
          dropdownActiveClassDisabled: true,
          dropdownItemsAfter: [
            {
              to: '/versions',
              label: '所有版本',
            },
          ],
        },
        {
          href: 'https://github.com/facebook/react-native',
          'aria-label': 'GitHub repository',
          position: 'right',
          className: 'navbar-github-link',
        },
      ],
    },
    image: 'img/logo-share.png',
    footer: {
      style: 'dark',
      links: [
        {
          title: '开发',
          items: [
            {
              label: '指南',
              to: 'docs/getting-started',
            },
            {
              label: '组件',
              to: 'docs/components-and-apis',
            },
            {
              label: 'API 参考',
              to: 'docs/accessibilityinfo',
            },
            {
              label: '架构',
              to: 'architecture/overview',
            },
          ],
        },
        {
          title: '参与',
          items: [
            {
              label: '展示',
              to: 'showcase',
            },
            {
              label: '贡献',
              to: 'contributing/overview',
            },
            {
              label: '社区',
              to: 'community/overview',
            },
            {
              label: '目录',
              href: 'https://reactnative.directory/',
            },
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/react-native',
            },
          ],
        },
        {
          title: '关注我们',
          items: [
            {
              label: '博客',
              to: 'blog',
            },
            {
              label: 'X',
              href: 'https://x.com/reactnative',
            },
            {
              label: 'Bluesky',
              href: 'https://bsky.app/profile/reactnative.dev',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/facebook/react-native',
            },
          ],
        },
        {
          title: '探索更多',
          items: [
            {
              label: 'ReactJS',
              href: 'https://react.dev/',
            },
            {
              label: '隐私政策',
              href: 'https://opensource.fb.com/legal/privacy/',
            },
            {
              label: '服务条款',
              href: 'https://opensource.fb.com/legal/terms/',
            },
          ],
        },
      ],
      logo: {
        alt: 'Meta Open Source Logo',
        src: 'img/oss_logo.svg',
        href: 'https://opensource.fb.com/',
      },
      copyright,
    },
    algolia: {
      appId: '8TDSE0OHGQ',
      apiKey: '83cd239c72f9f8b0ed270a04b1185288',
      indexName: 'react-native-v2',
      contextualSearch: true,
    },
    metadata: [
      {
        property: 'og:image',
        content: 'https://reactnative.dev/img/logo-share.png',
      },
      {name: 'twitter:card', content: 'summary_large_image'},
      {
        name: 'twitter:image',
        content: 'https://reactnative.dev/img/logo-share.png',
      },
      {name: 'twitter:site', content: '@reactnative'},
      {name: 'mobile-web-app-capable', content: 'yes'},
    ],
    mermaid: {
      theme: {
        light: 'neutral',
        dark: 'dark',
      },
      options: {
        fontFamily:
          '"Optimistic Display", system-ui, -apple-system, sans-serif',
      },
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
