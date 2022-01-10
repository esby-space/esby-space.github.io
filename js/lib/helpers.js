"use strict";
// cause canvases are annoying
const createCanvas = (width, height) => {
    const canvas = document.createElement('canvas');
    canvas.width = width * 2;
    canvas.height = height * 2;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    return canvas;
};
const createSimulation = (container) => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    const canvas = createCanvas(width, height);
    container.append(canvas);
    return canvas;
};
// mathy stuff
Math.TAU = Math.PI * 2;
Math.randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};
Math.pythag = (x, y) => {
    return Math.sqrt(x ** 2 + y ** 2);
};
class Vector {
    x;
    y;
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    get magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
    toAngle() {
        return Math.atan2(this.y, this.x);
    }
    add(vector) {
        return new Vector(this.x + vector.x, this.y + vector.y);
    }
    subtract(vector) {
        return new Vector(this.x - vector.x, this.y - vector.y);
    }
    multiply(scalar) {
        return new Vector(this.x * scalar, this.y * scalar);
    }
    divide(scalar) {
        return new Vector(this.x / scalar, this.y / scalar);
    }
    normalize(magnitude = 1) {
        return this.magnitude == 0
            ? new Vector()
            : this.multiply(magnitude / this.magnitude);
    }
    min(min = 1) {
        return this.magnitude < min ? this.normalize(min) : this;
    }
    max(max = 1) {
        return this.magnitude > max ? this.normalize(max) : this;
    }
    clamp(min, max) {
        if (this.magnitude > max)
            return this.normalize(max);
        if (this.magnitude < min)
            return this.normalize(min);
        return this;
    }
    static average(...vectors) {
        const count = vectors.length;
        if (count == 0)
            return new Vector();
        const total = vectors.reduce((acc, cur) => acc.add(cur));
        return total.divide(count);
    }
}
Number.prototype.toVector = function () {
    return new Vector(Math.cos(this), Math.sin(this));
};
// /\__/\
// (=o.o=)
// |/--\|
// (")-(")
