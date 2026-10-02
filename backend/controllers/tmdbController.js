import https from 'https';
import http from 'http';

const TMDB_BASE = 'https://api.tmdb.org/3';

const tmdbFetch = async (endpoint, params = {}) => {
  const TMDB_API_KEY = process.env.TMDB_API_KEY || 'a07e22bc18f5cb106bfe4cc1f83ad8ed';
  const query = new URLSearchParams({ api_key: TMDB_API_KEY, ...params });
  const url = `${TMDB_BASE}${endpoint}?${query.toString()}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CineSphere/1.0'
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`TMDb fetch error for ${endpoint}:`, error);
    throw error;
  }
};

// @desc  Search Telugu movies or actors from year 2000 to now
// @route GET /api/tmdb/search?q=bahubali&page=1
export const searchTMDb = async (req, res) => {
  try {
    const { q, page = 1 } = req.query;
    
    // If no query, fallback to popular Telugu movies
    if (!q || q.trim() === '') {
      return getTMDbPopular(req, res);
    }

    // Run both multi-search and person-search to reliably detect actors
    const [multiData, personData] = await Promise.all([
      tmdbFetch('/search/multi', { query: q, page: 1, language: 'te-IN' }),
      tmdbFetch('/search/person', { query: q, page: 1 })
    ]);

    if (multiData.errors || multiData.success === false) {
      return res.json({ success: true, results: [], totalResults: 0, message: multiData.status_message });
    }

    let topResult = null;
    
    // Condition 1: /search/multi directly says a person is the #1 match (e.g. "Allu Arjun")
    if (multiData.results && multiData.results[0] && multiData.results[0].media_type === 'person') {
       topResult = multiData.results[0];
    } 
    // Condition 2: /search/person found someone highly popular (e.g. "ntr" -> Jr NTR popularity ~2.7)
    // This bypasses cases where a movie or TV show outranks the actor in standard text search.
    else if (personData.results && personData.results.length > 0) {
       const popularPersons = [...personData.results].sort((a, b) => b.popularity - a.popularity);
       if (popularPersons[0].popularity >= 1.2) {
          topResult = popularPersons[0];
       }
    }
    
    if (topResult) {
       // It's an actor/person search! Fetch all their movies at once.
       const creditsData = await tmdbFetch(`/person/${topResult.id}/movie_credits`, { language: 'te-IN' });
       
       let actorMovies = creditsData.cast || [];
       
       // Filter to prioritize Telugu movies if desired, or just show all. 
       // Often they act in multiple languages, but let's just return all of them sorted by popularity
       actorMovies.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

       // Remove duplicates (sometimes actors have duplicate credits for different roles)
       const uniqueMovies = [];
       const seenIds = new Set();
       for (const m of actorMovies) {
         if (!seenIds.has(m.id)) {
           seenIds.add(m.id);
           uniqueMovies.push(m);
         }
       }

       return res.json({
         success: true,
         results: uniqueMovies,
         totalResults: uniqueMovies.length,
         page: 1, // Always force page 1
         totalPages: 1, // All results on a single page!
         personName: topResult.name
       });
    }

    // If it wasn't a person, fallback to standard movie search to handle pagination correctly
    const movieData = await tmdbFetch('/search/movie', { query: q, page, language: 'te-IN' });

    res.json({
      success: true,
      results: movieData.results || [],
      totalResults: movieData.total_results || 0,
      page: parseInt(page),
      totalPages: movieData.total_pages || 0,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get full movie details by TMDb ID
// @route GET /api/tmdb/movie/:id
export const getTMDbMovie = async (req, res) => {
  try {
    const { id } = req.params;
    // append credits and videos
    const data = await tmdbFetch(`/movie/${id}`, { append_to_response: 'credits,videos' });

    if (data.success === false) {
      return res.status(404).json({ success: false, message: data.status_message });
    }

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Get popular Telugu movies from 2000 to now
// @route GET /api/tmdb/popular?page=1
export const getTMDbPopular = async (req, res) => {
  try {
    const { page = 1 } = req.query;

    const params = {
      with_original_language: 'te',
      'primary_release_date.gte': '2000-01-01',
      sort_by: 'popularity.desc',
      page
    };

    const data = await tmdbFetch('/discover/movie', params);

    if (data.errors || data.success === false) {
      return res.json({ success: true, results: [], totalResults: 0 });
    }

    res.json({
      success: true,
      results: data.results || [],
      totalResults: data.total_results || 0,
      page: parseInt(page),
      totalPages: data.total_pages || 0,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
