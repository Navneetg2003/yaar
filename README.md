# Yaar - Your AI Mental Health Companion

## 🎯 Project Overview

**Yaar** (Hindi: "friend") is a conversational AI companion designed to provide emotional support and mental health companionship for young Indians. It's an accessible, judgment-free space where users can talk about their feelings, track their mood, and access crisis resources when needed.

### Vision
Create a culturally-aware, empathetic AI friend that understands Hindi, English, and Hinglish communication styles, adapts to individual personality preferences, and prioritizes user safety with immediate crisis detection.

---

## ✨ Core Features

### 1. **Conversational Chat**
- Real-time AI responses powered by Groq's Llama 3.1 model
- Token-by-token streaming for natural conversation flow
- Context-aware responses based on recent chat history
- Server-Sent Events (SSE) for smooth real-time experience

### 2. **Personality Profiling**
- AI learns user's communication style (language, humor, tone)
- Extracts: language style, humor type, emotional patterns, response preferences
- Adapts Yaar's tone to match user's personality
- Updates every 10 messages automatically

### 3. **Crisis Detection & Safety**
- Real-time keyword detection (60+ phrases in English/Hindi/Hinglish)
- Immediate crisis response with 3 Indian helpline numbers
- Messages flagged for monitoring
- Resources include:
  - iCall: 9152987821 (Mon–Sat, 8am–10pm)
  - AASRA: 9820466627 (24/7)
  - Vandrevala Foundation: 1860-2662-345 (24/7)

### 4. **Mood Tracking**
- Quick 1-5 emoji-based mood check-in
- Optional note field for context
- 7-day mood summary charts (for future frontend)
- Helps identify emotional patterns over time

### 5. **Authentication System**
- Email/password registration & login
- Anonymous "guest" sessions (try without signup)
- 30-day JWT token expiry
- Persistent session management

---

## 📊 Target Users

- **Age**: 18-35 years old primarily, but accessible to all ages
- **Location**: India-focused (Hindi/Hinglish support)
- **Use Cases**:
  - Daily mood tracking and emotional venting
  - Mental health support and self-reflection
  - Crisis resource discovery
  - Speaking freely without judgment

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite 8** - Development server & bundler
- **Tailwind CSS 3** - Styling
- **React Router v7** - Navigation
- **Supabase JS Client** - Database access

### Backend
- **Express 5** - HTTP framework
- **Groq SDK** - AI model access (Llama 3.1-8B)
- **Supabase JS** - PostgreSQL ORM
- **Upstash Redis** - Message caching (24h TTL)
- **JWT (jsonwebtoken)** - Authentication
- **bcryptjs** - Password hashing
- **express-rate-limit** - Request throttling

### Database
- **PostgreSQL** (via Supabase) - Main data store
- **Redis** (via Upstash) - Cache layer
- 5 tables: users, conversations, messages, personality_profiles, moods

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)                  │
│  ├── Pages: Login, Chat, Onboarding                        │
│  ├── Components: ChatWindow, MessageInput, MoodCheckIn     │
│  ├── Hooks: useAuth, useChat                               │
│  └── Services: API client with auth & streaming            │
└─────────────────────────────────────────────────────────────┘
                         ↓ REST API
┌─────────────────────────────────────────────────────────────┐
│                 BACKEND (Express + Node.js)                 │
│  ├── Routes: /api/auth, /api/chat, /api/mood              │
│  ├── Services: AI, Crisis Detection, Memory, Personality   │
│  ├── Middleware: JWT Auth, Rate Limiting                   │
│  └── Workers: Personality Updater (async jobs)             │
└─────────────────────────────────────────────────────────────┘
         ↓ SQL              ↓ REST              ↓ Groq API
    ┌─────────┐        ┌──────────────┐     ┌────────────┐
    │PostgreSQL        │Redis Cache   │     │Groq LLM    │
    │(Supabase)        │(Upstash)     │     │(Streaming) │
    └─────────┘        └──────────────┘     └────────────┘
