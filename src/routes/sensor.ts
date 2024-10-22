import express, { Router } from "express";
import { createSensorData } from "../controllers/data/create";
import { getSensorByUserId } from "../controllers/data/getByUserId";

export const sensorRoutes: Router = Router();

sensorRoutes.use("/", getSensorByUserId);
sensorRoutes.use("/", createSensorData);