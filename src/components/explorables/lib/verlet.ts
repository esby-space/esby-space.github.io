import { Vector } from "./math";

const GRAVITY = new Vector(0, 200);

export class Circle {
    position: Vector;
    previous: Vector;
    acceleration: Vector;
    radius: number;

    constructor(x: number, y: number, radius: number) {
        this.position = new Vector(x, y);
        this.previous = new Vector(x, y);
        this.acceleration = new Vector(0, 0);
        this.radius = radius;
    }

    update(dt: number) {
        // verlet integration: x_2 = 2 * x_1 - x_0 + a_2 * dt ^ 2
        const dx = this.position.subtract(this.previous);
        this.previous = this.position;
        this.position = this.position.add(dx).add(this.acceleration.multiply(dt * dt));

        this.acceleration.x = 0;
        this.acceleration.y = 0;
    }

    accelerate(acceleration: Vector) {
        this.acceleration = this.acceleration.add(acceleration);
    }
}

export const Verlet = {
    circles: [] as Circle[],
    center: new Vector(0, 0),

    init(width: number, height: number) {
        this.center.x = width / 2;
        this.center.y = height / 2;
    },

    update(dt: number) {
        for (let i = 0; i < this.circles.length; i++) {
            const object = this.circles[i];
            object.accelerate(GRAVITY);

            let to = object.position.subtract(this.center);
            if (to.length() > 500 - object.radius) {
                to = to.normalize().multiply(500 - object.radius);
                object.position = to.add(this.center);
            }

            object.update(dt);
        }
    },

    add(circle: Circle) {
        this.circles.push(circle);
    }
}

