-- MyCreditFICO Platform — TiDB Cloud Schema (MySQL 8.0 compatible)
-- Run in TiDB Cloud Serverless

CREATE TABLE IF NOT EXISTS users (
  id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  clerk_user_id    VARCHAR(255)    UNIQUE,
  email            VARCHAR(255)    NOT NULL,
  name             VARCHAR(255),
  identity_type    ENUM('SSN','ITIN') DEFAULT NULL,
  stripe_customer_id VARCHAR(255),
  subscription_status ENUM('inactive','trialing','active','past_due','canceled') NOT NULL DEFAULT 'inactive',
  subscription_end_date DATETIME,
  locale           ENUM('en','es-MX','fr') NOT NULL DEFAULT 'en',
  created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_email (email),
  KEY idx_stripe_customer_id (stripe_customer_id)
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id                     BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id                BIGINT UNSIGNED NOT NULL,
  stripe_subscription_id VARCHAR(255),
  stripe_price_id        VARCHAR(255),
  status                 VARCHAR(64) NOT NULL DEFAULT 'trialing',
  trial_start            DATETIME,
  trial_end              DATETIME,
  current_period_start   DATETIME,
  current_period_end     DATETIME,
  canceled_at            DATETIME,
  cancel_at_period_end   TINYINT(1) NOT NULL DEFAULT 0,
  created_at             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_user_id (user_id),
  CONSTRAINT fk_subscriptions_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS credit_pulls (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id     BIGINT UNSIGNED NOT NULL,
  provider    ENUM('ARRAY','MYFICO') NOT NULL,
  pull_date   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  bureau      VARCHAR(64),
  score       SMALLINT UNSIGNED,
  report_data JSON,
  cost_usd    DECIMAL(8,2) NOT NULL DEFAULT 0.00,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_user_pull_date (user_id, pull_date),
  CONSTRAINT fk_credit_pulls_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS pull_usage (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id    BIGINT UNSIGNED NOT NULL,
  month      CHAR(7) NOT NULL COMMENT 'Format: YYYY-MM',
  pulls_used TINYINT UNSIGNED NOT NULL DEFAULT 0,
  max_pulls  TINYINT UNSIGNED NOT NULL DEFAULT 2,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_user_month (user_id, month),
  CONSTRAINT fk_pull_usage_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS consent_log (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id      BIGINT UNSIGNED NOT NULL,
  consent_type VARCHAR(128) NOT NULL,
  ip_address   VARCHAR(45),
  user_agent   TEXT,
  consented_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_consent_user (user_id),
  CONSTRAINT fk_consent_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notifications_log (
  id        BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id   BIGINT UNSIGNED NOT NULL,
  type      VARCHAR(128) NOT NULL,
  channel   VARCHAR(64) NOT NULL DEFAULT 'email',
  status    ENUM('sent','failed','delivered','bounced','complained') NOT NULL DEFAULT 'sent',
  sent_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  metadata  JSON,
  PRIMARY KEY (id),
  KEY idx_notif_user (user_id),
  CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
