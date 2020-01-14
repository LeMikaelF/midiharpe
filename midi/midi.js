let initialized = false;

let easymidi;
let midiOutput;
let midiInput;
let ccInput;

function initialize() {
    easymidi = require('easymidi');
    midiOutput = new easymidi.Output('Easymidi output', true);
    midiInput = new easymidi.Input('Easymidi input', true);
    ccInput = new easymidi.Input('CC Input', true);
    initialized = true;
}

if(!initialized)
  initialize();

module.exports = {
    'input': midiInput,
    'output': midiOutput,
    'ccInput': ccInput
};
