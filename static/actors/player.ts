import CircleHitBox from "../utils/CircleHitBox";
import { EventsEngine } from "../utils/EventsEngine";
import Vector2D from "../utils/vector2d";



interface keysObj {
    left: boolean,
    up: boolean,
    down: boolean,
    right: boolean
}
  
interface imageObj {
    src: CanvasImageSource,
    w: number, 
    h: number
}
  
export default class Player extends CircleHitBox {
    events: EventsEngine;
    
    vel: Vector2D;
    speedFactor: number;
  
    keyPressed: keysObj;
    image: imageObj;
  
    rot: number;
  
    constructor(x: number, y: number, radius: number) {
      let pos = new Vector2D(x, y);
      super(radius, pos);
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
        src: document.getElementById('player') as CanvasImageSource,
        w: 80,
        h: 80
      };
      this.rot = Math.PI;
    }
  
    draw(ctx: CanvasRenderingContext2D) {
      let scaleFactor = 0.5;
      ctx.save()
      ctx.translate(this.pos.x, this.pos.y)
      ctx.rotate(this.rot)
      ctx.scale(scaleFactor, scaleFactor);
      ctx.drawImage(
        this.image.src, 
        -this.image.w * scaleFactor, 
        -this.image.h * scaleFactor
      )
      ctx.restore();
      // Draw hitbox
      super.draw(ctx);
      
    }
  
    handleEvents = (name: string, data: any) => {
      if (name == 'keydown') {
        if (data.key == 'ArrowLeft') {
          this.keyPressed.left = true;
          this.rot = 0;
        }
        if (data.key == 'ArrowUp') {
          this.keyPressed.up = true;
          this.rot = Math.PI / 2;
        }
        if (data.key == 'ArrowRight') {
          this.keyPressed.right = true;
          this.rot = Math.PI;
        }
        if (data.key == 'ArrowDown') {
          this.keyPressed.down = true;
          this.rot = -Math.PI / 2
        }
        if(data.key == ' '){
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
    }
  
    update() {
    // Update position based on keys pressed
      this.updatePosition();
    }
  
    updatePosition(){
      let dx = 0;
      let dy = 0;
  
      // Update dx and dy based on what keys are being pressed
      // holding two keys at once will make it move diagonally. 
      if (this.keyPressed.left) {
        dx += -1
      }
      if (this.keyPressed.right) {
        dx += 1;
      }
      if (this.keyPressed.up) {
        dy += -1
      }
      if (this.keyPressed.down) {
        dy += 1
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
  
    shoot(){
      this.events.emit('player_shot', null);    
    }
  
    checkCanvasCollision(canvas: HTMLCanvasElement){
      // Check player / canvas collisions
      if (this.pos.x < this.radius) {
        this.pos.x = this.radius;
      }
      if (this.pos.x > canvas.width - this.radius) {
        this.pos.x = canvas.width - this.radius;
      }
      if (this.pos.y <= this.radius) {
        this.pos.y = this.radius;
      }
      if (this.pos.y > canvas.height - this.radius) {
        this.pos.y = canvas.height - this.radius;
      }
    }
  
  }