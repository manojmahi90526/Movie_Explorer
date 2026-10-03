import React, { useState, useEffect } from 'react';
import {
  X,
  Award,
  Calendar,
  Film,
  Sparkles,
  Star,
  Quote,
  Clock,
  ArrowRight,
  Tv,
} from 'lucide-react';
import { fetchActorById } from '../services/api';

const ActorDetailsModal = ({ actorId, initialActor, onClose, onSelectMovie }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActorData = async () => {
      try {
        const id = actorId || initialActor?._id;
        if (!id) return;
        const res = await fetchActorById(id);
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load actor data', err);
      } finally {
        setLoading(false);
      }
    };
    loadActorData();
  }, [actorId, initialActor]);

  const actor = data?.actor || initialActor;
  const filmography = data?.filmography || { previousMovies: [], upcomingMovies: [] };

  if (!actor) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content actor-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '900px' }}
      >
        {/* Top Header with Actor Profile Image & Bio */}
        <div
          style={{
            position: 'relative',
            background: 'linear-gradient(135deg, #131b2e 0%, #0b0f19 100%)',
            padding: '30px',
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(0, 0, 0, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#fff',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10,
            }}
          >
            <X size={20} />
          </button>

          <div
            style={{
              display: 'flex',
              gap: '24px',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <img
              src={actor.image}
              alt={actor.name}
              style={{
                width: '130px',
                height: '130px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #6366f1',
                boxShadow: '0 0 30px rgba(99, 102, 241, 0.4)',
              }}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
              }}
            />

            <div style={{ flex: 1, minWidth: '280px' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    background: 'rgba(99, 102, 241, 0.2)',
                    color: '#c7d2fe',
                    border: '1px solid rgba(99, 102, 241, 0.4)',
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                  }}
                >
                  🌟 {actor.roleType || 'Lead Actor / Hero'}
                </span>
                <span className="badge badge-platform">
                  Born: {actor.dateOfBirth}
                </span>
                <span className="badge badge-platform">
                  Career Debut: {actor.debutYear}
                </span>
                <span className="badge badge-platform">
                  Nationality: {actor.nationality}
                </span>
              </div>

              <h2 style={{ fontSize: '2.2rem', color: '#ffffff', lineHeight: 1.1, marginBottom: '8px' }}>
                {actor.name}
              </h2>

              <p style={{ fontSize: '0.95rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '12px' }}>
                {actor.bio}
              </p>

              {actor.highlightQuote && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontStyle: 'italic',
                    color: '#a5b4fc',
                    fontSize: '0.88rem',
                  }}
                >
                  <Quote size={16} /> "{actor.highlightQuote}"
                </div>
              )}
            </div>
          </div>

          {/* Awards Badges */}
          {actor.awards && actor.awards.length > 0 && (
            <div
              style={{
                marginTop: '20px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                flexWrap: 'wrap',
              }}
            >
              <span style={{ fontSize: '0.82rem', color: '#fbbf24', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Award size={16} /> Honors & Awards:
              </span>
              {actor.awards.map((award, i) => (
                <span
                  key={i}
                  style={{
                    background: 'rgba(245, 158, 11, 0.1)',
                    color: '#fbbf24',
                    border: '1px solid rgba(245, 158, 11, 0.25)',
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                  }}
                >
                  🏆 {award}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Modal Body: Filmography Aggregation */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Section 1: Previous Movies */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Film size={20} color="#10b981" />
                <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>
                  Previous Movies ({filmography.previousMovies?.length || 0})
                </h3>
              </div>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Released Filmography</span>
            </div>

            {loading ? (
              <p style={{ color: '#94a3b8' }}>Loading filmography...</p>
            ) : filmography.previousMovies?.length > 0 ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                  gap: '14px',
                }}
              >
                {filmography.previousMovies.map((movie) => {
                  const charInfo = movie.characters?.find(
                    (c) => c.actor === actor._id || c.actor?._id === actor._id
                  );
                  return (
                    <div
                      key={movie._id}
                      onClick={() => {
                        onClose();
                        onSelectMovie(movie);
                      }}
                      style={{
                        display: 'flex',
                        gap: '12px',
                        padding: '12px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: '10px',
                        border: '1px solid rgba(255, 255, 255, 0.07)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#10b981')}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.07)')}
                    >
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        style={{
                          width: '55px',
                          height: '80px',
                          borderRadius: '6px',
                          objectFit: 'cover',
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span className="badge badge-rating" style={{ fontSize: '0.7rem', padding: '2px 6px' }}>
                            <Star size={11} fill="#f59e0b" /> {movie.rating}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{movie.releaseYear}</span>
                        </div>
                        <h4
                          style={{
                            fontSize: '0.95rem',
                            color: '#ffffff',
                            fontWeight: 700,
                            marginTop: '4px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {movie.title}
                        </h4>
                        {charInfo && (
                          <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '2px' }}>
                            as {charInfo.characterName}
                          </div>
                        )}
                        <span
                          style={{
                            fontSize: '0.72rem',
                            color: '#818cf8',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px',
                            marginTop: '6px',
                          }}
                        >
                          View Details <ArrowRight size={11} />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>No previous movies recorded.</p>
            )}
          </div>

          {/* Section 2: Upcoming Movies */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={20} color="#6366f1" />
                <h3 style={{ fontSize: '1.2rem', color: '#fff' }}>
                  Upcoming Movies ({filmography.upcomingMovies?.length || 0})
                </h3>
              </div>
              <span style={{ fontSize: '0.8rem', color: '#a5b4fc' }}>Future Pipeline</span>
            </div>

            {loading ? (
              <p style={{ color: '#94a3b8' }}>Loading upcoming projects...</p>
            ) : filmography.upcomingMovies?.length > 0 ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                  gap: '14px',
                }}
              >
                {filmography.upcomingMovies.map((movie) => {
                  const charInfo = movie.characters?.find(
                    (c) => c.actor === actor._id || c.actor?._id === actor._id
                  );
                  return (
                    <div
                      key={movie._id}
                      onClick={() => {
                        onClose();
                        onSelectMovie(movie);
                      }}
                      style={{
                        display: 'flex',
                        gap: '12px',
                        padding: '12px',
                        background: 'rgba(99, 102, 241, 0.05)',
                        borderRadius: '10px',
                        border: '1px solid rgba(99, 102, 241, 0.25)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#6366f1')}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.25)')}
                    >
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        style={{
                          width: '55px',
                          height: '80px',
                          borderRadius: '6px',
                          objectFit: 'cover',
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span className="badge badge-upcoming" style={{ fontSize: '0.7rem', padding: '2px 6px' }}>
                            Upcoming
                          </span>
                          <span style={{ fontSize: '0.75rem', color: '#a5b4fc', fontWeight: 600 }}>
                            {movie.releaseYear}
                          </span>
                        </div>
                        <h4
                          style={{
                            fontSize: '0.95rem',
                            color: '#ffffff',
                            fontWeight: 700,
                            marginTop: '4px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {movie.title}
                        </h4>
                        {charInfo && (
                          <div style={{ fontSize: '0.75rem', color: '#a5b4fc', marginTop: '2px' }}>
                            as {charInfo.characterName}
                          </div>
                        )}
                        <span
                          style={{
                            fontSize: '0.72rem',
                            color: '#818cf8',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '3px',
                            marginTop: '6px',
                          }}
                        >
                          Explore Project <ArrowRight size={11} />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>No upcoming projects announced yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActorDetailsModal;
