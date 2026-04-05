# YAAR - Your AI Friend, Always Here 💙

A full-stack mental wellness companion web application for young Indians. YAAR is an AI-powered chat application that listens, learns, and cares — combining real-time chat, mood tracking, journaling, and personality learning in a beautiful, supportive interface.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Installation](#installation)
6. [Getting Started](#getting-started)
7. [Database Schema](#database-schema)
8. [API Documentation](#api-documentation)
9. [Frontend Architecture](#frontend-architecture)
10. [Backend Architecture](#backend-architecture)
11. [Key Features Deep Dive](#key-features-deep-dive)
12. [Environment Variables](#environment-variables)
13. [Development](#development)
14. [Deployment](#deployment)

---

## Overview

**YAAR** is a mental wellness companion designed specifically for young Indians. It's NOT a therapy app — it's a friend who:
- **Listens** without judgment
- **Learns** your communication style and personality
- **Remembers** what you share
- **Responds** in your language (Hindi, Hinglish, or English)
- **Cares** by detecting crisis situations and providing support

The app features:
- Real-time AI conversation with streaming responses
- Automatic personality profiling based on communication patterns
- Mood tracking with 7-day analytics
- Private journal with date navigation
- Crisis detection with helpline resources
- Anonymous user support
- Rate limiting for responsible usage

---

## Features

### 💬 Chat System
- **Real-time streaming responses** via Server-Sent Events (SSE)
- **Personality-aware responses** that adapt to user's language and tone
- **Crisis keyword detection** with automatic helpline guidance
- **12-message context** cached in Redis for fast personality building
- **Message history** stored in database for reference
- **Rate-limited** (30 messages per 10 minutes per user)

### 🧠 Personality Learning
- **Automatic profiling** every 10 messages
- **4-dimensional analysis**:
  - Language style (Hindi/Hinglish/English mix)
  - Humour type (sarcasm, wordplay, dry, etc.)
  - Emotional pattern (how feelings are expressed)
  - Response preference (what kind of responses user likes)
- **Non-intrusive** - learned passively from natural conversation

### 🎭 Mood Tracking
- **Daily mood logging** with 1-5 scale + labels
- **7 emotion categories**: Joy, Calm, Grateful, Tired, Anxious, Sad, Angry
- **Visual mood wheel** for quick logging
- **7-day history** with stats and visual timeline
- **Emotional insights** through pattern analysis

### 📓 Journal
- **Beautiful book-spread design** with paper aesthetic
- **One entry per day** (auto-saved with 1.2s debounce)
- **Date picker mini-calendar** to navigate entries
- **Save indicator** to confirm writes
- **Handwriting font** (Caveat) for intimate feeling
- **Private storage** - only accessible by user

### 🔐 Authentication
- **Three login methods**:
  1. Email/Password registration
  2. Anonymous guest sessions
  3. Anonymous → Registered conversion (data preserved)
- **JWT tokens** with 30-day expiry
- **Bcrypt password hashing** (12 salt rounds)
- **Session persistence** via localStorage

### 🚨 Crisis Support
- **30 crisis keywords** in English & Hindi
- **Automatic detection** on message send
- **Immediate helpline response** with resources:
  - iCall: 9152987821
  - Vandrevala Foundation: 1860-2662-345
  - AASRA: 9820466627
- **Message flagging** for support team review

---

## Tech Stack

### Frontend
```
React 18.3.1          - UI framework
Vite 6.0.5            - Build tool & dev server
TailwindCSS 3.4.17    - Utility-first CSS
React Router 6.28.0   - Client-side routing
@supabase/supabase-js - Database client
Autoprefixer 10.4.20  - CSS vendor prefixes
```

### Backend
```
Node.js               - Runtime
Express 5.2           - Web framework
Groq SDK 1.1.2        - AI API client (llama-3.1-8b)
Supabase              - PostgreSQL database
Upstash Redis 1.37.0  - Cache layer
JWT 9.0.3             - Token authentication
Bcrypt 3.0.3          - Password hashing
Express Rate Limit    - API rate limiting
CORS 2.8.6            - Cross-origin requests
```

### Database
```
Supabase PostgreSQL   - Primary data storage
Upstash Redis         - Message caching
```

### AI Model
```
Groq API              - Provider
llama-3.1-8b-instant  - Model (fast, cost-effective)
```

---

## Project Structure

```
yaar/
├── client/                          # React frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── assets/                  # Static images/media
│   │   ├── components/              # Reusable React components
│   │   │   ├── ChatWindow.jsx       # Chat message display
│   │   │   ├── CrisisAlert.jsx      # Crisis support UI
│   │   │   ├── MessageBubble.jsx    # Individual message styling
│   │   │   ├── MessageInput.jsx     # Text input with send button
│   │   │   ├── MoodCheckIn.jsx      # Modal mood logger
│   │   │   ├── Navbar.jsx           # Top navigation bar
│   │   │   ├── Sidebar.jsx          # Left navigation sidebar
│   │   │   └── TypingIndicator.jsx  # Animated typing indicator
│   │   ├── hooks/                   # Custom React hooks
│   │   │   ├── useAuth.js           # Authentication state & methods
│   │   │   └── useChat.js           # Chat state & SSE streaming
│   │   ├── pages/                   # Full-page components
│   │   │   ├── Chat.jsx             # Legacy chat page (deprecated)
│   │   │   ├── ChatView.jsx         # Main chat interface
│   │   │   ├── JournalView.jsx      # Journal editor
│   │   │   ├── Login.jsx            # Auth page (register/login)
│   │   │   ├── MoodView.jsx         # Mood tracking & history
│   │   │   └── Onboarding.jsx       # 5-step feature intro
│   │   ├── services/                # API & external services
│   │   │   ├── api.js               # All HTTP requests
│   │   │   └── supabase.js          # Supabase client (not heavily used)
│   │   ├── utils/                   # Utility functions
│   │   │   └── formatMessage.js     # Date/time formatting & mood utils
│   │   ├── App.jsx                  # Main app router
│   │   ├── App.css                  # Deprecated styles
│   │   ├── index.css                # **ALL STYLES** (single CSS file)
│   │   ├── main.jsx                 # React entry point
│   │   └── index.html               # HTML template
│   ├── package.json
│   ├── vite.config.js               # Vite configuration
│   ├── tailwind.config.js           # TailwindCSS config
│   ├── postcss.config.js            # PostCSS plugins
│   ├── eslint.config.js             # ESLint rules
│   └── .prettierrc.json             # Prettier code formatting
│
├── server/                          # Express backend
│   ├── db/
│   │   ├── redis.js                 # Upstash Redis client
│   │   ├── supabase.js              # Supabase PostgreSQL client
│   │   └── migrations/              # SQL schema files
│   │       ├── 001_users.sql        # User accounts table
│   │       ├── 002_conversations.sql# Chat sessions grouped by day
│   │       ├── 003_messages.sql     # Chat message history
│   │       ├── 004_personality.sql  # Learned personality profiles
│   │       ├── 005_moods.sql        # Mood log entries
│   │       └── 006_journal_entries.sql# Journal entries (1 per day)
│   ├── jobs/
│   │   └── personalityUpdater.js    # Batch personality profile updater
│   ├── middleware/
│   │   ├── auth.js                  # JWT verification middleware
│   │   └── rateLimit.js             # Rate limiting (chat & auth)
│   ├── routes/
│   │   ├── auth.js                  # POST register, login, anonymous, convert
│   │   ├── chat.js                  # POST message, GET history
│   │   ├── mood.js                  # POST mood, GET moods, GET summary
│   │   └── journal.js               # GET/PUT journal, GET dates
│   ├── services/
│   │   ├── ai.js                    # Groq API calls & streaming
│   │   ├── crisis.js                # Crisis keyword detection
│   │   ├── memory.js                # Message caching & retrieval
│   │   ├── personality.js           # Personality profile analysis
│   │   └── promptBuilder.js         # System prompt construction (unused)
│   ├── index.js                     # Express server entry point
│   └── package.json
│
├── README.md                        # This file
└── .gitignore
```

---

## Installation

### Prerequisites
- **Node.js** v16+ (LTS recommended)
- **npm** or **yarn** package manager
- **Git** for version control

### Clone Repository
```bash
git clone https://github.com/yourusername/yaar.git
cd yaar
```

### Frontend Setup
```bash
cd client
npm install
```

### Backend Setup
```bash
cd ../server
npm install
```

---

## Getting Started

### Environment Variables

#### Backend (`server/.env`)
```env
# Server Port
PORT=5000

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173

# Supabase PostgreSQL
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key

# Upstash Redis
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token

# Groq AI API
GROQ_API_KEY=your-groq-key
GROQ_MODEL=llama-3.1-8b-instant

# JWT Secret
JWT_SECRET=your-jwt-secret-key
```

#### Frontend (`client/.env`)
```env
# API Server URL
VITE_API_URL=http://localhost:5000

# Supabase (optional, mostly unused)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Start Development Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
# App opens on http://localhost:5173
```

### Access the App
- **Local:** http://localhost:5173/
- **API Server:** http://localhost:5000/api/

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,                    -- NULL for anonymous users
  password_hash TEXT,                   -- NULL for anonymous users
  is_anonymous BOOLEAN DEFAULT false,   -- For guest sessions
  created_at TIMESTAMPTZ DEFAULT now(),
  last_active TIMESTAMPTZ DEFAULT now()
);
```

### Conversations Table
```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT now(),
  ended_at TIMESTAMPTZ,
  message_count INTEGER DEFAULT 0
);
-- One conversation per day per user
```

### Messages Table
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  flagged BOOLEAN DEFAULT false,        -- TRUE if crisis keywords detected
  created_at TIMESTAMPTZ DEFAULT now()
);
-- Indexed by user_id for fast retrieval
```

### Personality Profiles Table
```sql
CREATE TABLE personality_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  language_style TEXT,                  -- "Hinglish mix, casual"
  humour_type TEXT,                     -- "Sarcastic, self-deprecating"
  emotional_pattern TEXT,               -- "Expresses via metaphors"
  response_pref TEXT,                   -- "Prefers short, witty responses"
  updated_at TIMESTAMPTZ DEFAULT now()
);
-- Upserted every 10 messages
```

### Moods Table
```sql
CREATE TABLE moods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  score INTEGER CHECK (score BETWEEN 1 AND 5),  -- 1=Sad, 5=Joy
  label TEXT,                           -- Mood category
  note TEXT,                            -- Optional user note
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Journal Entries Table
```sql
CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL DEFAULT '',
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, entry_date)           -- One entry per day
);
```

---

## API Documentation

### Authentication Endpoints

#### POST `/api/auth/register`
Register new user with email/password
```
Body: { email: string, password: string (6+ chars) }
Response: { token: JWT, user: { id, email } }
```

#### POST `/api/auth/login`
Authenticate existing user
```
Body: { email: string, password: string }
Response: { token: JWT, user: { id, email } }
```

#### POST `/api/auth/anonymous`
Create guest session (no login required)
```
Response: { token: JWT, user: { id, isAnonymous: true } }
```

#### POST `/api/auth/convert`
Convert anonymous user to registered (preserves data)
```
Headers: Authorization: Bearer {token}
Body: { email: string, password: string }
Response: { message: "Account created. Chat history preserved." }
```

### Chat Endpoints

#### POST `/api/chat/message`
Send message and get AI response (streams via SSE)
```
Headers: Authorization: Bearer {token}
Body: { message: string }
Response: Server-Sent Events stream OR JSON for crisis
```

#### GET `/api/chat/history`
Fetch last 50 messages
```
Headers: Authorization: Bearer {token}
Response: { messages: [{ id, role, content, flagged, created_at }, ...] }
```

### Mood Endpoints

#### POST `/api/mood`
Log mood entry
```
Headers: Authorization: Bearer {token}
Body: { score: 1-5, label?: string, note?: string }
Response: { mood: { id, score, label, note, created_at } }
```

#### GET `/api/mood`
Get mood history (last 30 default, max 90)
```
Headers: Authorization: Bearer {token}
Query: ?limit=30
Response: { moods: [...] }
```

#### GET `/api/mood/summary`
Get 7-day mood summary with stats
```
Headers: Authorization: Bearer {token}
Response: { summary: [{ date, avg, count, dominantLabel }, ...] }
```

### Journal Endpoints

#### GET `/api/journal`
Fetch journal entry for date (default: today)
```
Headers: Authorization: Bearer {token}
Query: ?date=2026-04-05
Response: { entry: { id, content, entry_date, updated_at } OR null }
```

#### PUT `/api/journal`
Create or update journal entry (upsert)
```
Headers: Authorization: Bearer {token}
Body: { content: string, date?: string }
Response: { entry: { id, content, entry_date, updated_at } }
```

#### GET `/api/journal/dates`
Get all dates with journal entries
```
Headers: Authorization: Bearer {token}
Response: { dates: ["2026-04-05", "2026-04-04", ...] }
```

---

## Frontend Architecture

### Component Hierarchy
```
App
├── AuthProvider (context)
├── BrowserRouter
│   ├── Routes
│   │   ├── /login → Login (auth form)
│   │   ├── /onboarding → Onboarding (5-step intro)
│   │   └── /dashboard → Dashboard
│   │       ├── Navbar (top bar)
│   │       ├── Sidebar (left nav)
│   │       └── ChatView | JournalView | MoodView
│   │           ├── MessageBubble (repeating)
│   │           ├── MessageInput
│   │           └── TypingIndicator (when streaming)
```

### State Management

**Global State (useAuth Hook):**
- `user` - Current user object
- `loading` - Auth initialization
- `isAuthenticated` - Boolean flag
- Actions: `login()`, `register()`, `loginAnonymous()`, `logout()`

**Chat State (useChat Hook):**
- `messages` - Array of chat messages
- `isStreaming` - Boolean (true during AI response)
- `error` - Error message if any
- Actions: `send()`, `loadHistory()`

### Styling

**One CSS File: `src/index.css`**
- **Design System**: CSS variables for colors, spacing, animations
- **Dark Mode**: Navy (`#080B18`) + Cream text (`#F0ECE3`)
- **Accent**: Warm amber (`#F2A854`) + Violet (`#C084FC`)
- **Components**: All UI elements styled in single file for maintainability
- **Animations**: 12+ keyframes (orbs, pulses, bounces, fades)

**TailwindCSS Integration:**
- Used for responsive utilities
- Custom theme extending in `tailwind.config.js`
- PostCSS pipeline for vendor prefixes

### Key Hooks

**useAuth.js**
- Manages authentication state
- Syncs with localStorage
- Provides login/register/logout

**useChat.js**
- Handles message streaming via SSE
- Manages chat UI state
- Fetches history on page load

**useEffect Patterns:**
- Mount: Load history, initialize auth
- Update: Scroll to bottom on new messages
- Cleanup: Unused

---

## Backend Architecture

### Express Server Structure
```
index.js (Entry point)
├── CORS middleware
├── JSON body parser
├── Global rate limiter
├── Routes (mounted)
│   ├── /api/auth
│   ├── /api/chat
│   ├── /api/mood
│   └── /api/journal
├── 404 handler
└── Error handler
```

### Middleware

**authMiddleware** (auth.js)
- Verifies JWT from `Authorization: Bearer {token}` header
- Attaches user ID to `req.user`
- Returns 401 if invalid/expired

**Rate Limiting** (rateLimit.js)
- **Chat**: 30 requests per 10 minutes per user ID
- **Auth**: 10 requests per 15 minutes per IP
- Uses express-rate-limit library

### Services

**AI Service** (ai.js)
- **getYaarResponse()** - Non-streaming response (fallback)
- **streamYaarResponse()** - Streams tokens via SSE
- Builds messages array + system prompt
- Calls Groq API with llama-3.1-8b

**Crisis Service** (crisis.js)
- **crisisCheck()** - Keyword matching (30 keywords)
- **getCrisisResponse()** - Returns helpline message
- Used in POST /message route

**Memory Service** (memory.js)
- **getRecentMessages()** - Redis cache → Postgres fallback
- **saveMessage()** - Inserts to DB + updates cache
- **getOrCreateConversation()** - Creates per-day conversation

**Personality Service** (personality.js)
- **getPersonalityProfile()** - Fetches from DB
- **updatePersonalityProfile()** - AI analysis → upsert
- Called every 10 messages
- Uses Groq to analyze user messages

### Data Flow Examples

**Chat Message Flow:**
1. User sends message
2. Rate limit checked
3. Crisis keywords checked → if yes, return helpline
4. Fetch recent 12 messages from Redis
5. Fetch/create user personality
6. Build system prompt with personality
7. Stream response from Groq via SSE
8. Save both messages to DB + Redis
9. Every 10 messages: update personality

**Authentication Flow:**
1. POST /register → hash password → insert user → return JWT
2. POST /login → verify password → update last_active → return JWT
3. JWT stored in localStorage + included in all requests

---

## Key Features Deep Dive

### Personality Learning System

**When it updates (every 10 messages):**
1. Fetch last 20 messages from database
2. Extract user messages (filter role='user')
3. Send to Groq with analysis prompt
4. Parse JSON response for 4 traits
5. Upsert to personality_profiles table

**System Prompt Adaptation:**
```javascript
IF personality profile EXISTS:
  Include: language_style, humour_type, emotional_pattern, response_pref
  AI adapts tone/language to match
ELSE:
  Use generic "still getting to know you" prompt
  Let AI observe and mirror user style
```

### Crisis Detection

**Keywords Detected (30 total):**
- English: "kill myself", "suicidal", "suicide", "self harm", "want to die", "end my life", "no point living", "better off dead"
- Hindi: "marna chahta", "marna chahti", "jaan dena", "khatam karna", "zindagi khatam", "khud ko hurt"

**Response:**
1. Message flagged in database
2. Immediate helpline response returned to user
3. No AI response sent (safety first)

### Streaming Architecture

**Frontend (useChat hook):**
- Sends message via fetch
- Checks Content-Type header
- If SSE stream: reads chunks, parses JSON, updates state incrementally
- If JSON: shows response directly (rare)

**Backend (ai.js):**
- Sets SSE headers
- Loops through stream chunks
- Writes `data: {token}` format for each token
- Ends with `[DONE]` signal
- Accumulates full response

### Redis Caching

**What's cached:**
- Last 12 messages per user
- TTL: 24 hours
- Key: `messages:{userId}`

**Cache invalidation:**
- Auto-invalidates after 24h
- Manual update on new message insert
- Fallback to Postgres if Redis fails

### Date-based Conversation Grouping

**Logic:**
- New conversation created per day
- Check if conversation exists for today
- If no → create new
- If yes → reuse (continues same thread)
- Resets context daily, forces personality refresh

---

## Environment Variables

### Server `.env`

| Variable | Required | Example | Purpose |
|----------|----------|---------|---------|
| PORT | Yes | 5000 | Server port |
| CLIENT_URL | Yes | http://localhost:5173 | CORS origin |
| SUPABASE_URL | Yes | https://xyz.supabase.co | Database host |
| SUPABASE_SERVICE_KEY | Yes | sbp_xxxxx | DB admin key |
| UPSTASH_REDIS_REST_URL | Yes | https://xyz.upstash.io | Redis host |
| UPSTASH_REDIS_REST_TOKEN | Yes | AAABxx... | Redis token |
| GROQ_API_KEY | Yes | gsk_xxxxx | Groq API key |
| GROQ_MODEL | Optional | llama-3.1-8b-instant | Model name |
| JWT_SECRET | Yes | your-secret-key | Token signing key |

### Client `.env`

| Variable | Required | Example | Purpose |
|----------|----------|---------|---------|
| VITE_API_URL | Optional | http://localhost:5000 | Backend URL |
| VITE_SUPABASE_URL | Optional | https://xyz.supabase.co | (unused mostly) |
| VITE_SUPABASE_ANON_KEY | Optional | eyJxx... | (unused mostly) |

---

## Development

### Local Development Workflow

1. **Start backend:**
   ```bash
   cd server && npm run dev
   ```

2. **Start frontend (separate terminal):**
   ```bash
   cd client && npm run dev
   ```

3. **Make changes:**
   - Frontend: Changes auto-refresh via HMR (Hot Module Replacement)
   - Backend: Changes auto-restart via nodemon

4. **Test API endpoints:**
   - Use Postman/Insomnia
   - Include `Authorization: Bearer {token}` header
   - Base URL: http://localhost:5000/api

### Useful npm Scripts

**Frontend:**
```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production build
```

**Backend:**
```bash
npm run start    # Production start
npm run dev      # Dev with nodemon
```

### Code Quality

**ESLint Config:**
- Located in `client/eslint.config.js`
- Enforces React best practices
- Checks for unused variables (with exceptions)

**Prettier Config:**
- `client/.prettierrc.json`
- Auto-formats code on save
- Consistent style across codebase

---

## Deployment

### Production Build

**Frontend:**
```bash
cd client
npm run build
# Output: dist/ folder with optimized assets
```

**Backend:**
- Ensure `.env` variables set
- Run: `npm start`
- Use process manager (PM2, systemd, Docker)

### Environment Setup for Production

1. **Update API URL:**
   ```env
   VITE_API_URL=https://api.example.com  # Production backend
   ```

2. **Use production credentials:**
   - Real Supabase project
   - Real Upstash Redis instance
   - Real Groq API key
   - Strong JWT secret

3. **Enable HTTPS:**
   - Frontend: hosted on HTTPS domain
   - Backend: HTTPS reverse proxy (Nginx, Cloudflare)
   - Update CORS origin

### Docker (Optional)

**Backend Dockerfile:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

**Frontend Dockerfile:**
```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

---

## Key Design Decisions

1. **Single CSS File** - Maintains consistent design system
2. **React.createElement in useAuth.js** - Avoids JSX in `.js` file (Vite constraint)
3. **Daily Conversations** - Resets context, forces personality refresh
4. **Redis Caching** - Fast personality building without DB hits
5. **Stream Responses** - Real-time typing feeling
6. **Passive Personality Learning** - Non-intrusive, natural
7. **Anonymous Support** - Full experience without registration
8. **Crisis Keywords** - Bilingual for India market

---

## Troubleshooting

### "Failed to resolve import"
- Check file extensions (.jsx vs .js)
- Ensure imports use correct paths
- Verify file exists

### "CORS error"
- Check `CLIENT_URL` in backend `.env`
- Ensure frontend URL matches
- Restart backend after changing

### "JWT verification failed"
- Token may be expired
- JWT_SECRET mismatch between frontend/backend
- Clear localStorage and re-login

### "Redis connection error"
- Check `UPSTASH_REDIS_REST_URL` and token
- Verify internet connection
- Falls back to Postgres (will be slower)

### "Groq API error"
- Verify `GROQ_API_KEY` is valid
- Check account quota/limits
- Model name correct: `llama-3.1-8b-instant`

---

## Contributing

### Code Style
- Use 2-space indentation
- Follow ESLint rules
- Use Prettier for formatting
- Write descriptive variable names
- Add comments for complex logic

### Pull Request Process
1. Create feature branch
2. Make changes
3. Test locally
4. Submit PR with description
5. Wait for review

---

## License

[Add your license here]

---

## Support

For issues or questions:
- **Email**: support@yaar.app
- **Issues**: GitHub Issues
- **Crisis Support**: iCall 9152987821

---

**Made with 💙 for young Indians**

Last Updated: April 5, 2026
