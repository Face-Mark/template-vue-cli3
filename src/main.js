import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './styles/element-variables.scss'
import './icons'

Vue.config.productionTip = false

import debounce from '@/directive/debounce'
debounce.install(Vue)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
