import { routes, default as router } from './index'
import store from '@/store'

const indexRoute = routes[1]

import {MessageBox} from 'element-ui';
import {logout} from '@/api'
export default [...indexRoute.children, {
  path: '/logout',
  action: function() {
    MessageBox.confirm('此操作将注销登录, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      logout().then(() => {
        store.commit('setUserInfo', {})
        store.commit('setAuth', {})
        localStorage.removeItem('auth')
        router.push({ name: 'login' })
      })
    }).catch((err) => {
      console.log(err)
    })
  },
  title: '注销'
}]
