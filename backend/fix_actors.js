import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedPath = path.join(__dirname, '../../../../../../../movies explorer/backend/seed.js');
let seedContent = fs.readFileSync(seedPath, 'utf-8');

// Regex to find all actor blocks with wikimedia links
const actorRegex = /name:\s*'([^']+)',\s*image:\s*'https:\/\/upload\.wikimedia[^']+'/g;

let replacements = 0;
const TMDB_API_KEY = 'a07e22bc18f5cb106bfe4cc1f83ad8ed'; // from backend/.env

async function fixImages() {
  const matches = [...seedContent.matchAll(actorRegex)];
  
  for (const match of matches) {
    const fullString = match[0];
    const actorName = match[1];
    
    try {
      console.log(`Searching TMDB for: ${actorName}`);
      let searchName = actorName;
      if (searchName === 'NTR Jr.') searchName = 'N.T. Rama Rao Jr.';
      
      const response = await fetch(`https://api.themoviedb.org/3/search/person?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(searchName)}`);
      const data = await response.json();
      
      const person = data.results[0];
      if (person && person.profile_path) {
        const newImageUrl = `https://image.tmdb.org/t/p/w500${person.profile_path}`;
        console.log(`Found TMDB image for ${actorName}: ${newImageUrl}`);
        
        const newString = fullString.replace(
          /image:\s*'https:\/\/upload\.wikimedia[^']+/,
          `image: '${newImageUrl}`
        );
        seedContent = seedContent.replace(fullString, newString);
        replacements++;
      } else {
        console.log(`No TMDB image found for ${actorName}`);
      }
    } catch (err) {
      console.error(`Error fetching TMDB for ${actorName}`, err.message);
    }
  }
  
  fs.writeFileSync(seedPath, seedContent, 'utf-8');
  console.log(`Successfully replaced ${replacements} actor images in seed.js!`);
}

fixImages();
