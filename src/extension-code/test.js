// Name: name
// ID: id
// Description: desc
// By: electricprogramming
// License: LGPL-3.0
(async function (Scratch) {
  "use strict";
  // only if it needs to run unsandboxed
  if(!Scratch.extensions.unsandboxed) {
    function xmlSafe(str) { return str.replace(/[\u0000-\u001F]/g, '�').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;') } function validId(str) { return str.replaceAll(/[^a-zA-Z0-9]/g, '') } class ErroredExtension { constructor(name) { this.name = name } getInfo() { return { id: `ERR${validId(this.name)}`, name: 'ERR', blocks: [{ blockType: Scratch.BlockType.XML, xml: `<label text="The ${xmlSafe(this.name)} extension"/><sep gap="-12"/><sep gap="12"/><sep gap="-10"/><label text="must run unsandboxed."/><sep gap="-12"/><sep gap="12"/>` },] } } }
    return Scratch.extensions.register(new ErroredExtension('This extension'));
  }

  const [isTW, isPM] = [!Scratch.extensions.isPenguinMod, Scratch.extensions.isPenguinMod];
  const vm = Scratch.vm, runtime = vm.runtime;
  const sb = await Scratch.gui.getBlockly();
  
  if (!sb.utils.genUid) {
    sb.utils.genUid = function() {
      const soup = '!#$%()*+,-./:;=?@[]^_`{|}~ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let id = '';
      for (let i = 0; i < 20; i++) {
        id += soup.charAt(Math.floor(Math.random() * soup.length));
      }
      return id;
    }
  }
  
  function getBlockById(id, excludeTarget) {
    for (const target of runtime.targets) {
      if (target !== excludeTarget && target.blocks && target.blocks._blocks[id]) {
        return target.blocks._blocks[id];
      }
    }
    return null;
  }

  function patchBlockIds(target) {
    const idMap = {}; // oldId -> newId
    const blocks = target.blocks._blocks;

    // First pass: detect conflicts and assign new IDs
    for (const id of Object.keys(blocks)) {
      if (getBlockById(id, target)) {
        const newId = sb.utils.genUid();
        idMap[id] = newId;
      }
    }

    // Second pass: reassign blocks to new IDs
    for (const [oldId, newId] of Object.entries(idMap)) {
      blocks[newId] = blocks[oldId];
      delete blocks[oldId];
    }

    // Third pass: update references inside all blocks
    for (const block of Object.values(blocks)) {
      // Update parent
      if (block.parent && idMap[block.parent]) {
        block.parent = idMap[block.parent];
      }

      // Update next
      if (block.next && idMap[block.next]) {
        block.next = idMap[block.next];
      }

      // Update inputs
      if (block.inputs) {
        for (const input of Object.values(block.inputs)) {
          const inputBlockId = input[1]; // [type, blockId]
          if (idMap[inputBlockId]) {
            input[1] = idMap[inputBlockId];
          }
        }
      }
    }

    // Fourth pass: update top-level script IDs
    const scripts = target.blocks._scripts;
    for (let i = 0; i < scripts.length; i++) {
      const oldId = scripts[i];
      if (idMap[oldId]) {
        scripts[i] = idMap[oldId];
      }
    }
    vm.refreshWorkspace();
  }
  runtime.on('targetWasCreated', patchBlockIds);

  const ogRender = sb.BlockSvg.prototype.render;
  sb.BlockSvg.prototype.render = function (...args) {
    const data = ogRender.call(this, ...args);
    if (this.type==='id_a') console.log(this, args, data);
    return data;
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
          {
            opcode: 'a',
            blockType: Scratch.BlockType.REPORTER,
            text: 'this block id'
          }
        ],
        menus: {
          // menus
        }
      }
    }
    a(args, util) {
      return util?.block?.id || util?.thread?.peekStack();
    }
  }
  Scratch.extensions.register(new extClass());
})(Scratch);