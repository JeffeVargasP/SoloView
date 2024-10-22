import express, { Router } from "express";
import { getSensorByUserId } from "../controllers/sensor/getByUserId";
import { getSensor } from "../controllers/sensor/getAll";
import { getSensorById } from "../controllers/sensor/getById";
import { registerSensor } from "../controllers/sensor/registerSensor";

export const sensorRoutes: Router = Router();

sensorRoutes.use("/", getSensorByUserId);
sensorRoutes.use("/", getSensorById);
sensorRoutes.use("/", getSensor);
sensorRoutes.use("/", registerSensor);