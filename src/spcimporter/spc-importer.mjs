import fs from 'node:fs/promises';

const data = await fs.readFile('./src/spcimporter/v-template.json', 'utf-8');
const character = JSON.parse(data);

console.log(character);

const pasted = await fs.readFile('./src/spcimporter/pasted.txt', 'utf-8');

await fs.writeFile('./src/spcimporter/import.json', JSON.stringify(character));