import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Request, Response, NextFunction } from "express";

type ErrorName =
  | "USER_NOT_FOUND_ERROR"
  | "PRODUCT_NOT_FOUND_ERROR"
  | "PRODUCT_NOT_CREATED_ERROR"
  | "PRODUCT_NOT_UPDATED_ERROR"
  | "PRODUCT_NOT_DELETED_ERROR"
  | "SIGN_IN_FAIL_ERROR"
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
  if (error instanceof PrismaClientKnownRequestError) {
    console.log("ERROR CODE:", error.code);
    if (error.code === "P2002") {
      res.status(400).json({ message: "Username must be unique" });
    }
  }
  console.log("Path: ", req.path);
  console.log(`${error.type}: ${error.cause}`);

  res.status(500).json({ message: error.message });
};
