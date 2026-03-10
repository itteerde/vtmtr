import fs from 'node:fs/promises';
import { color, consoleColors } from '../lib/colorize.mjs';

const CURRENT_DATE = new Date('2026-01-01'); // the date in world, used to calculate age relative to the game world
const VERSION = '5.3.14.1';

/**
 * Reduces multiple consecutive whitespaces to a single space.
 * @param {string} str - The input string to clean.
 * @returns {string} - The sanitized string.
 */
function collapseWhitespace(str) {
    return str.trim().replace(/\s+/g, ' ');
}

/**
 * Returns an object with three properties: skill name, specialization, and skill value. 
 * @param {String} str the skill string (line) to parse
 * @returns the parsed object like {name: string, specialization: [string...], value: number}
 */
function splitSkillString(str) {
    const openingBracket = str.indexOf('(');
    const closingBracket = str.indexOf(')');
    let specializationString = '';
    let skillString = str;
    if (openingBracket !== -1) {
        specializationString = str.slice(openingBracket + 1, closingBracket);
        skillString = str.slice(0, openingBracket) + str.slice(closingBracket + 1, str.length)
    }
    return {
        name: skillString.split(' ')[0],
        specializations: specializationString === '' ? [] : specializationString.split('|'),
        value: skillString.split(' ')[skillString.split(' ').length - 1]
    }
}

/**
 * 
 * @param {String} s 
 * @param {String} opening 
 * @param {String} closing 
 * @param {String} original 
 * @param {String} replacement 
 * @returns 
 */
function replaceBetweenOld(s, opening, closing, original, replacement) {

    let replace = false;
    let r = s;

    for (let i = 0; i < s.length; i++) {
        if (s[i] === opening) {
            replace = true;
        }
        if (s[i] === closing) {
            replace = false;
        }

        if (replace && s[i] === original) {
            r = r.slice(0, i);
            r += replacement;
            r += s.slice(i + 1);
        }
    }

    return r;
}

/**
 * Optimized replacement for multi-character delimiters
 */
function replaceBetween(s, opening, closing, original, replacement) {
    let result = '';
    let lastIndex = 0;
    let openIndex = s.indexOf(opening);

    while (openIndex !== -1) {
        // 1. Add everything before the opening delimiter
        result += s.substring(lastIndex, openIndex + opening.length);

        // 2. Find the closing delimiter
        let closeIndex = s.indexOf(closing, openIndex + opening.length);

        // If no closing tag is found, treat the rest of the string as "outside"
        if (closeIndex === -1) break;

        // 3. Extract the inner content and replace the target string
        // We use a Regex with the 'g' flag for global replacement inside the block
        let innerContent = s.substring(openIndex + opening.length, closeIndex);
        result += innerContent.split(original).join(replacement);

        // 4. Update indices to move past the closing tag
        lastIndex = closeIndex;
        openIndex = s.indexOf(opening, lastIndex);
    }

    // Add any remaining trailing text
    result += s.substring(lastIndex);
    return result;
}

/**
 * Process command line arguments.
 */
for (const a of process.argv) {

    /**
     * Display help, for both Unix and Windows conventions (not old windows/DOS though).
     */
    if (a.toLocaleLowerCase().startsWith("--help") || a.toLocaleLowerCase().startsWith("-help")) {

        const HELP_INDENT = '  ';

        console.log(color(consoleColors.green, `SPC-Importer v${VERSION}`));
        console.log();
        console.log(color(consoleColors.gray, `${HELP_INDENT}https://github.com/itteerde/vtmtr/tree/main/src/spcimporter`));
        console.log();
        console.log(`${HELP_INDENT}Before importing new Actors, export a fresh template from FVTT for version compatibility.`)
        console.log(`${HELP_INDENT}If versions don't match anymore, update the importer (check changes, then update VERSION).`)
        console.log();

        process.exit();
    }
}

const data = await fs.readFile('./src/spcimporter/v-template.json', 'utf-8');
const character = JSON.parse(data);
const pasted = await fs.readFile('./src/spcimporter/pasted.txt', 'utf-8');

