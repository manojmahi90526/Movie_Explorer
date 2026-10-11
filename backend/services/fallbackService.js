import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const seedDataPath = path.resolve(__dirname, '../data/seedData.json');

let seedCache = null;

export const loadSeedData = () => {
  if (seedCache) return seedCache;
  try {
    if (fs.existsSync(seedDataPath)) {
      const raw = fs.readFileSync(seedDataPath, 'utf-8');
      seedCache = JSON.parse(raw);
      return seedCache;
    }
  } catch (err) {
    console.error('Failed to load seedData.json cache:', err.message);
  }
  return { movies: [], actors: [], platforms: [], reviews: [] };
};

const RELEASED_REGEX = /(Hari\s*Hara|Harihara|Raja\s*Sa+b|Rajasa+b|Mirai|Merai)/i;
const REMOVE_REGEX = /(OG\b|They Call Him OG|HIT.*3|HIT.*Third)/i;

/**
 * Filter, sort, and return movies from in-memory seed dataset
 */
export const getFallbackMovies = ({ search, genre, status, platform, sort }) => {
  const data = loadSeedData();
  let list = (data.movies || []).filter((m) => !REMOVE_REGEX.test(m.title));

  // Auto-correct status for known released titles
  list = list.map((m) => {
    if (RELEASED_REGEX.test(m.title)) {
      return { ...m, status: 'Released' };
    }
    return m;
  });

  // Filter by status
  if (status && status !== 'All') {
    if (status === 'Upcoming') {
      list = list.filter((m) => m.status === 'Upcoming' && !RELEASED_REGEX.test(m.title));
    } else if (status === 'Released') {
      list = list.filter((m) => m.status === 'Released' || RELEASED_REGEX.test(m.title));
    }
  }

  // Filter by genre
  if (genre && genre !== 'All') {
    const gLower = genre.toLowerCase();
    list = list.filter((m) =>
      Array.isArray(m.genre) && m.genre.some((g) => g.toLowerCase() === gLower)
    );
  }

  // Filter by streaming platform ID
  if (platform && platform !== 'All') {
    list = list.filter((m) =>
      Array.isArray(m.streamingPlatforms) &&
      m.streamingPlatforms.some((sp) => {
        const pId = sp.platform?._id ? String(sp.platform._id) : String(sp.platform);
        return pId === String(platform);
      })
    );
  }

  // Search filter (title, briefStory, characterName, actor name)
  if (search && search.trim() !== '') {
    const term = search.trim().toLowerCase();
    list = list.filter((m) => {
      const titleMatch = (m.title || '').toLowerCase().includes(term);
      const storyMatch = (m.briefStory || '').toLowerCase().includes(term);
      const charMatch =
        Array.isArray(m.characters) &&
        m.characters.some(
          (c) =>
            (c.characterName || '').toLowerCase().includes(term) ||
            (c.actor?.name || '').toLowerCase().includes(term)
        );
      return titleMatch || storyMatch || charMatch;
    });
  }

  // Sorting
  const sorted = [...list].sort((a, b) => {
    if (sort === 'rating') return (b.rating || 0) - (a.rating || 0);
    if (sort === 'box_office') {
      const gA = a.boxOffice?.grossInCrores || 0;
      const gB = b.boxOffice?.grossInCrores || 0;
      return gB - gA;
    }
    if (sort === 'year_desc') return (b.releaseYear || 0) - (a.releaseYear || 0);
    if (sort === 'year_asc') return (a.releaseYear || 0) - (b.releaseYear || 0);
    if (sort === 'title') return (a.title || '').localeCompare(b.title || '');
    // Default
    return (b.releaseYear || 0) - (a.releaseYear || 0);
  });

  return sorted;
};

/**
 * Get single movie by ID from in-memory seed dataset
 */
export const getFallbackMovieById = (id) => {
  const data = loadSeedData();
  const movie = (data.movies || []).find((m) => String(m._id) === String(id));
  if (!movie) return null;
  if (REMOVE_REGEX.test(movie.title)) return null;
  if (RELEASED_REGEX.test(movie.title)) {
    return { ...movie, status: 'Released' };
  }
  return movie;
};

/**
 * Get all actors with movie counts from in-memory seed dataset
 */
export const getFallbackActors = ({ search, roleType } = {}) => {
  const data = loadSeedData();
  let list = data.actors || [];

  if (search && search.trim() !== '') {
    const term = search.trim().toLowerCase();
    list = list.filter((a) => (a.name || '').toLowerCase().includes(term));
  }

  if (roleType && roleType !== 'All') {
    list = list.filter((a) => a.roleType === roleType);
  }

  const allMovies = (data.movies || []).filter((m) => !REMOVE_REGEX.test(m.title));

  return list.map((actor) => {
    const actorIdStr = String(actor._id);
    const actorMovies = allMovies.filter((m) =>
      Array.isArray(m.characters) &&
      m.characters.some((c) => String(c.actor?._id || c.actor) === actorIdStr)
    );

    const upcomingMovies = actorMovies.filter(
      (m) => m.status === 'Upcoming' && !RELEASED_REGEX.test(m.title)
    );

    return {
      ...actor,
      totalMovies: actorMovies.length,
      upcomingCount: upcomingMovies.length,
    };
  });
};

/**
 * Get single actor with previous & upcoming movies from in-memory seed dataset
 */
export const getFallbackActorById = (id) => {
  const data = loadSeedData();
  const actor = (data.actors || []).find((a) => String(a._id) === String(id));
  if (!actor) return null;

  const actorIdStr = String(actor._id);
  const allMovies = (data.movies || []).filter((m) => !REMOVE_REGEX.test(m.title));

  const actorMovies = allMovies.filter((m) =>
    Array.isArray(m.characters) &&
    m.characters.some((c) => String(c.actor?._id || c.actor) === actorIdStr)
  );

  const previousMovies = actorMovies.filter(
    (m) => m.status === 'Released' || RELEASED_REGEX.test(m.title)
  );
  const upcomingMovies = actorMovies.filter(
    (m) => m.status === 'Upcoming' && !RELEASED_REGEX.test(m.title)
  );

  return {
    ...actor,
    previousMovies,
    upcomingMovies,
  };
};

/**
 * Get platforms from in-memory seed dataset
 */
export const getFallbackPlatforms = () => {
  const data = loadSeedData();
  return data.platforms || [];
};

/**
 * Get reviews from in-memory seed dataset
 */
export const getFallbackReviews = (movieId) => {
  const data = loadSeedData();
  if (movieId) {
    return (data.reviews || []).filter((r) => String(r.movie) === String(movieId));
  }
  return data.reviews || [];
};
