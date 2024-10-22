import express, { Express, Request, Response } from "express";
import { database } from "../../../database";

export const getDataByUserId: Express = express();

getDataByUserId.get("/user/id/:user_id", async (req: Request, res: Response) => {
    const userId = req.params.user_id;

    try {
        if (!userId) {

            res.status(400).json({
                message: "user_id is required"
            });

        } else {

            const sensorIds = await database.sensor.findMany({
                where: { userId: parseInt(userId) },
            });

            if (!sensorIds) {

                res.status(404).json({
                    message: "Sensor not found"
                });

            }

            const sensorData = await database.data.findMany({
                where: {
                    sensorId: {
                        in: sensorIds.map((sensor) => sensor.id),
                    },
                },
            });

            res.status(200).json(sensorData);
               
        }
    } catch (error) {

        res.status(500).json(error);

    }
});
