document.write(`
    <link rel="stylesheet" href="../styles/convo.css">

    <div id="convo-sidebar">
        <h3 style="color: white;">failing high school, featuring a half true story from yours truly</h3>
        <button id="convo-hs">high school</button>
        <button id="convo-woods"> woods</button>
    </div>
    <div id="game-container">
    <div id="game-text"></div>
    <div id="game-choices"></div>
    </div>
`);

interface Window {
    _: any;
}

window._ = {};

interface Game {
    DOM: HTMLDivElement;
    textDOM: HTMLDivElement;
    choicesDOM: HTMLDivElement;

    sections: { [sectionID: string]: string[] };
    loadAct: (data: Promise<string>) => Promise<void>;
    showSection: (sectionID: string) => void;
    getLineType: (line: string) => string;
    conditionalLine: (line: string) => string;
}

let Game: Game = {
    DOM: <HTMLDivElement>$('#game-container'),
    textDOM: <HTMLDivElement>$('#game-text'),
    choicesDOM: <HTMLDivElement>$('#game-choices'),

    sections: {},
    loadAct: async (data: Promise<string>) => {
        let text = await data;

        // split file into sections
        text = text.trim();
        text = '\n' + text;
        let sections = text.split(/\n#\s*/);
        sections.shift();

        // clear current sections
        Game.sections = {};

        // format sections and add to sections object
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            const id = section.slice(0, section.search(/\n\n/)).trim();
            const text = section.slice(section.search(/\n\n/)).trim();
            const lines = text.split(/\n/); // change to \n\n if necessary
            for (let i = 0; i < lines.length; i++) {
                lines[i].trim();
            }
            Game.sections[id] = lines;
        }

        // go to the first section and clear DOM
        Game.textDOM.innerHTML = '';
        Game.showSection(Object.keys(Game.sections)[0]);
    },

    // display a section
    showSection: (sectionID: string) => {
        // clear choices and text
        Game.choicesDOM.innerHTML = '';

        // show each line
        const lines = Game.sections[sectionID];

        // find the type of each line and treat them
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];

            // evaluate if it's a conditional line
            line = Game.conditionalLine(line);
            if (!line) continue;

            // is it a text, code, or choice line?
            switch (Game.getLineType(line)) {
                case 'text':
                    // display on screen
                    appendDOM(line, Game.textDOM, {
                        className: 'message',
                        fadeIn: true,
                    });
                    break;

                case 'code':
                    // run code blocks
                    const code = line.match(/`+([^`]*)`+/)![1].trim();
                    try {
                        eval(code);
                    } catch (error) {
                        console.log(error);
                    }
                    break;

                case 'choice':
                    // display on choice screen
                    const choiceText = line.match(/\[(.*)\]/)![1].trim();
                    const choiceID = line.match(/\(#(.*)\)/)![1].trim();
                    const choiceElement = appendDOM(
                        choiceText,
                        Game.choicesDOM,
                        {
                            className: 'choice',
                        }
                    );
                    choiceElement.onclick = () => {
                        appendDOM(choiceText, Game.textDOM, {
                            className: 'response',
                            fadeIn: true,
                        });
                        Game.showSection(choiceID);
                    };
                    break;
            }

            if (Game.getLineType(line) == 'goTo') {
                // go to a certain section
                const sectionID = line.match(/^\(#(.*)\)/)![1].trim();
                Game.showSection(sectionID);
                break;
            }
        }
    },

    // determine the type of a line
    getLineType: (line: string) => {
        if (/\[.*\]\(#.*\)/.test(line)) return 'choice';
        if (/^\(#\s*(.*)\)/.test(line)) return 'goTo';
        if (/^`.*`/.test(line)) return 'code';
        return 'text';
    },

    // evaluate conditional lines '{{if}}'
    conditionalLine: (line: string) => {
        let statements = line.match(/{{if.*}}.*{{\/if}}/);
        if (statements) {
            for (let i = 0; i < statements.length; i++) {
                const statement = statements[i]; // {{if true}} bla {{/if}}
                const condition = statement.match(/{{if\s+([^{}]*)}}/)![1]; // {{if true}}
                const text = statement.match(/}}([^{}]*){{/)![1].trim(); // }} bla {{

                // evaluate the conditinal
                let isTrue;
                try {
                    isTrue = eval(condition);
                } catch (error) {
                    console.log(error);
                }

                // edit the line!
                const insert = isTrue ? text : '';
                line = line.replace(statement, insert);
            }
        }
        return line;
    },
};

const getScene = async (fileName: string) => {
    const path = `./scenes/${fileName}.md`;
    const response = await fetch(path);
    const text = await response.text();
    return text;
};

let scene = getScene('scene');
Game.loadAct(scene);

$('#convo-hs').onclick = () => {
    $('#convo-sidebar h3').innerHTML =
        'failing high school, featuring a half true story from yours truly';
    scene = getScene('scene');
    Game.loadAct(scene);
};

$('#convo-woods').onclick = () => {
    $('#convo-sidebar h3').innerHTML =
        'into the woods (directly stolen from nicky case)';
    scene = getScene('woods');
    Game.loadAct(scene);
};

// /\__/\
// (=o.o=)
// |/--\|
// (")-(")
