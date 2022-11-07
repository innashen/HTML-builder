const fs = require('fs');
const path = require('path');
const { stdin, stdout, exit } = require('process');

const pathFile = path.join(__dirname, 'text.txt');
const readFile = fs.createWriteStream(pathFile);

stdout.write('Hello, my friend! Enter your text: ');

stdin.on('data', (text) => {
    if (text.toString().trim() === 'exit') exit();
    readFile.write(text);
});

process.on('SIGINT', () => exit());
process.on('exit', () => stdout.write('\nGoodbye! Have a good day!'));
