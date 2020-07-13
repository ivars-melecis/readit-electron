// Modules
const { remote, shell } = require('electron');

const template = [
  {
    label: 'Items',
    submenu: [
      {
        label: 'Add New',
        click: window.newItem,
        accelerator: 'CmdOrCtrl+O',
      },
      {
        label: 'Read Item',
        click: window.openItem,
        accelerator: 'CmdOrCtrl+Enter',
      },
      {
        label: 'Delete Item',
        click: window.deleteItem,
        accelerator: 'CmdOrCtrl+Backspace',
      },
      {
        label: 'Open in Browser',
        accelerator: 'CmdOrCtrl+Shift+O',
        click: window.openItemNative,
      },
      {
        label: 'Search Items',
        accelerator: 'CmdOrCtrl+S',
        click: window.searchItems,
      },
    ],
  },
  {
    role: 'editMenu',
  },
  {
    role: 'windowMenu',
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Learn more',
        click: () => {
          shell.openExternal('https://www.melecis.co.uk');
        },
      },
    ],
  },
];

// Set mac specific first menu

if (process.platform === 'darwin') {
  template.unshift({
    label: remote.app.getName(),
    submenu: [
      {
        role: 'about',
      },
      {
        type: 'separator',
      },
      {
        role: 'services',
      },
      {
        role: 'separator',
      },
      {
        role: 'hide',
      },
      {
        role: 'hideothers',
      },
      {
        role: 'unhide',
      },
      {
        role: 'separator',
      },
      {
        role: 'quit',
      },
    ],
  });
}

const menu = remote.Menu.buildFromTemplate(template);
remote.Menu.setApplicationMenu(menu);
