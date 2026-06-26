-- CreateTable Ministry
CREATE TABLE IF NOT EXISTS "Ministry" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "leaderName" TEXT NOT NULL,
  "leaderRole" TEXT,
  "leaderImage" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Ministry_id_idx" ON "Ministry"("id");
