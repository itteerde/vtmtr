import fs from 'node:fs/promises';
import { color, consoleColors } from '../lib/colorize.mjs';

const data = await fs.readFile('./src/spcimporter/v-template.json', 'utf-8');
const character = JSON.parse(data);

const pasted = await fs.readFile('./src/spcimporter/pasted.txt', 'utf-8');

if (pasted.match(/Sire:\s*(.*)/)) {
    character.system.headers.sire = pasted.match(/Sire:\s*(.*)/)[1];
} else {
    console.log(color(consoleColors.yellow, `WARNING: 'sire' not found, skipping.`));
}

await fs.writeFile('./src/spcimporter/import.json', JSON.stringify(character));