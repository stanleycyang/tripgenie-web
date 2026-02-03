# TripGenie Credentials & 1Password Workflow

## Credentials You'll Need to Save

### Supabase Project Credentials

#### 1. Database Password
- **When**: During project creation
- **Format**: Strong password (auto-generated recommended)
- **Example**: `TripGenie2026_aB3cD4eF5gH6iJ7k`
- **Usage**: PostgreSQL direct access (rarely needed)

#### 2. Project URL
- **Where**: Supabase Dashboard → Project Settings → API
- **Format**: `https://[project-ref].supabase.co`
- **Example**: `https://abcdefghijk123456.supabase.co`
- **Usage**: All API calls

#### 3. Anon/Public Key
- **Where**: Supabase Dashboard → Project Settings → API
- **Format**: JWT token (long string starting with `eyJ`)
- **Example**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZi...`
- **Usage**: Client-side queries (respects RLS)
- **Safe to expose**: Yes, in browser

#### 4. Service Role Key
- **Where**: Supabase Dashboard → Project Settings → API
- **Format**: JWT token (long string starting with `eyJ`)
- **Example**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZi...`
- **Usage**: Server-side admin operations (bypasses RLS)
- **Safe to expose**: NO! Server-only, never commit to git

#### 5. Project Reference ID
- **Where**: From project URL or dashboard
- **Format**: 20-character alphanumeric
- **Example**: `abcdefghijk123456`
- **Usage**: CLI linking, API calls

---

## 1Password Setup

### Create New Item

**Category**: Login (or Database)

**Fields to Add**:

```
Title: TripGenie Supabase Production

Username: postgres
Password: [Database Password from creation]

Website: https://supabase.com/dashboard/project/[project-ref]

Additional Fields:
- Project URL: https://[project-ref].supabase.co
- Project Reference: [project-ref]
- Anon Key: eyJhbGc...
- Service Role Key: eyJhbGc... (mark as password/concealed)
- Region: US West (North California)
- Created: [Date]

Notes:
- Free tier (or Pro if upgraded)
- Database: PostgreSQL 15
- Auth providers: Google, Apple, Email
- See: /backend/docs/SUPABASE_SETUP.md
```

### Security Best Practices

1. **Mark Service Role Key as concealed** (password field)
2. **Add to "Engineering" or "TripGenie" vault**
3. **Share only with team members who need server access**
4. **Add tags**: `tripgenie`, `supabase`, `database`, `production`

---

## OAuth Provider Credentials

### Google OAuth

**Create New Item in 1Password**:

```
Title: TripGenie Google OAuth

Website: https://console.cloud.google.com

Client ID: 123456789-abcdefg.apps.googleusercontent.com
Client Secret: GOCSPX-abc123...

Redirect URIs:
- https://[project-ref].supabase.co/auth/v1/callback
- http://localhost:3000/auth/callback (dev)

Notes:
- Used for: Supabase Google Sign-In
- Project: TripGenie
- Configured in: Supabase Dashboard → Auth → Providers → Google
```

### Apple Sign-In

**Create New Item in 1Password**:

```
Title: TripGenie Apple Sign-In

Website: https://developer.apple.com

Services ID: com.tripgenie.auth
Team ID: ABC123XYZ
Key ID: 1234567890

[Attach .p8 private key file to 1Password item]

Return URLs:
- https://[project-ref].supabase.co/auth/v1/callback

Notes:
- Used for: Supabase Apple Sign-In
- Configured in: Supabase Dashboard → Auth → Providers → Apple
```

---

## Environment Variables Workflow

### Development (.env.local)

**File**: `/backend/.env.local`