if (!VERSION.startsWith(character._stats.systemVersion)) {
    console.log(color(consoleColors.red, `Incompatible versions, need to update importer (template: ${character._stats.systemVersion}, importer: ${VERSION}).`));
    process.exit();
}

/**
 * the whole skills subtree to be modified and written back. Arguably that not being present in the template indicates we are using a bad template and should improve that. Maybe change that later. The change would be trivial, just not assigning the literal here, but character.system.skills (where it will be written to after modifications, too).
 */
let skills = {
    "athletics": {
        "value": 0,
        "bonuses": [],
        "active": false,
        "description": "",
        "macroid": ""
    },
    "animalken": {
        "value": 0,
        "bonuses": [],
        "active": false,
        "description": "",
        "macroid": ""
    },
    "academics": {
        "value": 0,
        "bonuses": [],
        "active": false,
        "description": "",
        "macroid": ""
    },
    "brawl": {
        "value": 0,
        "bonuses": [],
        "active": false,
        "description": "",
        "macroid": ""
    },
    "etiquette": {
        "value": 0,
        "bonuses": [],
        "active": false,
        "description": "",
        "macroid": ""
    },
    "awareness": {
        "value": 0,
        "bonuses": [],
        "active": false,
        "description": "",
        "macroid": ""
    },
    "craft": {
        "value": 0,
        "bonuses": [],
        "active": false,
        "description": "",
        "macroid": ""
    },
    "insight": {
        "value": 0,
        "bonuses": [],
        "active": false,
        "description": "",
        "macroid": ""
    },
    "finance": {
        "value": 0,
        "bonuses": [],
        "active": false,
        "description": "",
        "macroid": ""
    },
    "drive": {
        "value": 0,
        "bonuses": [],
        "active": false,
        "description": "",
        "macroid": ""
    },
    "intimidation": {
        "value": 0,
        "bonuses": [],
        "active": false,
        "description": "",
        "macroid": ""
    },
    "investigation": {
        "value": 0,
        "bonuses": [],
        "active": false,
        "description": "",
        "macroid": ""
    },
    "firearms": {
        "value": 0,
        "bonuses": [],
        "active": false,
        "description": "",
        "macroid": ""
    },
    "leadership": {
        "value": 0,
        "bonuses": [],
        "active": false,
        "description": "",
        "macroid": ""
    },
    "medicine": {
        "value": 0,
        "bonuses": [],
        "active": false,
        "description": "",
        "macroid": ""
    },
    "larceny": {
        "value": 0,
        "bonuses": [],
        "active": false,
        "description": "",
        "macroid": ""
    },
    "performance": {
        "value": 0,
        "bonuses": [],
        "active": false,
        "description": "",
        "macroid": ""
    },
    "occult": {
        "value": 0,
        "bonuses": [],
        "active": false,
        "description": "",
        "macroid": ""
    },
    "melee": {
        "value": 0,
        "bonuses": [],
        "active": false,
        "description": "",
        "macroid": ""
    },
    "persuasion": {
        "value": 0,
        "bonuses": [],
        "active": false,
        "description": "",
        "macroid": ""
    },
    "politics": {
        "value": 0,
        "bonuses": [],
        "active": false,
        "description": "",
        "macroid": ""
    },
    "stealth": {
        "value": 0,
        "bonuses": [],
        "active": false,
        "description": "",
        "macroid": ""
    },
    "streetwise": {
        "value": 0,
        "bonuses": [],
        "active": false,
        "description": "",
        "macroid": ""
    },
    "science": {
        "value": 0,
        "bonuses": [],
        "active": false,
        "description": "",
        "macroid": ""
    },
    "survival": {
        "value": 0,
        "bonuses": [],
        "active": false,
        "description": "",
        "macroid": ""
    },
    "subterfuge": {
        "value": 0,
        "bonuses": [],
        "active": false,
        "description": "",
        "macroid": ""
    },
    "technology": {
        "value": 0,
        "bonuses": [],
        "active": false,
        "description": "",
        "macroid": ""
    }
};

let disciplines = {};

