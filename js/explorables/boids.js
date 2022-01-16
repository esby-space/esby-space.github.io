"use strict";
const Boids = () => {
    // simulation parameters
    const density = 1; // 1 boid for 100000 px^2
    const fps = 60; // frames per second
    // boid parameters
    const speed = 5;
    const viewRadius = 150;
    const maxSteering = 0.3;
    // create canvas
    const canvas = createSimulation(document.body);
    const context = canvas.getContext('2d');
    context.fillStyle = 'white';
    context.strokeStyle = 'white';
    class Boid {
        x;
        y;
        angle;
        constructor() {
            this.x = Math.randomInt(0, canvas.width);
            this.y = Math.randomInt(0, canvas.height);
            this.angle = Math.random() * Math.TAU;
        }
        // draw boid to the canvas at random position
        draw() {
            context.save();
            context.translate(this.x, this.y);
            context.rotate(this.angle);
            context.beginPath();
            context.moveTo(-10, 10);
            context.lineTo(-10, -10);
            context.lineTo(20, 0);
            context.lineTo(-10, 10);
            context.fill();
            context.restore();
        }
        // main boid algorithm
        update() {
            // get boids inside viewRadius
            let closestBoids = [];
            for (let i = 0; i < boids.length; i++) {
                const boid = boids[i];
                const distance = Math.pythag(boid.x - this.x, boid.y - this.y);
                if (distance != 0 && distance < viewRadius) {
                    closestBoids = [...closestBoids, boid];
                }
            }
            let velocity = this.angle.toVector().normalize(speed);
            const position = new Vector(this.x, this.y);
            let target = position; // turn from absolute to relative vector
            // SEPERATION
            let seperationTargets = [];
            for (let i = 0; i < closestBoids.length; i++) {
                const boid = closestBoids[i];
                const target = new Vector(boid.x, boid.y)
                    .subtract(position)
                    .multiply(-1);
                seperationTargets = [...seperationTargets, target];
            }
            const seperation = Vector.average(...seperationTargets);
            target = target.add(seperation);
            // ALIGNMENT
            let alignmentTargets = [];
            for (let i = 0; i < closestBoids.length; i++) {
                const boid = closestBoids[i];
                const target = boid.angle.toVector().normalize(speed);
                alignmentTargets = [...alignmentTargets, target];
            }
            const alignment = Vector.average(...alignmentTargets);
            target = target.add(alignment);
            // COHESION
            let cohesionTargets = [];
            for (let i = 0; i < closestBoids.length; i++) {
                const boid = closestBoids[i];
                const target = new Vector(boid.x, boid.y).subtract(position);
                cohesionTargets = [...cohesionTargets, target];
            }
            const cohesion = Vector.average(...cohesionTargets);
            target = target.add(cohesion);
            // implement steering function
            const desired = target.subtract(position).normalize(speed);
            const steering = desired.subtract(velocity).max(maxSteering);
            velocity = velocity.add(steering).normalize(speed);
            // move the boid forward and steer
            this.x += velocity.x;
            this.y += velocity.y;
            this.angle = velocity.toAngle();
            // teleport boid if outside canvas
            if (this.x < 0)
                this.x = canvas.width;
            if (this.x > canvas.width)
                this.x = 0;
            if (this.y < 0)
                this.y = canvas.height;
            if (this.y > canvas.height)
                this.y = 0;
        }
    }
    // create all the boids
    const createBoids = () => {
        const num = Math.ceil(((canvas.width * canvas.height) / 100000) * density);
        let boids = [];
        for (let i = 0; i < num; i++) {
            boids = [...boids, new Boid()];
        }
        return boids;
    };
    // main loop
    const boids = createBoids();
    setInterval(() => {
        context.clear(canvas);
        for (let i = 0; i < boids.length; i++) {
            boids[i].draw();
            boids[i].update();
        }
    }, 1000 / fps);
};
window.addEventListener('load', Boids);
// /\__/\
// (=o.o=)
// |/--\|
// (")-(")
