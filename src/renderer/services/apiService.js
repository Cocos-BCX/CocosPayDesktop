import * as Actions from '../models/ApiActions'
import {
  GetBCXWithState
} from '../utils/bcx'
import store from '../store'
import CommonJs from '../config/common'
import I18n from '../languages'
import PopupService from '../services/PopupService'
import {
  Popup
} from '../models/popups/Popup'

const {
  remote
} = window.require('electron')
remote.getGlobal('appShared').ApiWatcher = (deepLink) => {
  ApiService.handleDeepLink(deepLink)
}

export default class ApiService {
  static async handleDeepLink(deepLink) {
    if (!deepLink) return
    let [type, payload] = deepLink.toString().split('Cocos-BCX://')[1].split('/?payload=')
    type = type.replace('/', '')
    if (payload) payload = decodeURI(payload)
    try {
      payload = JSON.parse(payload)
    } catch (e) {}
    if (typeof ApiService[type] !== 'undefined') ApiService[type](payload)
  }

  static async handler(request) {
    // Only accept pre-defined messages.
    if (!Object.keys(Actions).map(key => Actions[key]).includes(request.type)) return
    return await this[request.type](request)
  }

  static async [Actions.IDENTITY_FROM_PERMISSIONS](request) {
    return {
      id: request.id,
      result: store.state.cocosAccount.accounts,
    }
  }
  static async [Actions.GETACCOUNTINFO](request) {
    return {
      id: request.id,
      result: GetBCXWithState().getAccountInfo()
    }
  }
  static async [Actions.CALLCONTRACTFUNCTION](request) {
    return new Promise(resolve => {
      let response
      PopupService.push(Popup.popout(request, async ({
        result
      }) => {
        if (!result) {
          response = {
            id: request.id,
            result: 'signature_rejected:User rejected the transfer request'
          }
          return response
        }
        response = GetBCXWithState().callContractFunction({
          nameOrId: request.payload.nameOrId,
          functionName: request.payload.functionName,
          valueList: request.payload.valueList,
          runtime: request.payload.runtime,
          onlyGetFee: request.payload.onlyGetFee,
          callback: function (res) {
            if (res.code !== 1) {
              return resolve({
                // id: request.id,
                // message: CommonJs.getI18nMessages(I18n).error[res.code],
                // isError: true
                id: request.id,
                result: res
              })
            } else {
              store.dispatch('account/UserAccount')
              return resolve({
                id: request.id,
                result: res
              })
            }
          }
        })
      }))
    })
  }

  static async [Actions.REQUEST_TRANSFER](request) {
    return new Promise(resolve => {
      let response
      PopupService.push(Popup.popout(request, async ({
        result
      }) => {
        if (!result) {
          response = {
            id: request.id,
            result: 'signature_rejected:User rejected the transfer request'
          }
          return response
        }
        response = GetBCXWithState().transferAsset({
          fromAccount: store.state.cocosAccount.accounts,
          toAccount: request.payload.toAccount,
          amount: request.payload.amount,
          memo: request.payload.memo,
          assetId: request.payload.coin,
          isPropos: false,
          onlyGetFee: false
        }).then((res) => {
          if (res.code !== 1) {
            return resolve({
              // id: request.id,
              // message: CommonJs.getI18nMessages(I18n).error[res.code],
              // isError: true
              id: request.id,
              result: res
            })
          } else {
            store.dispatch('account/UserAccount')
            return resolve({
              id: request.id,
              result: res,
            })
          }
        })
      }))
    })
  }
}