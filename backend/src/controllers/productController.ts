import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

const getAllProducts = async (req: Request, res: Response) => {
  let { page, limit } = req.query;
  if (!page) {
    page = "1";
  }
  if (!limit) {
    limit = "5";
  }
  const skip = +limit * (+page - 1);
  const products = await prisma.product.findMany({ skip, take: +limit });
  res.json(products);
};

const getProduct = (req: Request, res: Response) => {
  res.json("Single product");
};

const createProduct = (req: Request, res: Response) => {
  res.json("Create product");
};

const updateProduct = (req: Request, res: Response) => {
  res.json("Update product");
};

const deleteProduct = (req: Request, res: Response) => {
  res.json("Delete product");
};

export {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
