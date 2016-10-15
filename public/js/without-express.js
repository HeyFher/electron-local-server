const electron = require('electron');
const BrowserWindow = electron.BrowserWindow;
const app = electron.app;

const httpServer = require('http').createServer(handler);
const io = require('socket.io')(httpServer);
const fs = require('fs');

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

const indexPath = `file://${__dirname}/index.html`;

function createMainWindow() {
    var win = new BrowserWindow({
        width: 1200,
        minWidth: 1000,
        height: 680,
        minHeight: 680,
        title: 'Hola Mundo',
        center: true,
        show: false,
        frame: true,
        hasShadow: false
    });

    win.once('ready-to-show', () => { win.show() });
    win.on('closed', () => { win = null });

    win.loadURL(indexPath);
    // win.openDevTools();
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

httpServer.listen(8080);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

app.on('ready', () => {
    createMainWindow();
});

app.on('window-all-closed', () => {
    //* Try to close all windows if these exists
    app.quit();

    //* Close the server when all windows are closed
    httpServer.close();
})
