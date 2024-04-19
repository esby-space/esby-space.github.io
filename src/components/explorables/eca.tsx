import { onMount, createSignal, createEffect, createRenderEffect } from "solid-js";
import { ECA } from "./lib/eca";

export default function() {
    let canvas: HTMLCanvasElement;
    let context: CanvasRenderingContext2D;
    let cellSize: number;

    const [width, setWidth] = createSignal(100);
    const [height, setHeight] = createSignal(100);
    const [rule, setRule] = createSignal(30);

    onMount(() => {
        ECA.init(width() * 3, height(), rule()); // we simulate 3 * width to reduce side interference
        ECA.grid.get(Math.floor(ECA.grid.width / 2), 0).alive = true;
        ECA.update();

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        context = canvas.getContext("2d")!;
        if (!context) canvas.outerHTML = "<p>error creating rendering context x_x</p>";
        draw();
    });

    const draw = () => {
        if (!context) return;
        context.clearRect(0, 0, canvas.width, canvas.height);
        for (let y = 0; y < ECA.grid.height; y++) {
            for (let x = width(); x < width() * 2; x++) {
                let cell = ECA.grid.get(x, y);
                if (cell.alive) {
                    context.fillStyle = `hsl(${cell.state * 60}, 70%, 60%)`;
                    context.fillRect((x - width()) * cellSize, y * cellSize, cellSize, cellSize);
                }
            }
        }
    };

    createEffect(() => resizeGrid(width(), height()));

    createEffect(() => {
        ECA.rule.init(rule());
        ECA.update();
        draw();
    });

    const resizeCanvas = () => {
        if (!canvas) return;
        canvas.width = canvas.clientWidth * window.devicePixelRatio;
        canvas.height = canvas.width * height() / width();
        cellSize = canvas.width / width();
        draw();
    };

    const resizeGrid = (width: number, height: number) => {
        ECA.grid.init(width * 3, height);
        ECA.grid.get(Math.floor(ECA.grid.width / 2), 0).alive = true;
        ECA.update();
        resizeCanvas();
    };

    const randomize = () => {
        ECA.randomize();
        draw();
    };

    const clear = () => {
        ECA.clear();
        ECA.grid.get(Math.floor(ECA.grid.width / 2), 0).alive = true;
        ECA.update();
        draw();
    };

    const reset = () => {
        setWidth(100);
        setHeight(100);
        setRule(30);
        clear();
    };

    const click = (event: MouseEvent) => {
        let x = Math.floor(event.offsetX * window.devicePixelRatio / cellSize) + width();
        let y = Math.floor(event.offsetY * window.devicePixelRatio / cellSize);


        if (y > 0) {
            let state = ECA.grid.state(x, y);
            ECA.rule.states[state] = !ECA.rule.states[state];

            let newRule = 0;
            for (let i = 0; i < ECA.rule.states.length; i++) {
                if (ECA.rule.states[i]) newRule += 2 ** i;
            }

            setRule(newRule);
        } else {
            ECA.grid.get(x, y).alive = !ECA.grid.get(x, y).alive;
            ECA.update();
            draw();
        }
    };

    return <div class="my-8 p-8 space-y rounded-md shadow-lg">
        <h3 class="text-xl font-black text-center">elementary cellular automata</h3>

        <div class="flex gap-4">
            <label>
                <span class="block">rule</span>
                <input type="number" use:bind={[rule, setRule]} class="w-full border p-2 rounded-md" />
            </label>
            <label>
                <span class="block">width</span>
                <input type="number" use:bind={[width, setWidth]} class="w-full border p-2 rounded-md" />
            </label>
            <label>
                <span class="block">height</span>
                <input type="number" use:bind={[height, setHeight]} class="w-full border p-2 rounded-md" />
            </label>
        </div>

        <div class="flex gap-4 justify-center">
            <button onClick={randomize} class="border p-2 rounded-md">randomize</button>
            <button onClick={clear} class="border p-2 rounded-md">clear</button>
            <button onClick={reset} class="border p-2 rounded-md">reset</button>
        </div>

        <canvas ref={canvas!} onClick={click} class="w-full cursor-pointer"></canvas>
    </div>
}

function bind(element: HTMLInputElement, value: () => any) {
    const [accessor, setter] = value();
    createRenderEffect(() => (element.value = accessor()));
    element.addEventListener("input", (event) => setter(parseInt((event.target as HTMLInputElement).value)));
}

