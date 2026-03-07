-- ============================================================
-- Migration: Owner/Manager tab schema additions
-- ============================================================

-- Add relationship_notes to venue_owner_manager
ALTER TABLE venue_owner_manager
  ADD COLUMN IF NOT EXISTS relationship_notes TEXT;

-- Add doc_category to venue_documents to distinguish
-- 'asset' (media tab downloadable assets) vs 'legal' (owner/contracts)
ALTER TABLE venue_documents
  ADD COLUMN IF NOT EXISTS doc_category TEXT NOT NULL DEFAULT 'asset';