```env
# From 1Password: TripGenie Supabase Production
NEXT_PUBLIC_SUPABASE_URL=https://[project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

**Never commit this file!** (already in `.gitignore`)

### Production (Vercel)

**Set in Vercel Dashboard**:

1. Go to: Project Settings → Environment Variables
2. Add for "Production" environment:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

**Reference**: Copy from 1Password

### Staging (if applicable)

Create separate Supabase project:
- Name: `tripgenie-staging`
- Save credentials separately in 1Password
- Use different environment variables

---

## Quick Copy Commands

### From 1Password to .env.local

```bash
# 1. Open 1Password CLI or GUI
# 2. Copy values one by one
# 3. Edit .env.local:

cd /Users/stanleyyang/.openclaw/workspace/tripgenie/backend
nano .env.local

# Paste values (Cmd+V)
# Save and exit (Ctrl+X, Y, Enter)
```

### Verify .env.local

```bash
# Should show your actual values (not placeholders)
cat .env.local | grep -v "^#" | grep SUPABASE
```

---

## Testing Credentials

### Quick Test
```bash
cd /Users/stanleyyang/.openclaw/workspace/tripgenie/backend
npm run test:db
```

**If successful**: ✅ Credentials are correct
**If fails**: Check error message and verify credentials in 1Password

### Manual Test
```bash
# Test Project URL
curl https://[project-ref].supabase.co

# Should return: {"msg":"not found"}
# (That's normal - just confirms the URL is reachable)
```

---

## Rotating Credentials

### If Service Role Key is Compromised

1. **Generate New Key**:
   - Supabase Dashboard → Project Settings → API
   - Click "Reset Service Role Key"
   - Confirm

2. **Update Everywhere**:
   - 1Password: Update the item
   - `.env.local`: Update on all developer machines
   - Vercel: Update environment variable
   - Any CI/CD: Update secrets

3. **Test**: `npm run test:db`

### If Database Password Needs Reset

1. **Reset in Dashboard**:
   - Supabase Dashboard → Project Settings → Database
   - Change password

2. **Update**:
   - 1Password: Update password
   - Usually not needed in .env (uses API keys, not DB password)

---

## Sharing with Team

### What to Share
- ✅ Project URL (public)
- ✅ Anon Key (public)
- ✅ 1Password shared vault access
- ⚠️ Service Role Key (only to backend developers)
- ❌ Never share via email/Slack/Discord

### How to Share
1. **Add to 1Password shared vault**
2. **Grant vault access to team members**
3. **They fetch credentials from 1Password**

### For New Developers
```bash
# 1. Get access to 1Password vault
# 2. Clone repo
git clone <repo-url>
cd tripgenie/backend

# 3. Copy .env.local.example
cp .env.local.example .env.local

# 4. Fill in values from 1Password
nano .env.local

# 5. Test connection
npm run test:db
```

---

## Credential Security Checklist

- [ ] Database password saved in 1Password
- [ ] Service Role Key marked as concealed/password
- [ ] `.env.local` in `.gitignore` (yes, already there)
- [ ] No credentials in git history
- [ ] Vercel environment variables set
- [ ] OAuth credentials saved separately
- [ ] Team members have 1Password access
- [ ] Service Role Key NOT in frontend code
- [ ] Anon Key properly used (client-side only)

---

## Emergency: Credentials Leaked

### If Service Role Key is Exposed

**IMMEDIATE ACTION**:
```bash
# 1. Rotate the key in Supabase Dashboard
Project Settings → API → Reset Service Role Key

# 2. Update all deployment environments
# 3. Notify team via Slack/email
# 4. Check logs for unauthorized access
```

### If Database Password is Exposed
```bash
# 1. Reset database password in dashboard
# 2. Update 1Password
# 3. Direct database access is rare, but monitor logs
```

### If Anon Key is Exposed
- **Not critical** (designed for client-side use)
- RLS protects data even with anon key
- But if concerned, can rotate via dashboard

---

## Resources

- [1Password for Teams](https://1password.com/teams/)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/auth/managing-user-data#security-best-practices)
- [Environment Variables in Vercel](https://vercel.com/docs/concepts/projects/environment-variables)

---

**Remember**: The Service Role Key is the crown jewel. Treat it like your AWS root credentials. 🔐
