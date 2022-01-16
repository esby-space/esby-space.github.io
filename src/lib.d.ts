declare interface Math {
    TAU: number;
    pythag(x: number, y: number): number;
    distance(x1: number, y1: number, x2: number, y2: number): number;
    randomInt(min: number, max: number): number;
}

declare interface Number {
    toVector(): Vector;
}

declare interface CanvasRenderingContext2D {
    clear(canvas: HTMLCanvasElement): void;
    fillSquare(x: number, y: number, tileSize: number): void;
}
