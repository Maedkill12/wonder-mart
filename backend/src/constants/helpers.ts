import { Order, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const groupProducts = (products: number[]): { [id: string]: number } => {
  return products.reduce((acc, id) => {
    acc[id] = (acc[id] ?? 0) + 1;
    return acc;
  }, {});
};

export const uploadProductsOnOrders = async (
  products: { [id: string]: number },
  orderId: number
) => {
  for (let productId in products) {
    await prisma.productsOnOrders.create({
      data: {
        product: { connect: { id: +productId } },
        quantity: products[productId],
        order: { connect: { id: orderId } },
      },
    });
  }
};

export const deleteProductsOnOrders = async (orderId: number) => {
  await prisma.productsOnOrders.deleteMany({ where: { orderId } });
};
