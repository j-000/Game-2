import {Vector2D} from './Vector2D';

export class CircleEntity {
    pos: Vector2D;
    vel?: Vector2D;
    img: CanvasImageSource;
    radius: number;

    constructor(img: CanvasImageSource, pos: Vector2D, radius: number, vel?: Vector2D){
        this.pos = pos;
        this.vel = vel;
        this.img = img;
        this.radius = radius;
    }

    draw(ctx: CanvasRenderingContext2D){
        let im = this.img as HTMLImageElement;
        if(im){
            ctx.drawImage(this.img, this.pos.x - im.width / 2, this.pos.y - im.height / 2);
        } else {
            ctx.beginPath();
            ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }
    
    }
}