/**!
 * More Fields
 * @author 0znzw https://scratch.mit.edu/users/0znzw/
 * @version 1.4
 * @copyright MIT & LGPLv3 License
 * Do not remove this comment
 */
(async function (Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    function xmlSafe(str) { return str.replace(/[\u0000-\u001F]/g, '�').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;') } function validId(str) { return str.replaceAll(/[^a-zA-Z0-9]/g, '') } class ErroredExtension { constructor(name) { this.name = name } getInfo() { return { id: `ERR${validId(this.name)}`, name: 'ERR', blocks: [{ blockType: Scratch.BlockType.XML, xml: `<label text="The ${xmlSafe(this.name)} extension"/><sep gap="-12"/><sep gap="12"/><sep gap="-10"/><label text="must run unsandboxed."/><sep gap="-12"/><sep gap="12"/>` },] } } }
    return Scratch.extensions.register(new ErroredExtension('Test Ext'));
  }
  const { BlockType, ArgumentType, vm } = Scratch, runtime = vm.runtime;

  const customFieldTypes = {};
  let Blockly = null; // Blockly is used cause Its easier than ScratchBlocks imo, it does not make a difference.

  // https://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
  const _LDC = function _LightenDarkenColor(col, amt) {
    const num = parseInt(col.replace('#', ''), 16);
    const r = (num >> 16) + amt;
    const b = ((num >> 8) & 0x00FF) + amt;
    const g = (num & 0x0000FF) + amt;
    const newColour = g | (b << 8) | (r << 16);
    return (col.at(0) === '#' ? '#' : '') + newColour.toString(16);
  };

  // Me being lazy
  function _setCssNattr(node, attr, value) {
    node.setAttribute(attr, String(value));
    node.style[attr] = value;
  }

  // These should NEVER be called without ScratchBlocks existing
  function _fixColours(doText, col1, textColour) {
    const LDA = -10;
    const self = this.sourceBlock_;
    const parent = self?.parentBlock_;
    if (!parent) return;
    const path = self?.svgPath_;
    const argumentSvg = path?.parentNode;
    const textNode = argumentSvg.querySelector('g.blocklyEditableText text');
    const oldFirstColour = parent.colour_;
    self.colour_ = (col1 ?? _LDC(parent.colour_, LDA));
    self.colourSecondary_ = _LDC(parent.colourSecondary_, LDA);
    self.colourTertiary_ = _LDC(parent.colourTertiary_, LDA);
    self.colourQuaternary_ = _LDC(parent?.colourQuaternary_ ?? oldFirstColour, LDA);
    _setCssNattr(path, 'fill', self.colour_);
    _setCssNattr(path, 'stroke', self.colourTertiary_);
    if (doText && textNode) _setCssNattr(textNode, 'fill', textColour ?? '#FFFFFF');
  }

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

    // Temporary fix for the annoying error:
    // '<text> attribute x: Expected length, "NaN".'
    const _setAttribute = SVGTextElement.prototype.setAttribute;
    SVGTextElement.prototype.setAttribute = function(attr, val, ...args) {
      if (String(val) === 'NaN' && (attr === 'x' || attr === 'y') && this.getAttribute('class') === 'blocklyText') {
        const nattr = `MoreFieldsAttrErr${attr.toUpperCase()}`;
        _setAttribute.call(this, nattr, `Attempted an illegal set on this text node. ${attr.toUpperCase()} was set to NaN.`);
        return _setAttribute.call(this, attr, '0', ...args);
      }
      return _setAttribute.call(this, attr, val, ...args);
    };

    implementations.FieldDummyLabel = class FieldDummyLabel extends Blockly.FieldTextInput {
      constructor(opt_value) {
        opt_value = ArgumentType.DUMMYLABEL;
        super(opt_value);
        this.addArgType('String');
        this.addArgType(ArgumentType.DUMMYLABEL);
      }
      init(...initArgs) {
        Blockly.FieldTextInput.prototype.init.call(this, ...initArgs);
        this.textNode__ = this.sourceBlock_.svgPath_.parentNode.querySelector('g.blocklyEditableText text');
        if (!!this.textNode__ && this.sourceBlock_.parentBlock_) _fixColours.call(this, true, this.sourceBlock_.parentBlock_.colour_, this.sourceBlock_.parentBlock_.colour_);
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

  // Passes "Blockly" to tryUseScratchBlocks if Scratch.gui is a object.
  if (typeof Scratch?.gui === 'object') Scratch.gui.getBlockly().then((Blockly) => tryUseScratchBlocks(Blockly));

  // Actual "extension" part
  class epTesting {
    static get customFieldTypes() {
      return customFieldTypes;
    }
    getInfo() {
      const getInfo = ({
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
        customFieldTypes,
      });
      return getInfo;
    }
    dummyLabel(args) {
      return args.TEXT;
    }
  }
  Scratch.extensions.register(new epTesting());
})(Scratch);