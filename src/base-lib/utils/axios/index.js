import axios from 'axios'
import config from './config'
import router from '@/route/index'
import { Message } from 'element-ui'
import store from '@/store'

axios.defaults = {
  ...axios.defaults,
  ...config
}

function setInterceptor(axiosInstance) {
  axiosInstance.interceptors.request.use(
    config => {
      // TODO 配置鉴权token
      let auth = localStorage.getItem('auth')
      if(auth !== null) {
        auth = JSON.parse(auth)
        config.headers.authorization = auth.token
      }
      return config
    },
    // error => {
    // TODO 配置错误处理
    // }
  )

  axiosInstance.interceptors.response.use(
    res => {
      // TODO 配置数据响应处理
      const statusCode = res.data.statusCode
      switch (statusCode) {
      case 200:
        break
      default:
        Message({
          type: 'error',
          message: res.data.msg
        })
      }
      return res
    },
    error => {
      // TODO 配置请求返回的错误处理
      const response = error.response
      // TODO 配置数据响应处理
      const statusCode = response.data.statusCode
      switch (statusCode) {
      case 401:
        // 清空auth
        if(localStorage.getItem('auth') !== null) {
          localStorage.removeItem('auth')
        }
        if(store.state.auth.token) {
          store.commit('setAuth', {})
        }

        // 转到登陆
        if(router.currentRoute.name !== 'login') {
          console.log(router.currentRoute.name !== 'login')
          router.push({name: 'login'})
        }
        // eslint-disable-next-line no-fallthrough
      default:
        Message({
          type: 'error',
          message: response.data.error.description
        })
      }
      throw error
    }
  )
}


function createAxios(...args) {
  const axiosInstance = axios.create(...args)
  setInterceptor(axiosInstance)
  return axiosInstance
}

const Axios = axios.create()
setInterceptor(Axios)

export {
  axios, createAxios
}

// 插件，全局调用
export default {
  install(vue) {
    Object.defineProperties(vue.prototype, {'$http': { value: Axios}})
    Object.defineProperties(vue.prototype, {'$genAxiosInstanceFn': { value: createAxios}})
  }
}
