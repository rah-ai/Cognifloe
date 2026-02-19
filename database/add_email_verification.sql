-- Migration: Add email verification columns to users table
-- Run this in Supabase SQL Editor

-- Add email verification columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS otp_code TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS otp_expires_at TIMESTAMP WITH TIME ZONE;

-- Create index for faster lookups during verification
CREATE INDEX IF NOT EXISTS idx_users_email_verified ON users(email_verified);
