import express, { Router } from "express";
import { getEspData } from "../controllers/esp/getAll";
import { getEspDataById } from "../controllers/esp/getById";
import { getEspDataByUserId } from "../controllers/esp/getByUserId";

export const espRoutes: Router = express.Router();

espRoutes.use("/data", getEspData);
espRoutes.use("/data", getEspDataById);
espRoutes.use("/data", getEspDataByUserId);