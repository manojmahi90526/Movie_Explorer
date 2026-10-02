import React, { useState, useEffect } from 'react';
import {
  PlusCircle,
  Film,
  Users,
  MessageSquare,
  Shield,
  Trash2,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Lock,
  LogIn,
  ExternalLink,
  Edit3,
  Save,
  X,
  Search,
} from 'lucide-react';
import WordCountIndicator, { countWords } from '../components/WordCountIndicator';
import { useAuth } from '../context/AuthContext';
import {
  createMovie,
  updateMovie,
  createActor,
  createReview,
  fetchActors,
  fetchPlatforms,
  fetchMovies,
  deleteMovie,
} from '../services/api';

const AdminDashboard = ({ onMovieCreated }) => {
  const { user, isAdmin, quickDemoLogin } = useAuth();
  const [activeAdminTab, setActiveAdminTab] = useState('addMovie');

  // Loaded data for dropdowns
  const [availableActors, setAvailableActors] = useState([]);
  const [availablePlatforms, setAvailablePlatforms] = useState([]);
  const [moviesList, setMoviesList] = useState([]);

  // Notifications
  const [statusMessage, setStatusMessage] = useState(null);

  // Search in Admin Table
  const [adminSearchQuery, setAdminSearchQuery] = useState('');

  // Edit Movie State
  const [editingMovie, setEditingMovie] = useState(null);
  const [editForm, setEditForm] = useState({
    title: '',
    posterUrl: '',
    bannerUrl: '',
    trailerUrl: '',
    releaseDate: '',
    releaseYear: 2025,
    status: 'Released',
    genre: 'Action, Drama',
    duration: '2h 45m',
    rating: 8.8,
    briefStory: '',
    characters: [{ characterName: '', actor: '', isLead: true }],
    streamingPlatforms: [],
  });

  // Form 1: Add Movie Form State
  const [movieForm, setMovieForm] = useState({
    title: '',
    posterUrl: '',
    bannerUrl: '',
    trailerUrl: '',
    releaseDate: '',
    status: 'Released',
    genre: 'Action, Drama, Period',
    duration: '2h 45m',
    rating: 8.8,
    briefStory: '',
    characters: [{ characterName: '', actor: '', isLead: true }],
    streamingPlatforms: [],
  });

  // Form 2: Add Actor Form State
  const [actorForm, setActorForm] = useState({
    name: '',
    image: '',
    bio: '',
    dateOfBirth: '',
    debutYear: 2005,
    nationality: 'Indian (Telugu)',
    roleType: 'Lead Actor',
    awards: '',
    highlightQuote: '',
  });

  // Form 3: Add Review Form State
  const [reviewForm, setReviewForm] = useState({
    movie: '',
    platformSource: 'Thyview (YouTube Critics)',
    reviewerName: '',
    rating: 9.0,
    reviewText: '',
    sourceUrl: '',
  });

  const [submitting, setSubmitting] = useState(false);

  // Load dropdown resources
  const loadResources = async () => {
    try {
      const [actRes, platRes, movRes] = await Promise.all([
        fetchActors(),
        fetchPlatforms(),
        fetchMovies(),
      ]);
      if (actRes.data.success) setAvailableActors(actRes.data.data);
      if (platRes.data.success) setAvailablePlatforms(platRes.data.data);
      if (movRes.data.success) setMoviesList(movRes.data.data);
    } catch (err) {
      console.error('Failed to load admin resources', err);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  const showNotification = (type, text) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 5000);
  };

  // Movie Form Handlers
  const handleAddCharacterRow = () => {
    setMovieForm({
      ...movieForm,
      characters: [
        ...movieForm.characters,
        { characterName: '', actor: availableActors[0]?._id || '', isLead: false },
      ],
    });
  };

  const handleRemoveCharacterRow = (index) => {
    setMovieForm({
      ...movieForm,
      characters: movieForm.characters.filter((_, i) => i !== index),
    });
  };

  const handleCharacterChange = (index, field, value) => {
    const updated = [...movieForm.characters];
    updated[index][field] = value;
    setMovieForm({ ...movieForm, characters: updated });
  };

  const handlePlatformToggle = (platformId) => {
    const exists = movieForm.streamingPlatforms.find((p) => p.platform === platformId);
    if (exists) {
      setMovieForm({
        ...movieForm,
        streamingPlatforms: movieForm.streamingPlatforms.filter((p) => p.platform !== platformId),
      });
    } else {
      setMovieForm({
        ...movieForm,
        streamingPlatforms: [
          ...movieForm.streamingPlatforms,
          { platform: platformId, watchUrl: 'https://', subscriptionType: 'Subscription' },
        ],
      });
    }
  };

  // Submit Movie
  const handleMovieSubmit = async (e) => {
    e.preventDefault();
    const words = countWords(movieForm.briefStory);
    if (words < 20 || words > 40) {
      showNotification('error', `Brief story must be strictly 20-40 words. Current count: ${words} words.`);
      return;
    }

    if (!movieForm.title || !movieForm.posterUrl) {
      showNotification('error', 'Movie title and poster image are required.');
      return;
    }

    // Filter valid characters
    const validCharacters = movieForm.characters.filter((c) => c.characterName && c.actor);
    if (validCharacters.length === 0 && availableActors.length > 0) {
      showNotification('error', 'Please assign at least one character and lead actor.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...movieForm,
        releaseYear: movieForm.releaseDate ? new Date(movieForm.releaseDate).getFullYear() : 2025,
        genre: movieForm.genre.split(',').map((g) => g.trim()),
        characters: validCharacters,
      };

      const res = await createMovie(payload);
      if (res.data.success) {
        showNotification('success', `🎉 Movie "${res.data.data.title}" added dynamically by Admin!`);
        setMovieForm({
          title: '',
          posterUrl: '',
          bannerUrl: '',
          trailerUrl: '',
          releaseDate: '',
          status: 'Released',
          genre: 'Action, Sci-Fi',
          duration: '2h 20m',
          rating: 8.0,
          briefStory: '',
          characters: [{ characterName: '', actor: availableActors[0]?._id || '', isLead: true }],
          streamingPlatforms: [],
        });
        loadResources();
        onMovieCreated?.();
      }
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to add movie.');
    } finally {
      setSubmitting(false);
    }
  };

  // Submit Actor
  const handleActorSubmit = async (e) => {
    e.preventDefault();
    if (!actorForm.name || !actorForm.bio) {
      showNotification('error', 'Actor name and biography are required.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...actorForm,
        image: actorForm.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
        awards: actorForm.awards ? actorForm.awards.split(',').map((a) => a.trim()) : [],
      };

      const res = await createActor(payload);
      if (res.data.success) {
        showNotification('success', `🌟 Lead actor "${res.data.data.name}" registered successfully!`);
        setActorForm({
          name: '',
          image: '',
          bio: '',
          dateOfBirth: '',
          debutYear: 2010,
          nationality: 'American',
          roleType: 'Lead Actor',
          awards: '',
          highlightQuote: '',
        });
        loadResources();
      }
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to register actor.');
    } finally {
      setSubmitting(false);
    }
  };

  // Submit Review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.movie || !reviewForm.reviewerName || !reviewForm.reviewText) {
      showNotification('error', 'Please select a movie and fill in all review details.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await createReview(reviewForm);
      if (res.data.success) {
        showNotification('success', `⭐ Review published under "${reviewForm.platformSource}"!`);
        setReviewForm({
          movie: '',
          platformSource: 'YouTube Critics',
          reviewerName: '',
          rating: 9.0,
          reviewText: '',
          sourceUrl: '',
        });
      }
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Failed to publish review.');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Movie
  const handleDeleteMovie = async (movieId, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await deleteMovie(movieId);
        showNotification('success', `Movie "${title}" removed.`);
        loadResources();
      } catch (err) {
        showNotification('error', 'Failed to delete movie.');
      }
    }
  };

  // Start Editing Movie
  const handleStartEdit = (movie) => {
    setEditingMovie(movie);
    setEditForm({
      title: movie.title || '',
      posterUrl: movie.posterUrl || '',
      bannerUrl: movie.bannerUrl || '',
      trailerUrl: movie.trailerUrl || '',
      releaseDate: movie.releaseDate ? new Date(movie.releaseDate).toISOString().split('T')[0] : '',
      releaseYear: movie.releaseYear || (movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 2025),
      status: movie.status || 'Released',
      genre: Array.isArray(movie.genre) ? movie.genre.join(', ') : (movie.genre || 'Action, Drama'),
      duration: movie.duration || '2h 30m',
      rating: movie.rating !== undefined ? movie.rating : 8.5,
      briefStory: movie.briefStory || '',
      characters: movie.characters && movie.characters.length > 0
        ? movie.characters.map((c) => ({
            characterName: c.characterName || '',
            actor: c.actor?._id || c.actor || '',
            isLead: !!c.isLead,
          }))
        : [{ characterName: '', actor: availableActors[0]?._id || '', isLead: true }],
      streamingPlatforms: movie.streamingPlatforms && movie.streamingPlatforms.length > 0
        ? movie.streamingPlatforms.map((sp) => ({
            platform: sp.platform?._id || sp.platform || '',
            watchUrl: sp.watchUrl || 'https://',
            subscriptionType: sp.subscriptionType || 'Subscription',
          }))
        : [],
    });
  };

  const handleCancelEdit = () => {
    setEditingMovie(null);
  };

  const handleAddEditCharacterRow = () => {
    setEditForm({
      ...editForm,
      characters: [
        ...editForm.characters,
        { characterName: '', actor: availableActors[0]?._id || '', isLead: false },
      ],
    });
  };

  const handleRemoveEditCharacterRow = (index) => {
    setEditForm({
      ...editForm,
      characters: editForm.characters.filter((_, i) => i !== index),
    });
  };

  const handleEditCharacterChange = (index, field, value) => {
    const updated = [...editForm.characters];
    updated[index][field] = value;
    setEditForm({ ...editForm, characters: updated });
  };

  const handleEditPlatformToggle = (platformId) => {
    const exists = editForm.streamingPlatforms.find((p) => p.platform === platformId);
    if (exists) {
      setEditForm({
        ...editForm,
        streamingPlatforms: editForm.streamingPlatforms.filter((p) => p.platform !== platformId),
      });
    } else {
      setEditForm({
        ...editForm,
        streamingPlatforms: [
          ...editForm.streamingPlatforms,
          { platform: platformId, watchUrl: 'https://', subscriptionType: 'Subscription' },
        ],
      });
    }
  };

  const handleUpdateMovieSubmit = async (e) => {
    e.preventDefault();
    const words = countWords(editForm.briefStory);
    if (words < 20 || words > 40) {
      showNotification(
        'error',
        `Brief story must be strictly between 20 and 40 words. Current count is ${words} words.`
      );
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...editForm,
        genre: editForm.genre ? editForm.genre.split(',').map((g) => g.trim()).filter(Boolean) : ['Action'],
        releaseYear: Number(editForm.releaseYear) || (editForm.releaseDate ? new Date(editForm.releaseDate).getFullYear() : 2025),
        rating: Number(editForm.rating),
      };

      const res = await updateMovie(editingMovie._id, payload);
      if (res.data.success) {
        showNotification('success', `✨ Movie "${editForm.title}" updated successfully!`);
        setEditingMovie(null);
        await loadResources();
        onMovieCreated?.();
      } else {
        showNotification('error', res.data.message || 'Failed to update movie.');
      }
    } catch (err) {
      showNotification('error', err.response?.data?.message || 'Error updating movie.');
    } finally {
      setSubmitting(false);
    }
  };

  // If not logged in as admin, show direct 1-click admin login card
  if (!isAdmin) {
    return (
      <div
        className="glass-panel"
        style={{
          maxWidth: '560px',
          margin: '60px auto',
          padding: '40px',
          textAlign: 'center',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px auto',
          }}
        >
          <Lock size={32} color="#ef4444" />
        </div>
        <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '8px' }}>
          Admin Authentication Required
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '24px' }}>
          To dynamically add movies, assign lead actors, write 20-40 word synopses, and manage critic reviews, please authenticate with Admin credentials.
        </p>



        <div style={{ marginTop: '16px', fontSize: '0.8rem', color: '#64748b' }}>
          Demo Admin Credentials: <code>admin@cinesphere.com</code> / <code>admin123</code>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: '60px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Shield size={28} color="#ef4444" />
            <h2 style={{ fontSize: '2rem', color: '#fff' }}>Admin CMS Dashboard</h2>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
            Dynamically add and manage movies, actors (heroes), platforms, and critic reviews.
          </p>
        </div>

        {/* Admin Navigation Sub-Tabs */}
        <div
          style={{
            display: 'flex',
            background: 'rgba(14, 19, 34, 0.9)',
            padding: '4px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-color)',
          }}
        >
          <button
            onClick={() => setActiveAdminTab('addMovie')}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              fontSize: '0.88rem',
              fontWeight: 600,
              cursor: 'pointer',
              background: activeAdminTab === 'addMovie' ? '#6366f1' : 'transparent',
              color: activeAdminTab === 'addMovie' ? '#fff' : '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Film size={15} /> Add Movie
          </button>

          <button
            onClick={() => setActiveAdminTab('addActor')}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              fontSize: '0.88rem',
              fontWeight: 600,
              cursor: 'pointer',
              background: activeAdminTab === 'addActor' ? '#6366f1' : 'transparent',
              color: activeAdminTab === 'addActor' ? '#fff' : '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Users size={15} /> Add Lead Role
          </button>

          <button
            onClick={() => setActiveAdminTab('addReview')}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              fontSize: '0.88rem',
              fontWeight: 600,
              cursor: 'pointer',
              background: activeAdminTab === 'addReview' ? '#6366f1' : 'transparent',
              color: activeAdminTab === 'addReview' ? '#fff' : '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <MessageSquare size={15} /> Add Review
          </button>

          <button
            onClick={() => setActiveAdminTab('manage')}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              fontSize: '0.88rem',
              fontWeight: 600,
              cursor: 'pointer',
              background: activeAdminTab === 'manage' ? '#6366f1' : 'transparent',
              color: activeAdminTab === 'manage' ? '#fff' : '#94a3b8',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Trash2 size={15} /> Manage Movies ({moviesList.length})
          </button>
        </div>
      </div>

      {/* Status Notifications */}
      {statusMessage && (
        <div
          style={{
            padding: '14px 20px',
            borderRadius: '10px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: statusMessage.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            border: `1px solid ${statusMessage.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            color: statusMessage.type === 'success' ? '#6ee7b7' : '#fca5a5',
          }}
        >
          {statusMessage.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span style={{ fontSize: '0.92rem', fontWeight: 600 }}>{statusMessage.text}</span>
        </div>
      )}

      {/* TAB 1: ADD MOVIE FORM */}
      {activeAdminTab === 'addMovie' && (
        <div
          className="glass-panel"
          style={{ padding: '32px', borderRadius: 'var(--radius-lg)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <Film size={22} color="#6366f1" />
            <h3 style={{ fontSize: '1.4rem', color: '#fff' }}>Add Movie Dynamically</h3>
          </div>

          <form onSubmit={handleMovieSubmit}>
            {/* Grid 1: Basic Info */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '16px',
                marginBottom: '18px',
              }}
            >
              <div className="form-group">
                <label className="form-label">Movie Title *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Interstellar"
                  value={movieForm.title}
                  onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Poster Image URL *</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://images.unsplash.com/..."
                  value={movieForm.posterUrl}
                  onChange={(e) => setMovieForm({ ...movieForm, posterUrl: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Banner Image URL (Optional)</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://images.unsplash.com/..."
                  value={movieForm.bannerUrl}
                  onChange={(e) => setMovieForm({ ...movieForm, bannerUrl: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Trailer Link (YouTube)</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={movieForm.trailerUrl}
                  onChange={(e) => setMovieForm({ ...movieForm, trailerUrl: e.target.value })}
                />
              </div>
            </div>

            {/* Grid 2: Dates, Status, Duration & Rating */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '16px',
                marginBottom: '18px',
              }}
            >
              <div className="form-group">
                <label className="form-label">Release Date *</label>
                <input
                  type="date"
                  className="form-input"
                  value={movieForm.releaseDate}
                  onChange={(e) => setMovieForm({ ...movieForm, releaseDate: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Release Status *</label>
                <select
                  className="form-select"
                  value={movieForm.status}
                  onChange={(e) => setMovieForm({ ...movieForm, status: e.target.value })}
                >
                  <option value="Released">Released</option>
                  <option value="Upcoming">Upcoming</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Genres (comma-separated)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Action, Sci-Fi, Drama"
                  value={movieForm.genre}
                  onChange={(e) => setMovieForm({ ...movieForm, genre: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Duration</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 2h 45m"
                  value={movieForm.duration}
                  onChange={(e) => setMovieForm({ ...movieForm, duration: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Rating (1 to 10)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  className="form-input"
                  value={movieForm.rating}
                  onChange={(e) => setMovieForm({ ...movieForm, rating: e.target.value })}
                />
              </div>
            </div>

            {/* Crucial Requirement: Brief Story Synopsis (Strictly 20-40 Words) */}
            <div className="form-group" style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label className="form-label" style={{ color: '#c7d2fe', fontWeight: 700 }}>
                  Brief Story Synopsis * (Strictly 20 to 40 Words)
                </label>
              </div>
              <textarea
                className="form-textarea"
                rows="3"
                placeholder="Write a concise story synopsis between 20 and 40 words..."
                value={movieForm.briefStory}
                onChange={(e) => setMovieForm({ ...movieForm, briefStory: e.target.value })}
                required
              />
              <WordCountIndicator text={movieForm.briefStory} min={20} max={40} />
            </div>

            {/* Dynamic Characters & Actors Assignment */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                marginBottom: '24px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '14px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={18} color="#6366f1" />
                  <h4 style={{ color: '#fff', fontSize: '1.05rem' }}>
                    Cast & Lead Role Assignment
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={handleAddCharacterRow}
                  className="btn btn-secondary btn-sm"
                >
                  <PlusCircle size={14} /> Add Another Character
                </button>
              </div>

              {movieForm.characters.map((charRow, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1.2fr 1.2fr 100px 40px',
                    gap: '12px',
                    alignItems: 'center',
                    marginBottom: '10px',
                  }}
                >
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Character Name (e.g. Cobb, Tony Stark)"
                    value={charRow.characterName}
                    onChange={(e) => handleCharacterChange(idx, 'characterName', e.target.value)}
                    required
                  />

                  <select
                    className="form-select"
                    value={charRow.actor}
                    onChange={(e) => handleCharacterChange(idx, 'actor', e.target.value)}
                    required
                  >
                    <option value="">-- Select Registered Actor/Hero --</option>
                    {availableActors.map((a) => (
                      <option key={a._id} value={a._id}>
                        {a.name} ({a.roleType})
                      </option>
                    ))}
                  </select>

                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.8rem',
                      color: '#cbd5e1',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={charRow.isLead}
                      onChange={(e) => handleCharacterChange(idx, 'isLead', e.target.checked)}
                    />
                    Lead Hero
                  </label>

                  {movieForm.characters.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveCharacterRow(idx)}
                      style={{
                        background: 'rgba(239, 68, 68, 0.2)',
                        border: 'none',
                        color: '#ef4444',
                        borderRadius: '6px',
                        padding: '8px',
                        cursor: 'pointer',
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Streaming Platforms Selector */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                marginBottom: '28px',
              }}
            >
              <h4 style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '12px' }}>
                Select Available Streaming Platforms
              </h4>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {availablePlatforms.map((plat) => {
                  const isSelected = movieForm.streamingPlatforms.some(
                    (p) => p.platform === plat._id
                  );
                  return (
                    <button
                      type="button"
                      key={plat._id}
                      onClick={() => handlePlatformToggle(plat._id)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: '1px solid',
                        borderColor: isSelected ? '#6366f1' : 'rgba(255, 255, 255, 0.1)',
                        background: isSelected ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.03)',
                        color: isSelected ? '#ffffff' : '#94a3b8',
                        fontWeight: 600,
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <span>{isSelected ? '✓' : '+'}</span>
                      <span>{plat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{ padding: '14px 32px', fontSize: '1.05rem' }}
            >
              <PlusCircle size={20} />
              <span>{submitting ? 'Adding Movie...' : 'Save & Publish Movie Dynamically'}</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: ADD ACTOR / LEAD ROLE */}
      {activeAdminTab === 'addActor' && (
        <div
          className="glass-panel"
          style={{ padding: '32px', borderRadius: 'var(--radius-lg)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <Users size={22} color="#10b981" />
            <h3 style={{ fontSize: '1.4rem', color: '#fff' }}>Register New Lead Role / Hero</h3>
          </div>

          <form onSubmit={handleActorSubmit}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '16px',
                marginBottom: '18px',
              }}
            >
              <div className="form-group">
                <label className="form-label">Actor Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Prabhas / Allu Arjun / Jr NTR"
                  value={actorForm.name}
                  onChange={(e) => setActorForm({ ...actorForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Profile Image URL</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://images.unsplash.com/..."
                  value={actorForm.image}
                  onChange={(e) => setActorForm({ ...actorForm, image: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. April 4, 1965"
                  value={actorForm.dateOfBirth}
                  onChange={(e) => setActorForm({ ...actorForm, dateOfBirth: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Career Debut Year *</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="1990"
                  value={actorForm.debutYear}
                  onChange={(e) => setActorForm({ ...actorForm, debutYear: e.target.value })}
                  required
                />
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '16px',
                marginBottom: '18px',
              }}
            >
              <div className="form-group">
                <label className="form-label">Role Type</label>
                <select
                  className="form-select"
                  value={actorForm.roleType}
                  onChange={(e) => setActorForm({ ...actorForm, roleType: e.target.value })}
                >
                  <option value="Lead Actor">Lead Actor</option>
                  <option value="Lead Actress">Lead Actress</option>
                  <option value="Director & Actor">Director & Actor</option>
                  <option value="Supporting Actor">Supporting Actor</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Nationality</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="American, British, Indian, etc."
                  value={actorForm.nationality}
                  onChange={(e) => setActorForm({ ...actorForm, nationality: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Notable Awards (comma-separated)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Oscar Best Actor, Golden Globe Winner, BAFTA"
                  value={actorForm.awards}
                  onChange={(e) => setActorForm({ ...actorForm, awards: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '18px' }}>
              <label className="form-label">Biography & Career Highlights *</label>
              <textarea
                className="form-textarea"
                rows="3"
                placeholder="Enter actor's achievements, acting style, and career background..."
                value={actorForm.bio}
                onChange={(e) => setActorForm({ ...actorForm, bio: e.target.value })}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label">Highlight Quote</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. I am Iron Man."
                value={actorForm.highlightQuote}
                onChange={(e) => setActorForm({ ...actorForm, highlightQuote: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{ padding: '14px 32px', fontSize: '1.05rem', background: 'linear-gradient(135deg, #10b981, #059669)' }}
            >
              <Users size={20} />
              <span>{submitting ? 'Registering...' : 'Register Lead Actor'}</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: ADD REVIEW */}
      {activeAdminTab === 'addReview' && (
        <div
          className="glass-panel"
          style={{ padding: '32px', borderRadius: 'var(--radius-lg)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <MessageSquare size={22} color="#f59e0b" />
            <h3 style={{ fontSize: '1.4rem', color: '#fff' }}>Attach Critic Review & Platform Source</h3>
          </div>

          <form onSubmit={handleReviewSubmit}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '16px',
                marginBottom: '18px',
              }}
            >
              <div className="form-group">
                <label className="form-label">Select Movie *</label>
                <select
                  className="form-select"
                  value={reviewForm.movie}
                  onChange={(e) => setReviewForm({ ...reviewForm, movie: e.target.value })}
                  required
                >
                  <option value="">-- Choose Movie --</option>
                  {moviesList.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.title} ({m.releaseYear})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Platform Source *</label>
                <select
                  className="form-select"
                  value={reviewForm.platformSource}
                  onChange={(e) => setReviewForm({ ...reviewForm, platformSource: e.target.value })}
                >
                  <option value="Thyview (YouTube Critics)">Thyview (YouTube Critics)</option>
                  <option value="GreatAndhra Telugu Review">GreatAndhra Telugu Review</option>
                  <option value="Idlebrain Telugu Cinema">Idlebrain Telugu Cinema</option>
                  <option value="123Telugu Review">123Telugu Review</option>
                  <option value="Times of India (Telugu Cinema)">Times of India (Telugu Cinema)</option>
                  <option value="Film Companion South">Film Companion South</option>
                  <option value="YouTube Critics">YouTube Critics</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Reviewer / Channel Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Thyview Official, Jeevi, Venkat Arikatla, Baradwaj Rangan"
                  value={reviewForm.reviewerName}
                  onChange={(e) => setReviewForm({ ...reviewForm, reviewerName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Rating (1 to 10) *</label>
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

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label">Review Excerpt / Summary *</label>
              <textarea
                className="form-textarea"
                rows="3"
                placeholder="Enter critic verdict..."
                value={reviewForm.reviewText}
                onChange={(e) => setReviewForm({ ...reviewForm, reviewText: e.target.value })}
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{ padding: '14px 32px', fontSize: '1.05rem', background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
            >
              <MessageSquare size={20} />
              <span>{submitting ? 'Publishing...' : 'Publish Critic Review'}</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: MANAGE MOVIES */}
      {activeAdminTab === 'manage' && (
        <div
          className="glass-panel"
          style={{ padding: '24px', borderRadius: 'var(--radius-lg)' }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '14px',
              marginBottom: '20px',
            }}
          >
            <div>
              <h3 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '4px' }}>
                Existing Movies Database ({moviesList.length} Entries)
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                Click the <Edit3 size={13} style={{ display: 'inline', color: '#38bdf8' }} /> Edit button to modify synopses, posters, lead heroes, or ratings.
              </p>
            </div>

            {/* Live Search inside Admin Table */}
            <div style={{ position: 'relative', width: '300px', maxWidth: '100%' }}>
              <Search
                size={16}
                color="#38bdf8"
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                className="form-input"
                style={{
                  paddingLeft: '38px',
                  paddingRight: adminSearchQuery ? '36px' : '14px',
                  paddingTop: '8px',
                  paddingBottom: '8px',
                  fontSize: '0.88rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(5, 7, 14, 0.85)',
                }}
                placeholder="Filter by title or genre..."
                value={adminSearchQuery}
                onChange={(e) => setAdminSearchQuery(e.target.value)}
              />
              {adminSearchQuery && (
                <button
                  onClick={() => setAdminSearchQuery('')}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: '#94a3b8', fontSize: '0.85rem' }}>
                  <th style={{ padding: '12px' }}>Poster</th>
                  <th style={{ padding: '12px' }}>Title</th>
                  <th style={{ padding: '12px' }}>Year</th>
                  <th style={{ padding: '12px' }}>Status</th>
                  <th style={{ padding: '12px' }}>Rating</th>
                  <th style={{ padding: '12px' }}>Synopsis Words</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {moviesList
                  .filter(
                    (m) =>
                      !adminSearchQuery ||
                      m.title.toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
                      m.genre?.some((g) => g.toLowerCase().includes(adminSearchQuery.toLowerCase()))
                  )
                  .map((movie) => {
                    const wCount = countWords(movie.briefStory);
                    return (
                      <tr
                        key={movie._id}
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.9rem' }}
                      >
                        <td style={{ padding: '10px 12px' }}>
                          <img
                            src={movie.posterUrl}
                            alt={movie.title}
                            style={{ width: '40px', height: '55px', borderRadius: '4px', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=150&q=80';
                            }}
                          />
                        </td>
                        <td style={{ padding: '10px 12px', fontWeight: 700, color: '#fff' }}>
                          {movie.title}
                        </td>
                        <td style={{ padding: '10px 12px', color: '#cbd5e1' }}>{movie.releaseYear}</td>
                        <td style={{ padding: '10px 12px' }}>
                          <span className={movie.status === 'Upcoming' ? 'badge badge-upcoming' : 'badge badge-released'}>
                            {movie.status}
                          </span>
                        </td>
                        <td style={{ padding: '10px 12px', color: '#fbbf24', fontWeight: 700 }}>
                          ⭐ {movie.rating}
                        </td>
                        <td style={{ padding: '10px 12px', color: '#10b981', fontFamily: 'JetBrains Mono' }}>
                          {wCount} words
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => handleStartEdit(movie)}
                              className="btn btn-sm"
                              style={{
                                padding: '6px 10px',
                                background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(139, 92, 246, 0.2))',
                                color: '#38bdf8',
                                border: '1px solid rgba(56, 189, 248, 0.4)',
                                borderRadius: 'var(--radius-xs)',
                              }}
                              title="Edit Movie Details"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteMovie(movie._id, movie.title)}
                              className="btn btn-danger btn-sm"
                              style={{ padding: '6px 10px', borderRadius: 'var(--radius-xs)' }}
                              title="Delete Movie"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* EDIT MOVIE MODAL */}
      {editingMovie && (
        <div className="modal-overlay" onClick={handleCancelEdit}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '880px', padding: '32px' }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '24px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                paddingBottom: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #00f2fe 0%, #7928ca 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Edit3 size={20} color="#fff" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.4rem', color: '#fff', fontWeight: 800 }}>
                    Edit Movie: {editingMovie.title}
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    ID: {editingMovie._id}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCancelEdit}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#e2e8f0',
                  cursor: 'pointer',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Edit Form */}
            <form onSubmit={handleUpdateMovieSubmit}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '16px',
                  marginBottom: '18px',
                }}
              >
                <div className="form-group">
                  <label className="form-label">Movie Title *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Poster URL *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editForm.posterUrl}
                    onChange={(e) => setEditForm({ ...editForm, posterUrl: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Release Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={editForm.releaseDate}
                    onChange={(e) => setEditForm({ ...editForm, releaseDate: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  >
                    <option value="Released">Released</option>
                    <option value="Upcoming">Upcoming</option>
                  </select>
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                  marginBottom: '18px',
                }}
              >
                <div className="form-group">
                  <label className="form-label">Genres (comma-separated)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editForm.genre}
                    onChange={(e) => setEditForm({ ...editForm, genre: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Duration</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editForm.duration}
                    onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Rating (1 to 10)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="10"
                    className="form-input"
                    value={editForm.rating}
                    onChange={(e) => setEditForm({ ...editForm, rating: e.target.value })}
                  />
                </div>
              </div>

              {/* Brief Story Synopsis with Live Word Count Validator */}
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">
                  <Sparkles size={14} color="#38bdf8" />
                  Brief Story Synopsis (Strict Rule: 20 to 40 words) *
                </label>
                <textarea
                  className="form-textarea"
                  rows="3"
                  value={editForm.briefStory}
                  onChange={(e) => setEditForm({ ...editForm, briefStory: e.target.value })}
                  required
                />
                <WordCountIndicator text={editForm.briefStory} min={20} max={40} />
              </div>

              {/* Characters & Lead Actors Assignment */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label className="form-label">Lead Characters & Hero Assignment</label>
                  <button
                    type="button"
                    onClick={handleAddEditCharacterRow}
                    className="btn btn-secondary btn-sm"
                  >
                    + Add Character Role
                  </button>
                </div>

                {editForm.characters.map((char, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      gap: '10px',
                      alignItems: 'center',
                      marginBottom: '10px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      padding: '10px',
                      borderRadius: 'var(--radius-xs)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Character Name (e.g. Baahubali)"
                      value={char.characterName}
                      onChange={(e) => handleEditCharacterChange(index, 'characterName', e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <select
                      className="form-select"
                      value={char.actor}
                      onChange={(e) => handleEditCharacterChange(index, 'actor', e.target.value)}
                      style={{ flex: 1 }}
                    >
                      <option value="">-- Assign Lead Actor / Hero --</option>
                      {availableActors.map((act) => (
                        <option key={act._id} value={act._id}>
                          {act.name} ({act.roleType || 'Actor'})
                        </option>
                      ))}
                    </select>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: '#94a3b8' }}>
                      <input
                        type="checkbox"
                        checked={char.isLead}
                        onChange={(e) => handleEditCharacterChange(index, 'isLead', e.target.checked)}
                      />
                      Lead
                    </label>
                    {editForm.characters.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveEditCharacterRow(index)}
                        className="btn btn-danger btn-sm"
                        style={{ padding: '6px 10px' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Streaming Platforms */}
              <div style={{ marginBottom: '24px' }}>
                <label className="form-label">Streaming Platforms</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
                  {availablePlatforms.map((plat) => {
                    const isSelected = editForm.streamingPlatforms.some((p) => p.platform === plat._id);
                    return (
                      <button
                        type="button"
                        key={plat._id}
                        onClick={() => handleEditPlatformToggle(plat._id)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: 'var(--radius-full)',
                          border: `1px solid ${isSelected ? plat.badgeColor || '#8b5cf6' : 'rgba(255,255,255,0.1)'}`,
                          background: isSelected ? `${plat.badgeColor || '#8b5cf6'}30` : 'rgba(255,255,255,0.03)',
                          color: isSelected ? '#ffffff' : '#94a3b8',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {plat.name} {isSelected && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Modal Buttons */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="btn btn-secondary"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                  style={{
                    background: 'linear-gradient(135deg, #00f2fe 0%, #7928ca 100%)',
                    boxShadow: '0 0 20px rgba(0, 242, 254, 0.4)',
                  }}
                >
                  <Save size={18} />
                  <span>{submitting ? 'Saving Changes...' : 'Save & Update Movie'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
