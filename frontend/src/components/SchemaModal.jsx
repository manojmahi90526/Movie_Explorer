import React from 'react';
import { X, Database, Table, ShieldCheck, Cpu, GitMerge } from 'lucide-react';

const SchemaModal = ({ onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '920px', padding: '30px' }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
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
          }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, #0284c7, #0369a1)',
              padding: '10px',
              borderRadius: '12px',
              boxShadow: '0 0 20px rgba(2, 132, 199, 0.4)',
            }}
          >
            <Database size={24} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.6rem', color: '#fff' }}>
              Database Architecture (5 Relational Collections)
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Designed for Placement Drives & Viva Evaluations (MERN Stack with Mongoose Relational Population)
            </p>
          </div>
        </div>

        {/* 4+ Collections Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '16px',
            marginTop: '24px',
          }}
        >
          {/* Table 1: Movies */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '12px',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              padding: '18px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Table size={16} color="#818cf8" />
              <h4 style={{ color: '#c7d2fe', fontSize: '1.05rem' }}>1. Movies Collection</h4>
            </div>
            <ul style={{ fontSize: '0.82rem', color: '#cbd5e1', listStyle: 'none', lineHeight: 1.8 }}>
              <li>• <code>title</code>: String (Indexed)</li>
              <li>• <code>briefStory</code>: String (<strong>20–40 words validator</strong>)</li>
              <li>• <code>status</code>: 'Released' | 'Upcoming'</li>
              <li>• <code>rating</code>: Number (1–10)</li>
              <li>• <code>characters[]</code>: [&#123; characterName, actor: ObjectId &#125;]</li>
              <li>• <code>streamingPlatforms[]</code>: [&#123; platform: ObjectId &#125;]</li>
            </ul>
          </div>

          {/* Table 2: Actors (Lead Roles / Heroes) */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '12px',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              padding: '18px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Table size={16} color="#34d399" />
              <h4 style={{ color: '#a7f3d0', fontSize: '1.05rem' }}>2. Actors Collection</h4>
            </div>
            <ul style={{ fontSize: '0.82rem', color: '#cbd5e1', listStyle: 'none', lineHeight: 1.8 }}>
              <li>• <code>name</code>: String (Indexed)</li>
              <li>• <code>image</code>: String (URL)</li>
              <li>• <code>bio</code>: String (Bio & Highlights)</li>
              <li>• <code>debutYear</code>: Number</li>
              <li>• <code>dateOfBirth</code>: String</li>
              <li>• <code>roleType</code>: 'Lead Actor' | 'Lead Actress'</li>
              <li>• <code>awards</code>: [String]</li>
            </ul>
          </div>

          {/* Table 3: Reviews */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '12px',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              padding: '18px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Table size={16} color="#fbbf24" />
              <h4 style={{ color: '#fde68a', fontSize: '1.05rem' }}>3. Reviews Collection</h4>
            </div>
            <ul style={{ fontSize: '0.82rem', color: '#cbd5e1', listStyle: 'none', lineHeight: 1.8 }}>
              <li>• <code>movie</code>: ObjectId (ref 'Movie')</li>
              <li>• <code>platformSource</code>: 'Thyview' | 'GreatAndhra' | 'Idlebrain' | '123Telugu'</li>
              <li>• <code>reviewerName</code>: String</li>
              <li>• <code>rating</code>: Number (1–10)</li>
              <li>• <code>reviewText</code>: String</li>
              <li>• <code>sourceUrl</code>: String</li>
            </ul>
          </div>

          {/* Table 4: Streaming Platforms */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '12px',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              padding: '18px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Table size={16} color="#22d3ee" />
              <h4 style={{ color: '#a5f3fc', fontSize: '1.05rem' }}>4. Platforms Collection</h4>
            </div>
            <ul style={{ fontSize: '0.82rem', color: '#cbd5e1', listStyle: 'none', lineHeight: 1.8 }}>
              <li>• <code>name</code>: 'Aha Video' | 'Netflix' | 'Prime' | 'Hotstar' | 'Zee5'</li>
              <li>• <code>logo</code>: String (URL)</li>
              <li>• <code>category</code>: 'Streaming Service' | 'Video Platform'</li>
              <li>• <code>websiteUrl</code>: String</li>
              <li>• <code>badgeColor</code>: Hex Code</li>
            </ul>
          </div>

          {/* Table 5: Users (Admin / User Auth) */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '12px',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              padding: '18px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Table size={16} color="#f87171" />
              <h4 style={{ color: '#fecaca', fontSize: '1.05rem' }}>5. Users (Auth & RBAC)</h4>
            </div>
            <ul style={{ fontSize: '0.82rem', color: '#cbd5e1', listStyle: 'none', lineHeight: 1.8 }}>
              <li>• <code>name</code>: String</li>
              <li>• <code>email</code>: String (Unique)</li>
              <li>• <code>password</code>: Bcrypt Hashed String</li>
              <li>• <code>role</code>: 'admin' | 'user'</li>
            </ul>
          </div>
        </div>

        {/* Technical Highlights Box */}
        <div
          style={{
            marginTop: '24px',
            background: 'rgba(2, 132, 199, 0.08)',
            border: '1px solid rgba(2, 132, 199, 0.3)',
            borderRadius: '10px',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <ShieldCheck size={24} color="#38bdf8" />
          <div style={{ fontSize: '0.85rem', color: '#e0f2fe' }}>
            <strong>Recruiter Talking Point:</strong> Explain how MongoDB references (`ObjectId`) and Mongoose `.populate()` were utilized to model real-world relationships across 5 normalized collections, maintaining ACID principles with JWT-based role authentication.
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchemaModal;
