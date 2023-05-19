import { Order, Payment, PrismaClient, Shipping } from "@prisma/client";
import { Request, Response } from "express";
import {
  deleteProductsOnOrders,
  groupProducts,
  uploadProductsOnOrders,
} from "../constants/helpers";

const prisma = new PrismaClient();

const getAllOrders = async (req: Request, res: Response) => {
  let { page, limit } = req.query;
  if (!page) {
    page = "1";
  }
  if (!limit) {
    limit = "5";
  }
  const skip = +limit * (+page - 1);
  const orders = await prisma.order.findMany({
    skip,
    take: +limit,
    include: { products: { select: { productId: true, quantity: true } } },
  });
  res.json({ orders });
};

const getOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const order = await prisma.order.findUnique({
    where: { id: +id },
    include: { products: { select: { productId: true, quantity: true } } },
  });
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }
  res.json({ order });
};

const createOrder = async (req: Request, res: Response) => {
  const { userId }: Order = req.body;
  const { paymentMethod }: Payment = req.body;
  const { address }: Shipping = req.body;
  const { products }: { products: number[] } = req.body;
  if (!userId) {
    return res.status(400).json({ error: "userId field is required" });
  }
  if (!paymentMethod) {
    return res.status(400).json({ error: "paymentMethod field is required" });
  }
  if (!address) {
    return res.status(400).json({ error: "address field is required" });
  }
  if (!products) {
    return res.status(400).json({ error: "products field is required" });
  }
  const order = await prisma.order.create({
    data: {
      date: new Date(),
      user: {
        connect: { id: userId },
      },
    },
    include: { products: { select: { productId: true, quantity: true } } },
  });
  if (!order) {
    return res.status(400).json({ error: "Couldn't create the error" });
  }
  const groupedProducts = groupProducts(products);
  await uploadProductsOnOrders(groupedProducts, order.id);

  // Create payment

  // Create shipping

  res.status(201).json({ order });
};

const updateOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId }: Order = req.body;
  const { paymentMethod }: Payment = req.body;
  const { address }: Shipping = req.body;
  const { products }: { products: number[] } = req.body;

  const updateObj: { userId?: number } = {};
  if (userId) {
    updateObj.userId = userId;
  }
  if (products) {
    const groupedProducts = groupProducts(products);
    await deleteProductsOnOrders(+id);
    await uploadProductsOnOrders(groupedProducts, +id);
  }
  const order = await prisma.order.update({
    where: { id: +id },
    data: updateObj,
    include: { products: { select: { productId: true, quantity: true } } },
  });
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }
  res.json({ order });
};

const deleteOrder = async (req: Request, res: Response) => {
  const { id } = req.params;
  const order = await prisma.order.delete({
    where: { id: +id },
    include: { products: { select: { productId: true, quantity: true } } },
  });
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }
  res.json({ order });
};

export { getAllOrders, getOrder, createOrder, updateOrder, deleteOrder };
