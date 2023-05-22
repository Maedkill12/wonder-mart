import { Order, Payment, Prisma, PrismaClient, Shipping } from "@prisma/client";
import { Request, Response } from "express";
import {
  AuthRequest,
  ProductsOnOrders,
  deleteProductsOnOrders,
  generateTrackingNumber,
  getTotalAmount,
  groupProducts,
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
    include: {
      products: {
        select: { productId: true, quantity: true, pricePerUnit: true },
      },
    },
  });
  res.json({ orders });
};

const getOrder = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { userId } = req;
  const order = await prisma.order.findUnique({
    where: { id: +id },
    include: {
      products: {
        select: { productId: true, quantity: true, pricePerUnit: true },
      },
      payment: true,
      shipping: true,
    },
  });
  if (!order || order.userId !== userId) {
    return res.status(404).json({ error: "Order not found" });
  }
  res.json({ order });
};

const createOrder = async (req: AuthRequest, res: Response) => {
  const { userId } = req;
  const { paypalEmail }: Payment = req.body;
  const { address }: Shipping = req.body;
  const { products }: { products: number[] } = req.body;
  if (!userId) {
    return res.status(400).json({ error: "userId field is required" });
  }
  if (!paypalEmail) {
    return res.status(400).json({ error: "paypalEmail field is required" });
  }
  if (!address) {
    return res.status(400).json({ error: "address field is required" });
  }
  if (!products) {
    return res.status(400).json({ error: "products field is required" });
  }

  const groupedProduct = await groupProducts(products);
  const totalAmount = getTotalAmount(groupedProduct);

  const order = await prisma.order.create({
    data: {
      user: {
        connect: { id: userId },
      },
      products: {
        create: groupedProduct,
      },
      payment: {
        create: {
          paypalEmail,
          amount: totalAmount,
        },
      },
    },
    include: {
      products: {
        select: { productId: true, quantity: true, pricePerUnit: true },
      },
    },
  });
  if (!order) {
    return res.status(400).json({ error: "Couldn't create the error" });
  }

  const trackingNumber = generateTrackingNumber(order.id);
  await prisma.shipping.create({
    data: {
      trackingNumber,
      orderId: order.id,
    },
  });

  res.status(201).json({ order });
};

const updateOrder = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { userId } = req;
  const { products }: { products: number[] } = req.body;

  const order = await prisma.order.findUnique({ where: { id: +id } });
  if (!order || order.userId !== userId) {
    return res.status(404).json({ error: "Order not found" });
  }

  const updateObj: {
    userId?: number;
    products?: { create: ProductsOnOrders[] };
    payment?: { update: { amount: number } };
  } = {};
  if (userId) {
    updateObj.userId = userId;
  }
  if (products) {
    await deleteProductsOnOrders(+id);
    const groupedProducts = await groupProducts(products);
    const totalAmount = getTotalAmount(groupedProducts);
    updateObj.products = { create: groupedProducts };
    updateObj.payment = { update: { amount: totalAmount } };
  }

  await prisma.order.update({
    where: { id: +id },
    data: { ...updateObj },
    include: {
      products: {
        select: { productId: true, quantity: true, pricePerUnit: true },
      },
    },
  });
  res.json({ order });
};

const deleteOrder = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { userId } = req;
  const order = await prisma.order.findUnique({ where: { id: +id } });
  if (!order || order.id !== userId) {
    return res.status(404).json({ error: "Order not found" });
  }
  await deleteProductsOnOrders(+id);
  await prisma.order.delete({
    where: { id: +id },
    include: { products: { select: { productId: true, quantity: true } } },
  });

  res.json({ order });
};

export { getAllOrders, getOrder, createOrder, updateOrder, deleteOrder };
