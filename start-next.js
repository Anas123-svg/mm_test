// start-next.js
const { spawn } = require('child_process');

const child = spawn('node', ['node_modules/next/dist/bin/next', 'start'], {
  stdio: 'inherit',
  shell: true
});
