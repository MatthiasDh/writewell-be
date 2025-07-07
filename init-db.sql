-- Ensure the database exists (this is handled by POSTGRES_DB environment variable)
-- This script runs after the database is created

-- Create necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- You can add other initialization queries here if needed 