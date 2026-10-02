import React, { useState, useEffect, useCallback } from 'react';
import HeroBanner from '../components/HeroBanner';
import SearchFilterBar from '../components/SearchFilterBar';
import MovieCard from '../components/MovieCard';
import MovieDetailsModal from '../components/MovieDetailsModal';
import ActorDetailsModal from '../components/ActorDetailsModal';
import TMDbMovieCard from '../components/TMDbMovieCard';
import TMDbMovieModal from '../components/TMDbMovieModal';
import { fetchMovies, fetchPlatforms, fetchMovieById, tmdbSearch, tmdbPopular } from '../services/api';
import { Film, Sparkles, RefreshCw, Globe, Database, Search, ChevronLeft, ChevronRight } from 'lucide-react';

const MoviesPage = () => {
  // ── Active tab ─────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('collection'); // 'collection' | 'discover'

  // ── My Collection state ────────────────────────────────────────────────
  const [movies, setMovies] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [sortOption, setSortOption] = useState('rating');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedActor, setSelectedActor] = useState(null);

  // ── Discover (TMDb) state ──────────────────────────────────────────────
  const [discoverMovies, setDiscoverMovies] = useState([]);
  const [discoverLoading, setDiscoverLoading] = useState(false);
  const [discoverSearch, setDiscoverSearch] = useState('');
  const [discoverPage, setDiscoverPage] = useState(1);
  const [discoverTotal, setDiscoverTotal] = useState(0);
  const [discoverTotalPages, setDiscoverTotalPages] = useState(1);
  const [selectedTMDbMovie, setSelectedTMDbMovie] = useState(null);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [discoverPersonName, setDiscoverPersonName] = useState(null);

  // ── Load Platforms (for My Collection filter) ──────────────────────────
  useEffect(() => {
    const loadPlatforms = async () => {
      try {
        const res = await fetchPlatforms();
        if (res.data.success) setPlatforms(res.data.data);
      } catch (err) {
        console.error('Failed to load platforms', err);
      }
    };
    loadPlatforms();
  }, []);

  // ── Fetch My Collection ────────────────────────────────────────────────
  const loadMovies = async () => {
    setLoading(true);
    try {
      const params = { search: searchQuery, genre: selectedGenre, status: selectedStatus, platform: selectedPlatform, sort: sortOption };
      const res = await fetchMovies(params);
      if (res.data.success) setMovies(res.data.data);
    } catch (err) {
      console.error('Failed to fetch movies', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => loadMovies(), 250);
    return () => clearTimeout(t);
  }, [searchQuery, selectedGenre, selectedStatus, selectedPlatform, sortOption]);

  const handleRefreshMovie = async (movieId) => {
    try {
      const res = await fetchMovieById(movieId);
      if (res.data.success) setSelectedMovie(res.data.data);
      loadMovies();
    } catch (err) {
      console.error('Failed to refresh movie', err);
    }
  };

  const handleMovieDeleted = (deletedId) => {
    setMovies((prev) => prev.filter((m) => m._id !== deletedId));
  };

  // ── Fetch Discover (TMDb) ──────────────────────────────────────────────
  const loadDiscoverMovies = useCallback(async (searchTerm, page, searchMode) => {
    setDiscoverLoading(true);
    try {
      let res;
      if (searchMode && searchTerm.trim()) {
        res = await tmdbSearch(searchTerm.trim(), page);
      } else {
        res = await tmdbPopular(page);
      }
      if (res.data.success) {
        setDiscoverMovies(res.data.results || []);
        setDiscoverTotal(res.data.totalResults || 0);
        setDiscoverTotalPages(res.data.totalPages || 1);
        setDiscoverPersonName(res.data.personName || null);
      } else {
        setDiscoverMovies([]);
        setDiscoverTotal(0);
        setDiscoverPersonName(null);
      }
    } catch (err) {
      console.error('Failed to fetch discover movies', err);
      setDiscoverMovies([]);
      setDiscoverTotal(0);
      setDiscoverPersonName(null);
    } finally {
      setDiscoverLoading(false);
    }
  }, []);

  // Load discover when tab becomes active or page changes
  useEffect(() => {
    if (activeTab === 'discover') {
      loadDiscoverMovies(discoverSearch, discoverPage, isSearchMode);
    }
  }, [activeTab, discoverPage, isSearchMode, loadDiscoverMovies]);

  // Debounced search in discover
  useEffect(() => {
    if (activeTab !== 'discover') return;
    const t = setTimeout(() => {
      setDiscoverPage(1);
      setIsSearchMode(discoverSearch.trim().length > 0);
      loadDiscoverMovies(discoverSearch, 1, discoverSearch.trim().length > 0);
    }, 400);
    return () => clearTimeout(t);
  }, [discoverSearch]);

  // ── Tab styles ─────────────────────────────────────────────────────────
  const tabStyle = (tab) => ({
    padding: '10px 24px',
    borderRadius: '10px',
    border: activeTab === tab ? '1px solid rgba(99,102,241,0.6)' : '1px solid rgba(255,255,255,0.08)',
    background: activeTab === tab ? 'rgba(99,102,241,0.18)' : 'rgba(255,255,255,0.03)',
    color: activeTab === tab ? '#c7d2fe' : '#94a3b8',
    fontWeight: 700,
    fontSize: '0.9rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
  });

  return (
    <div style={{ paddingBottom: '60px' }}>

      {/* ── Tab Switcher ─────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', paddingTop: '8px' }}>
        <button style={tabStyle('collection')} onClick={() => setActiveTab('collection')}>
          <Database size={16} /> My Collection
        </button>
        <button style={tabStyle('discover')} onClick={() => setActiveTab('discover')}>
          <Globe size={16} /> 🌍 Discover All Movies
        </button>
      </div>

      {/* ════════════════════════════════════════════════════════════════
          MY COLLECTION TAB
      ════════════════════════════════════════════════════════════════ */}
      {activeTab === 'collection' && (
        <>
          {!searchQuery && selectedGenre === 'All' && selectedStatus === 'All' && selectedPlatform === 'All' && (
            <HeroBanner movies={movies} onSelectMovie={(m) => setSelectedMovie(m)} />
          )}

          <SearchFilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedGenre={selectedGenre}
            setSelectedGenre={setSelectedGenre}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            selectedPlatform={selectedPlatform}
            setSelectedPlatform={setSelectedPlatform}
            platforms={platforms}
            sortOption={sortOption}
            setSortOption={setSortOption}
            totalResults={movies.length}
          />

          {loading ? (
            <div style={{ minHeight: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <RefreshCw size={28} className="animate-pulse-subtle" color="#6366f1" />
              <span style={{ color: '#94a3b8', fontSize: '0.95rem' }}>Loading cinema database...</span>
            </div>
          ) : movies.length > 0 ? (
            <div className="movies-grid">
              {movies.map((movie) => (
                <MovieCard key={movie._id} movie={movie} onSelect={(m) => setSelectedMovie(m)} onSelectActor={(actor) => setSelectedActor(actor)} />
              ))}
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
              <Film size={48} color="#64748b" style={{ margin: '0 auto 16px auto', display: 'block' }} />
              <h3 style={{ fontSize: '1.4rem', color: '#f8fafc', marginBottom: '8px' }}>No movies match your search criteria</h3>
              <p style={{ color: '#94a3b8', maxWidth: '450px', margin: '0 auto 20px auto', fontSize: '0.9rem' }}>
                Try clearing filters or search for another movie title, character, or actor name.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedGenre('All'); setSelectedStatus('All'); setSelectedPlatform('All'); }}
                className="btn btn-secondary btn-sm"
              >
                Reset Filters
              </button>
            </div>
          )}
        </>
      )}

      {/* ════════════════════════════════════════════════════════════════
          DISCOVER TAB (TMDb)
      ════════════════════════════════════════════════════════════════ */}
      {activeTab === 'discover' && (
        <>
          {/* Discover Header */}
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Globe size={22} color="#06b6d4" /> Discover Telugu Movies
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
              Browse millions of movies from the TMDb database — optimized for Telugu Cinema from 2000 to present
            </p>
          </div>

          {/* Search Bar */}
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <Search size={18} color="#64748b" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              type="text"
              placeholder="Search for any movie title or actor (e.g. Allu Arjun)..."
              value={discoverSearch}
              onChange={(e) => setDiscoverSearch(e.target.value)}
              className="form-input"
              style={{ width: '100%', paddingLeft: '44px', paddingRight: '16px', fontSize: '1rem', borderColor: 'rgba(6,182,212,0.3)' }}
            />
          </div>

          {/* Results count */}
          <div style={{ marginBottom: '16px', fontSize: '0.85rem', color: '#64748b' }}>
            {isSearchMode
              ? discoverPersonName 
                ? `Showing movies featuring ${discoverPersonName} — ${discoverTotal.toLocaleString()} found`
                : `Showing results for "${discoverSearch}" — ${discoverTotal.toLocaleString()} found`
              : `Showing Popular Telugu Movies — ${discoverTotal.toLocaleString()} total`
            }
          </div>

          {/* Movies Grid */}
          {discoverLoading ? (
            <div style={{ minHeight: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <RefreshCw size={28} color="#06b6d4" style={{ animation: 'spin 1s linear infinite' }} />
              <span style={{ color: '#94a3b8', fontSize: '0.95rem' }}>Fetching from TMDb database...</span>
            </div>
          ) : discoverMovies.length > 0 ? (
            <>
              <div className="movies-grid">
                {discoverMovies.map((movie) => (
                  <TMDbMovieCard key={movie.id} movie={movie} onSelect={(m) => setSelectedTMDbMovie(m)} />
                ))}
              </div>

              {/* Pagination */}
              {discoverTotalPages > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                  <button
                    onClick={() => setDiscoverPage((p) => Math.max(1, p - 1))}
                    disabled={discoverPage === 1}
                    className="btn btn-secondary btn-sm"
                    style={{ opacity: discoverPage === 1 ? 0.4 : 1 }}
                  >
                    <ChevronLeft size={16} /> Prev
                  </button>
                  <span style={{ color: '#94a3b8', fontSize: '0.88rem', fontFamily: 'JetBrains Mono' }}>
                    Page {discoverPage} / {discoverTotalPages}
                  </span>
                  <button
                    onClick={() => setDiscoverPage((p) => Math.min(discoverTotalPages, p + 1))}
                    disabled={discoverPage >= discoverTotalPages}
                    className="btn btn-secondary btn-sm"
                    style={{ opacity: discoverPage >= discoverTotalPages ? 0.4 : 1 }}
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="glass-panel" style={{ padding: '60px 20px', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
              <Globe size={48} color="#64748b" style={{ margin: '0 auto 16px auto', display: 'block' }} />
              <h3 style={{ fontSize: '1.4rem', color: '#f8fafc', marginBottom: '8px' }}>No movies found</h3>
              <p style={{ color: '#94a3b8', maxWidth: '400px', margin: '0 auto', fontSize: '0.9rem' }}>
                Try a different search term.
              </p>
            </div>
          )}
        </>
      )}

      {/* ── My Collection Modals ────────────────────────────────────── */}
      {selectedMovie && (
        <MovieDetailsModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onSelectActor={(actor) => setSelectedActor(actor)}
          onMovieDeleted={handleMovieDeleted}
          onRefreshMovie={handleRefreshMovie}
        />
      )}

      {selectedActor && (
        <ActorDetailsModal
          initialActor={selectedActor}
          onClose={() => setSelectedActor(null)}
          onSelectMovie={(m) => setSelectedMovie(m)}
        />
      )}

      {/* ── TMDb Discover Modal ─────────────────────────────────────── */}
      {selectedTMDbMovie && (
        <TMDbMovieModal
          movie={selectedTMDbMovie}
          onClose={() => setSelectedTMDbMovie(null)}
        />
      )}
    </div>
  );
};

export default MoviesPage;
