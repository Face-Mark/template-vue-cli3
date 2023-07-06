import Vue from 'vue'
import { Debounced } from '@/utils'
/**
 * 防抖 防止重复点击
 * 传参：v-debounceClick="() =>{handleFun(arg)}"
 * 不传参:v-debounceClick="handleFun"
 * delayTime:延迟的时间,只执行最后一次
 */
Vue.directive('debounceClick', {
  // bind(el, binding, vnode, oldvnode) { },
  inserted: function(el, binding) {
    const delayTime = el.getAttribute('delay-time') || 1500
    el.debounceFn = Debounced(function() {
      binding.value()
    }, delayTime)
    el.addEventListener('click', el.debounceFn)
  },
  componentUpdated(el, binding) {
    const delayTime = el.getAttribute('delay-time') || 1500
    el.removeEventListener('click', el.debounceFn)
    el.debounceFn = Debounced(function() {
      binding.value()
    }, delayTime)
    el.addEventListener('click', el.debounceFn)
  },
  unbind(el) {
    el.removeEventListener('click', el.debounceFn)
  }
})
