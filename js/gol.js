"use strict";
document.write(`
    <div>
    <label for="gol-row"><b>number of rows:</b></label>
    <input autocomplete="off" id="gol-row" type="number" />
    <label for="gol-column"><b>number of columns:</b></label>
    <input autocomplete="off" id="gol-column" type="number" /><br />
    <button id="gol-generate">generate next</button>
    <button id="gol-auto">auto generate</button>
    <button class="boxy-button">boxy mode</button>
    </div>
    <div id="gol-cells" class="cells"></div>
`);
const GOL = {
    rows: 30,
    columns: 30,
    cells: [],
    makeCells: function (selector) {
        selector && (this.selector = selector);
        this.cells = [];
        for (let i = 0; i < this.rows; i++) {
            this.cells[i] = [];
            for (let j = 0; j < this.columns; j++) {
                const cell = document.createElement('div');
                cell.classList.add('cell', 'dead');
                this.cells[i][j] = cell;
                cell.onmousedown = (event) => {
                    event.preventDefault();
                    Cells.toggle(cell);
                };
                cell.onmouseenter = () => {
                    cell.classList.add('select');
                    if (Mouse.pressed) {
                        Cells.toggle(cell);
                    }
                };
                cell.onmouseleave = () => {
                    cell.classList.remove('select');
                };
            }
        }
        $(this.selector).innerHTML = '';
        this.cells.forEach((layer) => {
            const row = document.createElement('div');
            row.classList.add('cell-row');
            layer.forEach((cell) => {
                row.appendChild(cell);
            });
            $(this.selector).appendChild(row);
        });
    },
    generate: function () {
        let aliveCells = [];
        let deadCells = [];
        this.cells.forEach((layer, i) => {
            layer.forEach((cell, j) => {
                let count = 0;
                for (let ii = -1; ii <= 1; ii++) {
                    for (let jj = -1; jj <= 1; jj++) {
                        if (ii == 0 && jj == 0)
                            continue;
                        // counting the number of cells that are alive
                        this.cells[i + ii] &&
                            this.cells[i + ii][j + jj] &&
                            this.cells[i + ii][j + jj].classList.contains('alive') &&
                            count++;
                    }
                }
                // the three rules
                cell.classList.contains('dead') &&
                    count == 3 &&
                    aliveCells.push(cell);
                cell.classList.contains('alive') &&
                    count > 3 &&
                    deadCells.push(cell);
                cell.classList.contains('alive') &&
                    count < 2 &&
                    deadCells.push(cell);
            });
        });
        aliveCells.forEach((cell) => {
            Cells.alive(cell);
        });
        deadCells.forEach((cell) => {
            Cells.kill(cell);
        });
    },
    // TODO: allow user to customize rule
};
GOL.makeCells('#gol-cells');
// gol user input
$('#gol-row').value = GOL.rows;
$('#gol-column').value = GOL.columns;
$('#gol-generate').onclick = () => {
    GOL.generate();
};
let generate = false;
let interval;
$('#gol-auto').onclick = () => {
    generate
        ? clearInterval(interval)
        : (interval = setInterval(GOL.generate.bind(GOL), 150));
    $('#gol-auto').innerHTML = generate ? 'auto generate' : 'stop';
    generate = !generate;
};
$('#gol-row').onchange = () => {
    GOL.rows = parseInt($('#gol-row').value);
    GOL.makeCells();
};
$('#gol-column').onchange = () => {
    GOL.columns = parseInt($('#gol-column').value);
    GOL.makeCells();
};
let boxy = false;
$all('.boxy-button').forEach((button) => {
    button.onclick = () => {
        $('#cell-style').setAttribute('href', boxy ? '' : '../styles/boxy.css');
        $all('.boxy-button').forEach((button) => {
            button.innerHTML = boxy ? 'boxy mode' : 'no boxy';
        });
        boxy = !boxy;
    };
});
// /\__/\
// (=o.o=)
// |/--\|
// (")-(")
