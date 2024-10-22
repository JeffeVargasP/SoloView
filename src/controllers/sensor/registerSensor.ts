import express, { Express, Request, Response, NextFunction } from "express";
import { database } from "../../../database";

export const registerSensor: Express = express();

registerSensor.post("/", async (req: Request, res: Response, next: NextFunction): Promise<any> => {

    const { userId, model } = req.body;

    if (!userId || !model) {
        return res.status(400).json({
            message: "Bad Request: userId and model are required!",
        });
    }

    try {

        const sensor = await database.sensor.create({
            data: {
                userId,
                model,
            },
        });
        res.status(200).json(sensor);
    } catch (error) {
        res.status(500).json(error);
    }

});

