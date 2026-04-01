# LearningHub

Course management and study tool for students and teachers. Students can track assignments, study with AI-generated quizzes and flashcards, chat with an AI tutor, and see a breakdown of their grades. Teachers manage courses and view their enrolled students.

## Stack

- **Frontend** — Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend** — Node.js, Express
- **Database** — MongoDB Atlas
- **Auth** — JWT stored in httpOnly cookies
- **AI** — Google Gemini via `@google/generative-ai`

---

## Running locally

**Requirements:** Node.js 18+, a MongoDB Atlas cluster, a Google Gemini API key

### 1. Backend

```bash
cd server
npm install
```

Create `server/.env`:

```
PORT=4000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=any_long_random_string_here
CLIENT_ORIGIN=http://localhost:3000
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
```

```bash
npm run dev
```

On startup the server seeds two teacher accounts and upserts the full course catalog.

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Demo accounts

These are seeded automatically when the server first starts:

| Role | Email | Password |
|------|-------|----------|
| Teacher | teacher@university.edu | teacher123 |
| Teacher | prof@university.edu | prof123 |

Register with any email to create a student account. New students are enrolled in 3 randomly selected STEM courses and 1 GE course, each with a full assignment set and seeded past grades.

---

## Deployment

The frontend goes on Vercel. The backend needs a separate host — Railway works well and has a free tier.

### Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) → New Project → import from GitHub
2. **Set Root Directory to `client/`** — this is required since the repo is a monorepo
3. Add this environment variable:
   ```
   NEXT_PUBLIC_API_URL = https://your-backend-url.railway.app
   ```
4. Deploy

### Backend on Railway

1. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub repo
2. In the service settings, set the **Root Directory** to `server/`
3. Add these environment variables:
   ```
   PORT=4000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=same_secret_as_local
   CLIENT_ORIGIN=https://your-vercel-app.vercel.app
   GEMINI_API_KEY=your_gemini_api_key
   GEMINI_MODEL=gemini-2.5-flash
   ```
4. Railway will detect Node.js and start with `npm start`

Once both are live, update `NEXT_PUBLIC_API_URL` in Vercel to the Railway URL and redeploy.

---

## Features

**Student view**
- Dashboard showing upcoming assignments and recent grades
- Per-course view with assignment list, grade calculator, and study hub
- Calendar with all due dates
- Study hub: AI quiz, AI tutor chat, flashcards, focus timer, weakness tracker, study plan
- Profile with grade summary and settings (theme, password, avatar)

**Teacher view**
- Course management and assignment overview
- Student roster with enrollment info
- File sharing per course
