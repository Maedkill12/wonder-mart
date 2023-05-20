import { PrismaClient, User } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../constants/helpers";

const prisma = new PrismaClient();
const REFRESH_TOKEN_EXPIRATION = process.env.REFRESH_TOKEN_EXPIRATION || 15; // in minutes

const singup = async (req: Request, res: Response) => {
  const { name, email, password }: User = req.body;
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
      cart: {
        create: {},
      },
    },
    select: {
      password: false,
      name: true,
      email: true,
      cart: { select: { id: true } },
    },
  });
  if (!user) {
    return res.status(400).json({ error: "Couldn't create user" });
  }
  res.status(201).json({ user });
};

const login = async (req: Request, res: Response) => {
  const { email, password }: User = req.body;
  if (!email) {
    return res.status(400).json({ error: "email field is required" });
  }
  if (!password) {
    return res.status(400).json({ error: "password field is required" });
  }
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(404).json({ error: "Email or password are not valid" });
  }
  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return res.status(404).json({ error: "Email or password are not valid" });
  }
  const refreshToken = generateRefreshToken();
  const hashToken = bcrypt.hashSync(refreshToken);
  const accessToken = generateAccessToken(user.id);
  const expiration = new Date(
    Date.now() + +REFRESH_TOKEN_EXPIRATION * 60 * 1000
  );
  const token = await prisma.token.findUnique({ where: { userId: user.id } });
  if (!token) {
    await prisma.token.create({
      data: {
        expiration,
        token: hashToken,
        userId: user.id,
      },
    });
  } else {
    await prisma.token.update({
      where: { id: token.id },
      data: {
        expiration,
        token: hashToken,
        valid: true,
      },
    });
  }
  res.cookie("refreshToken", refreshToken, {
    secure: false,
    httpOnly: true,
    expires: expiration,
  });
  res.json({ accessToken });
};

const refresh = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: "userId field is required" });
  }
  if (!refreshToken) {
    return res.status(400).json({ error: "Invalid token or userId" });
  }
  const token = await prisma.token.findUnique({ where: { userId } });
  if (!token) {
    return res.status(400).json({ error: "Invalid token or userId" });
  }
  const isTokenValid = bcrypt.compareSync(refreshToken, token.token);
  if (!isTokenValid) {
    return res.status(400).json({ error: "Invalid token or userId" });
  }
  const currentDate = new Date();
  if (currentDate > token.expiration || !token.valid) {
    return res.status(400).json({ error: "Session has expired" });
  }
  const accessToken = generateAccessToken(userId);
  res.json({ accessToken });
};

export { singup, login, refresh };
