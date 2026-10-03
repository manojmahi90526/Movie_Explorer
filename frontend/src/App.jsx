import React, { useState } from 'react';
import Navbar from './components/Navbar';
import MoviesPage from './pages/MoviesPage';
import ActorsPage from './pages/ActorsPage';
import AdminDashboard from './pages/AdminDashboard';

import SchemaModal from './components/SchemaModal';
import { Database } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('movies');
  const [isSchemaModalOpen, setIsSchemaModalOpen] = useState(false);
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Sticky Header Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSchemaModal={() => setIsSchemaModalOpen(true)}
      />

      {/* Main Page Views */}
      <main className="app-container" style={{ flex: 1, paddingTop: '32px' }}>
        {activeTab === 'movies' && <MoviesPage />}
        {activeTab === 'actors' && <ActorsPage />}
        {activeTab === 'admin' && (
          <AdminDashboard onMovieCreated={() => setActiveTab('movies')} />
        )}
      </main>

      {/* Schema Architecture Modal */}
      {isSchemaModalOpen && (
        <SchemaModal onClose={() => setIsSchemaModalOpen(false)} />
      )}

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-color)',
          background: 'rgba(7, 10, 18, 0.95)',
          padding: '30px 0',
          marginTop: 'auto',
        }}
      >
        <div
          className="app-container"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            fontSize: '0.88rem',
            color: '#94a3b8',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 700, color: '#fff' }}>CineSphere</span> • Full-Stack MERN Movie & Cast Discovery Platform
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => setIsSchemaModalOpen(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#38bdf8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.85rem',
              }}
            >
              <Database size={15} /> 4+ Relational Collections
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
