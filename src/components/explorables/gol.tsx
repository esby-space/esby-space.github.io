import { onMount, createSignal, createEffect, createRenderEffect } from "solid-js";
import { GOL } from "./lib/gol";

export default function() {
    let canvas: HTMLCanvasElement;
    let context: CanvasRenderingContext2D;

    let [width, setWidth] = createSignal(100);
    let [height, setHeight] = createSignal(100);
    let [fps, setFPS] = createSignal(10);

    let cellSize: number;
    let intervalID: number;

    onMount(() => {
        GOL.init(width(), height());
        GOL.randomize();

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        context = canvas.getContext("2d")!;
        if (!context) canvas.outerHTML = "<p>error creating rendering context x_x</p>";
        context.fillStyle = "black";
        draw();


        intervalID = setInterval(loop, 1000 / fps());
    });

    const loop = () => {
        GOL.update();
        draw();
    };

    const draw = () => {
        if (!context) return;
        context.clearRect(0, 0, canvas.width, canvas.height);
        for (let y = 0; y < GOL.grid.height; y++) {
            for (let x = 0; x < GOL.grid.width; x++) {
                if (GOL.grid.get(x, y)) {
                    context.fillRect(
                        x * cellSize,
                        y * cellSize,
                        cellSize,
                        cellSize
                    );
                }
            }
        }
    };

    createEffect(() => {
        clearInterval(intervalID);
        intervalID = setInterval(loop, 1000 / fps());
    });

    createEffect(() => resizeGrid(width(), height()));

    const resizeCanvas = () => {
        if (!canvas) return;
        canvas.width = canvas.clientWidth * window.devicePixelRatio;
        canvas.height = (canvas.width * height()) / width();
        cellSize = canvas.width / width();
        draw();
    };

    const resizeGrid = (width: number, height: number) => {
        GOL.grid.init(width, height);
        GOL.randomize();
        resizeCanvas();
    };

    const reset = () => {
        setWidth(100);
        setHeight(100);
        setFPS(10);
        GOL.randomize();
    }

    const mouse = (event: MouseEvent) => {
        const mouseX = Math.floor(event.offsetX * window.devicePixelRatio / cellSize);
        const mouseY = Math.floor(event.offsetY * window.devicePixelRatio / cellSize);

        for (let y = 0; y < GOL.grid.height; y++) {
            for (let x = 0; x < GOL.grid.width; x++) {
                const distance = (mouseX - x) ** 2 + (mouseY - y) ** 2;
                if (distance < 64) {
                    GOL.grid.cells[y][x] = Math.random() > 0.5;
                }
            }
        }
    }

    return <div class="my-8 p-8 space-y-4 rounded-md shadow-lg">
        <h3 class="font-bold text-center">game of life</h3>

        <div class="flex gap-4">
            <label>
                <span class="block">width</span>
                <input type="number" use:bind={[width, setWidth]} class="w-full border p-2 rounded-md" />
            </label>
            <label>
                <span class="block">height</span>
                <input type="number" use:bind={[height, setHeight]} class="w-full border p-2 rounded-md" />
            </label>
            <label>
                <span class="block">fps</span>
                <input type="number" use:bind={[fps, setFPS]} class="w-full border p-2 rounded-md" />
            </label>
        </div>

        <div class="flex gap-4 justify-center">
            <button onClick={() => GOL.randomize()} class="border p-2 rounded-md h-min">randomize</button>
            <button onClick={reset} class="border p-2 rounded-md h-min">reset</button>
        </div>

        <canvas ref={canvas!} onMouseMove={mouse} class="w-full" />
    </div>;
}

function bind(element: HTMLInputElement, value: () => any) {
    const [accessor, setter] = value();
    createRenderEffect(() => (element.value = accessor()));
    element.addEventListener("input", (event) => setter(parseInt((event.target as HTMLInputElement).value)));
}
