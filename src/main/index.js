'use strict'

import {
  app,
  Menu,
  BrowserWindow,
  ipcMain
} from 'electron'
import installExtension, {
  REACT_DEVELOPER_TOOLS
} from 'electron-devtools-installer'
global.appShared = {
  ApiWatcher: null
}

installExtension(REACT_DEVELOPER_TOOLS.id)
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development' ?
  `http://localhost:9080` :
  `file://${__dirname}/index.html`

const callDeepLink = url => {
  if (global.appShared.ApiWatcher !== null) {
    global.appShared.ApiWatcher(url)
  }
}

ipcMain.on('language', (event, arg) => {
  console.log(arg) // prints "ping"
})

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 900,
    useContentSize: true,
    width: 1200,
    minWidth: 1000,
    minHeight: 800
  })

  mainWindow.loadURL(winURL)
  // if (process.env.NODE_ENV !== 'development') {
  const template = [{
      label: 'COCOSPAY',
      submenu: [{
        label: 'About Us',
        click() {
          require('electron').shell.openExternal('https://www.cocosbcx.io/')
        }
      }]
    },
    {
      label: 'Edit',
      submenu: [{
          label: 'Undo',
          accelerator: 'CmdOrCtrl+Z',
          selector: 'undo:'
        },
        {
          label: 'Redo',
          accelerator: 'Shift+CmdOrCtrl+Z',
          selector: 'redo:'
        },
        {
          type: 'separator'
        },
        {
          label: 'Cut',
          accelerator: 'CmdOrCtrl+X',
          selector: 'cut:'
        },
        {
          label: 'Copy',
          accelerator: 'CmdOrCtrl+C',
          selector: 'copy:'
        },
        {
          label: 'Paste',
          accelerator: 'CmdOrCtrl+V',
          selector: 'paste:'
        },
        {
          label: 'Select All',
          accelerator: 'CmdOrCtrl+A',
          selector: 'selectAll:'
        },
        {
          label: 'Quit',
          accelerator: 'CmdOrCtrl+Q',
          click() {
            app.quit()
          }
        }
      ]
    }
  ]
  let menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
  // }
  // if (process.env.NODE_ENV !== 'development') {
  //   mainWindow.webContents.on('did-frame-finish-load', () => {
  //     // mainWindow.webContents.once('devtools-opened', () => {
  //     //   mainWindow.focus()
  //     // })
  //     mainWindow.webContents.openDevTools()
  //   })
  // }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
  mainWindow.webContents.session.on('will-download', (event, item, webContents) => {
    // Set the save path, making Electron not to prompt a save dialog.
    item.on('updated', (event, state) => {
      if (state === 'interrupted') {
        console.log('Download is interrupted but can be resumed')
      } else if (state === 'progressing') {
        if (item.isPaused()) {
          console.log('Download is paused')
        } else {
          console.log(`Received bytes: ${item.getReceivedBytes()}`)
        }
      }
    })
    item.once('done', (event, state) => {
      if (state === 'completed') {
        console.log('Download successfully')
      } else {
        console.log(`Download failed: ${state}`)
      }
    })
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
ipcMain.on('closes', e => mainWindow.close())

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

app.on('will-finish-launching', () => {
  app.on('open-url', (e, url) => {
    e.preventDefault()
    callDeepLink(url)
  })
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */