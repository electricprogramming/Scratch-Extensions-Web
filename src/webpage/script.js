import extensions from './existing-extensions.js';
import createExtensionElements from './create-elements.js';
import messages from './message-system.js';
import settings from './settings.js';
import getExtFile from './get-ext-file.js';
import downloadFile from './download-file.js';
import getSearchResults from './get-search-results.js';
const searchBar = document.getElementById('search-bar');
const settingsButton = document.getElementById('settings-button');
const settingsModal = document.getElementById('settings-modal');
const settingsSizeSlider = document.getElementById('size-slider');
const settingsSizeDisplay = document.getElementById('size-value-display');
const settingsModeDropdown = document.getElementById('settings-mode-dropdown');
const settingsCloseBtn = document.getElementById('settings-close-button');
const settingsSaveBtn = document.getElementById('settings-save-button');
const extInfo = {
  container: document.getElementById('ext-info-container'),
  name: document.getElementById('ext-info-name'),
  author: document.getElementById('ext-info-author'),
  desc: document.getElementById('ext-info-description')
};
createExtensionElements();
messages.on('SHOW_INFO', (name, author, description) => {
  extInfo.name.textContent = name;
  extInfo.author.textContent = author;
  extInfo.desc.textContent = description;
  extInfo.container.style.opacity = 1;
});
messages.on('REMOVE_INFO', () => {
  extInfo.container.style.opacity = 0;
});
messages.on('EXTENSION_BUTTON', ext => {
  const extFile = getExtFile(ext.path);
  switch (settings.mode) {
    case 'copy':
      navigator.clipboard.writeText(extFile);
      break;
    case 'download':
      downloadFile(extFile, `${ext.path}.js`);
      break;
  }
}, 'process-extension-clicked');
searchBar.addEventListener('input', () => {
  const extElements = Array.from(document.querySelectorAll('.extElement')); // querySelectorAll returns a NodeList
  const searchResults = getSearchResults(extensions, searchBar.value).map(item => item.path);
  const resultElements = extElements.filter(el => searchResults.includes(el.ext));
  extElements.forEach((el) => {
    if (resultElements.includes(el)) {
      el.style.display = '';
    } else {
      el.style.display = 'none';
    }
  });
});
settingsSizeSlider.value = settings.size;
settingsSizeDisplay.textContent = settings.size;
settingsModeDropdown.value = settings.mode;
let sizeBeforeEdit, modeBeforeEdit;
settingsButton.addEventListener('click', () => {
  sizeBeforeEdit = settingsSizeSlider.value;
  modeBeforeEdit = settingsModeDropdown.value;
  settingsModal.style.display = 'flex';
});
settingsSizeSlider.addEventListener('input', function () {
  settingsSizeDisplay.textContent = this.value;
  settings.size = this.value;
});
settingsModeDropdown.addEventListener('input', function () {
  settings.mode = this.value;
});
settingsModal.close = function() {
  this.style.display = 'none';
}
settingsCloseBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to exit? Changes you made will not be saved.')) {
    settingsModal.close();
    settingsSizeSlider.value = sizeBeforeEdit;
    settingsSizeDisplay.textContent = sizeBeforeEdit;
    settings.size = sizeBeforeEdit;
    settingsModeDropdown.value = modeBeforeEdit;
    settings.mode = modeBeforeEdit;
  }
});
settingsSaveBtn.addEventListener('click', () => {
  settingsModal.close();
});