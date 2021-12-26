declare interface Math {
    TAU: number;
    randomInt: (min: number, max: number) => number;
    pythag: (x: number, y: number) => number;
}

declare interface Document {
    createCanvas: (width: number, height: number) => HTMLCanvasElement;
    createSimulation: (container: HTMLElement) => HTMLCanvasElement;
}
