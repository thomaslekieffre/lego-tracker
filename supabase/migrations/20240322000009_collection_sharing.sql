-- Supprimer la table existante
DROP TABLE IF EXISTS shared_collections CASCADE;

-- Créer une nouvelle table pour le partage de collection
CREATE TABLE shared_collections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    share_token TEXT NOT NULL UNIQUE,
    is_public BOOLEAN DEFAULT true,
    views_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    collection_name TEXT NOT NULL DEFAULT 'Ma Collection LEGO'
);

-- Index minimal
CREATE UNIQUE INDEX shared_collections_token_idx ON shared_collections(share_token);

-- Désactiver RLS complètement pour simplifier
ALTER TABLE shared_collections DISABLE ROW LEVEL SECURITY;

-- Fonction pour incrémenter les vues
CREATE OR REPLACE FUNCTION increment_views(token TEXT)
RETURNS void AS $$
BEGIN
    UPDATE shared_collections
    SET views_count = views_count + 1
    WHERE share_token = token;
END;
$$ LANGUAGE plpgsql; 