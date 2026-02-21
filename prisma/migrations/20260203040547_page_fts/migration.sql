/*
  Warnings:

  - You are about to drop the column `search_tsv` on the `Page` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."page_search_tsv_idx";

-- AlterTable
ALTER TABLE "public"."Page" DROP COLUMN "search_tsv";
