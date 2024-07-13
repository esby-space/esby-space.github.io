import { onMount } from "solid-js";
import Boids, { Boid } from "../../lib/boids.ts";

export default function() {
    let canvas: HTMLCanvasElement;
    let context: CanvasRenderingContext2D;

    onMount(() => {
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        Boids.init(canvas.width, canvas.height);

        context = canvas.getContext("2d")!;
        if (!context) return;
        context.strokeStyle = "white";

        loop(0);
    });

    let previous = 0;
    const loop = (now: number) => {
        const dt = now - previous;
        previous = now;

        Boids.update(dt);
        draw(Boids.boids);

        window.requestAnimationFrame(loop);
    };

    const draw = (boids: Boid[]) => {
        for (let boid of boids) {
            context.beginPath();
            context.arc(boid.position.x, boid.position.y, 3, 0, Math.PI * 2);
            context.closePath();
            context.stroke();
        }
    };

    const resizeCanvas = () => {
        if (!canvas) return;
        canvas.width = canvas.clientWidth * window.devicePixelRatio;
        canvas.height = canvas.clientHeight * window.devicePixelRatio;
    }

    return <canvas ref={canvas!} class="fixed w-full h-full -z-10" />;
}
