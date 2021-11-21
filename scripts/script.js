"use strict";
// you can never escape the worse jquery
const $ = (query) => {
    return document.querySelector(query);
};
const $all = (query) => {
    return Array.from(document.querySelectorAll(query));
};
// bottom page buttons
$('#scroll-button').onclick = () => {
    window.scrollTo(0, 0);
};
// used in other scripts
const Mouse = {
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
