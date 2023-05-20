import { PrismaClient, ProductsOnCarts } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

const getCart = async (req: Request, res: Response) => {
  const { id } = req.params;
  const cart = await prisma.cart.findUnique({
    where: { id: +id },
    include: { products: true },
  });
  if (!cart) {
    return res.status(404).json({ error: "Cart not found" });
  }
  res.json({ cart });
};

const addItem = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { productId, quantity }: ProductsOnCarts = req.body;
  if (!productId) {
    return res.status(400).json({ error: "productId field is required" });
  }
  if (!quantity) {
    return res.status(400).json({ error: "quantity field is required" });
  }
  const product = await prisma.productsOnCarts.create({
    data: {
      cart: { connect: { id: +id } },
      product: { connect: { id: productId } },
      quantity,
    },
  });
  res.json({ product });
};

const updateItem = async (req: Request, res: Response) => {
  const { quantity }: ProductsOnCarts = req.body;
  if (quantity === 0) {
    await deleteItem(req, res);
    return;
  }
  const { cartId, productId } = req.params;
  const product = await prisma.productsOnCarts.update({
    where: { cartId_productId: { cartId: +cartId, productId: +productId } },
    data: {
      quantity,
    },
  });
  res.json({ product });
};

const deleteItem = async (req: Request, res: Response) => {
  const { cartId, productId } = req.params;
  const product = await prisma.productsOnCarts.delete({
    where: { cartId_productId: { cartId: +cartId, productId: +productId } },
  });
  return res.json({ product });
};

const clearCart = async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.productsOnCarts.deleteMany({ where: { cartId: +id } });
  res.sendStatus(200);
};

export { getCart, addItem, updateItem, deleteItem, clearCart };
