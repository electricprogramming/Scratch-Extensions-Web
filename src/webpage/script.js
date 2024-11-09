import isMobile from './is-mobile.js';

if (typeof window !== 'undefined') {
  if (isMobile()) {
    document.body.innerHTML = '';
    fetch('/mobile/index.html')
      .then(response => response.text())
      .then(data => {
        document.body.innerHTML = data;
      })
      .catch(e => console.error(e));
  } else {
    document.body.innerHTML = '';
    fetch('/desktop/index.html')
      .then(response => response.text())
      .then(data => {
        document.body.innerHTML = data;
      })
      .catch(e => console.error(e));
  }
}