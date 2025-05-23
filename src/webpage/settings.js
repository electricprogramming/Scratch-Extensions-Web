const settings = new class {
  #mode;
  #size;
  constructor() {
    this.#mode = 'copy';
    this.#size = 100;
    if (!('settings_mode' in localStorage)) localStorage.setItem('settings_mode', 'copy');
    if (!('settings_size' in localStorage)) localStorage.setItem('settings_size', '100');
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
    if ((typeof val === 'bigint' && val >= 10n && val <= 300n) || (typeof val === 'number' && val >= 10 && val <= 300)) {
      val = Number(val);
    } else if (typeof val === 'string' && parseInt(val) == val && val >= 10 && val <= 300) {
      val = parseInt(val);
    } else {
      return false;
    }
    this.#size = val;
    document.documentElement.style.setProperty('--size', String(val));
    localStorage.setItem('settings_size', val);
    return true;
  }
}
settings.mode = localStorage.getItem('settings_mode');
settings.size = localStorage.getItem('settings_size');
export default settings;