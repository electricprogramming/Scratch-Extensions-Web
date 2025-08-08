(function(Scratch) {
  "use strict";

  class QueueExt {
    constructor() {
      this.queues = {};
    }

    getInfo() {
      return {
        id: 'epQueues',
        name: 'Queues',
        color1: '#1EBC61',
        color2: '#007C21',
        get menuIconURI() {
          return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgd2lkdGg9IjMwIiBoZWlnaHQ9IjMwIiBmaWxsPSJub25lIiBzdHJva2U9Im5vbmUiPgogIDxyZWN0IHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgZmlsbD0iIzAwMDAwMCIgcng9IjgiIHJ5PSI4Ii8+CiAgPHJlY3QgeD0iOCIgeT0iMTIiIHdpZHRoPSI0OCIgaGVpZ2h0PSI4IiByeD0iMyIgcnk9IjMiIGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0iIzJFQ0M3MSIgc3Ryb2tlLXdpZHRoPSIzIi8+CiAgPHJlY3QgeD0iOCIgeT0iMjgiIHdpZHRoPSI0OCIgaGVpZ2h0PSI4IiByeD0iMyIgcnk9IjMiIGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0iIzJFQ0M3MSIgc3Ryb2tlLXdpZHRoPSIzIi8+CiAgPHJlY3QgeD0iOCIgeT0iNDQiIHdpZHRoPSI0OCIgaGVpZ2h0PSI4IiByeD0iMyIgcnk9IjMiIGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0iIzJFQ0M3MSIgc3Ryb2tlLXdpZHRoPSIzIi8+Cjwvc3ZnPg==';
        },
        blocks: [
          {
            opcode: 'createQueue',
            blockType: Scratch.BlockType.COMMAND,
            text: 'create queue [name]',
            arguments: {
              name: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'myQueue'
              }
            }
          },
          {
            opcode: 'enqueue',
            blockType: Scratch.BlockType.COMMAND,
            text: 'add [item] to queue [name]',
            arguments: {
              item: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'item'
              },
              name: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'myQueue'
              }
            }
          },
          {
            opcode: 'dequeue',
            blockType: Scratch.BlockType.REPORTER,
            text: 'dequeue from queue [name]',
            arguments: {
              name: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'myQueue'
              }
            }
          },
          {
            opcode: 'peek',
            blockType: Scratch.BlockType.REPORTER,
            text: 'peek at first item of queue [name]',
            arguments: {
              name: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'myQueue'
              }
            }
          },
          {
            opcode: 'queueLength',
            blockType: Scratch.BlockType.REPORTER,
            text: 'length of queue [name]',
            arguments: {
              name: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'myQueue'
              }
            }
          },
          {
            opcode: 'clearQueue',
            blockType: Scratch.BlockType.COMMAND,
            text: 'clear queue [name]',
            arguments: {
              name: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'myQueue'
              }
            }
          }
        ]
      };
    }

    createQueue(args) {
      const name = args.name.trim();
      if (!name) return;
      this.queues[name] = [];
    }

    enqueue(args) {
      const name = args.name.trim();
      const item = args.item;
      if (!name) return;
      if (!this.queues[name]) this.queues[name] = [];
      this.queues[name].push(item);
    }

    dequeue(args) {
      const name = args.name.trim();
      if (!name || !this.queues[name] || this.queues[name].length === 0) return '';
      return this.queues[name].shift();
    }

    peek(args) {
      const name = args.name.trim();
      if (!name || !this.queues[name] || this.queues[name].length === 0) return '';
      return this.queues[name][0];
    }

    queueLength(args) {
      const name = args.name.trim();
      if (!name || !this.queues[name]) return 0;
      return this.queues[name].length;
    }

    clearQueue(args) {
      const name = args.name.trim();
      if (!name) return;
      this.queues[name] = [];
    }
  }

  Scratch.extensions.register(new QueueExt());
})(Scratch);