(async function (Scratch) {
  'use strict';
  if (!Scratch.extensions.unsandboxed) {
    function xmlSafe(str) { return str.replace(/[\u0000-\u001F]/g, '�').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;') } function validId(str) { return str.replaceAll(/[^a-zA-Z0-9]/g, '') } class ErroredExtension { constructor(name) { this.name = name } getInfo() { return { id: `ERR${validId(this.name)}`, name: 'ERR', blocks: [{ blockType: Scratch.BlockType.XML, xml: `<label text="The ${xmlSafe(this.name)} extension"/><sep gap="-12"/><sep gap="12"/><sep gap="-10"/><label text="must run unsandboxed."/><sep gap="-12"/><sep gap="12"/>` },] } } }
    return Scratch.extensions.register(new ErroredExtension('Test Ext'));
  }

  const { BlockType, ArgumentType, vm } = Scratch, runtime = vm.runtime;
  const ScratchBlocks = window.ScratchBlocks || await Scratch.gui.getBlockly();

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

  // This should NEVER be called without ScratchBlocks existing
  function _fixColours(col1) {
    const LDA = -10;
    const self = this.sourceBlock_;
    const parent = self?.parentBlock_;
    if (!parent) return;
    const path = self?.svgPath_;
    console.log(this, self, parent, path)
    const argumentSvg = path?.parentNode;
    const textNode = argumentSvg.querySelector('g.blocklyEditableText text');
    const oldFirstColour = parent.colour_;
    self.colour_ = (col1 ?? _LDC(parent.colour_, LDA));
    self.colourSecondary_ = _LDC(parent.colourSecondary_, LDA);
    self.colourTertiary_ = _LDC(parent.colourTertiary_, LDA);
    self.colourQuaternary_ = _LDC(parent?.colourQuaternary_ ?? oldFirstColour, LDA);
    _setCssNattr(path, 'fill', self.colour_);
    _setCssNattr(path, 'stroke', 'none');
    self.svgGroup_.style.pointerEvents = 'none';
    self.svgGroup_.style.removeProperty('cursor');
    if (textNode) _setCssNattr(textNode, 'fill', '#FFFFFF');
  }

  ArgumentType.DUMMYLABEL = 'DummyLabel';
  
  class FieldDummyLabel extends ScratchBlocks.FieldTextInput {
    constructor(opt_value) {
      opt_value = ArgumentType.DUMMYLABEL;
      super(opt_value);
      this.addArgType('String');
      this.addArgType(ArgumentType.DUMMYLABEL);
      console.log(this)
    }
    init(...initArgs) {
      ScratchBlocks.FieldTextInput.prototype.init.call(this, ...initArgs);
      this.textNode__ = this.sourceBlock_.svgPath_.parentNode.querySelector('g.blocklyEditableText text');
      console.log(this)
      if (this.textNode__ && this.sourceBlock_.parentBlock_) _fixColours.call(this, this.sourceBlock_.parentBlock_.colour_);
    }
    showEditor_() {}
  }  

  const customFieldTypes = {
    [ArgumentType.DUMMYLABEL]: {
      output: ArgumentType.STRING,
      outputShape: 2,
      implementation: {
        fromJson: () => new FieldDummyLabel()
      }
    }
  }

  vm.addListener('EXTENSION_FIELD_ADDED', (fieldInfo) => {
    ScratchBlocks.Field.register(fieldInfo.name, fieldInfo.implementation);
  });

  const eventsOriginallyEnabled = ScratchBlocks.Events.isEnabled(), workspace = ScratchBlocks.getMainWorkspace();
  ScratchBlocks.Events.disable();
  if (workspace) {
    if (vm.editingTarget) vm.emitWorkspaceUpdate();
    const flyout = workspace.getFlyout();
    if (flyout) {
      const flyoutWorkspace = flyout.getWorkspace();
      ScratchBlocks.Xml.clearWorkspaceAndLoadFromXml(
        ScratchBlocks.Xml.workspaceToDom(flyoutWorkspace),
        flyoutWorkspace
      );
      workspace.getToolbox().refreshSelection();
      workspace.toolboxRefreshEnabled_ = true;
    }
  }
  if (eventsOriginallyEnabled) ScratchBlocks.Events.enable();

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
            blockType: Scratch.BlockType.BOOLEAN,
            text: '[TEXT]',
            arguments: {
              TEXT: {
                type: ArgumentType.DUMMYLABEL,
                defaultValue: 'hello world',
              },
            },
            allowDropAnywhere: true,
            outputShape: 2
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