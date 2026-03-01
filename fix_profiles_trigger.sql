-- ============================================================
-- SQL MIGRATION: FIX PROFILES TRIGGER
-- ============================================================
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor).
--
-- The existing trigger was inserting role = 'Administrator'.
-- This replaces it to default to 'user', and switches to
-- ON CONFLICT DO UPDATE so application upserts can override the role.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    'user'   -- default to 'user'; the application will update to 'admin' for admin accounts
  )
  ON CONFLICT (id) DO UPDATE
    SET
      email     = EXCLUDED.email,
      full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
      role      = EXCLUDED.role;
  RETURN NEW;
END;
$$;

-- Re-attach the trigger if it was dropped (no-op if it already exists)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
