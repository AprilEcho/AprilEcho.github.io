module.exports = {
    title: '新宿猫的博客小站',
    description: 'May the force be with you',
    plugins: [],
    head: [
        [
            'link',
            {
                rel: 'icon',
                href: '/assets/icon/favicon.ico',
            },
        ],
    ],
    theme: 'vuepress-theme-vivek',
    themeConfig: require('./themeConfig'),
    markdown: {
        lineNumbers: true,
    },
    smoothScroll: true,
    lastUpdated: 'Last Updated',
    //github的配置
    repo: 'aprilecho',
    repoLabel: 'Github',
    docsDir: 'docs',
    docsBranch: 'master',
    editLinks: true,
    editLinkText: 'Edit this page',
};
