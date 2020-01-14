let cmd = require('node-command-line');

if(process.argv.some(arg => arg === 'editor' || arg === 'e'))
  cmd.run('./editor/nw');
else
  cmd.run('nw');

process.exit();
