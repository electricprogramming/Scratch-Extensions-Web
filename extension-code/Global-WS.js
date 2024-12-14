// Modified from https://extensions.turbowarp.org/godslayerakp/ws.js
// Original code available under the MIT license
// this version has the same blocks, but connections are universal, not by sprite.
// this helps with something like an online multiplayer game, where cloud clones need to be reading data from the same connection as the main player is sending data, or something like that.
// the block color and extension id are also changed to be distinguishable from original.
(function (Scratch) {
  "use strict";

  if (!Scratch.extensions.unsandboxed) {
    throw new Error("can not load outside unsandboxed mode");
  }

  const blobToDataURL = (blob) =>
    new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(fr.result);
      fr.onerror = () =>
        reject(new Error(`Failed to read as data URL: ${fr.error}`));
      fr.readAsDataURL(blob);
    });

  const { BlockType, Cast, ArgumentType } = Scratch;
  const vm = Scratch.vm;
  const runtime = vm.runtime;

  const toCloseCode = (exitCode) => {
    const casted = Cast.toNumber(exitCode);
    if (casted === 1000 || (casted >= 3000 && casted <= 4999)) {
      return casted;
    }
    return 1000;
  };

  const toCloseReason = (reason) => {
    const casted = Cast.toString(reason);
    const encoder = new TextEncoder();
    let encoded = encoder.encode(casted);
    encoded = encoded.slice(0, 123);
    const decoder = new TextDecoder();
    while (encoded.byteLength > 0) {
      try {
        const decoded = decoder.decode(encoded);
        return decoded;
      } catch (e) {
        encoded = encoded.slice(0, encoded.byteLength - 1);
      }
    }
    return "";
  };

  class WebSocketExtension {
    constructor() {
      this.instance = {
        destroyed: false,
        errored: false,
        closeMessage: "",
        closeCode: 0,
        data: "",
        websocket: null,
        messageThreadsRunning: false,
        connectThreads: [],
        messageThreads: [],
        messageQueue: [],
        sendOnceConnected: [],
      };

      runtime.on("targetWasRemoved", (target) => {
        // Handle target removal if needed
      });
    }

    getInfo() {
      return {
        id: "epGlobalWebsocket",
        name: "WebSocket",
        color1: "#228739",
        color2: "#22aa39",
        blocks: [
          {
            opcode: "connectToUrl",
            blockType: BlockType.COMMAND,
            arguments: {
              URL: {
                type: ArgumentType.STRING,
                defaultValue: "wss://echoserver.redman13.repl.co",
              },
            },
            text: "connect to [URL]",
          },
          "---",
          {
            opcode: "onOpen",
            blockType: BlockType.EVENT,
            isEdgeActivated: false,
            shouldRestartExistingThreads: true,
            text: "when connected",
          },
          {
            opcode: "isConnected",
            blockType: BlockType.BOOLEAN,
            text: "is connected?",
            disableMonitor: true,
          },
          "---",
          {
            opcode: "onMessage",
            blockType: BlockType.EVENT,
            isEdgeActivated: false,
            shouldRestartExistingThreads: true,
            text: "when message received",
          },
          {
            opcode: "messageData",
            blockType: BlockType.REPORTER,
            text: "received message data",
            disableMonitor: true,
          },
          "---",
          {
            opcode: "sendMessage",
            blockType: BlockType.COMMAND,
            arguments: {
              PAYLOAD: {
                type: ArgumentType.STRING,
                defaultValue: "Hello!",
              },
            },
            text: "send message [PAYLOAD]",
          },
          "---",
          {
            opcode: "onError",
            blockType: BlockType.EVENT,
            isEdgeActivated: false,
            shouldRestartExistingThreads: true,
            text: "when connection errors",
          },
          {
            opcode: "hasErrored",
            blockType: BlockType.BOOLEAN,
            text: "connection errored?",
            disableMonitor: true,
          },
          "---",
          {
            opcode: "onClose",
            blockType: BlockType.EVENT,
            isEdgeActivated: false,
            shouldRestartExistingThreads: true,
            text: "when connection closes",
          },
          {
            opcode: "isClosed",
            blockType: BlockType.BOOLEAN,
            text: "is connection closed?",
            disableMonitor: true,
          },
          {
            opcode: "closeCode",
            blockType: BlockType.REPORTER,
            text: "closing code",
            disableMonitor: true,
          },
          {
            opcode: "closeMessage",
            blockType: BlockType.REPORTER,
            text: "closing message",
            disableMonitor: true,
          },
          {
            opcode: "closeWithoutReason",
            blockType: BlockType.COMMAND,
            text: "close connection",
          },
          {
            opcode: "closeWithCode",
            blockType: BlockType.COMMAND,
            arguments: {
              CODE: {
                type: ArgumentType.NUMBER,
                defaultValue: "1000",
              },
            },
            text: "close connection with code [CODE]",
          },
          {
            opcode: "closeWithReason",
            blockType: BlockType.COMMAND,
            arguments: {
              CODE: {
                type: ArgumentType.NUMBER,
                defaultValue: "1000",
              },
              REASON: {
                type: ArgumentType.STRING,
                defaultValue: "fulfilled",
              },
            },
            text: "close connection with reason [REASON] and code [CODE]",
          },
        ],
      };
    }

    connectToUrl(args, util) {
      const url = Cast.toString(args.URL);

      if (!/^(ws|wss):/is.test(url)) {
        if (/^(?!(ws|http)s?:\/\/).*$/is.test(url)) {
          url = `wss://${url}`;
        } else if (/^(http|https):/is.test(url)) {
          const urlParts = url.split(":");
          urlParts[0] = url.toLowerCase().startsWith("https") ? "wss" : "ws";
          url = urlParts.join(":");
        } else {
          return;
        }
      }

      if (this.instance.websocket) {
        this.instance.destroyed = true;
        this.instance.websocket.close();
      }

      this.instance = {
        destroyed: false,
        errored: false,
        closeMessage: "",
        closeCode: 0,
        data: "",
        websocket: null,
        messageThreadsRunning: false,
        connectThreads: [],
        messageThreads: [],
        messageQueue: [],
        sendOnceConnected: [],
      };

      return Scratch.canFetch(url)
        .then(
          (allowed) =>
            new Promise((resolve) => {
              if (!allowed) {
                throw new Error("Not allowed");
              }

              if (this.instance.destroyed) {
                resolve();
                return;
              }

              const websocket = new WebSocket(url);
              this.instance.websocket = websocket;

              const beforeExecute = () => {
                if (this.instance.messageThreadsRunning) {
                  const stillRunning = this.instance.messageThreads.some((i) =>
                    runtime.isActiveThread(i)
                  );
                  if (!stillRunning) {
                    const isQueueEmpty = this.instance.messageQueue.length === 0;
                    if (isQueueEmpty) {
                      this.instance.messageThreadsRunning = false;
                      this.instance.messageThreads = [];
                    } else {
                      this.instance.data = this.instance.messageQueue.shift();
                      this.instance.messageThreads = runtime.startHats(
                        "epGlobalWebsocket_onMessage",
                        null,
                        util.target
                      );
                    }
                  }
                }
              };

              const onStopAll = () => {
                this.instance.destroyed = true;
                websocket.close();
              };

              vm.runtime.on("BEFORE_EXECUTE", beforeExecute);
              vm.runtime.on("PROJECT_STOP_ALL", onStopAll);

              const cleanup = () => {
                vm.runtime.off("BEFORE_EXECUTE", beforeExecute);
                vm.runtime.off("PROJECT_STOP_ALL", onStopAll);
                for (const thread of this.instance.connectThreads) {
                  thread.status = 4; // STATUS_DONE
                }
                resolve();
              };

              websocket.onopen = (e) => {
                if (this.instance.destroyed) {
                  cleanup();
                  websocket.close();
                  return;
                }

                for (const item of this.instance.sendOnceConnected) {
                  websocket.send(item);
                }
                this.instance.sendOnceConnected.length = 0;

                this.instance.connectThreads = runtime.startHats(
                  "epGlobalWebsocket_onOpen",
                  null,
                  util.target
                );
                resolve();
              };

              websocket.onclose = (e) => {
                if (!this.instance.errored) {
                  this.instance.closeMessage = e.reason || "";
                  this.instance.closeCode = e.code;
                  cleanup();

                  if (!this.instance.destroyed) {
                    runtime.startHats("epGlobalWebsocket_onClose", null, util.target);
                  }
                }
              };

              websocket.onerror = (e) => {
                console.error("websocket error", e);
                this.instance.errored = true;
                cleanup();

                if (!this.instance.destroyed) {
                  runtime.startHats("epGlobalWebsocket_onError", null, util.target);
                }
              };

              websocket.onmessage = async (e) => {
                if (this.instance.destroyed) {
                  return;
                }

                let data = e.data;
                if (data instanceof Blob) {
                  data = await blobToDataURL(data);
                }

                if (this.instance.messageThreadsRunning) {
                  this.instance.messageQueue.push(data);
                } else {
                  this.instance.data = data;
                  this.instance.messageThreadsRunning = true;
                  this.instance.messageThreads = runtime.startHats(
                    "epGlobalWebsocket_onMessage",
                    null,
                    util.target
                  );
                }
              };
            })
        )
        .catch((err) => {
          console.error("websocket error", err);
        });
    }

    onOpen(args, util) {
      if (!this.instance.websocket) {
        return;
      }
      return Scratch.runtime.startHats("epGlobalWebsocket_onOpen", null, util.target);
    }

    isConnected() {
      return !!(this.instance.websocket && this.instance.websocket.readyState === WebSocket.OPEN);
    }

    onMessage(args, util) {
      if (!this.instance.websocket) {
        return;
      }
      return Scratch.runtime.startHats("epGlobalWebsocket_onMessage", null, util.target);
    }

    messageData() {
      return this.instance.data;
    }

    sendMessage(args) {
      if (this.instance.websocket) {
        this.instance.websocket.send(Cast.toString(args.PAYLOAD));
      } else {
        this.instance.sendOnceConnected.push(Cast.toString(args.PAYLOAD));
      }
    }

    onError(args, util) {
      if (!this.instance.websocket) {
        return;
      }
      return Scratch.runtime.startHats("epGlobalWebsocket_onError", null, util.target);
    }

    hasErrored() {
      return this.instance.errored;
    }

    onClose(args, util) {
      if (!this.instance.websocket) {
        return;
      }
      return Scratch.runtime.startHats("epGlobalWebsocket_onClose", null, util.target);
    }

    isClosed() {
      return !!(this.instance.websocket && this.instance.websocket.readyState === WebSocket.CLOSED);
    }

    closeCode() {
      return this.instance.closeCode;
    }

    closeMessage() {
      return this.instance.closeMessage;
    }

    closeWithoutReason() {
      if (this.instance.websocket) {
        this.instance.websocket.close();
      }
    }

    closeWithCode(args) {
      if (this.instance.websocket) {
        this.instance.websocket.close(toCloseCode(args.CODE));
      }
    }

    closeWithReason(args) {
      if (this.instance.websocket) {
        this.instance.websocket.close(toCloseCode(args.CODE), toCloseReason(args.REASON));
      }
    }
  }

  Scratch.extensions.register(new WebSocketExtension());
})(Scratch);
