import Vector2D from "./vector2d";

export default class CircleHitBox {
    pos: Vector2D;
    radius: number;
  
    constructor(radius: number, pos: Vector2D) {
      this.radius = radius;
      this.pos = pos;
    }
  
    draw(ctx: CanvasRenderingContext2D) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
      ctx.stroke()
      ctx.restore();
    }
}