import extensions from './existing-extensions.js';
let extensionFiles = {};
// array of promises, one for each extension.
const promises = extensions.map(({ path }) => {
  return fetch(`../extension-code/${path}.js`)
    .then(res => res.text())
    .then(file => {
      extensionFiles[path] = file;
    })
    .catch(e => {
      console.error(e);
      extensionFiles[path] = '';
    });
});
function getExtFile(path) {
  return extensionFiles[path];
}
// Wait for all promises to resolve before exporting
await Promise.all(promises);
export default getExtFile;