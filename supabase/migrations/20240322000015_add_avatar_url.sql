-- Ajouter la colonne avatar_url à la table users
ALTER TABLE users ADD COLUMN avatar_url TEXT;

-- Mettre à jour le cache du schéma
NOTIFY pgrst, 'reload schema'; 