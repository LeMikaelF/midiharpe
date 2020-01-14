const map = new Map([
    ['up', 12],
    ['down', -12]
]);

function getTransformer(val) {
    if (!val || !Array.from(map.keys()).some(key => key === val))
        return;
    return {
        'setCallback': (callback) => this.callback = callback,
        'getEventTypes': () => ['noteon', 'noteoff'],
        'transform': (event) => {
            console.log('transform in getTransformer() in octaver running');
            if (this.callback) {
                this.callback(event);
                const event2 = JSON.parse(JSON.stringify(event));
                event2.note += map.get(val);
                this.callback(event2);
            }
        }
    };
}

function getEditor() {
    return new Promise(res => {
        const fs = require('fs');
        fs.readFile('../midi/octaver/octaver.html', 'utf8', (err, data) => res(data));
    }).then(data => {
        let div = document.createElement('div');
        div.dataset[getTagName()] = '';
        div.innerHTML = data;
        Array.from(div.getElementsByTagName('input')).forEach(input => {
            input.addEventListener('click', event => {
                div.dataset[getTagName()] = event.target.value;
            });
        });
        return new Promise(res => res(div));
    });

}

function getDisplay(val) {
    const div = document.createElement('div');
    if (map.get(val)) {
        let text = document.createTextNode('+ 8ve ' + val);
        div.appendChild(text);
        div.dataset[getTagName()] = val;
    }
    div.className = 'data';
    return div;
}

function getTagName() {
    return 'octaver';
}

module.exports = {
    'getDisplay': getDisplay,
    'getTransformer': getTransformer,
    'tagName': getTagName(),
    'getEditor': getEditor,
};
