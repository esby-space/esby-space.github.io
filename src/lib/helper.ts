// love math
Math.TAU = Math.PI * 2;

Math.randomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

Math.pythag = (x: number, y: number) => {
    return Math.sqrt(x ** 2 + y ** 2);
};

class Vector {
    x: number;
    y: number;

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    get magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    add(vector: Vector) {
        return new Vector(this.x + vector.x, this.y + vector.y);
    }

    subtract(vector: Vector) {
        return new Vector(this.x - vector.x, this.y - vector.y);
    }

    multiply(scalar: number) {
        return new Vector(this.x * scalar, this.y * scalar);
    }

    divide(scalar: number) {
        return new Vector(this.x / scalar, this.y / scalar);
    }

    normalize(magnitude = 1) {
        return this.magnitude == 0
            ? new Vector()
            : this.multiply(magnitude / this.magnitude);
    }

    mix(vector: Vector, amount = 0.5) {
        const x = (1 - amount) * this.x + amount * vector.x;
        const y = (1 - amount) * this.y + amount * vector.y;
        return new Vector(x, y);
    }

    average(...vectors: Vector[]) {
        const count = vectors.length + 1;
        const total = vectors.reduce((acc, cur) => acc.add(cur)).add(this);
        return total.divide(count);
    }

    min(min = 1) {
        return this.magnitude < min ? this.normalize(min) : this;
    }

    max(max = 1) {
        return this.magnitude > max ? this.normalize(max) : this;
    }

    clamp(min: number, max: number) {
        if (this.magnitude > max) return this.normalize(max);
        if (this.magnitude < min) return this.normalize(min);
        return this;
    }
}

// me being lazy functions
document.createCanvas = (width: number, height: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = width * 2;
    canvas.height = height * 2;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    return canvas;
};

document.createSimulation = (container: HTMLElement) => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    const canvas = document.createCanvas(width, height);
    container.append(canvas);
    return canvas;
};

// you can never escape the worse jquery
const $ = (query: string): any => {
    return document.querySelector(query);
};

const $all = (query: string): any[] => {
    return Array.from(document.querySelectorAll(query));
};

const appendDOM = (
    text: string, DOM: HTMLDivElement,
    config?: { className?: string }
) => {
    const element = document.createElement('div');
    element.innerHTML = text;

    if (config?.className) element.classList.add(config.className);

    DOM.append(element);
    return element;
};

const Mouse = {
    pressed: false,
    target: <EventTarget>document.body,
    x: 0,
    y: 0,
};

document.body.addEventListener('mousedown', (event) => {
    Mouse.pressed = true;
    Mouse.target = event.target!;
});

document.body.addEventListener('mouseup', () => {
    Mouse.pressed = false;
});

document.body.addEventListener('mousemove', (event) => {
    Mouse.x = event.offsetX * 2;
    Mouse.y = event.offsetY * 2;
});

// /\__/\
// (=o.o=)
// |/--\|
// (")-(")
