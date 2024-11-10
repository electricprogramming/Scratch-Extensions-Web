import extensions from '../existing-extensions.js';
import messages from '../message-system.js';
const svgText = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">
  <rect x="2.5" y="2.5" width="595" height="395" rx="40" ry="40" stroke="gray" stroke-width="5"/>
  <text x="300" y="210" font-size="100" fill="red" font-family="Arial" text-anchor="middle" dominant-baseline="middle">Not Found</text>
</svg>
`
const notFoundSVG = `data:image/svg+xml,${encodeURIComponent(svgText)}`;
function createExtensionElements() {
  console.log('creating ext elements')
  const extContainer = document.getElementById('extension-container');
  extensions.forEach(ext => {
    const extElement = document.createElement('img');
    extElement.src = `/src/extension-icons/${ext.path}.svg`;
    extElement.classList.add('extElement');
    extElement.onerror = function() {
      this.src = notFoundSVG;
    };
    extElement.addEventListener('click', () => {
      messages.broadcast('EXTENSION_BUTTON', ext);
    });
    extElement.addEventListener('mouseover', function() {
      this.style.transform = 'scale(1.0)';
    });
    extElement.addEventListener('mouseout', function() {
      this.style.transform = 'scale(0.9)';
    })
    extContainer.appendChild(extElement);
  });
}
export default createExtensionElements;