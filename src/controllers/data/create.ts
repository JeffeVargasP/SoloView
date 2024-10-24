import express, { Express, Request, Response, NextFunction } from "express";
import { database } from "../../../database";

export const createSensorData: Express = express();

createSensorData.post("/", async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { sensorId, temperature, humidity } = req.body;

    if (!sensorId) {
        return res.status(400).json({

            message: "Bad Request: sensorId is required!",

        });
    }

    try {

        const data = await database.data.create({
            data: {
                sensorId,
                temperature,
                humidity,
            },
        });
        res.status(200).json(data);

    } catch (error) {

        res.status(500).json(error);

    }
});

