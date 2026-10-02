import React from 'react';
import { Award, Calendar, Film, ArrowRight, Sparkles } from 'lucide-react';

const ActorCard = ({ actor, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(actor)}
      className="glass-card cinema-hud"
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        cursor: 'pointer',
        background: 'linear-gradient(175deg, rgba(16, 22, 42, 0.75) 0%, rgba(6, 9, 20, 0.9) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        height: '100%',
        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.45)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px) scale(1.015)';
        e.currentTarget.style.borderColor = 'rgba(255, 183, 3, 0.5)';
        e.currentTarget.style.boxShadow = '0 20px 45px rgba(0, 0, 0, 0.7), 0 0 25px rgba(255, 183, 3, 0.25), 0 0 10px rgba(255, 0, 85, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.45)';
      }}
    >
      {/* Actor Image */}
      <div style={{ position: 'relative', height: '270px', width: '100%', overflow: 'hidden', background: '#05070f' }}>
        <img
          src={actor.image}
          alt={actor.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 15%',
            transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(0deg, rgba(6, 9, 20, 0.98) 0%, rgba(6, 9, 20, 0.35) 45%, transparent 70%)',
          }}
        />

        {/* Top Badges */}
        <div style={{ position: 'absolute', top: '12px', left: '12px', right: '12px', display: 'flex', justifyContent: 'space-between' }}>
          <span
            style={{
              fontSize: '0.74rem',
              fontWeight: 800,
              padding: '3px 12px',
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, rgba(255, 183, 3, 0.25) 0%, rgba(251, 133, 0, 0.25) 100%)',
              color: '#fde047',
              border: '1px solid rgba(255, 183, 3, 0.45)',
              boxShadow: '0 0 12px rgba(255, 183, 3, 0.25)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            ★ {actor.roleType || 'Lead Hero'}
          </span>
          <span
            style={{
              fontSize: '0.74rem',
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(0, 0, 0, 0.75)',
              color: '#94a3b8',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(6px)',
              fontFamily: 'Space Grotesk',
            }}
          >
            Debut: {actor.debutYear}
          </span>
        </div>

        {/* Film Count Pill */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            display: 'flex',
            gap: '6px',
          }}
        >
          <span
            style={{
              background: 'rgba(0, 245, 155, 0.2)',
              color: '#00f59b',
              border: '1px solid rgba(0, 245, 155, 0.4)',
              padding: '3px 10px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backdropFilter: 'blur(6px)',
              fontFamily: 'Space Grotesk',
            }}
          >
            <Film size={12} /> {actor.totalMovies || 0} Films
          </span>
          {actor.upcomingCount > 0 && (
            <span
              style={{
                background: 'rgba(255, 0, 85, 0.2)',
                color: '#ff4d88',
                border: '1px solid rgba(255, 0, 85, 0.4)',
                padding: '3px 10px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                fontWeight: 800,
                backdropFilter: 'blur(6px)',
                fontFamily: 'Space Grotesk',
              }}
            >
              {actor.upcomingCount} Upcoming
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3
          style={{
            fontSize: '1.35rem',
            fontWeight: 800,
            color: '#ffffff',
            marginBottom: '6px',
            letterSpacing: '-0.02em',
          }}
        >
          {actor.name}
        </h3>

        <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '12px', fontFamily: 'Space Grotesk' }}>
          {actor.nationality} • Born {actor.dateOfBirth}
        </div>

        <p
          style={{
            fontSize: '0.86rem',
            color: '#cbd5e1',
            lineHeight: 1.5,
            marginBottom: '14px',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {actor.bio}
        </p>

        {/* Awards Preview */}
        {actor.awards && actor.awards.length > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '14px',
              padding: '8px 10px',
              background: 'rgba(255, 183, 3, 0.06)',
              borderRadius: 'var(--radius-xs)',
              border: '1px solid rgba(255, 183, 3, 0.15)',
            }}
          >
            <Award size={15} color="#fde047" />
            <span
              style={{
                fontSize: '0.76rem',
                color: '#fde047',
                fontWeight: 700,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {actor.awards[0]}
            </span>
          </div>
        )}

        {/* View Portfolio CTA */}
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
            View Filmography <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default ActorCard;
