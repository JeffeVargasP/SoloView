import express, { Router } from "express";
import { getDataByUserId } from "../controllers/data/getByUserId";
import { createSensorData } from "../controllers/data/create";

export const dataRoutes: Router = express.Router();

dataRoutes.use("/", getDataByUserId);
dataRoutes.use("/", createSensorData);