//background information

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
    character.system.headers.ambition = collapseWhitespace(pasted.match(/Ambition:\s*([\s\S]*?)\s*Convictions/)[1]);
} else {
    console.log(color(consoleColors.yellow, `WARNING: 'Ambition' not found, skipping.`));
}

if (pasted.match(/Convictions:\s*([\s\S]*?)\s*Touchstones/)) {
    character.system.headers.touchstones = `<div><b>Convictions: </b> ${collapseWhitespace(pasted.match(/Convictions:\s*([\s\S]*?)\s*Touchstones/)[1])}</div>`;
} else {
    console.log(color(consoleColors.yellow, `WARNING: 'Convictions' not found, skipping.`));
}

if (pasted.match(/Touchstones:\s*([\s\S]*?)\s*Humanity/)) {
    character.system.headers.touchstones += `<div><b>Touchstones: </b> ${collapseWhitespace(pasted.match(/Touchstones:\s*([\s\S]*?)\s*Humanity/)[1])}</div>`;
} else {
    console.log(color(consoleColors.yellow, `WARNING: 'Touchstones' not found, skipping.`));
}

if (pasted.match(/Humanity:\s*(.*)/)) {
    character.system.humanity.value = parseInt(pasted.match(/Humanity:\s*(.*)/)[1]);
} else {
    console.log(color(consoleColors.yellow, `WARNING: 'Humanity' not found, skipping.`));
}

//strength of blood

if (pasted.match(/Generation:\s*(.*)/)) {
    character.system.headers.generation = pasted.match(/Generation:\s*(.*)/)[1];
} else {
    console.log(color(consoleColors.yellow, `WARNING: 'Generation' not found, skipping.`));
}

if (pasted.match(/Blood Potency:\s*(.*)/)) {
    character.system.blood.potency = parseInt(pasted.match(/Blood Potency:\s*(.*)/)[1]);
} else {
    console.log(color(consoleColors.yellow, `WARNING: 'Blood Potency' not found, skipping.`));
}

//physical stats

if (pasted.match(/Strength\s*([\s\S]*?)\s*, Dexterity/)) {
    character.system.attributes.strength = { value: parseInt(pasted.match(/Strength\s*([\s\S]*?)\s*, Dexterity/)[1]) };
} else {
    console.log(color(consoleColors.yellow, `WARNING: 'Strength' not found, skipping.`));
}

if (pasted.match(/Dexterity\s*([\s\S]*?)\s*, Stamina/)) {
    character.system.attributes.dexterity = { value: parseInt(pasted.match(/Dexterity\s*([\s\S]*?)\s*, Stamina/)[1]) };
} else {
    console.log(color(consoleColors.yellow, `WARNING: 'Dexterity' not found, skipping.`));
}

if (pasted.match(/Stamina\s*([\s\S]*?)\s*;/)) {
    character.system.attributes.stamina = { value: parseInt(pasted.match(/Stamina\s*([\s\S]*?)\s*;/)[1]) };
} else {
    console.log(color(consoleColors.yellow, `WARNING: 'Stamina' not found, skipping.`));
}

//social stats

if (pasted.match(/Charisma\s*([\s\S]*?)\s*, Manipulation/)) {
    character.system.attributes.charisma = { value: parseInt(pasted.match(/Charisma\s*([\s\S]*?)\s*, Manipulation/)[1]) };
} else {
    console.log(color(consoleColors.yellow, `WARNING: 'Charisma' not found, skipping.`));
}

if (pasted.match(/Manipulation\s*([\s\S]*?)\s*, Composure/)) {
    character.system.attributes.manipulation = { value: parseInt(pasted.match(/Manipulation\s*([\s\S]*?)\s*, Composure/)[1]) };
} else {
    console.log(color(consoleColors.yellow, `WARNING: 'Manipulation' not found, skipping.`));
}

if (pasted.match(/Composure\s*([\s\S]*?)\s*;/)) {
    character.system.attributes.composure = { value: parseInt(pasted.match(/Composure\s*([\s\S]*?)\s*;/)[1]) };
} else {
    console.log(color(consoleColors.yellow, `WARNING: 'Stamina' not found, skipping.`));
}

//mental stats

