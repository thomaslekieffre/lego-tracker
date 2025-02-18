-- Sauvegarder toutes les données existantes
CREATE TABLE users_temp AS 
SELECT * FROM users;

CREATE TABLE lego_sets_temp AS 
SELECT * FROM lego_sets;

CREATE TABLE missing_pieces_temp AS 
SELECT * FROM missing_pieces;

CREATE TABLE user_statistics_temp AS 
SELECT * FROM user_statistics;

-- Drop existing objects if they exist
DROP FUNCTION IF EXISTS increment_views(TEXT);
DROP TABLE IF EXISTS shared_collections CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS lego_sets CASCADE;
DROP TABLE IF EXISTS missing_pieces CASCADE;
DROP VIEW IF EXISTS user_statistics CASCADE;

-- Create users table
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    clerk_id TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    subscription_tier TEXT DEFAULT 'free',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Restaurer les données des utilisateurs
INSERT INTO users (id, clerk_id, email, created_at, updated_at)
SELECT id, clerk_id, email, created_at, updated_at
FROM users_temp;

-- Create lego_sets table
CREATE TABLE lego_sets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rebrickable_id TEXT NOT NULL,
    name TEXT NOT NULL,
    set_number TEXT NOT NULL,
    pieces_count INTEGER NOT NULL,
    year INTEGER NOT NULL,
    status TEXT NOT NULL,
    notes TEXT,
    last_modified TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    image_url TEXT,
    missing_pieces_count INTEGER DEFAULT 0
);

-- Restaurer les données des sets
INSERT INTO lego_sets 
SELECT 
    lst.id,
    u.id as user_id,
    lst.rebrickable_id,
    lst.name,
    lst.set_number,
    lst.pieces_count,
    lst.year,
    lst.status,
    lst.notes,
    lst.last_modified,
    lst.created_at,
    lst.image_url,
    lst.missing_pieces_count
FROM lego_sets_temp lst
JOIN users u ON u.clerk_id = lst.user_id::text;

-- Create missing_pieces table
CREATE TABLE missing_pieces (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    set_id UUID NOT NULL REFERENCES lego_sets(id) ON DELETE CASCADE,
    part_number TEXT NOT NULL,
    color TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    status TEXT NOT NULL,
    purchase_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    notes TEXT,
    price NUMERIC
);

-- Restaurer les données des pièces manquantes
INSERT INTO missing_pieces 
SELECT 
    mp.id,
    ls.id as set_id,
    mp.part_number,
    mp.color,
    mp.quantity,
    mp.status,
    mp.purchase_url,
    mp.created_at,
    mp.updated_at,
    mp.notes,
    mp.price
FROM missing_pieces_temp mp
JOIN lego_sets_temp lst ON lst.id = mp.set_id
JOIN lego_sets ls ON ls.rebrickable_id = lst.rebrickable_id AND ls.user_id = (
    SELECT u.id 
    FROM users u 
    WHERE u.clerk_id = lst.user_id::text
);

-- Create shared_collections table
CREATE TABLE shared_collections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    set_id UUID NOT NULL REFERENCES lego_sets(id) ON DELETE CASCADE,
    share_token TEXT NOT NULL UNIQUE,
    is_public BOOLEAN DEFAULT false,
    expires_at TIMESTAMPTZ,
    views_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_statistics view
CREATE VIEW user_statistics AS
SELECT 
    l.user_id,
    COUNT(l.id) as total_sets,
    COUNT(CASE WHEN l.status = 'mounted' THEN 1 END) as mounted_sets,
    COUNT(CASE WHEN l.status = 'dismounted' THEN 1 END) as dismounted_sets,
    COUNT(CASE WHEN l.status = 'incomplete' THEN 1 END) as incomplete_sets,
    COALESCE(SUM(l.missing_pieces_count), 0) as total_missing_pieces
FROM lego_sets l
GROUP BY l.user_id;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can manage their own sets" ON lego_sets;
DROP POLICY IF EXISTS "Users can view pieces from own sets" ON missing_pieces;
DROP POLICY IF EXISTS "Users can insert pieces to own sets" ON missing_pieces;
DROP POLICY IF EXISTS "Users can update pieces from own sets" ON missing_pieces;
DROP POLICY IF EXISTS "Users can delete pieces from own sets" ON missing_pieces;
DROP POLICY IF EXISTS "Users can manage their own shared collections" ON shared_collections;

-- Add RLS policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE lego_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE missing_pieces ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_collections ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own data"
ON users
FOR SELECT
USING (auth.uid()::text = clerk_id);

-- Lego sets policies
CREATE POLICY "Users can manage their own sets"
ON lego_sets
FOR ALL
USING (user_id IN (
    SELECT id FROM users WHERE clerk_id = auth.uid()::text
));

-- Missing pieces policies
CREATE POLICY "Users can view pieces from own sets"
ON missing_pieces
FOR SELECT
USING (set_id IN (
    SELECT id FROM lego_sets WHERE user_id IN (
        SELECT id FROM users WHERE clerk_id = auth.uid()::text
    )
));

CREATE POLICY "Users can insert pieces to own sets"
ON missing_pieces
FOR INSERT
WITH CHECK (set_id IN (
    SELECT id FROM lego_sets WHERE user_id IN (
        SELECT id FROM users WHERE clerk_id = auth.uid()::text
    )
));

CREATE POLICY "Users can update pieces from own sets"
ON missing_pieces
FOR UPDATE
USING (set_id IN (
    SELECT id FROM lego_sets WHERE user_id IN (
        SELECT id FROM users WHERE clerk_id = auth.uid()::text
    )
));

CREATE POLICY "Users can delete pieces from own sets"
ON missing_pieces
FOR DELETE
USING (set_id IN (
    SELECT id FROM lego_sets WHERE user_id IN (
        SELECT id FROM users WHERE clerk_id = auth.uid()::text
    )
));

-- Shared collections policies
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

-- Create functions
CREATE OR REPLACE FUNCTION increment_views(token TEXT)
RETURNS void AS $$
BEGIN
  UPDATE shared_collections
  SET views_count = views_count + 1
  WHERE share_token = token;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_missing_pieces_updated_at
    BEFORE UPDATE ON missing_pieces
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shared_collections_updated_at
    BEFORE UPDATE ON shared_collections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes
CREATE INDEX idx_missing_pieces_set_id ON missing_pieces(set_id);
CREATE INDEX idx_shared_collections_share_token ON shared_collections(share_token);
CREATE INDEX idx_users_clerk_id ON users(clerk_id);

-- Clean up temporary tables
DROP TABLE IF EXISTS users_temp;
DROP TABLE IF EXISTS lego_sets_temp;
DROP TABLE IF EXISTS missing_pieces_temp;
DROP TABLE IF EXISTS user_statistics_temp; 