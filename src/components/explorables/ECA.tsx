import { onMount, createSignal, createEffect } from "solid-js";
import ECA from "../../lib/eca";
import { model } from "../../lib/utils";

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
        canvas.height = (canvas.width * height()) / width();
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
        let x = Math.floor((event.offsetX * window.devicePixelRatio) / cellSize) + width();
        let y = Math.floor((event.offsetY * window.devicePixelRatio) / cellSize);

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

    return (
        <div class="not-prose my-8 space-y-4 rounded-md p-8 shadow-lg dark:shadow-black">
            <h3 class="text-center text-xl font-bold">elementary cellular automata</h3>

            <div class="flex gap-4">
                <label>
                    <span class="block">rule</span>
                    <input
                        type="number"
                        use:model={[rule, setRule]}
                        class="w-full rounded-md border p-2 dark:bg-darkish"
                    />
                </label>
                <label>
                    <span class="block">width</span>
                    <input
                        type="number"
                        use:model={[width, setWidth]}
                        class="w-full rounded-md border p-2 dark:bg-darkish"
                    />
                </label>
                <label>
                    <span class="block">height</span>
                    <input
                        type="number"
                        use:model={[height, setHeight]}
                        class="w-full rounded-md border p-2 dark:bg-darkish"
                    />
                </label>
            </div>

            <div class="flex justify-center gap-4">
                <button onClick={randomize} class="rounded-md border p-2">
                    randomize
                </button>
                <button onClick={clear} class="rounded-md border p-2">
                    clear
                </button>
                <button onClick={reset} class="rounded-md border p-2">
                    reset
                </button>
            </div>

            <canvas ref={canvas!} onClick={click} class="w-full cursor-pointer"></canvas>
        </div>
    );
}
