import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const getAllUsers = async (req: Request, res: Response) => {
  let { page, limit } = req.query;
  if (!page) {
    page = "1";
  }
  if (!limit) {
    limit = "5";
  }
  const skip = +limit * (+page - 1);
  const users = await prisma.user.findMany({
    skip,
    take: +limit,
    select: { password: false, name: true, email: true },
  });
  res.json({ users });
};

const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: { id: +id },
    select: { password: false, name: true, email: true },
  });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json({ user });
};

const createUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name) {
    return res.status(400).json({ error: "name field is required" });
  }
  if (!email) {
    return res.status(400).json({ error: "email field is required" });
  }
  if (!password) {
    return res.status(400).json({ error: "password field is required" });
  }
  const hash = bcrypt.hashSync(password);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hash,
    },
    select: { password: false, name: true, email: true },
  });
  if (!user) {
    return res.status(400).json({ error: "Couldn't create user" });
  }
  res.status(201).json({ user });
};

const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, password } = req.body;
  const updateObj: { name?: string; email?: string; password?: string } = {};
  if (name) {
    updateObj.name = name;
  }
  if (email) {
    updateObj.email = email;
  }
  if (password) {
    updateObj.password = bcrypt.hashSync(password);
  }
  const user = await prisma.user.update({
    where: { id: +id },
    data: updateObj,
    select: { password: false, name: true, email: true },
  });
  if (!user) {
    return res.status(400).json({ error: "Couldn't update user" });
  }
  res.status(201).json({ user });
};

const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await prisma.user.delete({
    where: { id: +id },
    select: { password: false, name: true, email: true },
  });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.status(201).json({ user });
};

export { getAllUsers, getUser, createUser, updateUser, deleteUser };
