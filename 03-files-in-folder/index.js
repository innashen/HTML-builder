const fs = require('fs');
const path = require('path');
const pathFile = path.join(__dirname, 'secret-folder');

fs.readdir(pathFile, {withFileTypes: true }, (err, files) => 
{   if (err) throw err;
    for (const file of files) {
        if (file.isFile()) {
            const filePath = path.join(__dirname, 'secret-folder', file.name);
            fs.stat(filePath, (err, stats) => {
                if (err) throw err;
                process.stdout.write(`${path.basename(filePath, path.extname(filePath))} - ${path.extname(filePath).slice(1)} - ${stats.size / 1000}kb\n`);
            });
        }
    }
});
