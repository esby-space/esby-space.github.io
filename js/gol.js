"use strict";
const GOL = (tileSize, fps) => {
    const main = () => {
        const container = $('#gol');
        const canvas = document.createSimulation(container);
        const rows = Math.ceil(canvas.height / tileSize);
        const columns = Math.ceil(canvas.width / tileSize);
        const grid = createGrid(rows, columns);
        setInterval(update, 1000 / fps, grid);
        setInterval(draw, 1000 / fps, grid, canvas);
    };
    const update = (grid) => {
        // make a deep copy of the grid
        const nextGrid = JSON.parse(JSON.stringify(grid));
        for (let y = 0; y < nextGrid.length; y++) {
            for (let x = 0; x < nextGrid[y].length; x++) {
                // rules of conway's game of life
                const neighbors = countNeighbors(grid, y, x);
                if (neighbors < 2 || neighbors > 3)
                    nextGrid[y][x] = 0;
                if (neighbors == 3)
                    nextGrid[y][x] = 1;
            }
        }
        // sync nextGrid and current grid to update
        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[y].length; x++) {
                grid[y][x] = nextGrid[y][x];
            }
        }
    };
    const countNeighbors = (grid, row, column) => {
        let count = 0;
        for (let y = -1; y <= 1; y++) {
            for (let x = -1; x <= 1; x++) {
                if (x == 0 && y == 0)
                    continue;
                if (!grid[y + row] || !grid[y + row][x + column])
                    continue;
                if (grid[y + row][x + column] == 1)
                    count++;
            }
        }
        return count;
    };
    const draw = (grid, canvas) => {
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[y].length; x++) {
                if (grid[y][x] == 1) {
                    context.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
                }
            }
        }
        // if the mouse is down, randomize cells under it
        if (Mouse.pressed && Mouse.target == canvas) {
            mouseRandomize(grid, 100);
        }
    };
    const mouseRandomize = (grid, radius) => {
        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[y].length; x++) {
                const dx = Mouse.x - x * tileSize;
                const dy = Mouse.y - y * tileSize;
                if (Math.pythag(dx, dy) < radius) {
                    grid[y][x] = Math.randomInt(0, 1);
                }
            }
        }
    };
    const createGrid = (rows, columns) => {
        // create a grid of random 1s and 0s
        const grid = [];
        for (let y = 0; y < rows; y++) {
            const row = [];
            for (let x = 0; x < columns; x++) {
                row[x] = Math.randomInt(0, 1);
            }
            grid[y] = row;
        }
        return grid;
    };
    main();
};
window.addEventListener('load', () => GOL(10, 60));
// /\__/\
// (=o.o=)
// |/--\|
// (")-(")
