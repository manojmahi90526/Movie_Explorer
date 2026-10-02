import React, { useState } from 'react';
import { Star, Globe, Film, ArrowRight, Calendar } from 'lucide-react';

const POSTER_PLACEHOLDER = 'https://via.placeholder.com/300x450/0f1629/6366f1?text=No+Poster';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

const TMDbMovieCard = ({ movie, onSelect }) => {
  const [imgError, setImgError] = useState(false);

  // TMDb search result shape: { id, title, release_date, poster_path, vote_average }
  const posterSrc = !imgError && movie.poster_path
    ? `${TMDB_IMAGE_BASE}${movie.poster_path}`
    : null;

  const year = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';

  return (
    <div
      onClick={() => onSelect(movie)}
      className="glass-card cinema-hud"
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        cursor: 'pointer',
        background: 'linear-gradient(175deg, rgba(17, 24, 46, 0.75) 0%, rgba(8, 12, 24, 0.9) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        height: '100%',
        position: 'relative',
        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.45)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px) scale(1.015)';
        e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.5)';
        e.currentTarget.style.boxShadow = '0 20px 45px rgba(0,0,0,0.7), 0 0 25px rgba(6,182,212,0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.45)';
      }}
    >
      {/* Poster */}
      <div style={{ position: 'relative', height: '240px', width: '100%', overflow: 'hidden', background: '#05070f' }}>
        {posterSrc ? (
          <img
            src={posterSrc}
            alt={movie.title || movie.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 10%', transition: 'transform 0.6s ease' }}
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            style={{
              width: '100%', height: '100%',
              background: 'linear-gradient(135deg, #1e113a 0%, #080c1a 60%, #0a192f 100%)',
              display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            }}
          >
            <Film size={36} color="#06b6d4" style={{ marginBottom: '8px' }} />
            <span style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc', textAlign: 'center', padding: '0 12px' }}>
              {movie.title || movie.name}
            </span>
          </div>
        )}

        {/* Gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(8,12,24,0.98) 0%, rgba(8,12,24,0.3) 50%, transparent 75%)', pointerEvents: 'none' }} />

        {/* Top badges */}
        <div style={{ position: 'absolute', top: '12px', left: '12px', right: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 2 }}>
          {/* TMDB source badge */}
          <span
            style={{
              fontSize: '0.68rem', fontWeight: 800, padding: '3px 8px', borderRadius: '6px',
              background: 'rgba(6, 182, 212, 0.2)', color: '#06b6d4', border: '1px solid rgba(6,182,212,0.4)',
              backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', gap: '4px',
            }}
          >
            <Globe size={10} /> TMDb
          </span>
          <span
            style={{
              fontSize: '0.7rem', fontWeight: 800, padding: '3px 8px', borderRadius: '6px',
              background: 'rgba(5, 8, 16, 0.85)', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.12)',
              backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', gap: '4px',
            }}
          >
            <Calendar size={10} /> {year}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', marginBottom: '10px', lineHeight: 1.25, letterSpacing: '-0.02em' }}>
          {movie.title || movie.name}
        </h3>

        {/* TMDb ID info */}
        <div
          style={{
            background: 'rgba(6, 182, 212, 0.07)', borderLeft: '3px solid #06b6d4',
            padding: '8px 12px', borderRadius: '0 8px 8px 0', marginBottom: '14px',
            border: '1px solid rgba(255,255,255,0.05)', borderLeftWidth: '3px',
          }}
        >
          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
            TMDb ID: <span style={{ color: '#06b6d4', fontWeight: 700, fontFamily: 'JetBrains Mono' }}>{movie.id}</span>
          </span>
          <p style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '4px', lineHeight: 1.4 }}>
            Click to view full details, plot, cast & ratings from TMDb.
          </p>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.07)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '12px', background: 'rgba(6,182,212,0.15)', color: '#06b6d4', border: '1px solid rgba(6,182,212,0.3)', textTransform: 'capitalize' }}>
            <Star size={10} style={{ display: 'inline', marginRight: '4px' }} /> 
            {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
          </span>
          <span style={{ fontSize: '0.85rem', color: '#06b6d4', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px', fontFamily: 'Space Grotesk' }}>
            Details <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default TMDbMovieCard;
