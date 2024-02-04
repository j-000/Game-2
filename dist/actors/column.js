class Column {
    constructor(x, y, width, height) {
        this.id = Math.floor(Math.random() * 5000);
        this.pos = new Vector2D(x, y);
        this.initpos = new Vector2D(x, y);
        this.vel = new Vector2D(-2, 0);
        this.width = width;
        this.heigth = height;
        this.free = true;
        this.r = Math.random() * 0.5;
    }
    start() {
        this.free = false;
    }
    reset() {
        this.free = true;
        this.pos.x = this.initpos.x;
        this.r = Math.random() * 0.5;
    }
    draw(ctx) {
        if (!this.free) {
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = 'gold';
            ctx.fillRect(this.pos.x, this.pos.y, this.width, this.heigth * this.r);
            ctx.fillRect(this.pos.x, this.pos.y + 150 + this.heigth * this.r, this.width, this.heigth);
            ctx.restore();
        }
    }
    checkCollision(player) {
    }
    update() {
        if (!this.free) {
            if (this.pos.x < 0) {
                this.reset();
            }
            else {
                this.pos.add(this.vel);
            }
        }
    }
}
