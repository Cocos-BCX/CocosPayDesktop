/* eslint-disable no-new */
import Hasher from '../utils/utils'
import AuthorizedApp from './authorizedApp'
export default class Cocos {
  constructor () {
    this.apps = []
  }
  updateOrPushApp (app) {
    this.apps.find(x => x.origin === app.origin)
      ? this.apps = this.apps.map(x => x.origin === app.origin ? app : x)
      : this.apps.unshift(app)
  }

  removeApp (app) {
    this.apps = this.apps.filter(x => x.origin !== app.origin)
  }
  clone () {
    return Cocos.fromJson(JSON.parse(JSON.stringify(this)))
  }
  findApp (origin) {
    return this.apps.find(x => x.origin === origin)
  }
  static placeholder () {
    return new Cocos()
  }
  static fromJson (json) {
    let p = Object.assign(this.placeholder(), json)
    if (json.hasOwnProperty('apps')) p.apps = json.apps.map(x => AuthorizedApp.fromJson(x))
    return p
  }
  checkKey (hashed) {
    return hashed === this.hashed()
  }
  hashed () {
    return Hasher.sha256Text(this.appkey)
  }
  checkNonce (nonce) {
    return this.nextNonce === Hasher.sha256Text(nonce)
  }
}
