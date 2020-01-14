const Sortable = require('sortablejs');
const plugins = require('../pluginList.js');
const pluginMap = new Map();

function main(win) {
    const sortable = Sortable.create(document.getElementById('scales'));
    const editor = document.getElementById('editor');
    plugins.forEach(plugin => {
        console.log(plugin.getEditor());
        //plugin.getEditor().then(div => editor.appendChild(div));
        plugin.getEditor().then(div => {
            pluginMap.set(plugin, div);
            editor.appendChild(pluginMap.get(plugin));
        });
    });

    const button = document.createElement('button');
    button.innerHTML = 'Ajouter';
    document.getElementById('editor').appendChild(button);
    document.getElementById('filesaver').addEventListener('click', saveListener);
    button.addEventListener('click', addScale);

    buildMenuBar();

}

function addScale(object) {
    let div = document.createElement('div');
    pluginMap.forEach((editor, plugin) => {
        if (object && object[plugin.tagName])
            div.appendChild(plugin.getDisplay(object[plugin.tagName]));
        else
            div.appendChild(plugin.getDisplay(editor.dataset[plugin.tagName]));
    });
    const li = document.createElement('li');
    li.appendChild(div);
    document.getElementById('scales').appendChild(li);

    li.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        buildDeleteContextMenu(li).popup(event.x, event.y);
        return false;
    });
}

function buildDeleteContextMenu(target) {
    let menu = new nw.Menu({
        'type': 'contextmenu'
    });
    let menuItem = new nw.MenuItem({
        'label': 'Supprimer',
        'click': () => target.remove()
    });
    menu.append(menuItem);
    return menu;
}

function buildMenuBar() {
    let submenu = new nw.Menu();
    submenu.append(new nw.MenuItem({
        'label': 'Sauvegarder',
        'click': () => document.getElementById('filesaver').click()
    }));
    submenu.append(new nw.MenuItem({
        'label': 'Charger',
        'click': () => document.getElementById('fileloader').click()
    }));
    submenu.append(new nw.MenuItem({
        'label': 'Fermer',
        'click': () => nw.Window.get().close()
    }));

    let menu = new nw.Menu({
        'type': 'menubar'
    });
    let menuItem = new nw.MenuItem({
        'label': 'Fichier',
        'submenu': submenu
    });
    menu.append(menuItem);

    nw.Window.get().menu = menu;

    let filesaver = document.getElementById('filesaver');
    filesaver.addEventListener('change', saveListener);

    let fileloader = document.getElementById('fileloader');
    fileloader.addEventListener('change', loadListener);
}

function saveListener(event) {
    if (!event.target.value)
        return;
    let path = event.target.value;
    event.target.value = '';


    const scales = Array.from(document.getElementById('scales').childNodes);
    const object = scales.map(scale => plugins.map(plugin => [plugin.tagName, pluginMap.get(plugin).dataset[plugin.tagName] || '']));

    const array = scales.map(scale => {
        const divs = Array.from(scale.getElementsByClassName('data'));
        const inner = {};
        plugins.forEach(plugin => {
            const name = plugin.tagName;
            const found = divs.find(div => div.dataset[name]);
            if(found) {
                inner[name] = found.dataset[name];
            }
            //inner[name] = divs.find(div => Boolean(div.dataset[name])).dataset[name] || '';
        });
        return inner;
    });

    let fs = require('fs');
    fs.writeFile(path, JSON.stringify(array, null, 4), err => {
        if (err)
            throw err;
    });
}

function loadListener(event) {
    if (!event.target.value)
        return;
    let path = event.target.value;
    event.target.value = '';

    const fs = require('fs');
    fs.readFile(path, (err, data) => {
        if (err)
            throw err;
        let object = JSON.parse(data);
        object.forEach(setup => addScale(setup));
    });
    resetScales();
}

function resetScales() {
    let scales = document.getElementById('scales');
    while (scales.firstChild) {
        scales.removeChild(scales.firstChild);
    }
}

nw.Window.get().on('loaded', main);
