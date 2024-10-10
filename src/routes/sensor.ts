import express, { Router } from "express";
import { createEspData } from "../controllers/sensor/create";
import { getSensorByUserId } from "../controllers/sensor/getByUserId";

export const sensorRoutes: Router = Router();

sensorRoutes.use("/sensor", getSensorByUserId);
sensorRoutes.use("/data", createEspData);