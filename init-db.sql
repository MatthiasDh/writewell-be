-- Ensure the database exists (this is handled by POSTGRES_DB environment variable)
-- This script runs after the database is created

-- Create necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Add indexes for better performance
-- These will be created after TypeORM creates the tables

-- Index for organization lookup by clerk_organization_id
-- CREATE INDEX IF NOT EXISTS idx_organizations_clerk_id ON organizations(clerk_organization_id);

-- Index for user lookup by clerk_user_id
-- CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_user_id);

-- Index for scheduled content items by organization and date
-- CREATE INDEX IF NOT EXISTS idx_scheduled_content_organization_date ON scheduled_content_items(organization_id, scheduled_date);

-- Index for scheduled content items by status
-- CREATE INDEX IF NOT EXISTS idx_scheduled_content_status ON scheduled_content_items(status);

-- Note: Indexes are commented out as they will be created automatically by TypeORM
-- based on the entity definitions with unique constraints and foreign keys 