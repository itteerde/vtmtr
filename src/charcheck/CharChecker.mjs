import fs from 'node:fs/promises';
import { statSync } from 'node:fs';
import { color, consoleColors } from '../lib/colorize.mjs';

const CONFIG = {
    version: '5.3.15.1',
    debug_level: 0,
    force_download: false,
    ignore_versions: false
};

/**
 * Fetches file content from a URL and returns it as a string.
 * @param {string} url - The remote file location.
 * @returns {Promise<string>} - The file content.
 */
async function fetchFileContent(url) {
    try {
        const response = await fetch(url);

        // Check if the request was successful (status 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Return the body content as a string
        return await response.text();
    } catch (error) {
        console.error("Failed to fetch file:", error.message);
        throw error;
    }
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

        console.log(color(consoleColors.green, `Character Checker v${CONFIG.version}`));
        console.log();
        console.log(color(consoleColors.gray, `${HELP_INDENT}https://github.com/itteerde/vtmtr/tree/main/src/charcheck`));
        console.log();
        console.log(`${HELP_INDENT}If versions don't match anymore, update the importer (check changes, then update CONFIG.version).`);
        console.log();
        console.log(`${HELP_INDENT}--debug run with debugging output.`);
        console.log(`${HELP_INDENT}--forceDownload forces downloading the manifest.`);
        console.log(`${HELP_INDENT}--ignoreVersions ignores versions, allowing to use while in conflict.`);
        console.log();

        process.exit();
    }

    if (a.toLocaleLowerCase().startsWith("--debug") || a.toLocaleLowerCase().startsWith("-debug")) {
        CONFIG.debug_level = 3;
    }

    if (a.toLocaleLowerCase().startsWith("--forcedownload") || a.toLocaleLowerCase().startsWith("-forcedownload")) {
        CONFIG.force_download = true;
    }

    if (a.toLocaleLowerCase().startsWith("--ignoreversions") || a.toLocaleLowerCase().startsWith("-ignoreversions")) {
        CONFIG.ignore_versions = true;
    }
}

const data = await fs.readFile('./src/charcheck/data/emilie-autumn.json', 'utf-8');
const character = JSON.parse(data);

console.log(color(consoleColors.green, `Char Checker v${CONFIG.version}`));

if (!CONFIG.ignore_versions && !CONFIG.version.startsWith(character._stats.systemVersion)) {
    console.log(color(consoleColors.red, `Incompatible versions, need to update importer (template: ${character._stats.systemVersion}, importer: ${CONFIG.version}).`));
    process.exit();
}

const MANIFEST_URL = 'https://raw.githubusercontent.com/WoD5E-Developers/wod5e/refs/heads/main/system.json';

let dateManifest = new Date('2000-01-01');
if (CONFIG.debug_level > 0) console.log({ dateManifest: dateManifest });
try {
    await fs.access('./src/charcheck/system.json');
    dateManifest = statSync('./src/charcheck/system.json').mtime;
} catch (error) {
    console.error(error);
}
let manifest = undefined;
if (CONFIG.force_download || new Date() - dateManifest > (24 * 3600000)) {
    manifest = JSON.parse(await fetchFileContent(MANIFEST_URL));
    await fs.writeFile('./src/charcheck/data/system.json', JSON.stringify(manifest));
    console.log(color(consoleColors.gray, `${CONFIG.force_download ? 'forced manifest download' : 'manifest cached outdated'}, caching ${new Date()}.`));
} else {
    manifest = JSON.parse(await fs.readFile('./src/charcheck/system.json', 'utf-8'));
    console.log(color(consoleColors.gray, `manifest cached ${dateManifest}.`));
}
if (CONFIG.debug_level > 0) console.log(manifest);

if (!CONFIG.ignore_versions && !CONFIG.version.startsWith(manifest.version)) {
    console.log(color(consoleColors.red, `Incompatible versions, need to update importer (system manifest: ${manifest.version}, importer: ${CONFIG.version}).`));
    console.log(color(consoleColors.gray, `see ${MANIFEST_URL}`));
    process.exit();
}

