-- Supprimer toutes les politiques existantes
DROP POLICY IF EXISTS "Users can manage their own shared collections" ON shared_collections;
DROP POLICY IF EXISTS "Anyone can view public shared collections" ON shared_collections;
DROP POLICY IF EXISTS "Users can insert their own shared collections" ON shared_collections;
DROP POLICY IF EXISTS "Users can update their own shared collections" ON shared_collections;
DROP POLICY IF EXISTS "Users can delete their own shared collections" ON shared_collections;

-- Supprimer la table existante
DROP TABLE IF EXISTS shared_collections CASCADE;

-- Recréer la table avec la structure d'origine qui fonctionnait
CREATE TABLE shared_collections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    set_id UUID NOT NULL REFERENCES lego_sets(id) ON DELETE CASCADE,
    share_token TEXT NOT NULL UNIQUE,
    is_public BOOLEAN DEFAULT false,
    expires_at TIMESTAMPTZ,
    views_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recréer les index essentiels
CREATE INDEX idx_shared_collections_share_token ON shared_collections(share_token);
CREATE INDEX idx_shared_collections_user_id ON shared_collections(user_id);
CREATE INDEX idx_shared_collections_set_id ON shared_collections(set_id);

-- Restaurer les politiques RLS simples qui fonctionnaient
CREATE POLICY "Users can manage their own shared collections"
ON shared_collections
FOR ALL
USING (user_id IN (
    SELECT id FROM users WHERE clerk_id = auth.uid()::text
));

CREATE POLICY "Anyone can view public shared collections"
ON shared_collections
FOR SELECT
USING (is_public = true);

-- Activer RLS
ALTER TABLE shared_collections ENABLE ROW LEVEL SECURITY;

-- Restaurer la fonction increment_views
CREATE OR REPLACE FUNCTION increment_views(token TEXT)
RETURNS void AS $$
BEGIN
  UPDATE shared_collections
  SET views_count = views_count + 1
  WHERE share_token = token;
END;
$$ LANGUAGE plpgsql; 