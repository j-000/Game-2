import Player from "./player";
import Vector2D from "../utils/vector2d";

export default class Column {
    id: number;
    pos: Vector2D;
    initpos: Vector2D;
    vel: Vector2D;
    width: number;
    heigth: number;
    free: boolean;
    r: number;
  
    constructor(x: number, y: number, width: number, height: number) {
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
  
    draw(ctx: CanvasRenderingContext2D) {
      if (!this.free) {
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = 'gold';
  
        ctx.fillRect(this.pos.x, this.pos.y, this.width, this.heigth * this.r);
        ctx.fillRect(this.pos.x, this.pos.y + 150 + this.heigth * this.r, this.width, this.heigth);
  
        ctx.restore();
      }
    }
    
    checkCollision(player: Player) {
  
    }
  
    update() {
      if (!this.free) {
        if (this.pos.x < 0) {
          this.reset();
        } else {
          this.pos.add(this.vel);
        }
      }
    }
  }