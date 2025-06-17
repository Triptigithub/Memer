# 🚀 MemeHustle

A modern meme marketplace where users can create, bid, upvote, and get AI-generated captions/vibes. Built with React + Vite (Tailwind CSS) frontend and Node.js + Express backend with Supabase (PostgreSQL) and Socket.IO for real-time interactions. AI caption/vibe integration is stubbed with fallback logic.

<!-- Badges (example) -->
[![Node.js](https://img.shields.io/badge/Node.js-16%2B-43853D?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-4.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-realtime-010101?logo=socket.io&logoColor=white)](https://socket.io/)

---

## ✨ Features

- **📝 Meme Creation**: Submit title, image URL, and tags.
- **⚡ Real-Time Bidding**: Place bids on memes; highest bid displayed and broadcast live.
- **👍 Upvote/Downvote & Leaderboard**: Vote on memes; top memes listed.
- **🤖 AI Captions & Vibes**: Generate witty captions and “vibe” descriptions (stubbed with fallback; replace with real API if available).
- **🔍 Search & Grid View**: Search by title or tags; always shows grid layout.
- **🔒 Mock Authentication**: Random UUID per session stored in localStorage to identify users.
- **🎨 Modern UI**: Responsive, clean cards, search bar, loading states.

---

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, lucide-react icons, Axios, Socket.IO client.
- **Backend**: Node.js, Express, Socket.IO, @supabase/supabase-js, Axios (for AI stubs), dotenv.
- **Database**: Supabase (PostgreSQL). Tables: `memes`, `bids`; RPC for upvote increments.
- **Deployment**: 
  - Backend: Render.
  - Frontend: Vercel.
- **AI Integration**: Stubbed calls with random fallback; replace in `backend/src/services/aiService.js` if you have a key/spec.

---

## 🔧 Prerequisites

- Node.js (v16+), npm
- Supabase project (hosted) with URL and Service Role Key
- (Optional) AI API key for real integration; otherwise stub/fallback is used

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

Copy `backend/.env.example` and fill:
```env
SUPABASE_URL=https://<your-project-ref>.supabase.co
SUPABASE_SERVICE_KEY=<your-service-role-key>
GOOGLE_GEMINI_API_KEY=<optional; leave blank for fallback>
PORT=5000
```
### Frontend (frontend/.env)
```env
VITE_API_URL=https://<your-backend-domain>/api
VITE_SOCKET_URL=https://<your-backend-domain>
```
## 💾 Supabase Schema
In Supabase Dashboard → SQL Editor, run:

1. **Enable UUID extension** (if needed):
```sql
create extension if not exists "uuid-ossp";
```
2. **Create memes table**:
```sql
create table if not exists memes (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  image_url text not null,
  tags text[] not null,
  upvotes integer not null default 0,
  owner_id text not null,
  caption text,
  vibe text,
  created_at timestamp with time zone default now()
);
create index if not exists idx_memes_tags on memes using gin (tags);
```
3. **Create bids table**:
```sql
create table if not exists bids (
  id uuid primary key default uuid_generate_v4(),
  meme_id uuid references memes(id) on delete cascade,
  user_id text not null,
  credits integer not null,
  created_at timestamp with time zone default now()
);
create index if not exists idx_bids_meme_id on bids(meme_id);
```
4. **Create RPC to increment upvotes**:
```sql
create or replace function increment_upvotes(p_meme_id uuid, p_delta int)
returns void language plpgsql as $$
begin
  update memes
    set upvotes = coalesce(upvotes, 0) + p_delta
    where id = p_meme_id;
end;
$$;
```
Confirm tables and function in Table Editor.

## 🏠 Local Development
### Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your Supabase details
npm run dev
```
### Frontend
```bash
cd frontend
npm install
# (Optional) create .env with VITE_API_URL/VITE_SOCKET_URL if needed
npm run dev
```
## 🚀 Deployment
### Backend on Render
- Root Directory:
```bash
backend
```
- Build Command:
```bash
npm install
```

- Start Command:
```bash
  npm start
  ```

- Set environment variables in Render: SUPABASE_URL, SUPABASE_SERVICE_KEY, GOOGLE_GEMINI_API_KEY, etc.

- Ensure CORS allows your frontend domain.

## Frontend on Vercel
- Connect repo to Vercel.

- Build Command:
```bash
npm run build
```

- Output Directory:
  ```bash
  dist
  ```

- Set environment variables:
```env
VITE_API_URL=https://<backend-url>/api

VITE_SOCKET_URL=https://<backend-url>
```
- Deploy and verify live site.

## 🎮 Usage
- **Home**: Browse memes in a responsive grid.

- **Search**: Filter by title or tags.

- **Create**: Click “Create”, fill title, image URL, tags.

- **Bid**: Enter bid amount on a meme card; highest bid updates live.

- **Vote**: Upvote or Downvote; leaderboard reflects votes.

- **AI Buttons**: “Caption” / “Vibe” show fallback or real API result if configured.



