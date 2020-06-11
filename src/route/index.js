import VueRouter from 'vue-router'

export const routes = [
  {
    path: '/',
    redirect: '/index',
    name: 'index'
  },
  {
    path: '/index',
    component: () => import('@/views/Index.vue'),
    redirect: '/index/pic',
    children: [
      {
        path: 'pic',
        component: () => import('@/views/pic/Index'),
        meta: {
          title: '图片'
        }
      },
      {
        path: 'collection',
        component: () => import('@/views/collection/Index'),
        meta: {
          title: '图集'
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
      },
      {
        path: 'tag',
        component: () => import('@/views/tag/Index'),
        meta: {
          title: '标签'
        }
      },
      {
        path: 'time-stage',
        component: () => import('@/views/timeStage/Index'),
        meta: {
          title: '时间阶段'
        }
      },
      {
        path: 'user',
        component: () => import('@/views/user/Index'),
        meta: {
          title: '用户'
        }
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/Index'),
    beforeEnter: (to, from, next) => {
      if(localStorage.getItem('auth') !== null) {
        next({ name: 'index' })
      } else {
        next()
      }
    }
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  next()
})

export default router

