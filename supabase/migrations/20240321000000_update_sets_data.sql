-- Réinitialiser les données existantes
UPDATE lego_sets
SET status = 'dismounted'
WHERE user_id IS NOT NULL;

-- Mettre à jour les statuts pour correspondre aux valeurs souhaitées
WITH sets_to_update AS (
  SELECT id
  FROM lego_sets
  WHERE user_id IS NOT NULL
  LIMIT 4 -- Total de sets
)
UPDATE lego_sets
SET status = CASE
  WHEN id = (SELECT id FROM sets_to_update LIMIT 1) THEN 'mounted'
  WHEN id = (SELECT id FROM sets_to_update OFFSET 1 LIMIT 1) THEN 'incomplete'
  ELSE 'dismounted'
END
WHERE id IN (SELECT id FROM sets_to_update);

-- Mettre à jour le nombre de pièces manquantes
UPDATE lego_sets
SET missing_pieces_count = CASE
  WHEN status = 'incomplete' THEN 1
  ELSE 0
END
WHERE user_id IS NOT NULL; 