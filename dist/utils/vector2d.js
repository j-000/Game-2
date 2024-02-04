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
