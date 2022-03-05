"use strict";
const SNAKE = () => {
    const tileSize = 40;
    // smaller numbers = higher speeds!
    const startSpeed = 100;
    const maxSpeed = 50;
    const speedIncrement = 10;
    const canvas = createSimulation(document.body);
    const context = canvas.getContext('2d');
    const rows = Math.floor(canvas.height / tileSize);
    const columns = Math.floor(canvas.width / tileSize);
    const Snake = {
        x: Math.round(columns / 2),
        y: Math.round(rows / 2),
        direction: 'right',
        speed: startSpeed,
        cells: [],
        total: 0,
        dead: false,
        draw() {
            context.fillStyle = 'white';
            context.fillSquare(this.x, this.y, tileSize);
            for (let i = 0; i < this.cells.length; i++) {
                const cell = this.cells[i];
                context.fillSquare(cell.x, cell.y, tileSize);
            }
        },
        update() {
            // update the tail of the snake
            if (this.total == this.cells.length) {
                // when no food has been eaten
                for (let i = 0; i < this.cells.length - 1; i++) {
                    this.cells[i] = this.cells[i + 1];
                }
            }
            this.cells[this.total - 1] = new Vector(this.x, this.y);
            // detect if a button has been pressed
            if (['up', 'down'].includes(this.direction)) {
                if (['left', 'right'].includes(Keyboard.action)) {
                    this.direction = Keyboard.action;
                }
            }
            else if (['left', 'right'].includes(this.direction)) {
                if (['up', 'down'].includes(Keyboard.action)) {
                    this.direction = Keyboard.action;
                }
            }
            // move the snake forward
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
            // if an apple has been eaten
            if (Math.pythag(this.x - Food.x, this.y - Food.y) < 1) {
                this.total++;
                Food.reset();
                this.speed -= this.speed > maxSpeed ? speedIncrement : 0;
            }
            // if the snake runs into itself
            for (let i = 0; i < this.cells.length - 1; i++) {
                const cell = this.cells[i];
                if (Math.pythag(this.x - cell.x, this.y - cell.y) < 1) {
                    this.dead = true;
                }
            }
            // if the snake runs into a wall
            if (this.x > columns || this.x < 0 || this.y > rows || this.y < 0) {
                Snake.dead = true;
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
            this.x = Math.randomInt(2, columns - 2);
            this.y = Math.randomInt(2, rows - 2);
        },
    };
    const update = () => {
        context.clear(canvas);
        Food.draw();
        Snake.draw();
        Snake.update();
        Snake.dead ? kill() : setTimeout(update, Snake.speed);
    };
    update();
    const kill = () => {
        const div = document.createElement('div');
        div.innerHTML = `<h3>you died!</h3>your score: ${Snake.total}`;
        div.id = 'dead';
        document.body.append(div);
    };
};
window.addEventListener('load', SNAKE);
