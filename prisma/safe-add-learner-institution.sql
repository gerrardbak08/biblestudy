ALTER TABLE "learners"
ADD COLUMN IF NOT EXISTS "institution" TEXT;

UPDATE "learners"
SET "institution" = '미등록'
WHERE "institution" IS NULL;
