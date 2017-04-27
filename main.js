const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
let mainWindow;
const template = [
  {
    label: 'File',
    submenu: [

      {
        label: 'New File',
        accelerator: 'CmdOrCtrl+N',
        click(item, focusedWindow) {
          mainWindow.webContents.executeJavaScript(`newFile()`);
        }
      },
      {
        label: 'Open',
        accelerator: 'CmdOrCtrl+O',
        click(item, focusedWindow) {
          dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [
              { name: 'All Files', extensions: ['html'] }
            ]
          }, getFile)
        }
      },
      {
        label: 'Save',
        accelerator: 'CmdOrCtrl+S',
        click(item, focusedWindow) {
          mainWindow.webContents.executeJavaScript(`saveFile()`);
        }
      },
      {
        label: 'Save As',
        accelerator: 'CmdOrCtrl+Shift+S',
        click(item, focusedWindow) {
          dialog.showSaveDialog({
            properties: ['saveFile'],
            filters: [
              { name: 'All Files', extensions: ['html'] }
            ]
          }, saveFile)
        }
      }
    ]
  }];

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)

function getFile(fileName) {
  mainWindow.webContents.executeJavaScript(`loadFile(\`${escape(fileName[0])}\`)`);
}

function saveFile(fileName) {
  mainWindow.webContents.executeJavaScript(`saveFile(\`${escape(fileName)}\`)`);
}

ipcMain.on('save-dialog', () => {
  dialog.showSaveDialog({
    properties: ['saveFile'],
    filters: [
      { name: 'All Files', extensions: ['html'] }
    ]
  }, saveFile)
});


function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800, height: 600, webPreferences: {
      experimentalFeatures: true,
    }
  })
  mainWindow.loadURL(`file://${__dirname}/index.html`)
  // mainWindow.toggleDevTools();
  mainWindow.on('closed', function () {
    mainWindow = null
  });
  if (process.platform == 'win32' && process.argv.length >= 2) {
    var openFilePath = process.argv[1];
    getFile([openFilePath]);
  }
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
});