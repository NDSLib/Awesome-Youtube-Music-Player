import {BrowserWindow} from 'electron'

const {app} = require('electron')

let win: BrowserWindow | null

console.log('Running!')

const create = () => {
    win = new BrowserWindow({
        width: 400,
        height: 800,
        webPreferences: {
            nodeIntegration: true
        }
    })

    win.loadFile('../html/index.html')

    win.on('close', () => {
        win = null
    })
}

app.on('ready', () => {
    create()
})

app.on('window-all-closed', () => {
    if (process.platform === "darwin") {
        app.quit()
    }
})

app.on('activate', () => {
    if (win == null) {
        create()
    }
})