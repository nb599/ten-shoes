-- Add parent_id column to support comment replies
ALTER TABLE comments ADD COLUMN IF NOT EXISTS parent_id INTEGER REFERENCES comments(id) ON DELETE CASCADE;

-- Add index for better performance when querying replies
CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_id);
