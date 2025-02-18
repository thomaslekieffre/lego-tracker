-- Supprimer tout ce qui existe
DROP TABLE IF EXISTS shared_collections CASCADE;
DROP FUNCTION IF EXISTS increment_views;

-- Créer une table simple
CREATE TABLE shared_collections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id),
    set_id UUID NOT NULL REFERENCES lego_sets(id),
    share_token TEXT NOT NULL,
    is_public BOOLEAN DEFAULT false,
    views_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Un seul index sur le token
CREATE UNIQUE INDEX shared_collections_token_idx ON shared_collections(share_token);

-- Activer RLS
ALTER TABLE shared_collections ENABLE ROW LEVEL SECURITY;

-- Une seule politique simple pour tout
CREATE POLICY "Shared collections access"
ON shared_collections
FOR ALL
USING (
    is_public = true 
    OR 
    user_id IN (SELECT id FROM users WHERE clerk_id = auth.uid()::text)
);

-- Fonction pour incrémenter les vues
CREATE OR REPLACE FUNCTION increment_views(token TEXT)
RETURNS void AS $$
BEGIN
  UPDATE shared_collections
  SET views_count = views_count + 1,
      updated_at = NOW()
  WHERE share_token = token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 