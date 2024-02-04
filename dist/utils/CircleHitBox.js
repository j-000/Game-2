class CircleHitBox {
    constructor(radius, pos) {
        this.radius = radius;
        this.pos = pos;
    }
    draw(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    }
}
