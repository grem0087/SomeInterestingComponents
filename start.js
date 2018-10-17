const { spawn } = require('child_process');

spawn('node', ['./start-frontend'], { stdio: 'inherit' });