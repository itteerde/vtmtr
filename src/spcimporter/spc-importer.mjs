import { stdin as input, stdout as output } from 'node:process';
import fs from 'node:fs/promises';
import { color, consoleColors } from '../lib/colorize.mjs';

for (const a of process.argv) {
    if (a.toLocaleLowerCase().startsWith("--help")) {

        console.log(color(consoleColors.green, `so glad you found the help, nothing helpful here.`));
        process.exit();
    }
}

const data = await fs.readFile('./src/spcimporter/v-template.json', 'utf-8');
const character = JSON.parse(data);

const pasted = await fs.readFile('./src/spcimporter/pasted.txt', 'utf-8');

if (pasted.match(/Sire:\s*(.*)/)) {
    character.system.headers.sire = pasted.match(/Sire:\s*(.*)/)[1];
} else {
    console.log(color(consoleColors.yellow, `WARNING: 'sire' not found, skipping.`));
}

// will need /Skills:\s*([\s\S]*?)\s*Disciplines/

await fs.writeFile('./src/spcimporter/import.json', JSON.stringify(character));