"use strict";
// you can never escape the worse jquery
const $ = (query) => {
    return document.querySelector(query);
};
const $all = (query) => {
    return Array.from(document.querySelectorAll(query));
};
const appendDOM = (text, DOM, config) => {
    const element = document.createElement('div');
    element.innerHTML = text;
    if (config?.className)
        element.classList.add(config.className);
    if (config?.fadeIn) {
        element.style.opacity = '0';
        element.style.left = '-12px';
        requestAnimationFrame(() => {
            element.style.opacity = '1';
            element.style.left = '0px';
        });
    }
    DOM.append(element);
    return element;
};
// /\__/\
// (=o.o=)
// |/--\|
// (")-(")
