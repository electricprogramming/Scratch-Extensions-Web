(async function (Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    function xmlSafe(str) { return str.replace(/[\u0000-\u001F]/g, '�').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;') } function validId(str) { return str.replaceAll(/[^a-zA-Z0-9]/g, '') } class ErroredExtension { constructor(name) { this.name = name } getInfo() { return { id: `ERR${validId(this.name)}`, name: 'ERR', blocks: [{ blockType: Scratch.BlockType.XML, xml: `<label text="The ${xmlSafe(this.name)} extension"/><sep gap="-12"/><sep gap="12"/><sep gap="-10"/><label text="must run unsandboxed."/><sep gap="-12"/><sep gap="12"/>` },] } } }
    return Scratch.extensions.register(new ErroredExtension('Test Ext'));
  }
  const { BlockType, ArgumentType, vm } = Scratch, runtime = vm.runtime;

  const customFieldTypes = {};
  let Blockly = null; // Blockly is used cause Its easier than ScratchBlocks imo, it does not make a difference.

  const toRegisterOnBlocklyGot = [];

  // https://github.com/LLK/scratch-vm/blob/f405e59d01a8f9c0e3e986fb5276667a8a3c7d40/test/unit/extension_conversion.js#L85-L124
  // https://github.com/LLK/scratch-vm/commit/ceaa3c7857b79459ccd1b14d548528e4511209e7
  vm.addListener('EXTENSION_FIELD_ADDED', (fieldInfo) => {
    if (Blockly) Blockly.Field.register(fieldInfo.name, fieldInfo.implementation);
    else toRegisterOnBlocklyGot.push([fieldInfo.name, fieldInfo.implementation]);
  });

  ArgumentType.DUMMYLABEL = 'DummyLabel';

  let implementations = {
    FieldDummyLabel: null
  };
  customFieldTypes[ArgumentType.DUMMYLABEL] = {
    output: ArgumentType.STRING,
    outputShape: 2,
    implementation: {
      fromJson: () => new implementations.FieldDummyLabel()
    }
  };
  // Main try thing
  function tryUseScratchBlocks(_sb) {
    Blockly = _sb;

    implementations.FieldDummyLabel = class FieldDummyLabel extends Blockly.FieldTextInput {
      constructor(opt_value) {
        opt_value = ArgumentType.DUMMYLABEL;
        super(opt_value);
        this.addArgType('String');
        this.addArgType(ArgumentType.DUMMYLABEL);
      }
      init(...initArgs) {
        Blockly.FieldLabel.prototype.init.call(this, ...initArgs);
      }
      showEditor_() {}
    }

    while (toRegisterOnBlocklyGot.length > 0) {
      const [name, impl] = toRegisterOnBlocklyGot.shift();
      Blockly.Field.register(name, impl);
    }

    // Attempt to reload the workspace and what not.
    // https://github.com/TurboWarp/addons/blob/tw/addons/custom-block-shape/update-all-blocks.js
    const eventsOriginallyEnabled = Blockly.Events.isEnabled(), workspace = Blockly.getMainWorkspace();
    Blockly.Events.disable();
    if (workspace) {
      if (vm.editingTarget) vm.emitWorkspaceUpdate();
      const flyout = workspace.getFlyout();
      if (flyout) {
        const flyoutWorkspace = flyout.getWorkspace();
        Blockly.Xml.clearWorkspaceAndLoadFromXml(
          Blockly.Xml.workspaceToDom(flyoutWorkspace),
          flyoutWorkspace
        );
        workspace.getToolbox().refreshSelection();
        workspace.toolboxRefreshEnabled_ = true;
      }
    }
    if (eventsOriginallyEnabled) Blockly.Events.enable();
  }

  Scratch.gui.getBlockly().then((Blockly) => tryUseScratchBlocks(Blockly));

  class epTesting {
    static get customFieldTypes() {
      return customFieldTypes;
    }
    getInfo() {
      return {
        id: 'epTesting',
        name: 'Test Ext',
        blocks: [
          {
            opcode: 'dummyLabel',
            blockType: BlockType.REPORTER,
            text: '"secret" [TEXT]',
            arguments: {
              TEXT: {
                type: ArgumentType.DUMMYLABEL,
                defaultValue: 'oo a secret ;)',
              },
            },
            allowDropAnywhere: true,
            blockShape: 2,
          }
        ],
        customFieldTypes
      }
    }
    dummyLabel(args) {
      return args.TEXT;
    }
  }
  Scratch.extensions.register(new epTesting());
})(Scratch);