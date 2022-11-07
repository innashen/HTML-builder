const fs = require('fs');
const path = require('path');
const { mkdir, readdir, copyFile } = require('fs/promises');

const assetsPath = path.join(__dirname, 'assets');
const assetsPathCopy = path.join(__dirname, 'project-dist', 'assets');

const htmlPath = path.join(__dirname, 'template.html');
const htmlPathNew = path.join(__dirname, 'project-dist', 'index.html');

const componentsPath = path.join(__dirname, 'components');

const addInd = async (htmlPath) => {
    fs.writeFile(htmlPathNew, '', (err) => {
        if (err) throw err;
    });
    const readStream = fs.createReadStream(htmlPath, 'utf8');
    readStream.on('data', (data) => {
        fs.promises.appendFile(htmlPathNew, data);
    });
};

const bundleHtml = async () => {
    const templateFile = fs.promises.readFile(htmlPath, 'utf8');
    let template = await templateFile;
    let arr = [];
    let namesFile = [];

    fs.readdir(componentsPath, { withFileTypes: true }, (err, files) => {
        if (err) throw err;
        files.forEach((file) => {
            if (path.extname(file.name) != '.html') return;
            let componentFile = fs.promises.readFile(path.join(componentsPath, file.name), 'utf8');
            arr.push(componentFile);
            namesFile.push(`{{${path.parse(file.name).name}}}`);
        });
        Promise.all(arr).then((value) => {
            value.forEach((file, i) => {
                template = template.replace(namesFile[i], file);
            });
            fs.writeFile(htmlPathNew, template, () => {});
        });
    });
};

const createDistFolder = async () => {
    await mkdir(path.join(__dirname, 'project-dist'), { recursive: true });
};

const copyFolder = async (fromFolder, toFolder) => {
    await mkdir(toFolder, { recursive: true }, (err) => {
        if (err) throw err;
    });
    const files = await readdir(fromFolder, { withFileTypes: true });
    files.forEach((file) => {
        const newPath = path.join(fromFolder, file.name);
        const newPathCopy = path.join(toFolder, file.name);
        if (file.isDirectory()) {
            copyFolder(newPath, newPathCopy);
        } else {
            copyFile(newPath, newPathCopy);
        }
    });
};

const createBundleCss = async () => {
    const stylePath = path.join(__dirname, 'styles');

    fs.writeFile(path.join(__dirname, 'project-dist', 'style.css'), '', (err) => {
        if (err) throw err;
    });

    await readdir(stylePath, { withFileTypes: true }).then((files) => {
        for (let file of files) {
            if (file.isFile() && path.extname(file.name) === '.css') {
                const readStream = fs.createReadStream(path.join(stylePath, file.name), 'utf-8');
                readStream.on('data', (chunk) => {
                    fs.promises.appendFile(path.join(__dirname, 'project-dist', 'style.css'), chunk + '\n');
                });
            }
        }
    });
};

fs.rm(path.join(__dirname, 'project-dist'), { recursive: true }, async () => {
    await createDistFolder();
    await addInd(htmlPath);
    await bundleHtml();
    await copyFolder(assetsPath, assetsPathCopy);
    await createBundleCss();
});
