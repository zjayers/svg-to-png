#!/usr/bin/env node

import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

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

        if (path.parse(file).ext !== '.svg') {
            return;
        }

        const sizes = [16, 24, 32, 64, 128];

        const svgdata = fs.readFileSync(file, 'utf-8');

        sizes.forEach(async size => {
            const img = await sharp(Buffer.from(
                svgdata.replace('18', '100em').replace('18', '100em')
            ));

            const resized = await img.resize(size);
            await resized.toFile(`./out/${path.parse(file).name}_${size}.png`);
        })
    });

})();
