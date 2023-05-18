import { Request, Response } from "express";

const getAllProducts = (req: Request, res: Response) => {
  res.json("All products");
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
