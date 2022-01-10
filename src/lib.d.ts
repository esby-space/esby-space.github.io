declare interface Math {
    TAU: number;
    pythag(x: number, y: number): number;
    randomInt(min: number, max: number);
}

declare interface Number {
    toVector(): Vector;
}
