-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProductsOnCarts" (
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "cartId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,

    PRIMARY KEY ("cartId", "productId"),
    CONSTRAINT "ProductsOnCarts_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProductsOnCarts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProductsOnCarts" ("cartId", "productId") SELECT "cartId", "productId" FROM "ProductsOnCarts";
DROP TABLE "ProductsOnCarts";
ALTER TABLE "new_ProductsOnCarts" RENAME TO "ProductsOnCarts";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
