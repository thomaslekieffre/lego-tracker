-- Supprimer l'index existant
DROP INDEX IF EXISTS users_email_unique_idx;

-- Supprimer la contrainte UNIQUE existante si elle existe encore
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_email_key;

-- S'assurer que la colonne email accepte les valeurs NULL
ALTER TABLE users ALTER COLUMN email DROP NOT NULL;

-- Créer un nouvel index unique qui exclut explicitement les valeurs NULL
CREATE UNIQUE INDEX users_email_unique_idx ON users (
    COALESCE(email, 'NULL-' || id)
);

-- Mettre à jour le cache du schéma
NOTIFY pgrst, 'reload schema'; 