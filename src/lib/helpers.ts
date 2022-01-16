// cause canvases are annoying
const createCanvas = (width: number, height: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = width * 2;
    canvas.height = height * 2;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    return canvas;
};

const createSimulation = (container: HTMLElement) => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    const canvas = createCanvas(width, height);
    container.append(canvas);
    return canvas;
};

CanvasRenderingContext2D.prototype.clear = function (
    canvas: HTMLCanvasElement
) {
    this.clearRect(0, 0, canvas.width, canvas.height);
};

CanvasRenderingContext2D.prototype.fillSquare = function (
    x: number,
    y: number,
    tileSize: number
) {
    this.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
};

// mathy stuff
Math.TAU = Math.PI * 2;

Math.randomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

Math.pythag = (x, y) => {
    return Math.sqrt(x ** 2 + y ** 2);
};

Math.distance = (x1: number, y1: number, x2: number, y2: number) => {
    return Math.pythag(x1 - x2, y1 - y2);
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

    toAngle() {
        return Math.atan2(this.y, this.x);
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

    static average(...vectors: Vector[]) {
        const count = vectors.length;
        if (count == 0) return new Vector();
        const total = vectors.reduce((acc, cur) => acc.add(cur));
        return total.divide(count);
    }
}

Number.prototype.toVector = function (): Vector {
    return new Vector(Math.cos(<number>this), Math.sin(<number>this));
};

// keyboard

const Keyboard = {
    pressed: false,
    key: '',
    action: '',
    mapping: {
        up: ['ArrowUp', 'w'],
        down: ['ArrowDown', 's'],
        left: ['ArrowLeft', 'a'],
        right: ['ArrowRight', 'd'],
    },
};

window.addEventListener('keydown', (event: KeyboardEvent) => {
    Keyboard.pressed = true;
    Keyboard.key = event.key;
    let action: keyof typeof Keyboard.mapping;
    for (action in Keyboard.mapping) {
        if (Keyboard.mapping[action].includes(event.key)) {
            Keyboard.action = action;
        }
    }
});

window.addEventListener('keyup', () => {
    Keyboard.pressed = false;
});

// /\__/\
// (=o.o=)
// |/--\|
// (")-(")
