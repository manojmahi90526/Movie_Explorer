import React, { useState, useEffect } from 'react';
import { Play, Info, Star, Sparkles, ChevronRight, ChevronLeft, ShieldCheck } from 'lucide-react';

const HeroBanner = ({ movies, onSelectMovie }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Pick top rated featured movies for the hero banner showcase
  const featuredMovies = movies?.length > 0 ? movies.slice(0, 5) : [];

  useEffect(() => {
    if (featuredMovies.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [featuredMovies.length, isPaused]);

  // Keep currentIndex bounded
  useEffect(() => {
    if (currentIndex >= featuredMovies.length && featuredMovies.length > 0) {
      setCurrentIndex(0);
    }
  }, [featuredMovies.length, currentIndex]);

  if (featuredMovies.length === 0) return null;

  const currentMovie = featuredMovies[currentIndex] || featuredMovies[0];

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? featuredMovies.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
  };

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '460px',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        marginBottom: '40px',
        border: '1px solid var(--border-color)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'flex-end',
        background: '#070a12',
      }}
    >
      {/* Background Slides with Silky Smooth Opacity Crossfade */}
      {featuredMovies.map((movie, idx) => {
        const isActive = idx === currentIndex;
        const bgUrl = movie.bannerUrl || movie.posterUrl;
        return (
          <div
            key={movie._id || idx}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: isActive ? 1 : 0,
              transition: 'opacity 0.9s cubic-bezier(0.4, 0, 0.2, 1), transform 6s ease-out',
              transform: isActive ? 'scale(1.03)' : 'scale(1)',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          >
            <img
              src={bgUrl}
              alt={movie.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 25%',
                filter: 'brightness(0.52) contrast(1.08)',
              }}
              onError={(e) => {
                if (movie.posterUrl && e.target.src !== movie.posterUrl) {
                  e.target.src = movie.posterUrl;
                }
              }}
            />
          </div>
        );
      })}

      {/* Cinematic Vignette & Gradient Overlays */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(0deg, #030408 0%, rgba(3, 4, 8, 0.78) 50%, rgba(3, 4, 8, 0.25) 100%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 80% 20%, rgba(139, 92, 246, 0.22) 0%, transparent 60%), radial-gradient(circle at 20% 80%, rgba(255, 0, 85, 0.12) 0%, transparent 50%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* Active Movie Content */}
      <div
        key={currentMovie._id || currentIndex}
        className="animate-fade-in"
        style={{
          position: 'relative',
          zIndex: 3,
          padding: '40px',
          maxWidth: '850px',
          width: '100%',
        }}
      >
        {/* Badges & Meta */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '16px',
            flexWrap: 'wrap',
          }}
        >
          <span
            className="badge badge-rating"
            style={{ fontSize: '0.86rem', padding: '5px 14px', display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: 'Space Grotesk' }}
          >
            <Star size={14} fill="#f59e0b" color="#f59e0b" />
            <strong>{currentMovie.rating}</strong> / 10
          </span>
          <span className={`badge ${currentMovie.status === 'Released' ? 'badge-released' : 'badge-upcoming'}`} style={{ fontFamily: 'Space Grotesk' }}>
            {currentMovie.releaseYear} • {currentMovie.status}
          </span>
          {currentMovie.genre?.map((g) => (
            <span
              key={g}
              className="badge-genre"
              style={{
                background: 'rgba(5, 7, 14, 0.85)',
                backdropFilter: 'blur(8px)',
                padding: '4px 12px',
                fontSize: '0.78rem',
              }}
            >
              {g}
            </span>
          ))}
          {currentMovie.boxOffice?.verdict && (
            <span
              style={{
                background: 'rgba(0, 245, 155, 0.2)',
                color: '#00f59b',
                border: '1px solid rgba(0, 245, 155, 0.4)',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.78rem',
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontFamily: 'Space Grotesk',
              }}
            >
              <ShieldCheck size={13} />
              {currentMovie.boxOffice.verdict}
            </span>
          )}
        </div>

        {/* Movie Title */}
        <h2
          style={{
            fontSize: 'clamp(2.1rem, 4.2vw, 3.2rem)',
            fontWeight: 900,
            color: '#ffffff',
            lineHeight: 1.12,
            marginBottom: '16px',
            textShadow: '0 4px 20px rgba(0,0,0,0.9), 0 0 30px rgba(139, 92, 246, 0.25)',
            letterSpacing: '-0.03em',
          }}
        >
          {currentMovie.title}
        </h2>

        {/* 20-40 Word Brief Story Callout */}
        <div
          style={{
            background: 'rgba(10, 14, 28, 0.85)',
            backdropFilter: 'blur(16px)',
            borderLeft: '4px solid var(--accent-violet)',
            padding: '16px 20px',
            borderRadius: '0 14px 14px 0',
            marginBottom: '24px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderLeftWidth: '4px',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <Sparkles size={14} color="#38bdf8" />
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#38bdf8', fontWeight: 800, letterSpacing: '0.08em', fontFamily: 'Space Grotesk' }}>
              Story Synopsis (20-40 words)
            </span>
          </div>
          <p style={{ fontSize: '1rem', color: '#f1f5f9', lineHeight: 1.55, fontWeight: 400 }}>
            "{currentMovie.briefStory}"
          </p>
        </div>

        {/* Streaming Platforms & Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <button
            onClick={() => onSelectMovie(currentMovie)}
            className="btn btn-primary"
            style={{ padding: '12px 24px', fontSize: '0.98rem', fontWeight: 600 }}
          >
            <Info size={18} />
            <span>Explore Full Details & Cast</span>
          </button>

          {currentMovie.trailerUrl && (
            <a
              href={currentMovie.trailerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
              style={{ padding: '12px 20px', fontSize: '0.95rem' }}
            >
              <Play size={17} fill="#ffffff" />
              <span>Watch Trailer</span>
            </a>
          )}

          {/* Streaming badges */}
          {currentMovie.streamingPlatforms?.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 500 }}>Stream On:</span>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {currentMovie.streamingPlatforms.map((sp, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: sp.platform?.badgeColor ? `${sp.platform.badgeColor}25` : 'rgba(255,255,255,0.1)',
                      color: sp.platform?.badgeColor || '#fff',
                      border: `1px solid ${sp.platform?.badgeColor ? sp.platform.badgeColor : 'rgba(255,255,255,0.2)'}`,
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }}
                  >
                    {sp.platform?.name || 'Streaming'}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Prev / Next Navigation Arrows */}
      {featuredMovies.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            aria-label="Previous Slide"
            style={{
              position: 'absolute',
              top: '50%',
              left: '16px',
              transform: 'translateY(-50%)',
              background: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 4,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--primary)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(15, 23, 42, 0.75)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            <ChevronLeft size={22} />
          </button>

          <button
            onClick={handleNext}
            aria-label="Next Slide"
            style={{
              position: 'absolute',
              top: '50%',
              right: '16px',
              transform: 'translateY(-50%)',
              background: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 4,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--primary)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(15, 23, 42, 0.75)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}

      {/* Slide Navigator Pills */}
      {featuredMovies.length > 1 && (
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            right: '30px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            zIndex: 4,
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(8px)',
            padding: '6px 12px',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {featuredMovies.map((m, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              title={m.title}
              style={{
                width: currentIndex === idx ? '26px' : '8px',
                height: '8px',
                borderRadius: '4px',
                background: currentIndex === idx ? 'var(--primary)' : 'rgba(255, 255, 255, 0.35)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                padding: 0,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroBanner;
