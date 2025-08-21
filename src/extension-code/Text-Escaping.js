// Name: Text Escaping
// ID: epEscaping
// Description: Escape characters from text.
// By: electricprogramming
// License: LGPL-3.0
(function (Scratch) {
  "use strict";
  if(!Scratch.extensions.unsandboxed) {
    function xmlSafe(str) { return str.replace(/[\u0000-\u001F]/g, '�').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;') } function validId(str) { return str.replaceAll(/[^a-zA-Z0-9]/g, '') } class ErroredExtension { constructor(name) { this.name = name } getInfo() { return { id: `ERR${validId(this.name)}`, name: 'ERR', blocks: [{ blockType: Scratch.BlockType.XML, xml: `<label text="The ${xmlSafe(this.name)} extension"/><sep gap="-12"/><sep gap="12"/><sep gap="-10"/><label text="must run unsandboxed."/><sep gap="-12"/><sep gap="12"/>` },] } } }
    return Scratch.extensions.register(new ErroredExtension('Text Escaping'));
  }
  function getMenuIcon() {
    return ''
  }
  class extClass {
    getInfo() {
      return {
        id: 'id',
        name: 'Name',
        color1: '#5fa6b3',
        menuIconURI: getMenuIcon(),
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
  Scratch.extensions.register(new epDictionaries());
})(Scratch);