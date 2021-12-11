"use strict";
const Footer = () => `
    <footer>
    <a href="https://github.com/esby-space/norminal">source code (please help me)</a>, this site is still being
    built, thank you for visiting!
    <pre>

    /\\__/\\
    (=o.o=)
    |/--\\|
    (")-(")

    </pre>
    <div id="page-buttons">
        <button id="scroll-button">↑ back to top</button>
    </div>
    </footer>
`;
document.write(Footer());
$('#scroll-button').onclick = () => {
    window.scrollTo(0, 0);
};
