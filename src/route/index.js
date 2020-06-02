import VueRouter from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: '/index',
    component: () => import('@/views/Index.vue'),
    redirect: '/index/page',
    children: [
      {
        path: 'sys-config',
        name: 'SysConfig',
        component: () => import('@/views/sysConfig/Index'),
        meta: {
          title: '系统配置'
        }
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/Index')
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  next()
})

export default router
