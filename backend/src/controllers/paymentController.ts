import { Payment, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { AuthRequest } from "../constants/helpers";

const prisma = new PrismaClient();

const getPayment = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { userId } = req;
  const payment = await prisma.payment.findUnique({
    include: { order: true },
    where: { id: +id },
  });
  if (!payment || payment.order.userId !== userId) {
    return res.status(404).json({ error: "Payment not found" });
  }
  res.json({ payment });
};

const updatePayment = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { userId } = req;
  const { paymentStatus, paypalEmail, transactionId }: Payment = req.body;

  const payment = await prisma.payment.findUnique({
    where: { id: +id },
    include: { order: true },
  });

  if (!payment || payment.order.userId !== userId) {
    return res.status(404).json({ error: "Payment not found" });
  }

  const updateObj: {
    paymentStatus?: string;
    paypalEmail?: string;
    transactionId?: string;
  } = {};
  if (paymentStatus) {
    updateObj.paymentStatus = paymentStatus;
  }
  if (paypalEmail) {
    updateObj.paypalEmail = paypalEmail;
  }
  if (transactionId) {
    updateObj.transactionId = transactionId;
  }
  const result = await prisma.payment.update({
    where: { id: +id },
    data: updateObj,
  });
  res.json({ payment: result });
};

const deletePayment = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { userId } = req;

  const payment = await prisma.payment.findUnique({
    where: { id: +id },
    include: { order: true },
  });
  if (!payment || payment.order.userId !== userId) {
    return res.status(404).json({ error: "Payment not found" });
  }

  const result = await prisma.payment.delete({
    where: { id: +id },
  });
  res.json({ payment: result });
};

export { getPayment, updatePayment, deletePayment };
