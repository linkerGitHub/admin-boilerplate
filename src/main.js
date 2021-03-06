import Vue from 'vue'
import VueRouter from 'vue-router'
import route from './route'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import store from './store'
import Axios from './base-lib/utils/axios/index'
Vue.config.productionTip = false


// 加载初始化
const auth = localStorage.getItem('auth')
if(auth !== null) {
  store.commit('setAuth', auth)
}


Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Axios)

new Vue({
  store,
  router: route,
  render: h => h(App),
}).$mount('#app')
