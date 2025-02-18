-- Supprimer les politiques existantes
DROP POLICY IF EXISTS "Users can manage their own sets" ON lego_sets;
DROP POLICY IF EXISTS "Users can view own sets" ON lego_sets;
DROP POLICY IF EXISTS "Users can insert own sets" ON lego_sets;
DROP POLICY IF EXISTS "Users can update own sets" ON lego_sets;
DROP POLICY IF EXISTS "Users can delete own sets" ON lego_sets;

-- Politique pour la lecture
CREATE POLICY "Users can view sets"
ON lego_sets
FOR SELECT
USING (
    -- L'utilisateur peut voir ses propres sets
    user_id IN (
        SELECT id 
        FROM users 
        WHERE clerk_id = auth.uid()::text
    )
    OR
    -- L'utilisateur peut voir les sets partagés avec lui
    id IN (
        SELECT set_id 
        FROM shared_collections 
        WHERE is_public = true
    )
);

-- Politique pour les modifications (INSERT, UPDATE, DELETE)
CREATE POLICY "Users can modify their own sets"
ON lego_sets
FOR ALL
USING (
    user_id IN (
        SELECT id 
        FROM users 
        WHERE clerk_id = auth.uid()::text
    )
);

-- S'assurer que RLS est activé
ALTER TABLE lego_sets ENABLE ROW LEVEL SECURITY; 