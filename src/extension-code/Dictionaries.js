// Name: Dictionaries
// ID: epDictionaries
// Description: Create and manage dictionaries, which are key-value pairs. Creating, deleting, and accessing dictionaries works in a similar way to Scratch's defaut variables category. Covers setting and getting values by key, iteration, etc.
(function (Scratch) {
  "use strict";
  if(!Scratch.extensions.unsandboxed) {
    function xmlSafe(str) { return str.replace(/[\u0000-\u001F]/g, '�').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;') } function validId(str) { return str.replaceAll(/[^a-zA-Z0-9]/g, '') } class ErroredExtension { constructor(name) { this.name = name } getInfo() { return { id: `ERR${validId(this.name)}`, name: 'ERR', blocks: [{ blockType: Scratch.BlockType.XML, xml: `<label text="The ${xmlSafe(this.name)} extension"/><sep gap="-12"/><sep gap="12"/><sep gap="-10"/><label text="must run unsandboxed."/><sep gap="-12"/><sep gap="12"/>` },] } } }
    return Scratch.extensions.register(new ErroredExtension('Dictionaries'));
  }
  const [isTW, isPM] = [!Scratch.extensions.isPenguinMod, Scratch.extensions.isPenguinMod];
  const vm = Scratch.vm;
  function getMenuIcon() {
    return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+ICAgPGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNDUiIGZpbGw9IiNmZjI4MGEiLz4gICA8ZyBpZD0iYWxsLWVsZW1lbnRzIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNCwtNCkgc2NhbGUoMS40LDEuNCkiPiAgICAgPGcgaWQ9ImdyaWQtc3F1YXJlcyIgZmlsbD0id2hpdGUiPiA8IS0tR3JpZCBTcXVhcmVzLS0+ICAgICAgIDxyZWN0IHg9IjMyIiB5PSIzMiIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIi8+ICAgICAgIDxyZWN0IHg9IjQ4IiB5PSIzMiIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIi8+ICAgICAgIDxyZWN0IHg9IjMyIiB5PSI0OCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIi8+ICAgICAgIDxyZWN0IHg9IjQ4IiB5PSI0OCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIi8+ICAgICA8L2c+ICAgICA8ZyBpZD0iYnVsbGV0LXBvaW50cyIgZmlsbD0id2hpdGUiPiAgICAgICA8ZyBpZD0idG9wIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMC44NSwwKSI+IDwhLS1Ub3AgQnVsbGV0IFBvaW50cy0tPiAgICAgICAgIDxjaXJjbGUgY3g9IjM4IiBjeT0iMjAiIHI9IjQiLz4gICAgICAgICA8Y2lyY2xlIGN4PSI1NCIgY3k9IjIwIiByPSI0Ii8+ICAgICAgIDwvZz4gICAgICAgPGcgaWQ9ImxlZnQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsLTAuODUpIj4gPCEtLUxlZnQgQnVsbGV0IFBvaW50cy0tPiAgICAgICAgIDxjaXJjbGUgY3g9IjIwIiBjeT0iMzgiIHI9IjQiLz4gICAgICAgICA8Y2lyY2xlIGN4PSIyMCIgY3k9IjU0IiByPSI0Ii8+ICAgICAgIDwvZz4gICAgIDwvZz4gICA8L2c+IDwvc3ZnPg=='
  }
  function getBlockIcon() {
    return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+ICAgICA8Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0NSIgZmlsbD0iI2IyMjIwYSIgLz4gICAgIDxnIGlkPSJhbGwtZWxlbWVudHMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC00LC00KSBzY2FsZSgxLjQsMS40KSIgZmlsbD0iI2ZmZmZmZiI+ICAgICAgICAgPGcgaWQ9ImdyaWQtc3F1YXJlcyI+ICAgICAgICAgICAgIDwhLS0gR3JpZCBTcXVhcmVzIC0tPiAgICAgICAgICAgICA8cmVjdCB4PSIzMiIgeT0iMzIiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgLz4gICAgICAgICAgICAgPHJlY3QgeD0iNDgiIHk9IjMyIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIC8+ICAgICAgICAgICAgIDxyZWN0IHg9IjMyIiB5PSI0OCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiAvPiAgICAgICAgICAgICA8cmVjdCB4PSI0OCIgeT0iNDgiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgLz4gICAgICAgICA8L2c+ICAgICAgICAgPGcgaWQ9ImJ1bGxldC1wb2ludHMiPiAgICAgICAgICAgICA8ZyBpZD0idG9wIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMC44NSwwKSI+ICAgICAgICAgICAgICAgICA8Y2lyY2xlIGN4PSIzOCIgY3k9IjIwIiByPSI0IiAvPiAgICAgICAgICAgICAgICAgPGNpcmNsZSBjeD0iNTQiIGN5PSIyMCIgcj0iNCIgLz4gICAgICAgICAgICAgPC9nPiAgICAgICAgICAgICA8ZyBpZD0ibGVmdCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwtMC44NSkiPiAgICAgICAgICAgICAgICAgPGNpcmNsZSBjeD0iMjAiIGN5PSIzOCIgcj0iNCIgLz4gICAgICAgICAgICAgICAgIDxjaXJjbGUgY3g9IjIwIiBjeT0iNTQiIHI9IjQiIC8+ICAgICAgICAgICAgIDwvZz4gICAgICAgICA8L2c+ICAgICA8L2c+IDwvc3ZnPg=='
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
        action(i + 1, escapeLoop, continueLoop);
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
  const regenReporters = ['epDictionaries_iterationKey', 'epDictionaries_iterationValue'];
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
  class Dictionary extends Map {
    constructor(entries = []) {
      super(entries);
    }
  
    static #escape(str) {
      return String(str).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    }
    static #unescape(str) {
      return str.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    }
  
    forEach(callback, thisArg) {
      for (const [key, value] of this.entries()) {
        callback.call(thisArg, key, value, this); // (key, value, map)
      }
    }
    keysOf(value) {
      let keys = [];
      this.forEach((key, val) => {
        if (val === value) {
          keys.push(key);
        }
      });
      return keys;
    }

    at(index) {
      const entry = Array.from(this.entries())[index];
      return entry ? { key: entry[0], value: entry[1] } : undefined;
    }

    serialize() {
      const parts = [];
      for (const [key, value] of this.entries()) {
        const escapedKey = Dictionary.#escape(key);
        const escapedValue = Dictionary.#escape(value);
        parts.push(`"${escapedKey}"="${escapedValue}"`);
      }
      return `<${parts.join(' | ')}>`;
    }
    static deserialize(str) {
      if (!str.startsWith('<') || !str.endsWith('>')) {
        throw new Error('Invalid format');
      }
  
      const content = str.slice(1, -1).trim();
      if (!content) return new Dictionary;
      const entries = [];
      const regex = /"((?:\\.|[^"\\])*)"="((?:\\.|[^"\\])*)"/g;
      let match;
      while ((match = regex.exec(content)) !== null) {
        const key = Dictionary.#unescape(match[1]);
        const value = Dictionary.#unescape(match[2]);
        entries.push([key, value]);
      }
      return new Dictionary(entries);
    }
    
    serializeObj() {
      const obj = {};
      this.forEach((key, value) => {
        obj[key] = value;
      });
      return JSON.stringify(obj);
    }
    serializeArr() {
      return JSON.stringify(Array.from(this.entries()));
    }
  }
  let dictionaries = {};
  const customStorage = {
    set: (data) => {
      if (isTW) vm.runtime.extensionStorage.epDictionaries = { data };
    },
    get: () => {
      if (isTW) return vm.runtime.extensionStorage.epDictionaries?.data; else return;
    }
  }
  function serializeState() {
    // Need to work on this
  }
  function updateProjectStorage() {
    customStorage.set(serializeState());
  }
  function deserializeState(state) {
    console.log('Dictionaries: Loading serialized project data')
    dictionaries = {};
    Object.entries(state).forEach(([key, value]) => {
      // Need to work on this
    })
    vm.extensionManager.refreshBlocks();
  }
  if (isTW) vm.runtime.on('PROJECT_LOADED', () => {
    const data = customStorage.get();
    deserializeState(data);
  });
  class epDictionaries {
    getInfo() {
      return {
        id: 'epDictionaries',
        name: 'Dictionaries',
        color1: '#458294',
        color2: '#256274',
        color3: '#256274',
        menuIconURI: getMenuIcon(),
        blocks: [
          {
            func: 'DISCLAIMER',
            blockType: Scratch.BlockType.BUTTON,
            text: 'DISCLAIMER',
            hideFromPalette: false
          },
          { blockType: Scratch.BlockType.LABEL, text: 'Dictionary Management' },
          {
            func: 'newDictionary',
            blockType: Scratch.BlockType.BUTTON,
            text: 'Make a Dictionary',
            hideFromPalette: false
          },
          {
            func: 'deleteDictionary',
            blockType: Scratch.BlockType.BUTTON,
            text: 'Delete a Dictionary',
            hideFromPalette: Object.keys(dictionaries).length === 0
          },
          { blockType: Scratch.BlockType.LABEL, text: 'List of dictionaries:' },
          {
            blockType: Scratch.BlockType.XML,
            get xml() {
              let xml = `<sep gap="-12"/><sep gap="12"/><sep gap="-10"/>`;
              Object.keys(dictionaries).forEach((dictName) => {
                xml += `<label text="• ${xmlSafe(dictName)}"/><sep gap="-12"/><sep gap="12"/><sep gap="-10"/>`;
              });
              return xml;
            }
          },
          '---',
          { blockType: Scratch.BlockType.LABEL, text: 'Data Management' },
          {
            opcode: 'deleteAll',
            blockType: Scratch.BlockType.COMMAND,
            text: 'delete all data from dictionary [dictionaryName]',
            arguments: {
              dictionaryName: {
                type: Scratch.ArgumentType.STRING,
                menu: 'dictionaryMenu'
              }
            },
            blockIconURI: getBlockIcon(),
            hideFromPalette: false
          },
          {
            opcode: 'setValue',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set value of key [key] to [value] in dictionary [dictionaryName]',
            arguments: {
              key: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'health'
              },
              value: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '42'
              },
              dictionaryName: {
                type: Scratch.ArgumentType.STRING,
                menu: 'dictionaryMenu'
              }
            },
            blockIconURI: getBlockIcon(),
            hideFromPalette: false
          },
          {
            opcode: 'getValue',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get value of key [key] in dictionary [dictionaryName]',
            arguments: {
              key: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'health'
              },
              dictionaryName: {
                type: Scratch.ArgumentType.STRING,
                menu: 'dictionaryMenu'
              }
            },
            blockIconURI: getBlockIcon(),
            hideFromPalette: false
          },
          {
            opcode: 'keysOf',
            blockType: Scratch.BlockType.REPORTER,
            text: 'all keys set to [value] in dictionary [dictionaryName]',
            arguments: {
              value: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'value'
              },
              dictionaryName: {
                type: Scratch.ArgumentType.STRING,
                menu: 'dictionaryMenu'
              }
            },
            blockIconURI: getBlockIcon(),
            hideFromPalette: false
          },
          {
            opcode: 'getSize',
            blockType: Scratch.BlockType.REPORTER,
            text: 'size of dictionary [dictionaryName]',
            arguments: {
              dimensionType: {
                type: Scratch.ArgumentType.STRING,
                menu: 'dimensionType'
              },
              dictionaryName: {
                type: Scratch.ArgumentType.STRING,
                menu: 'dictionaryMenu'
              }
            },
            blockIconURI: getBlockIcon(),
            disableMonitor: true,
            hideFromPalette: false
          },
          {
            opcode: 'scratchSerialize',
            blockType: Scratch.BlockType.REPORTER,
            text: 'dictionary [dictionaryName] as [valueType]',
            arguments: {
              dictionaryName: {
                type: Scratch.ArgumentType.STRING,
                menu: 'dictionaryMenu'
              },
              valueType: {
                type: Scratch.ArgumentType.STRING,
                menu: 'serializationType'
              }
            },
            blockIconURI: getBlockIcon(),
            disableMonitor: true,
            hideFromPalette: false
          },
          { blockType: Scratch.BlockType.LABEL, text: 'Iteration' },
          {
            opcode: 'iterate',
            blockType: Scratch.BlockType.LOOP,
            text: 'for each [key] [value] in dictionary [dictionaryName]',
            arguments: {
              key: {
                type: Scratch.ArgumentType.STRING,
                fillIn: 'iterationKey'
              },
              value: {
                type: Scratch.ArgumentType.STRING,
                fillIn: 'iterationValue'
              },
              dictionaryName: {
                type: Scratch.ArgumentType.STRING,
                menu: 'dictionaryMenu'
              }
            },
            blockIconURI: getBlockIcon(),
            hideFromPalette: true
          },
          {
            opcode: 'iterationKey',
            blockType: Scratch.BlockType.REPORTER,
            outputShape: 3,
            text: 'key',
            canDragDuplicate: true,
            disableMonitor: true,
            hideFromPalette: true
          },
          {
            opcode: 'iterationValue',
            blockType: Scratch.BlockType.REPORTER,
            outputShape: 3,
            text: 'value',
            canDragDuplicate: true,
            disableMonitor: true,
            hideFromPalette: true
          },
          {
            // Iteration
            blockType: Scratch.BlockType.XML,
            xml: `
              <block type="epDictionaries_iterate">
                <value name="key"><shadow type="epDictionaries_iterationKey"></shadow></value>
                <value name="value"><shadow type="epDictionaries_iterationValue"></shadow></value>
                <value name="dictionaryName"><shadow type="epDictionaries_menu_dictionaryMenu"></shadow></value>
              </block>`
          },
          { blockType: Scratch.BlockType.LABEL, text: 'Utilities' },
          {
            blockType: Scratch.BlockType.XML,
            xml: `<label text="This one is for dictionary-related custom"/><sep gap="-12"/><sep gap="12"/>
            <sep gap="-10"/><label text="blocks so you can use a menu instead"/><sep gap="-12"/><sep gap="12"/>
            <sep gap="-10"/><label text="of manually typing a name every time."/><sep gap="-12"/><sep gap="12"/>`
          },
          {
            opcode: 'getDictionaryName',
            blockType: Scratch.BlockType.REPORTER,
            text: 'dictionary [dictionaryName]',
            arguments: {
              dictionaryName: {
                type: Scratch.ArgumentType.STRING,
                menu: 'dictionaryMenu'
              }
            },
            disableMonitor: true,
            hideFromPalette: false
          }
        ],
        menus: {
          dictionaryMenu: {
            acceptReporters: true,
            items: 'getDictionaryMenu'
          },
          serializationType: {
            acceptReporters: false,
            items: ['dictionary', 'object', 'array']
          }
        }
      };
    }
    DISCLAIMER() {
      alert('DISCLAIMER: This extension only actively supports TurboWarp and PenguinMod. If any bugs occur in other Scratch mods, that is fully expected. However, if a bug occurs in TurboWarp or PenguinMod, it should be reported.')
    }
    getDictionaryMenu() {
      return Object.keys(dictionaries).length === 0? [''] : Object.keys(dictionaries)
    }
    async newDictionary() {
      let defaultDictionaryName;
      repeat (Infinity, (i, escape) => {
        defaultDictionaryName = `my dictionary ${i}`;
        if (!Object.keys(dictionaries).includes(defaultDictionaryName)) escape();
      });
      let dictionaryName = await prompt('What should the dictionary be called?', defaultDictionaryName);
      if (dictionaryName === null) return;
      dictionaryName = dictionaryName
        .replace(/\[/g, '［')
        .replace(/\]/g, '］');
      if (dictionaryName.length === 0) {
        alert('Dictionary name cannot be empty.');
      } else if (dictionaryName in dictionaries) {
        alert('This dictionary name is in use.');
      } else if (dictionaryName.length > 30) {
        alert('Dictionary name too long.');
      } else {
        dictionaries[dictionaryName] = new Dictionary();
      }
      vm.extensionManager.refreshBlocks();
      updateProjectStorage();
    }
    async deleteDictionary() {
      const toDelete = await prompt('What is the name of the dictionary that should be deleted?');
      if (toDelete === null) return;
      if (toDelete in dictionaries) {
        if (confirm(`Are you sure you want to delete dictionary ${JSON.stringify(toDelete)}?`)) {
          delete dictionaries[toDelete];
        }
      } else {
        alert(`Dictionary ${JSON.stringify(toDelete)} not found`)
      }
      vm.extensionManager.refreshBlocks();
      updateProjectStorage();
    }
    deleteAll(args) {
      if (args.dictionaryName in dictionaries) {
        dictionaries[args.dictionaryName].clear();
      } else {
        console.error('Dictionaries: Dictionary not found');
      }
      updateProjectStorage();
    }
    setValue(args) {
      if (args.dictionaryName in dictionaries) {
        dictionaries[args.dictionaryName].set(args.key, args.value);
      } else {
        console.error('Dictionaries: Dictionary not found');
      }
      updateProjectStorage();
    }
    getValue(args) {
      if (args.dictionaryName in dictionaries) {
        return dictionaries[args.dictionaryName].get(args.key);
      } else {
        console.error('Dictionaries: Dictionary not found');
        return '';
      }
    }
    keysOf(args) {
      if (args.dictionaryName in dictionaries) {
        return JSON.stringify(dictionaries[args.dictionaryName].keysOf(args.value));
      } else {
        console.error('Dictionaries: Dictionary not found');
        return '[]';
      }
    }
    getSize(args) {
      if (args.dictionaryName in dictionaries) {
        return dictionaries[args.dictionaryName].size;
      } else {
        console.error('Dictionaries: Dictionary not found');
        return 0;
      }
    }
    scratchSerialize(args) {
      if (args.dictionaryName in dictionaries) {
        switch (args.valueType) {
          case 'dictionary':
            return dictionaries[args.dictionaryName].serialize();
          case 'object':
            return dictionaries[args.dictionaryName].serializeObj();
          case 'array':
            return dictionaries[args.dictionaryName].serializeArr();
        }
      } else {
        console.error('Dictionaries: Dictionary not found');
        return args.valueType === 'dictionary' ? '<>' : (args.valueType === 'object' ? '{}' : '[]');
      }
    }
    getDictionaryName(args) {
      if (args.dictionaryName in dictionaries) {
        return args.dictionaryName;
      } else {
        console.error('Dictionaries: Dictionary not found');
        return '';
      }
    }
    iterate(args, util) {
      if (!(args.dictionaryName in dictionaries)) {
        console.error('Dictionaries: Dictionary not found');
        return false;
      }
      const dictionary = dictionaries[args.dictionaryName];
      const itemCount = dictionary.size;
      if (util.stackFrame.loopCounter === undefined) {
        util.stackFrame.loopCounter = itemCount;
      }
    

      util.thread.epDictsIterationData = dictionary.at(itemCount - loopCounter);
      util.stackFrame.loopCounter--;
      if (util.stackFrame.loopCounter >= 0) {
        util.startBranch(1, true);
      } else {
        delete util.thread.epDictsIterationData;
      }
    }
    iterationKey(args, util) {
      return util.thread.epDictsIterationData?.key || '';
    }
    iterationValue(args, util) {
      return util.thread.epDictsIterationData?.value || '';
    }
  }
  if (isPM) {
    epDictionaries.prototype.serialize = () => {
      return { epDictionaries: serializeState() }
    }
    epDictionaries.prototype.deserialize = (data) => {
      if (data.epDictionaries !== undefined) {
        deserializeState(data.epDictionaries);
      }
    }
  }
  Scratch.extensions.register(new epDictionaries());
})(Scratch);