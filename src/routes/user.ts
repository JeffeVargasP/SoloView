import express, { Router } from "express";
import { createUser } from "../controllers/user/create";
import { loginUser } from "../controllers/user/login";
import { findAll } from "../controllers/user/findAll";
import { findOne } from "../controllers/user/findOne";
import { updateUser } from "../controllers/user/update";

export const userRoutes: Router = express.Router();

userRoutes.use("/", findAll);
userRoutes.use("id/:id", findOne);
userRoutes.use("/register", createUser);
userRoutes.use("/login", loginUser);
userRoutes.use("/update", updateUser);