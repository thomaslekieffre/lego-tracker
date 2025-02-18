-- Supprimer les politiques existantes
DROP POLICY IF EXISTS "Users can view own sets" ON lego_sets;
DROP POLICY IF EXISTS "Users can insert own sets" ON lego_sets;
DROP POLICY IF EXISTS "Users can update own sets" ON lego_sets;
DROP POLICY IF EXISTS "Users can delete own sets" ON lego_sets;

-- Créer une politique simple pour toutes les opérations
CREATE POLICY "Users can manage their own sets"
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