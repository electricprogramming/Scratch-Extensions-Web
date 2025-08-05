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
    return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+CiAgPGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNDUiIGZpbGw9IiM0NTgyOTQiLz4KICA8ZyBpZD0iYWxsLWVsZW1lbnRzIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjIsLTI4KSBzY2FsZSgxLjYsMS42KSIgZmlsbD0iI2ZmZmZmZiI+CiAgICA8ZyBpZD0iZ3JpZC1zcXVhcmVzIj4KICAgICAgPCEtLSBEaWN0aW9uYXJ5IGtleS12YWx1ZSBwYWlycyAtLT4KICAgICAgPHJlY3QgeD0iMjgiIHk9IjMyIiB3aWR0aD0iMTIiIGhlaWdodD0iOCIvPgogICAgICA8cmVjdCB4PSI1MCIgeT0iMzIiIHdpZHRoPSIxMiIgaGVpZ2h0PSI4Ii8+CiAgICAgIDxyZWN0IHg9IjI4IiB5PSI0NSIgd2lkdGg9IjEyIiBoZWlnaHQ9IjgiLz4KICAgICAgPHJlY3QgeD0iNTAiIHk9IjQ1IiB3aWR0aD0iMTIiIGhlaWdodD0iOCIvPgogICAgICA8cmVjdCB4PSIyOCIgeT0iNTgiIHdpZHRoPSIxMiIgaGVpZ2h0PSI4Ii8+CiAgICAgIDxyZWN0IHg9IjUwIiB5PSI1OCIgd2lkdGg9IjEyIiBoZWlnaHQ9IjgiLz4KICAgIDwvZz4KICAgIDxnIGlkPSJjb2xvbnMiPgogICAgICA8IS0tIENvbG9ucyBiZXR3ZWVuIGtleXMgYW5kIHZhbHVlcyAtLT4KICAgICAgPHJlY3QgeD0iNDMuNzUiIHk9IjMzLjUiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiLz4KICAgICAgPHJlY3QgeD0iNDMuNzUiIHk9IjM4IiB3aWR0aD0iMiIgaGVpZ2h0PSIyIi8+CiAgICAgIDxyZWN0IHg9IjQzLjc1IiB5PSI0Ni41IiB3aWR0aD0iMiIgaGVpZ2h0PSIyIi8+CiAgICAgIDxyZWN0IHg9IjQzLjc1IiB5PSI1MSIgd2lkdGg9IjIiIGhlaWdodD0iMiIvPgogICAgICA8cmVjdCB4PSI0My43NSIgeT0iNTkuNSIgd2lkdGg9IjIiIGhlaWdodD0iMiIvPgogICAgICA8cmVjdCB4PSI0My43NSIgeT0iNjQiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiLz4KICAgIDwvZz4KICA8L2c+Cjwvc3ZnPg=='
  }
  function getBlockIcon() {
    return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+CiAgPGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNDUiIGZpbGw9IiMyNTYyNzQiLz4KICA8ZyBpZD0iYWxsLWVsZW1lbnRzIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjIsLTI4KSBzY2FsZSgxLjYsMS42KSIgZmlsbD0iI2ZmZmZmZiI+CiAgICA8ZyBpZD0iZ3JpZC1zcXVhcmVzIj4KICAgICAgPCEtLSBEaWN0aW9uYXJ5IGtleS12YWx1ZSBwYWlycyAtLT4KICAgICAgPHJlY3QgeD0iMjgiIHk9IjMyIiB3aWR0aD0iMTIiIGhlaWdodD0iOCIvPgogICAgICA8cmVjdCB4PSI1MCIgeT0iMzIiIHdpZHRoPSIxMiIgaGVpZ2h0PSI4Ii8+CiAgICAgIDxyZWN0IHg9IjI4IiB5PSI0NSIgd2lkdGg9IjEyIiBoZWlnaHQ9IjgiLz4KICAgICAgPHJlY3QgeD0iNTAiIHk9IjQ1IiB3aWR0aD0iMTIiIGhlaWdodD0iOCIvPgogICAgICA8cmVjdCB4PSIyOCIgeT0iNTgiIHdpZHRoPSIxMiIgaGVpZ2h0PSI4Ii8+CiAgICAgIDxyZWN0IHg9IjUwIiB5PSI1OCIgd2lkdGg9IjEyIiBoZWlnaHQ9IjgiLz4KICAgIDwvZz4KICAgIDxnIGlkPSJjb2xvbnMiPgogICAgICA8IS0tIENvbG9ucyBiZXR3ZWVuIGtleXMgYW5kIHZhbHVlcyAtLT4KICAgICAgPHJlY3QgeD0iNDMuNzUiIHk9IjMzLjUiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiLz4KICAgICAgPHJlY3QgeD0iNDMuNzUiIHk9IjM4IiB3aWR0aD0iMiIgaGVpZ2h0PSIyIi8+CiAgICAgIDxyZWN0IHg9IjQzLjc1IiB5PSI0Ni41IiB3aWR0aD0iMiIgaGVpZ2h0PSIyIi8+CiAgICAgIDxyZWN0IHg9IjQzLjc1IiB5PSI1MSIgd2lkdGg9IjIiIGhlaWdodD0iMiIvPgogICAgICA8cmVjdCB4PSI0My43NSIgeT0iNTkuNSIgd2lkdGg9IjIiIGhlaWdodD0iMiIvPgogICAgICA8cmVjdCB4PSI0My43NSIgeT0iNjQiIHdpZHRoPSIyIiBoZWlnaHQ9IjIiLz4KICAgIDwvZz4KICA8L2c+Cjwvc3ZnPg=='
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
    let result = {};
    Object.keys(dictionaries).forEach(key => {
      result[key] = dictionaries[key].serialize();
    })
    return result;
  }
  function updateProjectStorage() {
    customStorage.set(serializeState());
  }
  function deserializeState(state) {
    console.log('Dictionaries: Loading serialized project data')
    dictionaries = {};
    Object.entries(state).forEach(([key, value]) => {
      dictionaries[key] = Dictionary.deserialize(value);
    });
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
            opcode: 'hasKey',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'dictionary [dictionaryName] has key [key]?',
            arguments: {
              dictionaryName: {
                type: Scratch.ArgumentType.STRING,
                menu: 'dictionaryMenu'
              },
              key: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'health'
              }
            },
            blockIconURI: getBlockIcon(),
            hideFromPalette: false
          },
          {
            opcode: 'deleteKey',
            blockType: Scratch.BlockType.COMMAND,
            text: 'delete key [key] from dictionary [dictionaryName]',
            arguments: {
              dictionaryName: {
                type: Scratch.ArgumentType.STRING,
                menu: 'dictionaryMenu'
              },
              key: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'health'
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
            opcode: 'allKeysOrValues',
            blockType: Scratch.BlockType.REPORTER,
            text: 'all [keysOrValues] of dictionary [dictionaryName]',
            arguments: {
              keysOrValues: {
                type: Scratch.ArgumentType.STRING,
                menu: 'keysValuesMenu'
              },
              dictionaryName: {
                type: Scratch.ArgumentType.STRING,
                menu: 'dictionaryMenu'
              }
            }
          },
          {
            opcode: 'getAtIndex',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get [data] at index [index] of dictionary [dictionaryName]',
            arguments: {
              data: {
                type: Scratch.ArgumentType.STRING,
                menu: 'keyValueMenu'
              },
              index: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              dictionaryName: {
                type: Scratch.ArgumentType.STRING,
                menu: 'dictionaryMenu'
              }
            }
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
          },
          keysValuesMenu: {
            acceptReporters: false,
            items: ['keys', 'values']
          },
          keyValueMenu: {
            acceptReporters: false,
            items: ['key', 'value']
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
    hasKey(args) {
      if (args.dictionaryName in dictionaries) {
        return dictionaries[args.dictionaryName].has(args.key);
      } else {
        console.error('Dictionaries: Dictionary not found');
        return false;
      }
    }
    deleteKey(args) {
      if (args.dictionaryName in dictionaries) {
        dictionaries[args.dictionaryName].delete(args.key);
      } else {
        console.error('Dictionaries: Dictionary not found');
      }
      updateProjectStorage();
    }
    keysOf(args) {
      if (args.dictionaryName in dictionaries) {
        return JSON.stringify(dictionaries[args.dictionaryName].keysOf(args.value));
      } else {
        console.error('Dictionaries: Dictionary not found');
        return '[]';
      }
    }
    allKeysOrValues(args) {
      if (args.dictionaryName in dictionaries) {
        return JSON.stringify(Array.from(
          (dictionaries[args.dictionaryName][args.keysOrValues])()
        ));
      } else {
        console.error('Dictionaries: Dictionary not found');
        return '[]';
      }
    }
    getAtIndex(args) {
      if (args.dictionaryName in dictionaries) {
        return dictionaries[args.dictionaryName].at(args.index - 1)?.[args.data] || '';
      } else {
        console.error('Dictionaries: Dictionary not found');
        return '';
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
    

      util.thread.epDictsIterationData = dictionary.at(itemCount - util.stackFrame.loopCounter);
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