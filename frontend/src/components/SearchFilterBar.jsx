import React from 'react';
import { Search, Filter, Sparkles, Tv, Clapperboard, X } from 'lucide-react';

const GENRES = ['All', 'Action', 'Drama', 'Period', 'Crime', 'Thriller', 'Sci-Fi', 'Fantasy', 'Mythology', 'Comedy'];

const SearchFilterBar = ({
  searchQuery,
  setSearchQuery,
  selectedGenre,
  setSelectedGenre,
  selectedStatus,
  setSelectedStatus,
  selectedPlatform,
  setSelectedPlatform,
  platforms,
  sortOption,
  setSortOption,
  totalResults,
}) => {
  return (
    <div
      className="glass-panel"
      style={{
        padding: '22px 24px',
        marginBottom: '36px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'linear-gradient(135deg, rgba(15, 21, 40, 0.75) 0%, rgba(6, 8, 16, 0.85) 100%)',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.1)',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      {/* Top Search Input row */}
      <div
        style={{
          display: 'flex',
          gap: '14px',
          alignItems: 'center',
          flexWrap: 'wrap',
          marginBottom: '18px',
        }}
      >
        <div
          style={{
            position: 'relative',
            flex: 1,
            minWidth: '280px',
          }}
        >
          <Search
            size={19}
            color="#38bdf8"
            style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            className="form-input"
            style={{
              paddingLeft: '48px',
              paddingRight: searchQuery ? '42px' : '18px',
              fontSize: '0.98rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(5, 7, 14, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: 'inset 0 2px 6px rgba(0, 0, 0, 0.5)',
            }}
            placeholder="Search Telugu movies, Hero (Prabhas, NTR, Charan, Allu Arjun), Character, or Story..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '16px',
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

        {/* Platform Dropdown filter */}
        <div style={{ minWidth: '190px' }}>
          <select
            className="form-select"
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            style={{
              borderRadius: 'var(--radius-full)',
              background: 'rgba(5, 7, 14, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#e2e8f0',
              fontSize: '0.9rem',
            }}
          >
            <option value="All">All Streaming Platforms</option>
            {platforms?.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Dropdown */}
        <div style={{ minWidth: '170px' }}>
          <select
            className="form-select"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            style={{
              borderRadius: 'var(--radius-full)',
              background: 'rgba(5, 7, 14, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#e2e8f0',
              fontSize: '0.9rem',
            }}
          >
            <option value="rating">⭐ Top Rated First</option>
            <option value="year_desc">🎬 Latest Releases</option>
            <option value="year_asc">🕰️ Oldest Releases</option>
            <option value="title">🔤 Title (A - Z)</option>
          </select>
        </div>
      </div>

      {/* Second Row: Status Tabs & Genre Pills */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
        }}
      >
        {/* Status Toggle (All / Released / Upcoming) */}
        <div
          style={{
            display: 'flex',
            background: 'rgba(5, 7, 14, 0.75)',
            padding: '4px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {['All', 'Released', 'Upcoming'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              style={{
                padding: '6px 16px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                background:
                  selectedStatus === st
                    ? st === 'Upcoming'
                      ? 'linear-gradient(135deg, #ff0055 0%, #db2777 100%)'
                      : st === 'Released'
                      ? 'linear-gradient(135deg, #00f59b 0%, #059669 100%)'
                      : 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)'
                    : 'transparent',
                color:
                  selectedStatus === st
                    ? st === 'Released'
                      ? '#042f2e'
                      : '#ffffff'
                    : '#94a3b8',
                boxShadow: selectedStatus === st ? '0 0 14px rgba(0, 0, 0, 0.5)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              {st === 'All' ? 'All Movies' : st === 'Released' ? '🎬 Released' : '🚀 Upcoming'}
            </button>
          ))}
        </div>

        {/* Genre Filter Pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
          {GENRES.map((g) => {
            const isSelected = selectedGenre === g;
            return (
              <button
                key={g}
                onClick={() => setSelectedGenre(g)}
                style={{
                  padding: '5px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid',
                  borderColor: isSelected ? 'rgba(0, 242, 254, 0.6)' : 'rgba(255, 255, 255, 0.07)',
                  background: isSelected
                    ? 'linear-gradient(135deg, rgba(0, 242, 254, 0.25) 0%, rgba(139, 92, 246, 0.25) 100%)'
                    : 'rgba(255, 255, 255, 0.03)',
                  color: isSelected ? '#ffffff' : '#94a3b8',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: isSelected ? '0 0 12px rgba(0, 242, 254, 0.3)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                {g}
              </button>
            );
          })}
        </div>

        {/* Total Results Count */}
        <div
          style={{
            fontSize: '0.85rem',
            color: '#94a3b8',
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontFamily: 'Space Grotesk',
          }}
        >
          <Clapperboard size={16} color="#ff0055" />
          <span>
            Showing <strong style={{ color: '#fff' }}>{totalResults}</strong> Telugu titles
          </span>
        </div>
      </div>
    </div>
  );
};

export default SearchFilterBar;
