import { User } from "@prisma/client";
import prisma from "../utils/db";
import e, { NextFunction, Request, Response } from "express";
import { ProjectError } from "./errors";

//export interface ExtRequest extends Request {
//user: User;
//}   "include": ["./**/*.ts"],
declare module "express-serve-static-core" {
  interface Request {
    user: User;
  }
}

export const getProducts = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      include: {
        products: true,
      },
    });
    if (!user) {
      throw new ProjectError({
        type: "PRODUCT_NOT_FOUND_ERROR",
        message: "The usewr what",
        cause: e,
      });
    }
    res.json({ data: user.products });
  } catch (e) {
    throw new ProjectError({
      type: "PRODUCT_NOT_FOUND_ERROR",
      message: "The user has no products, create a new product",
      cause: e,
    });
  }
};

// Get one product
export const getSingleProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await prisma.product.findFirst({
      where: {
        id: req.params.id,
        belongsToId: req.user.id,
      },
    });
    if (!product) {
      next(
        new ProjectError({
          type: "PRODUCT_NOT_FOUND_ERROR",
          message: "Product not found, invalid product ID",
        })
      );
    }
    res.json({ data: product });
  } catch (e) {
    next(
      new ProjectError({
        type: "PRODUCT_NOT_FOUND_ERROR",
        message: "Product not found, try again",
        cause: e,
      })
    );
  }
};

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const product = await prisma.product.create({
      data: {
        name: req.body.name,
        belongsToId: req.user.id,
      },
    });

    res.json({ data: product });
  } catch (e) {
    next(
      new ProjectError({
        type: "PRODUCT_NOT_CREATED_ERROR",
        message: "Product could not be created, try again",
        cause: e,
      })
    );
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updated = await prisma.product.update({
      where: {
        id_belongsToId: {
          id: req.params.id,
          belongsToId: req.user.id,
        },
      },
      data: {
        name: req.body.name,
      },
    });
    if (!updated) {
      next(
        new ProjectError({
          type: "PRODUCT_NOT_UPDATED_ERROR",
          message: "Product with this ID cannot be changed",
        })
      );
    }
    res.json({ data: updated });
  } catch (e) {
    next(
      new ProjectError({
        type: "PRODUCT_NOT_UPDATED_ERROR",
        message: "Product could not be updated, try again",
        cause: e,
      })
    );
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const deleted = await prisma.product.delete({
      where: {
        id_belongsToId: {
          id: req.params.id,
          belongsToId: req.user.id,
        },
      },
    });
    if (!deleted) {
      next(
        new ProjectError({
          type: "PRODUCT_NOT_DELETED_ERROR",
          message: "Product with this id cannot be deleted",
        })
      );
    }
    res.json({ data: deleted });
  } catch (error) {
    next(
      new ProjectError({
        type: "PRODUCT_NOT_DELETED_ERROR",
        message: "Product could not be deleted, try again",
        cause: e,
      })
    );
  }
};
