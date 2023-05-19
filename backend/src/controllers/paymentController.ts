import { Payment, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

const getPayment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const payment = await prisma.payment.findUnique({ where: { id: +id } });
  if (!payment) {
    return res.status(404).json({ error: "Payment not found" });
  }
  res.json({ payment });
};

const updatePayment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { paymentStatus, paypalEmail, transactionId }: Payment = req.body;
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
  const payment = await prisma.payment.update({
    where: { id: +id },
    data: updateObj,
  });
  if (!payment) {
    return res.status(404).json({ error: "Payment not found" });
  }
  res.json({ payment });
};

const deletePayment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const payment = await prisma.payment.delete({ where: { id: +id } });
  if (!payment) {
    return res.status(404).json({ error: "Payment not found" });
  }
  res.json({ payment });
};

export { getPayment, updatePayment, deletePayment };
