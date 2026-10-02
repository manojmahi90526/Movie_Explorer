import React, { useState, useEffect } from 'react';
import { X, Star, Clock, Calendar, Globe, Film, Users, ExternalLink, RefreshCw } from 'lucide-react';
import { tmdbGetMovie } from '../services/api';

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
const TMDB_IMAGE_BASE_LARGE = 'https://image.tmdb.org/t/p/w1280';

const TMDbMovieModal = ({ movie: initialMovie, onClose }) => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!initialMovie?.id) return;
    const fetchFull = async () => {
      setLoading(true);
      try {
        const res = await tmdbGetMovie(initialMovie.id);
        if (res.data.success) {
          setMovie(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch TMDb details', err);
        setMovie(null);
      } finally {
        setLoading(false);
      }
    };
    fetchFull();
  }, [initialMovie?.id]);

  if (!initialMovie) return null;

  const posterSrc = movie?.poster_path || initialMovie?.poster_path
    ? `${TMDB_IMAGE_BASE}${movie?.poster_path || initialMovie.poster_path}`
    : null;

  const backdropSrc = movie?.backdrop_path
    ? `${TMDB_IMAGE_BASE_LARGE}${movie.backdrop_path}`
    : null;

  const tmdbRating = movie?.vote_average || initialMovie?.vote_average;
  const genres = movie?.genres ? movie.genres.map(g => g.name) : [];
  const cast = movie?.credits?.cast ? movie.credits.cast.slice(0, 10) : [];
  const crew = movie?.credits?.crew || [];
  const directors = crew.filter(c => c.job === 'Director').map(c => c.name);
  const writers = crew.filter(c => c.department === 'Writing').map(c => c.name);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '860px' }}
      >
        {/* Banner Header */}
        <div style={{ position: 'relative', height: '280px', width: '100%', background: '#05070f', overflow: 'hidden' }}>
          {backdropSrc ? (
            <img
              src={backdropSrc}
              alt={movie?.title || initialMovie.title || initialMovie.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%', filter: 'brightness(0.4)', transform: 'scale(1.05)' }}
            />
          ) : posterSrc ? (
            <img
              src={posterSrc}
              alt={movie?.title || initialMovie.title || initialMovie.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%', filter: 'blur(10px) brightness(0.4)', transform: 'scale(1.05)' }}
            />
          ) : null}
          <div
            style={{
              position: 'absolute', inset: 0,
              background: backdropSrc || posterSrc
                ? 'linear-gradient(0deg, #0f1629 5%, rgba(15,22,41,0.5) 55%, transparent 100%)'
                : 'linear-gradient(135deg, #1a0a2e 0%, #080c1a 100%)',
            }}
          />

          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: '16px', right: '16px',
              background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff', width: '36px', height: '36px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10,
            }}
          >
            <X size={20} />
          </button>

          {/* Header Info Overlay */}
          <div
            style={{
              position: 'absolute', bottom: '20px', left: '24px', right: '24px',
              display: 'flex', alignItems: 'flex-end', gap: '20px',
            }}
          >
            {posterSrc ? (
              <img
                src={posterSrc}
                alt={movie?.title || initialMovie.title || initialMovie.name}
                style={{
                  width: '100px', height: '145px', objectFit: 'cover',
                  borderRadius: '10px', border: '2px solid rgba(6,182,212,0.4)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.7)', flexShrink: 0,
                }}
              />
            ) : (
              <div
                style={{
                  width: '100px', height: '145px', borderRadius: '10px', background: '#151c34',
                  border: '2px solid rgba(6,182,212,0.4)', flexShrink: 0, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Film size={32} color="#06b6d4" />
              </div>
            )}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                {/* TMDb Source Badge */}
                <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '3px 10px', borderRadius: '6px', background: 'rgba(6,182,212,0.2)', color: '#06b6d4', border: '1px solid rgba(6,182,212,0.4)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Globe size={11} /> TMDb
                </span>
                {tmdbRating && (
                  <span className="badge badge-rating">
                    <Star size={13} fill="#f59e0b" color="#f59e0b" /> {tmdbRating.toFixed(1)} / 10
                  </span>
                )}
                {(movie?.release_date || initialMovie?.release_date) && (
                  <span style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.08)', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={11} /> {(movie?.release_date || initialMovie?.release_date).split('-')[0]}
                  </span>
                )}
                {movie?.runtime > 0 && (
                  <span style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.08)', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={11} /> {movie.runtime} min
                  </span>
                )}
              </div>
              <h2 style={{ fontSize: '2rem', color: '#ffffff', lineHeight: 1.1, marginBottom: '6px' }}>
                {loading ? (initialMovie.title || initialMovie.name) : (movie?.title || movie?.name || initialMovie.title || initialMovie.name)}
              </h2>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {genres.map((g) => (
                  <span key={g} style={{ background: 'rgba(6,182,212,0.15)', color: '#67e8f9', border: '1px solid rgba(6,182,212,0.3)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '22px' }}>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '40px 0' }}>
              <RefreshCw size={28} color="#06b6d4" style={{ animation: 'spin 1s linear infinite' }} />
              <span style={{ color: '#94a3b8' }}>Loading full movie details from TMDb...</span>
            </div>
          ) : movie ? (
            <>
              {/* Plot */}
              {movie.overview && (
                <div style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 'var(--radius-md)', padding: '18px 20px' }}>
                  <h4 style={{ fontSize: '0.85rem', color: '#06b6d4', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    📖 Plot Summary
                  </h4>
                  <p style={{ fontSize: '1rem', color: '#f1f5f9', lineHeight: 1.6 }}>{movie.overview}</p>
                </div>
              )}

              {/* Director & Writers */}
              {(directors.length > 0 || writers.length > 0) && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {directors.length > 0 && (
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '14px' }}>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>🎬 Directed By</div>
                      <div style={{ fontSize: '0.95rem', color: '#f8fafc', fontWeight: 700 }}>{directors.join(', ')}</div>
                    </div>
                  )}
                  {writers.length > 0 && (
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '14px' }}>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>✍️ Written By</div>
                      <div style={{ fontSize: '0.92rem', color: '#f8fafc', fontWeight: 600 }}>{writers.slice(0, 3).join(', ')}</div>
                    </div>
                  )}
                </div>
              )}

              {/* Cast */}
              {cast.length > 0 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <Users size={18} color="#06b6d4" />
                    <h3 style={{ fontSize: '1.1rem', color: '#fff' }}>Cast</h3>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {cast.map((actor, i) => (
                      <div
                        key={i}
                        style={{
                          padding: '8px 14px', background: 'rgba(255,255,255,0.04)',
                          borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)',
                          fontSize: '0.88rem', color: '#e2e8f0', fontWeight: 600,
                        }}
                      >
                        {actor.name} <span style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 'normal' }}>as {actor.character}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Box Office & Details */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '10px' }}>
                {[
                  { label: '🗣️ Language', value: movie.original_language?.toUpperCase() },
                  { label: '💰 Budget', value: movie.budget ? `$${(movie.budget / 1000000).toFixed(1)}M` : null },
                  { label: '💵 Revenue', value: movie.revenue ? `$${(movie.revenue / 1000000).toFixed(1)}M` : null },
                  { label: '📅 Released', value: movie.release_date },
                  { label: '🎞️ Status', value: movie.status },
                ].filter(item => item.value).map((item, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '10px 14px', background: 'rgba(255,255,255,0.03)',
                      borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginBottom: '4px' }}>{item.label}</div>
                    <div style={{ fontSize: '0.85rem', color: '#f1f5f9', fontWeight: 600 }}>{item.value}</div>
                  </div>
                ))}
              </div>

              {/* TMDb Link */}
              {initialMovie.id && (
                <div style={{ paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <a
                    href={`https://www.themoviedb.org/movie/${initialMovie.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                    style={{ borderColor: 'rgba(6,182,212,0.4)', color: '#06b6d4' }}
                  >
                    <ExternalLink size={15} />
                    View on TMDb
                  </a>
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
              Failed to load movie details. Please try again.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TMDbMovieModal;
