import React from 'react';
import { Film, Users, Database } from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab, onOpenSchemaModal }) => {

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(5, 7, 14, 0.82)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5), inset 0 -1px 0 rgba(255, 255, 255, 0.05)',
      }}
    >
      <div
        className="app-container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '76px',
        }}
      >
        {/* Brand Logo */}
        <div
          onClick={() => setActiveTab('movies')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #ff0055 0%, #8b5cf6 50%, #00f2fe 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 25px rgba(255, 0, 85, 0.45)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Film size={24} color="#ffffff" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' }} />
          </div>
          <div>
            <h1
              className="text-gradient-aurora"
              style={{
                fontSize: '1.5rem',
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
              }}
            >
              CineSphere
            </h1>
            <span
              style={{
                fontSize: '0.72rem',
                color: '#38bdf8',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontWeight: 700,
                fontFamily: 'Space Grotesk',
              }}
            >
              Movie Explorer
            </span>
          </div>
        </div>

        {/* Navigation Tabs (Glass Capsule Console) */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(15, 21, 40, 0.65)',
            padding: '5px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.3)',
          }}
        >
          <button
            onClick={() => setActiveTab('movies')}
            className="btn"
            style={{
              padding: '8px 18px',
              fontSize: '0.9rem',
              borderRadius: 'var(--radius-full)',
              background: activeTab === 'movies' ? 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)' : 'transparent',
              color: activeTab === 'movies' ? '#ffffff' : '#94a3b8',
              boxShadow: activeTab === 'movies' ? '0 0 18px rgba(124, 58, 237, 0.5)' : 'none',
            }}
          >
            <Film size={16} />
            <span>Movies</span>
          </button>

          <button
            onClick={() => setActiveTab('actors')}
            className="btn"
            style={{
              padding: '8px 18px',
              fontSize: '0.9rem',
              borderRadius: 'var(--radius-full)',
              background: activeTab === 'actors' ? 'linear-gradient(135deg, #ffb703 0%, #fb8500 100%)' : 'transparent',
              color: activeTab === 'actors' ? '#0b0f19' : '#94a3b8',
              fontWeight: activeTab === 'actors' ? 700 : 600,
              boxShadow: activeTab === 'actors' ? '0 0 18px rgba(255, 183, 3, 0.5)' : 'none',
            }}
          >
            <Users size={16} />
            <span>Lead Roles</span>
          </button>



          <button
            onClick={onOpenSchemaModal}
            className="btn"
            style={{
              padding: '8px 16px',
              fontSize: '0.85rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(0, 242, 254, 0.08)',
              border: '1px solid rgba(0, 242, 254, 0.25)',
              color: '#38bdf8',
            }}
            title="View Database Architecture (4+ Tables)"
          >
            <Database size={15} color="#00f2fe" />
            <span>4 Tables Schema</span>
          </button>
        </nav>

      </div>
    </header>
  );
};

export default Navbar;
