import fs from 'fs';
import https from 'https';

const content = fs.readFileSync('./seed.js', 'utf8');
const movieMatches = [...content.matchAll(/title:\s*'([^']+)'[\s\S]*?posterUrl:\s*'([^']+)'/g)];

console.log(`Checking ${movieMatches.length} movie posters...`);

function checkPoster(title, url) {
  return new Promise((resolve) => {
    try {
      const u = new URL(url);
      const req = https.get(u, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
        }
      }, (res) => {
        resolve({ title, url, status: res.statusCode, ok: res.statusCode === 200 });
      });
      req.on('error', (e) => resolve({ title, url, status: 0, error: e.message, ok: false }));
      req.setTimeout(5000, () => {
        req.destroy();
        resolve({ title, url, status: 408, ok: false });
      });
    } catch (e) {
      resolve({ title, url, status: 0, ok: false });
    }
  });
}

async function run() {
  const results = [];
  for (let i = 0; i < movieMatches.length; i += 10) {
    const chunk = movieMatches.slice(i, i + 10);
    const chunkResults = await Promise.all(chunk.map(m => checkPoster(m[1], m[2])));
    results.push(...chunkResults);
  }

  const failed = results.filter(r => !r.ok);
  console.log(`Failed posters: ${failed.length} / ${movieMatches.length}`);
  failed.forEach(f => console.log(`❌ [${f.status}] ${f.title}: ${f.url}`));
}

run();
