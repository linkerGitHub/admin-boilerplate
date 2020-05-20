import Vue from 'vue'
import VueRouter from 'vue-router'
import route from './route'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
Vue.config.productionTip = false

Vue.use(ElementUI)
Vue.use(VueRouter)

new Vue({
  router: route,
  render: h => h(App),
}).$mount('#app')
