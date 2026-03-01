# FitChain — Full-Stack Fitness Tracking App

A professional full-stack fitness tracking application built with React (frontend) and Node.js + Express + MongoDB (backend). JWT authentication, real database persistence, and a polished dark SaaS UI.

---

## 🏗 Project Structure

```
fitchain/
├── server/                    ← Node.js + Express backend
│   ├── config/
│   │   └── db.js              MongoDB Atlas connection
│   ├── middleware/
│   │   ├── auth.js            JWT protect middleware + signToken helper
│   │   └── errorHandler.js    Central error handler
│   ├── models/
│   │   ├── User.js            User schema (bcrypt hashing, profile)
│   │   └── Meal.js            Meal schema with compound index
│   ├── routes/
│   │   ├── auth.js            POST /signup, POST /login, GET /me, PATCH /profile
│   │   └── meals.js           GET /, GET /weekly, POST /, DELETE /:id
│   ├── .env.example           ← Copy to .env and fill in values
│   ├── index.js               Express app entry point
│   └── package.json
│
├── client/                    ← React + Vite frontend
│   ├── src/
│   │   ├── components/        Navbar, Sidebar, AddMealForm, MealList, MacroChart, WeeklyChart
│   │   ├── pages/             Landing, Login, Signup, Dashboard, Workouts, Progress
│   │   ├── services/
│   │   │   └── api.js         ← All API calls (replaces localStorage)
│   │   ├── data/
│   │   │   └── workouts.js    Static workout plan data
│   │   ├── routes/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example           ← Copy to .env
│   └── package.json
│
├── package.json               Root — runs both with concurrently
└── README.md
```

---

## 🚀 Setup Guide

### Step 1 — MongoDB Atlas

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas) and create a free account
2. Create a **free M0 cluster** (takes ~3 minutes)
3. Under **Database Access**, create a user with a username and password
4. Under **Network Access**, click **Add IP Address → Allow Access from Anywhere** (for development)
5. Click **Connect → Connect your application** and copy the connection string
   - It looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/`

### Step 2 — Configure the Server

```bash
cd server
cp .env.example .env
```

Edit `.env` and fill in:
```env
MONGODB_URI=mongodb+srv://your_user:your_password@cluster0.xxxxx.mongodb.net/fitchain?retryWrites=true&w=majority
JWT_SECRET=generate_a_long_random_string_here
JWT_EXPIRES_IN=7d
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development
```

To generate a secure JWT_SECRET, run:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Step 3 — Configure the Client

```bash
cd client
cp .env.example .env
```

The default `.env` already points to `http://localhost:5000/api` — no changes needed for local dev.

### Step 4 — Install Dependencies

From the **root** directory:
```bash
npm run install:all
```

This installs root deps (concurrently), server deps, and client deps in one go.

Or manually:
```bash
npm install          # root
cd server && npm install
cd ../client && npm install
```

### Step 5 — Run the App

From the **root** directory:
```bash
npm run dev
```

This starts both servers simultaneously:
- **Backend** → http://localhost:5000
- **Frontend** → http://localhost:5173

Open your browser to **http://localhost:5173** 🎉

---

## 🔌 API Endpoints

All API routes are prefixed with `/api`

### Auth
| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/auth/signup` | No | Create account, returns JWT |
| POST | `/auth/login` | No | Login, returns JWT |
| GET | `/auth/me` | ✅ Yes | Get current user from token |
| PATCH | `/auth/profile` | ✅ Yes | Update goal, location, calorieGoal |

### Meals
| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/meals?date=YYYY-MM-DD` | ✅ Yes | Get meals for a specific date |
| GET | `/meals/weekly` | ✅ Yes | Get 7-day aggregated nutrition data |
| POST | `/meals` | ✅ Yes | Add a new meal |
| DELETE | `/meals/:id` | ✅ Yes | Delete a meal (owner only) |

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Check server status |

---

## 🔐 How Authentication Works

1. User signs up → password is **bcrypt hashed** (12 salt rounds) before storing in MongoDB
2. Server returns a **JWT token** signed with your `JWT_SECRET`
3. Client stores the token in **localStorage** (`fitchain_token`)
4. Every protected API request sends `Authorization: Bearer <token>` header
5. Server's `protect` middleware verifies the JWT and fetches the user from DB
6. Token expires after 7 days (configurable via `JWT_EXPIRES_IN`)

---

## 🛠 Tech Stack

### Backend
| Package | Purpose |
|---------|---------|
| Express | Web framework |
| Mongoose | MongoDB ODM |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT signing & verification |
| express-validator | Request validation |
| express-rate-limit | Brute force protection |
| morgan | HTTP request logging |
| dotenv | Environment variables |
| cors | Cross-origin requests |

### Frontend
| Package | Purpose |
|---------|---------|
| React 18 | UI framework |
| React Router DOM v6 | Client-side routing |
| Tailwind CSS v3 | Utility-first styling |
| Recharts | Charts & data visualization |
| Vite | Build tool & dev server |

---

## 🚢 Production Deployment

### Backend (Railway / Render / Fly.io)
1. Push to GitHub
2. Connect to Railway/Render
3. Set environment variables (same as `.env`)
4. Deploy — these platforms detect Node.js automatically

### Frontend (Vercel / Netlify)
1. Set `VITE_API_URL` to your deployed backend URL (e.g. `https://fitchain-api.railway.app/api`)
2. Build command: `npm run build`
3. Output directory: `dist`

---

## 📝 Notes

- Passwords are **never** stored in plain text — bcrypt hashes them with 12 rounds
- The `password` field has `select: false` in the Mongoose schema — it's never returned in API responses
- Rate limiting is applied to auth routes (10 requests per 15 min) to prevent brute force
- MongoDB compound index on `{ user, date }` ensures fast meal queries
