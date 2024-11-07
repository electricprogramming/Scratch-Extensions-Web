function isMobile() {
  const userAgent = navigator.userAgent.toLowerCase();
  // Check for common mobile OS indicators in the userAgent string
  const mobileDevices = [
    'android',       // Android phones/tablets
    'iphone',        // iPhone
    'ipad',          // iPad
    'ipod',          // iPod touch
    'windows phone', // Windows phone
    'blackberry',    // Blackberry
    'mobile',        // General mobile marker
    'touch'          // Touch devices (more common for tablets/phones)
  ];
  // Check if any mobile indicators are present in the userAgent string
  return mobileDevices.some(device => userAgent.includes(device));
}
export default isMobile;
