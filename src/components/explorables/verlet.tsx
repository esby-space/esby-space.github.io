import { Circle, Verlet } from "./lib/verlet";
import { onMount, createRenderEffect } from "solid-js";

export default function() {
    let canvas: HTMLCanvasElement;
    let context: CanvasRenderingContext2D;

    onMount(() => {
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        Verlet.init(canvas.width, canvas.height);
        Verlet.add(new Circle(100, 100, 100));

        context = canvas.getContext("2d")!;
        if (!context) canvas.outerHTML = "<p>error creating rendering context x_x</p>";
        draw();

        loop(0);
    });

    let last = 0;
    const loop = (time: number) => {
        Verlet.update((time - last) / 1000);
        last = time;

        draw();
        window.requestAnimationFrame(loop);
    };

    const draw = () => {
        if (!context) return;

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.beginPath();
        context.arc(canvas.width / 2, canvas.height / 2, 500, 0, 2 * Math.PI);
        context.closePath();
        context.stroke();

        for (let i = 0; i < Verlet.circles.length; i++) {
            let circle = Verlet.circles[i];
            context.beginPath();
            context.arc(
                circle.position.x,
                circle.position.y,
                circle.radius,
                0,
                2 * Math.PI
            );
            context.fill();
        }
    };

    const resizeCanvas = () => {
        if (!canvas) return;
        canvas.width = canvas.clientWidth * window.devicePixelRatio;
        canvas.height = canvas.clientHeight * window.devicePixelRatio;
    };

    return <div class="my-8 p-8 space-y-4 rounded-md shadow-lg">
        <h3 class="font-bold text-center">verlet integration</h3>
        <canvas ref={canvas!} class="w-full aspect-square" />
    </div>;
}

function bind(element: HTMLInputElement, value: () => any) {
    const [accessor, setter] = value();
    createRenderEffect(() => (element.value = accessor()));
    element.addEventListener("input", (event) => setter(parseInt((event.target as HTMLInputElement).value)));
}

