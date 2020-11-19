import Vue from 'vue'
import VueRouter from 'vue-router'
import route from './route'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import store from './store'
import Axios from './base-lib/utils/axios/index'
import dayjs from 'dayjs'
Vue.config.productionTip = false


// 加载初始化
const auth = localStorage.getItem('auth')
if(auth !== null) {
  store.commit('setAuth', JSON.parse(auth))
}


Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Axios)

Vue.filter('picShotTimeDeal', function (val) {
  const t = /(\d{4})年((\d{2})月|)((\d{2})日|)/
  if(t.test(val)) {
    let ret = val.replace('00月', '之前').replace('13月', '之后').replace('00日', '之前')
    if(/(\d{4})年((\d{2})月)((\d{2})日|)/.test(val)) {
      const dayNum = dayjs(val).daysInMonth()
      ret = ret.replace((dayNum + 1) + '日', '之后')
    }
    return ret
  }
  return val
})

new Vue({
  store,
  router: route,
  render: h => h(App),
}).$mount('#app')
