const fs = require('fs');
const { shell } = require('electron');

let items = document.getElementById('items');

// Get readerjs contents
let readerJS = null;

fs.readFile(
  `${__dirname}/reader.js`,
  (err, data) => (readerJS = data.toString())
);

// Track items in storage
exports.storage = JSON.parse(localStorage.getItem('readit-items')) || [];

window.addEventListener('message', (e) => {
  if (e.data.action === 'delete-reader-item') {
    this.delete(e.data.itemIndex);
    e.source.close();
  }
});

exports.delete = (itemIndex) => {
  items.removeChild(items.childNodes[itemIndex]);
  this.storage.splice(itemIndex, 1);
  this.save();

  if (this.storage.length) {
    let newSelectedItemIndex = itemIndex === 0 ? 0 : itemIndex - 1;

    document
      .getElementsByClassName('read-item')
      [newSelectedItemIndex].classList.add('selected');
  }
};

// get seelcted index

exports.getSelectedItem = () => {
  let currentItem = document.getElementsByClassName('read-item selected')[0];
  let itemIndex = 0;
  let child = currentItem;

  while ((child = child.previousSibling) != null) itemIndex++;

  return {
    node: currentItem,
    index: itemIndex,
  };
};

exports.save = () => {
  localStorage.setItem('readit-items', JSON.stringify(this.storage));
};

exports.changeSelection = (direction) => {
  let currItem = this.getSelectedItem();
  if (direction === 'ArrowUp' && currItem.node.previousSibling) {
    currItem.node.classList.remove('selected');
    currItem.node.previousSibling.classList.add('selected');
  }

  if (direction === 'ArrowDown' && currItem.node.nextElementSibling) {
    currItem.node.classList.remove('selected');
    currItem.node.nextElementSibling.classList.add('selected');
  }
};

exports.openNative = () => {
  if (!this.storage.length) return;
  let selectedItem = this.getSelectedItem();

  shell.openExternal(selectedItem.node.dataset.url);
};

exports.open = () => {
  if (!this.storage.length) return;

  let selectedItem = this.getSelectedItem();

  let contentURL = selectedItem.node.dataset.url;
  console.log('opening', contentURL);

  let readerWin = window.open(
    contentURL,
    '',
    `
    maxWidth = 2000,
    maxHeight = 2000,
    width = 1200,
    height = 800,
    nodeIntegration = 0,
    contentIsolation = 1
  `
  );

  // Inject JS
  readerWin.eval(readerJS.replace("'**{{index}}**'", selectedItem.index));
};

// Set item as selected
exports.select = (e) => {
  this.getSelectedItem().node.classList.remove('selected');

  e.currentTarget.classList.add('selected');
};

// Add new item
exports.addItem = (item, isNew = false) => {
  let itemNode = document.createElement('div');
  itemNode.setAttribute('class', 'read-item');

  itemNode.innerHTML = `<img src="${item.screenshot}"/><h2>${item.title}</h2>`;
  items.appendChild(itemNode);

  itemNode.setAttribute('data-url', item.url);

  itemNode.addEventListener('click', this.select);

  itemNode.addEventListener('dblclick', this.open);

  if (document.getElementsByClassName('read-item').length === 1) {
    itemNode.classList.add('selected');
  }

  if (isNew) {
    this.storage.push(item);
    this.save();
  }
};

// Add items from storage when app loads

this.storage.forEach((item) => {
  this.addItem(item, false);
});
