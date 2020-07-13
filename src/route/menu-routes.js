import { routes, default as router } from './index'
import Cookies from 'js-cookie'
import store from '@/store'

const indexRoute = routes[1]

import {MessageBox} from 'element-ui';
import config from '@/base-lib/utils/axios/config'
export default [...indexRoute.children, {
  path: '/logout',
  action: function() {
    MessageBox.confirm('此操作将注销登录, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      store.commit('setUserInfo', {})
      store.commit('setAuth', {})
      localStorage.removeItem('auth')
      Cookies.remove('AUTHORIZATION', { path: '', domain: config.baseURL })
      router.push({ name: 'login' })
    })
  },
  title: '注销'
}]
