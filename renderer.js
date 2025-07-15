const { Terminal } = require('@xterm/xterm');
const { ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
  const term = new Terminal({ cursorBlink: true });
  term.open(document.getElementById('terminal-container'));  term.focus();
  term.write('Terminal ready\r\n');

  term.onData(data => {
    ipcRenderer.send('terminal-input', data);
  });

  ipcRenderer.on('terminal-output', (event, data) => {
    term.write(data);
  });
});