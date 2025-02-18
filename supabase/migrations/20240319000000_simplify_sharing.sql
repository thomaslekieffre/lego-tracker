-- Supprimer les anciennes entrées
TRUNCATE TABLE shared_collections;

-- Supprimer la contrainte de clé étrangère sur set_id
ALTER TABLE shared_collections
DROP CONSTRAINT IF EXISTS shared_collections_set_id_fkey;

-- Supprimer la colonne set_id
ALTER TABLE shared_collections
DROP COLUMN IF EXISTS set_id;

-- Ajouter une colonne pour le titre de la collection
ALTER TABLE shared_collections
ADD COLUMN collection_name TEXT NOT NULL DEFAULT 'Ma Collection LEGO';

-- Mettre à jour les politiques RLS
DROP POLICY IF EXISTS "Users can manage their own shared collections" ON shared_collections;
DROP POLICY IF EXISTS "Anyone can view public shared collections" ON shared_collections;

CREATE POLICY "Users can manage their own shared collections"
ON shared_collections
FOR ALL
USING (user_id IN (
    SELECT id FROM users WHERE clerk_id = auth.uid()::text
));

CREATE POLICY "Anyone can view public shared collections"
ON shared_collections
FOR SELECT
USING (is_public = true); 