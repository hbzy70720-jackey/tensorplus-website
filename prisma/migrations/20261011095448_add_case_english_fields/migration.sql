-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CaseStudy" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT NOT NULL,
    "coverImage" TEXT,
    "industry" TEXT,
    "customer" TEXT,
    "deliveryDate" TEXT,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "titleEn" TEXT,
    "descriptionEn" TEXT,
    "contentEn" TEXT,
    "customerEn" TEXT,
    "industryEn" TEXT,
    "tagsEn" TEXT NOT NULL DEFAULT '[]'
);
INSERT INTO "new_CaseStudy" ("content", "coverImage", "createdAt", "customer", "deliveryDate", "description", "id", "industry", "published", "slug", "tags", "title", "updatedAt") SELECT "content", "coverImage", "createdAt", "customer", "deliveryDate", "description", "id", "industry", "published", "slug", "tags", "title", "updatedAt" FROM "CaseStudy";
DROP TABLE "CaseStudy";
ALTER TABLE "new_CaseStudy" RENAME TO "CaseStudy";
CREATE UNIQUE INDEX "CaseStudy_slug_key" ON "CaseStudy"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
