/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;

const indexPath = `file://${__dirname}/index.html`;

const express = require('express');
const appExpress = express();
const io = require('socket.io')();
const os = require('os');



/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
//* Create LAN server
//* e.g http://192.168.1.66:9821/
const port = 9823;

function createLanServer() {
    appExpress.listen(port);
    appExpress.use(express.static(__dirname + '/public'));
    appExpress.get('/', (req, res) => {
        res.sendfile(`${__dirname}/server.html`);
    });
}
// createLanServer();



/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
//* Create main window

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
    win.openDevTools();
}



/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
//* ipcMain

// LAN Addresses
ipcMain.on('send-lan-ip', (e, arg) => {
    var interfaces = os.networkInterfaces();
    var addresses = [];
    for (var k in interfaces) {
        for (var k2 in interfaces[k]) {
            var address = interfaces[k][k2];
            if (address.family === 'IPv4' && !address.internal) {
                addresses.push(address.address);
            }
        }
    }
    e.sender.send('lan-addresses', {addresses, port});
});

// Create LAN Server
ipcMain.on('createLanServer', (e, arg) => {
    createLanServer();
});


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
//* Application

app.on('ready', () => {
    createMainWindow();
});

app.on('window-all-closed', () => {
    //* Try to close all windows if these exists
    app.quit();
})
