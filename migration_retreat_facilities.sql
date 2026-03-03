-- ============================================================
-- SQL MIGRATION: RETREAT FACILITIES TAB
-- ============================================================
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor).
-- Adds columns to retreat_venues for the Retreat Facilities tab.

ALTER TABLE retreat_venues
ADD COLUMN IF NOT EXISTS retreat_facilities JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS retreat_facilities_tab_image TEXT,
ADD COLUMN IF NOT EXISTS retreat_facilities_label TEXT DEFAULT 'Retreat Spaces',
ADD COLUMN IF NOT EXISTS retreat_facilities_title TEXT,
ADD COLUMN IF NOT EXISTS retreat_facilities_subtitle TEXT,
ADD COLUMN IF NOT EXISTS retreat_facilities_intro TEXT,
ADD COLUMN IF NOT EXISTS retreat_facilities_notes TEXT,
ADD COLUMN IF NOT EXISTS supported_retreat_types TEXT[] DEFAULT '{}';
