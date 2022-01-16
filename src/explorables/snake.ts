const SNAKE = () => {
    const tileSize = 40;
    const maxSpeed = 40;

    const canvas = createSimulation(document.body);
    const context = canvas.getContext('2d')!;

    const rows = Math.floor(canvas.height / tileSize);
    const columns = Math.floor(canvas.width / tileSize);

    const Snake = {
        x: Math.round(columns / 2),
        y: Math.round(rows / 2),
        direction: 'right',
        speed: 100,
        cells: [] as number[][],
        total: 0,

        draw() {
            context.fillStyle = 'white';
            context.fillSquare(this.x, this.y, tileSize);
            for (let i = 0; i < this.cells.length; i++) {
                const cell = this.cells[i];
                context.fillSquare(cell[0], cell[1], tileSize);
            }
        },

        update() {
            if (this.total == this.cells.length) {
                // when no food has been eaten
                for (let i = 0; i < this.cells.length - 1; i++) {
                    this.cells[i] = this.cells[i + 1];
                }
            }
            this.cells[this.total - 1] = [this.x, this.y];

            if (['up', 'down'].includes(this.direction)) {
                if (['left', 'right'].includes(Keyboard.action)) {
                    this.direction = Keyboard.action;
                }
            } else if (['left', 'right'].includes(this.direction)) {
                if (['up', 'down'].includes(Keyboard.action)) {
                    this.direction = Keyboard.action;
                }
            }

            switch (this.direction) {
                case 'up':
                    this.y--;
                    break;
                case 'down':
                    this.y++;
                    break;
                case 'left':
                    this.x--;
                    break;
                case 'right':
                    this.x++;
            }

            if (Math.distance(this.x, this.y, Food.x, Food.y) < 1) {
                this.total++;
                Food.reset();
                this.speed -= this.speed > maxSpeed ? 5 : 0;
            }
        },
    };

    const Food = {
        x: Math.randomInt(0, columns),
        y: Math.randomInt(0, rows),

        draw() {
            context.fillStyle = 'pink';
            context.fillSquare(this.x, this.y, tileSize);
        },

        reset() {
            this.x = Math.randomInt(0, columns);
            this.y = Math.randomInt(0, rows);
        },
    };

    const update = () => {
        context.clear(canvas);
        Food.draw();
        Snake.draw();
        Snake.update();
        setTimeout(update, Snake.speed);
    };

    setTimeout(update, Snake.speed);

    Snake.draw();
};

window.addEventListener('load', SNAKE);
