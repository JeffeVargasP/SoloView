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

            const sensorId = await database.sensor.findFirst({
                where: { userId: parseInt(userId) },
            });

            if (!sensorId) {

                res.status(404).json({
                    message: "Sensor not found"
                });

            } else {

                const sensorData = await database.data.findMany({
                    where: { sensorId: sensorId.id }
                });

                res.status(200).json(sensorData);

            }

        }
    } catch (error) {

        res.status(500).json(error);

    }
});