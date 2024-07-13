/**
 * Wrapper for client-side TikTok connection over Socket.IO
 * With reconnect functionality.
 */
 class TikTokIOConnection {
    constructor(backendUrl) {
        this.socket = io('https://tiktok-chat-reader.zerody.one/');
        this.uniqueId = null;
        this.options = null;

        this.socket.on('connect', () => {
            console.info("Terputus!");

            // Reconnect to streamer if uniqueId already set
            if (this.uniqueId) {
                this.setUniqueId();
            }
        })

        this.socket.on('disconnect', () => {
            console.warn("Terputus!");
        })

        this.socket.on('streamEnd', () => {
            console.warn("LIVE berakhir!");
            this.uniqueId = null;
        })

        this.socket.on('tiktokDisconnected', (errMsg) => {
            console.warn(errMsg);
            if (errMsg && errMsg.includes('LIVE berakhir')) {
                this.uniqueId = null;
            }
        });
    }

    connect(uniqueId, options) {
        this.uniqueId = uniqueId;
        this.options = options || {};

        this.setUniqueId();

        return new Promise((resolve, reject) => {
            this.socket.once('tiktokConnected', resolve);
            this.socket.once('tiktokDisconnected', reject);

            setTimeout(() => {
                reject('Terputus');
            }, 15000)
        })
    }

    setUniqueId() {
        this.socket.emit('setUniqueId', this.uniqueId, this.options);
    }

    on(eventName, eventHandler) {
        this.socket.on(eventName, eventHandler);
    }
}
