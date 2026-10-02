import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Add JWT token to every request if present
API.interceptors.request.use((config) => {
  const user = localStorage.getItem('cinesphere_user');
  if (user) {
    try {
      const parsed = JSON.parse(user);
      if (parsed.token) {
        config.headers.Authorization = `Bearer ${parsed.token}`;
      }
    } catch (e) {
      console.error('Failed to parse user token', e);
    }
  }
  return config;
});

// Movie APIs
export const fetchMovies = (params) => API.get('/movies', { params });
export const fetchMovieById = (id) => API.get(`/movies/${id}`);
export const createMovie = (data) => API.post('/movies', data);
export const updateMovie = (id, data) => API.put(`/movies/${id}`, data);
export const deleteMovie = (id) => API.delete(`/movies/${id}`);

// Actor APIs
export const fetchActors = (params) => API.get('/actors', { params });
export const fetchActorById = (id) => API.get(`/actors/${id}`);
export const createActor = (data) => API.post('/actors', data);
export const updateActor = (id, data) => API.put(`/actors/${id}`, data);
export const deleteActor = (id) => API.delete(`/actors/${id}`);

// Review APIs
export const fetchReviews = (params) => API.get('/reviews', { params });
export const createReview = (data) => API.post('/reviews', data);
export const deleteReview = (id) => API.delete(`/reviews/${id}`);

// Platform APIs
export const fetchPlatforms = () => API.get('/platforms');
export const createPlatform = (data) => API.post('/platforms', data);

// Auth APIs
export const loginApi = (credentials) => API.post('/auth/login', credentials);
export const registerApi = (data) => API.post('/auth/register', data);
export const fetchCurrentUser = () => API.get('/auth/me');

// TMDb (Discover) APIs — proxied through our backend
export const tmdbSearch = (q, page = 1) => API.get('/tmdb/search', { params: { q, page } });
export const tmdbPopular = (page = 1) => API.get('/tmdb/popular', { params: { page } });
export const tmdbGetMovie = (tmdbId) => API.get(`/tmdb/movie/${tmdbId}`);

export default API;
