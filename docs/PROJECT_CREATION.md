# TripGenie Supabase Project Creation Guide

## ⚠️ Free Tier Limitation Encountered

The automatic project creation failed because:
- **Free tier limit**: 2 active free projects per organization member
- **Current status**: Both org members (alloo.mohamed@gmail.com and stanleycyang) have reached the limit

## Options to Proceed

### Option 1: Pause or Delete an Existing Project (Recommended for Development)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Review your existing projects:
   - `operator` (West US - North California)
   - `jobfolio-staging` (West US - Oregon)
   - `pictionary-party` (West US - Oregon)
   - `jobfolio-production` (West US - North California) - **Keep this!**
   - `honestcasa` (West US - North California)
   - `mealgenie` (East US - Ohio)
3. **Pause** a project you're not actively using (keeps data, stops billing)
4. Once freed up, create the new project

### Option 2: Upgrade to Pro Plan ($25/month)

Benefits:
- Unlimited projects
- Better performance
- More storage and bandwidth
- Priority support
- No pausing required

Upgrade at: [Supabase Dashboard → Organization Settings → Billing](https://supabase.com/dashboard/org/pvdnxdvjmjgywjxnjrjb/billing)

### Option 3: Use an Existing Project (Not Recommended)

Could reuse `mealgenie` or `pictionary-party` if they're not critical, but this mixes concerns.

## Manual Project Creation Steps

Once you've freed up a slot or upgraded:

### Via Supabase CLI

```bash
cd /Users/stanleyyang/.openclaw/workspace/tripgenie/backend

# Generate a secure database password first
DB_PASSWORD="TripGenie2026_$(openssl rand -base64 16 | tr -d '/+=')"

# Save this password to 1Password immediately!
echo "Database Password: $DB_PASSWORD"

# Create the project
supabase projects create tripgenie-prod \
  --org-id pvdnxdvjmjgywjxnjrjb \
  --region us-west-1 \
  --plan free \
  --db-password "$DB_PASSWORD"

# Link the project to your local repo
supabase link --project-ref <project-ref-from-output>
```

### Via Supabase Dashboard (Alternative)

1. Visit [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Select organization: **pvdnxdvjmjgywjxnjrjb**
4. Fill in:
   - **Name**: `tripgenie-prod`
   - **Database Password**: Generate a strong one (save to 1Password!)
   - **Region**: **West US (North California)** - closest to you
   - **Plan**: Free (or Pro if upgraded)
5. Click "Create new project"
6. Wait 2-3 minutes for provisioning

## After Project Creation

### 1. Get API Credentials

Go to: Project Settings → API

You'll need:
- **Project URL**: `https://<project-ref>.supabase.co`
- **Anon/Public Key**: `eyJhbGc...` (safe for client)
- **Service Role Key**: `eyJhbGc...` (server-only, never expose!)

### 2. Update `.env.local`

```bash
cd /Users/stanleyyang/.openclaw/workspace/tripgenie/backend

# Edit .env.local with your actual values
nano .env.local
```

Replace placeholders with actual values:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Run Database Migrations

```bash
cd /Users/stanleyyang/.openclaw/workspace/tripgenie/backend

# Option A: Using Supabase CLI
supabase db push

# Option B: Via SQL Editor in Supabase Dashboard
# 1. Go to SQL Editor in dashboard
# 2. Copy contents of supabase/migrations/20260202_init_schema.sql
# 3. Run the query
```

### 4. Configure Authentication Providers

#### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create OAuth 2.0 Client ID (or use existing)
3. Add authorized redirect URI:
   ```
   https://<your-project-ref>.supabase.co/auth/v1/callback
   ```
4. Copy Client ID and Client Secret
5. In Supabase Dashboard → Authentication → Providers → Google:
   - Enable Google provider
   - Paste Client ID and Client Secret
   - Save

#### Apple Sign-In

1. Go to [Apple Developer](https://developer.apple.com/account/resources/identifiers/list/serviceId)
2. Create Services ID
3. Configure Sign in with Apple:
   - Return URLs: `https://<your-project-ref>.supabase.co/auth/v1/callback`
4. Generate private key
5. In Supabase Dashboard → Authentication → Providers → Apple:
   - Enable Apple provider
   - Add Services ID, Team ID, Key ID, and Private Key
   - Save

#### Email/Password

Already enabled by default! Just configure:
1. Go to Authentication → Email Templates
2. Customize confirmation and reset emails (optional)
3. Enable/disable email confirmation as needed

### 5. Set Redirect URLs

In Supabase Dashboard → Authentication → URL Configuration:

**Site URL**: `http://localhost:3000`

**Redirect URLs** (add both):
```
http://localhost:3000/auth/callback
https://tripgenie.app/auth/callback
```

### 6. Test the Setup

```bash
cd /Users/stanleyyang/.openclaw/workspace/tripgenie/backend

# Install tsx if needed
npm install -D tsx

# Run the test script
npx tsx scripts/test-supabase.ts
```

Expected output: All tests should pass ✅

### 7. Save Credentials to 1Password

Create a new item in 1Password:
- **Title**: TripGenie Supabase Production
- **Type**: Database
- **Fields**:
  - Project URL: `https://<ref>.supabase.co`
  - Database Password: `<saved-from-creation>`
  - Anon Key: `<from-api-settings>`
  - Service Role Key: `<from-api-settings>`
  - Project Ref: `<ref>`
  - Dashboard Link: `https://supabase.com/dashboard/project/<ref>`

## Verification Checklist

- [ ] Project created successfully
- [ ] `.env.local` updated with real credentials
- [ ] Database migrations applied (all 4 tables exist)
- [ ] RLS policies enabled and tested
- [ ] Google OAuth configured
- [ ] Apple Sign-In configured
- [ ] Email/Password auth enabled
- [ ] Redirect URLs set correctly
- [ ] Test script passes all tests
- [ ] Credentials saved to 1Password

## Troubleshooting

### "Cannot connect to project"
- Verify project is fully provisioned (check dashboard)
- Confirm API URL and keys are correct in `.env.local`
- Check if project is paused

### "Migration failed"
- Check PostgreSQL logs in dashboard
- Ensure no tables exist that conflict
- Try running migration manually via SQL Editor

### "Auth not working"
- Verify redirect URLs match exactly
- Check OAuth credentials are correct
- Ensure site URL is set

## Next Steps

Once setup is complete:
1. ✅ Start building API routes (`/api/trips`, `/api/itineraries`)
2. ✅ Implement authentication flow in frontend
3. ✅ Connect AI itinerary generation to database
4. ✅ Build trip management UI

---

**Status**: Waiting for project creation (free tier limit reached)

**Action Required**: Pause an existing project or upgrade to Pro, then follow the manual creation steps above.
