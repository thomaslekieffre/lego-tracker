-- Supprimer l'ancienne fonction si elle existe
DROP FUNCTION IF EXISTS increment_views;

-- Créer une fonction simple pour incrémenter les vues
CREATE OR REPLACE FUNCTION increment_views(token TEXT)
RETURNS void AS $$
BEGIN
  UPDATE shared_collections
  SET views_count = views_count + 1
  WHERE share_token = token;
END;
$$ LANGUAGE plpgsql; 