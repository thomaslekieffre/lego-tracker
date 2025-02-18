-- Désactiver temporairement RLS sur toutes les tables
ALTER TABLE lego_sets DISABLE ROW LEVEL SECURITY;
ALTER TABLE shared_collections DISABLE ROW LEVEL SECURITY;
ALTER TABLE missing_pieces DISABLE ROW LEVEL SECURITY;

-- Supprimer toutes les politiques existantes pour repartir de zéro
DROP POLICY IF EXISTS "Users can manage their own sets" ON lego_sets;
DROP POLICY IF EXISTS "Users can view sets" ON lego_sets;
DROP POLICY IF EXISTS "Users can modify their own sets" ON lego_sets;
DROP POLICY IF EXISTS "Allow all to owners" ON shared_collections;
DROP POLICY IF EXISTS "Allow public read" ON shared_collections;

-- Créer une politique simple pour shared_collections
CREATE POLICY "Basic sharing policy"
ON shared_collections
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true); 