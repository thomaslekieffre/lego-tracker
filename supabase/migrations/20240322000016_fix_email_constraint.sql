-- Supprimer la contrainte NOT NULL sur email
ALTER TABLE users ALTER COLUMN email DROP NOT NULL;

-- Supprimer l'ancienne contrainte UNIQUE
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_email_key;

-- Ajouter une nouvelle contrainte UNIQUE qui ignore les valeurs NULL
CREATE UNIQUE INDEX users_email_unique_idx ON users (email) WHERE email IS NOT NULL;

-- Mettre à jour le cache du schéma
NOTIFY pgrst, 'reload schema'; 