const { app, BrowserWindow } = require('electron')

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

  // In the main process.
  const win = new BrowserWindow({
    width: 428, height: 926, resizable: false,
  });
  win.setAspectRatio(9 / 16);
  win.setFullScreenable(false);
  win.setMenuBarVisibility(false);
  win.webContents.openDevTools();

  win.loadFile('./html/index.html');
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});