import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedPath = path.join(__dirname, '../../../../../../../movies explorer/backend/seed.js');
let seedContent = fs.readFileSync(seedPath, 'utf-8');

// Regex to find all actor blocks with wikimedia links
const actorRegex = /(image:\s*')https:\/\/upload\.wikimedia([^']+)/g;

let replacements = 0;

seedContent = seedContent.replace(actorRegex, (match, prefix, rest) => {
  replacements++;
  // We use wsrv.nl to proxy the image and bypass Wikipedia hotlinking protections
  return `${prefix}https://wsrv.nl/?url=https://upload.wikimedia${rest}`;
});

fs.writeFileSync(seedPath, seedContent, 'utf-8');
console.log(`Successfully proxied ${replacements} actor images in seed.js!`);
