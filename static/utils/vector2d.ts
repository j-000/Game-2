export default class Vector2D {
    x: number;
    y: number;
  
    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
    }
  
    magnitude(): number {
      return Math.sqrt(this.x * this.x + this.y * this.y)
    }
  
    normalize(): void {
      const mag = this.magnitude();
      if (mag === 0) {
      this.x = 0;
      this.y = 0;
      } else {
      this.x / mag;
      this.y / mag;
      }
    }
  
    dotProduct(other: Vector2D): number {
      return this.x * other.x + this.y * other.y;
    }
  
    crossProduct(other: Vector2D): number {
      return this.x * other.y - this.y * other.x;
    }
  
    distanceTo(other: Vector2D): number {
      const dx = other.x - this.x;
      const dy = other.y - this.y;
      return Math.sqrt(dx * dx + dy * dy);
    }
  
    angleTo(other: Vector2D): number {
      const dot = this.dotProduct(other);
      const magProduct = this.magnitude() * other.magnitude();
      return Math.acos(dot / magProduct);
    }
  
    rotate(angle: number): void {
      const cosAngle = Math.cos(angle);
      const sinAngle = Math.sin(angle);
      const newX = this.x * cosAngle - this.y * sinAngle;
      const newY = this.x * sinAngle + this.y * cosAngle;
      this.x = newX
      this.y = newY;
    }
  
    perpendicularTo(clockwise: boolean = false): void {
      const sign = clockwise ? 1 : -1;
      this.x = -sign * this.y
      this.y = sign * this.x;
    }
  
    equals(other: Vector2D): boolean {
      return this.x === other.x && this.y === other.y;
    }
  
    add(other: Vector2D): void {
      this.x += other.x;
      this.y += other.y;
    }
  
    subtract(other: Vector2D): void {
      this.x -= other.x;
      this.y -= other.y;
    }
  
    multiply(scalar: number): void {
      this.x *= scalar;
      this.y *= scalar;
    }
  
    divide(scalar: number): void {
      if (scalar === 0) {
      throw new Error("Division by zero");
      } else {
      this.x /= scalar;
      this.y /= scalar
      };
    }
  
    getAngle(): number {
      return Math.atan2(this.y, this.x);
    }
  
    getDirection(): Vector2D {
      // getDirection().x or getDirection().y to access x or y direction. 
      this.normalize();
      return this;
    }
  
    toArray(): [number, number] {
      return [this.x, this.y];
    }
  
    scale(scalar: number): void {
      this.multiply(scalar);
    }
  
    projectOnto(other: Vector2D): Vector2D {
      const mag = other.magnitude();
      const scalarProjection = this.dotProduct(other) / (mag * mag);
      other.normalize();
      other.scale(scalarProjection);
      return other
    }
}