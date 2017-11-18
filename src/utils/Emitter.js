export default class Emitter {
    listeners = []

    on(event, callback) {
        this.listeners.push({
            event,
            callback
        })
    }

    broadcast(event, data) {
        for (let listener of this.listeners) {
            if (listener.event === event) {
                listener.callback(data)
            }
        }
    }
}