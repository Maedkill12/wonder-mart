import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

const errorHandler = (
  err: ErrorRequestHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err);
  res.status(500).json({ error: "Unexpected error, try again or later" });
};

export default errorHandler;
