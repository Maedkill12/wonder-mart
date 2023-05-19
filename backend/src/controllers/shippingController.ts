import { PrismaClient, Shipping } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

const getShipping = async (req: Request, res: Response) => {
  const { id } = req.params;
  const shipping = await prisma.shipping.findUnique({ where: { id: +id } });
  if (!shipping) {
    return res.status(404).json({ error: "Shipping not found" });
  }
  res.json({ shipping });
};

const updateShipping = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { address, status }: Shipping = req.body;
  const updateObj: { address?: string; status?: string } = {};
  if (address) {
    updateObj.address = address;
  }
  if (status) {
    updateObj.status;
  }
  const shipping = await prisma.shipping.update({
    where: { id: +id },
    data: {
      address,
      status,
    },
  });

  if (!shipping) {
    return res.status(404).json({ error: "Shipping not found" });
  }
  res.json({ shipping });
};

const deleteShipping = async (req: Request, res: Response) => {
  const { id } = req.params;
  const shipping = await prisma.shipping.delete({ where: { id: +id } });
  if (!shipping) {
    return res.status(404).json({ error: "Shipping not found" });
  }
  res.json({ shipping });
};

export { getShipping, updateShipping, deleteShipping };
