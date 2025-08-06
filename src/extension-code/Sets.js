// Name: Dictionaries
// ID: epSets
// Description: Create and manage sets, which are key-value pairs. Creating, deleting, and accessing sets works in a similar way to Scratch's defaut variables category. Covers setting and getting values by key, iteration, etc.
(function (Scratch) {
  "use strict";
  if(!Scratch.extensions.unsandboxed) {
    function xmlSafe(str) { return str.replace(/[\u0000-\u001F]/g, '�').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;') } function validId(str) { return str.replaceAll(/[^a-zA-Z0-9]/g, '') } class ErroredExtension { constructor(name) { this.name = name } getInfo() { return { id: `ERR${validId(this.name)}`, name: 'ERR', blocks: [{ blockType: Scratch.BlockType.XML, xml: `<label text="The ${xmlSafe(this.name)} extension"/><sep gap="-12"/><sep gap="12"/><sep gap="-10"/><label text="must run unsandboxed."/><sep gap="-12"/><sep gap="12"/>` },] } } }
    return Scratch.extensions.register(new ErroredExtension('Sets'));
  }
  const [isTW, isPM] = [!Scratch.extensions.isPenguinMod, Scratch.extensions.isPenguinMod];
  const vm = Scratch.vm;
  function getMenuIcon() {
    return ''
  }
  function getBlockIcon() {
    return ''
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
  const regenReporters = ['epSets_iterationItem', 'epSets_iterationIndex'];
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

  class Set extends window.Set {
    constructor(entries = []) {
      super(entries);
    }

    at(index) {
      const entry = Array.from(this.entries())[index];
      return entry ? { key: entry[0], value: entry[1] } : undefined;
    }
  }
  let sets = {};
  const customStorage = {
    set: (data) => {
      if (isTW) vm.runtime.extensionStorage.epSets = { data };
    },
    get: () => {
      if (isTW) return vm.runtime.extensionStorage.epSets?.data; else return;
    }
  }
  function serializeState() {
    let result = {};
    Object.keys(sets).forEach(key => {
      result[key] = sets[key].serialize();
    })
    return result;
  }
  function updateProjectStorage() {
    customStorage.set(serializeState());
  }
  function deserializeState(state) {
    console.log('Dictionaries: Loading serialized project data')
    sets = {};
    Object.entries(state).forEach(([key, value]) => {
      sets[key] = Dictionary.deserialize(value);
    });
    vm.extensionManager.refreshBlocks();
  }
  if (isTW) vm.runtime.on('PROJECT_LOADED', () => {
    const data = customStorage.get();
    deserializeState(data);
  });
  class epSets {
    getInfo() {
      return {
        id: 'epSets',
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
            hideFromPalette: Object.keys(sets).length === 0
          },
          { blockType: Scratch.BlockType.LABEL, text: 'List of sets:' },
          {
            blockType: Scratch.BlockType.XML,
            get xml() {
              let xml = `<sep gap="-12"/><sep gap="12"/><sep gap="-10"/>`;
              Object.keys(sets).forEach((dictName) => {
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
            text: 'delete all data from set [setName]',
            arguments: {
              setName: {
                type: Scratch.ArgumentType.STRING,
                menu: 'setMenu'
              }
            },
            blockIconURI: getBlockIcon(),
            hideFromPalette: false
          },
          {
            opcode: 'setValue',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set value of key [key] to [value] in set [setName]',
            arguments: {
              key: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'health'
              },
              value: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '42'
              },
              setName: {
                type: Scratch.ArgumentType.STRING,
                menu: 'setMenu'
              }
            },
            blockIconURI: getBlockIcon(),
            hideFromPalette: false
          },
          {
            opcode: 'getValue',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get value of key [key] in set [setName]',
            arguments: {
              key: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'health'
              },
              setName: {
                type: Scratch.ArgumentType.STRING,
                menu: 'setMenu'
              }
            },
            blockIconURI: getBlockIcon(),
            hideFromPalette: false
          },
          {
            opcode: 'hasKey',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'set [setName] has key [key]?',
            arguments: {
              setName: {
                type: Scratch.ArgumentType.STRING,
                menu: 'setMenu'
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
            text: 'delete key [key] from set [setName]',
            arguments: {
              setName: {
                type: Scratch.ArgumentType.STRING,
                menu: 'setMenu'
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
            text: 'all keys set to [value] in set [setName]',
            arguments: {
              value: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'value'
              },
              setName: {
                type: Scratch.ArgumentType.STRING,
                menu: 'setMenu'
              }
            },
            blockIconURI: getBlockIcon(),
            hideFromPalette: false
          },
          {
            opcode: 'allKeysOrValues',
            blockType: Scratch.BlockType.REPORTER,
            text: 'all [keysOrValues] of set [setName]',
            arguments: {
              keysOrValues: {
                type: Scratch.ArgumentType.STRING,
                menu: 'keysValuesMenu'
              },
              setName: {
                type: Scratch.ArgumentType.STRING,
                menu: 'setMenu'
              }
            }
          },
          {
            opcode: 'getAtIndex',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get [data] at index [index] of set [setName]',
            arguments: {
              data: {
                type: Scratch.ArgumentType.STRING,
                menu: 'keyValueMenu'
              },
              index: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              setName: {
                type: Scratch.ArgumentType.STRING,
                menu: 'setMenu'
              }
            }
          },
          {
            opcode: 'getSize',
            blockType: Scratch.BlockType.REPORTER,
            text: 'size of set [setName]',
            arguments: {
              dimensionType: {
                type: Scratch.ArgumentType.STRING,
                menu: 'dimensionType'
              },
              setName: {
                type: Scratch.ArgumentType.STRING,
                menu: 'setMenu'
              }
            },
            blockIconURI: getBlockIcon(),
            disableMonitor: true,
            hideFromPalette: false
          },
          {
            opcode: 'scratchSerialize',
            blockType: Scratch.BlockType.REPORTER,
            text: 'set [setName] as [valueType]',
            arguments: {
              setName: {
                type: Scratch.ArgumentType.STRING,
                menu: 'setMenu'
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
            text: 'for each [key] [value] in set [setName]',
            arguments: {
              key: {
                type: Scratch.ArgumentType.STRING,
                fillIn: 'iterationKey'
              },
              value: {
                type: Scratch.ArgumentType.STRING,
                fillIn: 'iterationValue'
              },
              setName: {
                type: Scratch.ArgumentType.STRING,
                menu: 'setMenu'
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
              <block type="epSets_iterate">
                <value name="key"><shadow type="epSets_iterationKey"></shadow></value>
                <value name="value"><shadow type="epSets_iterationValue"></shadow></value>
                <value name="setName"><shadow type="epSets_menu_setMenu"></shadow></value>
              </block>`
          },
          { blockType: Scratch.BlockType.LABEL, text: 'Utilities' },
          {
            blockType: Scratch.BlockType.XML,
            xml: `<label text="This one is for set-related custom"/><sep gap="-12"/><sep gap="12"/>
            <sep gap="-10"/><label text="blocks so you can use a menu instead"/><sep gap="-12"/><sep gap="12"/>
            <sep gap="-10"/><label text="of manually typing a name every time."/><sep gap="-12"/><sep gap="12"/>`
          },
          {
            opcode: 'getDictionaryName',
            blockType: Scratch.BlockType.REPORTER,
            text: 'set [setName]',
            arguments: {
              setName: {
                type: Scratch.ArgumentType.STRING,
                menu: 'setMenu'
              }
            },
            disableMonitor: true,
            hideFromPalette: false
          }
        ],
        menus: {
          setMenu: {
            acceptReporters: true,
            items: 'getSetMenu'
          }
        }
      };
    }
    DISCLAIMER() {
      alert('DISCLAIMER: This extension only actively supports TurboWarp and PenguinMod. If any bugs occur in other Scratch mods, that is fully expected. However, if a bug occurs in TurboWarp or PenguinMod, it should be reported.')
    }
    getSetMenu() {
      return Object.keys(sets).length === 0? [''] : Object.keys(sets)
    }
    async newDictionary() {
      let defaultDictionaryName;
      repeat (Infinity, (i, escape) => {
        defaultDictionaryName = `my set ${i}`;
        if (!Object.keys(sets).includes(defaultDictionaryName)) escape();
      });
      let setName = await prompt('What should the set be called?', defaultDictionaryName);
      if (setName === null) return;
      setName = setName
        .replace(/\[/g, '［')
        .replace(/\]/g, '］');
      if (setName.length === 0) {
        alert('Set name cannot be empty.');
      } else if (setName in sets) {
        alert('This set name is in use.');
      } else if (setName.length > 30) {
        alert('Set name too long.');
      } else {
        sets[setName] = new Dictionary();
      }
      vm.extensionManager.refreshBlocks();
      updateProjectStorage();
    }
    async deleteDictionary() {
      const toDelete = await prompt('What is the name of the set that should be deleted?');
      if (toDelete === null) return;
      if (toDelete in sets) {
        if (confirm(`Are you sure you want to delete set ${JSON.stringify(toDelete)}?`)) {
          delete sets[toDelete];
        }
      } else {
        alert(`Dictionary ${JSON.stringify(toDelete)} not found`)
      }
      vm.extensionManager.refreshBlocks();
      updateProjectStorage();
    }
    deleteAll(args) {
      if (args.setName in sets) {
        sets[args.setName].clear();
      } else {
        console.error('Sets: Set not found');
      }
      updateProjectStorage();
    }
    setValue(args) {
      if (args.setName in sets) {
        sets[args.setName].set(args.key, args.value);
      } else {
        console.error('Sets: Set not found');
      }
      updateProjectStorage();
    }
    getValue(args) {
      if (args.setName in sets) {
        return sets[args.setName].get(args.key);
      } else {
        console.error('Sets: Set not found');
        return '';
      }
    }
    hasKey(args) {
      if (args.setName in sets) {
        return sets[args.setName].has(args.key);
      } else {
        console.error('Sets: Set not found');
        return false;
      }
    }
    deleteKey(args) {
      if (args.setName in sets) {
        sets[args.setName].delete(args.key);
      } else {
        console.error('Sets: Set not found');
      }
      updateProjectStorage();
    }
    keysOf(args) {
      if (args.setName in sets) {
        return JSON.stringify(sets[args.setName].keysOf(args.value));
      } else {
        console.error('Sets: Set not found');
        return '[]';
      }
    }
    allKeysOrValues(args) {
      if (args.setName in sets) {
        return JSON.stringify(Array.from(
          (sets[args.setName][args.keysOrValues])()
        ));
      } else {
        console.error('Sets: Set not found');
        return '[]';
      }
    }
    getAtIndex(args) {
      if (args.setName in sets) {
        return sets[args.setName].at(args.index - 1)?.[args.data] || '';
      } else {
        console.error('Sets: Set not found');
        return '';
      }
    }
    getSize(args) {
      if (args.setName in sets) {
        return sets[args.setName].size;
      } else {
        console.error('Sets: Set not found');
        return 0;
      }
    }
    scratchSerialize(args) {
      if (args.setName in sets) {
        switch (args.valueType) {
          case 'set':
            return sets[args.setName].serialize();
          case 'object':
            return sets[args.setName].serializeObj();
          case 'array':
            return sets[args.setName].serializeArr();
        }
      } else {
        console.error('Sets: Set not found');
        return args.valueType === 'set' ? '<>' : (args.valueType === 'object' ? '{}' : '[]');
      }
    }
    getDictionaryName(args) {
      if (args.setName in sets) {
        return args.setName;
      } else {
        console.error('Sets: Set not found');
        return '';
      }
    }
    iterate(args, util) {
      if (!(args.setName in sets)) {
        console.error('Sets: Set not found');
        return false;
      }
      const set = sets[args.setName];
      const itemCount = set.size;
      if (util.stackFrame.loopCounter === undefined) {
        util.stackFrame.loopCounter = itemCount;
      }

      util.thread.epSetsIterationData = set.at(itemCount - util.stackFrame.loopCounter);
      util.stackFrame.loopCounter--;
      if (util.stackFrame.loopCounter >= 0) {
        util.startBranch(1, true);
      } else {
        delete util.thread.epSetsIterationData;
      }
    }
    iterationKey(args, util) {
      return util.thread.epSetsIterationData?.key || '';
    }
    iterationValue(args, util) {
      return util.thread.epSetsIterationData?.value || '';
    }
  }
  if (isPM) {
    epSets.prototype.serialize = () => {
      return { epSets: serializeState() }
    }
    epSets.prototype.deserialize = (data) => {
      if (data.epSets !== undefined) {
        deserializeState(data.epSets);
      }
    }
  }
  Scratch.extensions.register(new epSets());
})(Scratch);