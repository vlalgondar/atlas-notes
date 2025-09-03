-- Enable the pgvector extension (safe if already enabled)
CREATE EXTENSION IF NOT EXISTS vector;

-- Add a 768-dim embedding column to DocChunk
ALTER TABLE "DocChunk" ADD COLUMN IF NOT EXISTS embedding vector(768);

-- Create an IVFFlat index for cosine similarity (tune lists as data grows)
CREATE INDEX IF NOT EXISTS doc_chunks_embedding_idx
  ON "DocChunk" USING ivfflat (embedding vector_cosine_ops) WITH (lists=100);
