const CONFIG = {
    db_path: '',
    version: '',
    debug_level: 0
};

import { Level } from 'level';

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