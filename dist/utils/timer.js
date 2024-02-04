class Timer {
    constructor(targetInterval) {
        this.counter = 0;
        this.interval = targetInterval;
    }
    get ready() {
        return this.counter > this.interval;
    }
    add(deltaTime) {
        this.counter += deltaTime;
    }
    reset() {
        this.counter = 0;
    }
}
