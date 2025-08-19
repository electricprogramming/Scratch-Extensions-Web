// Name: Data Grids
// ID: epDataGrids
// Description: Create and manage data grids, which are similar to grid lists. Creating, deleting, and accessing grids works in a similar way to Scratch's defaut variables category. Covers setting and getting cells by x and y coordinates, getting rows and columns by index, iteration, etc.
// By: electricprogramming
// License: LGPL-3.0
(function (Scratch) {
  "use strict";
  if(!Scratch.extensions.unsandboxed) {
    function xmlSafe(str) { return str.replace(/[\u0000-\u001F]/g, '�').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;') } function validId(str) { return str.replaceAll(/[^a-zA-Z0-9]/g, '') } class ErroredExtension { constructor(name) { this.name = name } getInfo() { return { id: `ERR${validId(this.name)}`, name: 'ERR', blocks: [{ blockType: Scratch.BlockType.XML, xml: `<label text="The ${xmlSafe(this.name)} extension"/><sep gap="-12"/><sep gap="12"/><sep gap="-10"/><label text="must run unsandboxed."/><sep gap="-12"/><sep gap="12"/>` },] } } }
    return Scratch.extensions.register(new ErroredExtension('Data Grids'));
  }
  const [isTW, isPM] = [!Scratch.extensions.isPenguinMod, Scratch.extensions.isPenguinMod];
  const vm = Scratch.vm;
  function getMenuIcon() {
    return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+CiAgPGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNDUiIGZpbGw9IiNmZjAwMDAiLz4KICA8ZyBpZD0iYWxsLWVsZW1lbnRzIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNCwtNCkgc2NhbGUoMS40LDEuNCkiIGZpbGw9IiNmZmZmZmYiPgogICAgPGcgaWQ9ImdyaWQtc3F1YXJlcyI+CjwhLS1HcmlkIFNxdWFyZXMtLT4KICAgICAgPHJlY3QgeD0iMzIiIHk9IjMyIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiLz4KICAgICAgPHJlY3QgeD0iNDgiIHk9IjMyIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiLz4KICAgICAgPHJlY3QgeD0iMzIiIHk9IjQ4IiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiLz4KICAgICAgPHJlY3QgeD0iNDgiIHk9IjQ4IiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiLz4KICAgIDwvZz4KICAgIDxnIGlkPSJidWxsZXQtcG9pbnRzIj4KICAgICAgPGcgaWQ9InRvcCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTAuODUsMCkiPgogICAgICAgIDxjaXJjbGUgY3g9IjM4IiBjeT0iMjAiIHI9IjQiLz4KICAgICAgICA8Y2lyY2xlIGN4PSI1NCIgY3k9IjIwIiByPSI0Ii8+CiAgICAgIDwvZz4KICAgICAgPGcgaWQ9ImxlZnQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTAuODUpIj4KICAgICAgICA8Y2lyY2xlIGN4PSIyMCIgY3k9IjM4IiByPSI0Ii8+CiAgICAgICAgPGNpcmNsZSBjeD0iMjAiIGN5PSI1NCIgcj0iNCIvPgogICAgICA8L2c+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K'
  }
  function getBlockIcon() {
    return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+CiAgPGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNDUiIGZpbGw9IiNjYzAwMDAiLz4KICA8ZyBpZD0iYWxsLWVsZW1lbnRzIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNCwtNCkgc2NhbGUoMS40LDEuNCkiIGZpbGw9IiNmZmZmZmYiPgogICAgPGcgaWQ9ImdyaWQtc3F1YXJlcyI+CjwhLS1HcmlkIFNxdWFyZXMtLT4KICAgICAgPHJlY3QgeD0iMzIiIHk9IjMyIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiLz4KICAgICAgPHJlY3QgeD0iNDgiIHk9IjMyIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiLz4KICAgICAgPHJlY3QgeD0iMzIiIHk9IjQ4IiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiLz4KICAgICAgPHJlY3QgeD0iNDgiIHk9IjQ4IiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiLz4KICAgIDwvZz4KICAgIDxnIGlkPSJidWxsZXQtcG9pbnRzIj4KICAgICAgPGcgaWQ9InRvcCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTAuODUsMCkiPgogICAgICAgIDxjaXJjbGUgY3g9IjM4IiBjeT0iMjAiIHI9IjQiLz4KICAgICAgICA8Y2lyY2xlIGN4PSI1NCIgY3k9IjIwIiByPSI0Ii8+CiAgICAgIDwvZz4KICAgICAgPGcgaWQ9ImxlZnQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTAuODUpIj4KICAgICAgICA8Y2lyY2xlIGN4PSIyMCIgY3k9IjM4IiByPSI0Ii8+CiAgICAgICAgPGNpcmNsZSBjeD0iMjAiIGN5PSI1NCIgcj0iNCIvPgogICAgICA8L2c+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K'
  }
  function repeat(count = 0, action = () => {}) {
    for (let i = 0; i < count; i++) {
      const escapeLoop = () => {
        throw new Error('EscapeLoop');
      };
      const continueLoop = () => {
        throw new Error('ContinueLoop');
      };
      try {
        action(i, escapeLoop, continueLoop);
      } catch (e) {
        if (e.message === 'EscapeLoop') {
          break;
        } else if (e.message === 'ContinueLoop') {
          continue;
        } else {
          throw e;
        }
      }
    }
  }
  function toInteger(value) {
    if (Number.isInteger(value)) {
      return value;
    }
    if (typeof value === 'number') {
      return Math.round(value);
    }
    if (typeof value === 'string') {
      const match = value.trim().match(/^[-+]?\d*\.?\d+$/);
      if (match) {
        return Math.round(parseFloat(match[0]));
      }
      return 0;
    }
    return 0;
  }
  function xmlSafe(str) {
    return str
      .replace(/[\u0000-\u001F]/g, '�')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  function renameKey(obj, oldKey, newKey) {
    const result = {};
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      result[key === oldKey ? newKey : key] = obj[key];
    }
    return result;
  }

  class Grid { // 1-based
    #gridWidth;
    #gridHeight;
    #gridItems;
    constructor(nestedArray = []) {
      if (!(Array.isArray(nestedArray))) {
        nestedArray = []
        console.error('Data Grids: constructor - not an array')
      }
      let expectedLength;
      repeat(nestedArray.length, (i, escapeLoop) => {
        if (i === 0) {
          expectedLength = nestedArray[i].length
        } else {
          if (nestedArray[i].length !== expectedLength) {
            nestedArray = []
            console.error('Data Grids: constructor - array subarrays are not the same size')
            escapeLoop();
          }
        }
      })
      this.#gridItems = nestedArray
      this.#gridWidth = nestedArray[0]? nestedArray[0].length : 0
      this.#gridHeight = nestedArray.length
    }
    #blankArray(size = 0) {
      return Array(size).fill('');
    }
    static new(width = 0, height = 0) {
      return new Grid(Array.from({ length: toInteger(height) }, () => Array(toInteger(width)).fill('')))
    }
    static deserialize(stringifiedArray = '[]') {
      try {
        var gridData = JSON.parse(stringifiedArray)
      } catch (e) {
        console.error('Data Grids: Deserialization error -- ', e.message)
        gridData = []
      }
      return new Grid(gridData)
    }
    addRows(count = 0) {
      if (count < 0) {
        console.error('Data Grids: addRows count must not be negative.')
      } else {
        this.#gridHeight += count;
        repeat(count, () => {
          this.#gridItems.push(this.#blankArray(this.#gridWidth));
        });
      }
    }
    addColumns(count = 0) {
      if (count < 0) {
        console.error('Data Grids: addColumns count must not be negative.')
      } else {
        this.#gridWidth += count;
        repeat(this.#gridHeight, (i) => {
          const currentRow = this.#gridItems[i];
          repeat(count, () => {
            currentRow.push('');
          });
        });
      }
    }
    insertRows(count = 0, idx = 1) {
      if (idx < 1 || idx > this.#gridHeight + 1) {
        console.error('Data Grids: row insertion index out of bounds');
      } else if (count < 0) {
        console.error('Data Grids: row insertion count must not be negative')
      } else {
        this.#gridHeight += count;
        repeat(count, () => {
          this.#gridItems.splice(idx - 1, 0, this.#blankArray(this.#gridWidth));
        });
      }
    }
    insertColumns(count = 0, idx = 1) {
      if (idx < 1 || idx > this.#gridHeight + 1) {
        console.error('Data Grids: column insertion index out of bounds');
      } else if (count < 0) {
        console.error('Data Grids: column insertion count must not be negative')
      } else {
        this.#gridWidth += count;
        repeat(this.#gridHeight, (i) => {
          const currentRow = this.#gridItems[i];
          repeat(count, () => {
            currentRow.splice(idx - 1, 0, '');
          });
        });
      }
    }
    deleteRow(rowNum = 0) {
      if (rowNum < 1 || rowNum > this.#gridHeight) {
        console.error('Data Grids: row deletion index out of bounds');
      } else {
        this.#gridHeight -= 1;
        this.#gridItems.splice(rowNum - 1, 1);
      }
    }
    deleteColumn(columnNum = 0) {
      if (columnNum < 1 || columnNum > this.#gridWidth) {
        console.error('Data Grids: column deletion index out of bounds');
      } else {
        this.#gridWidth -= 1;
        repeat(this.#gridHeight, (i) => {
          const currentRow = this.#gridItems[i];
          currentRow.splice(columnNum - 1, 1);
        });
      }
    }
    set(x = 0, y = 0, val = '') {
      if (x < 1 || x > this.#gridWidth || y < 1 || y > this.#gridHeight) {
        console.error('Data Grids: cell value setting index out of bounds');
      } else {
        const rowToEdit = this.#gridItems[y - 1];
        rowToEdit[x - 1] = val;
      }
    }
    get(x = 0, y = 0) {
      if (x < 1 || x > this.#gridWidth || y < 1 || y > this.#gridHeight) {
        console.error('Data Grids: cell value fetch index out of bounds')
        return ''
      } else {
        const row = this.#gridItems[y - 1];
        return row[x - 1];
      }
    }
    getRow(rowNum = 0) {
      if (rowNum < 1 || rowNum > this.#gridHeight) {
        console.error('Data Grids: row fetch index out of bounds');
        return [];
      } else {
        return this.#gridItems[rowNum - 1];
      }
    }
    getColumn(columnNum = 0) {
      if (columnNum < 1 || columnNum > this.#gridWidth) {
        console.error('Data Grids: column fetch index out of bounds');
        return [];
      } else {
        let column = [];
        repeat(this.#gridHeight, (i) => {
          const thisRow = this.#gridItems[i];
          column.push(thisRow[columnNum - 1]);
        });
        return column;
      }
    }
    getWidth() {
      return this.#gridWidth;
    }
    getHeight() {
      return this.#gridHeight;
    }
    getItems() {
      return this.#gridItems;
    }
    forEachItem(action = () => {}) {
      repeat(this.#gridHeight, (y) => {
        const row = this.#gridItems[y];
        repeat(this.#gridWidth, (x) => {
          action(x + 1, y + 1, row[x]);
        });
      });
    }
    forEachRow(action = () => {}) {
      repeat(this.#gridHeight, (idx) => {
        action(idx + 1, this.#gridItems[idx]);
      });
    }
    forEachColumn(action = () => {}) {
      repeat(this.#gridWidth, (idx) => {
        const currentColumn = this.getColumn(idx + 1);
        action(idx + 1, currentColumn);
      });
    }
    serialize() {
      return JSON.stringify(this.#gridItems);
    }
    serializeObject() {
      let serialized = {};
      this.forEachRow(
        (rowNum, rowAsArray) => {
          let rowAsJSON = {}
          repeat(
            rowAsArray.length,
            (idx) => {
              rowAsJSON[idx + 1] = rowAsArray[idx];
            }
          );
          serialized[rowNum] = rowAsJSON;
        }
      );
      return JSON.stringify(serialized);
    }
    fill(val = '') {
      this.forEachItem((x, y) => {
        this.set(x, y, val);
      });
    }
    clear() {
      this.fill('');
    }
    findAll(item = '') {
      let instances = []
      this.forEachItem((x, y, val) => {
        if (val == item) {
          let object = {};
          object['x'] = x;
          object['y'] = y;
          instances.push(object);
        }
      })
      return instances;
    }
    replaceAll(oldVal = '', newVal = '') {
      this.forEachItem((x, y, val) => {
        if (val == oldVal) {
          this.set(x, y, newVal);
        }
      });
    }
  }

  const regenReporters = ['epDataGrids_iterationItem', 'epDataGrids_iterationX', 'epDataGrids_iterationY', 'epDataGrids_iterationRow', 'epDataGrids_iterationColumn', 'epDataGrids_iterationIdx'];
  if (Scratch.gui) Scratch.gui.getBlockly().then(SB => {
    const originalCheck = SB.scratchBlocksUtils.isShadowArgumentReporter;
    SB.scratchBlocksUtils.isShadowArgumentReporter = function (block) {
      const result = originalCheck(block);
      if (result) return true;
      return block.isShadow() && regenReporters.includes(block.type);
    };
  });
  const originalConverter = vm.runtime._convertBlockForScratchBlocks.bind(vm.runtime);
  vm.runtime._convertBlockForScratchBlocks = function (blockInfo, categoryInfo) {
    const res = originalConverter(blockInfo, categoryInfo);
    if (blockInfo.outputShape) res.json.outputShape = blockInfo.outputShape;
    return res;
  }

  async function prompt(title, question, defaultVal = '') {
    return new Promise(async (resolve) => {
      const sb = await new Promise(async (resolve) => {
        resolve(window.ScratchBlocks || await Scratch.gui.getBlockly());
      });
      sb.prompt(question, defaultVal, (e) => {
        resolve(document.querySelector('.ReactModalPortal input').value)
      });
      document.querySelector('.ReactModalPortal div div div div div:has(*[class*="options"])')?.remove()
      document.querySelector('.ReactModalPortal div div div div div').textContent = title
    });
  }

  async function promptSelect(title, question, options) {
    return new Promise(async (resolve) => {
      const sb = await new Promise(async (resolve) => {
        resolve(window.ScratchBlocks || await Scratch.gui.getBlockly());
      });
      sb.prompt(question, null, (e) => {
        resolve(document.querySelector('.ReactModalPortal select').value)
      });
      const select = document.createElement('select');
      select.style.color = 'white';
      select.style.padding = '4px';
      select.style.border = '1px solid white';
      select.style.borderRadius = '4px';
      document.querySelector('.ReactModalPortal input').replaceWith(select);
      options.forEach(optionText => {
        const option = document.createElement('option');
        option.value = optionText;
        option.textContent = optionText;
        select.appendChild(option);
      });
      document.querySelector('.ReactModalPortal div div div div div:has(*[class*="options"])')?.remove()
      document.querySelector('.ReactModalPortal div div div div div').textContent = title
    });
  }

  let grids = {};
  const customStorage = {
    set: (data) => {
      if (isTW) vm.runtime.extensionStorage.epDataGrids = { data };
    },
    get: () => {
      if (isTW) return vm.runtime.extensionStorage.epDataGrids?.data; else return;
    }
  }
  function serializeState() {
    let result = {};
    Object.keys(grids).forEach(key => {
      result[key] = grids[key].serialize();
    })
    return result
  }
  function updateProjectStorage() {
    customStorage.set(serializeState());
  }
  function deserializeState(state) {
    console.log('Data Grids: Loading serialized project data')
    grids = {};
    Object.keys(state).forEach(key => {
      grids[key] = Grid.deserialize(state[key])
    })
    vm.extensionManager.refreshBlocks();
  }
  if (isTW) vm.runtime.on('PROJECT_LOADED', () => {
    const data = customStorage.get();
    deserializeState(data)
  });

  class epDataGrids {
    getInfo() {
      return {
        id: 'epDataGrids',
        name: 'Data Grids',
        color1: '#ff0000',
        color2: '#cc0000',
        color3: '#cc0000',
        menuIconURI: getMenuIcon(),
        blocks: [
          {
            func: 'DISCLAIMER',
            blockType: Scratch.BlockType.BUTTON,
            text: 'DISCLAIMER',
            hideFromPalette: false
          },
          { blockType: Scratch.BlockType.LABEL, text: 'Grid Management' },
          {
            func: 'newGrid',
            blockType: Scratch.BlockType.BUTTON,
            text: 'Make a Grid',
            hideFromPalette: false
          },
          {
            func: 'renameGrid',
            blockType: Scratch.BlockType.BUTTON,
            text: 'Rename a Grid',
            get hideFromPalette() {
              return Object.keys(grids).length === 0
            }
          },
          {
            func: 'deleteGrid',
            blockType: Scratch.BlockType.BUTTON,
            text: 'Delete a Grid',
            hideFromPalette: Object.keys(grids).length === 0
          },
          { blockType: Scratch.BlockType.LABEL, text: 'List of grids:' },
          {
            blockType: Scratch.BlockType.XML,
            get xml() {
              let xml = `<sep gap="-12"/><sep gap="12"/><sep gap="-10"/>`;
              Object.keys(grids).forEach((gridName) => {
                xml += `<label text="• ${xmlSafe(gridName)}"/><sep gap="-12"/><sep gap="12"/><sep gap="-10"/>`;
              });
              return xml;
            }
          },
          '---',
          { blockType: Scratch.BlockType.LABEL, text: 'Data Management' },
          {
            opcode: 'addRows',
            blockType: Scratch.BlockType.COMMAND,
            text: 'add [count] rows to grid [gridName]',
            arguments: {
              count: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: '1'
              },
              gridName: {
                type: Scratch.ArgumentType.STRING,
                menu: 'gridMenu'
              }
            },
            blockIconURI: getBlockIcon(),
            hideFromPalette: false
          },
          {
            opcode: 'addColumns',
            blockType: Scratch.BlockType.COMMAND,
            text: 'add [count] columns to grid [gridName]',
            arguments: {
              count: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              gridName: {
                type: Scratch.ArgumentType.STRING,
                menu: 'gridMenu'
              }
            },
            blockIconURI: getBlockIcon(),
            hideFromPalette: false
          },
          {
            opcode: 'insertRows',
            blockType: Scratch.BlockType.COMMAND,
            text: 'insert [count] rows into grid [gridName] at index [idx]',
            arguments: {
              count: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              gridName: {
                type: Scratch.ArgumentType.STRING,
                menu: 'gridMenu',
              },
              idx: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            },
            blockIconURI: getBlockIcon(),
            hideFromPalette: false
          },
          {
            opcode: 'insertColumns',
            blockType: Scratch.BlockType.COMMAND,
            text: 'insert [count] columns into grid [gridName] at index [idx]',
            arguments: {
              count: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              gridName: {
                type: Scratch.ArgumentType.STRING,
                menu: 'gridMenu',
              },
              idx: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              }
            },
            blockIconURI: getBlockIcon(),
            hideFromPalette: false
          },
          {
            opcode: 'deleteRow',
            blockType: Scratch.BlockType.COMMAND,
            text: 'delete row #[rowNum] from grid [gridName]',
            arguments: {
              rowNum: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              gridName: {
                type: Scratch.ArgumentType.STRING,
                menu: 'gridMenu'
              }
            },
            blockIconURI: getBlockIcon(),
            hideFromPalette: false
          },
          {
            opcode: 'deleteColumn',
            blockType: Scratch.BlockType.COMMAND,
            text: 'delete column #[columnNum] from grid [gridName]',
            arguments: {
              columnNum: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1,
              },
              gridName: {
                type: Scratch.ArgumentType.STRING,
                menu: 'gridMenu'
              }
            },
            blockIconURI: getBlockIcon(),
            hideFromPalette: false
          },
          {
            opcode: 'deleteAll',
            blockType: Scratch.BlockType.COMMAND,
            text: 'delete all rows and columns from grid [gridName]',
            arguments: {
              gridName: {
                type: Scratch.ArgumentType.STRING,
                menu: 'gridMenu'
              }
            },
            blockIconURI: getBlockIcon(),
            hideFromPalette: false
          },
          {
            opcode: 'setCellValue',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set value of cell at x: [x] y: [y] to [value] in grid [gridName]',
            arguments: {
              x: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              value: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'value'
              },
              gridName: {
                type: Scratch.ArgumentType.STRING,
                menu: 'gridMenu'
              }
            },
            blockIconURI: getBlockIcon(),
            hideFromPalette: false
          },
          {
            opcode: 'getCellValue',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get value of cell at x: [x] y: [y] in grid [gridName]',
            arguments: {
              x: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              gridName: {
                type: Scratch.ArgumentType.STRING,
                menu: 'gridMenu'
              }
            },
            blockIconURI: getBlockIcon(),
            hideFromPalette: false
          },
          {
            opcode: 'indexesOf',
            blockType: Scratch.BlockType.REPORTER,
            text: 'all indexes of [value] in grid [gridName]',
            arguments: {
              value: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'value'
              },
              gridName: {
                type: Scratch.ArgumentType.STRING,
                menu: 'gridMenu'
              }
            },
            blockIconURI: getBlockIcon(),
            hideFromPalette: false
          },
          {
            opcode: 'replaceAll',
            blockType: Scratch.BlockType.COMMAND,
            text: 'replace all [oldValue] with [newValue] in grid [gridName]',
            arguments: {
              oldValue: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'value'
              },
              newValue: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'new value'
              },
              gridName: {
                type: Scratch.ArgumentType.STRING,
                menu: 'gridMenu'
              }
            },
            blockIconURI: getBlockIcon(),
            hideFromPalette: false
          },
          {
            opcode: 'fillGrid',
            blockType: Scratch.BlockType.COMMAND,
            text: 'fill grid [gridName] with [value]',
            arguments: {
              gridName: {
                type: Scratch.ArgumentType.STRING,
                menu: 'gridMenu'
              },
              value: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'value'
              }
            },
            blockIconURI: getBlockIcon(),
            hideFromPalette: false
          },
          {
            opcode: 'getRow',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get row [rowNum] of grid [gridName] as array',
            arguments: {
              rowNum: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              gridName: {
                type: Scratch.ArgumentType.STRING,
                menu: 'gridMenu'
              }
            },
            blockIconURI: getBlockIcon(),
            hideFromPalette: false
          },
          {
            opcode: 'getColumn',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get column [columnNum] of grid [gridName] as array',
            arguments: {
              columnNum: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              gridName: {
                type: Scratch.ArgumentType.STRING,
                menu: 'gridMenu'
              }
            },
            blockIconURI: getBlockIcon(),
            hideFromPalette: false
          },
          {
            opcode: 'getDimension',
            blockType: Scratch.BlockType.REPORTER,
            text: '[dimensionType] of grid [gridName]',
            arguments: {
              dimensionType: {
                type: Scratch.ArgumentType.STRING,
                menu: 'dimensionType'
              },
              gridName: {
                type: Scratch.ArgumentType.STRING,
                menu: 'gridMenu'
              }
            },
            blockIconURI: getBlockIcon(),
            disableMonitor: true,
            hideFromPalette: false
          },
          {
            opcode: 'scratchSerialize',
            blockType: Scratch.BlockType.REPORTER,
            text: 'grid [gridName] as [valueType]',
            arguments: {
              gridName: {
                type: Scratch.ArgumentType.STRING,
                menu: 'gridMenu'
              },
              valueType: {
                type: Scratch.ArgumentType.STRING,
                menu: 'JSONtype'
              }
            },
            blockIconURI: getBlockIcon(),
            disableMonitor: true,
            hideFromPalette: false
          },
          { blockType: Scratch.BlockType.LABEL, text: 'Iteration' },
          {
            opcode: 'iterateItems',
            blockType: Scratch.BlockType.LOOP,
            text: 'for each [item] [x] [y] in grid [gridName]',
            arguments: {
              item: {
                type: Scratch.ArgumentType.STRING,
                fillIn: 'iterationItem'
              },
              x: {
                type: Scratch.ArgumentType.STRING,
                fillIn: 'iterationX'
              },
              y: {
                type: Scratch.ArgumentType.STRING,
                fillIn: 'iterationY'
              },
              gridName: {
                type: Scratch.ArgumentType.STRING,
                menu: 'gridMenu'
              }
            },
            blockIconURI: getBlockIcon(),
            hideFromPalette: true
          },
          {
            opcode: 'iterationItem',
            blockType: Scratch.BlockType.REPORTER,
            outputShape: Scratch.BlockShape.SQUARE,
            text: 'item',
            canDragDuplicate: true,
            disableMonitor: true,
            hideFromPalette: true
          },
          {
            opcode: 'iterationX',
            blockType: Scratch.BlockType.REPORTER,
            outputShape: Scratch.BlockShape.SQUARE,
            text: 'x',
            canDragDuplicate: true,
            disableMonitor: true,
            hideFromPalette: true
          },
          {
            opcode: 'iterationY',
            blockType: Scratch.BlockType.REPORTER,
            outputShape: Scratch.BlockShape.SQUARE,
            text: 'y',
            canDragDuplicate: true,
            disableMonitor: true,
            hideFromPalette: true
          },
          {
            opcode: 'iterateRows',
            blockType: Scratch.BlockType.LOOP,
            text: 'for each [row] [idx] in grid [gridName]',
            arguments: {
              gridName: {
                type: Scratch.ArgumentType.STRING,
                menu: 'gridMenu'
              },
              row: {
                type: Scratch.ArgumentType.STRING,
                fillIn: 'iterationRow'
              },
              idx: {
                type: Scratch.ArgumentType.STRING,
                fillIn: 'iterationIdx'
              }
            },
            blockIconURI: getBlockIcon(),
            hideFromPalette: true
          },
          {
            opcode: 'iterationRow',
            blockType: Scratch.BlockType.REPORTER,
            outputShape: Scratch.BlockShape.SQUARE,
            text: 'row',
            canDragDuplicate: true,
            disableMonitor: true,
            hideFromPalette: true
          },
          {
            opcode: 'iterateColumns',
            blockType: Scratch.BlockType.LOOP,
            text: 'for each [column] [idx] in grid [gridName]',
            arguments: {
              gridName: {
                type: Scratch.ArgumentType.STRING,
                menu: 'gridMenu'
              },
              column: {
                type: Scratch.ArgumentType.STRING,
                fillIn: 'iterationColumn'
              },
              idx: {
                type: Scratch.ArgumentType.STRING,
                fillIn: 'iterationIdx'
              }
            },
            blockIconURI: getBlockIcon(),
            hideFromPalette: true
          },
          {
            opcode: 'iterationColumn',
            blockType: Scratch.BlockType.REPORTER,
            outputShape: Scratch.BlockShape.SQUARE,
            text: 'column',
            canDragDuplicate: true,
            disableMonitor: true,
            hideFromPalette: true
          },
          {
            opcode: 'iterationIdx',
            blockType: Scratch.BlockType.REPORTER,
            outputShape: Scratch.BlockShape.SQUARE,
            text: 'index',
            canDragDuplicate: true,
            disableMonitor: true,
            hideFromPalette: true
          },
          {
            // Iteration for Items
            blockType: Scratch.BlockType.XML,
            xml: `
              <block type="epDataGrids_iterateItems">
                <value name="item"><shadow type="epDataGrids_iterationItem"></shadow></value>
                <value name="x"><shadow type="epDataGrids_iterationX"></shadow></value>
                <value name="y"><shadow type="epDataGrids_iterationY"></shadow></value>
                <value name="gridName"><shadow type="epDataGrids_menu_gridMenu"></shadow></value>
              </block>`
          },
          {
            // Iteration for Rows
            blockType: Scratch.BlockType.XML,
            xml: `
              <block type="epDataGrids_iterateRows">
                <value name="row"><shadow type="epDataGrids_iterationRow"></shadow></value>
                <value name="idx"><shadow type="epDataGrids_iterationIdx"></shadow></value>
                <value name="gridName"><shadow type="epDataGrids_menu_gridMenu"></shadow></value>
              </block>`
          },
          {
            // Iteration for Columns
            blockType: Scratch.BlockType.XML,
            xml: `
              <block type="epDataGrids_iterateColumns">
                <value name="column"><shadow type="epDataGrids_iterationColumn"></shadow></value>
                <value name="idx"><shadow type="epDataGrids_iterationIdx"></shadow></value>
                <value name="gridName"><shadow type="epDataGrids_menu_gridMenu"></shadow></value>
              </block>
            `
          },
          { blockType: Scratch.BlockType.LABEL, text: 'Utilities' },
          {
            blockType: Scratch.BlockType.XML,
            xml: `<label text="This one is for grid-related custom"/><sep gap="-12"/><sep gap="12"/>
            <sep gap="-10"/><label text="blocks so you can use a menu instead"/><sep gap="-12"/><sep gap="12"/>
            <sep gap="-10"/><label text="of manually typing a name every time."/><sep gap="-12"/><sep gap="12"/>`
          },
          {
            opcode: 'getGridName',
            blockType: Scratch.BlockType.REPORTER,
            text: 'grid [gridName]',
            arguments: {
              gridName: {
                type: Scratch.ArgumentType.STRING,
                menu: 'gridMenu'
              }
            },
            disableMonitor: true,
            hideFromPalette: false
          }
        ],
        menus: {
          gridMenu: {
            acceptReporters: true,
            items: 'getGridMenu'
          },
          JSONtype: {
            acceptReporters: false,
            items: ['array', 'object']
          },
          dimensionType: {
            acceptReporters: false,
            items: ['width', 'height']
          }
        }
      };
    }
    DISCLAIMER() {
      alert('DISCLAIMER: This extension only actively supports TurboWarp and PenguinMod. If any bugs occur in other Scratch mods, that is fully expected. However, if a bug occurs in TurboWarp or PenguinMod, it should be reported.')
    }
    getGridMenu() {
      return Object.keys(grids).length === 0? [''] : Object.keys(grids)
    }
    async newGrid() {
      let gridName = await prompt('New Grid', 'New grid name:');
      if (gridName === null) return;
      gridName = gridName
        .replace(/\[/g, '［')
        .replace(/\]/g, '］');
      if (gridName.length === 0) {
        alert('Grid name cannot be empty.');
      } else if (gridName in grids) {
        alert('This grid name is in use.');
      } else if (gridName.length > 30) {
        alert('Grid name too long.');
      } else {
        grids[gridName] = Grid.new(0, 0);
      }
      vm.extensionManager.refreshBlocks();
      updateProjectStorage();
    }
    async renameGrid() {
      const oldName = await promptSelect('Rename a Grid', 'Select a grid to rename:', Object.keys(grids));
      if (oldName in grids) {
        const newName = await prompt('Rename a Grid', `New name for grid "${oldName}":`);
        if (newName.length === 0) {
          alert('Grid name cannot be empty.');
        } else if (newName in grids) {
          alert('This grid name is in use.');
        } else if (newName.length > 30) {
          alert('Grid name too long.');
        } else {
          grids = renameKey(grids, oldName, newName);
          vm.runtime.targets.forEach(target => {
            const blocks = target.blocks._blocks;
            console.log(Object.entries(blocks))
            for (const [blockId, block] of Object.entries(blocks)) {
              if (block.opcode === 'epDataGrids_menu_gridMenu') {
                if (block.fields.gridMenu.value === oldName) {
                  block.fields.gridMenu.value = newName
                }
              }
            }
          });
        }
        vm.extensionManager.refreshBlocks();
        vm.refreshWorkspace();
        updateProjectStorage();
      }
    }
    async deleteGrid() {
      const toDelete = await promptSelect('Delete a Grid', 'Select a grid to delete:', Object.keys(grids));
      if (toDelete === null) return;
      if (toDelete in grids) {
        if (confirm(`Are you sure you want to delete grid ${JSON.stringify(toDelete)}?`)) {
          delete grids[toDelete];
        }
      } else {
        alert(`Grid ${JSON.stringify(toDelete)} not found`)
      }
      vm.extensionManager.refreshBlocks();
      updateProjectStorage();
    }
    addRows(args) {
      if (args.gridName in grids) {
        grids[args.gridName].addRows(args.count)
      } else {
        console.error('Data Grids: Grid not found')
      }
      updateProjectStorage();
    }
    addColumns(args) {
      if (args.gridName in grids) {
        grids[args.gridName].addColumns(args.count)
      } else {
        console.error('Data Grids: Grid not found')
      }
      updateProjectStorage();
    }
    insertRows(args) {
      if (args.gridName in grids) {
        grids[args.gridName].insertRows(args.count, args.idx)
      } else {
        console.error('Data Grids: Grid not found')
      }
      updateProjectStorage();
    }
    insertColumns(args) {
      if (args.gridName in grids) {
        grids[args.gridName].insertColumns(args.count, args.idx);
      } else {
        console.error('Data Grids: Grid not found');
      }
      updateProjectStorage();
    }
    deleteRow(args) {
      if (args.gridName in grids) {
        grids[args.gridName].deleteRow(args.rowNum);
      } else {
        console.error('Data Grids: Grid not found')
      }
      updateProjectStorage();
    }
    deleteColumn(args) {
      if (args.gridName in grids) {
        grids[args.gridName].deleteColumn(args.columnNum);
      } else {
        console.error('Data Grids: Grid not found');
      }
      updateProjectStorage();
    }
    deleteAll(args) {
      if (args.gridName in grids) {
        grids[args.gridName] = Grid.new(0, 0);
      } else {
        console.error('Data Grids: Grid not found');
      }
      updateProjectStorage();
    }
    setCellValue(args) {
      if (args.gridName in grids) {
        grids[args.gridName].set(args.x, args.y, args.value);
      } else {
        console.error('Data Grids: Grid not found');
      }
      updateProjectStorage();
    }
    getCellValue(args) {
      if (args.gridName in grids) {
        return grids[args.gridName].get(args.x, args.y);
      } else {
        console.error('Data Grids: Grid not found');
        return '';
      }
    }
    indexesOf(args) {
      if (args.gridName in grids) {
        return JSON.stringify(grids[args.gridName].findAll(args.value))
      } else {
        console.error('Data Grids: Grid not found');
        return '[]';
      }
    }
    replaceAll(args) {
      if (args.gridName in grids) {
        grids[args.gridName].replaceAll(args.oldValue, args.newValue)
      } else {
        console.error('Data Grids: Grid not found')
      }
      updateProjectStorage();
    }
    fillGrid(args) {
      if (args.gridName in grids) {
        grids[args.gridName].fill(args.value)
      } else {
        console.error('Data Grids: Grid not found')
      }
      updateProjectStorage();
    }
    getRow(args) {
      if (args.gridName in grids) {
        return JSON.stringify(grids[args.gridName].getRow(args.rowNum))
      } else {
        console.error('Data Grids: Grid not found');
        return '[]';
      }
    }
    getColumn(args) {
      if (args.gridName in grids) {
        return JSON.stringify(grids[args.gridName].getColumn(args.columnNum))
      } else {
        console.error('Data Grids: Grid not found');
        return '[]';
      }
    }
    getDimension(args) {
      if (args.gridName in grids) {
        return args.dimensionType === 'width' ? grids[args.gridName].getWidth() : grids[args.gridName].getHeight();
      } else {
        console.error('Data Grids: Grid not found');
        return 0;
      }
    }
    scratchSerialize(args) {
      if (args.gridName in grids) {
        return args.valueType === 'array' ? grids[args.gridName].serialize() : grids[args.gridName].serializeObject();
      } else {
        console.error('Data Grids: Grid not found');
        return args.valueType === 'array' ? '[]' : '{}';
      }
    }
    getGridName(args) {
      if (args.gridName in grids) {
        return args.gridName;
      } else {
        console.error('Data Grids: Grid not found');
        return '';
      }
    }
    iterateItems(args, util) {
      if (!(args.gridName in grids)) {
        console.error('Data Grids: Grid not found');
        return false;
      }
      const grid = grids[args.gridName];
      const itemCount = grid.getWidth() * grid.getHeight();
      const flattenedArr = grid.getItems().flat(Infinity);
      if (util.stackFrame.loopCounter === undefined) {
        util.stackFrame.loopCounter = itemCount;
      }
      const index = Math.abs(util.stackFrame.loopCounter - itemCount);

      util.thread.epGridsIterationData = {
        item: flattenedArr[index],
        x: (index % grid.getWidth()) + 1,
        y: Math.floor(index / grid.getWidth()) + 1
      }
      util.stackFrame.loopCounter--;
      if (util.stackFrame.loopCounter >= 0) {
        util.startBranch(1, true);
      } else {
        delete util.thread.epGridsIterationData;
      }
    }
    iterationItem(args, util) {
      return util.thread.epGridsIterationData?.item || '';
    }
    iterationX(args, util) {
      return util.thread.epGridsIterationData?.x || 0;
    }
    iterationY(args, util) {
      return util.thread.epGridsIterationData?.y || 0;
    }
    iterateRows(args, util) {
      if (!(args.gridName in grids)) {
        console.error('Data Grids: Grid not found');
        return false;
      }
      const grid = grids[args.gridName];
      const rowCount = grid.getHeight();
      if (util.stackFrame.loopCounter === undefined) {
        util.stackFrame.loopCounter = rowCount;
      }
      const index = Math.abs(util.stackFrame.loopCounter - rowCount) + 1;

      util.thread.epGridsIterationData = {
        row: JSON.stringify(grid.getRow(index)),
        idx: index
      }
      util.stackFrame.loopCounter--;
      if (util.stackFrame.loopCounter >= 0) {
        util.startBranch(1, true);
      } else {
        delete util.thread.epGridsIterationData;
      }
    }
    iterationRow(args, util) {
      return util.thread.epGridsIterationData?.row || '';
    }
    iterateColumns(args, util) {
      if (!(args.gridName in grids)) {
        console.error('Data Grids: Grid not found');
        return false;
      }
      const grid = grids[args.gridName];
      const columnCount = grid.getWidth();
      if (util.stackFrame.loopCounter === undefined) {
        util.stackFrame.loopCounter = columnCount;
      }
      const index = Math.abs(util.stackFrame.loopCounter - columnCount) + 1;

      util.thread.epGridsIterationData = {
        column: JSON.stringify(grid.getColumn(index)),
        idx: index
      }
      util.stackFrame.loopCounter--;
      if (util.stackFrame.loopCounter >= 0) {
        util.startBranch(1, true);
      } else {
        delete util.thread.epGridsIterationData;
      }
    }
    iterationColumn(args, util) {
      return util.thread.epGridsIterationData?.column || '';
    }
    iterationIdx(args, util) {
      return util.thread.epGridsIterationData?.idx || 0;
    }
  }
  if (isPM) {
    epDataGrids.prototype.serialize = () => {
      return { epDataGrids: serializeState() }
    }
    epDataGrids.prototype.deserialize = (data) => {
      if (data.epDataGrids !== undefined) {
        deserializeState(data.epDataGrids);
      }
    }
  }
  Scratch.extensions.register(new epDataGrids());
})(Scratch);