import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const apiUrl = process.env.API_URL || 'http://localhost:3000';
const production = process.env.API_URL ? true : false;

const filePath = join(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  'src',
  'environments',
  'environment.ts',
);

writeFileSync(
  filePath,
  `export const environment = {\n  production: ${production},\n  apiUrl: '${apiUrl}',\n};\n`,
);

console.log(`environment.ts generated with apiUrl: ${apiUrl}`);