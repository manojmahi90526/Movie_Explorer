# 🎬 CineSphere — Full-Stack MERN Movie & Cast Explorer

A modern, production-grade **MERN Stack** (MongoDB, Express.js, React, Node.js) web application built specifically for campus placement drives, technical interviews, and full-stack portfolio demonstrations.

---

## 🌟 Key Highlights & Features

### 1. 🛡️ Dynamic Movie Management (Admin CMS)
- Admins can dynamically add and edit movies with high-resolution posters, banners, YouTube trailers, genres, release status (*Released* vs *Upcoming*), and durations.
- **Strict 20–40 Word Story Synopsis Validator**: Enforces a concise 20 to 40-word plot brief both on the backend (Mongoose schema custom validator) and frontend with a real-time reactive word-counter indicator.
- **Dynamic Cast & Character Mapping**: Link registered lead actors/heroes to specific character names (e.g., *Cillian Murphy* as *J. Robert Oppenheimer*).
- **Streaming Platforms Selector**: Attach available streaming providers (*Netflix, Amazon Prime, Disney+ Hotstar, YouTube Movies, Apple TV+*) with direct watch links.

### 2. 🔍 Movie Search & Discovery
- Real-time debounced search by movie title, character name, actor/hero name, or story keywords.
- Dynamic filtering by **Release Status** (*All / Released / Upcoming*), **Genre**, and **Streaming Platform**.
- Each movie displays:
  - Concise story synopsis (20–40 words).
  - Critic reviews tagged with their source platform (*YouTube Critics, Rotten Tomatoes, IMDb, Letterboxd*).
  - List of main characters and the actors who played them.
  - Direct streaming links.

### 3. 🦸 Lead Role (Hero) Search & Portfolio
- Search lead actors/heroes by name to view:
  - Biography, birth date, career debut year, nationality, awards & honors.
  - **Previous Movies Grid**: Aggregates all released movies featuring the hero.
  - **Upcoming Movies Pipeline**: Showcases future announced projects and expected release years.

### 4. 🗄️ Database Architecture (5 Relational Collections / Tables)
1. **`Movies`**: Title, poster, banner, trailer, release date, status, rating, 20-40 word synopsis, character array, streaming platform array.
2. **`Actors`**: Name, profile image, bio, debut year, birth date, nationality, role type, awards.
3. **`Reviews`**: Foreign key reference to `Movie`, platform source (*YouTube, IMDb, etc.*), reviewer name, rating (1–10), review excerpt.
4. **`Platforms`**: Streaming and critic platform metadata, logos, badges, and base URLs.
5. **`Users`**: JWT authentication and role-based access control (*admin* vs *user*).

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation & Execution
```bash
# 1. Install root, backend, and frontend dependencies
npm run install:all

# 2. Run both Backend & Frontend concurrently with one command
npm run dev
```

- **Frontend App**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`
- **API Health Check**: `http://localhost:5000/api/health`

### 🔑 Demo Credentials (Included Out-of-the-Box)
- **Admin**: `admin@cinesphere.com` / `admin123` *(Full CMS privileges)*
- **User**: `user@cinesphere.com` / `user123` *(Browsing & Searching)*
- *Tip: You can also use the **"1-Click Admin Demo"** button on the Navbar for instant access during placement presentations.*

---

## 💡 Placement Drive & Interview Talking Points

1. **Relational Modeling in NoSQL**:
   - Demonstrated normalization and referencing via Mongoose `ObjectId` and `.populate()` across 5 collections rather than unindexed embedded documents.
2. **Custom Validation & Business Logic**:
   - Implemented a custom Mongoose validator on `briefStory` ensuring strict 20–40 word length constraints, paired with real-time UI word counters.
3. **Performance Optimization**:
   - Frontend search inputs utilize debouncing (250ms) to prevent unnecessary API overhead and server requests.
4. **Security & RBAC**:
   - Secure password hashing with `bcryptjs` and stateless session verification using `jsonwebtoken` (JWT) with admin-only middleware guards.
