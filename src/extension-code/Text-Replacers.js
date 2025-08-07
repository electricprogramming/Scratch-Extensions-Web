(function (Scratch) {
  'use strict';
  let replacersJSON = {};
  let mode = 1;
  function applyReplacers(mode, text, replacersJSON) {
    if (Object.keys(replacersJSON).length === 0) return text;
    if (mode == 1) { // apply simultaneously
      const keys = Object.keys(replacersJSON)
        .filter(x => x !== '')                                   // remove empty searches
        .map(str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')); // escape regex symbols
      const regex = new RegExp(keys.join('|'), 'g');

      return text.replace(regex, match => replacersJSON[match]);
    } else { // apply in order
      Object.entries(replacersJSON).forEach(([search, replacement]) => {
        text = text.replaceAll(search, replacement);
      });
      return text;
    }
  }
  class ReplacersExt {
    getInfo() {
      return {
        id: 'epTextReplacers',
        name: 'Text Replacers',
        color1: '#59C059',
        get menuIconURI() {
          return `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjE1MCIgaGVpZ2h0PSIxNTAiIGZpbGw9IiMwODQiIHJ4PSIyMCIgcnk9IjIwIi8+PHBhdGggZmlsbD0iI2U3NGMzYyIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjIiIGQ9Ik0xMi41IDEyLjVoMTI1djM1aC0xMjV6Ii8+PHBhdGggZD0iTTY3IDU5LjhoMTZ2MTZoOGwtMTYgMTYtMTYtMTZoOFoiLz48cGF0aCBmaWxsPSIjMzQ5OGRiIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMiIgZD0iTTEyLjUgMTAwaDEyNXYzNWgtMTI1eiIvPjwvc3ZnPg==`;
        },
        blocks: [
          {
            opcode: 'resetReplacers',
            blockType: Scratch.BlockType.COMMAND,
            text: 'reset replacers'
          },
          {
            opcode: 'setReplacer',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set replacer [key] to [value]',
            arguments: {
              key: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'hi'
              },
              value: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'hello'
              }
            }
          },
          {
            opcode: 'getReplacers',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get replacers as JSON'
          },
          {
            opcode: 'applyReplacers',
            blockType: Scratch.BlockType.REPORTER,
            text: 'apply replacers to [text] [mode]',
            arguments: {
              text: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'hi dude'
              },
              mode: {
                type: Scratch.ArgumentType.STRING,
                menu: 'modes'
              }
            }
          }
        ],
        menus: {
          modes: {
            acceptReporters: false,
            items: [
              { text: 'simultaneously', value: '1' },
              { text: 'in order', value: '2' }
            ]
          }
        }
      };
    }
    resetReplacers() {
      replacersJSON = {}
    }
    setReplacer(args) {
      if (args.key === '') return; // block empty search values
      replacersJSON[args.key] = args.value;
    }
    getReplacers() {
      return JSON.stringify(replacersJSON);
    }
    applyReplacers(args) {
      return applyReplacers(args.mode, args.text, replacersJSON);
    }
  }
  Scratch.extensions.register(new ReplacersExt());
})(Scratch);