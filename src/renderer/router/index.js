import Vue from 'vue'
import Router from 'vue-router'

import PoPout from '../pages/poPout'
import Home from '../pages/home'

Vue.use(Router)

const routes = [{
    path: '/',
    redirect: '/home'
  },
  {
    path: '/unlock',
    name: 'unlock',
    component: (r) => {
      require(['../pages/unlock'], r)
    },
    meta: {
      isLogin: true
    }
  },
  {
    path: '/home',
    name: 'home',
    component: (r) => {
      require(['../pages/home'], r)
    },
    meta: {
      isLogin: true
    }
  },
  {
    path: '/popout',
    name: 'popout',
    component: (r) => {
      require(['../pages/poPout'], r)
    }
  },
  // {
  //   path: '/createWallet',
  //   name: 'createWallet',
  //   component: CreateWallet
  // },
  // {
  //   path: '/createAccount',
  //   name: 'createAccount',
  //   component: CreateAccount
  // },
  {
    path: '/login',
    name: 'login',
    component: (r) => {
      require(['../pages/login'], r)
    }
  },
  {
    path: '/initAccount',
    name: 'initAccount',
    component: (r) => {
      require(['../pages/initAccount'], r)
    }
  },
  {
    path: '/transfer',
    name: 'transfer',
    component: (r) => {
      require(['../pages/transfer'], r)
    },
    meta: {
      isLogin: true
    }
  },
  {
    path: '/transferInfo',
    name: 'transferInfo',
    component: (r) => {
      require(['../pages/transfer/detail'], r)
    },
    meta: {
      isLogin: true
    }
  },
  {
    path: '/settings',
    name: 'settings',
    component: (r) => {
      require(['../pages/settings'], r)
    }
  }
]

export default new Router({
  routes: routes
})