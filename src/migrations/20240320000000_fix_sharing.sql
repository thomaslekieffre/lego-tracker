-- Supprimer les anciennes entrées pour éviter les conflits
TRUNCATE TABLE shared_collections;

-- Recréer la table avec la structure correcte
DROP TABLE IF EXISTS shared_collections CASCADE;

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

-- Recréer les index
CREATE INDEX idx_shared_collections_share_token ON shared_collections(share_token);
CREATE INDEX idx_shared_collections_user_id ON shared_collections(user_id);
CREATE INDEX idx_shared_collections_set_id ON shared_collections(set_id);

-- Mettre à jour les politiques RLS
DROP POLICY IF EXISTS "Users can manage their own shared collections" ON shared_collections;
DROP POLICY IF EXISTS "Anyone can view public shared collections" ON shared_collections;

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

-- Activer RLS sur la table
ALTER TABLE shared_collections ENABLE ROW LEVEL SECURITY; 