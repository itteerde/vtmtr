import fs from 'node:fs/promises';

const data = await fs.readFile('./src/spcimporter/v-template.json', 'utf-8');
const template = JSON.parse(data);

console.log(template);