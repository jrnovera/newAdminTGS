-- Migration: Add taxonomy columns to wellness_service_items
-- Apply manually via Supabase SQL Editor
-- These columns allow tagging individual services with the standardized
-- experience taxonomy used on the Wellness Experiences page.

ALTER TABLE wellness_service_items
ADD COLUMN IF NOT EXISTS taxonomy_category text,
ADD COLUMN IF NOT EXISTS taxonomy_subcategory text;

CREATE INDEX IF NOT EXISTS idx_wsi_taxonomy_subcategory ON wellness_service_items(taxonomy_subcategory);
CREATE INDEX IF NOT EXISTS idx_wsi_taxonomy_category ON wellness_service_items(taxonomy_category);
