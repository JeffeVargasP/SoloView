import express, { Router } from "express";
import { getEspData } from "../controllers/esp/getAll";
import { getEspDataById } from "../controllers/esp/getById";

export const espRoutes: Router = express.Router();

espRoutes.use("/data", getEspData);
espRoutes.use("/data", getEspDataById);