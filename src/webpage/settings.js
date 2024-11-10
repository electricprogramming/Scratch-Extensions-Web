const settings = new class {
  #mode;
  #size;
  constructor() {
    this.#mode = 'copy';
    this.#size = 100;
    if (!('settings_mode' in localStorage)) localStorage.setItem('settings_mode', 'copy');
    if (!('settings_size' in localStorage)) localStorage.setItem('settings_size', 100);
  }
  get mode() {
    return this.#mode;
  }
  set mode(val) {
    if (['copy', 'download'].includes(val)) {
      this.#mode = val;
      localStorage.setItem('settings_mode', val);
      return true;
    }
    return false;
  }
  get size() {
    return this.#size;
  }
  set size(val) {
    if (typeof val === 'number' && val > 0 && val < 300) {
      this.#size = val;
      localStorage.setItem('settings_size', val);
      document.documentElement.style.setProperty('--size', val);
      return true;
    }
    if (typeof val === 'bigint' && val > 0n && val < 300n) {
      val = Number(val);
      this.#size = val;
      localStorage.setItem('settings_size', val);
      document.documentElement.style.setProperty('--size', val);
      return true;
    }
    return false;
  }
}
settings.mode = localStorage.getItem('settings_mode');
settings.size = Number(localStorage.getItem('settings_size'));
export default settings;