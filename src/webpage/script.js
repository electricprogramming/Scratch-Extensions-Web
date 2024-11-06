import extensions from '../existing-extensions.js';
import getSearchResults from './get-search-results.js';
extensions.forEach((extension) => {
  const extButton = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  extButton.id = extension.path;
  extButton.src = `../extension-icons/${extension.path}.svg`;
  extButton.width = 300; extButton.height = 200;
})
