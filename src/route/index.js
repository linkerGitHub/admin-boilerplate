import VueRouter from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: '/index',
    component: () => import('@/views/Index.vue'),
    redirect: '/index/pic',
    children: [
      {
        path: 'sys-config',
        name: 'SysConfig',
        component: () => import('@/views/sysConfig/Index'),
        meta: {
          title: '系统配置'
        }
      },
      {
        path: 'pic',
        component: () => import('@/views/pic/Index'),
        meta: {
          title: '图片'
        }
      },
      {
        path: 'street',
        component: () => import('@/views/street/Index'),
        meta: {
          title: '街道'
        }
      },
      {
        path: 'place',
        component: () => import('@/views/place/Index'),
        meta: {
          title: '地点'
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
