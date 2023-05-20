/*
  Warnings:

  - You are about to drop the column `createdAt` on the `ProductsOnOrders` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `ProductsOnOrders` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "Cart" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProductsOnCarts" (
    "cartId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,

    PRIMARY KEY ("cartId", "productId"),
    CONSTRAINT "ProductsOnCarts_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProductsOnCarts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProductsOnOrders" (
    "quantity" INTEGER NOT NULL,
    "orderId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "pricePerUnit" DECIMAL NOT NULL,

    PRIMARY KEY ("orderId", "productId"),
    CONSTRAINT "ProductsOnOrders_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProductsOnOrders_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProductsOnOrders" ("orderId", "pricePerUnit", "productId", "quantity") SELECT "orderId", "pricePerUnit", "productId", "quantity" FROM "ProductsOnOrders";
DROP TABLE "ProductsOnOrders";
ALTER TABLE "new_ProductsOnOrders" RENAME TO "ProductsOnOrders";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Cart_userId_key" ON "Cart"("userId");
