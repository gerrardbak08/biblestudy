ALTER TABLE "learners"
ADD COLUMN IF NOT EXISTS "institution" TEXT;

UPDATE "learners"
SET "institution" = '외부or기타'
WHERE "institution" IS NULL;
