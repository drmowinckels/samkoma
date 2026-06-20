-- The host can "lock in" a winning slot. NULL = not yet locked.
ALTER TABLE polls ADD COLUMN locked_slot TEXT;
