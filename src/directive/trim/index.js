import trim from './trim'

const install = function(Vue) {
  Vue.directive('trim', trim)
}

if (window.Vue) {
  window['trim'] = trim
  Vue.use(install); // eslint-disable-line
}

trim.install = install
export default trim
