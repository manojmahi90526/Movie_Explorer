import React, { useState } from 'react';
import { Star, Tv, Sparkles, ArrowRight, Film, ShieldCheck } from 'lucide-react';
import { countWords } from './WordCountIndicator';

const MovieCard = ({ movie, onSelect, onSelectActor }) => {
  const [imgError, setImgError] = useState(false);
  const [usedBanner, setUsedBanner] = useState(false);

  const wordCount = countWords(movie.briefStory);
  const leadChar = movie.characters?.find((c) => c.isLead) || movie.characters?.[0];
  const primaryReview = movie.reviews?.[0];

  const handleImgError = (e) => {
    // If posterUrl failed and we haven't tried bannerUrl yet, try bannerUrl
    if (!usedBanner && movie.bannerUrl && movie.bannerUrl !== movie.posterUrl) {
      setUsedBanner(true);
      e.target.src = movie.bannerUrl;
    } else {
      setImgError(true);
    }
  };

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
        e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.5)';
        e.currentTarget.style.boxShadow = '0 20px 45px rgba(0, 0, 0, 0.7), 0 0 25px rgba(139, 92, 246, 0.25), 0 0 10px rgba(0, 242, 254, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.45)';
      }}
    >
      {/* Poster Image or Stylized Header */}
      <div style={{ position: 'relative', height: '240px', width: '100%', overflow: 'hidden', background: '#05070f' }}>
        {!imgError ? (
          <img
            src={usedBanner ? movie.bannerUrl : (movie.posterUrl || movie.bannerUrl)}
            alt={movie.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 20%',
              transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onError={handleImgError}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #1e113a 0%, #080c1a 60%, #0a192f 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '20px',
              textAlign: 'center',
              position: 'relative',
            }}
          >
            <Film size={36} color="#c084fc" style={{ marginBottom: '8px', opacity: 0.9 }} />
            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1.2 }}>
              {movie.title}
            </span>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px', fontFamily: 'Space Grotesk' }}>
              {movie.releaseYear} • {movie.genre?.[0] || 'Tollywood'}
            </span>
          </div>
        )}

        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(0deg, rgba(8, 12, 24, 0.98) 0%, rgba(8, 12, 24, 0.4) 45%, transparent 75%)',
            pointerEvents: 'none',
          }}
        />

        {/* Top Badges */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            right: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 2,
          }}
        >
          <span className="badge badge-rating" style={{ fontWeight: 800, fontFamily: 'Space Grotesk' }}>
            <Star size={13} fill="#f59e0b" color="#f59e0b" />
            {movie.rating ? Number(movie.rating).toFixed(1) : 'N/A'}
          </span>
          <span className={movie.status === 'Upcoming' ? 'badge badge-upcoming' : 'badge badge-released'}>
            {movie.status === 'Upcoming' ? '🚀 Upcoming' : `🎬 ${movie.releaseYear}`}
          </span>
        </div>

        {/* Genres on bottom of poster */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            display: 'flex',
            gap: '6px',
            flexWrap: 'wrap',
            zIndex: 2,
          }}
        >
          {movie.genre?.slice(0, 2).map((g) => (
            <span
              key={g}
              className="badge-genre"
              style={{
                background: 'rgba(5, 8, 16, 0.85)',
                backdropFilter: 'blur(6px)',
              }}
            >
              {g}
            </span>
          ))}
          {movie.boxOffice?.verdict && (
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '6px',
                background: 'rgba(0, 245, 155, 0.2)',
                color: '#00f59b',
                border: '1px solid rgba(0, 245, 155, 0.4)',
                backdropFilter: 'blur(6px)',
              }}
            >
              {movie.boxOffice.verdict}
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3
          style={{
            fontSize: '1.28rem',
            fontWeight: 800,
            color: '#ffffff',
            marginBottom: '12px',
            lineHeight: 1.25,
            letterSpacing: '-0.02em',
          }}
        >
          {movie.title}
        </h3>

        {/* 20-40 Word Brief Story Callout */}
        <div
          style={{
            background: 'rgba(139, 92, 246, 0.07)',
            borderLeft: '3px solid var(--accent-violet)',
            padding: '12px 14px',
            borderRadius: '0 10px 10px 0',
            marginBottom: '14px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderLeftWidth: '3px',
            boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.05)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '4px',
            }}
          >
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                color: '#a5b4fc',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Sparkles size={12} /> Brief Story
            </span>
            <span
              style={{
                fontSize: '0.68rem',
                color: '#10b981',
                fontWeight: 600,
                fontFamily: 'JetBrains Mono',
              }}
            >
              {wordCount} words
            </span>
          </div>
          <p
            style={{
              fontSize: '0.85rem',
              color: '#cbd5e1',
              lineHeight: 1.45,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {movie.briefStory}
          </p>
        </div>

        {/* Character / Lead Role preview */}
        {leadChar && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '14px',
              padding: '8px 12px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              transition: 'all 0.2s ease',
            }}
            onClick={(e) => {
              if (leadChar.actor?._id) {
                e.stopPropagation();
                onSelectActor?.(leadChar.actor);
              }
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                overflow: 'hidden',
                background: '#151c34',
                flexShrink: 0,
                border: '2px solid rgba(139, 92, 246, 0.5)',
                boxShadow: '0 0 10px rgba(139, 92, 246, 0.3)',
              }}
            >
              <img
                src={leadChar.actor?.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                alt={leadChar.actor?.name || 'Actor'}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';
                }}
              />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Role: <span style={{ color: '#f8fafc', fontWeight: 700 }}>{leadChar.characterName}</span>
              </div>
              <div style={{ fontSize: '0.74rem', color: '#38bdf8', fontWeight: 700, fontFamily: 'Space Grotesk' }}>
                ★ Hero: {leadChar.actor?.name || 'Lead Actor'}
              </div>
            </div>
          </div>
        )}

        {/* Review & Platform Source Excerpt */}
        {primaryReview && (
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(255, 183, 3, 0.08) 0%, rgba(255, 183, 3, 0.02) 100%)',
              padding: '10px 12px',
              borderRadius: 'var(--radius-xs)',
              border: '1px solid rgba(255, 183, 3, 0.2)',
              marginBottom: '14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  color: '#fde047',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                ⭐ Review ({primaryReview.platformSource})
              </span>
              <span style={{ fontSize: '0.74rem', color: '#fde047', fontWeight: 800, fontFamily: 'Space Grotesk' }}>
                {primaryReview.rating}/10
              </span>
            </div>
            <p
              style={{
                fontSize: '0.8rem',
                color: '#e2e8f0',
                fontStyle: 'italic',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              "{primaryReview.reviewText}"
            </p>
          </div>
        )}

        {/* Footer: Streaming Platforms & View Details CTA */}
        <div
          style={{
            marginTop: 'auto',
            paddingTop: '14px',
            borderTop: '1px solid rgba(255, 255, 255, 0.07)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Streaming icons / badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <Tv size={14} color="#94a3b8" />
            {movie.streamingPlatforms?.length > 0 ? (
              movie.streamingPlatforms.slice(0, 3).map((sp, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    background: sp.platform?.badgeColor ? `${sp.platform.badgeColor}25` : 'rgba(255,255,255,0.1)',
                    color: sp.platform?.badgeColor || '#e2e8f0',
                    border: `1px solid ${sp.platform?.badgeColor ? `${sp.platform.badgeColor}40` : 'rgba(255,255,255,0.15)'}`,
                  }}
                >
                  {sp.platform?.name?.split(' ')[0] || 'Platform'}
                </span>
              ))
            ) : (
              <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Theatrical</span>
            )}
          </div>

          <span
            style={{
              fontSize: '0.85rem',
              color: '#38bdf8',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontFamily: 'Space Grotesk',
              letterSpacing: '0.02em',
            }}
          >
            Explore <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
