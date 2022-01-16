"use strict";
const GOL = () => {
    // simulation parameters
    const tileSize = 10;
    const fps = 60;
    // create canvas
    const canvas = createSimulation(document.body);
    const context = canvas.getContext('2d');
    context.fillStyle = 'white';
    const createGrid = (rows, columns) => {
        const grid = [];
        for (let y = 0; y < rows; y++) {
            grid[y] = [];
            for (let x = 0; x < columns; x++) {
                grid[y][x] = Math.randomInt(0, 1);
            }
        }
        return grid;
    };
    const countNeighbors = (x, y) => {
        let count = 0;
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dy == 0 && dx == 0)
                    continue;
                if (!grid[dy + y] || !grid[dy + y][dx + x])
                    continue;
                if (grid[dy + y][dx + x] == 1)
                    count++;
            }
        }
        return count;
    };
    const rows = Math.ceil(canvas.height / tileSize);
    const columns = Math.ceil(canvas.width / tileSize);
    let grid = createGrid(rows, columns);
    // main loop
    setInterval(() => {
        // draw
        context.clear(canvas);
        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[y].length; x++) {
                if (grid[y][x]) {
                    context.fillRect(tileSize * x, tileSize * y, tileSize, tileSize);
                }
            }
        }
        // update
        const nextGrid = JSON.parse(JSON.stringify(grid));
        for (let y = 0; y < nextGrid.length; y++) {
            for (let x = 0; x < nextGrid[y].length; x++) {
                const neighbors = countNeighbors(x, y);
                // rules for gol
                if (neighbors > 3 || neighbors < 2)
                    nextGrid[y][x] = 0;
                if (neighbors == 3)
                    nextGrid[y][x] = 1;
            }
        }
        // sync
        grid = nextGrid;
    }, 1000 / fps);
};
window.addEventListener('load', GOL);
// /\__/\
// (=o.o=)
// |/--\|
// (")-(")
