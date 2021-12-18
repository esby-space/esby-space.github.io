"use strict";
document.write(`
    <link rel="stylesheet" href="../styles/boids.css" />
    <div id="clicky-stuff">
        <nav>
            <span class="material-icons" id="boid-more">chevron_right</span>
            <span class="material-icons" id="boid-home">home</span>
            <span class="material-icons" id="boid-full">open_in_full</span>
        </nav>

        <section id="boid-sidebar">
            <h2>boids!</h2>

            <h3>boid settings</h3>
            <div id="boid-form">
                <label for="boid-scale">view scale</label>
                <input type="number" id="boid-scale" />
                <label for="boid-density">density of boids</label>
                <input type="number" id="boid-density" />
                <label for="boid-speed">boids' speed</label>
                <input type="number" id="boid-speed" />
                <label for="boid-view">boids' view range</label>
                <input type="number" id="boid-view" />
                <label for="boid-seperation">seperation factor</label>
                <input type="number" id="boid-seperation" />
                <label for="boid-alignment">alignment factor</label>
                <input type="number" id="boid-alignment" />
                <label for="boid-cohesion">cohesion factor</label>
                <input type="number" id="boid-cohesion" />
            </div>
            <button id="boid-reset">reset boids</button>
            <button id="restart">reset all</button>

            <h3>credits &#x3c;3</h3>
            <ul>
                <li>
                    <a href="https://www.red3d.com/cwr/papers/1987/SIGGRAPH87.pdf">the original paper</a>
                    by Craig Reynolds
                </li>
                <li>
                    <a href="https://www.youtube.com/watch?v=4LWmRuB-uNU">smarter everyday's video</a>
                    on birds!
                </li>
                <li>
                    <a href="https://explorabl.es/">
                        explorable explanations</a>
                    by Nicky Case
                </li>
                <li>
                    <a href="https://www.youtube.com/watch?v=mhjuuHl6qHM">coding train tutorial</a>
                    by Daniel Shiffman
                </li>
                <li>
                    <a href="https://www.youtube.com/watch?v=bqtqltqcQhw">sebastian lague's</a>
                    implementation
                </li>
            </ul>

            <h3><span style="text-decoration: line-through;">bugs</span> features!</h3>
            <ul>
                <li>
                    please do not feed the boidsthey can get angry
                </li>
            </ul>
        </section>
    </div>

    <canvas id="boid-simulation"></canvas>
`);
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
    x = Boids.width * Math.random();
    y = Boids.height * Math.random();
    angle = Math.random() * Math.PI * 2;
    draw = () => {
        Boids.ctx.save();
        Boids.ctx.beginPath();
        Boids.ctx.translate(this.x, this.y);
        Boids.ctx.rotate(this.angle);
        Boids.ctx.moveTo(10, 0);
        Boids.ctx.lineTo(-5, 5);
        Boids.ctx.lineTo(-5, -5);
        Boids.ctx.closePath();
        Boids.ctx.stroke();
        Boids.ctx.restore();
    };
    update = (boids) => {
        // teleport if out of bounds
        this.x < 0 && (this.x = Boids.width);
        this.y < 0 && (this.y = Boids.height);
        this.x > Boids.width && (this.x = 0);
        this.y > Boids.height && (this.y = 0);
        // velocity and position
        let velocity = vector(Math.cos(this.angle), Math.sin(this.angle)).normalize(Boids.speed);
        let position = vector(this.x, this.y);
        let acceleration = vector(0, 0);
        // find the closest boids (that is not self)
        const closestBoids = [];
        boids.forEach((boid) => {
            const distance = vector(boid.x, boid.y)
                .subtract(position)
                .magnitude();
            if (distance < Boids.viewRadius && distance != 0) {
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
            seperation = seperation.normalize(Boids.speed);
            seperation = seperation.subtract(velocity);
            seperation = seperation.limit(Boids.turningForce);
        }
        else {
            seperation = vector(0, 0);
        }
        // alignment
        let alignment = vector(0, 0);
        count = 0;
        closestBoids.forEach((boid) => {
            alignment = alignment.add(vector(Math.cos(boid.angle), Math.sin(boid.angle)).normalize(Boids.speed));
            count++;
        });
        if (count > 0) {
            alignment = alignment.divide(count);
            alignment = alignment.normalize(Boids.speed);
            alignment = alignment.subtract(velocity);
            alignment = alignment.limit(Boids.turningForce);
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
            cohesion = cohesion.normalize(Boids.speed);
            cohesion = cohesion.subtract(velocity);
            cohesion = cohesion.limit(Boids.turningForce);
        }
        else {
            cohesion = vector(0, 0);
        }
        // add all the forces together
        acceleration = acceleration.add(seperation.mulitply(Boids.seperationForce));
        acceleration = acceleration.add(alignment.mulitply(Boids.alignmentForce));
        acceleration = acceleration.add(cohesion.mulitply(Boids.cohesionForce));
        // move and turn the boid
        velocity = velocity.add(acceleration);
        velocity = velocity.normalize(Boids.speed);
        position = position.add(velocity);
        this.x = position.x;
        this.y = position.y;
        this.angle = Math.atan2(velocity.y, velocity.x);
    };
}
const Boids = {
    container: $('#boids'),
    canvas: $('#boid-simulation'),
    ctx: $('#boid-simulation').getContext('2d'),
    scale: 1.5,
    width: 0,
    height: 0,
    sizeCanvas: () => {
        Boids.width = Boids.canvas.width =
            Boids.container.clientWidth * Boids.scale;
        Boids.height = Boids.canvas.height =
            Boids.container.clientHeight * Boids.scale;
        Boids.canvas.style.width = Boids.width / Boids.scale + 'px';
        Boids.canvas.style.height = Boids.height / Boids.scale + 'px';
        Boids.ctx.strokeStyle = 'white';
        Boids.ctx.lineWidth = 1;
    },
    density: 20000,
    speed: 3,
    viewRadius: 100,
    turningForce: 0.5,
    seperationForce: 1.5,
    alignmentForce: 1,
    cohesionForce: 1,
    boids: [],
    draw: (number) => {
        for (let i = 0; i < number; i++) {
            const boid = new Boid();
            Boids.boids.push(boid);
            boid.draw();
        }
    },
    update: () => {
        Boids.ctx.clearRect(0, 0, Boids.width, Boids.height);
        Boids.boids.forEach((boid) => {
            boid.update(Boids.boids);
            boid.draw();
        });
    },
    init: () => {
        // resize and scaling
        window.addEventListener('resize', Boids.sizeCanvas);
        Boids.sizeCanvas();
        // start!
        Boids.draw(Math.round((Boids.width * Boids.height) / Boids.density));
        setInterval(Boids.update, 1000 / 60);
        // sidebar functionality
        $('#boid-scale').onchange = () => {
            Boids.scale = $('#boid-scale').value;
            Boids.sizeCanvas();
            Boids.boids = [];
            Boids.draw(Math.round((Boids.width * Boids.height) / Boids.density));
        };
        $('#boid-density').onchange = () => {
            Boids.density = $('#boid-density').value;
            Boids.boids = [];
            Boids.draw(Math.round((Boids.width * Boids.height) / Boids.density));
        };
        $('#boid-speed').oninput = () => {
            Boids.speed = $('#boid-speed').value;
        };
        $('#boid-view').oninput = () => {
            Boids.viewRadius = $('#boid-view').value;
        };
        $('#boid-seperation').oninput = () => {
            Boids.seperationForce = $('#boid-seperation').value;
        };
        $('#boid-alignment').oninput = () => {
            Boids.alignmentForce = $('#alignment-seperation').value;
        };
        $('#boid-cohesion').oninput = () => {
            Boids.cohesionForce = $('#boid-cohesion').value;
        };
        $('#boid-reset').onclick = () => {
            Boids.boids = [];
            Boids.draw(Math.round((Boids.width * Boids.height) / Boids.density));
        };
        $('#restart').onclick = () => {
            window.location.reload();
        };
        let isOpen = false;
        $('#boid-more').onclick = () => {
            $('#boid-sidebar').style.width = isOpen ? '0px' : '400px';
            $('#boid-sidebar').style['padding-inline'] = isOpen
                ? '0px'
                : '1rem';
            $('#boid-more').style.transform = isOpen
                ? 'rotate(0deg)'
                : 'rotate(180deg)';
            isOpen = !isOpen;
        };
        $('#boid-home').onclick = () => {
            window.location.href = 'projects.html#boids';
        };
        $('#boid-full').onclick = () => {
            window.location.href = 'boids.html';
        };
    },
};
window.addEventListener('load', Boids.init);
// /\__/\
// (=o.o=)
// |/--\|
// (")-(")
