import AuthorizedApp from '../models/authorizedApp'
import store from '../store'
import {
  Popup
} from '../models/popups/Popup'
import PopupService from '../services/PopupService'
import ApiService from '../services/apiService'
import WindowService from '../services/WindowService'
const http = window.require('http')
let io = window.require('socket.io')()

let rekeyPromise
const getNewKey = socket => new Promise((resolve, reject) => {
  rekeyPromise = {
    resolve,
    reject
  }
  socket.emit('rekey')
})

const socketHandler = (socket) => {
  // When something connects we automatically
  // notify it of a successful connection
  socket.emit('connected')
  socket.on('rekeyed', async request => {
    rekeyPromise.resolve(request)
  })

  socket.on('pair', async request => {
    const cocos = store.state.cocos
    if (store.state.isLocked) {
      WindowService.openPopOut()
      return
    }
    let existingApp = cocos.findApp(request.data.origin)
    const linkApp = {
      type: 'linkApp',
      payload: request.data
    }
    if (request.data.passthrough) {
      return socket.emit('paired', existingApp && existingApp.checkKey(request.data.appkey))
    }
    const addAuthorizedApp = (newKey) => {
      const authedApp = new AuthorizedApp(request.data.origin, newKey || request.data.appkey)
      const clone = cocos.clone()
      clone.updateOrPushApp(authedApp)
      store.commit('setCocos', clone)
      socket.emit('paired', true)
    }

    const repair = async () => {
      const newKey = await getNewKey(socket)
      if (newKey.data.origin !== request.data.origin || newKey.data.appkey.indexOf('appkey:') === -1) return socket.emit('paired', false)
      addAuthorizedApp(newKey.data.appkey)
    }
    if (existingApp) {
      if (existingApp.checkKey(request.data.appkey)) {
        return socket.emit('paired', true)
      } else {
        PopupService.push(Popup.popout(linkApp, async ({
          result
        }) => {
          if (result) return repair()
          else socket.emit('paired', false)
        }))
      }
    } else return repair()
  })

  // All authenticated api requests pass through the 'api' route.
  socket.on('api', async request => {
    // 2 way authentication
    if (store.state.isLocked) {
      WindowService.openPopOut()
      return
    }
    if (!request.data.hasOwnProperty('appkey')) {
      socket.emit('api', 'lost app key')
    }
    const existingApp = store.state.cocos.findApp(request.data.payload.origin)
    const updateNonce = async () => {
      const clone = store.state.cocos.clone()
      existingApp.nextNonce = request.data.nextNonce
      clone.updateOrPushApp(existingApp)
      return store.commit('setCocos', clone)
    }

    const removeAppPermissions = async () => {
      const clone = store.state.cocos.clone()
      clone.removeApp(existingApp)
      return store.commit('setCocos', clone)
    }

    if (!existingApp) return
    if (!existingApp.checkKey(request.data.appkey)) return
    if (existingApp.nextNonce.length && !existingApp.checkNonce(request.data.nonce)) await removeAppPermissions()
    else await updateNonce()
    socket.emit('api',
      await ApiService.handler(Object.assign(request.data, {
        plugin: request.plugin
      }))
    )
  })
}

const ip = '127.0.0.1'
const isPortOpen = async port => new Promise(resolve => {
  const httpServer = http.createServer()
  httpServer.on('error', error => {
    console.log(error)
    resolve(false)
  })

  httpServer.listen(50005, ip)

  setTimeout(() => {
    httpServer.close()
    resolve(true)
  }, 400)
})

export default class SocketService {
  static async initialize() {
    const recurse = () => setTimeout(() => {
      this.initialize(true)
      // every ten minutes.
    }, 1000 * 60 * 10)
    if (!(await isPortOpen(50005))) return recurse()
    const options = {
      pingTimeout: 100000000000000000
    }

    // HTTP protocol (port 8888)
    const httpServer = http.createServer()
    await httpServer.listen(50005, ip)
    await io.attach(httpServer, options)
    this.open()
    recurse()
    return true
  }
  static open() {
    const namespace = io.of(`/Cocos-BCX`)
    namespace.on('connection', socket => socketHandler(socket))
  }

  static async close() {
    // Getting namespace
    if (!io) return
    const socket = io.of(`/Cocos-BCX`)

    // Disconnecting all active connections to this namespace
    Object.keys(socket.connected).map(socketId => {
      socket.connected[socketId].disconnect()
    })

    // Removing all event emitter listeners.
    socket.removeAllListeners()

    // Deleting the namespace from the array of
    // available namespaces for connections
    delete io.nsps[`/Cocos-BCX`]

    return true
  }
}