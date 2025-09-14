-- AlterTable
ALTER TABLE "public"."Superhero" ALTER COLUMN "images" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "superpowers" SET DEFAULT ARRAY[]::TEXT[];
