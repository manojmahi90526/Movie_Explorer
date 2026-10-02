import mongoose from 'mongoose';
import dotenv from 'dotenv';
import https from 'https';

dotenv.config();

const TMDB_API_KEY = process.env.TMDB_API_KEY || 'a07e22bc18f5cb106bfe4cc1f83ad8ed';

const tmdbFetch = (endpoint, params = {}) => {
  return new Promise((resolve, reject) => {
    const query = new URLSearchParams({ api_key: TMDB_API_KEY, ...params });
    const url = `https://api.tmdb.org/3${endpoint}?${query.toString()}`;
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const sync = async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cinesphere');
  
  // Need to import Movie model
  const Movie = (await import('../models/Movie.js')).default;
  
  const movies = await Movie.find({});
  console.log(`Found ${movies.length} movies to sync.`);
  
  for (let i = 0; i < movies.length; i++) {
    const movie = movies[i];
    console.log(`Syncing ${movie.title}...`);
    try {
      const res = await tmdbFetch('/search/movie', { query: movie.title, language: 'te-IN' });
      if (res.results && res.results.length > 0) {
        // filter by year if possible
        let match = res.results[0];
        const yearMatches = res.results.filter(m => m.release_date && m.release_date.startsWith(movie.releaseYear.toString()));
        if (yearMatches.length > 0) match = yearMatches[0];

        let updated = false;
        
        if (match.poster_path) {
          movie.posterUrl = `https://image.tmdb.org/t/p/w500${match.poster_path}`;
          movie.bannerUrl = `https://image.tmdb.org/t/p/w1280${match.backdrop_path || match.poster_path}`;
          updated = true;
        }
        if (match.vote_average) {
          movie.rating = match.vote_average;
          updated = true;
        }
        
        if (updated) {
          await movie.save();
          console.log(`-> Updated ${movie.title}`);
        }
      }
    } catch (e) {
      console.error(`Failed to sync ${movie.title}:`, e.message);
    }
    await delay(100); // 100ms delay to respect rate limit (10/sec)
  }
  
  console.log('Finished syncing.');
  process.exit(0);
};

sync();
