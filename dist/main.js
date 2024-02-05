class Vector2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    normalize() {
        const mag = this.magnitude();
        if (mag === 0) {
            this.x = 0;
            this.y = 0;
        }
        else {
            this.x / mag;
            this.y / mag;
        }
    }
    dotProduct(other) {
        return this.x * other.x + this.y * other.y;
    }
    crossProduct(other) {
        return this.x * other.y - this.y * other.x;
    }
    distanceTo(other) {
        const dx = other.x - this.x;
        const dy = other.y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    angleTo(other) {
        const dot = this.dotProduct(other);
        const magProduct = this.magnitude() * other.magnitude();
        return Math.acos(dot / magProduct);
    }
    rotate(angle) {
        const cosAngle = Math.cos(angle);
        const sinAngle = Math.sin(angle);
        const newX = this.x * cosAngle - this.y * sinAngle;
        const newY = this.x * sinAngle + this.y * cosAngle;
        this.x = newX;
        this.y = newY;
    }
    perpendicularTo(clockwise = false) {
        const sign = clockwise ? 1 : -1;
        this.x = -sign * this.y;
        this.y = sign * this.x;
    }
    equals(other) {
        return this.x === other.x && this.y === other.y;
    }
    add(other) {
        this.x += other.x;
        this.y += other.y;
    }
    subtract(other) {
        this.x -= other.x;
        this.y -= other.y;
    }
    multiply(scalar) {
        this.x *= scalar;
        this.y *= scalar;
    }
    divide(scalar) {
        if (scalar === 0) {
            throw new Error("Division by zero");
        }
        else {
            this.x /= scalar;
            this.y /= scalar;
        }
        ;
    }
    getAngle() {
        return Math.atan2(this.y, this.x);
    }
    getDirection() {
        // getDirection().x or getDirection().y to access x or y direction. 
        this.normalize();
        return this;
    }
    toArray() {
        return [this.x, this.y];
    }
    scale(scalar) {
        this.multiply(scalar);
    }
    projectOnto(other) {
        const mag = other.magnitude();
        const scalarProjection = this.dotProduct(other) / (mag * mag);
        other.normalize();
        other.scale(scalarProjection);
        return other;
    }
}
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
class Projectile extends CircleHitBox {
    constructor(radius) {
        let pos = new Vector2D(-100, -100);
        super(radius, pos);
        this.available = true; // true = is in projectile pool (has not been shot).
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
        // Only draw projectiles that have been shot.
        if (!this.available) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'gold';
            ctx.fill();
            ctx.restore();
        }
    }
    update() {
        // Only update projectiles that have been shot.
        if (!this.available) {
            // Update the projectile position acording to its velocity
            this.pos.add(this.vel);
        }
    }
}
class Player extends CircleHitBox {
    constructor(x, y, radius) {
        let pos = new Vector2D(x, y);
        super(radius, pos);
        this.handleEvents = (name, data) => {
            if (name == 'keydown') {
                if (data.key == 'ArrowLeft') {
                    this.keyPressed.left = true;
                    this.rot = 0;
                }
                if (data.key == 'ArrowUp') {
                    this.keyPressed.up = true;
                    this.rot = Math.PI;
                }
                if (data.key == 'ArrowRight') {
                    this.keyPressed.right = true;
                    this.rot = Math.PI;
                }
                if (data.key == 'ArrowDown') {
                    this.keyPressed.down = true;
                    this.rot = -Math.PI;
                }
                if (data.key == ' ') {
                    this.shoot();
                }
            }
            if (name == 'keyup') {
                if (data.key == 'ArrowLeft') {
                    this.keyPressed.left = false;
                }
                if (data.key == 'ArrowUp') {
                    this.keyPressed.up = false;
                }
                if (data.key == 'ArrowRight') {
                    this.keyPressed.right = false;
                }
                if (data.key == 'ArrowDown') {
                    this.keyPressed.down = false;
                }
            }
        };
        this.vel = new Vector2D(0, 0);
        this.events = new EventsEngine();
        this.speedFactor = 5;
        this.keyPressed = {
            left: false,
            up: false,
            right: false,
            down: false
        };
        this.image = {
            src: document.getElementById('player'),
            w: 80,
            h: 80
        };
        this.rot = Math.PI;
    }
    draw(ctx) {
        let scaleFactor = 0.5;
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.rotate(this.rot);
        ctx.scale(scaleFactor, scaleFactor);
        ctx.drawImage(this.image.src, -this.image.w * scaleFactor, -this.image.h * scaleFactor);
        ctx.restore();
    }
    update() {
        // Update position based on keys pressed
        this.updatePosition();
    }
    updatePosition() {
        let dx = 0;
        let dy = 0;
        // Update dx and dy based on what keys are being pressed
        // holding two keys at once will make it move diagonally. 
        if (this.keyPressed.left) {
            dx += -1;
        }
        if (this.keyPressed.right) {
            dx += 1;
        }
        if (this.keyPressed.up) {
            dy += -1;
        }
        if (this.keyPressed.down) {
            dy += 1;
        }
        // Update our velocity vector
        this.vel.x = dx;
        this.vel.y = dy;
        // Scale velocity by speedFactor
        this.vel.multiply(this.speedFactor);
        // Add velocity to the player's position to make it move
        this.pos.add(this.vel);
        // Clear velocity vector to avoid cumulative addition
        this.vel.multiply(0);
    }
    shoot() {
        this.events.emit('player_shot', { player: this });
    }
}
class Column {
    constructor(x, y, width, height) {
        this.pos = new Vector2D(x, y);
        this.initpos = new Vector2D(x, y);
        this.vel = new Vector2D(-2, 0);
        this.width = width;
        this.heigth = height;
        this.free = true;
        this.randNumber = Math.random();
        this.heightFactor = Math.random();
        this.spawns = 0;
    }
    start() {
        this.free = false;
        this.spawns++;
    }
    reset() {
        this.free = true;
        this.pos.x = this.initpos.x;
        this.randNumber = Math.random();
        this.heightFactor = 0.25 + Math.random() * 0.5;
    }
    draw(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = 'gold';
        // draw either a top or bottow column 50% of times.
        if (this.randNumber < 0.5) {
            ctx.fillRect(this.pos.x, this.pos.y, this.width, this.heigth * this.heightFactor);
        }
        else {
            ctx.fillRect(this.pos.x, this.pos.y + this.heigth * this.heightFactor, this.width, this.heigth);
        }
        ctx.restore();
    }
    update() {
        if (this.pos.x < 0) {
            this.reset();
        }
        else {
            this.pos.add(this.vel);
        }
    }
}
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
class GameEngine {
    constructor(canvas, gravityY, columns, projectiles) {
        this.backgroundX = 0;
        this.backgroundY = 0;
        this.log = (name, data) => {
            if (name == 'keydown') {
                if (data.key == 'd') {
                    this.cameraBox.position.x += 10;
                    console.log(this);
                }
            }
        };
        this.handlePlayerEvents = (name, data) => {
            if (name == 'player_shot') {
                let projectile = this.getProjectile();
                let player = data.player;
                if (projectile) {
                    let aim = this.calcAim(player.pos, new Vector2D(0, 0));
                    const directionX = Math.cos(player.rot);
                    const directionY = Math.sin(player.rot);
                    const magnitude = Math.sqrt(Math.pow(directionX, 2) + Math.pow(directionY, 2));
                    const normalizedDirectionX = directionX / magnitude;
                    const normalizedDirectionY = directionY / magnitude;
                    const projectileVelocity = { x: normalizedDirectionX * -4, y: normalizedDirectionY * -4 };
                    projectile.start(player.pos.x, player.pos.y, projectileVelocity.x * this.projectiles.speed, projectileVelocity.y * this.projectiles.speed);
                }
            }
        };
        this.cameraBox = {
            position: {
                x: 0,
                y: 0
            },
            width: 300,
            height: 300
        };
        this.canvas = canvas;
        this.image = document.getElementById('background');
        this.windowEvents = new EventsEngine();
        this.gravity = new Vector2D(0, gravityY);
        this.players = {
            pool: new Array(),
            max: 1
        };
        this.columns = {
            pool: new Array(),
            max: columns.max,
            timer: new Timer(columns.timerMs)
        };
        this.projectiles = {
            pool: new Array(),
            max: projectiles.max,
            radius: projectiles.radius,
            speed: projectiles.speed
        };
        // Create players pool and subscribe to events
        for (let i = 0; i < this.players.max; i++) {
            let newPlayer = new Player(this.canvas.width / 10, this.canvas.height / 2, 30);
            this.players.pool.push(newPlayer); // Add new player to pool
            this.windowEvents.subscribe(newPlayer.handleEvents); // Subscribe players to GameEngine window events 
            newPlayer.events.subscribe(this.handlePlayerEvents); // Susbcribe GameEngine to player events
        }
        // Create columns pool
        for (let i = 0; i < this.columns.max; i++) {
            this.columns.pool.push(new Column(this.canvas.width, 0, 30, this.canvas.height));
        }
        // Create projectiles pool
        for (let i = 0; i < this.projectiles.max; i++) {
            this.projectiles.pool.push(new Projectile(5));
        }
        // Bind window event listeners for 'key' pressed/released
        window.addEventListener('keydown', e => this.windowEvents.emit('keydown', e));
        window.addEventListener('keyup', e => this.windowEvents.emit('keyup', e));
        // Debug events
        this.windowEvents.subscribe(this.log);
    }
    render(ctx, deltaTime) {
        /**
         *
         * Draw background
         *
         */
        let w = window.innerWidth;
        let h = window.innerHeight;
        ctx.drawImage(this.image, this.backgroundX, this.backgroundY, // source start point 
        w, h, // source w / h
        0, 0, // image cropbox p2
        w, h // destination height / width
        );
        /**
         *
         * Player logic
         *
         */
        let player = this.players.pool[0];
        player.draw(ctx);
        player.update();
        if (player.pos.x < player.radius)
            player.pos.x = player.radius; // Prevent offscreen left
        if (player.pos.x > this.canvas.width - player.radius)
            player.pos.x = this.canvas.width - player.radius; // Prevent offscreen right
        if (player.pos.y <= player.radius)
            player.pos.y = player.radius; // Prevent offscreen up
        if (player.pos.y > this.canvas.height - player.radius)
            player.pos.y = this.canvas.height - player.radius; // Prevent offscreen down
        /**
         *
         * Camerabox
         *
         */
        ctx.save();
        ctx.translate(player.pos.x - this.cameraBox.position.x - this.cameraBox.width / 2, player.pos.y - this.cameraBox.position.y - this.cameraBox.height / 2);
        ctx.fillStyle = 'rgba(0, 0, 255, 0.2)';
        ctx.fillRect(this.cameraBox.position.x, this.cameraBox.position.y, this.cameraBox.width, this.cameraBox.height);
        ctx.restore();
        this.cameraBox.position = {
            x: player.pos.x - 150,
            y: player.pos.y - 150
        };
        let cameraRightSide = this.cameraBox.position.x + this.cameraBox.width;
        if (cameraRightSide >= this.canvas.width && this.backgroundX < 900) {
            this.backgroundX += 2;
        }
        /**
         *
         * Projectiles logic
         *
         */
        // Draw projectile bar at top
        this.drawProjectilePoolBar(ctx);
        for (let projectile of this.projectiles.pool) {
            if (!projectile.available) {
                projectile.draw(ctx);
                projectile.update();
                if (projectile.pos.x > this.canvas.width + projectile.radius || // Offscreen right
                    projectile.pos.x < -projectile.radius || // Offscreen left
                    projectile.pos.y < -projectile.radius || // Offscreen up
                    projectile.pos.y > this.canvas.height + projectile.radius // Offscreen down
                ) {
                    projectile.reset();
                }
            }
        }
        /**
         *
         * Columns logic
         *
         */
        for (let column of this.columns.pool) {
            if (!column.free) {
                column.draw(ctx);
                column.update();
                // check collisions with player 
                // check collision with projectiles
            }
        }
        // Periodically add a column from the pool once it becomes free
        if (this.columns.timer.ready) { // If enough time has passed according to timer
            let column = this.getColumn(); // Get a free column (on none)
            if (column) {
                if (Math.random() < 0.75) { // Add some probability, even though colum is free.
                    column.start(); // Start - this add column to scene. 
                }
                this.columns.timer.reset(); // Reset timer.
            }
        }
        else {
            this.columns.timer.add(deltaTime); // Otherise, add more deltaTime to time.
        }
    }
    drawProjectilePoolBar(ctx) {
        ctx.save();
        ctx.font = '15px Impact';
        ctx.fillStyle = 'white';
        let freeProjectiles = this.projectiles.pool.filter(p => p.available).length;
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
        for (let column of this.columns.pool) {
            if (column.free) {
                return column;
            }
        }
    }
    getProjectile() {
        for (let projectile of this.projectiles.pool) {
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
    const game = new GameEngine(canvas, // canvas
    5, // gravity
    { max: 0, timerMs: 2000 }, // columns
    { max: 10, radius: 8, speed: 5 } // projectiles
    );
    let lastTime = 0;
    function animate(timeStamp) {
        // [Helper] calculate time it takes to animate 1 frame.
        // Used to calculate FPS metric and to standardize periodic functions.
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
