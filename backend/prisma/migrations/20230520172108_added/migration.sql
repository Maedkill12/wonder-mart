/*
  Warnings:

  - You are about to drop the column `crearedAt` on the `Shipping` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Shipping" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "trackingNumber" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "address" TEXT,
    "orderId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Shipping_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Shipping" ("address", "id", "orderId", "status", "trackingNumber") SELECT "address", "id", "orderId", "status", "trackingNumber" FROM "Shipping";
DROP TABLE "Shipping";
ALTER TABLE "new_Shipping" RENAME TO "Shipping";
CREATE UNIQUE INDEX "Shipping_trackingNumber_key" ON "Shipping"("trackingNumber");
CREATE UNIQUE INDEX "Shipping_orderId_key" ON "Shipping"("orderId");
CREATE TABLE "new_ProductsOnOrders" (
    "quantity" INTEGER NOT NULL,
    "orderId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "pricePerUnit" DECIMAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("orderId", "productId"),
    CONSTRAINT "ProductsOnOrders_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProductsOnOrders_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProductsOnOrders" ("orderId", "pricePerUnit", "productId", "quantity") SELECT "orderId", "pricePerUnit", "productId", "quantity" FROM "ProductsOnOrders";
DROP TABLE "ProductsOnOrders";
ALTER TABLE "new_ProductsOnOrders" RENAME TO "ProductsOnOrders";
CREATE TABLE "new_Payment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "amount" DECIMAL,
    "paypalEmail" TEXT,
    "transactionId" TEXT,
    "paymentStatus" TEXT NOT NULL DEFAULT 'Pending',
    "orderId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Payment" ("amount", "createdAt", "id", "orderId", "paymentStatus", "paypalEmail", "transactionId") SELECT "amount", "createdAt", "id", "orderId", "paymentStatus", "paypalEmail", "transactionId" FROM "Payment";
DROP TABLE "Payment";
ALTER TABLE "new_Payment" RENAME TO "Payment";
CREATE UNIQUE INDEX "Payment_orderId_key" ON "Payment"("orderId");
CREATE TABLE "new_Category" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Category" ("id", "name") SELECT "id", "name" FROM "Category";
DROP TABLE "Category";
ALTER TABLE "new_Category" RENAME TO "Category";
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("email", "id", "name", "password") SELECT "email", "id", "name", "password" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE TABLE "new_Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("createdAt", "id", "userId") SELECT "createdAt", "id", "userId" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
CREATE TABLE "new_Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "imageURL" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Product" ("categoryId", "description", "id", "imageURL", "name", "price", "quantity") SELECT "categoryId", "description", "id", "imageURL", "name", "price", "quantity" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
