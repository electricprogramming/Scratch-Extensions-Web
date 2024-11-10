import createExtensionElements from './create-elements.js';
import messages from '../message-system.js';
import settings from '../settings.js';
import getExtFile from '../get-ext-file.js';
import downloadFile from '../download-file.js';
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
}, 'extension-clicked-handler');