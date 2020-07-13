const { BrowserWindow } = require('electron');

let offscreenWindow;

module.exports = (url, callback) => {
  // Create window

  offscreenWindow = new BrowserWindow({
    width: 500,
    height: 500,
    show: false,
    webPreferences: {
      offscreen: true,
      nodeIntegration: false,
    },
  });

  // Load url
  offscreenWindow.loadURL(url);

  // Wait to finish loading

  offscreenWindow.webContents.on('did-finish-load', (e) => {
    let title = offscreenWindow.getTitle();

    // get screen
    offscreenWindow.webContents.capturePage((image) => {
      let screenshot = image.toDataURL();

      // run cb
      callback({
        title: title,
        screenshot: screenshot,
        url: url,
      });

      offscreenWindow.close();
      offscreenWindow = null;
    });
  });
};
