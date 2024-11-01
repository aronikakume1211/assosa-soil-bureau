const { app, BrowserWindow, screen } = require("electron");
const path = require("path");

let win;

function createWindow() {
  // Get the primary screen’s dimensions
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  // Set window size based on the screen size (e.g., 80% of screen size)
  win = new BrowserWindow({
    width: Math.floor(width),
    height: Math.floor(height),
    webPreferences: {
      nodeIntegration: true,
    },
  });

  win.setMenuBarVisibility(false);

  win.loadURL(`file://${path.join(__dirname, "dist/index.html")}`);

  win.once("ready-to-show", () => {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    console.log(`Window dimensions: ${width}x${height}`);
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
