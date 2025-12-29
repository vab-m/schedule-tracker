# 📋 Schedule Tracker - Maintenance Guide

> Your complete guide to managing and maintaining the Schedule Tracker application.

---

## 🔗 Quick Links Dashboard

| Service | Dashboard URL | Purpose |
|---------|---------------|---------|
| **Vercel** | [vercel.com/dashboard](https://vercel.com/vabofficial2000-8746s-projects/schedule-tracker) | Hosting & Deployment |
| **Supabase** | [supabase.com/dashboard](https://supabase.com/dashboard/project/vhngrtytmzpniohtpkev) | Database & Auth |
| **Google Cloud** | [console.cloud.google.com](https://console.cloud.google.com/apis/credentials) | OAuth Settings |
| **Live App** | [schedule-tracker-seven.vercel.app](https://schedule-tracker-seven.vercel.app) | Production URL |

---

## 🗄️ Supabase - Database & Authentication

### Accessing Your Dashboard
1. Go to [supabase.com](https://supabase.com)
2. Sign in with your account
3. Select project: `vhngrtytmzpniohtpkev`

### Key Sections

#### 👥 View Users
**Path**: `Authentication` → `Users`
- See all registered users
- View user emails, last sign-in time
- Delete or ban users if needed
- Export user list

#### 📊 View Data (Habits, Tasks)
**Path**: `Table Editor`
- **habits** - All user habits (name, icon, goal, position)
- **habit_completions** - Daily checkmarks per habit
- **day_tasks** - One-time tasks with dates and priorities

> 💡 Click any table to view, edit, insert, or delete rows directly

#### 🔐 Authentication Settings
**Path**: `Authentication` → `Providers`
- Enable/disable Google OAuth
- Add email/password settings
- Configure other providers (GitHub, Apple, etc.)

#### 🔗 URL Configuration
**Path**: `Authentication` → `URL Configuration`
- **Site URL**: `https://schedule-tracker-seven.vercel.app`
- **Redirect URLs**: Add all allowed callback URLs:
  - `https://schedule-tracker-seven.vercel.app/auth/callback`
  - `http://localhost:3000/auth/callback` (for local dev)

#### 🔑 API Keys
**Path**: `Project Settings` → `API`
- **Project URL**: `https://vhngrtytmzpniohtpkev.supabase.co`
- **anon public key**: Used in your app (safe to expose)
- **service_role key**: ⚠️ NEVER expose this - admin access

#### 📜 SQL Editor
**Path**: `SQL Editor`
- Run custom SQL queries
- Modify database schema
- Debug data issues

---

## 🌐 Google Cloud Console - OAuth

### Accessing Your Dashboard
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Select project: `schedule-tracker`

### Key Sections

#### 🔑 OAuth Credentials
**Path**: `APIs & Services` → `Credentials`
- View/edit OAuth 2.0 Client IDs
- Update authorized redirect URIs
- Regenerate client secrets if needed

#### ✅ Current OAuth Configuration
- **Client ID**: Available in your credentials
- **Authorized Redirect URI**: 
  ```
  https://vhngrtytmzpniohtpkev.supabase.co/auth/v1/callback
  ```

#### 📋 OAuth Consent Screen
**Path**: `APIs & Services` → `OAuth consent screen`
- Update app name, logo, privacy policy
- Add/remove scopes
- Publish app from "Testing" to "Production" for unlimited users

---

## 🚀 Vercel - Hosting & Deployment

### Accessing Your Dashboard
1. Go to [vercel.com/dashboard](https://vercel.com)
2. Select project: `schedule-tracker`

### Key Sections

#### 📊 Overview
- See deployment status
- View recent builds
- Monitor traffic and usage

#### ⚙️ Settings → Environment Variables
**Path**: `Settings` → `Environment Variables`

Current variables:
| Name | Environment |
|------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Production |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production |

> ⚠️ If you change Supabase credentials, update them here!

#### 🌐 Domains
**Path**: `Settings` → `Domains`
- Current: `schedule-tracker-seven.vercel.app`
- Add custom domain here (e.g., `schedule.yourdomain.com`)

#### 📋 Deployments
- View all deployment history
- Rollback to previous versions
- See build logs for debugging

---

## 🔄 Making Changes & Redeploying

### Local Development

```bash
# 1. Navigate to project
cd /Users/vmaheshwari/.gemini/antigravity/playground/schedule-tracker

# 2. Use Node.js 20
nvm use 20

# 3. Start development server
npm run dev

# 4. Open in browser
open http://localhost:3000
```

### Deploy Changes

```bash
# Option 1: Quick deploy
vercel --prod

# Option 2: Build first, then deploy
npm run build
vercel --prod
```

### Project Structure

```
schedule-tracker/
├── src/
│   ├── app/
│   │   ├── page.tsx           # Landing page
│   │   ├── login/page.tsx     # Login page
│   │   ├── dashboard/page.tsx # Main dashboard
│   │   └── auth/callback/     # OAuth callback
│   ├── components/
│   │   ├── HabitTracker.tsx   # Habits grid + dashboard
│   │   ├── DayTasks.tsx       # Tasks list + analytics
│   │   ├── CalendarControls.tsx
│   │   └── DashboardNav.tsx
│   ├── lib/supabase/
│   │   ├── client.ts          # Browser Supabase client
│   │   └── server.ts          # Server Supabase client
│   └── types/index.ts         # TypeScript interfaces
├── .env.local                  # Environment variables (local)
└── README.md                   # Setup instructions
```

---

## 🛠️ Common Maintenance Tasks

### Add a New User Manually
1. Supabase → `Authentication` → `Users`
2. Click `Add user`
3. Enter email and password
4. User can login immediately

### Reset User Password
1. Supabase → `Authentication` → `Users`
2. Find user → Click `...` → `Send password recovery`

### Delete User Data
1. Supabase → `Table Editor` → Select table
2. Filter by `user_id`
3. Delete rows as needed

### View Error Logs
- **Vercel**: `Deployments` → Click deployment → `Functions` tab
- **Supabase**: `Database` → `Logs`

### Export Data
1. Supabase → `Table Editor` → Select table
2. Click `Export` → Choose format (CSV/JSON)

---

## 💰 Cost Management

### Free Tier Limits

| Service | Free Tier Limit | Current Usage |
|---------|-----------------|---------------|
| **Vercel** | 100GB bandwidth/month | ✅ Low |
| **Supabase** | 500MB database, 50K auth users | ✅ Low |
| **Google OAuth** | Unlimited | ✅ Free |

### When to Upgrade
- Database > 500MB → Supabase Pro ($25/mo)
- High traffic → Vercel Pro ($20/mo)
- Email sending needed → Supabase Pro

---

## 🔒 Security Checklist

- [x] Row Level Security (RLS) enabled on all tables
- [x] Users can only access their own data
- [x] Service role key NOT exposed in frontend
- [x] HTTPS enabled (automatic via Vercel)
- [x] OAuth redirect URLs restricted

### If Credentials are Compromised
1. **Supabase**: Settings → API → Regenerate keys
2. **Google**: Credentials → OAuth Client → Reset secret
3. **Vercel**: Update environment variables
4. Redeploy: `vercel --prod`

---

## 📞 Support Contacts

| Issue | Where to Get Help |
|-------|-------------------|
| Vercel Issues | [vercel.com/support](https://vercel.com/support) |
| Supabase Issues | [supabase.com/docs](https://supabase.com/docs) |
| Next.js Questions | [nextjs.org/docs](https://nextjs.org/docs) |

---

## 🔧 Troubleshooting

### Login Not Working
1. Check Supabase → Authentication → URL Configuration
2. Verify redirect URLs match your domain
3. Check Google Cloud OAuth redirect URIs

### Data Not Saving
1. Check browser console for errors
2. Verify RLS policies in Supabase
3. Test with Supabase Table Editor directly

### Build Failing on Vercel
1. Check Vercel deployment logs
2. Run `npm run build` locally to see errors
3. Ensure environment variables are set

### Charts Not Showing
1. Hard refresh: `Cmd+Shift+R`
2. Check for JavaScript errors in console
3. Verify Chart.js is installed

---

*Last updated: December 30, 2024*
