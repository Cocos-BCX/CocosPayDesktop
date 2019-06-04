/**
 * 路由守卫
 */
import router from './index'
import store from '../store'
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.isLogin)) {
    // 判断是否登陆
    if (!store.state.isLogin) {
      next({
        name: 'initAccount'
      })
    }
    next()
  } else {
    next()
  }
})
// 页面离开出除loading
router.afterEach(() => {
  store.commit('loading', false)
})