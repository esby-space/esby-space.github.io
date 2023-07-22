const Grid = {
    width: 0,
    height: 0,
    cells: [[]] as boolean[][],

    init(width: number, height: number) {
        this.width = width;
        this.height = height;

        for (let y = 0; y < this.height; y++) {
            this.cells[y] = [];
            for (let x = 0; x < this.width; x++) {
                this.cells[y][x] = false;
            }
        }
    },

    get(x: number, y: number): boolean {
        if (x < 0 || x > this.width - 1 || y < 0 || y > this.height - 1) return false;
        return this.cells[y][x];
    },

    neighbors(x: number, y: number): number {
        let neighbors = 0;

        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i == 0 && j == 0) continue;
                if (this.get(x + i, y + j)) neighbors += 1;
            }
        }

        return neighbors;
    }
};

export const GOL = {
    grid: Grid,

    init(width: number, height: number) {
        this.grid.init(width, height)
    },

    update() {
        let delta: [number, number][] = [];
        for (let y = 0; y < this.grid.height; y++) {
            for (let x = 0; x < this.grid.width; x++) {
                let alive = this.grid.get(x, y);
                let neighbors = this.grid.neighbors(x, y);

                if (!alive && neighbors == 3) delta.push([x, y]);
                if (alive && (neighbors < 2 || neighbors > 3)) delta.push([x, y]);
            }
        }

        for (let i = 0; i < delta.length; i++) {
            let [x, y] = delta[i];
            this.grid.cells[y][x] = !this.grid.cells[y][x];
        }
    },

    randomize() {
        for (let y = 0; y < this.grid.height; y++) {
            for (let x = 0; x < this.grid.width; x++) {
                this.grid.cells[y][x] = Math.random() > 0.5;
            }
        }
    }
};

