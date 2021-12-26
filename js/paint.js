"use strict";
document.write(`
    <link rel="stylesheet" href="../styles/paint.css" />

    <div id="paint-canvas"></div>
    <div id="paint-buttons">
        <button>fill</button>
        <button id="paint-clear">clear</button>
        <button id="paint-save">save</button>
    </div>
    <input type="range" min="1" max="50" id="paint-slider" />
    <div id="paint-controls">
        <div id="paint-colors">
            <div class="paint-color" style="background-color: hsl(0, 0%, 20%)"
                onclick="Paint.color = 'hsl(0, 0%, 20%)'"></div>
            <div class="paint-color" style="background-color: hsl(0, 0%, 100%)"
                onclick="Paint.color = 'hsl(0, 0%, 100%)'"></div>
            <div class="paint-color" style="background-color: hsl(348, 80%, 60%)"
                onclick="Paint.color = 'hsl(348, 80%, 60%)'"></div>
            <div class="paint-color" style="background-color: hsl(33, 80%, 60%)"
                onclick="Paint.color = 'hsl(33, 80%, 60%)'"></div>
            <div class="paint-color" style="background-color: hsl(78, 80%, 60%)"
                onclick="Paint.color = 'hsl(78, 80%, 60%)'"></div>
            <div class="paint-color" style="background-color: hsl(123, 80%, 60%)"
                onclick="Paint.color = 'hsl(123, 80%, 60%)'"></div>
            <div class="paint-color" style="background-color: hsl(168, 80%, 60%)"
                onclick="Paint.color = 'hsl(168, 80%, 60%)'"></div>
            <div class="paint-color" style="background-color: hsl(213, 80%, 60%)"
                onclick="Paint.color = 'hsl(213, 80%, 60%)'"></div>
            <div class="paint-color" style="background-color: hsl(258, 80%, 60%)"
                onclick="Paint.color = 'hsl(258, 80%, 60%)'"></div>
            <div class="paint-color" style="background-color: hsl(303, 80%, 60%)"
                onclick="Paint.color = 'hsl(303, 80%, 60%)'"></div>
        </div>
    </div>
    <input type="color" />
`);
// PAINT //
let Paint = {
    color: 'hsl(0, 0%, 20%)',
    strokeWidth: 1,
    makeCanvas: function (selector) {
        selector && (this.container = $(selector));
        this.container.innerHTML = '';
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = this.container.clientWidth;
        canvas.height = (2 * canvas.width) / 3;
        canvas.onmousedown = () => {
            ctx.beginPath();
        };
        canvas.onmousemove = (event) => {
            ctx.strokeStyle = this.color;
            ctx.lineWidth = this.strokeWidth;
            if (Mouse.pressed) {
                const x = event.offsetX;
                const y = event.offsetY;
                ctx.lineTo(x, y);
                ctx.stroke();
            }
        };
        this.container.appendChild(canvas);
    },
};
Paint.makeCanvas('#paint-canvas');
$('#paint-slider').value = Paint.strokeWidth;
$('input[type="color"]').onchange = () => {
    Paint.color = $('input[type="color"]').value;
};
$('#paint-slider').onchange = () => {
    Paint.strokeWidth = $('#paint-slider').value;
};
$('#paint-clear').onclick = () => {
    Paint.makeCanvas();
};
$('#paint-save').onclick = async () => {
    const canvas = $('#paint-canvas canvas');
    let url = canvas.toDataURL();
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.click();
    // FIXME: not working in chrome
};
// /\__/\
// (=o.o=)
// |/--\|
// (")-(")
