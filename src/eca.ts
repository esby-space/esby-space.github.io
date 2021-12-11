document.write(`
    <link rel="stylesheet" href="../styles/cells.css" />
    <link rel="stylesheet" href="" id="cell-style" />

    <div>
        <label for="eca-rule"><b>rule number:</b></label>
        <input autocomplete="off" id="eca-rule" type="number" /><br />
        <label for="eca-row"><b>number of rows:</b></label>
        <input autocomplete="off" id="eca-row" type="number" />
        <label for="eca-column"><b>number of columns:</b></label>
        <input autocomplete="off" id="eca-column" type="number" /><br />
        <button id="eca-random-rule">random rule</button>
        <button id="eca-random-first">randomize first layer</button>
        <button id="eca-clear-first">clear cells</button>
        <button id="eca-color">color mode!</button>
        <button class="boxy-button">boxy mode</button>
        <button id="eca-reset">reset all</button>
        <!-- ughhh this is so ugly >~< -->
    </div>

    <div id="eca-cells" class="cells"></div>
`);

const Cells: any = {
    // me being lazy functions
    alive: function (cell: Element) {
        cell.classList.remove('dead');
        cell.classList.add('alive');
    },

    kill: function (cell: Element) {
        cell.classList.remove('alive');
        cell.classList.add('dead');
    },

    toggle: function (cell: Element) {
        cell.classList.toggle('alive');
        cell.classList.toggle('dead');
    },
};

// ECA //
interface ECA {
    rule: number;
    rows: number;
    columns: number;
    color: Boolean;
    cells: Element[][];
    ruleArray: number[];

    makeCells(selector?: string): void;
    cellState(row: number, column: number): number;
    generate(): void;

    [key: string]: any;
}

const ECA: ECA = {
    rule: 30,
    rows: 30,
    columns: 30,
    color: false,
    cells: [],

    // turn rule into binary, then sums of power of 2
    get ruleArray(): number[] {
        const binary = this.rule.toString(2);
        const binaryArray = Array.from(binary).reverse();
        const ruleList: number[] = [];
        binaryArray.forEach((x, i) => {
            let digit = parseInt(x);
            digit == 1 && ruleList.push(2 ** i);
        });
        return ruleList;
    },

    // fill 2D array with cells, rows * (3 * columns)
    makeCells: function (selector?: string): void {
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
    cellState: function (row: number, column: number): number {
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
    generate: function (): void {
        this.cells.forEach((layer, i) => {
            if (i == 0) return;
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
                } else {
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

$('#eca-reset').onclick = () => {
    window.location.reload();
};

// i just realized that dave shiffman did a tutorial on this
// and did it way better than me
// oh well!

// /\__/\
// (=o.o=)
// |/--\|
// (")-(")
