import { PrismaClient, ProductsOnCarts } from "@prisma/client";
import { Request, Response } from "express";
import { AuthRequest } from "../constants/helpers";

const prisma = new PrismaClient();

const getCart = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { userId } = req;
  const cart = await prisma.cart.findUnique({
    where: { id: +id },
    include: { products: true, user: true },
  });
  if (!cart || cart.user.id !== userId) {
    return res.status(404).json({ error: "Cart not found" });
  }
  res.json({ cart });
};

const addItem = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { userId } = req;
  const { productId, quantity }: ProductsOnCarts = req.body;

  const cart = await prisma.cart.findUnique({
    where: { id: +id },
    include: { user: true },
  });
  if (!cart || cart.user.id !== userId) {
    return res.status(404).json({ error: "Cart not found" });
  }

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

const updateItem = async (req: AuthRequest, res: Response) => {
  const { quantity }: ProductsOnCarts = req.body;
  const { cartId, productId } = req.params;
  const { userId } = req;

  const cart = await prisma.cart.findUnique({
    where: { id: +cartId },
    include: { user: true },
  });
  if (!cart || cart.user.id !== userId) {
    return res.status(404).json({ error: "Cart not found" });
  }

  if (quantity === 0) {
    await deleteItem(req, res);
    return;
  }

  const product = await prisma.productsOnCarts.update({
    where: { cartId_productId: { cartId: +cartId, productId: +productId } },
    data: {
      quantity,
    },
  });
  res.json({ product });
};

const deleteItem = async (req: AuthRequest, res: Response) => {
  const { cartId, productId } = req.params;
  const { userId } = req;

  const cart = await prisma.cart.findUnique({
    where: { id: +cartId },
    include: { user: true },
  });
  if (!cart || cart.user.id !== userId) {
    return res.status(404).json({ error: "Cart not found" });
  }

  const product = await prisma.productsOnCarts.delete({
    where: { cartId_productId: { cartId: +cartId, productId: +productId } },
  });
  return res.json({ product });
};

const clearCart = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { userId } = req;

  const cart = await prisma.cart.findUnique({
    where: { id: +id },
    include: { user: true },
  });
  if (!cart || cart.user.id !== userId) {
    return res.status(404).json({ error: "Cart not found" });
  }
  await prisma.productsOnCarts.deleteMany({ where: { cartId: +id } });
  res.sendStatus(200);
};

export { getCart, addItem, updateItem, deleteItem, clearCart };
