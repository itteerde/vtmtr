const CONFIG = {
    db_path: './db',
    version: '0.0.0.1',
    debug_level: 0
};

import { Level } from 'level';
import fs from 'node:fs/promises';
import { color, consoleColors } from '../lib/colorize.mjs';

/**
 * Returns an array of all keys in a LevelDB database.
 * @param {string} dbPath - The file system path to the database.
 * @returns {Promise<string[]>} - A promise that resolves to an array of keys.
 */
export async function getAllKeys(dbPath) {
    const db = new Level(dbPath);
    const keys = [];

    try {
        // We use the keys() iterator to avoid loading full values into memory
        for await (const key of db.keys()) {
            keys.push(key);
        }
    } catch (error) {
        console.error('Error reading LevelDB keys:', error);
        throw error;
    } finally {
        // Always close the database to release the file lock
        await db.close();
    }

    return keys;
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

        console.log(color(consoleColors.green, `Notes-Export v${CONFIG.version}`));
        console.log();
        console.log(`${HELP_INDENT}--debug run with debugging output.`);
        console.log();

        process.exit();
    }

    if (a.toLocaleLowerCase().startsWith("--debug") || a.toLocaleLowerCase().startsWith("-debug")) {
        CONFIG.debug_level = 3;
    }
}

