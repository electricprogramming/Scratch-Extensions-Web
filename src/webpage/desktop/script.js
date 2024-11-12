import extensions from '../existing-extensions.js';
import createExtensionElements from './create-elements.js';
import messages from '../message-system.js';
import settings from '../settings.js';
import getExtFile from '../get-ext-file.js';
import downloadFile from '../download-file.js';
import getSearchResults from '../get-search-results.js';
createExtensionElements();
messages.on('EXTENSION_BUTTON', async (ext) => {
  const extFile = await getExtFile(ext.path);
  switch (settings.mode) {
    case 'copy':
      navigator.clipboard.writeText(extFile);
      break;
    case 'download':
      downloadFile(extFile, `${ext.path}.js`);
      break;
  }
}, 'process-extension-clicked');
const searchBar = document.getElementById('search-bar');
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
  })
});
const settingsButton = document.getElementById('settings-button');
settingsButton.addEventListener('mouseover', function() {
  this.style.transform = 'scale(1.1)';
})
settingsButton.addEventListener('mouseout', function() {
  this.style.transform = 'scale(1.0)';
})
settingsButton.addEventListener('click', () => {
  alert('you clicked on the settings button')
});