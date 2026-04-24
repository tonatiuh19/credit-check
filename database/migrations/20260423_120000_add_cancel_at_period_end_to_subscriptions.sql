-- Add cancel_at_period_end column to subscriptions table
ALTER TABLE subscriptions
  ADD COLUMN cancel_at_period_end TINYINT(1) NOT NULL DEFAULT 0
  AFTER canceled_at;
