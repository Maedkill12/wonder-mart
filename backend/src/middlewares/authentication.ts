import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../constants";
import { AuthRequest } from "../constants/helpers";

const authentication = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res
      .status(401)
      .json({ error: "You are not authorized to access this page." });
  }
  if (!authorization.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "You are not authorized to access this page." });
  }
  const token = authorization.split(" ")[1];
  const decode = jwt.verify(token, JWT_SECRET) as { userId: number };

  req.userId = decode.userId;

  next();
};

export default authentication;
