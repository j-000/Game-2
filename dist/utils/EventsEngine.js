class EventsEngine {
    constructor() {
        this.handlers = new Set();
    }
    subscribe(handler) {
        this.handlers.add(handler);
    }
    unsubscribe(handler) {
        this.handlers.delete(handler);
    }
    emit(name, data) {
        for (const handler of this.handlers) {
            handler(name, data);
        }
    }
}
