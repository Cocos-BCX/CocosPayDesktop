import store from '../store'
import WindowMessage from '../models/popups/WindowMessage'
const {
  ipcRenderer,
  remote
} = window.require('electron')
const path = window.require('path')
const url = window.require('url')

let pendingMessages = []
const getPending = msg => pendingMessages.find(x => x.id === msg.id)
const addPending = msg => pendingMessages.push(msg)
// const removePending = msg => pendingMessages = pendingMessages.filter(x => x.id !== msg.id)

ipcRenderer.on('result', (event, result) => {
  const pending = getPending(result.original)

  if (!pending) return
  pending.resolver(result.result)
})

const sendMessage = (windowId, type, data, resolver = null) => {
  const message = new WindowMessage(type, data, remote.getCurrentWindow().id, resolver)
  if (resolver) addPending(message)
  remote.BrowserWindow.fromId(windowId)
    .webContents
    .send(type, message)
}

const getWindow = (width = 800, height = 600) => new remote.BrowserWindow({
  width,
  height,
  frame: true,
  radii: [5, 5, 5, 5],
  icon: 'assets/icon.png',
  show: false,
  resizable: false
})
// getWindow.webContents.openDevTools()
// getWindow.webContents.on('did-frame-finish-load', () => {
//   // mainWindow.webContents.once('devtools-opened', () => {
//   //   mainWindow.focus()
//   // })
//   getWindow.webContents.openDevTools()
// })

let waitingPopup = getWindow(800, 600)

export default class WindowService {
  static openTools() {
    remote.getCurrentWindow().openDevTools()
  }

  static flashWindow() {
    remote.getCurrentWindow().flashFrame(true)
  }

  static sendAndWait(toWindowId, type, data = {}) {
    return new Promise(resolve => {
      sendMessage(toWindowId, type, data, resolve)
    })
  }

  static sendResult(original, result = null) {
    ipcRenderer.sendTo(original.windowId, 'result', {
      original,
      result
    })
  }

  static watch(type, handler) {
    ipcRenderer.on(type, (event, data) => handler(data))
  }

  static openPopOut(onReady = () => {}, onClosed = () => {}, width = 800, height = 600) {
    if (store.state.cocos.clone) {
      const clone = store.state.cocos.clone()
      clone.nonce++
      store.commit('setCocos', clone)
    }
    let win = waitingPopup
    if (!win) win = getWindow()
    else {
      win.on('closed', () => {
        onClosed(win)
        win = null
      })
    }
    win.setSize(800, 600)

    win.once('ready-to-show', () => {
      onReady(win)
      win.show()
      win.setAlwaysOnTop(true)
      win.focus()
      win.setAlwaysOnTop(false)
    })

    win.once('closed', () => {
      onClosed(win)
      win = null
      waitingPopup = getWindow(800, 600)
    })

    if (remote.process.mainModule.filename.indexOf('app.asar') === -1) {
      win.loadURL('http://localhost:9080/#/popout')
    } else {
      win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true,
        hash: '/popout'
      }))
    }
    return win
  }
}