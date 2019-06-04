import Vue from 'vue'
import Component from './func_kalert'

const KalertConstructor = Vue.extend(Component)

const Kalert = (options) => {
  const instance = new KalertConstructor({
    propsData: Object.assign({}, options)
  })
  instance.vm = instance.$mount()
  document.body.append(instance.vm.$el)
  instance.vm.visible = true

  instance.vm.$on('closed', () => {
    instance.vm.$destroy()
    document.body.removeChild(instance.vm.$el)
  })

  instance.vm.$on('close', () => {
    instance.vm.visible = false
  })

  return instance.vm
}

export default Kalert
