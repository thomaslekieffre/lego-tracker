-- Supprimer la table existante
DROP TABLE IF EXISTS shared_collections CASCADE;

-- Recréer la table avec la structure correcte
CREATE TABLE shared_collections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    set_id UUID NOT NULL REFERENCES lego_sets(id) ON DELETE CASCADE,
    share_token TEXT NOT NULL UNIQUE,
    is_public BOOLEAN DEFAULT true,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Créer les index nécessaires
CREATE INDEX idx_shared_collections_user_id ON shared_collections(user_id);
CREATE INDEX idx_shared_collections_set_id ON shared_collections(set_id);
CREATE UNIQUE INDEX idx_shared_collections_token ON shared_collections(share_token);

-- Désactiver RLS
ALTER TABLE shared_collections DISABLE ROW LEVEL SECURITY;

-- Recréer la fonction increment_views
CREATE OR REPLACE FUNCTION increment_views(token TEXT)
RETURNS void AS $$
BEGIN
  UPDATE shared_collections
  SET views_count = views_count + 1
  WHERE share_token = token;
END;
$$ LANGUAGE plpgsql; 