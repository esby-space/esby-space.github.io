import { Vector } from "./math";

const BOID_DENSITY = 2048; // pixels^2 per boid
const VIEW_DISTANCE = 20;
const MAX_SPEED = 3;
const MAX_STEER = 0.5;
const SEPERATION_MULTIPLIER = 1.25;
const ALIGNMENT_MULTIPLIER = 1;
const COHESION_MULTIPLIER = 1;

export class Boid {
    position: Vector;
    velocity: Vector;

    constructor(maxX: number, maxY: number) {
        this.position = new Vector(Math.random() * maxX, Math.random() * maxY);

        const angle = Math.random() * 2 * Math.PI;
        this.velocity = new Vector(Math.cos(angle), Math.sin(angle)).normalize(
            MAX_SPEED,
        );
    }

    update(boids: Boid[], dt: number) {
        let seperation = new Vector(0, 0);
        let alignment = new Vector(0, 0);
        let cohesion = new Vector(0, 0);

        for (let boid of boids) {
            if (boid == this) continue;
            const difference = boid.position.subtract(this.position);
            const distance = difference.magnitude;
            if (distance > VIEW_DISTANCE) continue;

            seperation = seperation.add(difference.normalize(-1 / distance));
            alignment = alignment.add(boid.velocity);
            cohesion = cohesion.add(difference);
        }

        let acceleration = new Vector(0, 0);
        let forces = [seperation, alignment, cohesion];
        let multipliers = [
            SEPERATION_MULTIPLIER,
            ALIGNMENT_MULTIPLIER,
            COHESION_MULTIPLIER,
        ];

        for (let i = 0; i < 3; i++) {
            const turn = forces[i].normalize(MAX_SPEED).subtract(this.velocity);
            acceleration = acceleration.add(
                turn.max(MAX_STEER).scale(multipliers[i]),
            );
        }

        this.velocity = this.velocity.add(acceleration.scale(dt));
        this.position = this.position.add(this.velocity.scale(dt));
    }
}

export default {
    boids: [] as Boid[],

    init(width: number, height: number) {
        this.boids = [];
        const boids_count = (width * height) / BOID_DENSITY;
        for (let i = 0; i < boids_count; i++) {
            this.boids.push(new Boid(width, height));
        }
    },

    update(dt: number) {
        for (let boid of this.boids) {
            boid.update(this.boids, dt);
        }
    },
};
