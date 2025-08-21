// Name: Escaping
// ID: epEscaping
// Description: Escape characters from text.
// By: electricprogramming
// License: LGPL-3.0
(function (Scratch) {
  'use strict';
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
        name: 'Escaping',
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
          {
            opcode: 'sanitizeHtmlXml',
            blockType: Scratch.BlockType.REPORTER,
            text: 'sanitize [text] for html/xml',
            arguments: {
              text: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '<div>"Hello, World"</div>'
              }
            },
            disableMonitor: true
          }
        ]
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

      return text.replace(regex, match => escaper + match);
    }
    unescapeText(args) {
      const escaper = String(args.escaper)[0];
      const text = String(args.text);
      const regex = new RegExp(regexSafe(escaper) + '(.)', 'g');

      return text.replace(regex, (_, char) => char);
    }

    sanitizeHtmlXml(args) {
      return Scratch.Cast.toString(args.text).replace(/["'&<>]/g, (a) => {
        switch (a) {
          case '&': return '&amp;';
          case "'": return '&apos;';
          case '"': return '&quot;';
          case '>': return '&gt;';
          case '<': return '&lt;';
          default : return a;
        }
      });
    }
  }
  Scratch.extensions.register(new epEscaping());
})(Scratch);