(function (Scratch) {
  'use strict';
  if(!Scratch.extensions.unsandboxed) {
    function xmlSafe(str) { return str.replace(/[\u0000-\u001F]/g, '�').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;') } function validId(str) { return str.replaceAll(/[^a-zA-Z0-9]/g, '') } class ErroredExtension { constructor(name) { this.name = name } getInfo() { return { id: `ERR${validId(this.name)}`, name: 'ERR', blocks: [{ blockType: Scratch.BlockType.XML, xml: `<label text="The ${xmlSafe(this.name)} extension"/><sep gap="-12"/><sep gap="12"/><sep gap="-10"/><label text="must run unsandboxed."/><sep gap="-12"/><sep gap="12"/>` },] } } }
    return Scratch.extensions.register(new ErroredExtension('Green Flag Utilities'));
  }
  const vm = Scratch.vm;
  let monitors = [];

  function getMonitorEl(i) {
    return document.querySelector(`div[class*=monitor][data-id="epMonitors_monitor${i}"] div div div`);
  }

  function applyMonitorPatch(i) {
    const monitor = getMonitorEl(i);
    if (monitor) {
      monitor.textContent = monitors[i].name;
      monitor.epTextPatchApplied = true;
    }
  }

  function isMonitorVisible(i) {
    return vm.runtime._monitorState._list.find(x => x[0] === `epMonitors_monitor${i}`)?.[1]?.visible && getMonitorEl(i);
  }

  class epMonitors {
    getInfo() {
      return {
        id: 'epMonitors',
        name: 'Custom Monitors',
        get menuIconURI() {
          return null;
        },
        // colors here
        get blocks () {
          return [
            {
              func: 'newMonitor',
              blockType: Scratch.BlockType.BUTTON,
              text: 'New Monitor'
            }
          ] 
        } 
      };
    }
    resetGFcount() {
      greenFlagCount = 0;
    }
    getGFcount() {
      if (isMonitorVisible() && !getMonitorEl().epTextPatchApplied) applyMonitorPatch();
      return greenFlagCount;
    }
  }
  vm.runtime.on('PROJECT_START', () => {
    greenFlagCount++;
    if (greenFlagCount === 1) {
      vm.runtime.startHats('epMonitors_onFirstGF');
    }
  })
  Scratch.extensions.register(new epMonitors());
})(Scratch);