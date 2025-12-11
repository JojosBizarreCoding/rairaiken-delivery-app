const { app, BrowserWindow} = require('electron')

console.log("Hello, World!");

app.on('ready', () => {
  createWindow()
})

function createWindow() {

// In the main process.
  const win = new BrowserWindow({ width: 428, height: 926 });
  win.setAspectRatio(9 / 16);
  win.setFullScreenable(false);

  // Load a remote URL
  win.loadURL('https://jeav2.github.io/')
}