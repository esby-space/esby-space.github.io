// you can never escape the worse jquery
const $ = (query: string): any => {
    return document.querySelector(query);
};

const $all = (query: string): any[] => {
    return Array.from(document.querySelectorAll(query));
};

// bottom page buttons
$('#scroll-button').onclick = () => {
    window.scrollTo(0, 0);
};

// used in other scripts
const Mouse: any = {
    pressed: false,
};

document.body.onmousedown = () => {
    Mouse.pressed = true;
};

document.body.onmouseup = () => {
    Mouse.pressed = false;
};

// /\__/\
// (=o.o=)
// |/--\|
// (")-(")
