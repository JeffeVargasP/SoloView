import express, { Router } from "express";
import { getSensor } from "../controllers/sensor/getAll";
import { getSensorById } from "../controllers/sensor/getById";
import { getSensorDataByUserId } from "../controllers/sensor/getByUserId";

export const dataRoutes: Router = express.Router();

dataRoutes.use("/data", getEspData);
dataRoutes.use("/data", getEspDataById);
dataRoutes.use("/data", getSensorDataByUserId);