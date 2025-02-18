-- Supprimer la table et les politiques existantes
DROP TABLE IF EXISTS shared_collections CASCADE;

-- Créer la table avec le minimum nécessaire
CREATE TABLE shared_collections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    set_id UUID NOT NULL REFERENCES lego_sets(id) ON DELETE CASCADE,
    share_token TEXT NOT NULL UNIQUE,
    is_public BOOLEAN DEFAULT false,
    views_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    collection_name TEXT NOT NULL DEFAULT 'Ma Collection LEGO'
);

-- Index essentiel
CREATE INDEX idx_shared_collections_share_token ON shared_collections(share_token);

-- Une seule politique simple
CREATE POLICY "Shared collections access"
ON shared_collections
FOR ALL
USING (
    is_public = true 
    OR 
    user_id IN (SELECT id FROM users WHERE clerk_id = auth.uid()::text)
);

-- Activer RLS
ALTER TABLE shared_collections ENABLE ROW LEVEL SECURITY;

-- Fonction de comptage des vues
CREATE OR REPLACE FUNCTION increment_views(token TEXT)
RETURNS void AS $$
BEGIN
    UPDATE shared_collections
    SET views_count = views_count + 1
    WHERE share_token = token;
END;
$$ LANGUAGE plpgsql; 