import isMobile from './is-mobile.js';
if (typeof window !== 'undefined') {
  if (isMobile()) {
    document.documentElement.innerHTML = '';
    fetch('src/webpage/mobile/index.html')
      .then(response => response.text())
      .then(html => {
        document.open();
        document.write(html);
        document.close();
      })
      .catch(e => console.error(e));
  } else {
    document.documentElement.innerHTML = '';
    fetch('src/webpage/desktop/index.html')
      .then(response => response.text())
      .then(html => {
        document.open();
        document.write(html);
        document.close();
      })
      .catch(e => console.error(e));
  }
}