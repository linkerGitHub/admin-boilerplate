import VueRouter from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: '/index',
    component: () => import('@/views/Index.vue'),
    children: [
      {
        path: 'test',
        component: () => import('@/views/test.vue'),
        meta: {
          title: 'test'
        }
      },
      {
        path: 'sys-config',
        component: () => import('@/views/sysConfig/Index'),
        meta: {
          title: '系统配置'
        }
      }
    ]
  }
]

export default new VueRouter({
  routes
})
