import { Vector } from "./math";

const GRAVITY = new Vector(0, 0.2);

class Object {
    position: Vector;
    previous: Vector;
    acceleration: Vector;

    constructor(x: number, y: number) {
        this.position = new Vector(x, y);
        this.previous = new Vector(x, y);
        this.acceleration = new Vector(0, 0);
    }

    update(dt: number) {
        // verlet integration: x_2 = 2 * x_1 - x_0 + a_2 * dt ^ 2
        this.position = this.position
            .multiply(2)
            .subtract(this.previous)
            .add(this.acceleration.multiply(dt * dt));
        this.previous = this.position;

        this.acceleration.x = 0;
        this.acceleration.y = 0;
    }

    accelerate(acceleration: Vector) {
        this.acceleration = this.acceleration.add(acceleration);
    }
}

export const Verlet = {
    objects: [] as Object[],

    update(dt: number) {
        for (let i = 0; i < this.objects.length; i++) {
            const object = this.objects[i];
            object.accelerate(GRAVITY);
            object.update(dt);
        }
    },

    createObject(x = 0, y = 0) {
        this.objects.push(new Object(x, y));
    }
}

