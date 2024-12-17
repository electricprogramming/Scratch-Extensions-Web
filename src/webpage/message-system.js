class messageSystem {
  #handlers;
  constructor() {
    this.#handlers = {};
  }
  get handlers() {
    let res = {}
    for (let [id,{messageName, handler}] of Object.entries(this.#handlers)) {
      handler = handler.bind({});
      res[id] = {messageName, handler};
    }
    return res;
  }
  on(messageName, handler, handlerId, overwrite) {
    if (messageName == null) return false;
    if (typeof handler !== 'function') return false;
    if (typeof handlerId !== 'string' || handlerId.length === 0) return false;
    if (handlerId in this.#handlers && !overwrite) return false;
    handler = handler.bind({});
    this.#handlers[handlerId] = { messageName, handler }
    return true;
  }
  delete(handlerId) {
    if (handlerId in this.#handlers) {
      delete this.#handlers[handlerId];
      return true;
    } else return false;
  }
  broadcast(message, ...args) {
    if (typeof message !== 'string') return false;
    let flag = false;
    for (const [id,{messageName, handler}] of Object.entries(this.#handlers)) {
      if (message === messageName) {
        flag = true;
        try {
          handler(...args);
        } catch {}
      }
    }
    return flag;
  }
};
const messages = new messageSystem;
export default messages; // Global instance, different modules can broadcast to each other.
export {messageSystem as LocalMessageSystem}; // Class, use `new LocalMessageSystem()` to create a local message system.