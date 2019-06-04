/* eslint-disable no-new */
import IdGenerator from '../../utils/idGenerator'

export default class WindowMessage {
  constructor (type, data, windowId, resolver) {
    this.id = IdGenerator.numeric(24)
    this.type = type
    this.data = data
    this.windowId = windowId
    this.resolver = resolver
  }

  static placeholder () { return new WindowMessage() }
  static fromJson (json) { return Object.assign(this.placeholder(), json) }
}
