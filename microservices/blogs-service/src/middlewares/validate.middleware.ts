import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validateBody = (schema: ZodSchema<any>) => (req: Request, res: Response, next: NextFunction) => {
  try {
    // parse and replace req.body with parsed object
    req.body = schema.parse(req.body);
    next();
  } catch (err: any) {
    return res.status(400).json({ message: "Validation failed", errors: err.errors ?? err });
  }
};
