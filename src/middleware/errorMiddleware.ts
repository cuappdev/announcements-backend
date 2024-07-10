import { NextFunction, Request, Response } from "express";
import { ValidateError } from "tsoa";
import { InvalidArgumentError } from "../utils/errors";

export const errorMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  if (err instanceof ValidateError) {
    console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
    return res.status(422).json({
      name: "Validation Failed",
      details: err?.fields,
    });
  }

  // User input error
  if (err instanceof InvalidArgumentError) {
    console.error(`${err.name}: ${err.message}`);
    return res.status(400).json({
      name: err.name,
      details: err.message,
    });
  }

  // Handle all other errors
  if (err instanceof Error) {
    console.error(err);
    return res.status(500).json({
      name: err.name,
      details: err.message,
    });
  }

  next();
};
