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
        path: 'page',
        name: 'Page',
        component: () => import('@/views/singlePage/Index.vue'),
        meta: {
          title: '单页'
        }
      },
      {
        path: 'article',
        name: 'Article',
        component: () => import('@/views/article/Index.vue'),
        meta: {
          title: '文章'
        }
      },
      {
        path: 'category',
        name: 'Category',
        component: () => import('@/views/category/Index.vue'),
        meta: {
          title: '类别'
        }
      },
      {
        path: 'team',
        name: 'Team',
        component: () => import('@/views/team/Index.vue'),
        meta: {
          title: '专家团队'
        }
      },
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
