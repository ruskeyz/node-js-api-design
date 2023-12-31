import express from "express";
import router from "./router";
import morgan from "morgan";
import { protect } from "./utils/auth";
import { createNewUser, signin } from "./handlers/user";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/user", createNewUser);
app.post("/signin", signin);

app.use("/api", protect, router);

export default app;
