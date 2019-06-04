import Vue from 'vue'
import router from './router'
import VueI18n from 'vue-i18n'
import VueIntl from 'vue-intl'
import i18n from './languages/index'
import {
  sync
} from 'vuex-router-sync'
import store from './store'
import App from './App.vue'
import 'vue-awesome/icons/times'
import 'vue-awesome/icons/angle-down'
import 'vue-awesome/icons/check'
import 'vue-awesome/icons/cog'
import 'vue-awesome/icons/angle-left'
import Icon from 'vue-awesome/components/Icon'
import KAvater from './components/kavatar'
import KAlert from './components/kalert'
import DrawerLayout from 'vue-drawer-layout'
import VueQriously from 'vue-qriously'
import VueMoment from 'vue-moment'
import './importElement'
import 'vue2-simplert/dist/simplert.common.css'
import 'perfect-scrollbar/css/perfect-scrollbar.css'
import './styles/global.scss'
import './styles/reset.scss'
import linkApp from './pages/poPout/popouts/linkApp'
import transferRequest from './pages/poPout/popouts/transferRequest'
import locked from './pages/poPout/popouts/locked'
import contract from './pages/poPout/popouts/contract'
import ButtonComponent from './components/buttonComponent'

// 路由守卫
import './router/guard'
sync(store, router)
Vue.use(VueI18n)
Vue.use(VueIntl)
Vue.use(KAvater)
Vue.use(KAlert)
Vue.use(VueQriously)
Vue.use(DrawerLayout)
Vue.use(VueMoment)

Vue.component('v-icon', Icon)
Vue.component('btn', ButtonComponent)
Vue.component('link-app', linkApp)
Vue.component('locked', locked)
Vue.component('transfer-request', transferRequest)
Vue.component('contract', contract)

// const i18n = new VueI18n({
//   locale: store.state.curLng,
//   messages: {
//     'zh': require('./languages/zh'),
//     'en': require('./languages/en')
//   },
//   silentTranslationWarn: true
// })
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  i18n,
  render: h => h(App)
})
