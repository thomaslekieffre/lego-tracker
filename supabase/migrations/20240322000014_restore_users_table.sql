-- Créer une nouvelle table avec la structure souhaitée
CREATE TABLE users_new (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    clerk_id TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    subscription_tier TEXT DEFAULT 'free',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Copier les données existantes
INSERT INTO users_new (id, clerk_id, created_at, updated_at)
SELECT id, clerk_id, created_at, updated_at
FROM users;

-- Supprimer l'ancienne table
DROP TABLE users;

-- Renommer la nouvelle table
ALTER TABLE users_new RENAME TO users;

-- Créer l'index
CREATE INDEX idx_users_clerk_id ON users(clerk_id);

-- Désactiver RLS pour simplifier
ALTER TABLE users DISABLE ROW LEVEL SECURITY; 