const win = nw.Window.get();
const midi = require('./midi/midi.js');
const ScaleController = require('./ScaleController.js');
const plugins = require('./pluginList.js');
const Chainable = require('./Chainable.js');
const chain = new Chainable(midi.input, midi.output);
let listadded = false;

function initInterface() {
    const menubar = new nw.Menu({
        type: 'menubar'
    });
    const fileMenu = new nw.Menu();
    fileMenu.append(new nw.MenuItem({
        'label': 'Charger...',
        'click': load
    }));

    function load() {
        const fileloader = document.getElementById('fileloader');
        const nextClicker = document.getElementById('nextClicker');
        const previousClicker = document.getElementById('previousClicker');
        fileloader.addEventListener('change', (event) => {
            if (!event.target.value)
                return;
            let path = event.target.value;

            const fs = require('fs');
            let object;
            fs.readFile(path, (err, data) => {
                if (err)
                    throw err;
                object = JSON.parse(data);
                object.forEach(setup => addScale(setup));
                const scaleController = new ScaleController(Array.from(document.getElementById('scales').children), transform);

                if(!listadded){
                    nextClicker.addEventListener('click', scaleController.increment);
                    previousClicker.addEventListener('click', scaleController.decrement);

                    midi.input.on('cc', msg => {
                        if (msg.value === 58)
                            nextClicker.click();
                        if (msg.value === 59)
                            previousClicker.click();
                    });
                    listadded = true;
                }
            });

            event.target.value = '';
        });
        fileloader.click();
    }

    fileMenu.append(new nw.MenuItem({
        'label': 'Quitter',
        'click': () => {
            win.close();
        }
    }));
    menubar.append(new nw.MenuItem({
        'label': 'Fichier',
        'submenu': fileMenu
    }));
    win.menu = menubar;

    ['previous', 'next'].map(name => document.getElementById(name)).forEach(el => {
        el.addEventListener('click', () => document.getElementById(el.id + 'Clicker').click());
    })
}

function addScale(object) {
    let div = document.createElement('div');
    plugins.filter(plugin => object[plugin.tagName])
        .forEach(plugin => div.appendChild(plugin.getDisplay(object[plugin.tagName])));
    const li = document.createElement('li');
    li.appendChild(div);
    document.getElementById('scales').appendChild(li);
}

function transform(div) {
    const children = Array.from(div.getElementsByClassName('data'));
    children.forEach(child => {
        plugins.filter(plugin => child.dataset[plugin.tagName])
            .forEach(plugin => {
                chain.chain(plugin.getTransformer(child.dataset[plugin.tagName]));
            });
    });
}

win.on('loaded', initInterface);

