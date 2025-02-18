-- Supprimer l'index existant
DROP INDEX IF EXISTS users_email_unique_idx;

-- Supprimer toute contrainte existante sur email
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_email_key;

-- Permettre les valeurs NULL pour email
ALTER TABLE users ALTER COLUMN email DROP NOT NULL;

-- Créer un nouvel index unique qui exclut les valeurs NULL et EMPTY
CREATE UNIQUE INDEX users_email_unique_idx ON users (email) 
WHERE email IS NOT NULL 
AND email != ''
AND email != 'EMPTY';

-- Mettre à jour le cache du schéma
NOTIFY pgrst, 'reload schema'; 