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
  function regexSafe(txt) {
    return txt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  class epEscaping {
    getInfo() {
      return {
        id: 'epEscaping',
        name: 'Text Escaping',
        color1: '#5fa6b3',
        menuIconURI: getMenuIcon(),
        blocks: [
          {
            opcode: 'escapeText',
            blockType: Scratch.BlockType.REPORTER,
            text: 'escape [unsafe] from [text] with [escaper]',
            arguments: {
              unsafe: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '[]"'
              },
              text: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '"h[ello\\ world"'
              },
              escaper: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '\\'
              }
            },
            disableMonitor: true
          },
          {
            opcode: 'unescapeText',
            blockType: Scratch.BlockType.REPORTER,
            text: 'unescape [text] with [escaper]',
            arguments: {
              text: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '\\"h\\[ello\\\\ world\\"'
              },
              escaper: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '\\'
              }
            },
            disableMonitor: true
          },
        ],
        menus: {
          // menus
        }
      }
    }
    escapeText(args) {
      const escaper = String(args.escaper)[0];
      const text = String(args.text);
      const unsafeChars = [...new Set([
        regexSafe(escaper),
        ...String(args.unsafe)
          .split('')
          .filter(x => x !== '')
          .map(regexSafe) // escape regex symbols
      ])];
      const regex = new RegExp(unsafeChars.join('|'), 'g');
      console.log(unsafeChars, regex);
      unsafeChars.forEach(console.log)
      return text.replace(regex, match => escaper + match);
    }
    unescapeText(args) {
      const escaper = String(args.escaper)[0];
      const text = String(args.text);
      const regex = new RegExp(regexSafe(escaper) + '(.)', 'g');

      return text.replace(regex, (_, char) => char);
    }
  }
  Scratch.extensions.register(new epEscaping());
})(Scratch);