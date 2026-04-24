-- Migration: Add Clerk user ID to users table, make password_hash nullable
-- Compatible with TiDB Cloud Serverless (MySQL 8.0)

ALTER TABLE users
  ADD COLUMN clerk_user_id VARCHAR(255) UNIQUE AFTER id,
  MODIFY COLUMN password_hash VARCHAR(255) NULL;
