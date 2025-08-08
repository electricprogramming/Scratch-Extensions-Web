(function (Scratch) {
  "use strict";
  if (!Scratch.extensions.unsandboxed) {
    function xmlSafe(str) { return str.replace(/[\u0000-\u001F]/g, '�').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;') } function validId(str) { return str.replaceAll(/[^a-zA-Z0-9]/g, '') } class ErroredExtension { constructor(name) { this.name = name } getInfo() { return { id: `ERR${validId(this.name)}`, name: 'ERR', blocks: [{ blockType: Scratch.BlockType.XML, xml: `<label text="The ${xmlSafe(this.name)} extension"/><sep gap="-12"/><sep gap="12"/><sep gap="-10"/><label text="must run unsandboxed."/><sep gap="-12"/><sep gap="12"/>` },] } } }
    return Scratch.extensions.register(new ErroredExtension('JavaScript'));
  }
  let lastOpenedFileData = { name: '', extension: '', size: 0, contentAsText: '', contentAsDataURL: '' };

  const originalConverter = vm.runtime._convertBlockForScratchBlocks.bind(vm.runtime);
  vm.runtime._convertBlockForScratchBlocks = function (blockInfo, categoryInfo) {
    const res = originalConverter(blockInfo, categoryInfo);
    if (blockInfo.outputShape) res.json.outputShape = blockInfo.outputShape;
    return res;
  }

  async function getSB() {
    return window.ScratchBlocks || await Scratch.gui.getBlockly();
  }
  getSB().then(sb => {
    const blackText = ['commandJS', 'reporterJS', 'booleanJS', 'functionCommand', 'functionReporter', 'functionBoolean']
      .map(opcode => 'epJavaScript_' + opcode);
    function makeShape(w) {
      const h = 32;
      const r = Math.min(4, w / 2, h / 2);
      return (`
        M${r} 0
        h${w - 2 * r}
        a${r} ${r} 0 0 1 ${r} ${r}
        v${h - 2 * r}
        a${r} ${r} 0 0 1 -${r} ${r}
        h-${w - 2 * r}
        a${r} ${r} 0 0 1 -${r} -${r}
        v-${h - 2 * r}
        a${r} ${r} 0 0 1 ${r} -${r}
        z`).replaceAll("\n", "").trim();
    }
    const ogRender = sb.BlockSvg.prototype.render;
    sb.BlockSvg.prototype.render = function (...args) {
      const data = ogRender.call(this, ...args);
      if (blackText.includes(this.type)) {
        Array.from(this.svgGroup_.children)
          .filter(x => x.classList.contains('blocklyText'))
          .forEach(x => {
            x.style.setProperty('fill', '#222', 'important');
          });
      }
      if (this.type.startsWith('epJavaScript_')) {
        this.inputList.forEach((input) => {
          if (input.name === 'arr') {
            input.connection.sourceBlock_.svgGroup_
              .querySelector('.blocklyPath[data-argument-type]')
              .setAttribute('d', makeShape(48, 32))
          }
        });
      }
      return data;
    }
  });
  class JSext {
    getInfo() {
      return {
        id: 'epJavaScript',
        name: 'JavaScript',
        get menuIconURI() {
          return `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjAwIDIwMCI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNGN0RGMUUiIC8+PHRleHQgeD0iNjAiIHk9IjE4NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjExMCIgZmlsbD0iIzAwMDAwMCIgZm9udC13ZWlnaHQ9ImJvbGQiPkpTPC90ZXh0Pjwvc3ZnPg==`
        },
        blocks: [
          {
            blockType: Scratch.BlockType.COMMAND,
            opcode: 'commandJS',
            text: 'JS | [code]',
            arguments: {
              code: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: `alert('Hello World!')`
              },
            },
            color1: '#F7DF1E'
          },
          {
            blockType: Scratch.BlockType.REPORTER,
            opcode: 'reporterJS',
            text: 'JS | [code]',
            arguments: {
              code: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: `prompt('What is your name?','Bob Smith')`
              },
            },
            color1: '#F7DF1E'
          },
          {
            blockType: Scratch.BlockType.BOOLEAN,
            opcode: 'booleanJS',
            text: 'JS | [code]',
            arguments: {
              code: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: `confirm('Are you sure?')`
              },
            },
            color1: '#F7DF1E'
          },
          '---',
          {
            blockType: Scratch.BlockType.COMMAND,
            opcode: 'functionCommand',
            text: 'run function [function] with args [ARGS]',
            arguments: {
              function: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'function(...args){alert(`Running a custom function with args ${JSON.stringify(args)}`);}'
              },
              ARGS: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '["Hello", "World!"]'
              }
            },
            color1: '#F7DF1E'
          },
          {
            blockType: Scratch.BlockType.REPORTER,
            opcode: 'functionReporter',
            text: 'run function [function] with args [ARGS]',
            arguments: {
              function: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'function(a,b){return Number(a) + Number(b);}'
              },
              ARGS: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '[2, 5]'
              }
            },
            color1: '#F7DF1E'
          },
          {
            blockType: Scratch.BlockType.BOOLEAN,
            opcode: 'functionBoolean',
            text: 'run function [function] with args [ARGS]',
            arguments: {
              function: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'function(a,b){return (a || b) && !(a && b);}'
              },
              ARGS: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '[true, false]'
              }
            },
            color1: '#F7DF1E'
          },
          '---',
          { blockType: Scratch.BlockType.LABEL, text: 'Utilities' },
          {
            blockType: Scratch.BlockType.REPORTER,
            opcode: 'monoArr',
            text: '［ [item] ］',
            arguments: {
              item: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Hello, World!'
              }
            },
            outputShape: 3
          },
          {
            blockType: Scratch.BlockType.REPORTER,
            opcode: 'addToArr',
            text: '[arr] + [item]',
            arguments: {
              item: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Hello, Fellow Scratchers!'
              },
              arr: {
                type: null,
              }
            }
          },
          '---',
          {
            blockType: Scratch.BlockType.COMMAND,
            opcode: 'openInNewTab',
            text: 'open site [url] in new tab',
            arguments: {
              url: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'https://example.com'
              },
            },
          },
          {
            blockType: Scratch.BlockType.COMMAND,
            opcode: 'redirect',
            text: 'redirect current tab to [url]',
            arguments: {
              url: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'https://example.com'
              },
            },
          }
        ]
      };
    }
    _eval(code) {
      const func = new Function(`
          return eval(${JSON.stringify(code)});
      `);
      try {
        var res = func();
      } catch (err) {
        console.error(err);
        var res = '';
      }
      return res;
    }
    _funcStrToFunc(funcString) {
      funcString = funcString.trim();
      const validNamedFunctionRegex = /^\s*function\s+[a-zA-Z0-9$_]+\s*\([\s\S]*\)\s*\{[\s\S]*\}\s*$/;
      const validAnonymousFunctionRegex = /^\s*function\s*\([\s\S]*\)\s*\{[\s\S]*\}\s*$/;
      const validArrowFunctionRegex = /^\s*(\([^\)]*\)|[a-zA-Z0-9$_]+)\s*=>\s*[\s\S]+$/;
      if (!(validNamedFunctionRegex.test(funcString) || validAnonymousFunctionRegex.test(funcString) || validArrowFunctionRegex.test(funcString))) {
        if (window[funcString] && typeof window[funcString] === 'function') {
          return window[funcString];
        } else {
          throw new Error('Invalid function string. Only valid named, anonymous, or arrow functions are allowed.');
        }
      }
      try {
        if (validArrowFunctionRegex.test(funcString)) {
          const func = eval('(' + funcString + ')');
          return func
        }
        const func = new Function('return ' + funcString)();
        return func
      } catch (error) {
        throw new Error('Failed to convert string to function: ' + error.message)
      }
    }
    commandJS(args) {
      this._eval(args.code);
    }
    reporterJS(args) {
      return this._eval(args.code);
    }
    booleanJS(args) {
      return this._eval(args.code) ? true : false;
    }
    functionCommand(args) {
      try {
        const func = this._funcStrToFunc(args.function);
        const argsArr = JSON.parse(args.ARGS);
        func(...argsArr);
      } catch (e) {
        console.error(e);
      }
    }
    functionReporter(args) {
      try {
        const func = this._funcStrToFunc(args.function);
        const argsArr = JSON.parse(args.ARGS);
        return func(...argsArr);
      } catch (e) {
        console.error(e);
        return '';
      }
    }
    functionBoolean(args) {
      try {
        const func = this._funcStrToFunc(args.function);
        const argsArr = JSON.parse(args.ARGS);
        return func(...argsArr) ? true : false;
      } catch (e) {
        console.error(e);
        return false;
      }
    }
    monoArr(args) {
      let arr = [];
      arr.push(args.item);
      return JSON.stringify(arr);
    }
    addToArr(args) {
      try {
        let arr = JSON.parse(args.arr);
        arr.push(args.item);
        return JSON.stringify(arr);
      } catch (e) {
        console.error(e);
        return '[]';
      }
    }
    openInNewTab(args) {
      window.open(args.url, '_blank');
    }
    redirect(args) {
      window.location.href = args.url;
    }
  }
  Scratch.extensions.register(new JSext());
})(Scratch);