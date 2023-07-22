<script lang="ts">
    export let style: string;
    import { onMount } from "svelte";
    import { GOL } from "./gol";

    let canvas: HTMLCanvasElement;
    let context: CanvasRenderingContext2D;

    let width = 100;
    let height = 100;
    let fps = 10;

    let cellSize: number;
    let intervalID: number;

    onMount(() => {
        GOL.init(width, height);
        GOL.randomize();

        resize();
        window.addEventListener("resize", resize);

        context = canvas.getContext("2d")!;
        if (!context) canvas.outerHTML = "<p>error creating rendering context x_x</p>";
        context.fillStyle = "black";
        draw();


        intervalID = setInterval(loop, 1000 / fps);
    });

    function loop(){
        GOL.update();
        draw();
    };

    $: {
        clearInterval(intervalID);
        intervalID = setInterval(loop, 1000 / fps);
    }

    function draw() {
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
    }

    // TODO: better way to do this?
    function resize() {
        if (!canvas) return;
        canvas.width = canvas.clientWidth * window.devicePixelRatio;
        canvas.height = (canvas.width * height) / width;
        cellSize = canvas.width / width;
        draw();
    }

    function resizeGrid(width: number, height: number) {
        GOL.grid.init(width, height);
        GOL.randomize();
        resize();
    }

    $: resizeGrid(width, height);

    function reset() {
        width = 100;
        height = 100;
        fps = 10;
        GOL.randomize();
    }

    function mouse(event: MouseEvent) {
        const mouseX = Math.floor(event.offsetX * window.devicePixelRatio / cellSize);
        const mouseY = Math.floor(event.offsetY * window.devicePixelRatio / cellSize);

        for (let y = 0; y < GOL.grid.height; y++) {
            for (let x = 0; x < GOL.grid.width; x++) {
                const  distance = (mouseX - x) ** 2 + (mouseY - y) ** 2;
                if (distance < 64) {
                    GOL.grid.cells[y][x] = Math.random() > 0.5;
                }
            }
        }
    }
</script>

<div class={style}>
    <h3 class="font-bold text-center">game of life</h3>

    <div class="flex gap-4">
        <label>
            <span class="block">width</span>
            <input type="number" bind:value={width} class="w-full border p-2 rounded-md">
        </label>
        <label>
            <span class="block">height</span>
            <input type="number" bind:value={height} class="w-full border p-2 rounded-md">
        </label>
        <label>
            <span class="block">fps</span>
            <input type="number" bind:value={fps} class="w-full border p-2 rounded-md">
        </label>
    </div>

    <div class="flex gap-4 justify-center">
        <button on:click={() => GOL.randomize()} class="border p-2 rounded-md h-min">randomize</button>
        <button on:click={reset} class="border p-2 rounded-md h-min">reset</button>
    </div>

    <canvas bind:this={canvas} on:mousemove={mouse} class="w-full" />
</div>

