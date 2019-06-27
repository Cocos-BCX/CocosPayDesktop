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
import {
  remote
} from "electron";
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
    curLng: 'ZH',
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
    accountAdd: false,
    update: false,
    updateMessage: {},
    firstLanguage: false
  },
  mutations: {
    setUpdate(state, update) {
      state.update = update
    },
    setupdateMessage(state, updateMessage) {
      state.updateMessage = updateMessage
    },
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
    setFirstLanguage(state, firstLanguage) {
      state.firstLanguage = firstLanguage
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
    setCurLng(state, curLng) {
      state.curLng = curLng
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
    },
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
        let resData
        commit('loading', true, {
          root: true
        })
        await NewBCX.init({
          refresh: true,
        }).then((res) => {
          resData = res
          commit('loading', false, {
            root: true
          })
        })
        return resData
      } catch (e) {
        return e
      }
    },
    async nodeLists({
      commit
    }) {
      try {
        commit('loading', true, {
          root: true
        })
        let nodes = [];
        await axios
          .get("http://backend.test.cjfan.net/getParams")
          .then(response => {
            commit('loading', false, {
              root: true
            })
            nodes = response.data.data;
            Storage.set("node", nodes);
          })
          .catch(function (error) {
            console.log(error);
            commit('loading', false, {
              root: true
            })
          });
        return nodes;
      } catch (e) {
        console.log(e);
      }
    },
    async switchAPINode({
      commit
    }, url) {
      try {
        let resData
        await NewBCX.switchAPINode(url).then(res => {
          resData = res
        })
        return resData
      } catch (e) {
        console.log(e);
      }
    },
    async apiConfig({
      commit
    }, Node) {
      try {
        commit('loading', true, {
          root: true
        })
        await NewBCX.apiConfig({
          default_ws_node: Node.ws,
          ws_node_list: [{
            url: Node.ws,
            name: Node.name
          }],
          networks: [{
            core_asset: "COCOS",
            chain_id: Node.chainId
          }],
          faucet_url: Node.faucetUrl ? Node.faucetUrl : Node.url,
          auto_reconnect: Node.connect ? Node.connect : false,
          worker: false
        });
        commit('loading', false, {
          root: true
        })
      } catch (e) {
        console.log(e);
      }
    },
    async IndexedDBAdd({
      commit
    }, name) {
      try {
        var request = window.indexedDB.open("test", 1);
        request.onupgradeneeded = function (event) {
          var db = event.target.result;
          var objectStore = db.createObjectStore("table1", {
            keyPath: "id",
            autoIncrement: true
          });
          objectStore.createIndex("name", "name", {
            unique: false
          });
        };
        request.onsuccess = function (event) {
          var db = event.target.result;
          var transaction = db.transaction(["table1"], "readwrite");
          var objectStore = transaction.objectStore("table1");
          objectStore.add(name);
        };
      } catch (e) {
        console.log(e)
      }

    },
    async IndexedDBQuery({
      commit
    }) {
      try {
        var request = window.indexedDB.open("test", 1)
        request.onsuccess = function (event) {
          var db = event.target.result;
          if (db.objectStoreNames.length < 1) {
            return
          }

          var transaction = db.transaction(["table1"], "readwrite");
          var objectStore = transaction.objectStore("table1");
          var request = objectStore.get(1);
          request.onsuccess = function (event) {
            return request.result
          };
        };
      } catch (e) {
        console.log(e)
      }
    },


    async UpdateVersion({
      commit
    }) {
      let resData
      if (process.platform !== "darwin") {
        try {
          await axios
            .get("http://backend.test.cjfan.net/getPolicyUrl", {
              params: {
                platform: "CocosDesktopWin",
                channel: 1003,
              }
            })
            .then(response => {
              commit('setupdateMessage', response.data.data);
              if (
                response.data.data &&
                response.data.data.version > remote.app.CocosDesktop
              ) {
                resData = true
              } else {
                resData = false
              }
            })
            .catch(function (error) {
              console.log(error);
            });
          return resData
        } catch (e) {
          console.log(e)
        }
      } else {
        try {
          await axios
            .get("http://backend.test.cjfan.net/getPolicyUrl", {
              params: {
                platform: "CocosDesktopMac",
                channel: 1004,
              }
            })
            .then(response => {
              commit('setupdateMessage', response.data.data);
              if (
                response.data.data &&
                response.data.data.version > remote.app.CocosDesktop
              ) {
                resData = true
              } else {
                resData = false
              }
            })
            .catch(function (error) {
              console.log(error);
            });
          return resData
        } catch (e) {
          console.log(e)
        }
      }
    }
  },
  plugins: [createPersistedState()]
})