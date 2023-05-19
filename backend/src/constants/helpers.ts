import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const groupProducts = (products: number[]): ProductsOnOrders[] => {
  return products.reduce((acc: ProductsOnOrders[], id) => {
    const index = acc.findIndex((item) => item.product.connect.id === id);
    if (index === -1) {
      acc.push({ quantity: 1, product: { connect: { id } } });
    } else {
      const product = acc[index];
      product.quantity++;
    }
    return acc;
  }, []);
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

export interface ProductsOnOrders {
  quantity: number;
  product: { connect: { id: number } };
}
