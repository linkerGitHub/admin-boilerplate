import axios from 'axios'
import config from './config'
import router from '@/route/index'
import { Message } from 'element-ui'

axios.defaults = {
  ...axios.defaults,
  ...config
}

function setInterceptor(axiosInstance) {
  axiosInstance.interceptors.request.use(
    config => {
      // TODO 配置鉴权token
      return config
    },
    // error => {
    //     // TODO 配置错误处理
    // }
  )

  axiosInstance.interceptors.response.use(
    res => {
      // TODO 配置数据响应处理
      const statusCode = res.data.statusCode
      switch (statusCode) {
      case 200:
        break
      case 401:
        router.push({name: 'login'})
        break
      default:
        Message({
          type: 'error',
          message: res.data.msg
        })
        throw new Error(statusCode)
      }
      return res
    },
    error => {
      // TODO 配置请求返回的错误处理
      console.log(error)
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
