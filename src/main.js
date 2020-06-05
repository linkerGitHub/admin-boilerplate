import Vue from 'vue'
import VueRouter from 'vue-router'
import route from './route'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import Axios from './base-lib/utils/axios/index'
Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Axios)

new Vue({
  router: route,
  render: h => h(App),
}).$mount('#app')
