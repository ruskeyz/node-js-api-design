import { Request, Response, NextFunction } from "express";

type ErrorName =
  | "USER_NOT_FOUND_ERROR"
  | "PRODUCT_NOT_FOUND_ERROR"
  | "PRODUCT_NOT_CREATED_ERROR"
  | "PRODUCT_NOT_UPDATED_ERROR"
  | "PRODUCT_NOT_DELETED_ERROR"
  | "AUTH_FAIL_ERROR";

export class ProjectError extends Error {
  type: ErrorName;
  message: string;
  cause: any;

  constructor({
    type,
    message,
    cause,
  }: {
    type: ErrorName;
    message: string;
    cause?: any;
  }) {
    super();
    this.type = type;
    this.message = message;
    this.cause = cause;
  }
}

export const errorHandler = (
  error: ProjectError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error.type === "PRODUCT_NOT_FOUND_ERROR") {
    console.log("Alert the authorities");
  }
  console.log("Path: ", req.path);
  console.log(`${error.type}: ${error.cause}`);

  res.status(500).json({ message: error.message });
};
