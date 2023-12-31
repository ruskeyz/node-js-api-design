import { body } from "express-validator";

export const validateUpdateProductInput = () => {
  body("title").optional(),
    body("body").optional(),
    body("status").isIn(["IN_PROGRESS", "SHIPPED", "DEPRECATED"]),
    body("version").optional();
};

export const validateUpdatePointInput = () => {
  body("name").exists().isString(),
    body("description").exists().isString(),
    body("updateId").exists().isString();
};
