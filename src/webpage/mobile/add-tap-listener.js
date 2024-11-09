function addTapListener(el, handler) {
  let touchStartTime = 0;
  let touchStartX = 0;
  let touchStartY = 0;
  function convertToElementCoordinates(clientX, clientY) {
    const rect = el.getBoundingClientRect();
    if (el instanceof SVGElement) {
      const viewBox = el.viewBox.baseVal;
      const scaleX = viewBox.width / rect.width;
      const scaleY = viewBox.height / rect.height;
      const svgX = (clientX - rect.left) * scaleX;
      const svgY = (clientY - rect.top) * scaleY;
      return {
        x: svgX,
        y: svgY
      };
    }
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }
  function isTouchInsideElement(clientX, clientY) {
    const rect = el.getBoundingClientRect();
    return clientX >= rect.left && clientX <= rect.right &&
      clientY >= rect.top && clientY <= rect.bottom;
  }
  el.addEventListener('touchstart', function(event) {
    const touch = event.touches[0];
    touchStartTime = Date.now();
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
  });
  el.addEventListener('touchend', function(event) {
    const touchEndTime = Date.now();
    const timeDifference = touchEndTime - touchStartTime;
    const touch = event.changedTouches[0];
    const touchEndX = touch.clientX;
    const touchEndY = touch.clientY;
    const isStartInside = isTouchInsideElement(touchStartX, touchStartY);
    const isEndInside = isTouchInsideElement(touchEndX, touchEndY);
    if (timeDifference < 200 && isStartInside && isEndInside) {
      try {
        handler();
      } catch (err) {
        console.error(err);
      }
    }
  });
}
export default addTapListener;