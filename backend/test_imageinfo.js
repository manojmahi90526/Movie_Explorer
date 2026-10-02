import https from 'https';

function fetchJson(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'CineSphereApp/1.0 (contact@cinesphere.com)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { resolve(null); }
      });
    }).on('error', () => resolve(null));
  });
}

async function getDirectImageUrl(fileName) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(fileName)}&prop=imageinfo&iiprop=url&format=json`;
  const res = await fetchJson(url);
  const pages = res?.query?.pages || {};
  const page = Object.values(pages)[0];
  const directUrl = page?.imageinfo?.[0]?.url;
  console.log(fileName, '=>', directUrl);
  return directUrl;
}

async function run() {
  await getDirectImageUrl('File:Pokiri movie poster.jpg');
  await getDirectImageUrl('File:Athadu Poster.jpg');
  await getDirectImageUrl('File:Magadheera Poster.jpg');
  await getDirectImageUrl('File:Kushi Theatrical Poster.jpg');
  await getDirectImageUrl('File:Okkadu poster.jpg');
}
run();
