# Schedule Tracker

Ultimate Habit and Tasks Tracker - A full-stack Next.js application with Supabase backend.

## 🚀 Quick Start

### 1. Setup Supabase

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project called "schedule-tracker"
3. Choose region **Mumbai (ap-south-1)** for lowest latency
4. Wait for the project to be ready (~2 minutes)

### 2. Create Database Tables

Go to **SQL Editor** in Supabase and run this SQL:

```sql
-- Habits table
CREATE TABLE habits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(10) DEFAULT '⭐',
    goal INTEGER DEFAULT 20 CHECK (goal >= 1 AND goal <= 31),
    position INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habit completions (per month)
CREATE TABLE habit_completions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    habit_id UUID REFERENCES habits(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL CHECK (month >= 0 AND month <= 11),
    completions BOOLEAN[] DEFAULT ARRAY[]::BOOLEAN[],
    UNIQUE(habit_id, year, month)
);

-- Day tasks table
CREATE TABLE day_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    date DATE NOT NULL,
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE day_tasks ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can CRUD own habits" ON habits
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can CRUD own completions" ON habit_completions
    FOR ALL USING (habit_id IN (SELECT id FROM habits WHERE user_id = auth.uid()));

CREATE POLICY "Users can CRUD own tasks" ON day_tasks
    FOR ALL USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_habits_user_id ON habits(user_id);
CREATE INDEX idx_completions_habit_month ON habit_completions(habit_id, year, month);
CREATE INDEX idx_tasks_user_date ON day_tasks(user_id, date);
```

### 3. Configure Authentication

1. Go to **Authentication** → **Providers** in Supabase
2. Enable **Google** provider:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback`
   - Copy Client ID and Secret to Supabase

3. (Optional) Enable **Email** provider for email/password login

### 4. Get Your Supabase Credentials

1. Go to **Project Settings** → **API**
2. Copy:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public** key

### 5. Configure Environment Variables

Create `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR...
```

### 6. Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 7. Deploy to Vercel

```bash
npm i -g vercel
vercel login
vercel --prod
```

Your app will be live at: **`https://schedule-tracker.vercel.app`**

Add environment variables in Vercel:
1. Go to your project → **Settings** → **Environment Variables**
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Redeploy

## 📁 Project Structure

```
schedule-tracker/
├── src/
│   ├── app/
│   │   ├── auth/callback/     # OAuth callback handler
│   │   ├── dashboard/         # Protected dashboard pages
│   │   ├── login/             # Login page
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Landing page
│   ├── components/
│   │   ├── CalendarControls.tsx
│   │   ├── DashboardNav.tsx
│   │   ├── DayTasks.tsx
│   │   └── HabitTracker.tsx
│   ├── lib/supabase/
│   │   ├── client.ts          # Browser Supabase client
│   │   └── server.ts          # Server Supabase client
│   ├── types/
│   │   └── index.ts           # TypeScript types
│   └── middleware.ts          # Auth middleware
└── .env.local                 # Environment variables
```

## ✨ Features

- 🎯 Track up to 25+ habits
- 📅 Dynamic calendar navigation
- ✅ Daily completion checkboxes
- 📊 Stats and analytics
- 📌 Day tasks with priorities
- 🔐 Secure authentication
- 🌙 Dark mode design
- 📱 Responsive layout

## 🛡️ Security

- Row Level Security (RLS) ensures users can only access their own data
- All API routes validate user authentication
- Passwords are hashed by Supabase
- HTTPS enforced on Vercel

## 📝 License

MIT - Feel free to use for personal or commercial projects.
