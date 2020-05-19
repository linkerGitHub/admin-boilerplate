import axios from 'axios'
import config from "./config"

axios.interceptors.request.use(
  // config => {
  //     // TODO 配置鉴权token
  // },
  // error => {
  //     // TODO 配置错误处理
  // }
)

axios.interceptors.response.use(
  res => {
    // TODO 配置数据响应处理
    console.log(res)
  },
  error => {
    // TODO 配置请求返回的错误处理
    console.log(error)
  }
)

const Axios = axios.create(config)

export {
  Axios
}

// 插件，全局调用
export default {
  install(vue, option) {
    Object.defineProperties(vue.prototype, '$http', { value: Axios})
  }
}
