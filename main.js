// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const pty = require('node-pty');

icon: 'coolgui.ico'

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webviewTag: true,
      preload: path.join(__dirname, 'preload.js')
    },
  });

  // and load the index.html of the app.
  win.loadFile('index.html');

  // Initialize shell
  const shell = pty.spawn('cmd.exe', [], {
    name: 'xterm-color',
    cwd: process.cwd(),
    env: process.env,
  });

  // Forward shell output to renderer
  shell.onData(data => {
    win.webContents.send('terminal-output', data);
  });

  // Receive keystrokes from renderer
  ipcMain.on('terminal-input', (event, input) => {
    console.log('User typed:', input); // Debug log
    shell.write(input);
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
if (require('electron-squirrel-startup')) app.quit();
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
