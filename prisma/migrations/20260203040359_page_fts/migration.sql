-- Add tsvector column if missing
ALTER TABLE "Page" ADD COLUMN IF NOT EXISTS search_tsv tsvector;

-- Backfill existing rows
UPDATE "Page"
SET search_tsv =
  setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
  setweight(to_tsvector('english', coalesce("contentMd", '')), 'B')
WHERE search_tsv IS NULL;

-- Index
CREATE INDEX IF NOT EXISTS page_search_tsv_idx
  ON "Page" USING GIN (search_tsv);

-- Trigger to keep it updated
CREATE OR REPLACE FUNCTION page_search_tsv_trigger() RETURNS trigger AS $$
BEGIN
  NEW.search_tsv :=
    setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW."contentMd", '')), 'B');
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS page_search_tsv_update ON "Page";
CREATE TRIGGER page_search_tsv_update
BEFORE INSERT OR UPDATE OF title, "contentMd" ON "Page"
FOR EACH ROW EXECUTE FUNCTION page_search_tsv_trigger();
