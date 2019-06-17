import {
  GetBCXWithState
} from '../../utils/bcx'
import Alert from '../../components/kalert/function'
import I18n from '../../languages'
import CommonJs from '../../config/common'
import router from '../../router'

let NewBCX = GetBCXWithState()
export default {
  namespaced: true,
  state: {
    name: '',
    address: '',
    privateKey: '',
    keystore: '',
    balance: 0,
    cpu: 0,
    bandWidth: 0,
    cocosPower: 0,
    frozenExpires: 0,
    assets: []
  },
  actions: {
    // 账户模式注册
    async loadBCXAccount({
      commit,
      state,
      rootState
    }) {
      commit('loading', true, {
        root: true
      })
      try {
        let resData
        await NewBCX.createAccountWithPassword({
          account: rootState.cocosAccount.accounts,
          password: rootState.cocosAccount.passwords,
          autoLogin: true
        }).then((res) => {
          commit('loading', false, {
            root: true
          })
          if (res.code === 1) {
            commit('setIsAccount', true, {
              root: true
            })
            commit('setLogin', true, {
              root: true
            })
            commit('setAccountType', 'account', {
              root: true
            })
          } else {
            Alert({
              message: CommonJs.getI18nMessages(I18n).error[res.code]
            })
          }
          resData = res
        })
        return resData
      } catch (e) {
        return e
      }
    },
    // 退出登陆
    async logoutBCXAccount({
      commit
    }) {
      try {
        // commit('loading', true, {
        //   root: true
        // })
        let resData
        await NewBCX.logout().then((res) => {
          commit('loading', false, {
            root: true
          })
          commit('setIsAccount', false, {
            root: true
          })
          commit('setAccount', {
            account: '',
            password: ''
          }, {
            root: true
          })
          commit('setAccountType', '', {
            root: true
          })
          commit('setIsImportKeys', false, {
            root: true
          })
          commit('setLogin', false, {
            root: true
          })
          // setIsImportKeys
          resData = res
          // if (res.code !== 1) {
          //   Alert({
          //     message: CommonJs.getI18nMessages(I18n).error[res.code]
          //   })
          // }
          // router.replace({
          //   name: 'initAccount'
          // })
        })
        return resData
      } catch (e) {
        return e
      }
    },
    // 修改密码
    async changePassword({
      commit,
      state,
      rootState
    }) {
      try {
        let resData
        commit('loading', true, {
          root: true
        })
        await NewBCX.changePassword({
          oldPassword: rootState.Password.oldPassword,
          newPassword: rootState.Password.newPassword
        }).then((res) => {
          commit('loading', false, {
            root: true
          })
          commit('setIsAccount', false, {
            root: true
          })
          resData = res
          if (res.code !== 1) {
            Alert({
              message: CommonJs.getI18nMessages(I18n).error[res.code]
            })
          }
        })
        return resData
      } catch (e) {
        return e
      }
    },
    // 私钥登录
    async setPrivateKeys({
      commit,
      state,
      rootState
    }) {
      commit('loading', true, {
        root: true
      })
      try {
        let resData
        await NewBCX.privateKeyLogin({
          privateKey: rootState.privateKeys,
          password: rootState.temporaryKeys
        }).then((res) => {
          commit('loading', false, {
            root: true
          })
          if (res.code !== 1) {
            Alert({
              message: CommonJs.getI18nMessages(I18n).error[res.code]
            })
          }
          resData = res
        })
        return resData
      } catch (e) {
        return e
      }
    },
    async unlockAccount({
      commit,
      state,
      rootState
    }) {
      commit('loading', true, {
        root: true
      })
      try {
        let resData
        await NewBCX.unlockAccount({
          password: rootState.cocosAccount.passwords
        }).then((res) => {
          commit('loading', false, {
            root: true
          })
          commit('setIsAccount', false, {
            root: true
          })
          if (res.code !== 1 && !rootState.loginNoAlert) {
            Alert({
              message: CommonJs.getI18nMessages(I18n).error[res.code]
            })
          }
          commit('setLoginNoAlert', false, {
            root: true
          })
          resData = res
        })
        return resData
      } catch (e) {
        return e
      }
    },
    // 登陆账户
    async loginBCXAccount({
      commit,
      state,
      rootState
    }) {
      commit('loading', true, {
        root: true
      })
      try {
        let resData
        await NewBCX.passwordLogin({
          account: rootState.cocosAccount.accounts,
          password: rootState.cocosAccount.passwords
        }).then((res) => {
          commit('loading', false, {
            root: true
          })
          commit('setLogin', true, {
            root: true
          })
          commit('setAccountType', 'account', {
            root: true
          })
          if (res.code !== 1 && res.code !== 107) {
            Alert({
              message: CommonJs.getI18nMessages(I18n).error[
                res.code
              ]
            })
          }
          resData = res
        })
        return resData
      } catch (e) {
        return e
      }
    },
    // 查询账户状态
    async loadingBCXAccount({
      commit
    }) {
      commit('loading', true, {
        root: true
      })
      try {
        let data = await NewBCX.getAccountInfo()
        commit('loading', false, {
          root: true
        })
        // if (data.code !== 1) {
        //   console.log(data)
        //   Alert({
        //     message: data.message
        //   })
        // }
        return data
      } catch (e) {
        return e
      }
    },
    async importPrivateKey({
      commit,
      state,
      rootState
    }) {
      commit('loading', true, {
        root: true
      })
      try {
        let resData
        await NewBCX.importPrivateKey({
          privateKey: rootState.privateKeys,
          password: rootState.cocosAccount.passwords
        }).then(res => {
          commit('loading', false, {
            root: true
          })
          if (res.code !== 1) {
            Alert({
              message: CommonJs.getI18nMessages(I18n).error[
                res.code
              ]
            })
          }
          resData = res
        })
        return resData
      } catch (e) {
        return e
      }
    },
    // 查询账户信息
    async UserMessage({
      commit,
      state,
      rootState
    }) {
      let resData
      commit('loading', true, {
        root: true
      })
      try {
        await NewBCX.queryAccountInfo({
          account: rootState.cocosAccount.accounts
        }).then(res => {
          commit('loading', false, {
            root: true
          })
          if (res.code !== 1) {
            Alert({
              message: CommonJs.getI18nMessages(I18n).error[res.code]
            })
          }
          resData = res
        })
        return resData
      } catch (e) {
        return e
      }
    },
    // 查询账户资产
    async UserAccount({
      commit,
      state,
      rootState
    }) {
      let resData
      commit('loading', true, {
        root: true
      })
      try {
        await NewBCX.queryAccountBalances({
          unit: '',
          account: rootState.cocosAccount.accounts
        }).then(res => {
          commit('loading', false, {
            root: true
          })
          commit('setCocosCount', res.data.COCOS, {
            root: true
          })
          if (res.code !== 1) {
            Alert({
              message: CommonJs.getI18nMessages(I18n).error[res.code]
            })
          }
          resData = res
        })
        return resData
      } catch (e) {
        return e
      }
    },
    // 导出私钥
    async OutPutKey({
      commit,
      state,
      rootState
    }) {
      let resData
      try {
        await NewBCX.getPrivateKey().then(res => {
          commit('loading', false, {
            root: true
          })
          if (res.code !== 1) {
            Alert({
              message: CommonJs.getI18nMessages(I18n).error[res.code]
            })
          }
          resData = res
        })
        return resData
      } catch (e) {
        return e
      }
    }
  }
}