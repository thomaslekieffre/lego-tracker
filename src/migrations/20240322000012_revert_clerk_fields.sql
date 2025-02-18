-- Supprimer les politiques
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;

-- Supprimer les index
DROP INDEX IF EXISTS users_clerk_id_idx;
DROP INDEX IF EXISTS users_email_idx;

-- Supprimer les colonnes
ALTER TABLE users 
DROP COLUMN IF EXISTS avatar_url,
DROP COLUMN IF EXISTS first_name,
DROP COLUMN IF EXISTS last_name,
DROP COLUMN IF EXISTS username,
DROP COLUMN IF EXISTS email;

-- Désactiver RLS pour simplifier
ALTER TABLE users DISABLE ROW LEVEL SECURITY; 