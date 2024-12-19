import extensions from './existing-extensions.js';
import messages from './message-system.js';
const notFoundSvgText = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
  <rect x="2.5" y="2.5" width="595" height="395" rx="40" ry="40" stroke="gray" stroke-width="5"/>
  <text x="300" y="210" font-size="100" fill="red" font-family="Arial" text-anchor="middle" dominant-baseline="middle">Not Found</text>
</svg>
`
const notFoundSvgUrl = `data:image/svg+xml,${encodeURIComponent(notFoundSvgText)}`;
export default function createExtensionElements() {
  const extContainer = document.getElementById('extension-container');
  extensions.forEach(ext => {
    const extElement = document.createElement('img');
    extElement.ext = ext.path;
    extElement.src = `/src/extension-icons/${ext.path}.svg`;
    extElement.classList.add('extElement');
    extElement.onerror = function() {
      this.src = notFoundSvgUrl;
    };
    extElement.addEventListener('mouseover', () => {
      messages.broadcast('SHOW_INFO', ext.name, ext.description, ext.by);
    });
    extElement.addEventListener('mouseout', () => {
      messages.broadcast('REMOVE_INFO');
    });
    extElement.addEventListener('click', () => {
      messages.broadcast('EXTENSION_BUTTON', ext);
    });
    extContainer.appendChild(extElement);
  });
};