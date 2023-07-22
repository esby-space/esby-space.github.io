export class Vector {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    length() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    add(vector: Vector): Vector {
        const x = this.x + vector.x;
        const y = this.y + vector.y;
        return new Vector(x, y);
    }

    subtract(vector: Vector): Vector {
        const x = this.x - vector.x;
        const y = this.y - vector.y;
        return new Vector(x, y);
    }

    multiply(scaler: number): Vector {
        const x = this.x * scaler;
        const y = this.y * scaler;
        return new Vector(x, y);
    }

    divide(scaler: number): Vector {
        if (scaler == 0) return new Vector(0, 0);
        const x = this.x / scaler;
        const y = this.y / scaler;
        return new Vector(x, y);
    }

    normalize(): Vector {
        let length = this.length();
        return this.divide(length);
    }
}

