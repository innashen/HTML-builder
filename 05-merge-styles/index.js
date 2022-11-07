const fs = require('fs');
const path = require('path');
const { readdir } = require('fs/promises');
const stylesPath = path.join(__dirname, 'styles');

fs.writeFile(path.join(__dirname, 'project-dist', 'bundle.css'), '', (err) => {
    if (err) throw err;
});

readdir(stylesPath, { withFileTypes: true }).then((files) => {
    for (let file of files) {
        if (file.isFile() && path.extname(file.name) === '.css') {
            const input = fs.createReadStream(path.join(stylesPath, file.name), 'utf-8');
            input.on('data', (chunk) => {
                fs.promises.appendFile(path.join(__dirname, 'project-dist', 'bundle.css'), chunk + '\n');
            });
        }
    }
});
