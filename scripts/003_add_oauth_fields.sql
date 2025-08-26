-- Add OAuth fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS oauth_provider TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS oauth_id TEXT;

-- Make password_hash optional for OAuth users
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;

-- Add index for OAuth lookups
CREATE INDEX IF NOT EXISTS idx_users_oauth ON users(oauth_provider, oauth_id);
