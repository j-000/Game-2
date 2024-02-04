class GameEngine {
    constructor(canvas) {
        this.columnsPool = [];
        this.projectilePool = [];
        this.handlePlayerEvents = (name, data) => {
            if (name == 'player_shot') {
                let projectile = this.getProjectile();
                if (projectile) {
                    let aim = this.calcAim(this.player.pos, new Vector2D(0, 0));
                    const directionX = Math.cos(this.player.rot);
                    const directionY = Math.sin(this.player.rot);
                    const magnitude = Math.sqrt(Math.pow(directionX, 2) + Math.pow(directionY, 2));
                    const normalizedDirectionX = directionX / magnitude;
                    const normalizedDirectionY = directionY / magnitude;
                    const projectileVelocity = { x: normalizedDirectionX * -4, y: normalizedDirectionY * -4 };
                    projectile.start(this.player.pos.x + projectile.radius * aim[0], this.player.pos.y + projectile.radius * aim[1], projectileVelocity.x, projectileVelocity.y);
                }
            }
        };
        this.canvas = canvas;
        this.gravity = new Vector2D(0, 5);
        this.columnsMax = 5;
        this.projectileMax = 10;
        this.player = new Player(this.canvas.width / 10, this.canvas.height / 2, 30);
        this.image = document.getElementById('background');
        this.windowEvents = new EventsEngine(); // Window events handled by GameEngine
        this.windowEvents.subscribe(this.player.handleEvents); // Player subscribes to these events
        // Add window event listeners for 'key' pressed/released
        window.addEventListener('keydown', e => this.windowEvents.emit('keydown', e));
        window.addEventListener('keyup', e => this.windowEvents.emit('keyup', e));
        this.player.events.subscribe(this.handlePlayerEvents);
        this.columnTimer = new Timer(1000); // activate a new column every 1 second.
        for (let i = 0; i < this.columnsMax; i++) {
            this.columnsPool.push(new Column(this.canvas.width, 0, 30, this.canvas.height));
        }
        for (let i = 0; i < this.projectileMax; i++) {
            this.projectilePool.push(new Projectile(10));
        }
    }
    render(ctx, deltaTime) {
        // Draw player
        this.player.draw(ctx);
        //Call player update method
        this.player.update();
        // Check collision with canvas
        this.player.checkCanvasCollision(this.canvas);
        // Projectiles
        for (let projectile of this.projectilePool) {
            projectile.draw(ctx);
            projectile.update();
        }
        // Loop all columns
        for (let column of this.columnsPool) {
            // Draw column
            // column.draw(ctx);
            // Call column update method
            // column.update()
            // Check collision with player
            // column.checkCollision(this.player)
        }
        // Periodically add a column from the pool once it becomes free
        if (this.columnTimer.ready) { // If enough time has passed according to timer
            let column = this.getColumn(); // Get a free column (on none)
            if (column) {
                if (Math.random() < 0.75) { // Add some probability, even though colum is free.
                    column.start(); // Start - this add column to scene. 
                }
                this.columnTimer.reset(); // Reset timer.
            }
        }
        else {
            this.columnTimer.add(deltaTime); // Otherise, add more deltaTime to time.
        }
        // draw projectile pool
        this.drawProjectilePoolBar(ctx);
    }
    drawProjectilePoolBar(ctx) {
        ctx.save();
        ctx.font = '15px Impact';
        ctx.fillStyle = 'white';
        let freeProjectiles = this.projectilePool.filter(p => p.available).length;
        ctx.textBaseline = 'middle';
        ctx.fillText(freeProjectiles.toString(), (this.canvas.width - 30 - (24 * freeProjectiles)), 20);
        for (let i = 0; i < freeProjectiles; i++) {
            ctx.beginPath();
            ctx.arc((this.canvas.width - 24 * freeProjectiles) + (24 * i), 20, 7, 0, Math.PI * 2);
            ctx.fillStyle = 'gold';
            ctx.fill();
        }
        ctx.restore();
    }
    getColumn() {
        for (let column of this.columnsPool) {
            if (column.free) {
                return column;
            }
        }
    }
    getProjectile() {
        for (let projectile of this.projectilePool) {
            if (projectile.available) {
                return projectile;
            }
        }
    }
    calcAim(a, b) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        const aimX = dx / dist * -1;
        const aimY = dy / dist * -1;
        return [aimX, aimY, dx, dy];
    }
}
// Once all HTML and images are loaded
window.addEventListener('load', () => {
    // Get canvas and set dimensions
    const canvas = document.getElementById('canvas1');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // Get canvas context and set some global defaults
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    // Instanciate a Game instance
    const game = new GameEngine(canvas);
    let lastTime = 0;
    function animate(timeStamp) {
        // [Helper] calculate time it takes to animate 1 frame.
        // Used to calculate FPS metric, for example.
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        // Reset canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Render new frame
        game.render(ctx, deltaTime);
        // Loop
        requestAnimationFrame(animate);
    }
    // Loop
    requestAnimationFrame(animate);
});
