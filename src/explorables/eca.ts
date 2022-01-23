const ECA = () => {
    let rule = 30;
    const rows = 100;
    const columns = 100;

    const main = () => {
        const container = document.createElement('div');
        container.id = 'eca-container';
        document.body.append(container);

        const grid = createGrid(rows, columns);
        paintGrid(grid, container);

        container.onclick = () => {
            updateGrid(grid, rule);
        };
    };

    class Cell {
        x: number;
        y: number;
        alive: boolean;
        element: HTMLDivElement;

        constructor(x: number, y: number, grid: Cell[][], alive = false) {
            this.x = x;
            this.y = y;
            this.alive = alive;
            this.element = this.createElement(grid);
        }

        private getState(grid: Cell[][]) {
            if (grid[this.y - 1] === undefined) return '000';
            const l = grid[this.y - 1][this.x - 1]?.alive ? '1' : '0';
            const m = grid[this.y - 1][this.x]?.alive ? '1' : '0';
            const r = grid[this.y - 1][this.x + 1]?.alive ? '1' : '0';
            return l + m + r;
        }

        private setClassName(grid: Cell[][], element: HTMLDivElement) {
            element.className = 'eca-cell';
            element.classList.add(
                this.alive ? 'alive' : 'dead',
                this.getState(grid)
            );
        }

        private createElement(grid: Cell[][]) {
            const cell = document.createElement('div');
            this.setClassName(grid, cell);

            cell.onclick = () => {
                if (this.alive) {
                    cell.classList.remove('alive');
                    cell.classList.add('dead');
                } else {
                    cell.classList.add('alive');
                    cell.classList.remove('dead');
                }

                if (this.y != 0) rule += 2 ** parseInt(this.getState(grid), 2);

                this.alive = !this.alive;
            };

            return cell;
        }

        update(grid: Cell[][], rule: number) {
            if (this.y != 0)
                this.alive = translateRule(rule).includes(this.getState(grid));
            this.setClassName(grid, this.element);
        }
    }

    const translateRule = (rule: number) => {
        const binary = rule.toString(2).padStart(8, '0');
        let rules: string[] = [];
        for (let i = 0; i < binary.length; i++) {
            if (binary[binary.length - 1 - i] == '1') {
                const binary = i.toString(2).padStart(3, '0');
                rules = [...rules, binary];
            }
        }
        return rules;
    };

    const createGrid = (rows: number, columns: number) => {
        const grid: Cell[][] = [];
        for (let y = 0; y < rows; y++) {
            grid[y] = [];
            for (let x = 0; x < columns; x++) {
                grid[y][x] = new Cell(x, y, grid);
            }
        }
        return grid;
    };

    const paintGrid = (grid: Cell[][], container: HTMLDivElement) => {
        for (let y = 0; y < grid.length; y++) {
            const row = document.createElement('div');
            row.classList.add('eca-row');
            container.append(row);
            for (let x = 0; x < grid[y].length; x++) {
                row.append(grid[y][x].element);
            }
        }
    };

    const updateGrid = (grid: Cell[][], rule: number) => {
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < columns; x++) {
                grid[y][x].update(grid, rule);
            }
        }
    };

    main();
};

window.addEventListener('load', ECA);
