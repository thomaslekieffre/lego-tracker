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
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recréer les index pour les performances
CREATE INDEX idx_shared_collections_share_token ON shared_collections(share_token);
CREATE INDEX idx_shared_collections_user_id ON shared_collections(user_id);
CREATE INDEX idx_shared_collections_set_id ON shared_collections(set_id);

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

-- Mettre à jour les politiques RLS
DROP POLICY IF EXISTS "Users can manage their own shared collections" ON shared_collections;
DROP POLICY IF EXISTS "Anyone can view public shared collections" ON shared_collections;
DROP POLICY IF EXISTS "Users can insert their own shared collections" ON shared_collections;
DROP POLICY IF EXISTS "Users can update their own shared collections" ON shared_collections;
DROP POLICY IF EXISTS "Users can delete their own shared collections" ON shared_collections;

-- Politique pour la lecture
CREATE POLICY "Anyone can view public shared collections"
ON shared_collections
FOR SELECT
USING (
    is_public = true 
    OR 
    user_id IN (SELECT id FROM users WHERE clerk_id = auth.uid()::text)
);

-- Politique pour l'insertion
CREATE POLICY "Users can insert their own shared collections"
ON shared_collections
FOR INSERT
WITH CHECK (
    user_id IN (SELECT id FROM users WHERE clerk_id = auth.uid()::text)
    AND
    set_id IN (SELECT id FROM lego_sets WHERE user_id IN (SELECT id FROM users WHERE clerk_id = auth.uid()::text))
);

-- Politique pour la mise à jour
CREATE POLICY "Users can update their own shared collections"
ON shared_collections
FOR UPDATE
USING (user_id IN (SELECT id FROM users WHERE clerk_id = auth.uid()::text));

-- Politique pour la suppression
CREATE POLICY "Users can delete their own shared collections"
ON shared_collections
FOR DELETE
USING (user_id IN (SELECT id FROM users WHERE clerk_id = auth.uid()::text));

-- Activer RLS sur la table
ALTER TABLE shared_collections ENABLE ROW LEVEL SECURITY;

-- Créer la fonction pour incrémenter les vues
CREATE OR REPLACE FUNCTION increment_views(token TEXT)
RETURNS void AS $$
BEGIN
  UPDATE shared_collections
  SET views_count = views_count + 1
  WHERE share_token = token;
END;
$$ LANGUAGE plpgsql; 