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
createExtensionElements();
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
settingsButton.addEventListener('click', () => {
  settingsModal.style.display = 'flex';
});
settingsSizeSlider.value = settings.size;
settingsModeDropdown.value = settings.mode;
settingsSizeSlider.addEventListener('input', function () {
  settingsSizeDisplay.textContent = this.value;
  settings.size = Number(this.value);
});
settingsModeDropdown.addEventListener('input', function () {
  settings.mode = this.value;
})