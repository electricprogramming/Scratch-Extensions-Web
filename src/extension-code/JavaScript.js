(function (Scratch) {
  "use strict";
  if (!Scratch.extensions.unsandboxed) {
    function xmlSafe(str) { return str.replace(/[\u0000-\u001F]/g, '�').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;') } function validId(str) { return str.replaceAll(/[^a-zA-Z0-9]/g, '') } class ErroredExtension { constructor(name) { this.name = name } getInfo() { return { id: `ERR${validId(this.name)}`, name: 'ERR', blocks: [{ blockType: Scratch.BlockType.XML, xml: `<label text="The ${xmlSafe(this.name)} extension"/><sep gap="-12"/><sep gap="12"/><sep gap="-10"/><label text="must run unsandboxed."/><sep gap="-12"/><sep gap="12"/>` },] } } }
    return Scratch.extensions.register(new ErroredExtension('JavaScript'));
  }
  let lastOpenedFileData = { name: '', extension: '', size: 0, contentAsText: '', contentAsDataURL: '' };
  function promptForFile(acceptedExtensions) {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = acceptedExtensions;
      input.onchange = (event) => {
        const file = event.target.files[0];
        if (file) {
          readFileData(file).then(resolve).catch(reject);
        } else {
          reject(new Error('No file selected.'));
        }
      };
      input.click();
    });
  };
  function readFileData(file) {
    return new Promise((resolve, reject) => {
      const readerText = new FileReader();
      const readerDataURL = new FileReader();
      readerText.onload = (event) => {
        const contentAsText = event.target.result;
        readerDataURL.onload = (event) => {
          const contentAsDataURL = event.target.result;
          resolve({
            name: file.name,
            extension: `.${file.name.split('.').pop()}`,
            size: file.size,
            contentAsText: contentAsText,
            contentAsDataURL: contentAsDataURL,
          });
        };
        readerDataURL.onerror = (error) => {
          reject(new Error('Error reading file as Data URL: ' + error));
        };
        readerDataURL.readAsDataURL(file);
      };
      readerText.onerror = (error) => {
        reject(new Error('Error reading file as text: ' + error));
      };
      readerText.readAsText(file);
    });
  };
  function _downloadFileByText(fileName, content) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  function _downloadFileByDataURL(fileName, dataURL) {
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
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
          },
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
            }
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
            }
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
            }
          },
          {
            blockType: Scratch.BlockType.REPORTER,
            opcode: 'monoArr',
            text: '［ [item] ］',
            arguments: {
              item: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Hello, World!'
              }
            }
          },
          {
            blockType: Scratch.BlockType.REPORTER,
            opcode: 'addToArr',
            text: 'array [arr] + [item]',
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
          },
          {
            blockType: Scratch.BlockType.COMMAND,
            opcode: 'openFile',
            text: 'open a [types] file',
            arguments: {
              types: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '.txt'
              }
            }
          },
          {
            blockType: Scratch.BlockType.REPORTER,
            opcode: 'getFileData',
            text: 'last opened file [thing]',
            arguments: {
              thing: {
                type: Scratch.ArgumentType.STRING,
                menu: 'fileDataTypes'
              }
            },
            disableMonitor: true
          },
          {
            blockType: Scratch.BlockType.COMMAND,
            opcode: 'downloadFile',
            text: 'download [fileContentType] [contents] as [name]',
            arguments: {
              fileContentType: {
                type: Scratch.ArgumentType.STRING,
                menu: 'fileContentTypes'
              },
              name: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'example.txt'
              },
              contents: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Hello World!'
              }
            }
          },
          {
            blockType: Scratch.BlockType.HAT,
            opcode: 'whenCondition',
            text: 'when [bool]',
            isEdgeActivated: true,
            arguments: {
              bool: {
                type: Scratch.ArgumentType.BOOLEAN
              }
            }
          },
          {
            blockType: Scratch.BlockType.REPORTER,
            opcode: 'ifElseReturn',
            text: 'if [bool] then [val1] else [val2]',
            arguments: {
              bool: {
                type: Scratch.ArgumentType.BOOLEAN
              },
              val1: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Hello'
              },
              val2: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'World'
              }
            }
          },
          {
            blockType: Scratch.BlockType.REPORTER,
            opcode: 'literal',
            text: '[data]',
            arguments: {
              data: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Hello, World!'
              },
            },
          }
        ],
        menus: {
          fileDataTypes: {
            acceptReporters: false,
            items: ['content as text', 'content as dataURL', 'name', 'extension', 'size in bytes']
          },
          fileContentTypes: {
            acceptReporters: false,
            items: ['text', 'dataURL']
          }
        }
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
    whenCondition(args) {
      return args.bool ? true : false;
    }
    literal(args) {
      return args.data;
    }
    ifElseReturn(args) {
      return args.bool ? args.val1 : args.val2;
    }
    async openFile(args) {
      try {
        promptForFile(args.types)
          .then(fileInfo => {
            lastOpenedFileData = fileInfo;
          })
          .catch(e => {
            console.error(e)
          })
      } catch (e) {
        console.error(e);
        lastOpenedFileData = { name: '', extension: '', size: 0, contentAsText: '', contentAsDataURL: '' };
      }
    }
    getFileData(args) {
      switch (args.thing) {
        case 'content as text':
          return lastOpenedFileData.contentAsText;
        case 'content as dataURL':
          return lastOpenedFileData.contentAsDataURL;
        case 'name':
          return lastOpenedFileData.name;
        case 'extension':
          return lastOpenedFileData.extension;
        case 'size in bytes':
          return lastOpenedFileData.size;
        default:
          return '';
      }
    }
    downloadFile(args) {
      try {
        if (args.fileContentType === 'text') {
          _downloadFileByText(args.name, args.contents);
        } else if (args.fileContentType === 'dataURL') {
          _downloadFileByDataURL(args.name, args.contents);
        } else return;
      } catch (e) {
        console.error(e);
      }
    }
  }
  Scratch.extensions.register(new JSext());
})(Scratch);