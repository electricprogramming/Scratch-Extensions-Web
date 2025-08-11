// Name: Sets
// ID: epSets
// Description: Create and manage sets, which are similar to arrays, but only allow one copy of each item. Creating, deleting, and accessing sets works in a similar way to Scratch's defaut variables category. Covers adding and deleting item, iteration, etc.
// By: electricprogramming
// License: LGPL-3.0
(function (Scratch) {
  "use strict";
  if(!Scratch.extensions.unsandboxed) {
    function xmlSafe(str) { return str.replace(/[\u0000-\u001F]/g, '�').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;') } function validId(str) { return str.replaceAll(/[^a-zA-Z0-9]/g, '') } class ErroredExtension { constructor(name) { this.name = name } getInfo() { return { id: `ERR${validId(this.name)}`, name: 'ERR', blocks: [{ blockType: Scratch.BlockType.XML, xml: `<label text="The ${xmlSafe(this.name)} extension"/><sep gap="-12"/><sep gap="12"/><sep gap="-10"/><label text="must run unsandboxed."/><sep gap="-12"/><sep gap="12"/>` },] } } }
    return Scratch.extensions.register(new ErroredExtension('Sets'));
  }
  const [isTW, isPM] = [!Scratch.extensions.isPenguinMod, Scratch.extensions.isPenguinMod];
  const vm = Scratch.vm;
  function getIcon() {
    return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiB3aWR0aD0iNTAiIGhlaWdodD0iNTAiPgogIDxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjQ1IiBmaWxsPSIjNkUzRTZFIiAvPgogIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsIC02KSI+CiAgICA8dGV4dCB4PSIxOCIgeT0iNTUuNSIgZmlsbD0iI2ZmZiIgZm9udC1zaXplPSI1MCIgZm9udC1mYW1pbHk9IlNlZ29lIFVJIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNSw1MCkgc2NhbGUoMSwgMS4yKSB0cmFuc2xhdGUoLTE1LC01MCkiPns8L3RleHQ+CiAgICA8dGV4dCB4PSI4MiIgeT0iNTUuNSIgZmlsbD0iI2ZmZiIgZm9udC1zaXplPSI1MCIgZm9udC1mYW1pbHk9IlNlZ29lIFVJIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNSw1MCkgc2NhbGUoMSwgMS4yKSB0cmFuc2xhdGUoLTE1LC01MCkiPn08L3RleHQ+CiAgICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLCAxKSI+CiAgICAgIDxyZWN0IHg9IjI2IiB5PSI0MCIgd2lkdGg9IjEyLjUiIGhlaWdodD0iMTIuNSIgcng9IjIiIGZpbGw9IiNGODcxNzEiLz4KICAgICAgPHJlY3QgeD0iNDEuNSIgeT0iNDAiIHdpZHRoPSIxMi41IiBoZWlnaHQ9IjEyLjUiIHJ4PSIyIiBmaWxsPSIjNjBBNUZBIi8+CiAgICAgIDxyZWN0IHg9IjU3IiB5PSI0MCIgd2lkdGg9IjEyLjUiIGhlaWdodD0iMTIuNSIgcng9IjIiIGZpbGw9IiMzNEQzOTkiLz4KICAgIDwvZz4KICAgIDxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAsIC0xKSI+CiAgICAgIDxyZWN0IHg9IjMyIiB5PSI1OCIgd2lkdGg9IjEyLjUiIGhlaWdodD0iMTIuNSIgcng9IjIiIGZpbGw9IiNGQkJGMjQiLz4KICAgICAgPHJlY3QgeD0iNDcuNSIgeT0iNTgiIHdpZHRoPSIxMi41IiBoZWlnaHQ9IjEyLjUiIHJ4PSIyIiBmaWxsPSIjQTc4QkZBIi8+CiAgICAgIDxyZWN0IHg9IjYzIiB5PSI1OCIgd2lkdGg9IjEyLjUiIGhlaWdodD0iMTIuNSIgcng9IjIiIGZpbGw9IiNGRkE1NjQiLz4KICAgIDwvZz4KICA8L2c+Cjwvc3ZnPgo='
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
      return Array.from(this)[index];
    }

    static isSubset(set1, set2) {
      for (let item of set1) {
        if (!set2.has(item)) {
          return false;
        }
      }
      return true;
    }

    static isEqual(set1, set2) {
      return set1.size === set2.size && this.isSubset(set1, set2);
    }

    static union(set1, set2) {
      return new Set([...set1, ...set2]);
    }

    static intersection(set1, set2) {
      return new Set([...set1].filter(item => set2.has(item)));
    }

    static difference(set1, set2) {
      return new Set([...set1].filter(item => !set2.has(item)));
    }

    static symmetricDifference(set1, set2) {
      return new Set([
        ...[...set1].filter(item => !set2.has(item)),
        ...[...set2].filter(item => !set1.has(item)),
      ]);
    }
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
      result[key] = JSON.stringify([...sets[key]]);
    })
    return result;
  }
  function updateProjectStorage() {
    customStorage.set(serializeState());
  }
  function deserializeState(state) {
    console.log('Sets: Loading serialized project data')
    sets = {};
    Object.entries(state).forEach(([key, value]) => {
      sets[key] = new Set(JSON.parse(value));
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
        name: 'Sets',        
        color1: "#8A4B8A",
        color2: "#6E3E6E",
        color3: "#6E3E6E",
        menuIconURI: getIcon(),
        docsURI: 'https://electricprogramming-scratch-exts.vercel.app/src/docs/sets.html',
        blocks: [
          {
            func: 'DISCLAIMER',
            blockType: Scratch.BlockType.BUTTON,
            text: 'DISCLAIMER',
            hideFromPalette: false
          },
          { blockType: Scratch.BlockType.LABEL, text: 'Set Management' },
          {
            func: 'newSet',
            blockType: Scratch.BlockType.BUTTON,
            text: 'Make a Set',
            hideFromPalette: false
          },
          {
            func: 'renameSet',
            blockType: Scratch.BlockType.BUTTON,
            text: 'Rename a Set',
            get hideFromPalette() {
              return Object.keys(sets).length === 0
            }
          },
          {
            func: 'deleteSet',
            blockType: Scratch.BlockType.BUTTON,
            text: 'Delete a Set',
            get hideFromPalette() {
              return Object.keys(sets).length === 0
            }
          },
          { blockType: Scratch.BlockType.LABEL, text: 'List of sets:' },
          {
            blockType: Scratch.BlockType.XML,
            get xml() {
              let xml = `<sep gap="-12"/><sep gap="12"/><sep gap="-10"/>`;
              Object.keys(sets).forEach((setName) => {
                xml += `<label text="• ${xmlSafe(setName)}"/><sep gap="-12"/><sep gap="12"/><sep gap="-10"/>`;
              });
              return xml;
            }
          },
          '---',
          { blockType: Scratch.BlockType.LABEL, text: 'Data Management' },
          {
            opcode: 'addItem',
            blockType: Scratch.BlockType.COMMAND,
            text: 'add item [item] to set [setName]',
            arguments: {
              item: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'item'
              },
              setName: {
                type: Scratch.ArgumentType.STRING,
                menu: 'setMenu'
              }
            },
            blockIconURI: getIcon(),
            hideFromPalette: false
          },
          {
            opcode: 'hasItem',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'set [setName] has item [item]?',
            arguments: {
              item: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'item'
              },
              setName: {
                type: Scratch.ArgumentType.STRING,
                menu: 'setMenu'
              }
            },
            blockIconURI: getIcon(),
            hideFromPalette: false
          },
          {
            opcode: 'deleteItem',
            blockType: Scratch.BlockType.COMMAND,
            text: 'delete item [item] from set [setName]',
            arguments: {
              item: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'item'
              },
              setName: {
                type: Scratch.ArgumentType.STRING,
                menu: 'setMenu'
              }
            },
            blockIconURI: getIcon(),
            hideFromPalette: false
          },
          {
            opcode: 'deleteAll',
            blockType: Scratch.BlockType.COMMAND,
            text: 'delete all items from set [setName]',
            arguments: {
              setName: {
                type: Scratch.ArgumentType.STRING,
                menu: 'setMenu'
              }
            },
            blockIconURI: getIcon(),
            hideFromPalette: false
          },
          {
            opcode: 'getAll',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get all items of set [setName]',
            arguments: {
              setName: {
                type: Scratch.ArgumentType.STRING,
                menu: 'setMenu'
              }
            },
            blockIconURI: getIcon(),
            hideFromPalette: false
          },
          {
            opcode: 'isEqual',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'is [set1] equal to [set2]?',
            arguments: {
              set1: {
                type: Scratch.ArgumentType.STRING,
                menu: 'setMenu',
                get defaultValue() {
                  return Object.keys(sets)[0];
                }
              },
              set2: {
                type: Scratch.ArgumentType.STRING,
                menu: 'setMenu',
                get defaultValue() {
                  return Object.keys(sets)[1];
                }
              }
            },
            blockIconURI: getIcon(),
            get hideFromPalette() {
              return Object.keys(sets).length < 2
            }
          },
          {
            opcode: 'getSize',
            blockType: Scratch.BlockType.REPORTER,
            text: 'size of set [setName]',
            arguments: {
              setName: {
                type: Scratch.ArgumentType.STRING,
                menu: 'setMenu'
              }
            },
            blockIconURI: getIcon(),
            disableMonitor: true,
            hideFromPalette: false
          },
          { blockType: Scratch.BlockType.XML, xml: `<sep gap="24"></sep>` },
          { blockType: Scratch.BlockType.LABEL, text: 'Iteration' },
          {
            opcode: 'iterate',
            blockType: Scratch.BlockType.LOOP,
            text: 'for each [item] in set [setName]',
            arguments: {
              item: {
                type: Scratch.ArgumentType.STRING,
                fillIn: 'iterationItem'
              },
              setName: {
                type: Scratch.ArgumentType.STRING,
                menu: 'setMenu'
              }
            },
            blockIconURI: getIcon(),
            hideFromPalette: true
          },
          {
            opcode: 'iterationItem',
            blockType: Scratch.BlockType.REPORTER,
            outputShape: 3,
            text: 'item',
            canDragDuplicate: true,
            disableMonitor: true,
            hideFromPalette: true
          },
          {
            // Iteration
            blockType: Scratch.BlockType.XML,
            xml: `
              <block type="epSets_iterate">
                <value name="item"><shadow type="epSets_iterationItem"></shadow></value>
                <value name="setName"><shadow type="epSets_menu_setMenu"></shadow></value>
              </block>`
          },
          { blockType: Scratch.BlockType.XML, xml: `<sep gap="24"></sep>` },
          {
            blockType: Scratch.BlockType.LABEL,
            text: 'Advanced',
            get hideFromPalette() {
              return Object.keys(sets).length < 2
            }
          },
          {
            opcode: 'isSubset',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'is [set1] subset of [set2]?',
            arguments: {
              set1: {
                type: Scratch.ArgumentType.STRING,
                menu: 'setMenu',
                get defaultValue() {
                  return Object.keys(sets)[0];
                }
              },
              set2: {
                type: Scratch.ArgumentType.STRING,
                menu: 'setMenu',
                get defaultValue() {
                  return Object.keys(sets)[1];
                }
              }
            },
            blockIconURI: getIcon(),
            get hideFromPalette() {
              return Object.keys(sets).length < 2
            }
          },
          {
            opcode: 'union',
            blockType: Scratch.BlockType.COMMAND,
            text: 'get union of [set1] and [set2] and store in [export]',
            arguments: {
              set1: {
                type: Scratch.ArgumentType.STRING,
                menu: 'setMenu',
                get defaultValue() {
                  return Object.keys(sets)[0];
                }
              },
              set2: {
                type: Scratch.ArgumentType.STRING,
                menu: 'setMenu',
                get defaultValue() {
                  return Object.keys(sets)[1];
                }
              },
              export: {
                type: Scratch.ArgumentType.STRING,
                menu: 'setMenu'
              }
            },
            blockIconURI: getIcon(),
            get hideFromPalette() {
              return Object.keys(sets).length < 2
            }
          },
          {
            opcode: 'intersection',
            blockType: Scratch.BlockType.COMMAND,
            text: 'get intersection of [set1] and [set2] and store in [export]',
            arguments: {
              set1: {
                type: Scratch.ArgumentType.STRING,
                menu: 'setMenu',
                get defaultValue() {
                  return Object.keys(sets)[0];
                }
              },
              set2: {
                type: Scratch.ArgumentType.STRING,
                menu: 'setMenu',
                get defaultValue() {
                  return Object.keys(sets)[1];
                }
              },
              export: {
                type: Scratch.ArgumentType.STRING,
                menu: 'setMenu'
              }
            },
            blockIconURI: getIcon(),
            get hideFromPalette() {
              return Object.keys(sets).length < 2
            }
          },
          {
            opcode: 'difference',
            blockType: Scratch.BlockType.COMMAND,
            text: 'get difference between [set1] and [set2] and store in [export]',
            arguments: {
              set1: {
                type: Scratch.ArgumentType.STRING,
                menu: 'setMenu',
                get defaultValue() {
                  return Object.keys(sets)[0];
                }
              },
              set2: {
                type: Scratch.ArgumentType.STRING,
                menu: 'setMenu',
                get defaultValue() {
                  return Object.keys(sets)[1];
                }
              },
              export: {
                type: Scratch.ArgumentType.STRING,
                menu: 'setMenu'
              }
            },
            blockIconURI: getIcon(),
            get hideFromPalette() {
              return Object.keys(sets).length < 2
            }
          },
          {
            opcode: 'symmetricDifference',
            blockType: Scratch.BlockType.COMMAND,
            text: 'get symmetric difference of [set1] and [set2] and store in [export]',
            arguments: {
              set1: {
                type: Scratch.ArgumentType.STRING,
                menu: 'setMenu',
                get defaultValue() {
                  return Object.keys(sets)[0];
                }
              },
              set2: {
                type: Scratch.ArgumentType.STRING,
                menu: 'setMenu',
                get defaultValue() {
                  return Object.keys(sets)[1];
                }
              },
              export: {
                type: Scratch.ArgumentType.STRING,
                menu: 'setMenu'
              }
            },
            blockIconURI: getIcon(),
            get hideFromPalette() {
              return Object.keys(sets).length < 2
            }
          },
          {
            blockType: Scratch.BlockType.XML,
            xml: `<sep gap="24"></sep>`,
            get hideFromPalette() {
              return Object.keys(sets).length < 2
            }
          },          
          { blockType: Scratch.BlockType.LABEL, text: 'Utilities' },
          {
            blockType: Scratch.BlockType.XML,
            xml: `<label text="This one is for set-related custom"/><sep gap="-12"/><sep gap="12"/>
            <sep gap="-10"/><label text="blocks so you can use a menu instead"/><sep gap="-12"/><sep gap="12"/>
            <sep gap="-10"/><label text="of manually typing a name every time."/><sep gap="-12"/><sep gap="12"/>`
          },
          {
            opcode: 'getSetName',
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
    async newSet() {
      let setName = await prompt('New Set', 'New set name:');
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
        sets[setName] = new Set();
      }
      vm.extensionManager.refreshBlocks();
      updateProjectStorage();
    }
    async renameSet() {
      const oldName = await promptSelect('Rename a Set', 'Select a set to rename:', Object.keys(sets));
      if (oldName in sets) {
        const newName = await prompt('Rename a Set', `New name for set "${oldName}":`);
        if (newName.length === 0) {
          alert('Set name cannot be empty.');
        } else if (newName in sets) {
          alert('This set name is in use.');
        } else if (newName.length > 30) {
          alert('Set name too long.');
        } else {
          sets = renameKey(sets, oldName, newName);
          vm.runtime.targets.forEach(target => {
            const blocks = target.blocks._blocks;
            console.log(Object.entries(blocks))
            for (const [blockId, block] of Object.entries(blocks)) {
              
              if (block.opcode === 'epSets_menu_setMenu') {
                if (block.fields.setMenu.value === oldName) {
                  block.fields.setMenu.value = newName
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
    async deleteSet() {
      const toDelete = await promptSelect('Delete a Set', 'Select a set to delete:', Object.keys(sets));
      if (toDelete in sets && confirm(`Are you sure you want to delete set ${JSON.stringify(toDelete)}?`)) {
        delete sets[toDelete];
        vm.extensionManager.refreshBlocks();
        updateProjectStorage();
      }
    }
    addItem(args) {
      if (args.setName in sets) {
        sets[args.setName].add(args.item);
      } else {
        console.error('Sets: Set not found');
      }
      updateProjectStorage();
    }
    hasItem(args) {
      return sets[args.setName]?.has(args.item);
    }
    getAll(args) {
      if (args.setName in sets) {
        return JSON.stringify(Array.from(sets[args.setName]));
      } else {
        console.error('Sets: Set not found');
      }
    }
    deleteAll(args) {
      if (args.setName in sets) {
        sets[args.setName].clear();
      } else {
        console.error('Sets: Set not found');
      }
      updateProjectStorage();
    }
    deleteItem(args) {
      if (args.setName in sets) {
        sets[args.setName].delete(args.item);
      } else {
        console.error('Sets: Set not found');
      }
      updateProjectStorage();
    }
    getSize(args) {
      if (args.setName in sets) {
        return sets[args.setName].size;
      } else {
        console.error('Sets: Set not found');
        return 0;
      }
    }
    getSetName(args) {
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
        util.stackFrame.loopCounter = 1;
      }

      util.thread.epSetsIterationItem = set.at(util.stackFrame.loopCounter - 1);
      if (util.stackFrame.loopCounter <= itemCount) {
        util.startBranch(1, true);
        util.stackFrame.loopCounter++;
      } else {
        delete util.thread.epSetsIterationItem;
        return false;
      }
    }
    iterationItem(args, util) {
      return util.thread.epSetsIterationItem || '';
    }
    isEqual(args) {
      if (args.set1 in sets && args.set2 in sets) {
        return Set.isEqual(sets[args.set1], sets[args.set2]);
      } else {
        console.error('Sets: One or more set(s) not found');
        return false;
      }
    }
    isSubset(args) {
      if (args.set1 in sets && args.set2 in sets) {
        return Set.isSubset(sets[args.set1], sets[args.set2]);
      } else {
        console.error('Sets: One or more set(s) not found');
        return false;
      }
    }
    union(args) {
      if (args.set1 in sets && args.set2 in sets && args.export in sets) {
        sets[args.export] = Set.union(sets[args.set1], sets[args.set2]);
      } else {
        console.error('Sets: One or more set(s) not found');
        return false;
      }
    }
    intersection(args) {
      if (args.set1 in sets && args.set2 in sets && args.export in sets) {
        sets[args.export] = Set.intersection(sets[args.set1], sets[args.set2]);
      } else {
        console.error('Sets: One or more set(s) not found');
        return false;
      }
    }
    difference(args) {
      if (args.set1 in sets && args.set2 in sets && args.export in sets) {
        sets[args.export] = Set.difference(sets[args.set1], sets[args.set2]);
      } else {
        console.error('Sets: One or more set(s) not found');
        return false;
      }
    }
    symmetricDifference(args) {
      if (args.set1 in sets && args.set2 in sets && args.export in sets) {
        sets[args.export] = Set.symmetricDifference(sets[args.set1], sets[args.set2]);
      } else {
        console.error('Sets: One or more set(s) not found');
        return false;
      }
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