const { app, BrowserWindow } = require('electron')
const path = require('path')

console.log("Hello, World!");

app.on('ready', () => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

function createWindow() {
  const win = new BrowserWindow({
    width: 428,
    height: 926,
    resizable: false,
    icon: path.join(__dirname, 'img/icons', 
      process.platform === 'win32' ? 'win.ico' :
      process.platform === 'darwin' ? 'mac.icns' :
      'linux.png'
    ),
    
  });
  win.setAspectRatio(9 / 16);
  win.setFullScreenable(false);
  win.setMenuBarVisibility(false);
  win.webContents.openDevTools();

  win.webContents.setWindowOpenHandler(() => {
    return { action: 'deny' };
  });

  win.loadFile('./html/index.html');
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});