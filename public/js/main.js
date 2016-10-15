const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;
const shell = electron.shell;


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
//* ipcRenderer
var LANAddresses;

// Get LAN server
ipcRenderer.send('send-lan-ip');
ipcRenderer.on('lan-addresses', (event, arg) => {
    LANAddresses = arg;
  document.querySelector('.address').innerText = `${arg.addresses[0]}:${arg.port}`;
})



/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
/* # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
//* Event Trigger

var createLanServer = document.querySelector('.create-lan-server');
createLanServer.onclick = (e) => {
    shell.beep();
    ipcRenderer.send('createLanServer');
    createLanServer.style.display = 'none';
    shell.openExternal(`http://${LANAddresses.addresses[0]}:${LANAddresses.port}`);
}
