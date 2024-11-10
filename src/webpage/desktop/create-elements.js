import extensions from '../existing-extensions.js';
const notFoundSVG = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2MDAgNDAwIiB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCI+PHJlY3QgeD0iMi41IiB5PSIyLjUiIHdpZHRoPSI1OTUiIGhlaWdodD0iMzk1IiByeD0iMjAiIHJ5PSIyMCIgc3Ryb2tlPSJncmF5IiBzdHJva2Utd2lkdGg9IjUiLz48dGV4dCB4PSIzMDAiIHk9IjIxMCIgZm9udC1zaXplPSIxMDAiIGZpbGw9InJlZCIgZm9udC1mYW1pbHk9IkFyaWFsIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0cmFuc2Zvcm09InJvdGF0ZSgtMjAgMzAwIDIwMCkiPk5vdCBGb3VuZDwvdGV4dD48L3N2Zz4=`
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
      messages.broadcast('EXTENSION_BUTTON', ext.path);
    });
    extElement.addEventListener('mouseover', function() {
      this.style.transform = 'scale(1.1)';
    });
    extElement.addEventListener('mouseout', function() {
      this.style.transform = 'scale(0)';
    })
    extContainer.appendChild(extElement);
  });
}
export default createExtensionElements;