import fs from 'node:fs/promises';
import { color, consoleColors } from '../lib/colorize.mjs';

const CURRENT_DATE = new Date('2026-01-01')

/**
 * Reduces multiple consecutive whitespaces to a single space.
 * @param {string} str - The input string to clean.
 * @returns {string} - The sanitized string.
 */
function collapseWhitespace(str) {
    return str.trim().replace(/\s+/g, ' ');
}

for (const a of process.argv) {
    if (a.toLocaleLowerCase().startsWith("--help") || a.toLocaleLowerCase().startsWith("-help")) {

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
    console.log(color(consoleColors.yellow, `WARNING: 'Sire' not found, skipping.`));
}

if (pasted.match(/Embraced: (\d{4}) \(Born (\d{4})\)/)) {
    character.system.bio.dateof.birth = pasted.match(/Embraced: (\d{4}) \(Born (\d{4})\)/)[2];
} else {
    console.log(color(consoleColors.yellow, `WARNING: 'Embraced' not found, skipping.`));
}

if (pasted.match(/Embraced: (\d{4}) \(Born (\d{4})\)/)) {
    character.system.bio.dateof.death = pasted.match(/Embraced: (\d{4}) \(Born (\d{4})\)/)[1];
} else {
    console.log(color(consoleColors.yellow, `WARNING: 'Embraced' not found, skipping.`));
}

if (character.system.bio.dateof.birth !== undefined && character.system.bio.dateof.death !== undefined) {
    character.system.bio.age.apparent = parseInt(character.system.bio.dateof.death) - parseInt(character.system.bio.dateof.birth)
} else {
    console.log(color(consoleColors.yellow, `WARNING: 'Dates' not found, skipping.`));
}

if (character.system.bio.dateof.birth !== undefined && character.system.bio.dateof.death !== undefined) {
    character.system.bio.age.trueage = CURRENT_DATE.getFullYear() - parseInt(character.system.bio.dateof.birth)
} else {
    console.log(color(consoleColors.yellow, `WARNING: 'Date' not found, skipping.`));
}

if (pasted.match(/Ambition:\s*([\s\S]*?)\s*Convictions/)) {
    character.system.headers.ambition = pasted.match(/Ambition:\s*([\s\S]*?)\s*Convictions/)[1];
} else {
    console.log(color(consoleColors.yellow, `WARNING: 'Ambition' not found, skipping.`));
}

if (pasted.match(/Convictions:\s*([\s\S]*?)\s*Touchstones/)) {
    character.system.headers.touchstones = 'Convictions: ' + pasted.match(/Convictions:\s*([\s\S]*?)\s*Touchstones/)[1];
} else {
    console.log(color(consoleColors.yellow, `WARNING: 'Convictions' not found, skipping.`));
}

if (pasted.match(/Touchstones:\s*([\s\S]*?)\s*Humanity/)) {
    character.system.headers.touchstones += `<div><b>Touchstones: </b>' ${pasted.match(/Touchstones:\s*([\s\S]*?)\s*Humanity/)[1]}</div>`;
} else {
    console.log(color(consoleColors.yellow, `WARNING: 'Convictions' not found, skipping.`));
}
// will need /Skills:\s*([\s\S]*?)\s*Disciplines/

await fs.writeFile('./src/spcimporter/import.json', JSON.stringify(character));

/*
Convictions: Make sure they know you’re better
than them
Touchstones: Harry Magnotta — sadistic nurse at
Lakeshore Hospital
Humanity: 2
Generation: 8th
Blood Potency: 3
Attributes: Strength 3, Dexterity 4, Stamina 2;
Charisma 5, Manipulation 4, Composure 3; Intelligence
3, Wits 4, Resolve 3
Secondary Attributes: Health 5, Willpower 6
Skills: Melee 1, Stealth 4; Etiquette 4, Insight
(Fears) 3, Intimidation 3, Performance (Acting) 5,
Persuasion 2, Subterfuge (Sincerity) 4; Awareness
2, Investigation 2, Medicine (Psychological Treatment)
3, Politics 2
Disciplines: Auspex 3, Dominate 4, Obfuscate 3,
Presence 1*/