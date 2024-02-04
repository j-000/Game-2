export default class Timer {
    counter: number;
    interval: number;

    constructor(targetInterval: number) {
        this.counter = 0;
        this.interval = targetInterval;
    }
    get ready() {
        return this.counter > this.interval;
    }
    add(deltaTime: number) {
        this.counter += deltaTime;
    }
    reset() {
        this.counter = 0;
    }
}

