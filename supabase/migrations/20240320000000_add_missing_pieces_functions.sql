-- Fonction pour recalculer le compteur de pièces manquantes
CREATE OR REPLACE FUNCTION update_missing_pieces_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Recalculer le total des pièces manquantes
  UPDATE lego_sets
  SET missing_pieces_count = (
    SELECT COALESCE(SUM(quantity), 0)
    FROM missing_pieces
    WHERE set_id = COALESCE(NEW.set_id, OLD.set_id)
  ),
  last_modified = NOW()
  WHERE id = COALESCE(NEW.set_id, OLD.set_id);
  
  RETURN NULL;
END;
$$;

-- Supprimer l'ancienne fonction si elle existe
DROP FUNCTION IF EXISTS increment_missing_pieces_count(UUID, INTEGER);

-- Supprimer le trigger s'il existe déjà
DROP TRIGGER IF EXISTS missing_pieces_count_trigger ON missing_pieces;

-- Créer le trigger
CREATE TRIGGER missing_pieces_count_trigger
AFTER INSERT OR UPDATE OR DELETE ON missing_pieces
FOR EACH ROW
EXECUTE FUNCTION update_missing_pieces_count(); 