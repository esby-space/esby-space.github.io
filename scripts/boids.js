"use strict";
class Vector {
    x;
    y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
    add(vector) {
        return new Vector(vector.x + this.x, vector.y + this.y);
    }
    subtract(vector) {
        return new Vector(this.x - vector.x, this.y - vector.y);
    }
    mulitply(scalar) {
        return new Vector(this.x * scalar, this.y * scalar);
    }
    divide(scalar) {
        return new Vector(this.x / scalar, this.y / scalar);
    }
    normalize(magnitude = 1) {
        return this.magnitude() == 0
            ? new Vector(0, 0)
            : this.mulitply(magnitude / this.magnitude());
    }
    limit(limit) {
        return this.magnitude() > limit ? this.normalize(limit) : this;
    }
}
function vector(x, y) {
    return new Vector(x, y);
}
class Boid {
    x = width * Math.random();
    y = height * Math.random();
    angle = Math.random() * Math.PI * 2;
    draw = () => {
        ctx.save();
        ctx.beginPath();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.moveTo(10, 0);
        ctx.lineTo(-5, 5);
        ctx.lineTo(-5, -5);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    };
    update = (boids) => {
        // teleport if out of bounds
        this.x < 0 && (this.x = width);
        this.y < 0 && (this.y = height);
        this.x > width && (this.x = 0);
        this.y > height && (this.y = 0);
        // velocity and position
        let velocity = vector(Math.cos(this.angle), Math.sin(this.angle)).normalize(speed);
        let position = vector(this.x, this.y);
        let acceleration = vector(0, 0);
        // find the closest boids (that is not self)
        const closestBoids = [];
        boids.forEach((boid) => {
            const distance = vector(boid.x, boid.y)
                .subtract(position)
                .magnitude();
            if (distance < viewRadius && distance != 0) {
                closestBoids.push(boid);
            }
        });
        // seperation
        let seperation = vector(0, 0);
        let count = 0;
        closestBoids.forEach((boid) => {
            let difference = position.subtract(vector(boid.x, boid.y));
            const distance = difference.magnitude();
            difference = difference.normalize();
            difference = difference.divide(distance);
            seperation = seperation.add(difference);
            count++;
        });
        if (count > 0) {
            seperation = seperation.divide(count);
            seperation = seperation.normalize(speed);
            seperation = seperation.subtract(velocity);
            seperation = seperation.limit(turningForce);
        }
        else {
            seperation = vector(0, 0);
        }
        // alignment
        let alignment = vector(0, 0);
        count = 0;
        closestBoids.forEach((boid) => {
            alignment = alignment.add(vector(Math.cos(boid.angle), Math.sin(boid.angle)).normalize(speed));
            count++;
        });
        if (count > 0) {
            alignment = alignment.divide(count);
            alignment = alignment.normalize(speed);
            alignment = alignment.subtract(velocity);
            alignment = alignment.limit(turningForce);
        }
        else {
            alignment = vector(0, 0);
        }
        // cohesion
        let cohesion = vector(0, 0);
        count = 0;
        closestBoids.forEach((boid) => {
            cohesion = cohesion.add(vector(boid.x, boid.y));
            count++;
        });
        if (count > 0) {
            cohesion = cohesion.divide(count);
            cohesion = cohesion.subtract(position);
            cohesion = cohesion.normalize(speed);
            cohesion = cohesion.subtract(velocity);
            cohesion = cohesion.limit(turningForce);
        }
        else {
            cohesion = vector(0, 0);
        }
        // add all the forces together
        acceleration = acceleration.add(seperation.mulitply(seperationForce));
        acceleration = acceleration.add(alignment.mulitply(alignmentForce));
        acceleration = acceleration.add(cohesion.mulitply(cohesionForce));
        // move and turn the boid
        velocity = velocity.add(acceleration);
        velocity = velocity.normalize(speed);
        position = position.add(velocity);
        this.x = position.x;
        this.y = position.y;
        this.angle = Math.atan2(velocity.y, velocity.x);
    };
}
const canvas = $('#boids');
const scale = 1.5;
let width = (canvas.width = document.body.clientWidth * scale);
let height = (canvas.height = document.body.clientHeight * scale);
canvas.style.width = (width / scale) + 'px';
canvas.style.height = (height / scale) + 'px';
window.onresize = () => {
    width = (canvas.width = document.body.clientWidth * scale);
    height = (canvas.height = document.body.clientHeight * scale);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;
};
const ctx = canvas.getContext('2d');
ctx.strokeStyle = 'white';
ctx.lineWidth = 1;
let density = $('#boid-density').value = 20000;
let speed = $('#boid-speed').value = 3;
let viewRadius = $('#boid-view').value = 100;
let turningForce = 0.5;
let seperationForce = $('#boid-seperation').value = 1.5;
let alignmentForce = $('#boid-alignment').value = 1;
let cohesionForce = $('#boid-cohesion').value = 1;
let boids = [];
const draw = (number) => {
    for (let i = 0; i < number; i++) {
        const boid = new Boid();
        boids.push(boid);
        boid.draw();
    }
};
const update = () => {
    ctx.clearRect(0, 0, width, height);
    boids.forEach((boid) => {
        boid.update(boids);
        boid.draw();
    });
};
draw(Math.round(width * height / density));
setInterval(update, 1000 / 60);
// user input
$('#boid-density').onchange = () => {
    density = $('#boid-density').value;
    boids = [];
    draw(Math.round(width * height / density));
};
$('#boid-speed').oninput = () => {
    speed = $('#boid-speed').value;
};
$('#boid-view').oninput = () => {
    viewRadius = $('#boid-view').value;
};
$('#boid-seperation').oninput = () => {
    seperationForce = $('#boid-seperation').value;
};
$('#boid-alignment').oninput = () => {
    alignmentForce = $('#alignment-seperation').value;
};
$('#boid-cohesion').oninput = () => {
    cohesionForce = $('#boid-cohesion').value;
};
$('#boid-reset').onclick = () => {
    boids = [];
    draw(Math.round(width * height / density));
};
$('#restart').onclick = () => {
    window.location.reload();
};
// /\__/\
// (=o.o=)
// |/--\|
// (")-(")
