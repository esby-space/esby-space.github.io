// you can never escape the worse jquery
const $ = (query: string): any => {
    return document.querySelector(query);
};

const $all = (query: string): any[] => {
    return Array.from(document.querySelectorAll(query));
};

// bottom page buttons
let widescreen = false;
$('#scroll-button').onclick = () => {
    window.scrollTo(0, 0);
};

$('#wide-button').onclick = () => {
    if (widescreen) {
        $('body').style.width = 'min(95vw, 50rem)';
        $('#wide-button').innerHTML = '↔ widescreen';
    } else {
        $('body').style.width = '95vw';
        $('#wide-button').innerHTML = 'normal';
    }
    widescreen = !widescreen;
};

// used in other scripts
const Mouse: any = {
    pressed: false
}

document.body.onmousedown = () => {
    Mouse.pressed = true;
}

document.body.onmouseup = () => {
    Mouse.pressed = false;
}

// /\__/\
// (=o.o=)
// |/--\|
// (")-(")