```

---

## 📱 User Flow

1. **Authentication**
   - User lands on Login page
   - Options: Sign up, log in, or continue as guest
   - JWT token stored in localStorage

2. **First-Time** (Onboarding)
   - Welcome screen explaining features
   - Button to start chatting

3. **Main Chat Experience**
   - Header: User info, Mood Check-in button, Logout
   - Main area: Messages scroll-to-bottom
   - Input: Text field + Send button
   - Crisis alert: Appears automatically if keywords detected

4. **Features During Chat**
   - Type message → AI responds in real-time (streaming)
   - Click mood button → Log 1-5 score with optional note
   - Logout → Return to login

---

## 🗂️ Project Structure

```
yaar/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── pages/         # Login, Chat, Onboarding
│   │   ├── components/    # UI components
│   │   ├── hooks/         # useAuth, useChat
│   │   ├── services/      # API calls
│   │   ├── utils/         # Formatting utilities
│   │   ├── App.jsx        # Router setup
│   │   └── main.jsx       # Entry point
│   ├── .env.local         # Frontend env
│   └── package.json
│
├── server/                # Express backend
│   ├── middleware/        # Auth, Rate Limiting
│   ├── routes/           # /auth, /chat, /mood
│   ├── services/         # AI, Crisis, Memory, Personality
│   ├── jobs/             # Personality updater
│   ├── db/
│   │   ├── migrations/   # SQL schema (5 files)
│   │   ├── supabase.js
│   │   └── redis.js
│   ├── .env              # Backend env (secrets)
│   ├── index.js          # Server entry point
│   └── package.json
│
└── README.md             # This file
```

---

## 🚀 Current Status

### ✅ Completed
- Backend API (95% complete)
  - ✓ Authentication system (JWT, bcrypt)
  - ✓ Chat endpoint with streaming
  - ✓ Crisis detection with helplines
  - ✓ Personality profiling system
  - ✓ Mood tracking CRUD operations
  - ✓ Rate limiting (global, chat, auth)
  - ✓ Memory management (Redis + Postgres)
  
- Frontend (UI/UX with Tailwind)
  - ✓ All components built
  - ✓ All pages built
  - ✓ Hooks for state management
  - ✓ API service layer
  - ✓ React Router setup

### ⚠️ Need to Complete
- Database migrations (run 5 SQL files in Supabase)
- Environment configuration for services:
  - Supabase credentials (SUPABASE_URL, SUPABASE_SERVICE_KEY)
  - Groq API key (GROQ_API_KEY)
  - Upstash Redis (UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN)
- Personality updater job scheduling (cron)
- Testing (unit, integration, E2E)
- Deployment configuration

---

## 🎨 UI/UX Design Requirements

### Pages to Design

**1. Login Page**
- Tabs for Sign Up / Log In
- Email & password fields
- "Continue as Guest" option
- Error messages display
- Branding: Yaar logo (💙), gradient bg

**2. Chat Page**
- Header: Logo, user email/status, mood button, logout
- Chat area: Messages in bubbles (user = blue right, AI = gray left)
- Typing indicator: Animated dots
- Crisis alert: Red banner with helpline numbers
- Message input: Text box + Send button
- Footer: Disclaimer about AI limitations

**3. Onboarding Page**
- Welcome message
- Features list (4 items with icons)
- Ground rules/safety info
- "Let's Chat" CTA button

**4. Components**
- Message bubbles with timestamps
- Typing indicator animation
- Mood check-in popup (5 emoji options + note)
- Crisis alert banner
- Input form with error states
- Loading states

### Design Considerations
- Mobile-first responsive design
- Dark mode support (optional)
- Accessibility (WCAG 2.1 AA)
- Cultural sensitivity for Indian users
- Calming, warm color palette (blues, purples)
- Clear error messages
- Loading & empty states

---

## 🔑 Key API Endpoints

### Auth
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login with email
- `POST /api/auth/anonymous` - Guest session
- `GET /api/auth/me` - Get current user

### Chat
- `POST /api/chat/message` - Send message (streams response)
- `GET /api/chat/history` - Get last 50 messages

### Mood
- `POST /api/mood` - Log mood (1-5)
- `GET /api/mood` - Get last 30 moods
- `GET /api/mood/summary` - 7-day average

### Health
- `GET /api/health` - Server status

---

## 🔐 Security Features

- Bcryptjs password hashing (10 salt rounds)
- JWT authentication (30-day expiry)
- Rate limiting on all endpoints
- CORS with credential support
- Crisis message flagging for monitoring
- Anonymous mode for privacy-conscious users
- Input validation (email, password length)
- No sensitive data in localStorage except JWT

---

## 📈 How It Works (User Message Flow)

1. User types message and hits Send
2. Frontend sends POST /api/chat/message with JWT
3. Backend verifies JWT token
4. Crisis keywords checked first (immediate response if match)
5. Fetches recent messages, user personality, current conversation
6. Sends to Groq AI with personality-aware prompt
7. AI streams response back via SSE (token by token)
8. Both messages saved to Postgres
9. Redis cache updated with new messages
10. Every 10 messages, personality profile updated (async)
11. Frontend displays real-time streamed response

---

## 📝 Next Steps for MVP

1. **Database Setup**
   - Run SQL migrations in Supabase dashboard
   - Verify all 5 tables created

2. **Environment Configuration**
   - Get Supabase credentials
   - Get Groq API key
   - Configure Upstash Redis
   - Update .env files

3. **Testing**
   - Test signup/login flow
   - Test chat messaging
   - Test crisis detection
   - Test mood tracking
   - Test streaming responses

4. **UI Polish** (with Figma)
   - Design all pages and components
   - Create design system
   - Export components/assets
   - Implement responsive design

5. **Deployment**
   - Frontend: Vercel / Netlify
   - Backend: Railway / Render / EC2
   - Database: Supabase (already hosted)

---

## 💡 Future Enhancements

- Chat history visualization & search
- Mood analytics dashboard (7-day/month/year charts)
- Conversation export as PDF
- Multiple language support (Tamil, Telugu, Kannada)
- Voice input/output
- Integration with mental health providers
- User feedback mechanism
- Admin dashboard for crisis monitoring
- Notification system
- Multi-device sync

---

## 📞 Crisis Resources (India)

- **iCall**: 9152987821 (Mon–Sat, 8am–10pm)
- **AASRA**: 9820466627 (24/7)
- **Vandrevala Foundation**: 1860-2662-345 (24/7)
- **AAGPA**: 9999 77 8888 (24/7)

---

## 📄 License

[Add your license here - MIT, Apache, etc.]

---

## 👥 Team

[Add team members here]

---

## 📧 Contact

[Add contact info here]

---

**Made with 💙 for mental health support in India**
