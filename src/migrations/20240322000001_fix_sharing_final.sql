-- Désactiver RLS temporairement pour la migration
ALTER TABLE shared_collections DISABLE ROW LEVEL SECURITY;

-- Supprimer toutes les politiques et la table
DROP POLICY IF EXISTS "Users can manage their own shared collections" ON shared_collections;
DROP POLICY IF EXISTS "Anyone can view public shared collections" ON shared_collections;
DROP TABLE IF EXISTS shared_collections CASCADE;

-- Recréer la table exactement comme dans la migration originale
CREATE TABLE shared_collections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    set_id UUID NOT NULL REFERENCES lego_sets(id) ON DELETE CASCADE,
    share_token TEXT NOT NULL UNIQUE,
    is_public BOOLEAN DEFAULT false,
    expires_at TIMESTAMPTZ,
    views_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    collection_name TEXT NOT NULL DEFAULT 'Ma Collection LEGO'
);

-- Créer le trigger pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_shared_collections_updated_at
    BEFORE UPDATE ON shared_collections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Recréer les index exactement comme avant
CREATE INDEX idx_shared_collections_share_token ON shared_collections(share_token);
CREATE INDEX idx_shared_collections_user_id ON shared_collections(user_id);
CREATE INDEX idx_shared_collections_set_id ON shared_collections(set_id);

-- Recréer les politiques RLS exactement comme dans la migration originale
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

-- Réactiver RLS
ALTER TABLE shared_collections ENABLE ROW LEVEL SECURITY;

-- Recréer la fonction increment_views
CREATE OR REPLACE FUNCTION increment_views(token TEXT)
RETURNS void AS $$
BEGIN
    UPDATE shared_collections
    SET views_count = views_count + 1
    WHERE share_token = token;
END;
$$ LANGUAGE plpgsql; 