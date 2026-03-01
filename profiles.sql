-- ============================================================
-- SQL MIGRATION: PROFILES TABLE
-- ============================================================
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor).
-- This table stores user profile details for both portal users
-- (role: 'user') and admin portal users (role: 'admin').

CREATE TABLE IF NOT EXISTS profiles (
    id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email        TEXT NOT NULL,
    full_name    TEXT,
    role         TEXT NOT NULL DEFAULT 'user'
                     CHECK (role IN ('user', 'admin')),
    created_at   TIMESTAMPTZ DEFAULT NOW(),
    updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can read and update their own profile
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Index for fast lookups by role
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles (role);
