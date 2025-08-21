// Name: name
// ID: id
// Description: desc
// By: electricprogramming
// License: LGPL-3.0
(function (Scratch) {
  "use strict";
  // only if it needs to run unsandboxed
  if(!Scratch.extensions.unsandboxed) {
    function xmlSafe(str) { return str.replace(/[\u0000-\u001F]/g, '�').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;') } function validId(str) { return str.replaceAll(/[^a-zA-Z0-9]/g, '') } class ErroredExtension { constructor(name) { this.name = name } getInfo() { return { id: `ERR${validId(this.name)}`, name: 'ERR', blocks: [{ blockType: Scratch.BlockType.XML, xml: `<label text="The ${xmlSafe(this.name)} extension"/><sep gap="-12"/><sep gap="12"/><sep gap="-10"/><label text="must run unsandboxed."/><sep gap="-12"/><sep gap="12"/>` },] } } }
    return Scratch.extensions.register(new ErroredExtension('Dictionaries'));
  }
  const [isTW, isPM] = [!Scratch.extensions.isPenguinMod, Scratch.extensions.isPenguinMod];
  const vm = Scratch.vm;
  function getMenuIcon() {
    return ''
  }
  function getBlockIcon() {
    return ''
  }
  class extClass {
    getInfo() {
      return {
        id: 'id',
        name: 'Name',
        color1: '#ff0000',
        color2: '#cc0000',
        color3: '#cc0000',
        menuIconURI: getMenuIcon(),
        blockIconURI: getBlockIcon(),
        blocks: [
          // blocks
        ],
        menus: {
          // menus
        }
      }
    }
    // methods
  }
  Scratch.extensions.register(new extClass());
})(Scratch);