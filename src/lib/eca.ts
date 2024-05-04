type Cell = {
    alive: boolean;
    state: number;
};

const Grid = {
    width: 0,
    height: 0,
    cells: [[]] as Cell[][],

    init(width: number, height: number) {
        this.width = width;
        this.height = height;

        for (let y = 0; y < this.height; y++) {
            this.cells[y] = [];
            for (let x = 0; x < this.width; x++) {
                this.cells[y][x] = { alive: false, state: 0 };
            }
        }
    },

    get(x: number, y: number): Cell {
        if (x < 0 || x > this.width - 1 || y < 0 || y > this.height - 1)
            return { alive: false, state: 0 };
        return this.cells[y][x];
    },

    state(x: number, y: number): number {
        let state = 0;
        for (let i = 0; i < 3; i++) {
            const offset = -i + 1;
            if (this.get(x + offset, y - 1).alive) {
                state += 2 ** i;
            }
        }

        this.get(x, y).state = state;
        return state;
    },
};

const Rule = {
    states: [] as boolean[],

    init(rule: number) {
        this.states = Array(8).fill(false);
        let binary = rule.toString(2).padStart(8, "0");
        for (let i = 0; i < 8; i++) {
            if (binary[7 - i] == "1") this.states[i] = true;
        }
    },

    check(state: number): boolean {
        if (state < 0 || state > 7) return false;
        return this.states[state];
    },
};

export const ECA = {
    grid: Grid,
    rule: Rule,

    init(width: number, height: number, rule: number) {
        this.grid.init(width, height);
        this.rule.init(rule);
    },

    update() {
        for (let y = 1; y < this.grid.height; y++) {
            for (let x = 0; x < this.grid.width; x++) {
                let state = this.grid.state(x, y);
                let alive = this.rule.check(state);
                this.grid.get(x, y).alive = alive;
            }
        }
    },

    randomize() {
        for (let x = 0; x < ECA.grid.width; x++) {
            this.grid.get(x, 0).alive = Math.random() > 0.5;
        }

        this.update();
    },

    clear() {
        for (let x = 0; x < ECA.grid.width; x++) {
            ECA.grid.get(x, 0).alive = false;
        }

        ECA.update();
    },
};
