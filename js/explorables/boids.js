"use strict";
document.write(`
    <link rel="stylesheet" href="../styles/boids.css" />
    <div id="boid-side-container">
    <nav id="boid-navbar">
        <span class="material-icons" id="boid-more">chevron_right</span>
        <span class="material-icons" id="boid-home">home</span>
        <span class="material-icons" id="boid-full">open_in_full</span>
    </nav>

    <section>
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
            <label for="boid-interactions">draw lines to neighbors:</label>
            <input type="checkbox" id="boid-interactions"/>
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
    update = () => {
        // teleport if out of bounds
        this.x < 0 && (this.x = Boids.width);
        this.y < 0 && (this.y = Boids.height);
        this.x > Boids.width && (this.x = 0);
        this.y > Boids.height && (this.y = 0);
        // velocity and position
        let velocity = new Vector(Math.cos(this.angle), Math.sin(this.angle)).normalize(Boids.speed);
        let position = new Vector(this.x, this.y);
        let acceleration = new Vector(0, 0);
        // find the closest boids (that is not self)
        const closestBoids = [];
        Boids.boids.forEach((boid) => {
            const distance = new Vector(boid.x, boid.y)
                .subtract(position)
                .magnitude;
            if (distance < Boids.viewRadius && distance != 0) {
                closestBoids.push(boid);
                if (Boids.drawInteractions) {
                    Boids.ctx.moveTo(this.x, this.y);
                    Boids.ctx.lineTo(boid.x, boid.y);
                    Boids.ctx.strokeStyle = 'white';
                    Boids.ctx.stroke();
                }
            }
        });
        // seperation
        let seperation = new Vector(0, 0);
        let count = 0;
        closestBoids.forEach((boid) => {
            let difference = position.subtract(new Vector(boid.x, boid.y));
            const distance = difference.magnitude;
            difference = difference.normalize();
            difference = difference.divide(distance);
            seperation = seperation.add(difference);
            count++;
        });
        if (count > 0) {
            seperation = seperation.divide(count);
            seperation = seperation.normalize(Boids.speed);
            seperation = seperation.subtract(velocity);
            seperation = seperation.max(Boids.turningForce);
        }
        else {
            seperation = new Vector(0, 0);
        }
        // alignment
        let alignment = new Vector(0, 0);
        count = 0;
        closestBoids.forEach((boid) => {
            alignment = alignment.add(new Vector(Math.cos(boid.angle), Math.sin(boid.angle)).normalize(Boids.speed));
            count++;
        });
        if (count > 0) {
            alignment = alignment.divide(count);
            alignment = alignment.normalize(Boids.speed);
            alignment = alignment.subtract(velocity);
            alignment = alignment.max(Boids.turningForce);
        }
        else {
            alignment = new Vector(0, 0);
        }
        // cohesion
        let cohesion = new Vector(0, 0);
        count = 0;
        closestBoids.forEach((boid) => {
            cohesion = cohesion.add(new Vector(boid.x, boid.y));
            count++;
        });
        if (count > 0) {
            cohesion = cohesion.divide(count);
            cohesion = cohesion.subtract(position);
            cohesion = cohesion.normalize(Boids.speed);
            cohesion = cohesion.subtract(velocity);
            cohesion = cohesion.max(Boids.turningForce);
        }
        else {
            cohesion = new Vector(0, 0);
        }
        // add all the forces together
        acceleration = acceleration.add(seperation.multiply(Boids.seperationForce));
        acceleration = acceleration.add(alignment.multiply(Boids.alignmentForce));
        acceleration = acceleration.add(cohesion.multiply(Boids.cohesionForce));
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
    container: $('#boid'),
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
    drawInteractions: false,
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
            boid.update();
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
        // fill in buttons
        $('#boid-scale').value = Boids.scale;
        $('#boid-density').value = Boids.density;
        $('#boid-speed').value = Boids.speed;
        $('#boid-view').value = Boids.viewRadius;
        $('#boid-seperation').value = Boids.seperationForce;
        $('#boid-alignment').value = Boids.alignmentForce;
        $('#boid-cohesion').value = Boids.cohesionForce;
        $('#boid-interactions').checked = Boids.drawInteractions;
        // // sidebar functionality
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
        $('#boid-interactions').onchange = () => {
            Boids.drawInteractions = $('#boid-interactions').checked;
        };
        $('#restart').onclick = () => {
            window.location.reload();
        };
        let isOpen = false;
        $('#boid-more').onclick = () => {
            $('#boid section').style.transform = isOpen
                ? 'translateX(-100%)'
                : 'translateX(0%)';
            $('#boid-more').style.transform = isOpen
                ? 'rotate(0deg)'
                : 'rotate(180deg)';
            isOpen = !isOpen;
        };
        $('#boid-home').onclick = () => {
            window.location.href = 'projects.html#boid';
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
