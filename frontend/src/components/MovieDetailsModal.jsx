import React, { useState } from 'react';
import {
  X,
  Star,
  Tv,
  Users,
  MessageSquare,
  Sparkles,
  ExternalLink,
  Play,
  Calendar,
  Clock,
  Trash2,
  Edit,
  PlusCircle,
} from 'lucide-react';
import { countWords } from './WordCountIndicator';
import { useAuth } from '../context/AuthContext';
import { deleteMovie, createReview } from '../services/api';

const MovieDetailsModal = ({
  movie,
  onClose,
  onSelectActor,
  onMovieDeleted,
  onRefreshMovie,
}) => {
  const { isAdmin } = useAuth();
  const [showAddReview, setShowAddReview] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    platformSource: 'YouTube Critics',
    reviewerName: '',
    rating: 8.5,
    reviewText: '',
    sourceUrl: '',
  });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  if (!movie) return null;

  const wordCount = countWords(movie.briefStory);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${movie.title}"?`)) {
      try {
        await deleteMovie(movie._id);
        onMovieDeleted?.(movie._id);
        onClose();
      } catch (err) {
        alert('Failed to delete movie: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.reviewerName || !reviewForm.reviewText) {
      alert('Please fill out all review fields');
      return;
    }
    setReviewSubmitting(true);
    try {
      await createReview({
        movie: movie._id,
        ...reviewForm,
      });
      setShowAddReview(false);
      setReviewForm({
        platformSource: 'YouTube Critics',
        reviewerName: '',
        rating: 8.5,
        reviewText: '',
        sourceUrl: '',
      });
      onRefreshMovie?.(movie._id);
    } catch (err) {
      alert('Failed to submit review: ' + (err.response?.data?.message || err.message));
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '860px' }}
      >
        {/* Banner Header with Close Button */}
        <div style={{ position: 'relative', height: '280px', width: '100%' }}>
          <img
            src={movie.bannerUrl || movie.posterUrl}
            alt={movie.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80';
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(0deg, #0f1629 5%, rgba(15, 22, 41, 0.4) 60%, rgba(15, 22, 41, 0.8) 100%)',
            }}
          />

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

          {/* Header Info Overlay */}
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '24px',
              right: '24px',
              display: 'flex',
              alignItems: 'flex-end',
              gap: '20px',
            }}
          >
            <img
              src={movie.posterUrl || movie.bannerUrl}
              alt={movie.title}
              style={{
                width: '100px',
                height: '145px',
                objectFit: 'cover',
                borderRadius: '10px',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 20px rgba(0,0,0,0.7)',
                flexShrink: 0,
                background: '#1e293b',
              }}
              onError={(e) => {
                if (movie.bannerUrl && e.target.src !== movie.bannerUrl) {
                  e.target.src = movie.bannerUrl;
                }
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                <span className="badge badge-rating">
                  <Star size={13} fill="#f59e0b" />
                  {movie.rating} / 10
                </span>
                <span className={movie.status === 'Upcoming' ? 'badge badge-upcoming' : 'badge badge-released'}>
                  {movie.status} ({movie.releaseYear})
                </span>
                <span className="badge badge-platform">
                  <Clock size={13} /> {movie.duration || '2h 15m'}
                </span>
              </div>
              <h2 style={{ fontSize: '2rem', color: '#ffffff', lineHeight: 1.1, marginBottom: '6px' }}>
                {movie.title}
              </h2>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {movie.genre?.map((g) => (
                  <span
                    key={g}
                    style={{
                      background: 'rgba(99, 102, 241, 0.15)',
                      color: '#c7d2fe',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Section 1: Brief Story (Strictly 20-40 Words Requirement) */}
          <div
            style={{
              background: 'rgba(99, 102, 241, 0.08)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '18px 20px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} color="#818cf8" />
                <h4 style={{ fontSize: '1rem', color: '#c7d2fe', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Brief Story Synopsis
                </h4>
              </div>
              <span
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: wordCount >= 20 && wordCount <= 40 ? '#10b981' : '#f59e0b',
                  background: 'rgba(0,0,0,0.3)',
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontFamily: 'JetBrains Mono',
                }}
              >
                {wordCount} words (Target: 20–40)
              </span>
            </div>
            <p style={{ fontSize: '1.05rem', color: '#f1f5f9', lineHeight: 1.6 }}>
              "{movie.briefStory}"
            </p>
          </div>

          {/* Section 2: Minimum Characters & Cast of the Movie */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Users size={18} color="#6366f1" />
              <h3 style={{ fontSize: '1.15rem', color: '#fff' }}>
                Main Characters & Lead Roles
              </h3>
            </div>

            {movie.characters && movie.characters.length > 0 ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                  gap: '12px',
                }}
              >
                {movie.characters.map((char, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      if (char.actor?._id) {
                        onClose();
                        onSelectActor(char.actor);
                      }
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: '10px',
                      border: '1px solid rgba(255, 255, 255, 0.07)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#6366f1')}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.07)')}
                  >
                    <img
                      src={char.actor?.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                      alt={char.actor?.name || 'Actor'}
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid #6366f1',
                      }}
                    />
                    <div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff' }}>
                        {char.characterName}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#818cf8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        Played by: <span style={{ textDecoration: 'underline' }}>{char.actor?.name || 'Lead Actor'}</span>
                      </div>
                      {char.isLead && (
                        <span
                          style={{
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            padding: '1px 6px',
                            borderRadius: '3px',
                            background: 'rgba(245, 158, 11, 0.2)',
                            color: '#fbbf24',
                          }}
                        >
                          Hero / Lead
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>No cast members registered yet.</p>
            )}
          </div>

          {/* Section 3: Available Streaming Platforms */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Tv size={18} color="#06b6d4" />
              <h3 style={{ fontSize: '1.15rem', color: '#fff' }}>
                Where to Watch / Streaming Platforms
              </h3>
            </div>

            {movie.streamingPlatforms && movie.streamingPlatforms.length > 0 ? (
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {movie.streamingPlatforms.map((sp, idx) => (
                  <a
                    key={idx}
                    href={sp.watchUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                    style={{
                      padding: '10px 16px',
                      background: sp.platform?.badgeColor ? `${sp.platform.badgeColor}20` : 'rgba(255,255,255,0.05)',
                      borderColor: sp.platform?.badgeColor || 'rgba(255,255,255,0.15)',
                    }}
                  >
                    {sp.platform?.logo && (
                      <img
                        src={sp.platform.logo}
                        alt={sp.platform.name}
                        style={{ width: '18px', height: '18px', objectFit: 'contain' }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                    <span style={{ color: sp.platform?.badgeColor || '#fff' }}>
                      {sp.platform?.name}
                    </span>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        background: 'rgba(0,0,0,0.4)',
                        color: '#94a3b8',
                      }}
                    >
                      {sp.subscriptionType}
                    </span>
                    <ExternalLink size={13} color="#94a3b8" />
                  </a>
                ))}
              </div>
            ) : (
              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>In Theatrical Release or TBA.</p>
            )}
          </div>

          {/* Section 4: Reviews & Platform Source Tags */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare size={18} color="#f59e0b" />
                <h3 style={{ fontSize: '1.15rem', color: '#fff' }}>
                  Critic Reviews & Platform Sources
                </h3>
              </div>

              {isAdmin && (
                <button
                  onClick={() => setShowAddReview(!showAddReview)}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.8rem' }}
                >
                  <PlusCircle size={14} />
                  <span>{showAddReview ? 'Cancel' : 'Add Review'}</span>
                </button>
              )}
            </div>

            {/* Quick add review form for admin */}
            {showAddReview && (
              <form
                onSubmit={handleReviewSubmit}
                style={{
                  background: 'rgba(15, 23, 42, 0.9)',
                  padding: '16px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  marginBottom: '16px',
                }}
              >
                <h4 style={{ fontSize: '0.95rem', color: '#f59e0b', marginBottom: '12px' }}>
                  Add Critic Review for "{movie.title}"
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <div>
                    <label className="form-label">Review Platform Source</label>
                    <select
                      className="form-select"
                      value={reviewForm.platformSource}
                      onChange={(e) => setReviewForm({ ...reviewForm, platformSource: e.target.value })}
                    >
                      <option value="YouTube Critics">YouTube Critics</option>
                      <option value="Rotten Tomatoes">Rotten Tomatoes</option>
                      <option value="IMDb Top Critics">IMDb Top Critics</option>
                      <option value="Letterboxd Official">Letterboxd Official</option>
                      <option value="Film Companion">Film Companion</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Reviewer / Channel Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Chris Stuckmann"
                      value={reviewForm.reviewerName}
                      onChange={(e) => setReviewForm({ ...reviewForm, reviewerName: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Rating (1 to 10)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="10"
                      className="form-input"
                      value={reviewForm.rating}
                      onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <label className="form-label">Review Summary / Quote</label>
                  <textarea
                    className="form-textarea"
                    rows="2"
                    placeholder="Enter review verdict..."
                    value={reviewForm.reviewText}
                    onChange={(e) => setReviewForm({ ...reviewForm, reviewText: e.target.value })}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="btn btn-primary btn-sm"
                >
                  {reviewSubmitting ? 'Submitting...' : 'Publish Review'}
                </button>
              </form>
            )}

            {/* Reviews List */}
            {movie.reviews && movie.reviews.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {movie.reviews.map((rev, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '14px 16px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: '10px',
                      border: '1px solid rgba(255, 255, 255, 0.07)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '6px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background: 'rgba(245, 158, 11, 0.15)',
                            color: '#fbbf24',
                            border: '1px solid rgba(245, 158, 11, 0.3)',
                          }}
                        >
                          {rev.platformSource}
                        </span>
                        <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f8fafc' }}>
                          {rev.reviewerName}
                        </span>
                      </div>
                      <span className="badge badge-rating">
                        <Star size={12} fill="#f59e0b" />
                        {rev.rating} / 10
                      </span>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: '#cbd5e1', fontStyle: 'italic', lineHeight: 1.5 }}>
                      "{rev.reviewText}"
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>No reviews recorded yet.</p>
            )}
          </div>

          {/* Admin Danger Zone / Actions */}
          {isAdmin && (
            <div
              style={{
                marginTop: '10px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
              }}
            >
              <button onClick={handleDelete} className="btn btn-danger btn-sm">
                <Trash2 size={15} />
                <span>Delete Movie</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsModal;
