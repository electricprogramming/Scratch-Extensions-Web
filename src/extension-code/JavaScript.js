// Name: JavaScript
// ID: epJavaScript
// Description: Run JavaScript in Scratch projects.
// By: electricprogramming
// License: LGPL-3.0
(function (Scratch) {
  "use strict";
  if (!Scratch.extensions.unsandboxed) {
    function xmlSafe(str) { return str.replace(/[\u0000-\u001F]/g, '�').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;') } function validId(str) { return str.replaceAll(/[^a-zA-Z0-9]/g, '') } class ErroredExtension { constructor(name) { this.name = name } getInfo() { return { id: `ERR${validId(this.name)}`, name: 'ERR', blocks: [{ blockType: Scratch.BlockType.XML, xml: `<label text="The ${xmlSafe(this.name)} extension"/><sep gap="-12"/><sep gap="12"/><sep gap="-10"/><label text="must run unsandboxed."/><sep gap="-12"/><sep gap="12"/>` },] } } }
    return Scratch.extensions.register(new ErroredExtension('JavaScript'));
  }

  const originalConverter = vm.runtime._convertBlockForScratchBlocks.bind(vm.runtime);
  vm.runtime._convertBlockForScratchBlocks = function (blockInfo, categoryInfo) {
    const res = originalConverter(blockInfo, categoryInfo);
    if (blockInfo.outputShape) res.json.outputShape = blockInfo.outputShape;
    if (res.json.message0 === '［ %1 ］') res.json.message0 = '[%1]'
    return res;
  }

  async function getSB() {
    return window.ScratchBlocks || await Scratch.gui.getBlockly();
  }
  getSB().then(sb => {
    function makeShape(w, h = 40) {
      const r = Math.min(4, w / 2, h / 2);
      return (`
        M${4 + r} 0
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
      if (this.type.startsWith('epJavaScript_')) {
        if (this.svgPath_.getAttribute('fill') === '#F7DF1E') {
          Array.from(this.svgGroup_.children)
            .filter(x => x.classList.contains('blocklyText'))
            .forEach(x => {
              x.style.setProperty('fill', '#222', 'important');
            });
        }
        this.inputList.forEach((input) => {
          if (input.name.startsWith('arr')) {
            input.outlinePath.setAttribute('d', makeShape(40, 32))
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
          return `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2MzAgNjMwIj4KPHJlY3Qgd2lkdGg9IjYzMCIgaGVpZ2h0PSI2MzAiIGZpbGw9IiNmN2RmMWUiLz4KPHBhdGggZD0ibTQyMy4yIDQ5Mi4xOWMxMi42OSAyMC43MiAyOS4yIDM1Ljk1IDU4LjQgMzUuOTUgMjQuNTMgMCA0MC4yLTEyLjI2IDQwLjItMjkuMiAwLTIwLjMtMTYuMS0yNy40OS00My4xLTM5LjNsLTE0LjgtNi4zNWMtNDIuNzItMTguMi03MS4xLTQxLTcxLjEtODkuMiAwLTQ0LjQgMzMuODMtNzguMiA4Ni43LTc4LjIgMzcuNjQgMCA2NC43IDEzLjEgODQuMiA0Ny40bC00Ni4xIDI5LjZjLTEwLjE1LTE4LjItMjEuMS0yNS4zNy0zOC4xLTI1LjM3LTE3LjM0IDAtMjguMzMgMTEtMjguMzMgMjUuMzcgMCAxNy43NiAxMSAyNC45NSAzNi40IDM1Ljk1bDE0LjggNi4zNGM1MC4zIDIxLjU3IDc4LjcgNDMuNTYgNzguNyA5MyAwIDUzLjMtNDEuODcgODIuNS05OC4xIDgyLjUtNTQuOTggMC05MC41LTI2LjItMTA3Ljg4LTYwLjU0em0tMjA5LjEzIDUuMTNjOS4zIDE2LjUgMTcuNzYgMzAuNDUgMzguMSAzMC40NSAxOS40NSAwIDMxLjcyLTcuNjEgMzEuNzItMzcuMnYtMjAxLjNoNTkuMnYyMDIuMWMwIDYxLjMtMzUuOTQgODkuMi04OC40IDg5LjItNDcuNCAwLTc0Ljg1LTI0LjUzLTg4LjgxLTU0LjA3NXoiLz4KPC9zdmc+`
        },
        color1: '#F7DF1E',
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
            }
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
            }
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
            }
          },
          '---',
          {
            blockType: Scratch.BlockType.COMMAND,
            opcode: 'functionCommand',
            text: 'run function [function] with args [argArr]',
            arguments: {
              function: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'function(...args){alert(`Running a custom function with args ${JSON.stringify(args)}`);}'
              },
              argArr: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '["Hello", "World!"]'
              }
            }
          },
          {
            blockType: Scratch.BlockType.REPORTER,
            opcode: 'functionReporter',
            text: 'run function [function] with args [argArr]',
            arguments: {
              function: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'function(a,b){return Number(a) + Number(b);}'
              },
              argArr: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '[2, 5]'
              }
            }
          },
          {
            blockType: Scratch.BlockType.BOOLEAN,
            opcode: 'functionBoolean',
            text: 'run function [function] with args [argArr]',
            arguments: {
              function: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'function(a,b){return (a || b) && !(a && b);}'
              },
              argArr: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '[true, false]'
              }
            }
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
            outputShape: Scratch.BlockShape.SQUARE
          },
          {
            blockType: Scratch.BlockType.REPORTER,
            opcode: 'arrOfArr',
            text: '［ [arr] ］',
            arguments: {
              arr: {
                type: null
              }
            },
            outputShape: Scratch.BlockShape.SQUARE
          },
          {
            blockType: Scratch.BlockType.REPORTER,
            opcode: 'addToArr',
            text: '\u200c [arr] + [item]',
            arguments: {
              item: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Hello, Fellow Scratchers!'
              },
              arr: {
                type: null,
              }
            },
            outputShape: Scratch.BlockShape.SQUARE
          },
          {
            blockType: Scratch.BlockType.REPORTER,
            opcode: 'combineArrs',
            text: '\u200c [arr1] + [arr2]',
            arguments: {
              arr1: {
                type: null,
              },
              arr2: {
                type: null,
              }
            },
            outputShape: Scratch.BlockShape.SQUARE
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
    _getByPath(obj, path) {
      return path.split('.').reduce((acc, key) => acc?.[key], obj);
    }
    _funcStrToFunc(funcString) {
      funcString = funcString.trim();
      const validNamedFunctionRegex = /^\s*function\s+[a-zA-Z0-9$_]+\s*\([\s\S]*\)\s*\{[\s\S]*\}\s*$/;
      const validAnonymousFunctionRegex = /^\s*function\s*\([\s\S]*\)\s*\{[\s\S]*\}\s*$/;
      const validArrowFunctionRegex = /^\s*(\([^\)]*\)|[a-zA-Z0-9$_]+)\s*=>\s*[\s\S]+$/;
      if (!(validNamedFunctionRegex.test(funcString) || validAnonymousFunctionRegex.test(funcString) || validArrowFunctionRegex.test(funcString))) {
        if (typeof window[funcString] === 'function') {
          return window[funcString];
        } else if (typeof this._getByPath(window, funcString) === 'function') {
          return this._getByPath(window, funcString);
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
        const argsArr = JSON.parse(args.argArr);
        func(...argsArr);
      } catch (e) {
        console.error(e);
      }
    }
    functionReporter(args) {
      try {
        const func = this._funcStrToFunc(args.function);
        const argsArr = JSON.parse(args.argArr);
        return func(...argsArr);
      } catch (e) {
        console.error(e);
        return '';
      }
    }
    functionBoolean(args) {
      try {
        const func = this._funcStrToFunc(args.function);
        const argsArr = JSON.parse(args.argArr);
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
    arrOfArr(args) {
      let arr = JSON.parse(args.arr);
      return JSON.stringify([arr]);
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
    combineArrs(args) {
      try {
        const arr1 = JSON.parse(args.arr1), arr2 = JSON.parse(args.arr2);
        return JSON.stringify([...arr1, ...arr2]);
      } catch (e) {
        console.error(e);
        return '[]';
      }
    }
  }
  Scratch.extensions.register(new JSext());
})(Scratch);