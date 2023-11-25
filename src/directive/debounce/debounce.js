import { debounce } from '@/utils'

/**
 * 不传参： v-debounce="getCount"
 * 传参不获取事件： v-debounce="[() => {getCount(index)}]"
 * 传参获取事件： v-debounce="[$ev => { getCount($ev, 4)}]"
 */
export default {
  bind(el, binding) {
    // 绑定的值为 el，和 binding
    let execFunc
    if (binding.value instanceof Array) {
      // 函数传参
      const [func, time = 500, immediate = false] = binding.value
      execFunc = debounce(func, time, immediate)
    } else {
      // 函数不传参
      execFunc = debounce(binding.value, 500)
    }
    el.addEventListener('click', execFunc)
  }
}
