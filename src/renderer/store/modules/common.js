import I18n from '../../languages'
import CommonJs from '../../config/common'
export default {
  namespaced: true,

  state: {
    registerWallet: false,
    storePrivate: false,
    accounLogin: false
  },

  mutations: {
    WalletRegister (state, registerWallet) {
      state.registerWallet = registerWallet
    },
    privateStore (state, storePrivate) {
      state.storePrivate = storePrivate
    },
    AccountLogin (state, accounLogin) {
      state.accounLogin = accounLogin
    }
  }
}
