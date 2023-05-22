import { Prisma, PrismaClient } from "@prisma/client";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_EXPIRATION, JWT_SECRET } from ".";
import { Request } from "express";

const prisma = new PrismaClient();

export const groupProducts = async (
  productIds: number[]
): Promise<ProductsOnOrders[]> => {
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  const quantityProductMap: { productId?: number; quantity?: number } = {};

  productIds.forEach((id) => {
    quantityProductMap[id] = (quantityProductMap[id] ?? 0) + 1;
  });

  return Object.entries(quantityProductMap).map(([productId, quantity]) => {
    const product = products.find((p) => p.id === +productId);
    const result: ProductsOnOrders = {
      productId: +productId,
      quantity,
      pricePerUnit: product.price,
    };
    return result;
  });
};

export const getTotalAmount = (products: ProductsOnOrders[]): number => {
  return products.reduce((acc, product) => {
    acc = acc + Number(product.pricePerUnit);
    return acc;
  }, 0);
};

export const deleteProductsOnOrders = async (orderId: number) => {
  await prisma.productsOnOrders.deleteMany({ where: { orderId } });
};

export const generateTrackingNumber = (orderId: number): string => {
  const format = "XXXXXX-NNNN";
  const length = format.length;

  let trackingNumber = "";

  for (let i = 0; i < length; i++) {
    const char = format[i];

    if (char === "X") {
      trackingNumber += String.fromCharCode(
        65 + Math.floor(Math.random() * 26)
      );
    } else if (char === "N") {
      trackingNumber += Math.floor(Math.random() * 10);
    } else {
      trackingNumber += char;
    }
  }

  const uniqueTrackingNumber = `${orderId}-${trackingNumber}`;

  return uniqueTrackingNumber;
};

export const generateRefreshToken = () => {
  return crypto.randomBytes(64).toString("hex");
};

export const generateAccessToken = (userId: number) => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRATION,
  });
};

export interface ProductsOnOrders {
  quantity: number;
  pricePerUnit: Prisma.Decimal;
  productId: number;
}

export interface AuthRequest extends Request {
  userId: number;
}
