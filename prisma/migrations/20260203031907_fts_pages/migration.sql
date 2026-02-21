-- FTS config (english)
ALTER TABLE "Page" ADD COLUMN IF NOT EXISTS search_tsv tsvector;

-- Build tsvector from title + markdown
UPDATE "Page"
SET search_tsv = 
  setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
  setweight(to_tsvector('english', coalesce("contentMd", '')), 'B');

-- GIN index for fast search
CREATE INDEX IF NOT EXISTS page_search_tsv_idx
  ON "Page" USING GIN (search_tsv);

-- Keep tsv up-to-date
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
