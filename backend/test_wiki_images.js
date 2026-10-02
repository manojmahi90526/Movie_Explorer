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

async function getWikiImage(movieTitle) {
  const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(movieTitle)}&prop=images|pageimages&format=json&pithumbsize=500`;
  const res = await fetchJson(searchUrl);
  const pages = res?.query?.pages || {};
  const page = Object.values(pages)[0];
  console.log(movieTitle, '-> thumbnail:', page?.thumbnail?.source);
  if (page?.images) {
    console.log('   images:', page.images.map(i => i.title));
  }
}

async function run() {
  await getWikiImage('Pokiri');
  await getWikiImage('Athadu');
  await getWikiImage('Magadheera');
  await getWikiImage('Kushi (2001 film)');
  await getWikiImage('Okkadu');
}
run();
