const fs = require('fs');
const path = require('path');
const {rm, mkdir, readdir, copyFile} = require('fs/promises');

const Folder = path.join(__dirname, 'files');
const FolderCopy = path.join(__dirname, 'files-copy');

const copyDir = async () => {
    try {
        await rm(path.join(FolderCopy), { force: true, recursive: true });
        await mkdir(path.join(FolderCopy), { recursive: true });
        const files = await readdir(path.join(Folder), { withFileTypes: true });
        files.forEach((file) => {
            copyFile(path.join(Folder, file.name), path.join(FolderCopy, file.name));
        });
    } catch (error) {
        console.error(error);
    }
};

copyDir();
