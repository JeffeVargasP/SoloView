import express, { Express, Request, Response, NextFunction } from "express";
import { database } from "../../../database";

export const createSensorData: Express = express();

createSensorData.post("/", async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { sensorId, temperatura, umidade } = req.body;

    if (!sensorId) {
        return res.status(400).json({

            message: "Bad Request: sensorId is required!",

        });
    }

    try {

        const data = await database.data.create({
            data: {
                sensorId,
                temperature: temperatura,
                humidity: umidade,
            },
        });
        res.status(200).json(data);

    } catch (error) {

        res.status(500).json(error);

    }
});

