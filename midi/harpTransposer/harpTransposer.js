/*
 * setScale(scale) expects an array with the individual note transpositions, like so:
 * setScale([0, 0, 0, 1, 1, 1, -1]); //For a whole-tone scale
 *
 * The numbers in the array represent the individual harp string transpositions:
 *
 * Sharp: 1
 * Natural: 0
 * Flat: -1
 */

const transposeModel = require('./transposeModel.js');
const converter = require('../converter.js');
const abcjs = require('abcjs');
let oldVal = '';

function getTransformer(val) {

    const vals = JSON.parse(val);

    const valToNote = function (val, index) {
        const noteList = [44, 32, 68, 80, 92, 104, 56];
        if (val === -1)
            return noteList[index] - 2;
        else if (val === 0)
            return noteList[index];
        else if (val === 1) {
            return noteList[index] + 2;
        }
    };

    const pedals = vals.map((val, index) => ({
        'note': valToNote(val, index),
        'velocity': 64,
        'channel': 0
    }));

    return {
        'setOutput': (output) => pedals.forEach(pedal => {
            output.send('noteon', pedal);
            output.send('noteoff', pedal);
        }),
        'setCallback': (callback) => this.callback = callback,
        'getEventTypes': () => ['noteon', 'noteoff'],
        'transform': (event) => {

            if (this.callback)
                this.callback(event);
        }
    }
}

function getDisplay(val) {
    const div = document.createElement('div');
    //Staff width parameter 250 is optimal for 7-note scale allowing for accidentals.
    abcjs.renderAbc(div, converter.toAbc(JSON.parse(val).map(Number)), {}, {
        'staffwidth': 250
    });
    div.dataset[getTagName()] = val;
    div.className = 'data';
    return div;
}

function getEditor() {
    return new Promise(res => {
        let table = document.createElement('div');
        table.dataset[getTagName()] = '[0, 0, 0, 0, 0, 0, 0]';
        let headers;
        let sharps;
        let naturals;
        let flats;
        let rows = [];
        for (let i = 0; i < 4; i++) {
            rows[i] = document.createElement('tr');
        }
        rows.forEach(el => table.appendChild(el));
        [headers, sharps, naturals, flats] = rows;

        let dict = {
            '#': 1,
            'nat': 0,
            'b': -1
        };

        let radios = [];

        ['', 'do', 'ré', 'mi', 'fa', 'sol', 'la', 'si'].forEach((note, column) => {
            [
                [headers, 'th', note],
                [sharps, 'td', '#', true],
                [naturals, 'td', 'nat', true],
                [flats, 'td', 'b', true]
            ]
                .forEach(([row, type, text, radiosOn], index) => {
                    let content;
                    if (radiosOn && column > 0) {
                        content = document.createElement('input');
                        content.id = 'accidentals';
                        content.type = 'radio';
                        content.name = column - 1;
                        content.value = dict[text];
                        if (text === 'nat')
                            content.checked = true;

                        content.onclick = radio => {
                            let transpose = [...Array(7).keys()].map(i => {
                                let nodeList = Array.from(table.getElementsByTagName('*'));
                                let nodes = nodeList.filter(node => node.name === i.toString());
                                let theone = Array.from(nodes).find((el) => el.checked);
                                if (theone) {
                                    return parseInt(theone.value);
                                }
                                else
                                    return [];
                            });
                            table.dataset[getTagName()] = JSON.stringify(transpose);
                            console.log('transpose = ' + transpose);
                        };


                        radios.push(content);
                    } else
                        content = document.createTextNode(text);
                    const node = document.createElement(type);
                    node.appendChild(content);
                    row.appendChild(node);
                });
        });

        res(table);
    });
}

function getTagName() {
    return 'harp';
}

module.exports = {
    'getDisplay': getDisplay,
    'getTransformer': getTransformer,
    'tagName': getTagName(),
    'getEditor': getEditor,
};
