import extensions from './existing-extensions.js';
let extensionFiles = {};
// array of promises, one for each extension.
const promises = extensions.map(({ path }) => {
  return fetch(`/src/extension-code/${path}.js`)
    .then(res => {
      if (/javascript/i.test(res.headers.get('Content-Type'))) {
        return res.text();
      } else {
        throw new Error('Extension file is not a js file.');
      }
    })
    .then(file => {
      extensionFiles[path] = file;
    })
    .catch(e => {
      console.error(e);
      extensionFiles[path] = '';
    });
});

// Wait for all promises to resolve before exporting
await Promise.all(promises);
export default function getExtFile(path) {
  return extensionFiles[path];
}