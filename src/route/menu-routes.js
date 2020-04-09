// path、component、name、title是必须的
export default [
    {
        path: '/index',
        component: '',
        title: '首页',
        name: 'Index',
        children: [
            {
                path: '/sec1',
                component: '',
                title: 'sec 1',
                name: 'Sec1',
                children: [
                    {
                        path: '/sec1-1',
                        components: '',
                        title: 'sec 1-1',
                        name: 'Sec11',
                    },
                    {
                        path: '/sec1-2',
                        components: '',
                        title: 'sec 1-2',
                        name: 'Sec12',
                        children: []
                    }
                ]
            },
            {
                path: '/sec2',
                component: '',
                title: 'sec 2',
                name: 'Sec2'
            }
        ]
    }
]