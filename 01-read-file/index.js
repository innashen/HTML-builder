const fs = require('fs');
const path = require('path');
const pathFile = path.join(__dirname, 'text.txt');
const readFile = fs.createReadStream(pathFile);
readFile.on('data', (data) => {
    console.log(data.toString());
});
