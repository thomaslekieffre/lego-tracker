-- Supprimer les politiques existantes
DROP POLICY IF EXISTS "Shared collections access" ON shared_collections;
DROP POLICY IF EXISTS "Users can manage their own shared collections" ON shared_collections;
DROP POLICY IF EXISTS "Anyone can view public shared collections" ON shared_collections;

-- Créer une politique simple qui permet tout aux propriétaires
CREATE POLICY "Allow all to owners"
ON shared_collections
FOR ALL
USING (
    user_id IN (
        SELECT id 
        FROM users 
        WHERE clerk_id = auth.uid()::text
    )
);

-- Créer une politique pour la lecture publique
CREATE POLICY "Allow public read"
ON shared_collections
FOR SELECT
USING (is_public = true);

-- S'assurer que RLS est activé
ALTER TABLE shared_collections ENABLE ROW LEVEL SECURITY; 