/* eslint-disable no-new */
import Hasher from '../utils/utils'
export default class AuthorizedApp {
  constructor (_origin, _appkey) {
    this.origin = _origin
    this.appkey = _appkey
    this.nextNonce = ''
    this.createdAt = +new Date()
  }

  static placeholder () {
    return new AuthorizedApp()
  }
  static fromJson (json) {
    return Object.assign(this.placeholder(), json)
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
