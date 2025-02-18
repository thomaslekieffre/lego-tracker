-- Supprimer la table existante
DROP TABLE IF EXISTS shared_collections CASCADE;

-- Créer une table ultra simple
CREATE TABLE shared_collections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL, -- Utiliser directement le Clerk ID
    set_id UUID NOT NULL REFERENCES lego_sets(id),
    share_token TEXT NOT NULL UNIQUE,
    is_public BOOLEAN DEFAULT true, -- Public par défaut
    views_count INT DEFAULT 0
);

-- Désactiver RLS complètement
ALTER TABLE shared_collections DISABLE ROW LEVEL SECURITY;

-- Index minimal
CREATE UNIQUE INDEX shared_collections_token_idx ON shared_collections(share_token); 