const parse = require('../../src/parse.js');
const render = require('../../src/render.js');
const fs = require('fs');
const path = require('path');


const text = fs.readFileSync(path.join(__dirname, 'test3.conf'), 'utf8');
const commands = parse(text);

const result = render(commands);
console.log(result);
