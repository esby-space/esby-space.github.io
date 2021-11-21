"use strict";
const Cells = {
    // me being lazy functions
    alive: function (cell) {
        cell.classList.remove('dead');
        cell.classList.add('alive');
    },
    kill: function (cell) {
        cell.classList.remove('alive');
        cell.classList.add('dead');
    },
    toggle: function (cell) {
        cell.classList.toggle('alive');
        cell.classList.toggle('dead');
    },
};
const ECA = {
    rule: 30,
    rows: 30,
    columns: 30,
    color: false,
    cells: [],
    // turn rule into binary, then sums of power of 2
    get ruleArray() {
        const binary = this.rule.toString(2);
        const binaryArray = Array.from(binary).reverse();
        const ruleList = [];
        binaryArray.forEach((x, i) => {
            let digit = parseInt(x);
            digit == 1 && ruleList.push(2 ** i);
        });
        return ruleList;
    },
    // fill 2D array with cells, rows * (3 * columns)
    makeCells: function (selector) {
        selector && (this.selector = selector);
        this.cells = [];
        for (let i = 0; i < this.rows; i++) {
            this.cells[i] = [];
            for (let j = 0; j < 3 * this.columns; j++) {
                // need to *3 so that it doesn't colide into the edge
                const cell = document.createElement('div');
                cell.classList.add('cell', 'dead');
                this.cells[i][j] = cell;
                cell.onmouseenter = cell.onmouseleave = () => {
                    cell.classList.toggle('select');
                };
                cell.onclick =
                    i == 0
                        ? () => {
                            Cells.toggle(cell);
                            this.generate();
                        }
                        : () => {
                            Cells.toggle(cell);
                            const ruleChange = this.cellState(i, j);
                            this.ruleArray.includes(ruleChange)
                                ? (this.rule -= ruleChange)
                                : (this.rule += ruleChange);
                            this.generate();
                            $('#eca-rule').value = this.rule;
                            // bad form, i know
                        };
            }
        }
        // plot cells to the website
        $(this.selector).innerHTML = '';
        this.cells.forEach((layer) => {
            const row = document.createElement('div');
            row.classList.add('cell-row');
            for (let i = layer.length / 3; i < (2 * layer.length) / 3; i++) {
                row.appendChild(layer[i]);
            }
            $(this.selector).appendChild(row);
        });
    },
    // determine the cells above a cell
    cellState: function (row, column) {
        let state = '';
        for (let i = -1; i <= 1; i++) {
            this.cells[row - 1][column + i] &&
                this.cells[row - 1][column + i].classList.contains('alive')
                ? (state += '1')
                : (state += '0');
        }
        return 2 ** parseInt(state, 2);
    },
    // make cells alive or dead, color them
    generate: function () {
        this.cells.forEach((layer, i) => {
            if (i == 0)
                return;
            layer.forEach((cell, j) => {
                const state = this.cellState(i, j);
                let classes = Array.from(cell.classList);
                classes.forEach((cellClass) => {
                    cellClass.includes('color') &&
                        cell.classList.remove(cellClass);
                    return;
                });
                if (this.ruleArray.includes(state)) {
                    Cells.alive(cell);
                    this.color && cell.classList.add(`color-${state}`);
                }
                else {
                    Cells.kill(cell);
                }
            });
        });
    },
};
ECA.makeCells('#eca-cells');
// eca user input
$('#eca-rule').value = ECA.rule;
$('#eca-row').value = ECA.rows;
$('#eca-column').value = ECA.columns;
$('#eca-rule').onchange = () => {
    ECA.rule = parseInt($('#eca-rule').value);
    ECA.generate();
};
$('#eca-random-rule').onclick = () => {
    ECA.rule = Math.floor(Math.random() * 256);
    $('#eca-rule').value = ECA.rule;
    ECA.generate();
};
$('#eca-row').onchange = () => {
    ECA.rows = parseInt($('#eca-row').value);
    ECA.makeCells();
};
$('#eca-column').onchange = () => {
    ECA.columns = parseInt($('#eca-column').value);
    ECA.makeCells();
};
$('#eca-random-first').onclick = () => {
    const length = ECA.cells[0].length;
    for (let i = length / 3; i < (2 * length) / 3; i++) {
        Cells.kill(ECA.cells[0][i]);
        Math.random() > 0.5 && Cells.toggle(ECA.cells[0][i]);
    }
    ECA.generate();
};
$('#eca-clear-first').onclick = () => {
    ECA.cells[0].forEach((cell) => {
        Cells.kill(cell);
    });
    ECA.generate();
};
$('#eca-color').onclick = () => {
    ECA.color = !ECA.color;
    $('#eca-color').innerHTML = ECA.color ? 'no color' : 'color mode!';
    ECA.generate();
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
$('#eca-reset').onclick = () => {
    window.location.reload();
};
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
// /\__/\
// (=o.o=)
// |/--\|
// (")-(")
