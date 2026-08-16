-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_VisitRecord" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sessionId" TEXT NOT NULL DEFAULT '',
    "ip" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "lastPath" TEXT,
    "pages" TEXT,
    "pageCount" INTEGER NOT NULL DEFAULT 1,
    "referer" TEXT,
    "userAgent" TEXT,
    "country" TEXT,
    "province" TEXT,
    "city" TEXT,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_VisitRecord" ("city", "country", "createdAt", "duration", "id", "ip", "path", "province", "referer", "userAgent") SELECT "city", "country", "createdAt", "duration", "id", "ip", "path", "province", "referer", "userAgent" FROM "VisitRecord";
DROP TABLE "VisitRecord";
ALTER TABLE "new_VisitRecord" RENAME TO "VisitRecord";
CREATE INDEX "VisitRecord_sessionId_updatedAt_idx" ON "VisitRecord"("sessionId", "updatedAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
