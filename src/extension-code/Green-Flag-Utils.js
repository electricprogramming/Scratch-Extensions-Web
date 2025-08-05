(function (Scratch) {
  'use strict';
  if(!Scratch.extensions.unsandboxed) {
    function xmlSafe(str) { return str.replace(/[\u0000-\u001F]/g, '�').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;') } function validId(str) { return str.replaceAll(/[^a-zA-Z0-9]/g, '') } class ErroredExtension { constructor(name) { this.name = name } getInfo() { return { id: `ERR${validId(this.name)}`, name: 'ERR', blocks: [{ blockType: Scratch.BlockType.XML, xml: `<label text="The ${xmlSafe(this.name)} extension"/><sep gap="-12"/><sep gap="12"/><sep gap="-10"/><label text="must run unsandboxed."/><sep gap="-12"/><sep gap="12"/>` },] } } }
    return Scratch.extensions.register(new ErroredExtension('Green Flag Utilities'));
  }
  const vm = Scratch.vm;
  const greenFlagSVG = (function(){
return `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHBhdGggZD0iTTIwLjggMy43Yy0uNC0uMi0uOS0uMS0xLjIuMi0yIDEuNi00LjggMS42LTYuOCAwLTIuMy0xLjktNS42LTIuMy04LjMtMXYtLjRjMC0uNi0uNS0xLTEtMXMtMSAuNC0xIDF2MTguOGMwIC41LjUgMSAxIDFoLjFjLjUgMCAxLS41IDEtMXYtNi40YzEtLjcgMi4xLTEuMiAzLjQtMS4zIDEuMiAwIDIuNC40IDMuNCAxLjIgMi45IDIuMyA3IDIuMyA5LjggMCAuMy0uMi40LS41LjQtLjlWNC43YzAtLjUtLjMtLjktLjgtMW0tLjMgMTAuMkMxOCAxNiAxNC40IDE2IDExLjkgMTRjLTEuMS0uOS0yLjUtMS40LTQtMS40LTEuMi4xLTIuMy41LTMuNCAxLjFWNGMyLjUtMS40IDUuNS0xLjEgNy43LjYgMi40IDEuOSA1LjcgMS45IDguMSAwaC4ybC4xLjF6IiBzdHlsZT0iZmlsbDojNDU5OTNkIi8+PHBhdGggZD0ibTIwLjYgNC44LS4xIDkuMXYuMWMtMi41IDItNi4xIDItOC42IDAtMS4xLS45LTIuNS0xLjQtNC0xLjQtMS4yLjEtMi4zLjUtMy40IDEuMVY0YzIuNS0xLjQgNS41LTEuMSA3LjcuNiAyLjQgMS45IDUuNyAxLjkgOC4xIDBoLjJjMCAuMS4xLjEuMS4yIiBzdHlsZT0iZmlsbDojNGNiZjU2Ii8+PC9zdmc+`
  })();

  function getMonitor() {
    return document.querySelector('*[class*=monitor][data-id="epUtilities_getGFcount"] div div div');
  }

  function applyMonitorPatch() {
    const monitor = getMonitor();
    if (monitor) {
      monitor.textContent = '# of times green flag clicked';
      monitor.epTextPatchApplied = true;
    }
  }

  function isMonitorVisible() {
    return vm.runtime._monitorState._list.find(x => x[0] === 'epUtilities_getGFcount')[1].visible;
  }

  let greenFlagCount = 0;
  class epGreenFlag {
    getInfo() {
      return {
        id: 'epGreenFlag',
        name: 'Green Flag Utilities',
        get menuIconURI() {
          return `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTIiIGZpbGw9IiNGRkJGMDAiIC8+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTIsMTIpIHNjYWxlKDAuOCkgdHJhbnNsYXRlKC0xMSwgLTEyKSI+PHBhdGggZD0iTTIwLjggMy43Yy0uNC0uMi0uOS0uMS0xLjIuMi0yIDEuNi00LjggMS42LTYuOCAwLTIuMy0xLjktNS42LTIuMy04LjMtMXYtLjRjMC0uNi0uNS0xLTEtMXMtMSAuNC0xIDF2MTguOGMwIC41LjUgMSAxIDFoLjFjLjUgMCAxLS41IDEtMXYtNi40YzEtLjcgMi4xLTEuMiAzLjQtMS4zIDEuMiAwIDIuNC40IDMuNCAxLjIgMi45IDIuMyA3IDIuMyA5LjggMCAuMy0uMi40LS41LjQtLjlWNC43YzAtLjUtLjMtLjktLjgtMW0tLjMgMTAuMkMxOCAxNiAxNC40IDE2IDExLjkgMTRjLTEuMS0uOS0yLjUtMS40LTQtMS40LTEuMi4xLTIuMy41LTMuNCAxLjFWNGMyLjUtMS40IDUuNS0xLjEgNy43LjYgMi40IDEuOSA1LjcgMS45IDguMSAwaC4ybC4xLjF6IiBzdHlsZT0iZmlsbDojNDU5OTNkIi8+PHBhdGggZD0ibTIwLjYgNC44LS4xIDkuMXYuMWMtMi41IDItNi4xIDItOC42IDAtMS4xLS45LTIuNS0xLjQtNC0xLjQtMS4yLjEtMi4zLjUtMy40IDEuMVY0YzIuNS0xLjQgNS41LTEuMSA3LjcuNiAyLjQgMS45IDUuNyAxLjkgOC4xIDBoLjJjMCAuMS4xLjEuMS4yIiBzdHlsZT0iZmlsbDojNGNiZjU2Ii8+PC9nPjwvc3ZnPg==`
        },
        color1: '#FFBF00',
        blocks: [
          {
            func: 'resetGFcount',
            blockType: Scratch.BlockType.BUTTON,
            text: 'Reset Green Flag count'
          },
          {
            opcode: 'getGFcount',
            blockType: Scratch.BlockType.REPORTER,
            text: '# of times [greenFlag] clicked',
            arguments: {
              greenFlag: {
                type: Scratch.ArgumentType.IMAGE,
                dataURI: greenFlagSVG,
                flipRTL: false
              }
            },
            extensions: ['colours_event'],
            disableMonitor: false
          },
          {
            opcode: 'onFirstGF',
            blockType: Scratch.BlockType.EVENT,
            text: 'when [greenFlag] clicked the first time',
            isEdgeActivated: false,
            arguments: {
              greenFlag: {
                type: Scratch.ArgumentType.IMAGE,
                dataURI: greenFlagSVG,
                flipRTL: false
              }
            },
            extensions: ['colours_event']
          }
        ]  
      };
    }
    resetGFcount() {
      greenFlagCount = 0;
    }
    getGFcount() {
      if (isMonitorVisible() && !getMonitor().epTextPatchApplied) applyMonitorPatch();
      return greenFlagCount;
    }
  }
  vm.runtime.on('PROJECT_START', () => {
    greenFlagCount++;
    if (greenFlagCount === 1) {
      vm.runtime.startHats('epGreenFlag_onFirstGF');
    }
  })
  Scratch.extensions.register(new epGreenFlag());
})(Scratch);
