import React, { useState, useEffect } from 'react';
import { Search, Users, Award, Film, RefreshCw, X, Sparkles } from 'lucide-react';
import ActorCard from '../components/ActorCard';
import ActorDetailsModal from '../components/ActorDetailsModal';
import MovieDetailsModal from '../components/MovieDetailsModal';
import { fetchActors } from '../services/api';

const ROLE_TYPES = ['All', 'Lead Actor', 'Lead Actress', 'Director & Actor', 'Supporting Actor'];

const ActorsPage = () => {
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleType, setSelectedRoleType] = useState('All');

  // Modals
  const [selectedActor, setSelectedActor] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const loadActors = async () => {
    setLoading(true);
    try {
      const params = {
        search: searchQuery,
        roleType: selectedRoleType,
      };
      const res = await fetchActors(params);
      if (res.data.success) {
        setActors(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch actors', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      loadActors();
    }, 250);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, selectedRoleType]);

  return (
    <div style={{ paddingBottom: '60px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
          <Users size={28} color="#6366f1" />
          <h2 style={{ fontSize: '2rem', color: '#fff' }}>Lead Roles & Heroes Spotlight</h2>
        </div>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
          Search for iconic lead actors, explore their biography, career debut, previous blockbusters, and upcoming projects.
        </p>
      </div>

      {/* Hero Search Bar & Filters */}
      <div
        style={{
          background: 'rgba(14, 19, 34, 0.75)',
          backdropFilter: 'blur(16px)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          padding: '20px',
          marginBottom: '32px',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '14px',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          {/* Search by Hero Name */}
          <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
            <Search
              size={18}
              color="#818cf8"
              style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              className="form-input"
              style={{
                paddingLeft: '44px',
                paddingRight: searchQuery ? '40px' : '16px',
                fontSize: '1rem',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(7, 10, 18, 0.8)',
              }}
              placeholder="Search Telugu hero name (e.g. Prabhas, NTR Jr., Ram Charan, Allu Arjun, Mahesh Babu, Nani)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Role Types */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {ROLE_TYPES.map((rt) => (
              <button
                key={rt}
                onClick={() => setSelectedRoleType(rt)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid',
                  borderColor: selectedRoleType === rt ? '#6366f1' : 'rgba(255, 255, 255, 0.08)',
                  background: selectedRoleType === rt ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.03)',
                  color: selectedRoleType === rt ? '#ffffff' : '#94a3b8',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {rt}
              </button>
            ))}
          </div>

          <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginLeft: 'auto' }}>
            Total Heroes: <span style={{ color: '#fff', fontWeight: 700 }}>{actors.length}</span>
          </div>
        </div>
      </div>

      {/* Actors Grid */}
      {loading ? (
        <div
          style={{
            minHeight: '260px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
          }}
        >
          <RefreshCw size={28} className="animate-pulse-subtle" color="#6366f1" />
          <span style={{ color: '#94a3b8', fontSize: '0.95rem' }}>Loading heroes and cast...</span>
        </div>
      ) : actors.length > 0 ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          {actors.map((actor) => (
            <ActorCard
              key={actor._id}
              actor={actor}
              onSelect={(a) => setSelectedActor(a)}
            />
          ))}
        </div>
      ) : (
        <div
          className="glass-panel"
          style={{
            padding: '60px 20px',
            textAlign: 'center',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <Users size={48} color="#64748b" style={{ margin: '0 auto 16px auto', display: 'block' }} />
          <h3 style={{ fontSize: '1.4rem', color: '#f8fafc', marginBottom: '8px' }}>
            No lead actors found matching "{searchQuery}"
          </h3>
          <p style={{ color: '#94a3b8', maxWidth: '450px', margin: '0 auto 20px auto', fontSize: '0.9rem' }}>
            You can add new actors and lead roles dynamically anytime via the Admin CMS.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedRoleType('All');
            }}
            className="btn btn-secondary btn-sm"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Actor Portfolio Modal (with Previous & Upcoming movies) */}
      {selectedActor && (
        <ActorDetailsModal
          initialActor={selectedActor}
          onClose={() => setSelectedActor(null)}
          onSelectMovie={(m) => setSelectedMovie(m)}
        />
      )}

      {/* Movie Details Modal if user clicks from filmography */}
      {selectedMovie && (
        <MovieDetailsModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onSelectActor={(a) => setSelectedActor(a)}
          onMovieDeleted={() => {}}
          onRefreshMovie={() => {}}
        />
      )}
    </div>
  );
};

export default ActorsPage;
