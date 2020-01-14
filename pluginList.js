//Centralized list of plugins.


const harpTransposer = require('./midi/harpTransposer/harpTransposer.js');
const octaver = require('./midi/octaver/octaver.js');
module.exports = [harpTransposer, octaver];
