(function (Scratch) {
  "use strict";
  let replacersJSON = {};
  let mode = 1;
  function applyReplacers(mode, text, replacersJSON) {
    if (mode == 1) { // apply simultaneously
      // this part is made by ChatGPT lol
      const replacers = Object.entries(replacersJSON);
      const placeholderMap = {};
      let index = 0;
      function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      }
      replacers.forEach(([searchValue]) => {
        if (!placeholderMap[searchValue]) {
          placeholderMap[searchValue] = `__PLACEHOLDER_${index++}__`;
        }
      });
      let result = text;
      replacers.forEach(([searchValue]) => {
        const escapedSearchValue = escapeRegExp(searchValue);
        const placeholder = placeholderMap[searchValue];
        const regex = new RegExp(escapedSearchValue, 'g');
        result = result.replace(regex, placeholder);
      });
      replacers.forEach(([searchValue, replaceValue]) => {
        const placeholder = placeholderMap[searchValue];
        const escapedReplaceValue = escapeRegExp(replaceValue);
        result = result.replace(new RegExp(escapeRegExp(placeholder), 'g'), escapedReplaceValue);
      });
      return result;
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
        id: "epReplacers",
        name: "Text Replacers",
        color1: "#59C059",
        get menuIconURI() {
          return `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjE1MCIgaGVpZ2h0PSIxNTAiIGZpbGw9IiMwODQiIHJ4PSIyMCIgcnk9IjIwIi8+PHBhdGggZmlsbD0iI2U3NGMzYyIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjIiIGQ9Ik0xMi41IDEyLjVoMTI1djM1aC0xMjV6Ii8+PHBhdGggZD0iTTY3IDU5LjhoMTZ2MTZoOGwtMTYgMTYtMTYtMTZoOFoiLz48cGF0aCBmaWxsPSIjMzQ5OGRiIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMiIgZD0iTTEyLjUgMTAwaDEyNXYzNWgtMTI1eiIvPjwvc3ZnPg==`;
        },
        blocks: [
          {
            opcode: "setMode",
            blockType: Scratch.BlockType.COMMAND,
            text: "set replacer mode to [mode]",
            arguments: {
              mode: {
                type: Scratch.ArgumentType.STRING,
                menu: 'modes'
              }
            }
          },
          {
            opcode: "resetReplacers",
            blockType: Scratch.BlockType.COMMAND,
            text: "reset replacers"
          },
          {
            opcode: "setReplacer",
            blockType: Scratch.BlockType.COMMAND,
            text: "set replacer [key] to [value]",
            arguments: {
              key: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "hi"
              },
              value: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "hello"
              }
            }
          },
          {
            opcode: "getReplacers",
            blockType: Scratch.BlockType.REPORTER,
            text: "get replacers as JSON"
          },
          {
            opcode: "applyReplacers",
            blockType: Scratch.BlockType.REPORTER,
            text: "apply replacers to [text]",
            arguments: {
              text: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "hi dude"
              }
            }
          }
        ],
        menus: {
          modes: {
            acceptReporters: false,
            items: [
              { text: '\u200capply replacers simultaneously', value: '1' },
              { text: 'apply replacers in order', value: '2' }
            ]
          }
        }
      };
    }
    setMode(args) {
      switch (args.mode) {
        case '1':
          mode = 1;
          break;
        case '2':
          mode = 2;
          break;
      }
    }
    resetReplacers() {
      replacersJSON = {}
    }
    setReplacer(args) {
      replacersJSON[args.key] = args.value
    }
    getReplacers() {
      return JSON.stringify(replacersJSON)
    }
    applyReplacers(args) {
      return applyReplacers(mode, args.text, replacersJSON)
    }
  }
  Scratch.extensions.register(new ReplacersExt());
})(Scratch);