export default class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static zero = new Vector2(0, 0);

    static one = new Vector2(1, 1);

    static add(a, b) {
        return new Vector2(a.x + b.x, a.y + b.y);
    }

    static sub(a, b) {
        return new Vector2(a.x - b.x, a.y - b.y);
    }

    static div(v2, scalar) {
        return new Vector2(v2.x / scalar, v2.y / scalar);
    }

    static mult(v2, scalar) {
        return new Vector2(v2.x * scalar, v2.y * scalar);
    }

    magnitude() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    normalised() {
        return Vector2.div(this, this.magnitude());
    }
}
