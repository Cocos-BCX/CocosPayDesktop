import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import defaultNetworks from '../config/networks'
import account from './modules/account'
import wallet from './modules/wallet'
import trans from './modules/trans'
import utils from '../utils/utils'
import common from './modules/common'
import axios from "axios";
import Storage from "../utils/storage";
import {
  GetBCXWithState
} from '../utils/bcx'
import router from '../router'
let NewBCX = GetBCXWithState()
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    wallet,
    account,
    trans,
    common
  },
  state: {
    cocos: null,
    loading: true,
    popups: [],
    loading: false,
    curLng: utils.getLanguage() || 'en',
    currentNetwork: {
      id: 1,
      name: 'TestNet',
      type: 'TestNet'
    },
    accountType: '',
    networks: defaultNetworks.networks,
    currentAccount: {
      address: '',
      name: '',
      privateKey: '',
      keystore: ''
    },
    cocosAccount: {
      accounts: '',
      passwords: ''
    },
    privateKeys: '',
    temporaryKeys: '',
    currentCreateAccount: {
      address: '',
      name: '',
      privateKey: ''
    },
    Password: {
      oldPassword: '',
      newPassword: ''
    },
    currentCreateVisible: false,
    isLogin: false,
    isAccount: false,
    cocosCount: '',
    LoginCountStore: '',
    isLocked: false,
    isImportKeys: false,
    lockedTime: null,
    changeRadio: true,
    sha: '',
    dialog: '',
    whiteList: [],
    contractWhiteList: [],
    loginNoAlert: false,
    accountAdd: false
  },
  mutations: {
    setCocos(state, cocos) {
      state.cocos = cocos
    },
    setwhiteList(state, whiteList) {
      state.whiteList.push(whiteList)
    },
    pushPopup(state, popup) {
      state.popups.push(popup)
    },
    setDialogs(state, dialog) {
      state.dialog = dialog
    },
    setAccountAdd(state, accountAdd) {
      state.accountAdd = accountAdd
    },
    setLoginNoAlert(state, loginNoAlert) {
      state.loginNoAlert = loginNoAlert
    },
    setChangeRadio(state, changeRadio) {
      state.changeRadio = changeRadio
    },
    setContractWhiteList(state, contractWhiteList) {
      state.contractWhiteList.push(contractWhiteList)
    },
    releasePopup(state, popup) {
      state.popups = state.popups.filter(p => p.id !== popup.id)
    },
    setAccountType(state, accountType) {
      state.accountType = accountType
    },
    loading(state, loading) {
      state.loading = loading
    },
    setKeys(state, privateKeys) {
      state.privateKeys = Array.isArray(privateKeys) ? privateKeys[0] : privateKeys
    },
    settemporaryKeys(state, temporaryKeys) {
      state.temporaryKeys = Array.isArray(temporaryKeys) ? temporaryKeys[0] : temporaryKeys
    },
    setCurLng(state, lang) {
      state.curLng = lang
    },
    setlockedTime(state, lockedTime) {
      state.lockedTime = lockedTime
    },
    setCocosCount(state, cocos) {
      state.cocosCount = cocos
    },
    setIsLocked(state, isLocked) {
      state.isLocked = isLocked
    },
    setIsImportKeys(state, isImportKeys) {
      state.isImportKeys = isImportKeys
    },
    setPassword(state, Password) {
      state.Password = Password
    },
    setLogin(state, isLogin) {
      state.isLogin = isLogin
    },
    setIsAccount(state, isAccount) {
      state.isAccount = isAccount
    },
    setSha(state, sha) {
      state.sha = sha
    },
    setAccount(state, cocosAccount) {
      state.cocosAccount.accounts = cocosAccount.account
      state.cocosAccount.passwords = cocosAccount.password
    },
    setCurrentAccount(state, account) {
      state.currentAccount = Object.assign({}, account)
    },
    setCurrentCreateAccount(state, account) {
      state.currentCreateAccount = account
    },
    setCurrentCreateVisible(state, bool) {
      state.currentCreateVisible = bool
    },
    setLoginCountStore(state, LoginCountStore) {
      state.LoginCountStore = LoginCountStore
    },
    updateNetwork(state, network) {
      state.networks = state.networks.map(ele => {
        if (ele.type === network.type) {
          ele = {
            ...ele,
            ...network
          }
        }
        return ele
      })
    },
    upgradeCurrentAccount(state, password) {
      if (state.currentAccount.privateKey) {
        const keystore = utils.encrypt(state.currentAccount.privateKey, password)
        state.currentAccount.keystore = keystore
        state.currentAccount.privateKey = ''
      }
    },
    changePassword(state, pwd) {
      const {
        oldpwd,
        newpwd
      } = pwd
      if (state.currentAccount.keystore) {
        let privateKey = utils.decrypt(state.currentAccount.keystore, oldpwd)
        state.currentAccount.keystore = utils.encrypt(privateKey, newpwd)
      }
    }
  },
  actions: {
    async lockCount({
      commit
    }) {
      try {
        await NewBCX.lockAccount().then((res) => {
          commit('setIsLocked', true)
          router.replace({
            name: 'unlock'
          })
        })
      } catch (e) {
        return e
      }
    },
    async init({
      commit
    }) {
      try {
        commit('loading', true, {
          root: true
        })
        await NewBCX.init().then((res) => {
          commit('loading', false, {
            root: true
          })
        })
      } catch (e) {
        return e
      }
    },
    async nodeLists({
      commit
    }) {
      try {
        let nodes = [];
        axios
          .get("http://backend.test.cjfan.net/getParams")
          .then(response => {
            nodes = response.data.data;
            Storage.set("node", nodes);
          })
          .catch(function (error) {
            console.log(error);
          });
      } catch (e) {
        console.log(e);
      }
    }
  },
  plugins: [createPersistedState()]
})