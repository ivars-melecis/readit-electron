// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const { ipcRenderer } = require('electron');
const items = require('./items');

// DOM nodes
let showModal = document.getElementById('show-modal');
let closeModal = document.getElementById('close-modal');
let modal = document.getElementById('modal');
let addItem = document.getElementById('add-item');
let itemUrl = document.getElementById('url');
let search = document.getElementById('search');

// Create funcs in window so that we can create shortcuts in system menu
window.newItem = () => {
  showModal.click();
};

window.openItem = items.open;
window.deleteItem = () => {
  let selectedItem = items.getSelectedItem();
  items.delete(selectedItem.index);
};
window.openItemNative = items.openNative;

window.searchItems = () => {
  search.focus();
};

search.addEventListener('keyup', (e) => {
  Array.from(document.getElementsByClassName('read-item')).forEach((item) => {
    let hasMatch = item.innerText.toLowerCase().includes(search.value);
    item.style.display = hasMatch ? 'flex' : ' none';
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    items.changeSelection(e.key);
  }
});

const toggleModalButtons = () => {
  if (addItem.disabled === true) {
    addItem.disabled = false;
    addItem.style.opacity = 1;
    addItem.innerText = 'Add Item';
    closeModal.style.display = 'inline';
  } else {
    addItem.disabled = true;
    addItem.style.opacity = 0.5;
    addItem.innerText = 'Adding...';
    closeModal.style.display = 'none';
  }
};

showModal.addEventListener('click', (e) => {
  modal.style.display = 'flex';
  itemUrl.focus();
});

closeModal.addEventListener('click', (e) => (modal.style.display = 'none'));

addItem.addEventListener('click', (e) => {
  if (itemUrl.value) {
    ipcRenderer.send('new-item', itemUrl.value);
    toggleModalButtons();
  }
});

//Listen for new item from main process

ipcRenderer.on('new-item-success', (e, newItem) => {
  // Add item to items node
  items.addItem(newItem, true);

  toggleModalButtons();

  modal.style.display = 'none';
  itemUrl.value = '';
});

// Listen to key event

itemUrl.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') addItem.click();
});
