"use strict";
document.write(`
    <style>
        #shapes { 
            position: relative;
            aspect-ratio: 3 / 2;
        }

        #shapes-simulation {
            position: absolute;
            top: 0;
            left: 0;
        }
    </style>
    <canvas id="shapes-simulation"></canvas>
`);
const Shapes = () => {
    // canvas!
    const container = $('#shapes');
    const canvas = $('#shapes-simulation');
    const ctx = canvas.getContext('2d');
    // sizing
    const width = (canvas.width = container.clientWidth * 2);
    const height = (canvas.height = container.clientHeight * 2);
    canvas.style.width = width / 2 + 'px';
    canvas.style.height = height / 2 + 'px';
    // engine matter.js
    const Engine = Matter.Engine, Bodies = Matter.Bodies, Composite = Matter.Composite, Composites = Matter.Composites, Mouse = Matter.Mouse, MouseConstraint = Matter.MouseConstraint;
    const engine = Engine.create();
    // walls
    const top = Bodies.rectangle(width / 2, height, width, 5, { isStatic: true, restitution: 1 });
    const bottom = Bodies.rectangle(width / 2, 0, width, 5, { isStatic: true, restitution: 1 });
    const left = Bodies.rectangle(0, height / 2, 5, height, { isStatic: true, restitution: 1 });
    const right = Bodies.rectangle(width, height / 2, 5, height, { isStatic: true, restitution: 1 });
    Composite.add(engine.world, [top, bottom, left, right]);
    // shapes!
    const shapes = Composites.stack(80, 80, 10, 10, 80, 80, (x, y) => {
        return Bodies.polygon(x, y, Math.round(Math.random() * 4 + 2), Math.random() * 40 + 60, { restitution: 0.8 });
    });
    Composite.add(engine.world, shapes);
    // ze mouse
    const mouseContraint = MouseConstraint.create(engine, {
        mouse: Mouse.create(canvas),
    });
    Composite.add(engine.world, mouseContraint);
    // render to canvas
    const render = () => {
        window.requestAnimationFrame(render);
        ctx.clearRect(0, 0, width, height);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        const bodies = Composite.allBodies(engine.world);
        ctx.beginPath();
        bodies.forEach((body) => {
            const vertices = body.vertices;
            ctx.moveTo(vertices[0].x, vertices[0].y);
            vertices.forEach((vertex) => ctx.lineTo(vertex.x, vertex.y));
            ctx.lineTo(vertices[0].x, vertices[0].y);
            ctx.stroke();
        });
        Engine.update(engine, 1000 / 60);
    };
    render();
};
window.addEventListener('load', Shapes);
