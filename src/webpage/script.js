import isMobile from './is-mobile.js';

if (typeof window !== 'undefined') {
  if (isMobile()) {
    document.documentElement.innerHTML = '';
    fetch('src/webpage/mobile/index.html')
      .then(response => response.text())
      .then(data => {
        document.body.innerHTML = data;
      })
      .catch(e => console.error(e));
  } else {
    document.documentElement.innerHTML = '';
    fetch('src/webpage/desktop/index.html')
      .then(response => response.text())
      .then(data => {
        document.body.innerHTML = data;
      })
      .catch(e => console.error(e));
  }
}