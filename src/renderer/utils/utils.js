import Sha from 'jssha'
import crypto from 'crypto'
import BCX from "bcxjs-api";
import ByteArray from './ByteArray'
import {
  ec as EC
} from 'elliptic'
import {
  keccak256
} from 'js-sha3'

import {
  ENCRYPTION_ALGORITHM
} from './constants'

const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'

export default class utils {
  static sha256Text(string) {
    const shaObj = new Sha('SHA-256', 'TEXT')
    shaObj.update(string)
    return shaObj.getHash('HEX')
  }

  static sha256(string) {
    const shaObj = new Sha('SHA-256', 'HEX')
    shaObj.update(string)
    return shaObj.getHash('HEX')
  }

  /**
   * hash password to save local
   * @param {password} string
   */
  static hashPassword(string) {
    return this.sha256(this.stringToHex(string + '!~%$#^&*'))
  }

  static validateAddress(address) {
    if (address.length !== 34) {
      return false
    }

    const prefix = this.base58ToHex(address).substr(0, 2)

    return false
  }

  static init(Node) {
    return new BCX({
      default_ws_node: Node.ws,
      ws_node_list: [{
        url: Node.ws,
        name: Node.name
      }],
      networks: [{
        core_asset: "COCOS",
        chain_id: Node.chainId
      }],
      faucet_url: Node.url,
      auto_reconnect: false,
      worker: false
    });
  }

  static privateKeyToPublicKey(privateKey) {
    const ec = new EC('secp256k1')
    const key = ec.keyFromPrivate(privateKey, 'bytes')
    const publicKey = key.getPublic()

    const {
      x,
      y
    } = publicKey

    let xHex = x.toString('hex')
    let yHex = y.toString('hex')

    while (xHex.length < 64) {
      xHex = `0${xHex}`
    }

    while (yHex.length < 64) {
      yHex = `0${yHex}`
    }

    const publicKeyHex = `04${xHex}${yHex}`

    return ByteArray.fromHexString(publicKeyHex)
  }

  static privateKeyToAddress(privateKey) {
    const privateKeyBytes = ByteArray.fromHexString(privateKey)
    const publicKeyBytes = this.privateKeyToPublicKey(privateKeyBytes)
    const addressBytes = this.publicKeyToAddress(publicKeyBytes)

    return this.hexToBase58(
      ByteArray.toHexString(addressBytes)
    )
  }

  static publicKeyToAddress(pubKey) {
    const publicKey = (pubKey.length === 65) ? pubKey.slice(1) : pubKey
    const hash = keccak256(publicKey).toString()

    return ByteArray.fromHexString(address)
  }

  static validatePrivateKey(privateKey) {
    try {
      const address = this.privateKeyToAddress(privateKey)
      return this.validateAddress(address)
    } catch (e) {
      return false
    }
  }

  static isFunction(obj) {
    return typeof obj === 'function'
  }

  static isHex(string) {
    return typeof string === 'string' && !isNaN(parseInt(string, 16))
  }

  static isInteger(number) {
    return Number.isInteger(
      Number(number)
    )
  }

  static isString(string) {
    return Object.prototype.toString.call(string) === '[object String]'
  }

  static stringToHex(string) {
    return Buffer.from(string).toString('hex')
  }

  static hexToString(hex) {
    return Buffer.from(hex, 'hex').toString()
  }

  static encrypt(data, password, algorithm = ENCRYPTION_ALGORITHM) {
    const cipher = crypto.createCipher(algorithm, password)
    let crypted = cipher.update(data, 'utf8', 'hex')
    crypted += cipher.final('hex')
    return crypted
  }

