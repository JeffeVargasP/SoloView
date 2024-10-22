import express, { Express, Request, Response } from "express";
import { database } from "../../../database";

export const getSensorById: Express = express();

getSensorById.get("/sensor/id/:sensor_id", async (req: Request, res: Response) => {
    const sensorId = +req.params.sensor_id;

    try {
        if (!sensorId) {
            res.status(400).json({
                message: "sensor_id is required",
            });
        } else {

            const data = await database.sensor.findMany({
                where: { id: sensorId },

            });

            if (data.length === 0 || data === undefined) {
                res.status(404).json({ message: "No data found" });
            } else {
                res.status(200).json(data);
            }
        }
    } catch (error) {
        res.status(500).json(error);
    }
});
