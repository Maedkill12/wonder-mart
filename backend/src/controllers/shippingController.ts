import { PrismaClient, Shipping } from "@prisma/client";
import { Request, Response } from "express";
import { AuthRequest } from "../constants/helpers";

const prisma = new PrismaClient();

const getShipping = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { userId } = req;
  const shipping = await prisma.shipping.findUnique({
    where: { id: +id },
    include: { order: true },
  });
  if (!shipping || shipping.order.userId !== userId) {
    return res.status(404).json({ error: "Shipping not found" });
  }
  res.json({ shipping });
};

const updateShipping = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { userId } = req;
  const { address, status }: Shipping = req.body;

  const shipping = await prisma.shipping.findUnique({
    where: { id: +id },
    include: { order: true },
  });

  if (!shipping || shipping.order.id !== userId) {
    return res.status(404).json({ error: "Shipping not found" });
  }

  const updateObj: { address?: string; status?: string } = {};
  if (address) {
    updateObj.address = address;
  }
  if (status) {
    updateObj.status;
  }

  const result = await prisma.shipping.update({
    where: { id: +id },
    data: {
      address,
      status,
    },
  });
  res.json({ shipping: result });
};

const deleteShipping = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { userId } = req;
  const shipping = await prisma.shipping.findUnique({
    where: { id: +id },
    include: { order: true },
  });

  if (!shipping || shipping.order.userId !== userId) {
    return res.status(404).json({ error: "Shipping not found" });
  }

  const result = await prisma.shipping.delete({ where: { id: +id } });

  res.json({ shipping: result });
};

export { getShipping, updateShipping, deleteShipping };