  static decrypt(data, password, algorithm = ENCRYPTION_ALGORITHM) {
    const decipher = crypto.createDecipher(algorithm, password)
    let decrypted = decipher.update(data, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
  }

  static injectPromise(func, ...args) {
    return new Promise((resolve, reject) => {
      func(...args, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }

  static strippedHost() {
    let host = window.location.hostname
    if (host.indexOf('www.') === 0) host = host.replace('www.', '')
    return host
  }
  // get system language
  static getLanguage() {
    let lang = ''
    if (window.navigator.appName === 'Netscape') {
      lang = window.navigator.language
    } else {
      lang = window.navigator.browserLanguage
    }

    if (lang.indexOf('zh') > -1) {
      lang = 'zh'
    } else if (lang.indexOf('en') > -1) {
      lang = 'en'
    } else {
      lang = 'en'
    }
    return lang
  }

  static toUtf8(hex) {
    hex = hex.replace(/^0x/, '')
    return Buffer.from(hex, 'hex').toString('utf8')
  }

  static byte2hexStr(byte) {
    const hexByteMap = '0123456789ABCDEF'
    let str = ''
    str += hexByteMap.charAt(byte >> 4)
    str += hexByteMap.charAt(byte & 0x0f)
    return str
  }

  static byteArray2hexStr(byteArray) {
    return byteArray.reduce((string, byte) => {
      return string + this.byte2hexStr(byte)
    }, '')
  }

  static hexToBase58(string) {
    const primary = this.sha256(string)
    const secondary = this.sha256(primary)

    const buffer = ByteArray.fromHexString(string + secondary.slice(0, 8))
    const digits = [0]

    for (let i = 0; i < buffer.length; i++) {
      for (let j = 0; j < digits.length; j++) {
        digits[j] <<= 8
      }

      digits[0] += buffer[i]

      let carry = 0

      for (let j = 0; j < digits.length; ++j) {
        digits[j] += carry
        carry = (digits[j] / 58) | 0
        digits[j] %= 58
      }

      while (carry) {
        digits.push(carry % 58)
        carry = (carry / 58) | 0
      }
    }

    for (let i = 0; buffer[i] === 0 && i < buffer.length - 1; i++) {
      digits.push(0)
    }

    return digits.reverse().map(digit => ALPHABET[digit]).join('')
  }

  static base58ToHex(string) {
    const bytes = [0]

    for (let i = 0; i < string.length; i++) {
      const char = string[i]

      if (!ALPHABET.includes(char)) {
        throw new Error('Non-base58 character')
      }

      for (let j = 0; j < bytes.length; j++) {
        bytes[j] *= 58
      }

      bytes[0] += ALPHABET.indexOf(char)

      let carry = 0

      for (let j = 0; j < bytes.length; ++j) {
        bytes[j] += carry
        carry = bytes[j] >> 8
        bytes[j] &= 0xff
      }

      while (carry) {
        bytes.push(carry & 0xff)
        carry >>= 8
      }
    }

    for (let i = 0; string[i] === '1' && i < string.length - 1; i++) {
      bytes.push(0)
    }

    return bytes.reverse().slice(0, 21).map(byte => {
      let temp = byte.toString(16)

      if (temp.length === 1) {
        temp = `0${temp}`
      }

      return temp
    }).join('')
  }

  static base64ToHex(string) {
    const bin = atob(string.replace(/[ \r\n]+$/, ''))
    const hex = []

    for (let i = 0; i < bin.length; i++) {
      let temp = bin.charCodeAt(i).toString(16)

      if (temp.length === 1) {
        temp = `0${temp}`
      }

      hex.push(temp)
    }

    return hex.join('')
  }

  static transformAddress(address) {
    if (!this.isString(address)) {
      return false
    }

    switch (address.length) {
      case 42: {
        // hex -> base58
        return this.transformAddress(
          this.hexToBase58(address)
        )
      }
      case 28: {
        // base64 -> base58
        const hex = this.base64ToHex(address)
        const base58 = this.hexToBase58(hex)

        return this.transformAddress(base58)
      }
      case 34: {
        // base58
        const isAddressValid = this.validateAddress(address)

        if (isAddressValid) {
          return address
        }

        return false
      }
    }
  }

  static compare(x, y) {
    if (x === y) {
      return true
    }
    if (!(x instanceof Object) || !(y instanceof Object)) {
      return false
    }
    if (x.constructor !== y.constructor) {
      return false
    }

    for (var p in x) {
      if (x.hasOwnProperty(p)) {
        if (!y.hasOwnProperty(p)) {
          return false
        }

        if (x[p] === y[p]) {
          continue
        }

        if (typeof (x[p]) !== 'object') {
          return false
        }

        if (!Object.equals(x[p], y[p])) {
          return false
        }
      }
    }

    for (p in y) {
      if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
        return false
      }
    }
    return true
  }

  // gen Ecc priKey for bytes
  static genPriKey() {
    let ec = new EC('secp256k1')
    let key = ec.genKeyPair()
    let priKey = key.getPrivate()
    let priKeyHex = priKey.toString('hex')
    while (priKeyHex.length < 64) {
      priKeyHex = '0' + priKeyHex
    }

    return ByteArray.fromHexString(priKeyHex)
  }

  static generateAccount() {
    let priKeyBytes = this.genPriKey()
    let privateKey = ByteArray.toHexString(priKeyBytes)
    let address = this.privateKeyToAddress(privateKey)
    // let password = base64EncodeToString(priKeyBytes)
    return {
      privateKey,
      address
    }
  }
}