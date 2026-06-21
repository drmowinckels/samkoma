-- Fixed-window rate-limit counters (one row per key per time bucket).
-- Tiny and self-cleaning: the daily cron purges old buckets.
CREATE TABLE rate_limits (
  k      TEXT PRIMARY KEY,
  count  INTEGER NOT NULL,
  bucket INTEGER NOT NULL
);
CREATE INDEX idx_rate_limits_bucket ON rate_limits(bucket);
