class Projectile extends CircleHitBox {
    constructor(radius) {
        let pos = new Vector2D(-100, -100);
        super(radius, pos);
        this.available = true; // Is in projectile pool (has not been shot).
        this.vel = new Vector2D(0, 0);
        this.velScalar = 1;
    }
    start(x, y, speedX, speedY) {
        this.available = false;
        this.pos = new Vector2D(x, y);
        this.vel = new Vector2D(speedX, speedY);
        this.vel.scale(this.velScalar);
    }
    reset() {
        this.available = true;
    }
    draw(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'gold';
        ctx.fill();
        ctx.restore();
    }
    update() {
        // Only update projectiles that have been shot (NOT in the pool);
        if (!this.available) {
            // Update the projectile position acording to its velocity
            this.pos.add(this.vel);
            // If the same is STOP, check if start button is triggered
            // triggering the button is done by shooting at it
            // if(this.game.stop && this.game.checkCollision(this, this.game.btn)){
            //     // Reset projectile
            //     this.reset();
            //     // Reset game
            //     this.game.reset();            
            // }
            // If projectile goes off canvas, reset it
            if (this.pos.x < 0 || this.pos.x > 3000 ||
                this.pos.y < 0 || this.pos.y > 1000) {
                this.reset();
            }
        }
    }
}