if (pasted.match(/Intelligence\s*([\s\S]*?)\s*, Wits/)) {
    character.system.attributes.intelligence = { value: parseInt(pasted.match(/Intelligence\s*([\s\S]*?)\s*, Wits/)[1]) };
} else {
    console.log(color(consoleColors.yellow, `WARNING: 'Intelligence' not found, skipping.`));
}

if (pasted.match(/Wits\s*([\s\S]*?)\s*, Resolve/)) {
    character.system.attributes.wits = { value: parseInt(pasted.match(/Wits\s*([\s\S]*?)\s*, Resolve/)[1]) };
} else {
    console.log(color(consoleColors.yellow, `WARNING: 'Wits' not found, skipping.`));
}

if (pasted.match(/Resolve\s*([\s\S]*?)\s*Secondary Attributes:/)) {
    character.system.attributes.resolve = { value: parseInt(pasted.match(/Resolve\s*([\s\S]*?)\s*Secondary Attributes:/)[1]) };
} else {
    console.log(color(consoleColors.yellow, `WARNING: 'Resolve' not found, skipping.`));
}

//derived stats

if (pasted.match(/Health\s*([\s\S]*?)\s*, Willpower/)) {
    character.system.health.max = parseInt(pasted.match(/Health\s*([\s\S]*?)\s*, Willpower/)[1]);
} else {
    console.log(color(consoleColors.yellow, `WARNING: 'Health' not found, skipping.`));
}

if (pasted.match(/Willpower\s*([\s\S]*?)\s*Skills:/)) {
    character.system.willpower.max = parseInt(pasted.match(/Willpower\s*([\s\S]*?)\s*Skills:/)[1]);
} else {
    console.log(color(consoleColors.yellow, `WARNING: 'Willpower' not found, skipping.`));
}

//skills

if (pasted.match(/Skills:\s*([\s\S]*?)\s*Disciplines/)) {

    let skillsGroups = (pasted.match(/Skills:\s*([\s\S]*?)\s*Disciplines/)[1]);
    skillsGroups = replaceBetween(skillsGroups, '(', ')', ',', '|');
    skillsGroups = skillsGroups.split(";");
    for (let g of skillsGroups) {
        g = collapseWhitespace(g);
        const skillsGroup = g.split(",");
        for (let s of skillsGroup) {
            s = collapseWhitespace(s);
            const skill = splitSkillString(s);
            skills[skill.name.toLocaleLowerCase()].value = parseInt(skill.value);
            if (skill.specializations.length > 0) {
                skills[skill.name.toLocaleLowerCase()].bonuses = [];
                for (const bonus of skill.specializations) {
                    skills[skill.name.toLocaleLowerCase()].bonuses.push({
                        source: bonus,
                        value: 1,
                        paths: [
                            'skills.' + skill.name.toLocaleLowerCase()
                        ],
                        "displayWhenInactive": true
                    })
                }
            }
        }
    }

} else {
    console.log(color(consoleColors.yellow, `WARNING: 'Skills' not found, skipping.`));
}

//disciplines

if (pasted.match(/Disciplines:\s*([\s\S]*?)\s*EndOfFile/)) {

    const disciplineExamples = (pasted.match(/Disciplines:\s*([\s\S]*?)\s*EndOfFile/)[1]).split(",");
    for (let s of disciplineExamples) {
        s = collapseWhitespace(s);
        const discipline = s.split(" ");
        disciplines[discipline[0].toLocaleLowerCase()] = {
            "visible": true,
            "selected": false,
            "value": 0
        };
        disciplines[discipline[0].toLocaleLowerCase()].value = parseInt(discipline[discipline.length - 1]);
    }
} else {
    console.log(color(consoleColors.yellow, `WARNING: 'Disciplines' not found, skipping.`));
}

// will need /Skills:\s*([\s\S]*?)\s*Disciplines/

character.system.skills = skills;
character.system.disciplines = disciplines;

await fs.writeFile('./src/spcimporter/import.json', JSON.stringify(character));

/*
Disciplines: Auspex 3, Dominate 4, Obfuscate 3,
Presence 1*/