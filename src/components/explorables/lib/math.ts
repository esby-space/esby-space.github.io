export function pythag(x: number, y: number, z = 0): number {
    return Math.sqrt(x ** 2 + y ** 2 + z ** 2);
}

export class Vector {
    x: number;
    y: number;
    z: number;

    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    get magnitude(): number {
        return pythag(this.x, this.y, this.z);
    }

    add(vector: Vector): Vector {
        const x = this.x + vector.x;
        const y = this.y + vector.y;
        const z = this.z + vector.z;
        return new Vector(x, y, z);
    }

    subtract(vector: Vector): Vector {
        return this.add(vector.scale(-1));
    }

    scale(scalar: number): Vector {
        const x = this.x * scalar;
        const y = this.y * scalar;
        const z = this.z * scalar;
        return new Vector(x, y, z);
    }

    dot(vector: Vector): number {
        return this.x * vector.x + this.y * vector.y + this.z * vector.z;
    }

    cross(vector: Vector): Vector {
        const x = this.y * vector.z - this.z * vector.y;
        const y = -(this.x * vector.z - this.z * vector.x);
        const z = this.x * vector.y - this.y * vector.x;
        return new Vector(x, y, z);
    }

    hadamard(vector: Vector): Vector {
        const x = this.x * vector.x;
        const y = this.y * vector.y;
        const z = this.z * vector.z;
        return new Vector(x, y, z);
    }

    normalize(magnitude = 1): Vector {
        if (this.magnitude == 0) { return new Vector(0, 0, 0) }
        return this.scale(magnitude / this.magnitude);
    }

    min(min = 1): Vector {
        return this.magnitude < min ? this.normalize(min) : this;
    }

    max(max = 1): Vector {
        return this.magnitude > max ? this.normalize(max) : this;
    }

    clamp(min: number, max: number): Vector {
        if (this.magnitude > max) return this.normalize(max);
        if (this.magnitude < min) return this.normalize(min);
        return this;
    }

    project(camera: Camera): { x: number, y: number, size: number } {
        // orthographic when camera.fov = 0 => size = 1
        const perspective = camera.fov * camera.width;
        const size = perspective ? perspective / (perspective + (this.z - camera.position.z)) : 1;

        return {
            x: (this.x * size) + camera.position.x,
            y: (this.y * size) + camera.position.y,
            size,
        };
    }

    rotate(rotation: Vector) {
        // https://en.wikipedia.org/wiki/Rodrigues%27_rotation_formula
        const axis = rotation.normalize();
        const angle = rotation.magnitude;
        if (!angle) return this;

        const scale = this.scale(Math.cos(angle)).add((axis.cross(this)).scale(Math.sin(angle)))
        const skew = axis.scale(axis.dot(this) * (1 - Math.cos(angle)));
        return scale.add(skew);
    }

    static average(vectors: Vector[]): Vector {
        const count = vectors.length;
        if (count == 0) return new Vector();
        const total = vectors.reduce((acc, cur) => acc.add(cur));
        return total.scale(1 / count);
    }

    draw(context: CanvasRenderingContext2D, origin: Vector, scale: number, camera: Camera): void {
        const start = origin.project(camera);
        const end = origin.add(this.scale(scale)).project(camera);

        context.beginPath();
        context.moveTo(start.x, start.y);
        context.lineTo(end.x, end.y);
        context.stroke();
    }
}

export class Matrix {
    data: number[][];
    rows: Vector[];
    columns: Vector[];

    constructor(data: number[][]) {
        this.data = data;
        this.rows = [];
        this.columns = [];

        for (let i = 0; i < 3; i++) {
            this.rows.push(new Vector(data[i][0], data[i][1], data[i][2]));
            this.columns.push(new Vector(data[0][i], data[1][i], data[2][i]))
        }
    }

    multiply(vector: Vector): Vector {
        const result = new Vector();
        result.x = this.rows[0].dot(vector);
        result.y = this.rows[1].dot(vector);
        result.z = this.rows[2].dot(vector);
        return result;
    }

    static rotateX(angle: number): Matrix {
        return new Matrix([
            [1, 0, 0],
            [0, Math.cos(angle), -Math.sin(angle)],
            [0, Math.sin(angle), Math.cos(angle)]
        ]);
    }
    
    static rotateY(angle: number): Matrix {
        return new Matrix([
            [Math.cos(angle), 0, Math.sin(angle)],
            [0, 1, 0],
            [-Math.sin(angle), 0, Math.cos(angle)]
        ]);
    }

    static rotateZ(angle: number): Matrix {
        return new Matrix([
            [Math.cos(angle), -Math.sin(angle), 0],
            [Math.sin(angle), Math.cos(angle), 0],
            [0, 0, 1],
        ]);
    }
}

export class Camera {
    position: Vector;
    fov: number;
    width: number;

    constructor(position: Vector, fov = 0, width = 0) {
        this.position = position;
        this.fov = fov;
        this.width = width;
    }
}

