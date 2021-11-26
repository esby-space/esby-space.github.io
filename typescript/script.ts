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

const appendDOM = (
    text: string,
    DOM: HTMLDivElement,
    config?: { className?: string; fadeIn?: boolean }
) => {
    const element = document.createElement('div');
    element.innerHTML = text;

    if (config?.className) element.classList.add(config.className);

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
