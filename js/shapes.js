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
;
const Shapes = {
    container: $('#shapes'),
    canvas: $('#shapes-simulation'),
    width: 0,
    height: 0,
    sizeCanvas: () => {
        Shapes.width = Shapes.canvas.width = Shapes.container.clientWidth * 2;
        Shapes.height = Shapes.canvas.height =
            Shapes.container.clientHeight * 2;
        Shapes.canvas.style.width = Shapes.width / 2 + 'px';
        Shapes.canvas.style.height = Shapes.height / 2 + 'px';
    },
    render: (engine) => {
        const ctx = Shapes.canvas.getContext('2d');
        const render = () => {
            Shapes.render(engine);
        };
        window.requestAnimationFrame(render);
        ctx.clearRect(0, 0, Shapes.width, Shapes.height);
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        const bodies = Matter.Composite.allBodies(engine.world);
        ctx.beginPath();
        bodies.forEach((body) => {
            const vertices = body.vertices;
            ctx.moveTo(vertices[0].x, vertices[0].y);
            vertices.forEach((vertex) => ctx.lineTo(vertex.x, vertex.y));
            ctx.lineTo(vertices[0].x, vertices[0].y);
            ctx.stroke();
        });
        Matter.Engine.update(engine, 1000 / 60);
    },
    create: () => {
        // sizing
        Shapes.sizeCanvas();
        window.addEventListener('resize', Shapes.sizeCanvas);
        // engine matter.js
        const Engine = Matter.Engine, Bodies = Matter.Bodies, Composite = Matter.Composite, Composites = Matter.Composites, Mouse = Matter.Mouse, MouseConstraint = Matter.MouseConstraint;
        const engine = Engine.create();
        // walls
        const top = Bodies.rectangle(Shapes.width / 2, Shapes.height, Shapes.width, 5, {
            isStatic: true,
            restitution: 1,
        });
        const bottom = Bodies.rectangle(Shapes.width / 2, 0, Shapes.width, 5, {
            isStatic: true,
            restitution: 1,
        });
        const left = Bodies.rectangle(0, Shapes.height / 2, 5, Shapes.height, {
            isStatic: true,
            restitution: 1,
        });
        const right = Bodies.rectangle(Shapes.width, Shapes.height / 2, 5, Shapes.height, {
            isStatic: true,
            restitution: 1,
        });
        Composite.add(engine.world, [top, bottom, left, right]);
        // shapes!
        const shapes = Composites.stack(80, // start x
        80, // start y
        10, // columns
        10, // rows
        80, // space x
        80, // space y
        (x, y) => {
            return Bodies.polygon(x, y, Math.round(Math.random() * 4 + 2), Math.random() * 40 + 60, { restitution: 0.7 });
        });
        Composite.add(engine.world, shapes);
        // ze mouse
        const mouseContraint = MouseConstraint.create(engine, {
            mouse: Mouse.create(Shapes.canvas),
        });
        Composite.add(engine.world, mouseContraint);
        // render to canvas
        Shapes.render(engine);
    },
};
window.addEventListener('load', Shapes.create);
