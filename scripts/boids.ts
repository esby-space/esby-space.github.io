type vector = [number, number];

interface Vector {
    angle(vector: vector): number;
    toVector(angle: number): vector;
    magnitude(vector: vector): number;
    add(vectors: vector[]): vector;
    average(vectors: vector[]): vector;
    normalize(vector: vector, magnitude?: number): vector;
}

const Vector: Vector = {
    angle: function (vector: vector): number {
        return Math.atan2(vector[1], vector[0]);
    },

    toVector: function (angle: number): vector {
        return [Math.cos(angle), Math.sin(angle)];
    },

    magnitude: function (vector: number[]): number {
        return Math.sqrt(vector[0] ** 2 + vector[1] ** 2);
    },

    add: function (vectors: vector[]): vector {
        return vectors.reduce(
            (added: vector, vector: vector): vector => {
                return [added[0] + vector[0], added[1] + vector[1]];
            },
            [0, 0]
        );
    },

    average: function (vectors: vector[]): vector {
        let averagedVector = Vector.add(vectors);
        averagedVector[0] /= averagedVector.length;
        averagedVector[1] /= averagedVector.length;
        return averagedVector;
    },

    normalize: function (vector: vector, magnitude: number = 1): vector {
        return [
            (vector[0] * magnitude) / Vector.magnitude(vector),
            (vector[1] * magnitude) / Vector.magnitude(vector),
        ];
    },
};

const canvas = document.createElement('canvas');
const width = document.body.clientWidth;
const height = document.body.clientHeight;

canvas.width = width;
canvas.height = height;
canvas.style.width = width + 'px';
canvas.style.height = height + 'px';
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d')!;
ctx.lineWidth = 1;
ctx.strokeStyle = 'hsl(0, 0%, 90%)';
ctx.fillStyle = 'hsl(0, 0%, 10%)';
ctx.fillRect(0, 0, canvas.width, canvas.height);

const numBoids = 100;
const boidRange = 100;
const speed = 3;
const boids: Boid[] = [];

const showLines = false;
const showCirlce = false;

class Boid {
    x = Math.random() * width;
    y = Math.random() * height;
    angle = Math.random() * Math.PI * 2;

    closestBoid = (boids: Boid[], range: number): Boid | null => {
        let closestBoid: Boid = boids[0];
        let shortestDistance = Infinity;
        boids.forEach((boid) => {
            if (boid == this) {
                return;
            }
            const distance = Vector.magnitude([
                boid.x - this.x,
                boid.y - this.y,
            ]);
            if (distance < shortestDistance) {
                shortestDistance = distance;
                closestBoid = boid;
            }
        });
        if (shortestDistance > range) { return null };
        return closestBoid;
    };

    closeBoids = (boids: Boid[], range: number): Boid[] => {
        const closeBoids = boids.filter((boid) => {
            if (boid == this) {
                return false;
            }
            return Vector.magnitude([boid.x - this.x, boid.y - this.y]) < range;
        });
        return closeBoids;
    };

    draw = (): void => {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.beginPath();
        ctx.moveTo(10, 0);
        ctx.lineTo(-5, 5);
        ctx.lineTo(-5, -5);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
    };

    update = (): void => {
        // teleport the boid if it goes off-screen
        if (this.x > width) {
            this.x = 0;
        }
        if (this.y > height) {
            this.y = 0;
        }
        if (this.x < 0) {
            this.x = width;
        }
        if (this.y < 0) {
            this.y = height;
        }

        // move the boid forward
        this.x += Math.cos(this.angle) * speed;
        this.y += Math.sin(this.angle) * speed;

        // determining new direction
        const closeBoids = this.closeBoids(boids, boidRange);
        const closestBoid = this.closestBoid(boids, boidRange);
        let turnVector = Vector.toVector(this.angle);

        // Separation
        if (closestBoid) {
            let seperationVector: vector = [
                this.x - closestBoid.x,
                this.y - closestBoid.y,
            ];

            turnVector = Vector.normalize(turnVector, 0.9);
            seperationVector = Vector.normalize(seperationVector, 0.1);
            turnVector = Vector.add([turnVector, seperationVector]);
        }

        // Alignment
        if (closeBoids.length > 0) {
            let alignmentVector: vector = [0, 0];
            closeBoids.forEach((boid) => {
                if (boid == this) {
                    return;
                }
                alignmentVector = Vector.add([
                    alignmentVector,
                    Vector.toVector(boid.angle),
                ]);
            });

            turnVector = Vector.normalize(turnVector, 0.9);
            alignmentVector = Vector.normalize(alignmentVector, 0.1);
            turnVector = Vector.add([turnVector, alignmentVector]);
        }

        // Cohesion
        if (closeBoids.length > 0) {
            let boidVector: vector[] = [];
            closeBoids.forEach((boid) => {
                boidVector.push([boid.x, boid.y]);
            });
            let cohesionVector = Vector.average(boidVector);
            console.log(cohesionVector);
            
            cohesionVector = [cohesionVector[0] - this.x, cohesionVector[1] - this.y];
            turnVector = Vector.normalize(turnVector, 0.9);
            cohesionVector = Vector.normalize(cohesionVector, 0.1);
            turnVector = Vector.add([turnVector, cohesionVector]);
        }


        this.angle = Vector.angle(turnVector);

        // line between close boids
        if (showLines) {
            closeBoids.forEach((boid) => {
                ctx.save();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(boid.x, boid.y);
                ctx.closePath();
                ctx.stroke();
                ctx.restore();
            });
        }

        // circles of closeness
        if (showCirlce) {
            ctx.save();
            ctx.moveTo(this.x + boidRange, this.y);
            ctx.arc(this.x, this.y, boidRange, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.stroke();
            ctx.restore();
        }
    };
}

const draw = (numBoids: number): void => {
    for (let i = 0; i < numBoids; i++) {
        const boid = new Boid();
        boids.push(boid);
        boid.draw();
    }
};

const update = (): void => {
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    boids.forEach((boid) => {
        boid.update();
        boid.draw();
    });
};

draw(numBoids);
setInterval(update, 1000 / 60);
