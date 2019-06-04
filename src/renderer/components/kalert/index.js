import KAlert from './kalert.vue'
import kAlert from './function'

export default (Vue) => {
  Vue.component(KAlert.name, KAlert)
  Vue.prototype.$kalert = kAlert
}
