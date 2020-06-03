// path、component、name、title是必须的
export default [
  {
    title: '首页',
    name: '/index',
    children: [
      {
        title: '图片',
        name: '/index/pic'
      },
      {
        title: '街道',
        name: '/index/street'
      },
      {
        title: '地点',
        name: '/index/place'
      }
    ]
  }
]
