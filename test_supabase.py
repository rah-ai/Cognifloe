# Quick Test - Supabase Connection

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from dotenv import load_dotenv
load_dotenv('backend/.env')

print("🔍 Testing Supabase Connection...")
print(f"SUPABASE_URL: {os.getenv('SUPABASE_URL')}")
print(f"SUPABASE_KEY: {'✓ Set' if os.getenv('SUPABASE_KEY') else '✗ Missing'}")
print(f"SECRET_KEY: {'✓ Set' if os.getenv('SECRET_KEY') else '✗ Missing'}")

try:
    from backend.database.supabase_client import get_supabase_client
    client = get_supabase_client()
    print("✅ Supabase client created successfully!")
    
    # Test connection with proper SQL
    result = client.table('users').select("*").execute()
    print(f"✅ Database connection successful!")
    print(f"📊 Users table exists and is accessible")
    print(f"   Current users: {len(result.data)}")
    
except Exception as e:
    error_msg = str(e)
    print(f"❌ Connection error: {error_msg}")
    
    if "does not exist" in error_msg or "relation" in error_msg:
        print("\n💡 Tables don't exist yet!")
        print("📋 Next steps:")
        print("1. Go to Supabase SQL Editor (already open in browser)")
        print("2. Run cleanup.sql first (copy/paste, then click Run)")
        print("3. Then run schema.sql (copy/paste, then click Run)")
        print("4. Run this test again")
    else:
        print("\n💡 Next steps:")
        print("1. Check your Supabase credentials in backend/.env")
        print("2. Make sure your Supabase project is active")
