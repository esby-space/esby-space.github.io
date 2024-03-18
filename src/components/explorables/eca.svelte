<script lang="ts">
    export let style: string;

    import { onMount } from "svelte";
    import { ECA } from "./lib/eca";

    let canvas: HTMLCanvasElement;
    let context: CanvasRenderingContext2D;

    let width = 100;
    let height = 100;
    let rule = 30;

    let cellSize: number;

    onMount(() => {
        ECA.init(width * 3, height, rule); // we simulate 3 * width to reduce side interference
        ECA.grid.get(Math.floor(ECA.grid.width / 2), 0).alive = true;
        ECA.update();

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        context = canvas.getContext("2d")!;
        if (!context) canvas.outerHTML = "<p>error creating rendering context x_x</p>";
        draw();
    });

    function draw() {
        if (!context) return;
        context.clearRect(0, 0, canvas.width, canvas.height);
        for (let y = 0; y < ECA.grid.height; y++) {
            for (let x = width; x < width * 2; x++) {
                let cell = ECA.grid.get(x, y);
                if (cell.alive) {
                    context.fillStyle = `hsl(${ cell.state * 60 }, 70%, 60%)`;
                    context.fillRect((x - width) * cellSize, y * cellSize, cellSize, cellSize);
                }
            }
        }
    };

    // TODO: better way to do this?
    function resizeCanvas() {
        if (!canvas) return;
        canvas.width = canvas.clientWidth * window.devicePixelRatio;
        canvas.height = canvas.width * height / width;
        cellSize = canvas.width / width;
        draw();
    };

    function resizeGrid(width: number, height: number) {
        ECA.grid.init(width * 3, height);
        ECA.grid.get(Math.floor(ECA.grid.width / 2), 0).alive = true;
        ECA.update();
        resizeCanvas();
    }

    $: {
        ECA.rule.init(rule);
        ECA.update();
        draw();
    }

    $: resizeGrid(width, height);

    function randomize() {
        ECA.randomize();
        draw();
    };

    function clear() {
        ECA.clear();
        ECA.grid.get(Math.floor(ECA.grid.width / 2), 0).alive = true;
        ECA.update();
        draw();
    }

    function reset() {
        width = 100;
        height = 100;
        rule = 30;
        clear();
    }

    function click(event: MouseEvent) {
        let x = Math.floor(event.offsetX * window.devicePixelRatio / cellSize) + width;
        let y = Math.floor(event.offsetY * window.devicePixelRatio / cellSize);

        if (y > 0) {
            let newRule = 0;
            let state = ECA.grid.state(x, y);
            ECA.rule.states[state] = !ECA.rule.states[state];

            for (let i = 0; i < ECA.rule.states.length; i++) {
                if (ECA.rule.states[i]) newRule += 2 ** i;
            }

            rule = newRule;
        } else {
            ECA.grid.get(x, y).alive = !ECA.grid.get(x, y).alive;
            ECA.update();
            draw();
        }
    }

</script>

<div class={style}>
    <h3 class="text-xl font-black text-center">elementary cellular automata</h3>

    <div class="flex gap-4">
        <label>
            <span class="block">rule</span>
            <input type="number" bind:value={rule} class="w-full border p-2 rounded-md">
        </label>
        <label>
            <span class="block">width</span>
            <input type="number" bind:value={width} class="w-full border p-2 rounded-md">
        </label>
        <label>
            <span class="block">height</span>
            <input type="number" bind:value={height} class="w-full border p-2 rounded-md">
        </label>
    </div>

    <div class="flex gap-4 justify-center">
        <button on:click={randomize} class="border p-2 rounded-md">randomize</button>
        <button on:click={clear} class="border p-2 rounded-md">clear</button>
        <button on:click={reset} class="border p-2 rounded-md">reset</button>
    </div>

    <canvas bind:this={canvas} on:click={click} class="w-full cursor-pointer"></canvas>
</div>

