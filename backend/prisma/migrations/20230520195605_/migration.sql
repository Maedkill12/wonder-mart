-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Token" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "token" TEXT NOT NULL,
    "expiration" DATETIME NOT NULL,
    "valid" BOOLEAN NOT NULL DEFAULT true,
    "userId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Token" ("createdAt", "expiration", "id", "token", "updatedAt", "userId", "valid") SELECT "createdAt", "expiration", "id", "token", "updatedAt", "userId", "valid" FROM "Token";
DROP TABLE "Token";
ALTER TABLE "new_Token" RENAME TO "Token";
CREATE UNIQUE INDEX "Token_token_key" ON "Token"("token");
CREATE UNIQUE INDEX "Token_userId_key" ON "Token"("userId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
