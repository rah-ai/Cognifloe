# Supabase Database Setup Instructions

## Prerequisites
- Supabase account (https://supabase.com)
- Project created with credentials in `.env` files

## Step 1: Run the Database Schema

### Option A: Using Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy the entire contents of `database/schema.sql`
5. Paste into the SQL editor
6. Click "Run" or press Ctrl+Enter

### Option B: Using PostgreSQL CLI
```bash
psql "postgresql://postgres:[Aidoesnotreplacejobs]@db.obsjmjrgzbogyzawrxmp.supabase.co:5432/postgres" -f database/schema.sql
```

## Step 2: Verify Tables Created

Run this query in SQL Editor to verify:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

You should see:
- users
- workflows
- agents
- workflow_steps
- metrics

## Step 3: Test RLS Policies

Check that Row Level Security is enabled:
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

All tables should show `rowsecurity = true`

## Step 4: Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

## Step 5: Install Frontend Dependencies

```bash
cd frontend
npm install
```

## Step 6: Start the Application

**Terminal 1 - Backend:**
```bash
python -m uvicorn backend.main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Environment Variables

### Backend (.env)
```env
SUPABASE_URL=https://obsjmjrgzbogyzawrxmp.supabase.co
SUPABASE_KEY=your_anon_key_here
DATABASE_URL=postgresql://postgres:[Aidoesnotreplacejobs]@db.obsjmjrgzbogyzawrxmp.supabase.co:5432/postgres
SECRET_KEY=your-secret-key-change-in-production
```

### Frontend (.env)
```env
VITE_SUPABASE_URL=https://obsjmjrgzbogyzawrxmp.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## Getting Your Supabase Keys

1. Go to your Supabase project dashboard
2. Click on "Settings" (gear icon)
3. Click on "API"
4. Copy the following:
   - **Project URL** → SUPABASE_URL / VITE_SUPABASE_URL
   - **anon public** key → SUPABASE_KEY / VITE_SUPABASE_ANON_KEY
   - **service_role** key → SUPABASE_SERVICE_ROLE_KEY (optional, for admin operations)

## Testing the Integration

### 1. Test Signup
```bash
curl -X POST http://localhost:8000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test1234","full_name":"Test User"}'
```

### 2. Test Login
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test1234"}'
```

### 3. Test Create Workflow (with token from login)
```bash
curl -X POST http://localhost:8000/api/v1/workflows \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"name":"Test Workflow","description":"My first workflow"}'
```

## Troubleshooting

### Connection Errors
- Verify Supabase URL and keys in `.env`
- Check that `.env` files are in correct locations
- Restart backend server after changing `.env`

### Permission Errors
- Ensure RLS policies are created
- Verify user is authenticated
- Check JWT token in Authorization header

### Missing Tables
- Re-run schema.sql
- Check for SQL errors in Supabase logs

## Next Steps

Once database is set up:
1. ✅ Test authentication
2. ✅ Create test workflows
3. ✅ Verify RLS works
4. ✅ Update frontend to use Supabase
5. ✅ Add real-time subscriptions
