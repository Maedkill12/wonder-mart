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
  const products = await prisma.product.findMany({
    skip,
    take: +limit,
    include: { category: true },
  });
  res.json({ products });
};

const getProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await prisma.product.findUnique({
    where: { id: +id },
    include: { category: true },
  });
  if (!product) {
    return res.status(404).json({ error: "Product doesn't exist" });
  }
  res.json({ product });
};

const createProduct = async (req: Request, res: Response) => {
  const { name, description, price, quantity, imageURL, categoryId } = req.body;
  if (!name) {
    return res.status(400).json({ error: "name field is required" });
  }
  if (!description) {
    return res.status(400).json({ error: "description field is required" });
  }
  if (!price) {
    return res.status(400).json({ error: "price field is required" });
  }
  if (!quantity) {
    return res.status(400).json({ error: "quantity field is required" });
  }
  if (!categoryId) {
    return res.status(400).json({ error: "categoryId field is required" });
  }
  const product = await prisma.product.create({
    data: {
      name,
      description,
      price,
      quantity,
      imageURL,
      category: {
        connect: { id: categoryId },
      },
    },
  });
  if (!product) {
    return res.status(400).json({ error: "Couldn't create the product" });
  }
  res.json({ product });
};

const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, price, quantity, imageURL, categoryId } = req.body;
  const updateObj: {
    name?: string;
    description?: string;
    price?: number;
    imageURL?: string;
    categoryId?: number;
    quantity?: number;
  } = {};
  if (name) {
    updateObj.name = name;
  }
  if (description) {
    updateObj.description = description;
  }
  if (price) {
    updateObj.price = price;
  }
  if (quantity) {
    updateObj.quantity = quantity;
  }
  if (imageURL) {
    updateObj.imageURL = imageURL;
  }
  if (categoryId) {
    updateObj.categoryId = categoryId;
  }
  const product = await prisma.product.update({
    where: { id: +id },
    data: updateObj,
    include: { category: true },
  });

  if (!product) {
    return res.status(400).json({ error: "Couldn't update the product" });
  }

  res.json({ product });
};

const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await prisma.product.delete({ where: { id: +id } });
  if (!product) {
    return res.status(404).json({ error: "Product doesn't exist" });
  }
  res.json({ product });
};

export {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
