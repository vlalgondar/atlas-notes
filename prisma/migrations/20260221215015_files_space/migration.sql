/*
  Warnings:

  - You are about to drop the column `search_tsv` on the `Page` table. All the data in the column will be lost.
  - Added the required column `spaceId` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."page_search_tsv_idx";

-- AlterTable
ALTER TABLE "public"."File" ADD COLUMN     "spaceId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Page" DROP COLUMN "search_tsv";
