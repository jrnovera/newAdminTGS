-- ============================================================
-- SQL MIGRATION: ADD MISSING COLUMNS TO PROFILES
-- ============================================================
-- Run this in the Supabase SQL Editor if you get 
-- "Could not find the 'full_name' column" or "Database error saving new user".

-- 1. Add missing columns
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 2. Ensure the role enum/check is correct
-- If you already have a role column, let's make sure it allows 'admin'
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'profiles_role_check'
    ) THEN
        ALTER TABLE public.profiles 
        ADD CONSTRAINT profiles_role_check 
        CHECK (role IN ('user', 'admin'));
    END IF;
END $$;
