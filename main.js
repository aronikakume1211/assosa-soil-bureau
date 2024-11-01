const { app, BrowserWindow, screen, dialog } = require("electron");
const path = require("path");
const { autoUpdater } = require("electron-updater");

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

app.whenReady().then(() => {
  createWindow();
  // Set up auto-updater event handlers
  autoUpdater.on("update-available", () => {
    dialog.showMessageBox({
      type: "info",
      title: "Update Available",
      message: "A new version is available. Downloading now...",
    });
  });

  autoUpdater.on("update-downloaded", () => {
    dialog
      .showMessageBox({
        type: "info",
        title: "Update Ready",
        message: "Install and restart now?",
        buttons: ["Restart", "Later"],
      })
      .then((result) => {
        if (result.response === 0) autoUpdater.quitAndInstall();
      });
  });

  autoUpdater.on("error", (err) => {
    dialog.showErrorBox(
      "Error: ",
      err == null ? "unknown" : (err.stack || err).toString()
    );
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
