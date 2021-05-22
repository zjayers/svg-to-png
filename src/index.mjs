#!/usr/bin/env node

import path from 'path';
import fs from 'fs';
import svg2img from 'svg2img';

(async () => {

    const directoryPath = './files';
    const files = [];

    const getFilesRecursively = (directory) => {
        const filesInDirectory = fs.readdirSync(directory);
        for (const file of filesInDirectory) {
            const absolute = path.join(directory, file);
            if (fs.statSync(absolute).isDirectory()) {
                getFilesRecursively(absolute);
            } else {
                files.push(absolute);
            }
        }
    };

    getFilesRecursively(directoryPath);

    files.forEach(async (file) => {
        console.log("Converting: " + file);

        svg2img(file, (error, buffer) => {

            if (error) {
                console.error(error);
            }

            fs.writeFileSync(file.replace('.svg', '.png'), buffer);
        });
    });
})();
